import React from "react";
import logo1 from "../../../assets/TimeLineLogo/Logo1.svg";
import logo2 from "../../../assets/TimeLineLogo/Logo2.svg";
import logo3 from "../../../assets/TimeLineLogo/Logo3.svg";
import logo4 from "../../../assets/TimeLineLogo/Logo4.svg";
import timelineImage from "../../../assets/Images/TimelineImage.png"
const timeline = [
  {
    Logo: logo1,
    Heading: "Leadership",
    Description: "Fully commited to the success company",
  },
  {
    Logo: logo2,
    Heading: "Responsibility",
    Description: "Students will always be our top priority",
  },
  {
    Logo: logo3,
    Heading: "Flexibility",
    Description: "The ability to switch is an important skills",
  },
  {
    Logo: logo4,
    Heading: "Solve the problem",
    Description: "Code your way to a solution",
  },
];

const TimelineSection = () => {
  return (
    <div>
      <div className="flex flex-row gap-15 items-center">

        <div className="w-[45%] flex flex-col gap-5">
          {timeline.map((element, index) => {
            return (
              <div className="flex flex-row gap-6" key={index}>

                <div className="w-[52px] h-[52px] bg-white rounded-full flex justify-center items-center shadow-[#00000012] shadow-[0_0_62px_0]">
                  <img src={element.Logo} />
                </div>

                <div>
                  <h2 className="font-semibold text-[18px]">
                    {element.Heading}
                  </h2>
                  <p className="text-base">{element.Description}</p>
                  <div className={` ${index === 3 ? "hidden":""}   h-14 
                            border-dotted border-r border-[#838894]  w-[26px] translate-x-[-75px] mt-3 mb-1`}>

                   </div>
                </div>
              </div>
            );
          })}
        </div>

          <div className="relative shadow-blue-200">
                <img src={timelineImage}
                alt="timelineImage"
                className="shadow-white object-cover h-fit rounded-md"
                />

                <div className="absolute bg-[#014A32] flex flex-row text-white uppercase py-7 
                                        left-[50%] translate-x-[-50%] translate-y-[-50%]">
                        <div className="flex flex-row gap-5 items-center border-r border-[#05A77B] px-7">
                            <p className="text-3xl font-bold">10</p>
                            <p className="text-[#05A77B] text-sm">Years of Experience</p>
                        </div>

                        <div className="flex gap-5 items-center px-7">
                                <p className="text-3xl font-bold">250</p>
                            <p className="text-[#05A77B] text-sm"> Types of course</p>
                        </div>
                </div>
          </div>
      </div>
    </div>
  );
};

export default TimelineSection;
