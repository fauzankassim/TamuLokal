import React from "react";
import { TbChevronLeft } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const Header = ({ title, backPath=-1 }) => {
  const navigate = useNavigate();

  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(backPath)}
          className="text-[var(--black)] hover:text-[var(--orange)] transition"
        >
          <TbChevronLeft className="text-2xl" />
        </button>

        <h1 className="text-xl font-semibold text-[var(--black)]">{title}</h1>
      </div>
    </div>
  );
};

export default Header;
