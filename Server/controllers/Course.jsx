const Course = require("../models/Course.jsx");
const Category = require("../models/category.jsx");
const User = require("../models/User.jsx");
const {uploadImageToCloudinary} = require("../utils/imageUploader.jsx");

const Section =require("../models/Section.jsx");
const SubSection = require("../models/SubSection.jsx");
const CourseProgress = require("../models/CourseProgress.jsx");
require("dotenv").config();
const { convertSecondsToDuration } = require("../utils/secToDuration.jsx");

// createCourse  handler function
exports.createCourse = async (req, res)=>{
    try{
          

          // fetch data
         const {courseName, courseDescription, price, category, tag, instructions, courseBenefits} = req.body;
          // get thumbnail
          const thumbnail = req.files.thumbnailImage;
        const finalTags = Array.isArray(tag) ? tag : (tag ? [tag] : []);
       const finalInstructions = Array.isArray(instructions) ? instructions : (instructions ? [instructions] : []);


          // validation
          if(!courseName || !courseDescription || !price || !category || !thumbnail || !courseBenefits || !finalTags.length === 0 || !finalInstructions.length === 0){
            console.log("Validation failed: All fields are required. Missing field(s)."); // New log for clarity
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
          }

          // check for instructor
          const userId = req.user.id;
          const instructorDetails = await User.findById(userId);
          console.log(" instructor Details ", instructorDetails);
          // TODO: verify that userId and instructorDetails._id are same or different ?

          if(!instructorDetails){
            return res.status(404).json({
                  success:false,
                  message:"Instructor Details not Found",
            });
          }

          // check given tag valid or not 
          const categoryDetails = await Category.findById(category);
          if(!categoryDetails){
            return res.status(404).json({
                success:false,
                message:"Category Details not found",
            });
          }

          // upload Image to Cloudinary
          const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

          // create an entry for new course
          const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor : instructorDetails._id,
            whatYouWillLearn:courseBenefits,
            price,
            tag: finalTags,
            instructions: finalInstructions,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
            status: "Draft",
          })

          // add the new course to the user schema of Instructor
           await User.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    courses: newCourse._id,
                }
            },
            {new:true}
           );

           // update the Category ka schema
           await Category.findByIdAndUpdate(category,
            {
                $push: {
                    course: newCourse._id
                }
            })
            console.log("New Course object before sending response:", newCourse);
           // return response
           return res.status(200).json({
                success:true,
                message:"Course Created Successfully",
                data:newCourse,
           })
    }
    catch(err){
       console.log("Error in createCourse handler:", err); // Ensure catch block logs are working
         return res.status(500).json({
          success:false,
          message:"Failed to Create Course",
          error:err.message,
         });
    }
}

// get Allcourses
exports.showAllCourses = async (req, res)=>{
  try{
          const allCourses = await Course.find({},
                                               {courseName:true,
                                                price:true,
                                                thumbnail:true,
                                                instructor:true,
                                                ratingAndReviews:true,
                                                studentsEnrolled:true,
                                               }).populate("instructor").exec();
    
    return res.status(200).json({
      success:true,
      message:"Data for all courses fetched successfully",
      data:allCourses,
    })
  }
  catch(err){
         console.log(err);
         return res.status(500).json({
          success:false,
          message:"Cannot Fetched course Data",
          error:err.message,
         });
  }
}

// getCourseDetails
exports.getCourseDetails = async (req, res)=>{
  try{
    const {courseId} = req.body;
    // find course details 
    const courseDetails = await Course.find(
                                {_id:courseId})
                                .populate(
                                    {
                                      path:"instructor",
                                      populate:{
                                        path:"additionalDetails",
                                      },
                                    }
                                )
                                .populate("category")
                                .populate("ratingAndReviews")
                                .populate({
                                  path:"courseContent",
                                  populate:{
                                    path:"subSection",
                                  },
                                })
                                .exec();
          
        // validation
        if(!courseDetails){
          return res.status(400).json({
            success:false,
            message:`Could not find the Course with ${courseId}`
          });
        }

        // return response
        return res.status(200).json({
          success:true,
          message:"Course Details fetched Successfully",
          data:courseDetails,
        })
                                
  }
  catch(err){
    console.log(err);
    return res.status(500).json({
      success:false,
      message:err.message
    })
  }
}


// In Course.jsx (backend controller)
exports.editCourse = async (req, res) => {
    try {
        
        const { courseId } = req.body;

        // Create a plain object from req.body to ensure hasOwnProperty works reliably.
        // This handles cases where req.body might be a null-prototype object.
        const updates = { ...req.body }; // <--- MODIFICATION 1: Use spread operator to create a plain object

        // Remove courseId from the updates object.
        // You've already extracted it to find the course, and you shouldn't try to update the _id field.
        delete updates.courseId; // <--- MODIFICATION 2: Remove courseId from updates

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course Not Found",
            });
        }

        // Handle thumbnail update if a new thumbnail image is provided
        if (req.files && req.files.thumbnailImage) {
            console.log("thumbnail update");
            const thumbnail = req.files.thumbnailImage;
            const thumbnailImage = await uploadImageToCloudinary(
                thumbnail,
                process.env.FOLDER_NAME
            );
            // Update the thumbnail property directly on the course object
            course.thumbnail = thumbnailImage.secure_url;
        }

        // Iterate through the processed updates object and assign values directly to the course document.
        // Mongoose will handle type conversions (e.g., array fields like 'tag' and 'instructions').
        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                course[key] = updates[key];
            }
        }

        await course.save(); // Save the updated course document to the database

        // Fetch the updated course with all populated fields for the response
        const updatedCourse = await Course.findOne({ _id: courseId })
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();

         

        // Send a success response with the updated course data
        res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        });
    } catch (error) {
        console.error(error); // Log the full error for debugging purposes
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
   exports.getFullCourseDetails = async (req, res) => {
    try {
      const { courseId } = req.body
      const userId = req.user.id
      const courseDetails = await Course.findOne({
        _id: courseId,
      })
        .populate({
          path: "instructor",
          populate: {
            path: "additionalDetails",
          },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        })
        .exec()
  
      let courseProgressCount = await CourseProgress.findOne({
        courseID: courseId,
        userId: userId,
      })
  
      console.log("courseProgressCount : ", courseProgressCount)
  
      if (!courseDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find course with id: ${courseId}`,
        })
      }
  
      // if (courseDetails.status === "Draft") {
      //   return res.status(403).json({
      //     success: false,
      //     message: `Accessing a draft course is forbidden`,
      //   });
      // }
  
      let totalDurationInSeconds = 0
      courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationInSeconds = parseInt(subSection.timeDuration)
          totalDurationInSeconds += timeDurationInSeconds
        })
      })
  
      const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
  
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          totalDuration,
          completedVideos: courseProgressCount?.completedVideos
            ? courseProgressCount?.completedVideos
            : [],
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }
  

   // Get a list of Course for a given Instructor
  exports.getInstructorCourses = async (req, res) => {
    try {
      // Get the instructor ID from the authenticated user or request body
      const instructorId = req.user.id
  
      // Find all courses belonging to the instructor
      const instructorCourses = await Course.find({
        instructor: instructorId,
      }).sort({ createdAt: -1 }).populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()
  
      // Return the instructor's courses
      res.status(200).json({
        success: true,
        data: instructorCourses,
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
      })
    }
  }

   // Delete the Course
  exports.deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.body
  
      // Find the course
      const course = await Course.findById(courseId)
      if (!course) {
        return res.status(404).json({ message: "Course not found" })
      }
  
      // Unenroll students from the course
      const studentsEnrolled = course.studentsEnrolled
      for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
          $pull: { courses: courseId },
        })
      }
  
      // Delete sections and sub-sections
      const courseSections = course.courseContent
      for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId)
        if (section) {
          const subSections = section.subSection
          for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId)
          }
        }
  
        // Delete the section
        await Section.findByIdAndDelete(sectionId)
      }
      

      // Delete the course
      await Course.findByIdAndDelete(courseId)
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      })
    }
  }


