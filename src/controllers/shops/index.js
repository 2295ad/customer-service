require("dotenv");

const { strapiConfig } = require("../../config/strapi.config");
const { fetchMenuItems, fetchShopAddress } = require("../../models/shops");

const { STRAPI_URL } = process.env;

const getShopProducts = async (req, res, next) => {
  try {
    const shopId = req.query["shopId"];
    if (!shopId) {
      res.status(400).send({ message: "Please provide shop id" });
    } else {
      const data = await Promise.all([
        fetchMenuItems(shopId),
        fetchShopAddress(shopId),
      ]);
      const shopDetails = { menuItems: data[0][0], details: data[1][0][0] };
      res.send({ shopDetails, message: "shop data" });
    }
  } catch (error) {
    next(error);
  }
};

const getAllShops = async (req, res, next) => {
  try {
    const shopDetails = req.client.get("shops");
    if (shopDetails) {
      res.send({ result: JSON.parse(shopDetails), message: "shop data" });
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
      req.client.set("shops", JSON.stringify(responseData));
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
