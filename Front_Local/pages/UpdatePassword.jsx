import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom';
import { resetPassword } from '../services/operations/authAPI';
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { BiArrowBack } from "react-icons/bi";
const UpdatePassword = () => {
    const [formData, setFormData] = useState({
        password : "",
        confirmPassword : "", 
    })
    const [showPassword , setShowPassword] = useState(false);
    const [showConfirmPassword , setShowConfirmPassword] = useState(false);
    const {loading} = useSelector( (state)=> state.auth);
    const {password , confirmPassword} = formData
    const dispatch = useDispatch();
    const location = useLocation();

    const handleOnChange = (e) =>{
        setFormData( (prevData)=>(
            {
                ...prevData,
                [e.target.name] : e.target.value,
            }
        ))
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        const token = location.pathname.split('/').at(-1);
        dispatch(resetPassword(password , confirmPassword , token));
    }
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        {
            loading ? (
                <div className='spinner'>
                    Loading....
                </div>
            ) : (
                <div className="max-w-[500px] p-4 lg:p-8">
                    <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-[#F1F2FF]">Choose New Password</h1>
                    <p className="my-4 text-[1.125rem] leading-[1.625rem] text-[#AFB2BF]">Almost done. Enter your new password and you are all set.</p>
                    <form onSubmit={handleOnSubmit}>
                        <label className='relative'>
                            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[#F1F2FF]">New Password<sup className="text-[#EF476F]">*</sup></p>
                            <input 
                            required
                            type={showPassword ? "text" : "password"}
                            name = "password"
                            value = {password}
                            onChange={handleOnChange}
                            placeholder='Password'

                             style={{
                                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                }}
                                className="w-full rounded-[0.5rem] bg-[#161D29] p-[12px] text-[#F1F2FF]"
                            />
                            <span onClick={()=>
                                setShowPassword((prev)=> !prev)}
                                 className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                                >
                                {
                                    showPassword ? <IoMdEyeOff fontSize={24}/> : <IoEye fontSize={24}/>
                                }
                            </span>
                        </label>

                        <label className='relative mt-3 block'>
                            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-[#F1F2FF]">Confirm New Password<sup className="text-[#EF476F]">*</sup></p>
                            <input 
                            required
                            type={showConfirmPassword ? "text" : "password"}
                            name = "confirmPassword"
                            value = {confirmPassword}
                            onChange={handleOnChange}
                            placeholder='Confirm Password'
                            style={{
                                  boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                }}
                                className="w-full rounded-[0.5rem] bg-[#161D29] p-[12px] text-[#F1F2FF]"
                            />
                            <span onClick={()=>
                                setShowConfirmPassword((prev)=> !prev)}
                                 className="absolute right-3 top-[38px] z-[10] cursor-pointer"
                                >
                                {
                                    showConfirmPassword ? <IoMdEyeOff fontSize={24}/> : <IoEye fontSize={24}/>
                                }
                            </span>
                        </label>

                        <button type='submit'
                         className="mt-6 w-full rounded-[8px] bg-[#FFD60A] py-[12px] px-[12px] 
                            font-medium text-[#000814] cursor-pointer hover:scale-95 transition-all duration-200"
                        >
                            Reset Password
                        </button>
                    </form>

                    <div className="mt-6 flex items-center justify-between">
                        <Link to="/login">
                            <p className='flex items-center gap-x-2 text-[#F1F2FF]'>Back to Login
                            <BiArrowBack />
                            </p>
                        </Link>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default UpdatePassword