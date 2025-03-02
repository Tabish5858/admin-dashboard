/**
 * Client-side Cloudinary configuration and upload utilities
 */
export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    // Use unsigned upload preset
    formData.append("upload_preset", "admindashboard"); // Use your preset name directly

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/doii2gh9d/image/upload`,
      {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to upload image");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};
