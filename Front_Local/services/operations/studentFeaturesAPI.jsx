import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"

import { setPaymentLoading } from "../../reducer/slices/courseSlice";
import { resetCart } from "../../reducer/slices/cartSlice";

const {COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API} = studentEndpoints;

function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src

        script.onload = ()=> {
            resolve(true)
        }

        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script);
    })
}

 export const buyCourse = async (token, courses, userDetails, navigate, dispatch,)=> {

    const toastId = toast.loading("Loading...");

    try {
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            toast.error("RazorPay SDK failed to load");
            return;
        }

        const orderResponse = await apiConnector("POST", COURSE_PAYMENT_API,
                                                    {courses},
                                                    {
                                                        Authorization: `Bearer ${token}`
                                                    })

        if(!orderResponse.data.success){
            throw new Error(orderResponse.data.message)
        }

        console.log("Order Initialized, printing order response", orderResponse);

        // Access the Razorpay Key ID and other order details directly from orderResponse.data
        const options = {
            key: orderResponse.data.keyId,  
            currency: orderResponse.data.currency,  
            amount: `${orderResponse.data.amount}`,  
            order_id: orderResponse.data.orderId,  
            name:"StudyNotion",
            description: "Thank You for Purchasing the Course",
            image:rzpLogo,
            prefill: {
                name:`${userDetails.firstName}`,
                email:userDetails.email
            },
            handler: (response)=> {
                // Use orderResponse.data.amount for the email function
                sendPaymentSuccessEmail(response, orderResponse.data.amount,token)
                verifyPayment({...response, courses}, token, navigate, dispatch)
            }
        }

        // Open the modal using options
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        paymentObject.on("payment.failed", (response)=> {
            toast.error("oops, payment failed");
            console.log(response.error);
        })
    } catch (error) {
        console.log("PAYMENT API ERROR.....", error);
        toast.error("Could not make Payment");
    }

    toast.dismiss(toastId)
}

async function sendPaymentSuccessEmail(response, amount, token) {
    try {
        await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, {
            orderId:  response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            amount
        },{
            Authorization: `Bearer ${token}`
        })
    } catch (error) {
        console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
        toast.error("Payment success mail failed")
    }
}

async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment...");
    dispatch(setPaymentLoading(true));

    try {
        
        const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData,
        {
            Authorization: `Bearer ${token}`
        })

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        toast.success("Payment successful, you are added to the course!")
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    } catch (error) {
        console.log("PAYMENT VERIFY ERROR....", error);
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}