const CartModel = require('../models/cartModel')
const UserModel = require('../models/userModel')
const ProductModel = require('../models/productModel')
const{isValid,isValidRequestBody,isValidObjectId} = require('../validator/validators')

const createCart = async function(req,res){
    try{
        let userId = req.params.userId
        let data = req.body
        let {productId,cartId} = data;

        if(!isValidRequestBody(data))
        return res.status(400).send({status:false, message:"please enter some data"});

        if(!isValidObjectId(userId))
        return res.status(400).send({status:false, message:"please enter a user ID"});

        let searchUser = await UserModel.findOne({_id:userId});
        if(!searchUser)
        return res.status(404).send({status:false, message:"user not found"});

        if(!isValid(productId))
        return res.status(400).send({status:false, message:"please enter a product ID"});
        
        if(!isValidObjectId(productId))
        return res.status(400).send({status:false, message:"please  enter a product ID"});
    }
}


const getCart =async function(req, res) {
    try{
        let userId = req.params.userId;

        if(!isValidObjectId(userId)){
            return res.status(400).send({status:false, message:"wrong user ID"});
        }

        let checkUserId =await UserModel.findOne({ _id: userId });
        if(!checkUserId){
            return res.status(404).send({status:false, message:"user details not found"});
    }

    let fetchData = await CartModel.findOne({ userId });
    if(fetchData.items.length ==0)
     return res.status(400).send({status:false, message:"items details not found"});

     if(!fetchData){
        return res.status(404).send({status:false, message:"cart not found"});
     }
     res.status(200).send({status:true, message:"cart successfully", data:fetchData});
    } catch(err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

// ----------------------------------------------------------------------------------------
// delete cart
const deleteCart = async function (req, res)  {
    try{
         let Usersid = req.params.userId
         if(!isValidObjectId(Usersid)){
            return res.status(400).send({status: false, message: 'Invalid  format of User ID'});
         } 
         const finduser = await UserModel.findById({_id : Usersid});
         if(!finduser){
            return res.status(404).send({status: false, message: 'not found'});
         }

            const findCart = await CartModel.findOne({ Usersid})
            if(!findCart){
                return res.status(404).send({status: false, message: 'cart not found'});

         }
         const deleteCart = await CartModel.findOneAndUpdate({Usersid},{$set:{items:[],totalItems:0,totalPrice:0}},{new:true})
        return res.status(200).send({status: true, message: 'Cart deleted successfully'});

    }
    catch(err){
        return res.status(500).send({status: false, message: err.message})
    }
}




