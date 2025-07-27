import { useDropzone } from 'react-dropzone';
import { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { FiUploadCloud } from "react-icons/fi"; // Assuming you use react-icons

function Upload({ name, label, register, setValue, errors, video = false, viewData = null, editData = null }) {
  // Initialize selectedFile with existing data if available (for view/edit modes)
  const [selectedFile, setSelectedFile] = useState(viewData || editData || null);
  const [previewSource, setPreviewSource] = useState(viewData || editData || ""); // For displaying image/video preview

  // Function to handle file drop/selection
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      // Set the File object directly to react-hook-form's state
      setValue(name, file);
      // Create a URL for previewing the selected file
      setPreviewSource(URL.createObjectURL(file));
    }
  };

  // Configure react-dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: video
      ? { "video/*": [".mp4", ".mkv", ".webm", ".avi"] } // Common video formats
      : { "image/*": [".jpeg", ".png", ".jpg", ".gif"] }, // Common image formats
  });

  // Register the field with react-hook-form
  useEffect(() => {
    register(name, { required: true });
    // Cleanup function: revoke the object URL to free up memory
    return () => {
      if (previewSource) {
        URL.revokeObjectURL(previewSource);
      }
    };
  }, [register, name, previewSource]); // Add previewSource to dependencies for cleanup

  // Effect to update selectedFile/previewSource if viewData or editData changes externally
  useEffect(() => {
    if (viewData || editData) {
      const data = viewData || editData;
      setSelectedFile(data);
      // Assuming data is a URL string for existing content
      if (typeof data === 'string') {
        setPreviewSource(data);
      } else if (data instanceof File) {
        // If it's a File object (e.g., from a form reset and re-initialization)
        setPreviewSource(URL.createObjectURL(data));
      }
    }
  }, [viewData, editData]);


  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-[#F1F2FF]" htmlFor={name}>
        {label} {!viewData && <sup className="text-[#EF476F]">*</sup>}
      </label>
      <div
        className={`flex min-h-[160px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-[#585D69] bg-[#2C333F]
          ${isDragActive ? "bg-[#424854]" : ""}`}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {selectedFile ? (
          video ? (
            <ReactPlayer
              aspectRatio="16:9" // You might want to adjust this based on your player's needs
              playsInline
              src={previewSource}
            />
          ) : (
            <div>
              <img
                src={previewSource}
                alt="preview"
                className="max-h-[150px] rounded-md object-cover"
              />
            </div>
          )
        ) : (
          <div className="flex flex-col items-center p-6 text-[#999DAA]">
            <FiUploadCloud className="text-4xl text-[#585D69]" />
            <p className="mt-2 text-[#999DAA]">
              Drag and drop a {video ? "video" : "image"}, or{" "}
              <span className="font-semibold text-[#FFD60A]">click to browse</span>
            </p>
            <p className="mt-2 text-xs text-[#6E727F]">
              Supported formats: {video ? ".mp4, .mkv, .webm" : ".jpg, .jpeg, .png, .gif"} (Max 6MB)
            </p>
          </div>
        )}
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-[#EF476F]">
          {label} is required
        </span>
      )}
    </div>
  );
}

export default Upload;