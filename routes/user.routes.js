const express = require('express');
const userRouter = express.Router()
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
const { blackListModel } = require('../middleware/blacklisting');
const { userModel } = require('../models/user.model');
const { auth } = require('../middleware/auth.middleware');

userRouter.post("/register",(req,res)=>{

    const {username,avatar,email,password}= req.body

    try {

        bcrypt.hash(password, 5, async(err, hash)=> {    
            const user = new userModel({username,avatar,email,password:hash})
            await user.save()
            res.status(200).send({msg:"new user is register"})
        })
        
    } catch (err) {
        res.status(400).send({msg:err.message})
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body

    try {
        const isUserPresent= await userModel.findOne({email})
        if(!isUserPresent){
            return  res.status(400).send({msg:"user is not register, plz singup"})
        }

        const token = jwt.sign({ userID: isUserPresent._id}, 'secretKey', { expiresIn: 60 * 60 *60});
        const refreshToken = jwt.sign({ userID: isUserPresent._id}, 'refreshSecretKey', { expiresIn: 60 * 3 * 60 });
         
        res.cookie("cookieAccessToken",token,{maxAge:1000*60})
        res.cookie("cookieRefreshToken",refreshToken,{maxAge:3000*60})
       

        bcrypt.compare(password,isUserPresent.password,async(err,result)=>{
            if(result){
                try {
                    res.status(200).send({msg:"Login Succesful",token,refreshToken})
                } catch (error) {
                    res.status(400).send({msg:"Wrong Password"})
                }
            }else{
                res.status(400).send({msg:"Wrong Password"})
                // console.log(err);
            }

        })
      
        
    } catch (error) {
        res.status(400).send({msg:error.message})
    }
})

userRouter.get("/logout",auth,async(req,res)=>{

    try {
        const {cookieAccessToken}=req.cookies
    

        blackListModel.push(cookieAccessToken)
        
        res.status(200).send({msg:"logout Succesfull!"})
        
    } catch (error) {
        res.status(400).send({msg:error.message})
    }    
})


module.exports={
    userRouter
}