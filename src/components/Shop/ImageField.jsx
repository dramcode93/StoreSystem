import React from "react";
import { FiEdit, FiX } from "react-icons/fi";
import FormPic from "../../form/FormPic";
import Loading from "../Loading/Loading";

const ImageField = ({
  label,
  value,
  isEditing,
  handleImageUpload,
  handleEditToggle,
  handleSaveChanges,
  uploadedImage,
  isLoading,
}) => (
  <li className="secondary  mx-10 rounded-md py-4 px-4 mb-3 list-none">
    <p className="text-gray-200 font-bold text-xl">
      <p className="secondaryF flex">
        {label} :
        {isEditing ? (
          <FiX
            className="cursor-pointer text-2xl text-red-500"
            onClick={() => handleEditToggle(label.toLowerCase())}
          />
        ) : (
          ""
        )}
      </p>
      {isLoading ? (
        <Loading />
      ) : isEditing ? (
        <div className="flex">
          <div className="d-flex items-center justify-center mt-2 gap-6">
            <FormPic
              label="Upload Image"
              name="upload-image"
              onChange={handleImageUpload}
              placeholder="Upload Image"
            />
            <button
              type="button"
              onClick={handleSaveChanges}
              className="h-min rounded-md secondaryBtn font-medium text-xl max-w-60"
            >
              Save Image
            </button>
          </div>
          {uploadedImage && (
            <img
              src={uploadedImage}
              alt="Uploaded"
              className="w-40 h-20 rounded-md"
              crossOrigin="anonymous"
            />
          )}
        </div>
      ) : (
        <>
          <img
            src={value}
            alt="shop"
            className="w-11/12 h-96 rounded-md mx-10"
            crossOrigin="anonymous"
          />

          <FiEdit
            className="secondaryF"
            onClick={() => handleEditToggle(label.toLowerCase())}
          />
        </>
      )}
    </p>
  </li>
);

export default ImageField;
