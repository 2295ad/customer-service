require("dotenv");

const { strapiConfig } = require("../../config/strapi.config");
const { fetchMenuItems, fetchShopAddress,fetchCategory, fetchNearbyShops } = require("../../models/shops");

const { STRAPI_URL } = process.env;

const getShopProducts = async (req, res, next) => {
  try {
    const shopId = req.query["shopId"];
    if (!shopId) {
      res.status(400).send({ message: "Please provide shop id" });
    } else {
      const mapCategory = {};
      const data = await Promise.all([
        fetchMenuItems(shopId),
        fetchShopAddress(shopId),
        fetchCategory()
      ]);
      const categories = data[2][0];
      const menuItems = data[0][0];
      categories.map((ele,_)=>mapCategory[ele.category_id]={type:ele.type,drinks:[]});
      menuItems.map((menu,_)=>{
        if(mapCategory[menu.category_id]){
          mapCategory[menu.category_id].drinks.push(menu);
        }
      });
      Object.keys(mapCategory).map((ele,_)=>{
        if(!mapCategory[ele].drinks.length) delete mapCategory[ele];
      })
      const shopDetails = { details: data[1][0][0], categories:mapCategory };
      res.send({ shopDetails, message: "shop data" });
    }
  } catch (error) {
    next(error);
  }
};

const getAllShops = async (req, res, next) => {
  try {
    const {lat,lng} = req.query;
    const getNearbyShops = await fetchNearbyShops(Number(lng),Number(lat));
    if (getNearbyShops[0]?.length && req.client.get(getNearbyShops[0]?.[0]?.shop_id)) {
      const shopDetails = [];
      getNearbyShops[0].forEach((ele)=>{
        const tempDetails = req.client.get(ele.shop_id);
        if(tempDetails){
          shopDetails.push(tempDetails);
        }
      });
      res.send({ result: shopDetails, message: "shop data" });
    } else {
      const { data: result } = await strapiConfig.get("/api/shops?populate=*");
      let responseData = result?.data?.map((ele) => {
        const {
          name,
          description,
          shop_id,
          discount,
          coupons,
          availableCategories,
        } = ele?.attributes;
        return {
          name,
          description,
          shop_id,
          discount,
          coupons,
          availableCategories,
          ...(ele?.attributes?.images?.data?.[0]?.attributes?.url && {
            images: {
              url: `${STRAPI_URL}${ele?.attributes?.images?.data?.[0]?.attributes?.url}`,
              name: ele?.attributes?.images?.data?.[0]?.attributes?.name,
            },
          }),
        };
      });
      responseData.map((ele)=> req.client.set(ele.shop_id,ele));
      res.send({ result: responseData, message: "shop data" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShopProducts,
  getAllShops,
};
