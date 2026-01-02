import React, { forwardRef } from "react";
import { TbSearch } from "react-icons/tb";

const SearchButton = forwardRef(
  ({ value, onChange, placeholder = "Search", onClick }, ref) => {
    return (
      <div className="flex items-center bg-white rounded-xl shadow-md px-4 py-4 gap-2 w-full">
        <TbSearch className="text-gray-500" />
        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onClick={onClick}
          className="flex-1 bg-transparent outline-none text-gray-700 text-sm"
        />
      </div>
    );
  }
);

export default SearchButton;
