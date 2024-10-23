import React, { useState } from "react";
import dynamic from "next/dynamic"; // Dynamic import to prevent SSR issues with React-Quill
import "react-quill/dist/quill.snow.css"; // Styles for the editor

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Editor = ({ value, onChange }) => {
  return (
    <div>
      <ReactQuill
        value={value}
        onChange={onChange}
        theme="snow" // Snow theme is Quill's default theme
      />
    </div>
  );
};

export default Editor;
