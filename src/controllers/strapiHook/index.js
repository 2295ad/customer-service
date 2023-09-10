require("dotenv");

const { strapiConfig } = require("../../config/strapi.config");
const { STRAPI_URL } = process.env;

const fetchLatestShops = async (req, res, next) => {
  try {
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
    responseData?.forEach((ele)=>req.client.set(ele.shop_id,ele));
    res.send({ result: responseData, message: "shop data" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchLatestShops,
};
