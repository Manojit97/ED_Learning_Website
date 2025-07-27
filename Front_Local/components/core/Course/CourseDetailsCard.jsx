import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {  useNavigate } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import { toast } from 'react-hot-toast';
import { ACCOUNT_TYPE } from '../../../utils/constants';
import { addToCart } from '../../../reducer/slices/cartSlice';
import { BiSolidRightArrow } from 'react-icons/bi';
import { IoMdShareAlt } from "react-icons/io";
const CourseDetailsCard = ({course, setConfirmationModal, handleBuyCourse}) => {
    const { cart } = useSelector((state) => state.cart)
    const {user} = useSelector((state)=>state.profile);
    const {token} = useSelector((state)=>state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // console.log("Course Instruction type is", typeof(course?.instructions))
    const {
        thumbnail: ThumbnailImage,
        price: CurrentPrice,

    } = course;
    
    const handleAddToCart = () => {
        if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
            toast.error("Instructor cannot buy the course")
            return
        }
        if (token) {
            // console.log("dispatching add to cart")
            dispatch(addToCart(course));
            // console.log("CART IN SLICE IS", cart)
            return;
        }
        setConfirmationModal({
            text1:"you are not logged in",
            text2:"Please login to add to cart",
            btn1Text:"login",
            btn2Text:"cancel",
            btn1Handler:()=>navigate("/login"),
            btn2Handler: ()=> setConfirmationModal(null),
        })
    }
    
    const handleShare = () => {
        copy(window.location.href);
        toast.success("Link Copied to Clipboard")
    }

    return (
        <div className='flex flex-col gap-4 rounded-md bg-[#2C333F] p-4 text-[#F1F2FF]'>
        <img 
            src={ThumbnailImage}
            alt='Thumbnail Image'
            className='max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full'
        />
        <div className='px-4'>
        <div className='space-x-3 pb-4 text-3xl font-semibold'>
            Rs. {CurrentPrice}
        </div>
        <div className='flex flex-col gap-y-6'>
            <button className=' cursor-pointer rounded-md bg-[#FFD60A] px-[20px] py-[8px] font-semibold text-[#000814] transition-all duration-200 hover:scale-95'
                onClick={
                    user && course?.studentsEnrolled.includes(user?._id)
                    ? ()=> navigate("/dashboard/enrolled-courses")
                    : handleBuyCourse
                }
            >
                {
                    user && course?.studentsEnrolled.includes(user?._id) ? "Go to Course ": "Buy Now"
                }
            </button>

        {
            (!course?.studentsEnrolled.includes(user?._id)) && (
                <button onClick={handleAddToCart} className=' cursor-pointer rounded-md bg-[#161D29] px-[20px]
                 py-[8px] font-semibold text-[#F1F2FF] transition-all duration-200 hover:scale-95'>
                    Add to Cart
                </button>
            )
        }
        </div>

        <div>
            <p className='pb-3 pt-6 text-center text-sm text-[#DBDDEA]'>
                30-Day Money-Back Guarantee
            </p> 
        </div>
        <div>
            <p className='my-2 text-xl font-semibold '>
                This Course Includes:
            </p>
            <div className='flex flex-col gap-3 text-sm text-[#06D6A0]'>
                {
                    // Corrected line 92: Check if instructions exist and are a string, then split by newline.
                   course?.instructions && typeof course.instructions === 'string' &&
                    course.instructions.split('\n').map((item, index)=> (
                    item.trim() !== '' && ( // Added a check to prevent rendering empty lines
                     <p key={index} className='flex gap-2'>
                     <BiSolidRightArrow/>
                    <span>{item}</span>
                     </p>
                      )
                     ))
                     }
            </div>
        </div>
        <div className='text-center'>
            <button
            className='mx-auto flex items-center gap-1 py-6 text-[#E7C009]
             cursor-pointer hover:text-violet-500 transition-all duration-200 hover:scale-95'
            onClick={handleShare}
            >
                Share
                <IoMdShareAlt />
            </button>
        </div>
        </div>
    </div>
  )
}

export default CourseDetailsCard