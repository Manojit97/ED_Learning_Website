 require("dotenv").config(); // Ensure this is at the very top of Payments.jsx
const {instance} = require("../config/razorPay.jsx");
const Course = require("../models/Course.jsx");
const User = require("../models/User.jsx");
const mailSender = require("../utils/mailSender.jsx");

const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail.jsx");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail.jsx");
const {default:mongoose} = require("mongoose");


const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress.jsx")

exports.capturePayment = async (req, res) => {
    const {courses} = req.body;
    const userId =  req.user.id;

    if (courses.length === 0) {
        return res.json({
            success:false,
            message:"Provide courseId"
        })
    }

    let totalAmount = 0;

    for (const courseId of courses){
        let course;
        try {
            course = await Course.findById(courseId);
            if(!course){
                return res.status(200).json({
                    success:false,
                    message:"Course doesn't exist"
                })
            }

            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)){
                console.log(`--> User already enrolled in course: ${courseId}`);
                return res.status(200).json({
                    success:false,
                    message:"User already registered"
                })
            }

            totalAmount += course.price;
        } catch (error) {
            console.log("--> Error caught in inner try-catch (calculating amount/checking enrollment):", error);
            return res.status(500).json({
                success:false,
                message: error.message,
            });
        }
    }

    const options = {
        amount: totalAmount * 100, // amount in paisa
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    }

    try {
         
        const paymentResponse = await instance.orders.create(options);
        console.log("--> Razorpay Order Creation Response (SUCCESS PATH):", paymentResponse);
        const razorpayKeyId = process.env.RAZORPAY_KEY;

        // This check helps confirm if your .env variable is loading correctly
        if (!razorpayKeyId) {
            console.error("--> FATAL ERROR: razorpayKeyId is undefined after assignment! Please ensure .env is configured.");
            throw new Error("Razorpay Key ID could not be loaded from environment variables.");
        }


        return res.status(200).json({
            success: true,
            message: "Order Created Successfully",
            // Note: If 'courses' is an array of IDs, courseName, description, and thumbnail will be undefined here.
            // You might need to retrieve them from the database based on the courseId array if you want specific course details.
            courseName: courses.courseName, // This assumes 'courses' is an object with courseName.
            courseDescription: courses.description,
            thumbnail: courses.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
            keyId: razorpayKeyId, // Pass the key ID to the frontend
        });

    } catch (error) {
        console.log("--> Error caught in Payments.jsx during order creation (CATCH PATH):", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Could not initiate order due to an unknown error.",
        });
    }
}

exports.verifyPayment = async (req,res) => {
    console.log("request in verifyPayment is", req)
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    if(!razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature || !courses || !userId) {
            return res.status(200).json({success:false, message:"Payment Failed"});
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
                                    .update(body.toString())
                                    .digest("hex")

    if (expectedSignature === razorpay_signature) {

        await enrollStudents(courses, userId, res);

        return res.status(200).json({success:true, message:"Payment Verified"});
    }
    return res.status(200).json({success:"false", message:"Payment Failed"});
}

const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
        return res.status(400).json({success:false,message:"Please Provide data for Courses or UserId"});
    }

    for(const courseId of courses) {
        try {
            const updatedCourse = await Course.findByIdAndUpdate(courseId,
                {
                    $push: {
                        studentsEnrolled: userId
                    }
                }, {new:true})

            if (!updatedCourse) {
                return res.status(500).json({success:false,message:"Course not Found"});
            }

            const courseProgress = await CourseProgress.create({
                courseID:courseId,
                userId:userId,
                completedVideos: [],
            })

            const updatedStudent = await User.findByIdAndUpdate(userId, {
                $push: {
                    courses: courseId,
                    courseProgress: courseProgress._id,
                }
            }, {new: true})

            const emailResponse = await mailSender(
                updatedStudent.email,
                `Successfully Enrolled into ${updatedCourse.courseName}`,
                courseEnrollmentEmail(updatedCourse.courseName, `${updatedStudent.firstName}`)
            )
        } catch (error) {
            console.log(error);
            return res.status(500).json({success:false, message:error.message,emailResponse});
        }
    }
}

exports.sendPaymentSuccessEmail = async (req,res) => {
    const {orderId, paymentId, amount} = req.body;

    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({success:false, message:"Please provide all the fields"});
    }

    try {
        const user = await User.findById(userId);
        await mailSender(
            user.email,
            `Payment Received`,
            paymentSuccessEmail(`${user.firstName}`,
             amount/100,orderId, paymentId)
        )
         return res.status(200).json({
            success: true,
            message: "Payment success email sent successfully",
        });
    } catch (error) {
        console.log("error in sending mail", error)
        return res.status(500).json({success:false, message:"Could not send email"})
    }
}