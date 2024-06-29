import React, { useState } from "react";

function FormPic({ label, name, onChange }) {
  // const [fileList, setFileList] = useState([]);

  // const handleFileChange = (e) => {
  //   const selectedFiles = Array.from(e.target.files).slice(0, 5); // Limit to 5 files
  //   const newFiles = [...fileList, ...selectedFiles.slice(0, 5 - fileList.length)]; // Append new files to existing fileList
  //   setFileList(newFiles);
  //   onChange(newFiles); // Pass newFiles to the onChange function
  // };

  return (
    <div>
      <label
        htmlFor="file-upload"
        className="flex items-center gap-2 secondaryBtn2
                   outline-none font-medium rounded-md text-xl px-5 py-2.5 
                   text-center ease-linear duration-100 w-60"
      >
        {label}
      </label>
      <input
        type="file"
        id="file-upload"
        name={name}
        className="hidden"
        onChange={onChange}
        multiple
        accept="image/*"
        alt="Upload Image"
      />

      {/* {fileList.length > 0 && (
        <div className="d-flex gap-1 mt-2">
          {fileList.map((file, index) => (
            <div key={index}>
              <img
                src={URL.createObjectURL(file)}
                alt={`Uploaded ${index + 1}`}
                style={{ maxWidth: "100%", maxHeight: "50px" }}
              />
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
}

export default FormPic;
