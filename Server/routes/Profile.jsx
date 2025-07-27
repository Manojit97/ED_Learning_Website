const express = require("express")
const router = express.Router()

const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
} = require("../controllers/Profile.jsx");


// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth.jsx")
// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile",auth,  deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
// Get Enrolled Courses

router.get("/getEnrolledCourses", auth, getEnrolledCourses)
// Profile.jsx
router.get("/getEnrolledCourses", (req, res, next) => {
    console.log("Backend: Request hit /api/v1/profile/getEnrolledCourses route. Calling auth middleware...");
    next();
}, auth, getEnrolledCourses)

router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

module.exports = router