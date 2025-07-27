const subSection = require("../models/SubSection.jsx");
const Section = require("../models/Section.jsx");
const {uploadImageToCloudinary} = require("../utils/imageUploader.jsx");
require("dotenv").config();


// create SubSection
exports.createSubSection = async (req, res)=>{
    try{
        // fetch data from Req body
        const {sectionId, title,   description} = req.body;
        // extract file/video
        const video = req.files.videoFile;
        // validate
        if(!sectionId || !title ||  !description || !video){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }

        // upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        // create a sub-section
        const SubSectionDetails = await subSection.create({
            title:title,
            // timeDuration:timeDuration,
            videoUrl:uploadDetails.secure_url,
            description:description,
        })
        // update section with this subsection object ID
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
                                                                {
                                                                    $push:{
                                                                        subSection:SubSectionDetails._id,
                                                                    }
                                                                },
                                                                {new:true});
        const fullUpdatedSection = await Section.findById(sectionId).populate("subSection").exec();
        // HW: Log updated section here, after adding populate query
        // return response
        return res.status(200).json({
            success:true,
            message:"Sub Section Created Successfully",
            updatedSection:fullUpdatedSection
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:err.message
        })
    }
}

// update Subsection
exports.updateSubSection = async (req, res) => {
    try {
      const { sectionId,subSectionId, title, description } = req.body
      const SubSection = await subSection.findById(subSectionId)
  
      if (!SubSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        SubSection.title = title
      }
  
      if (description !== undefined) {
        SubSection.description = description
      }
      if (req.files && req.files.videoFile !== undefined) {
        const video = req.files.videoFile
        const uploadDetails = await uploadImageToCloudinary(
          video,
          process.env.FOLDER_NAME
        )
        SubSection.videoUrl = uploadDetails.secure_url
        SubSection.timeDuration = `${uploadDetails.duration}`
      }
  
      await SubSection.save()
  
      const updatedSection = await Section.findById(sectionId).populate("subSection")


      return res.json({
        success: true,
        data:updatedSection,
        message: "Section updated successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the Subsection",
      })
    }
  }

// delete Subsection
exports.deleteSubSection = async (req,res) =>{
    try {
        
        const {subSectionId,sectionId } = req.body;
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
              $pull: {
                subSection: subSectionId,
              },
            }
          )

        if(!subSectionId) {
            return res.status(400).json({
                success:false,
                message:'SubSection Id to be deleted is required',
            });
        }

        
        const SubSection = await subSection.findByIdAndDelete({ _id: subSectionId })
  
      if (!SubSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }

      const updatedSection = await Section.findById(sectionId).populate("subSection")
  
      return res.json({
        success: true,
        data:updatedSection,
        message: "SubSection deleted successfully",
      })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'Failed to delete SubSection',
            error: error.message,
        })
    }
}


