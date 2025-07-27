 import React, { useEffect, useState } from "react"
import ReactStars from "react-stars";
import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/free-mode"
import 'swiper/css/navigation';
import "swiper/css/pagination"
import "../../App.css"
import { FaStar } from "react-icons/fa"
import { Autoplay, FreeMode, Pagination, Navigation } from "swiper/modules"

import { apiConnector } from "../../services/apiconnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    ;(async () => {
      const { data } = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      )
      if (data?.success) {
        setReviews(data?.data)
      }
    })()
  }, [])

  // console.log(reviews)

  return (
    <div className="text-white">
      <div className="my-[50px] h-[184px] max-w-[650px] lg:max-w-[1280px]">
        <Swiper
          slidesPerView={4}
          spaceBetween={25}
          // Change this line to conditionally enable loop
          loop={reviews.length >= 8} // For slidesPerView={4}, having at least 8 slides is a good minimum for looping
          freeMode={true}
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full "
        >
          {reviews.map((review, i) => {
            return (
              <SwiperSlide key={i}>
                <div className=" flex flex-col gap-3 bg-[#161D29] p-3 text-[14px] text-[#DBDDEA]">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        review?.user?.image
                          ? review?.user?.image
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                      }
                      alt=""
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <h1 className="font-semibold text-[#F1F2FF]">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                      <h2 className="text-[12px] font-medium text-[#585D69]">
                        {review?.course?.courseName}
                      </h2>
                    </div>
                  </div>
                  <p className="font-medium text-[#DBDDEA]">
                    {review?.review.split(" ").length > truncateWords
                      ? `${review?.review
                          .split(" ")
                          .slice(0, truncateWords)
                          .join(" ")} ...`
                      : `${review?.review}`}
                  </p>
                  <div className="flex items-center gap-2 ">
                    <h3 className="font-semibold text-[#E7C009]">
                      {review.rating.toFixed(1)}
                    </h3>
                   <ReactStars
                        count={5}
                        value={review.rating}
                        size={20}
                        edit={false} // Make it read-only for display
                        color2={'#ffd700'} // <--- Change activeColor to color2 for react-stars
                        color1={'#838894'} // Optional: Set color for unselected stars
                      />
                  </div>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider