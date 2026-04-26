import React, { useRef, useState } from 'react';
import { CLOUDINARY_CONFIG } from '../config/cloudinary';

const PhotoUpload = ({ onPhotoUrlChange, currentPhotoUrl, label = 'Upload Photo' }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(currentPhotoUrl);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    await uploadToCloudinary(file);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);

    try {
      setUploading(true);
      setUploadError('');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('Cloudinary error:', data);
        throw new Error(data.error?.message || 'Upload failed');
      }

      const imageUrl = data.secure_url;

      // Pass URL back to parent component
      onPhotoUrlChange(imageUrl);
      setPreviewUrl(imageUrl);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload photo');
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className={`w-full py-12 px-6 rounded-lg font-semibold transition border-2 ${
          previewUrl
            ? 'border-[#C2A878] bg-transparent text-[#1B3A2F]'
            : 'border-dashed border-[#1B3A2F] bg-transparent text-[#1B3A2F] hover:bg-[#F5F0E6]'
        } disabled:opacity-50 flex flex-col items-center justify-center gap-3`}
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Preview"
              className="w-24 h-24 rounded object-cover border-2 border-[#C2A878]"
            />
            <span className="text-sm text-[#1B3A2F]">✓ Photo Uploaded</span>
          </>
        ) : (
          <>
            <span className="text-2xl">📷</span>
            <span>{uploading ? 'Uploading...' : 'Click to Upload Photo'}</span>
          </>
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      {uploadError && (
        <div className="mt-2 text-red-600 text-sm font-semibold">
          ⚠️ {uploadError}
        </div>
      )}

      <div className="mt-2 text-xs text-[#1B3A2F]">
        Supported formats: JPG, PNG, GIF. Max size: 5MB
      </div>
    </div>
  );
};

export default PhotoUpload;
