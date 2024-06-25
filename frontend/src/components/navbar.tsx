import React from "react";
import logo from "../images/logo.png";

interface NavbarProps {
  onGetStartedClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onGetStartedClick }) => {
  return (
    <nav className="flex flex-row justify-between items-center py-3 px-2 md:px-14 w-full z-50">
      <div className="flex flex-row items-center">
        <img src={logo} alt="logo" width={60} height={60} />{" "}
        <h1 className="text-lg sm:text-xl text-primary font-extrabold tracking-wide sm:ml-1.5">
          Reading Planner
        </h1>
      </div>
      <button
        className="px-6 sm:px-12 h-12   bg-primary hover:bg-opacity-90 text-white font-mirza font-semibold rounded-lg text-base sm:text-lg hover:cursor-pointer tracking-wide"
        onClick={onGetStartedClick}
      >
        Get Started
      </button>
    </nav>
  );
};
