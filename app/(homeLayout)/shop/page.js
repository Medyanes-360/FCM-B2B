"use client";

import React, { useState } from "react";
import CategoryProducts from "@/components/CategoryProducts";
import useCartItemCount from "@/utils/useCartItemCount";
import FixedHeader from "@/components/FixedHeader";

function Shop() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const toggleSearchPanel = () => {
    setIsSearchOpen(!isSearchOpen);
  };
  const cartItemCount = useCartItemCount();

  return (
    <div className="bg-white w-screen xl:w-[1188px] pt-[10px]  ">
      <FixedHeader showShop={true} />
      <div className="flex flex-col items-end  justify-center ">
        <CategoryProducts showSearchAndCart={true} />
      </div>
    </div>
  );
}

export default Shop;
