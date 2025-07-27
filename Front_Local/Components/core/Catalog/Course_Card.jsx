import React, { useEffect, useState } from 'react'
import RatingStars from '../../common/RatingStars'
import GetAvgRating from '../../../utils/avgRating';
import { Link } from 'react-router-dom';

const Course_Card = ({course, Height}) => {


    const [avgReviewCount, setAvgReviewCount] = useState(0);

    useEffect(()=> {
        const count = GetAvgRating(course.ratingAndReviews);
        setAvgReviewCount(count);
    },[course])


    
  return (
    <div>
        <Link to={`/courses/${course._id}`}>
            <div>
                <div className="rounded-lg">
                    <img 
                        src={course?.thumbnail}
                        alt='course ka thumbnail'
                        className={`${Height} w-[600px] rounded-xl object-cover `}
                    />
                </div>
                <div className="flex flex-col gap-2 px-1 py-3">
                    <p className="text-xl text-[#F1F2FF]">{course?.courseName}</p>
                    <p className="text-sm text-[#C5C7D4]">{course?.instructor?.firstName} {course?.instructor?.lastName} </p>
                    <div className="flex items-center gap-2">
                        <span className="text-[#FFF970]">{avgReviewCount || 0}</span>
                        <RatingStars Review_Count={avgReviewCount} />
                        <span className="text-[#6E727F]">{course?.ratingAndReviews?.length} Ratings</span>
                    </div>
                    <p className="text-xl text-[#F1F2FF]">{course?.price}</p>
                </div>
            </div>
        </Link>

      
    </div>
  )
}

export default Course_Card
