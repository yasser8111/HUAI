import React from "react";
import { Link } from "react-router-dom";

const Header = ({ onToggleTheme, isDarkMode }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-[1000] py-[15px] bg-light-200 dark:bg-dark-100">
      <div className="mx-auto flex justify-between items-center px-3">
        <div className="flex gap-2">
          <Link
            to="/info"
            className="w-10 h-10 flex items-center justify-center cursor-pointer  group hover:bg-light-200 dark:hover:bg-dark-300 rounded-full"
          >
            <i className="fa-solid fa-info text-light-600 dark:text-dark-600 group-hover:text-black dark:group-hover:text-white text-lg"></i>
          </Link>

          <button
            onClick={onToggleTheme}
            className="w-10 h-10 flex items-center justify-center cursor-pointer group hover:bg-light-200 dark:hover:bg-dark-300 rounded-full"
          >
            <i
              className={`fa-solid ${
                isDarkMode ? "fa-sun" : "fa-moon"
              } text-light-600 dark:text-dark-600 group-hover:text-black dark:group-hover:text-white text-lg`}
            ></i>
          </button>
        </div>

        <Link to="/" className="no-underline">
          <h3 className="font-logo text-lg font-bold text-light-600 dark:text-dark-600 hover:text-black dark:hover:text-white m-0">
            HUAI
          </h3>
        </Link>
      </div>
    </header>
  );
};

export default Header;
