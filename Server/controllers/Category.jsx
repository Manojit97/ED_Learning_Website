const Category = require("../models/category.jsx");
// create Category handler functions
const Course  =  require("../models/Course.jsx")
exports.createCategory = async (req, res) =>{
    try{
           // fetch data
           const {name, description} = req.body;
           // validation
           if(!name || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
           }
           // create entry in DB
           const categoryDetails = await Category.create({
            name:name,
            description:description,
           });
           console.log(categoryDetails);

           // return response
           return res.status(200).json({
            success:true,
            message:"Category created Successfully",
           })
    }
    catch(err){
         return res.status(500).json({
            success:false,
            message:err.message,
         })
    }
}


// get all category handler
exports.showAllCategory = async(req, res) =>{
    try{
           const allCategory = await Category.find({}, {name:true, description:true});
           res.status(200).json({
            success:true,
            message:"All Category returned Successfully",
            allCategory,
           })
    }
    catch(err){
           return res.status(500).json({
            success:false,
            message:err.message,
         })
    }
}


 // Helper function to get a random integer
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}


 // Inside src/controllers/Category.jsx

exports.categoryPageDetails = async (req, res) => {
    try {
        const { categoryId } = req.body;
        console.log("Backend: categoryId received:", categoryId);

        // Get courses for the specified category
        const selectedCourses = await Category.findById(categoryId)
            .populate({
                path: "course",
                match: { status: "Published" },
                populate: [
                    { path: "instructor" },
                    { path: "ratingAndReviews" }
                ],
            })
            .exec();
        console.log("Backend: selectedCourses fetched.");

        // Handle case where category is not found or has no courses
        if (!selectedCourses || !selectedCourses.course || selectedCourses.course.length === 0) {
            console.log("Backend: No courses found for the selected category, sending success: true.");
            return res.status(200).json({ // Changed status to 200
                success: true, // Changed success to true
                message: "No courses found for the selected category.",
                selectedCategory: { // Returning a structured object for consistency
                    _id: selectedCourses?._id || categoryId,
                    name: selectedCourses?.name || "Unknown Category",
                    description: selectedCourses?.description || "",
                    course: [] // Explicitly an empty array for courses
                },
                differentCourses: [], // Can be empty or populated if your logic allows for it without a selectedCategory
                mostSellingCourses: [], // Can be empty or populated
            });
        }

        // Get courses for other categories
        const differentCourses = await Category.find({
            _id: { $ne: categoryId },
        })
        .populate({
            path: "course",
            match: { status: "Published" },
            populate: [
                { path: "instructor" },
                { path: "ratingAndReviews" }
            ],
        })
        .exec();
        console.log("Backend: differentCourses fetched.");

        // Get top-selling courses across all categories
        const mostSellingCourses = await Course.find({ status: 'Published' })
            .sort({ "studentsEnrolled.length": -1 })
            .populate("ratingAndReviews")
            .exec();
        console.log("Backend: mostSellingCourses fetched.");
            
        res.status(200).json({
            selectedCategory: selectedCourses,
            differentCourses: differentCourses,
            mostSellingCourses: mostSellingCourses,
            success:true
        })
        console.log("Backend: Full category page data sent successfully.");

    } catch (error) {
        console.error("Backend: ERROR in categoryPageDetails:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}