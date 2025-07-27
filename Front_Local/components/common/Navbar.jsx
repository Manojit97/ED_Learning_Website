 import React, { useEffect ,useState} from 'react'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import navlink from "../../data/navbar-links"
import { Link, matchPath } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { BsCartPlusFill } from "react-icons/bs";
import ProfileDropDown from '../core/Auth/ProfileDropDown'
import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/apis'
import { IoIosArrowDown } from "react-icons/io";
import {RxHamburgerMenu} from "react-icons/rx"
// Import the new utility function
import { createCategorySlug } from '../../utils/helper'; // <<-- VERIFY THIS PATH IS CORRECT based on your helpers.js/jsx location


const Navbar = () => {

    const {token} = useSelector( (state) => state.auth);
    const {user} =useSelector( (state)=> state.profile);
    const {totalItems} = useSelector( (state)=> state.cart);
    const location = useLocation();
    const [loading, setLoading] = useState(false)
    const [subLinks, setSubLinks] = useState([]);

    useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        setSubLinks(res.data.allCategory)
      } catch (error) {
        console.log("Could not fetch Categories.", error)
      }
      setLoading(false)
    })()
  }, [])


    const matchRoute = (route)=>{
        return matchPath({path:route}, location.pathname);
    }

  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-[#2C333F]'>
        <div className='flex w-10/12 max-w-[1280px] items-center justify-between'>
                    {/* image */}
                    <Link to="/">
                       <img src={logo} width={160} height={42} loading='lazy'/>
                    </Link>

                    {/* Nav links */}
                   <nav>
                        <ul className=' flex gap-x-8 text-[#DBDDEA]'>
                                 {
            navlink.map( (link, index) => (
                  <li key={index}>
                    {
                        link.title === "Catalog" ? (
                            <div className='relative flex items-center gap-2 group'>
                                <p>{link.title}</p>
                                <IoIosArrowDown/>

                                <div className={`invisible absolute left-[50%] 
                                    translate-x-[-49%] ${subLinks.length ? "translate-y-[15%]" : "translate-y-[40%]"}
                                    top-[50%] z-50 
                                    flex flex-col rounded-md bg-[#F1F2FF] p-4 text-[#000814]
                                    opacity-0 transition-all duration-200 group-hover:visible
                                    group-hover:opacity-100 lg:w-[300px]`}>

                                    <div className='absolute left-[50%] top-0
                                    translate-x-[80%]
                                    translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-[#F1F2FF]'>
                                    </div>

                                    {
                                        subLinks.length ? (
                                                subLinks.map( (subLink, index) => (
                                                    // THIS IS THE KEY CHANGE: Use createCategorySlug here
                                                    <Link className='rounded-lg bg-transparent py-4 pl-4 hover:bg-[#C5C7D4]' to={`/catalog/${createCategorySlug(subLink.name)}`} key={index}>
                                                        <p>{subLink.name}</p>
                                                    </Link>
                                                ) )
                                        ) : (<span className="loader"></span>)
                                    }

                                    </div>


                            </div>

                        ) : (
                            <Link to={link?.path}>
                                <p className={`${ matchRoute(link?.path) ? "text-[#FFE83D]" : "text-[#DBDDEA]"}`}>
                                    {link.title}
                                </p>

                            </Link>
                        )
                    }
                </li>
               ) )
            }
                        </ul>
                   </nav>

                    {/* Login/Signup/Dashboard */}

                   <div className='flex gap-x-4 items-center'>

                        {
                            user && user?.accountType != "Instructor" && (
                                <Link to="/dashboard/cart" className='relative'>
                                        <BsCartPlusFill />
                                        {
                                            totalItems > 0 && (
                                                <span>
                                                    {totalItems}
                                                </span>
                                            )
                                        }
                                </Link>
                            )
                        }

                        {
                            token === null && (
                                <Link to="/login">
                                    <button className='border border-blue-600 bg-[#161D29] px-[12px] py-[8px] text-[#AFB2BF]
                                                                font-semibold rounded-md cursor-pointer'>
                                        Log in
                                    </button>
                                </Link>
                            )
                        }

                        {
                            token === null && (
                                <Link to="/signup">
                                    <button className='border border-blue-600 bg-[#161D29] px-[12px] py-[8px] text-[#AFB2BF]
                                                              font-semibold rounded-md cursor-pointer'>
                                        Sign Up
                                    </button>
                                </Link>
                            )
                        }

                        {
                            token !== null && <ProfileDropDown/>

                        }
                   </div>
                   <div className='mr-4 md:hidden text-[#AFB2BF] scale-150'>
                    <RxHamburgerMenu />  
                 </div> 
            </div>
        </div>
      )
}

export default Navbar