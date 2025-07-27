const express = require("express");
const app = express();

app.use((req, res, next) => {
    console.log("Backend: --- Incoming Request Detected ---");
    console.log(`Backend: Request URL: ${req.url}`);
    console.log(`Backend: Request Method: ${req.method}`);
    next();
});

const userRoutes = require("./routes/User.jsx");
const profileRoutes = require("./routes/Profile.jsx");
const paymentRoutes = require("./routes/Payments.jsx");
const courseRoutes = require("./routes/Course.jsx");

const dataBase = require("./config/database.jsx");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect} = require("./config/cloudinary.jsx");
const fileUpload = require("express-fileupload");
const dotenv =require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 4000;

// database connect 
dataBase.connect();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"*",
        credential:true,
    })
);

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/temp",
    })
)

// cloudinary connection
cloudinaryConnect();

// routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
app.use("/api/v1/payment",paymentRoutes);


// default routes

app.get("/", (req, res)=>{
    return res.json({
        success:true,
        message:"Your server is up and running...."
    });
});


app.listen(PORT, ()=>{
    console.log(`App is Running at ${PORT}`)
});