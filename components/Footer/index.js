"use client";
import footerStore from "@/utils/footerStore";
import Image from "next/image";
import React from "react";

function Footer() {
  const { footerLogo } = footerStore();

  return (
    <footer id="footer" className="bottom-0 bg-white mt-[40px] mb-[50px]">
      <div className="border-t border-slate-100 pt-[30px] lg:mx-[50px] w-screen lg:w-[1088px]">
        <div className="flex  justify-end w-full px-[50px] xl:px-0">
          <div className="rounded-full bg-CustomGray w-[90px] h-[90px] flex items-center justify-center hover:bg-LightBlue transition duration-500 ease-in-out transform px-[15px] ">
            <Image
              src={footerLogo[0].logosrc}
              width={70}
              height={70}
              alt="Çalışkan Arı Mağaza"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
