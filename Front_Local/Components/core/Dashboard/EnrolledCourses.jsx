 // In src/components/core/Dashboard/EnrolledCourses.jsx
import React, { useEffect, useState } from 'react'; // Ensure React is imported
import { useSelector } from 'react-redux';
import { getUserEnrolledCourses } from '../../../services/operations/profileAPI';
import ProgressBar from '@ramonak/react-progress-bar';
import { useNavigate } from 'react-router-dom';

const EnrolledCourses = () => {
    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [enrolledCourses, setEnrolledCourses] = useState(null); // Initial state is null

    const getEnrolledCourses = async () => {
        try {
            const response = await getUserEnrolledCourses(token);
            console.log("Response from getUserEnrolledCourses (API call success):", response); // Keep this log!

            // Defensive check: Ensure response is an array before setting state
            if (Array.isArray(response)) {
                setEnrolledCourses(response);
            } else {
                console.error("API response for enrolled courses was not an array:", response);
                setEnrolledCourses([]); // Fallback to an empty array to prevent TypeError
            }
        } catch (error) {
            console.log("Unable to Fetch Enrolled Courses", error);
            setEnrolledCourses([]); // Ensure state is an empty array on fetch error to avoid TypeError
        }
    };

    useEffect(() => {
        if (token) {
            getEnrolledCourses();
        }
    }, [token]); // Added token to dependency array for correctness

    console.log("enrolledCourses state before render:", enrolledCourses); // Keep this log!

    return (
        <>
            <div className="text-3xl text-[#C5C7D4]">Enrolled Courses</div>

            {/* Robust Conditional Rendering Logic */}
            {!enrolledCourses ? ( // Case 1: Data is still loading (enrolledCourses is null initially)
                <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                    <div className="spinner"></div>
                </div>
            ) : Array.isArray(enrolledCourses) && enrolledCourses.length === 0 ? ( // Case 2: Data has loaded, and it's an empty array
                <p className="grid h-[10vh] w-full place-content-center text-white">
                    You have not enrolled in any course yet.
                </p>
            ) : Array.isArray(enrolledCourses) && enrolledCourses.length > 0 ? ( // Case 3: Data has loaded, and it's a non-empty array
                <div className="my-8 text-[#F1F2FF]">
                    {/* Headings */}
                    <div className="flex rounded-t-lg bg-[#585D69]">
                        <p className="w-[45%] px-5 py-3">Course Name</p>
                        <p className="w-1/4 px-2 py-3">Duration</p>
                        <p className="flex-1 px-2 py-3">Progress</p>
                    </div>
                    {/* Course Names */}
                    {enrolledCourses.map((course, i, arr) => (
                        <div
                            className={`flex items-center border border-[#2C333F] ${
                                i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
                            }`}
                            key={i}
                        >
                            <div
                                className="flex w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                                onClick={() => {
                                    navigate(
                                        `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                                    );
                                }}
                            >
                                <img
                                    src={course.thumbnail}
                                    alt="course_img"
                                    className="h-14 w-14 rounded-lg object-cover"
                                />
                                <div className="flex max-w-xs flex-col gap-2">
                                    <p className="font-semibold">{course.courseName}</p>
                                    <p className="text-xs text-[#838894]">
                                        {/* Added defensive check for description property */}
                                        {course.description && course.description.length > 50
                                            ? `${course.description.slice(0, 50)}...`
                                            : course.description}
                                    </p>
                                </div>
                            </div>
                            <div className="w-1/4 px-2 py-3">{course?.totalDuration}</div>
                            <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                                <p>Progress: {course.progressPercentage || 0}%</p>
                                <ProgressBar
                                    completed={course.progressPercentage || 0}
                                    height="8px"
                                    isLabelVisible={false}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : ( // Case 4: Fallback for any unexpected non-array or undefined state after initial load attempt
                <p className="grid h-[10vh] w-full place-content-center text-white">
                    An unexpected error occurred while loading your courses.
                </p>
            )}
        </>
    );
};

export default EnrolledCourses;