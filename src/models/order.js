
const { pool } = require('../config/db.config');
const { logger } = require('../utils/logger');



const createOrder = async(obj)=>{
    try {
        const {id,shopId,amount,items} = obj;
        const query = `insert into orders (user_id,shop_id,total_amount,items) values ('${id}','${shopId}','${amount}','${JSON.stringify(items)}')`;
        await pool.query(query);
        return;
      } catch (error) {
        logger.error(`Order operation failed for user id :${error}`);
        throw error;
      }
};

const getHistoricalOrders = async(userId)=>{
    try{
        const query = "select o.*,ad.state,ad.city,ad.street,s.name from orders o inner join shop s on o.shop_id=s.shop_id inner join address ad on o.shop_id = ad.shop_id where `o`.`user_id`=?";
        const result = await pool.query(query, [userId]);
        return result; 
    }catch(error){
        logger.error(`Error in fetching historical orders :${error}`);
        throw error;
    }
}

module.exports = {
    createOrder,
    getHistoricalOrders
}
