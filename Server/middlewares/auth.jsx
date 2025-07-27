 const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User.jsx");


// auth
exports.auth = async(req,res, next) =>{
    console.log("Backend: Entered auth middleware."); // Keep this line
    try{
        let token = null; // Initialize token to null

        console.log("Backend: Checking req.cookies...");
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
            console.log("Backend: Token found in req.cookies:", token);
        }

        if (!token) { // Only check req.body if token not found in cookies
            console.log("Backend: Checking req.body...");
            if (req.body && req.body.token) {
                token = req.body.token;
                console.log("Backend: Token found in req.body:", token);
            }
        }

        if (!token) { // Only check Authorization header if token not found in cookies or body
            console.log("Backend: Checking Authorization header...");
            const authHeader = req.header("Authorization");
            if (authHeader) {
                console.log("Backend: Authorization header found:", authHeader);
                if (authHeader.startsWith("Bearer ")) {
                    token = authHeader.replace("Bearer ", "");
                    console.log("Backend: Token extracted from header:", token);
                } else {
                    console.error("Backend: Authorization header does not start with 'Bearer '. Full header:", authHeader);
                }
            } else {
                console.log("Backend: Authorization header is not present.");
            }
        }

        // Log the final token for debugging (this log should now appear!)
        console.log("Backend: Final token value before check:", token);

        // ... (keep the rest of your auth.jsx code the same from here down)
        // if token missing , then return response
        if(!token){
           console.error("Backend: Token Missing, returning 401.");
           return res.status(401).json({
               success:false,
               message:"Token Missing",
           });
        }

        // verify the token
        try{
              const decode =  jwt.verify(token, process.env.JWT_SECRET);
              console.log("Backend: Decoded Token Payload:", decode);
              req.user = decode;
        }
        catch(err){
            // verification issue
            console.error("Backend: JWT verification failed! Error:", err.message); // Specific JWT error
            return res.status(401).json({
               success:false,
               message:"Token is invalid"
            });
        }
        next();
    }
    catch(err){
        console.error("Backend: Error in auth middleware (general catch block):", err.message); // Updated message for clarity
           return res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token",
           });
    }
}

// isStudent
exports.isStudent = async (req, res, next) =>{
    try{
          if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Student's only",
            });
          }
          next();
    }
    catch(err){
         return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again"
         })
    }
}

// isInstructor
exports.isInstructor = async (req, res, next) =>{
    try{
          if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor only",
            });
          }
          next();
    }
    catch(err){
         return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again"
         })
    }
}

// isAdmin
exports.isAdmin = async (req, res, next) =>{
    try{
          if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin only",
            });
          }
          next();
    }
    catch(err){
         return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again"
         })
    }
}