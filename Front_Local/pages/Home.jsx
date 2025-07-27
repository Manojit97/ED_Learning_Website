import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import HighlightText from "../components/core/HomePage/HighlightText";
import CTAButton from "../components/core/HomePage/Button";
import Banner from "../assets/Images/banner.mp4";
import CodeBlocks from "../components/core/HomePage/CodeBlocks";
import "../components/core/HomePage/Border.css";
import TimelineSection from "../components/core/HomePage/TimelineSection";
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection";
import InstructorSection from "../components/core/HomePage/InstructorSection";
import Footer from "../components/common/Footer"
import ExploreMore from "../components/core/HomePage/ExploreMore";
import ReviewSlider from "../components/common/ReviewSlider"
const Home = () => {
  return (
    <div>
      {/*Section 1 */}

      <div className="relative mx-auto flex flex-col w-10/12 max-w-[1260px] items-center text-white justify-between">
        <Link to={"/signup"}>
          <div className=' group mt-16 p-1 mx-auto rounded-full bg-[#161D29] font-bold text-[#999DAA]
                transition-all duration-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] hover:scale-95 w-fit hover:drop-shadow-none'>
                    <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
                    transition-all duration-200 group-hover:bg-[#000814]'>
                        <p>Become an Instructor</p>
                        <FaArrowRight />
                    </div>
                </div>
        </Link>

        <div className="text-center text-4xl font-semibold mt-7">
            Empower Your Future with 
            <HighlightText text={"Coding Skills"}/>
        </div>
        <div className="mt-4 w-[90%] text-center text-lg font-bold text-[#838894]">
            With our online coding courses, you can learn at your own pace, from anywhere in the world, 
            and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
        </div>
        <div className="flex flex-row gap-7 mt-8">
            <CTAButton active={true} linkto={"/signup"}>
                Learn More
            </CTAButton>
            <CTAButton active={false} linkto={"/login"}>
                Book a Demo
            </CTAButton>
        </div>
        <div className="mx-3 my-12 shadow-blue-400 shadow-[10px_-5px_50px_-5px]">
          <video className='shadow-[20px_20px_rgba(255,255,255)]' muted loop autoPlay>
             <source src={Banner} type="video/mp4"/>
          </video>
        </div>
          {/* code section 1 */}
               <div>
                  <CodeBlocks
                       position={"lg:flex-row"}
                    heading={
                        <div className='text-4xl font-semibold'>
                            Unlock your
                            <HighlightText text={"coding potential "}/>
                            with our online courses.
                        </div>
                    }

                    subheading = {
                        "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                    }

                     ctabtn1={
                        {
                            btnText: "Try it yourself",
                            linkto: "/signup",
                            active: true,
                        }
                    }
                    ctabtn2={
                        {
                            btnText: "Learn More",
                            linkto: "/login",
                            active: false,
                        }
                    }

                     codeblock={`<!DOCTYPE html>\n<html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a></nav>\n</body>`}
                    codeColor={"text-yellow-500"}
                    backgroudGradient={"bg-gradient-to-r from-amber-200 to-yellow-400"}
                  />
            </div> 
            {/* code section 2 */}
            <div>
                <CodeBlocks
                    position={"lg:flex-row-reverse"}
                    heading={
                        <div className='w-[100%] text-4xl font-semibold lg:w-[50%]'>
                            Start 
                            <HighlightText text={`coding in seconds`}/>
                        </div>
                    }

                     subheading = {
                        "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                    }

                     ctabtn1={
                        {
                            btnText: "Continue Lesson",
                            linkto: "/signup",
                            active: true,
                        }
                    }
                    ctabtn2={
                        {
                            btnText: "Learn More",
                            linkto: "/login",
                            active: false,
                        }
                    }

                     codeblock={`import React from "react";\nimport CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}
                    codeColor={"text-blue-400"}
                     backgroudGradient={" bg-gradient-to-r from-indigo-400 to-cyan-400"}
                />
            </div>
                     <ExploreMore />  
      </div>

      {/*Section 2 */}

      <div className="bg-[#F9F9F9] text-[#2C333F]">
         <div className="homepage_bg h-[310px]">
                <div className="w-10/12 max-w-[1260px] flex flex-col
                              items-center justify-center gap-5 mx-auto">
                    <div className="h-[150px]"></div>
                        <div className="flex flex-row gap-7 text-white">

                              <CTAButton active={true} linkto={"/signup"}>
                                 <div className="flex items-center gap-3">
                                     Explore full Calalog
                                     <FaArrowRight/>
                                 </div>
                              </CTAButton>

                               <CTAButton active={false} linkto={"/login"}>
                                 <div className="flex items-center gap-3">
                                     Learn more
                                     <FaArrowRight/>
                                 </div>
                              </CTAButton>

                        </div>
                </div>
         </div>
          
          <div className="mx-auto w-10/12 max-w-[1280px] flex flex-col items-center justify-between gap-7">
                    <div className="flex flex-row gap-5 mb-10 mt-[95px]">
                        <div className="text-4xl font-semibold w-[45%]">
                                Get the skills you need for about
                                <HighlightText text={"Job that is in demand"}/>
                        </div>

                        <div className="flex flex-col gap-10 w-[40%] items-start">
                                <div className="text-[16px]">
                                    The modern StudyNotion is the dictates its own terms. Today, 
                                    to be a competitive specialist requires more than professional skills.
                                </div>
                                <CTAButton active={true} linkto={"/signup"}>
                                    <div>Learn More</div>
                                </CTAButton>
                        </div>

                    </div>
                     <TimelineSection/>

                    <LearningLanguageSection/>                
          </div>
      </div>

      {/*Section 3 */}

         <div className="w-10/12 mx-auto max-w-[1280px] flex-col items-center justify-between gap-8 
                                first-letter bg-[#000814] text-white">
            
            <InstructorSection/>
            <h2 className="text-center text-4xl font-semibold mt-10">Reviews from other learners</h2>

            {/* review section */}
             <ReviewSlider />
         </div>

      {/*Footer */}

        <Footer/>
        
    </div>
  );
};

export default Home;
