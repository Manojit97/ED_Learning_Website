 import React from 'react'

import {Swiper, SwiperSlide} from "swiper/react"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import 'swiper/css/navigation';
// Ensure Autoplay is imported
import { Autoplay,FreeMode,Navigation, Pagination}  from 'swiper/modules'

import Course_Card from './Course_Card'

const CourseSlider = ({Courses}) => {
  return (
    <>
        {
            Courses?.length ? (
                <Swiper
                    slidesPerView={1}
                    spaceBetween={25}
                    loop={Courses?.length > 3 ? true : false}
                    navigation={true}
                    // Add Autoplay to the modules array
                    modules={[Autoplay, FreeMode, Pagination, Navigation]}
                    // Configure the autoplay prop
                    autoplay={{
                        delay: 2500, // Time in milliseconds between slides
                        disableOnInteraction: false, // Keep autoplaying even after user interaction
                    }}
                    breakpoints={{
                        1024: {
                        slidesPerView: 3,
                        },
                    }}
                    className="max-h-[30rem] mySwiper"
                >
                    {
                        Courses?.map((course, index)=> (
                            <SwiperSlide key={index}>
                                <Course_Card course={course} Height={"h-[250px]"} />
                            </SwiperSlide>
                        ))
                    }
                </Swiper>
            ) : (
                <p className="text-xl text-[#FFF970]">No Course Found</p>
            )

        }
    </>
  )
}

export default CourseSlider