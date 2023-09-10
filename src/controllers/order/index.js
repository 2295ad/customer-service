
const { getHistoricalOrders,createOrder } = require("../../models/order");
const { checkCartExists, deleteCart, getCatalogueItems, getMenuDetails } = require("../../models/cart");



const confirmOrder = async(req,res,next)=>{
    try{
        // {shopId:1,items:{1:2,2:4,4:6}}
        const reqObj = req.body;
        const existingCart = await checkCartExists(reqObj.userId);
        await deleteCart(reqObj.userId);
        existingCart[0][0].items = JSON.parse(existingCart[0][0].items); //parse stringified item
            
        const menuItems = [];
        existingCart[0][0].items.forEach((ele)=>
            menuItems.push(ele.id)
        )
        const catalogueItems = await getCatalogueItems(menuItems);
        const menuNames = await getMenuDetails(menuItems);
        let total = 0;
        existingCart[0][0].items.forEach((ele)=>{
            const matchingElement = catalogueItems[0].find((elem)=>elem.menu_id===ele.id);
            const menu = menuNames[0].find((elem)=>elem.menu_id===ele.id);
            ele.price = matchingElement.price;
            ele.name = menu.item_name;
            total+= Number(ele.price)*Number(ele.qty);
        });
        const {user_id,shop_id,items} = existingCart[0][0];
        await createOrder({id:user_id,shopId:shop_id,items,amount:total});
        res.send({message:'Order placed successfully'});
    }catch(err){
        next(err);
    }
};

const fetchOrders = async(req,res,next)=>{
    try{
        const reqObj = req.body;
        const orders = await getHistoricalOrders(reqObj.userId);
        orders[0].forEach((ele)=>ele.items=JSON.parse(ele.items));
        res.send({orders:orders[0]});
    }catch(err){
        next(err);
    }
}

module.exports = {
    fetchOrders,
    confirmOrder
}