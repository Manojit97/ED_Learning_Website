const mongoose =  require("mongoose");
const mailSender = require("../utils/mailSender.jsx");
const emailTemplate = require("../mail/templates/emailVerificationTemplate.jsx");
const OTPSchema = new mongoose.Schema({
      email:{
        type:String,
        required:true,
      },
      otp:{
        type:String,
        required:true,
      },
      createdAt:{
        type:Date,
        default:Date.now(),
        expires:10*60*1000,
      },
    
});

// a function -> to send emails
async function sendVerificationEmail(email, otp){
  try{
       const mailResponse = await mailSender(email,"Verification Email from StudyNotion",emailTemplate(otp));
       console.log("Email Sent Successfully: ", mailResponse);
  }
  catch(err){
         console.log("Error Occured while sending mails: ", err);
         throw err;
  }
}
OTPSchema.pre("save",async function(next){
  await sendVerificationEmail(this.email, this.otp);
  next();
})
module.exports = mongoose.model("OTP",OTPSchema);

