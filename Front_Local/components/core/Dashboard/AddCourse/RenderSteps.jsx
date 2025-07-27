import React from 'react'
import { useSelector } from 'react-redux'
import { FaCheck } from "react-icons/fa"

import CourseBuilderForm from "./CourseBuilder/CourseBuilderForm.jsx"
import CourseInformationForm from "./CourseInformation/CourseInformationForm.jsx"
import PublishCourse from "./PublishCourse/index.jsx"
const RenderSteps = () => {
    const {step} = useSelector((state)=> state.course)

    const steps = [
        {id:1,
        title: "Course Information"},
        {
            id: 2,
            title: "Course Builder",
          },
          {
            id: 3,
            title: "Publish",
          }
    ]
  return (
    <>
        <div className="relative mb-2 flex w-full justify-center">
            {steps.map((item)=> (
                <React.Fragment key={item.id}> {/* <--- ADDED key HERE */}
                {/* Step Circle */}
                    <div className="flex flex-col items-center ">
                        <button
                        className={`cursor-default aspect-square w-[34px]
                         place-items-center rounded-full border-[1px]
                         ${step === item.id ? ' border-[#FFD60A] bg-[#251400] text-[#FFD60A]'
                         : ' border-[#2C333F] bg-[#161D29] text-[#838894]'}
                         ${step > item.id ? ' bg-[#FFD60A]' :'text-[#FFD60A]'}`}
                         >
                            {step > item.id ? (
                                <FaCheck className='font-bold text-[#000814]'/>
                            ) :
                            (item.id)}
                        </button>
                    </div>
                {/* Dotted Line */}
                    {item.id !== steps.length && (
                        <>
                            <div // Removed key from this inner div as it's not the direct child of map now.
                            className={`h-[calc(34px/2)] w-[33%]  border-dashed border-b-2
                            ${step > item.id  ? "border-[#FFD60A]" : "border-[#585D69]"}`}
                            ></div>
                        </>
                    )}
                </React.Fragment>  
            ))}
        </div>

        {/* Steps titles */}
      <div className="relative mb-16 flex w-full select-none justify-between">
        {steps.map((item) => (
          <React.Fragment key={item.id}> {/* <--- ADDED key HERE for the second map */}
            <div
              className="flex min-w-[130px] flex-col items-center gap-y-2"
            >

              <p
                className={`text-sm ${
                  step >= item.id ? "text-[#F1F2FF]" : "text-[#585D69]"
                }`}
              >
                {item.title}
              </p>
            </div>

          </React.Fragment> 
        ))}
      </div>

      {/* Render specific component based on current step */}
      {step === 1 && <CourseInformationForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 &&  <PublishCourse /> }

    </>
  )
}

export default RenderSteps