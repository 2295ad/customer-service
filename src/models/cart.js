
const { pool } = require('../config/db.config');
const { logger } = require('../utils/logger');

const checkCartExists = async(userId)=>{
    try{
        const query = "select * from cart where `user_id`=?";
        const result = await pool.query(query, [userId]);
        return result;    
    }catch(error){
        logger.error(`Check cart exists :${error}`);
        throw error;
    }
}

const getCatalogueItems = async(menuIds)=>{
    try {
        const query = "select * from catalog_price where `menu_id` in (?)";
        const result = await pool.query(query, [menuIds]);
        return result;
      } catch (error) {
        logger.error(`Fetch operation failed  :${error}`);
        throw error;
      }
}

const getMenuDetails = async(menuIds)=>{
  try {
      const query = "select * from menu where `menu_id` in (?)";
      const result = await pool.query(query, [menuIds]);
      return result;
    } catch (error) {
      logger.error(`Fetch menu operation failed  :${error}`);
      throw error;
    }
}


const addToCart = async(obj)=>{
    try {
        const {id,shopId,amount,items} = obj;
        const query = `insert into cart (user_id,shop_id,items) values ('${id}','${shopId}','${JSON.stringify(items)}')`;
        await pool.query(query);
        return;
      } catch (error) {
        logger.error(`Add to cart operation failed for user id :${error}`);
        throw error;
      }
};

const updateCartItems = async(obj)=>{
  try {
      const {id,amount,items} = obj;
      const query = `update cart set items = '${JSON.stringify(items)}' where user_id=?`;
      await pool.query(query,[id]);
      return;
    } catch (error) {
      logger.error(`Update cart operation failed for user id :${error}`);
      throw error;
    }
};

const deleteCart = async(id)=>{
  try{
    const query = "delete from cart where `user_id`=?";
    await pool.query(query,[id]);
    return;
  }catch(error){
    logger.error(`Delete cart operation failed :${error}`);
    throw error;
  }
};

module.exports = {
    checkCartExists,
    getCatalogueItems,
    addToCart,
    deleteCart,
    getMenuDetails,
    updateCartItems
}
