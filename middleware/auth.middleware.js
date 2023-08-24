
const jwt = require('jsonwebtoken')
const { userModel } = require('../models/user.model')
const { blackListModel } = require('./blacklisting')

const auth = async(req,res,next)=>{

    try {
        const {cookieAccessToken}=req.cookies
        // console.log(blackListModel,"cookieToken");
        if(blackListModel.includes(cookieAccessToken)){
            return res.status(200).send({msg:"Please Login..."})
        }
        


        const isToken = jwt.verify(cookieAccessToken,"secretKey")
        // console.log(isToken);
        const {userID}=isToken

        const user = await userModel.findById(userID)
        // console.log(user);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

          req.user = user
          next()
    } catch (error) {
        res.status(400).send({msg:error.message})
    }
}

module.exports={
    auth
}