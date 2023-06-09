const { pool } = require("../config/db.config");
const { logger } = require("../utils/logger");

const getShopId = async (gstin) => {
  try {
    const query = "select shop_id from shop where `gstin` = ?";
    const result = await pool.query(query, [gstin]);
    return result;
  } catch (error) {
    logger.error(`Fetch operation failed for shop id :${error}`);
    throw error;
  }
};

const fetchShopAddress = async (shopId) => {
  try {
    const query =
      "select shop.*, `address`.`state`, `address`.`city`, `address`.`pincode`, `address`.`street`, `address`.`address_id` from `shop`  left join `address` on `address`.`shop_id` = `shop`.`shop_id` where `shop`.`shop_id` = ?";
    const result = await pool.query(query, [shopId]);
    return result;
  } catch (error) {
    logger.error(`Fetch operation failed for address :${error}`);
    throw error;
  }
};

const fetchMenuItems = async (shopId) => {
  try {
    const query =
      "select menu.*, `catalog_price`.`price`, `catalog_price`.`gst_percent`, `catalog_price`.`discount_percent` from `menu` left join `catalog_price` on `catalog_price`.`menu_id` = `menu`.`menu_id` where `menu`.`shop_id` = ?";
    const result = await pool.query(query, [shopId]);
    return result;
  } catch (error) {
    logger.error(`Fetch operation failed for menu :${error}`);
    throw error;
  }
};

const fetchShops = async () => {
  try {
    const query = "select * from `shop`";
    const result = await pool.query(query);
    return result;
  } catch (error) {
    logger.error(`Fetch operation failed for shop healthcheck :${error}`);
    throw error;
  }
};

module.exports = {
  getShopId,
  fetchShopAddress,
  fetchMenuItems,
  fetchShops,
};
