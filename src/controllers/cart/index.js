
const { getCatalogueItems,checkCartExists, addToCart, deleteCart,getMenuDetails, updateCartItems } = require("../../models/cart");


const updateCart = async(req,res,next)=>{
    try{
        // {shopId:1,items:{1:{qty:2},2:{qty:4},4:{qty:6}}
        const reqObj = req.body;
        const existingCart = await checkCartExists(reqObj.userId); //check cart exists for different shop
        if(existingCart[0].length && existingCart[0]?.[0].shop_id!==reqObj.shopId) return res.send({message:"Are you sure, you want to delete existing cart!"});
        //fetch price and tax of items
        const catalogueItems = await getCatalogueItems(Object.keys(reqObj.items));
        const menuNames = await getMenuDetails(Object.keys(reqObj.items));
        let total = 0;
        const cartObject =  [];
        Object.keys(reqObj.items).forEach((ele)=>{
            if(reqObj.items[ele]?.qty!=0){
                const matchingElement = catalogueItems[0].find((elem)=>elem.menu_id==ele);
                const menu = menuNames[0].find((elem)=>elem.menu_id==ele);
                const qty = reqObj.items[ele].qty;
                const price = matchingElement.price;
                const name = menu.item_name;
                total += Number(qty)*Number(price);
                cartObject.push({id:menu.menu_id,qty,price,name});
            }
        });
        const insertModel = {id:reqObj.id,amount:total.toFixed(2),items:cartObject,shopId:reqObj.shopId};
        if(existingCart[0].length && existingCart[0]?.[0].shop_id==reqObj.shopId){
            await updateCartItems(insertModel)
        }else{
            await addToCart(insertModel);
        }
        res.send({items:cartObject,total:total.toFixed(2)});
    }catch(err){
        next(err);
    }
};

const fetchCart = async(req,res,next)=>{
    try{
        const reqObj = req.body;
        const existingCart = await checkCartExists(reqObj?.userId);
        if(existingCart[0].length){
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
            res.send({cartExists:true,...existingCart[0][0], total:total.toFixed(2)}); 
        }else{
            res.send({message:'No cart exists',cartExists:false});
        }
    }catch(err){
        next(err);
    }
}

const removeCart = async(req,res,next)=>{
    try{
        const reqObj = req.body;
        await deleteCart(reqObj.id);
        res.send({message:'cart deleted'});
    }catch(err){
        next(err);
    }
};

module.exports = {
    fetchCart,
    updateCart,
    deleteCart,
    removeCart
}