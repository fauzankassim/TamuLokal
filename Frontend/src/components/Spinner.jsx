import React from "react";

const Spinner = ({ loading, size = 10 }) => {
  if (!loading) return null;

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div
        style={{ animationDuration: "1000ms" }}
        className={`w-${size} h-${size} border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default Spinner;
