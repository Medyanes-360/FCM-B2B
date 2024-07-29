"use client";

import React,{ useState } from "react";
import CategoryProducts from "@/components/CategoryProducts";
import SearchPanel from "@/components/SearchPanel";
import { FaSearch } from "react-icons/fa";
function Shop() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const toggleSearchPanel = () => {
    setIsSearchOpen(!isSearchOpen);
  };
  return (
    <div className="bg-white w-screen xl:w-[1188px] pt-[10px]  ">
      <div className="flex flex-col items-end  justify-center ">
        {isSearchOpen && (
          <div className="absolute top-10 rounded-xl  right-0 md:right-0 z-[1000]	bg-white">
            <SearchPanel toggleSearchPanel={toggleSearchPanel} />
          </div>
        )}
        <div className="">
          <div className="flex mt-10 justify-end">
            <button
              className=" text-CustomGray"
              onClick={toggleSearchPanel}
            >
              <FaSearch className="w-[20px] h-[20px] hover:text-LightBlue hover:scale-110 transition-all duration-700 ease-in-out transform mr-2 md:mr-28" />
            </button>
          </div>
          <CategoryProducts />
        </div>
      </div>
    </div>
  );
}

export default Shop;
