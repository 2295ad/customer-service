const {strapiConfig} = require("../../config/strapi.config");
const axios = require('axios');
require('dotenv');

const {CMS_TOKEN} = process.env;
  
  const getShopProducts = async (req, res, next) => {
    try {
      const gstin  = req.params['gstin'];
      const result = await getShopId(gstin);
      if (!result[0].length) {
        res.send({ message: "Please enter valid gstin" });
      }else{
        const id = result[0][0].shop_id;
        const data = await Promise.all([fetchMenuItems(id), fetchShopAddress(id)]);
        const shopDetails = { menuItems: data[0][0], details: data[1][0][0] };
        res.send({ shopDetails, message: "shop data" });
      }
    } catch (error) {
      next(error);
    }
  };
  
  const getAllShops = async (_, res, next) => {
    try {
      const token = `Bearer ${CMS_TOKEN}`;
      const result = await axios.get('http://185.210.144.38:1337/api/shops',{
        headers:{Authorization:token}
      });
      // console.log(result.data);
      // await strapiConfig.get('/api/content-type-builder/content-types');
      res.send({ result: result.data, message: "shop data" });
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = {
    getShopProducts,
    getAllShops,
  };
  