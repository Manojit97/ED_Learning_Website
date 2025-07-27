import React, { useEffect, useState } from 'react'
import {useForm} from "react-hook-form"
import CountryCode from "../../data/countrycode.json"
import "./ContactForm.css"
const ContactUsForm = () => {
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitSuccessful}
    } = useForm();

    const submitContactForm = async(data) =>{
            console.log("Logging Data", data);
            try{
                setLoading(true);
                // to be concluded
                const response = {status:"OK"};
                console.log("Logging Response", response);
                setLoading(false);
            }
            catch(err){
                console.log("Error:", err.message);
                setLoading(false);
            }
    }

    useEffect( ()=> {
        if(isSubmitSuccessful){
            reset({
                email:"",
                firstname:"",
                lastname:"",
                message:"",
                phoneNo:""
            })
        }
    },[reset, isSubmitSuccessful]);
  return (
        <form className='flex flex-col gap-7' onSubmit={handleSubmit(submitContactForm)}>
            <div className='flex flex-col gap-5 lg:flex-row'>
                {/* firstname */}
                <div className='flex flex-col gap-2 lg:w-[48%]'>
                    <label className='text-sm'>
                        First Name
                    </label>
                    <input 
                     type='text'
                     name='firstname'
                     id='firstname'
                     placeholder='Enter first name'
                      className='text-black form-style'
                     {...register("firstname",{required:true})}
                     />
                     {
                        errors.firstname && (
                            <span>
                                Please Enter Your Name
                            </span>
                        )
                     }
                </div>

                {/* lastname */}
                <div className='flex flex-col gap-2 lg:w-[48%]'>
                    <label className='text-sm'>
                        Last Name
                    </label>
                    <input 
                     type='text'
                     name='lastname'
                     id='lastname'
                     placeholder='Enter last name'
                     className='text-black form-style'
                     {...register("lastname")}
                     />
                </div>
                </div>
                {/* email */}
                <div  className='flex flex-col gap-2'>
                    <label htmlFor='email' className='text-sm'>
                         Email Address
                    </label>
                    <input 
                     type='email'
                     name='email'
                     id='email'
                     placeholder='Enter Email Address'
                     className='form-style'
                     {...register("email",{required:true})}
                     />
                     {
                        errors.firstname && (
                            <span>
                                Please Enter Your Email address
                            </span>
                        )
                     }
                </div>

                {/* phone no */}
                <div className='flex flex-col gap-2'>
                    <label htmlFor='phonenumber' className='text-sm'>Phone Number</label>

                     <div className='flex gap-5'>
                        {/* dropdown */}          
                           <div className='flex w-[81px] flex-col gap-2'>
                               <select
                            name='dropdown'
                            id='dropdown'
                            className='form-style'
                            {...register("countrycode", {require:true})}
                            >
                                {
                                    CountryCode.map( (element , index)=> {
                                        return (
                                            <option key={index} value={element.code}>
                                                {element.code} -{element.country}
                                            </option>
                                        )
                                    })
                                }
                            </select>
                           </div>
                         
                            <div className='flex w-[calc(100%-90px)] flex-col gap-2'>
                                <input
                                type='number'
                                name='phonenumber'
                                id='phonenumber'
                                placeholder='12345 67890'
                                 className='form-style'
                                {...register("phoneNo", {required:{value:true, message:"please enter phone number"},
                                maxLength: {value:10, message:"Invalid Phone Number"},
                                minLength: {value:8, message:"Invalid Phone Number"},
                                })}
                            />
                            </div>

                     </div>
                     {
                        errors.phoneNo && (
                            <span>
                                {errors.phoneNo.message}
                            </span>
                        )
                     }
                </div>
                {/* message */}
                <div className='flex flex-col gap-2'>
                    <label className='text-sm' htmlFor='message'>
                         Message
                    </label>
                    <textarea
                        name='message'
                        id='message'
                        cols="30"
                        rows="7"
                        className='form-style'
                        placeholder='Enter Your message here....'
                        {...register("message",{required:true})}
                    />
                     {
                        errors.firstname && (
                            <span>
                                Please Type your message.
                            </span>
                        )
                     }
                </div>

                <button type='submit' 
                className='rounded-md bg-[#FFD60A] px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
         transition-all duration-200 hover:scale-95 hover:shadow-none  disabled:bg-[#585D69] sm:text-[16px] cursor-pointer'
                >
                    Send Message
                </button>
               
        </form>
  )
}

export default ContactUsForm