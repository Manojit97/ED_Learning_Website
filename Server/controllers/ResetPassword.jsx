const User = require("../models/User.jsx");
const mailSender = require("../utils/mailSender.jsx");
const bcrypt = require("bcrypt");


// resetPasswordToken
exports.resetPasswordToken = async (req,res)=>{
    try{
          // get email from req body
          const email = req.body.email;
          // check user for this email, email validation
          const user = await User.findOne({email:email});
          if(!user){
            return res.json({
                success:false,
                message:"Your Email is not registered with us"
            });
          }
          // generate token
          const token = crypto.randomUUID();
          // update user by adding token and expires time
          const updateDetails = await User.findOneAndUpdate(
            {email:email},
            {
                token:token,
                resetPasswordExpires:Date.now() + 10*60*1000,
            },
            {new:true}
          );
          // create url
          const url = `http://localhost:5173/update-password/${token}`
          // send mail containing the url
          await mailSender(email, 
                           "password Reset Link",
                           `Password Reset Link: ${url}`
          );

          // return response
          return res.json({
            success:true,
            message:"Email sent Successfully, Please check email and Change password"
          })
    }
    catch(err){
       console.log(err);
       return res.status(500).json({
        success:false,
        message:"Something went wrong while reseting the password"
       })
    }
}


// resetPassword
exports.resetPassword = async (req, res)=>{
    try{
        // data fetch
        const {password, confirmPassword, token} = req.body;
        // validation
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:"Password not matching",
            });
        }
        // get userdetails from Db using token
        const userDetails = await User.findOne({token:token});
        // if no etry - invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message:"Token is Invalid",
            });
        }
        // token time check
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success:false,
                message:"Token is expired , please regenerate your token",
            });
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // password update
        await User.findOneAndUpdate(
            {token},
            {password:hashedPassword},
            {new:true},
        );
        // return response
        return res.status(200).json({
            success:true,
            message:"Password Reset Successfully",
        });
    }
    catch(err){
          console.log(err);
          return res.status(500).json({
            success:false,
            message:"Something went Wrong while sending reset password mail"
          })
    }
}