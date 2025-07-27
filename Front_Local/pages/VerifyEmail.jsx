import React, { useEffect, useState } from 'react'
import OTPInput from "react-otp-input"
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { sendOtp,signUp } from '../services/operations/authAPI'
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
const VerifyEmail = () => {
    const {loading , signupData} = useSelector( (state)=> state.auth);
    const [otp, setOtp] = useState();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect( ()=>{
        if(!signupData){
            navigate("/signup");
        }
    },[])

    const handleOnSubmit = (e) => {
        e.preventDefault();

        const {
            accountType,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        } = signupData;

        dispatch(signUp(accountType, firstName, lastName, email, password, confirmPassword, otp, navigate));
    }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
        {
            loading 
            ? (<div className='spinner'>Loading....</div>) : 
            (<div className="max-w-[500px] p-4 lg:p-8">
                <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-[#F1F2FF]">Verify Email</h1>
                <p className="text-[1.125rem] leading-[1.625rem] my-4 text-[#AFB2BF]">A Verification code has been sent to you. Enter the code below</p>
                <form onSubmit={handleOnSubmit}>
                    <OTPInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span>-</span>}
                    renderInput={(props) =>(<input {...props} placeholder='-'
                    style={{
                            boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                          }}
                          className="w-[48px] lg:w-[60px] border-0 bg-[#161D29] rounded-[0.5rem] text-[#F1F2FF] 
                          aspect-square text-center focus:border-0 focus:outline-2 focus:outline-[#FFD60A]"
                    />)}
                    containerStyle={{
                       justifyContent: "space-between",
                       gap: "0 6px",
                     }}
                    />
                    <button type='submit'
                    className="w-full bg-[#FFD60A] py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-[#000814]"
                    >
                        Verify Email
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-between">
                    <Link to="/login">
                            <p className="text-[#F1F2FF] flex items-center gap-x-2">Back to Login
                                 <BiArrowBack />
                            </p>
                        </Link>
                </div>
                <button onClick={() => dispatch(sendOtp(signupData.email,navigate))}>
                     <RxCountdownTimer />
                    Resend it
                </button>
            </div>)
        }
    </div>
  )
}

export default VerifyEmail