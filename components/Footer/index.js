"use client";
import footerStore from "@/utils/footerStore";
import Image from "next/image";
import React from "react";
import { AiFillPhone } from "react-icons/ai";

function Footer() {
  const { footerLogo } = footerStore();

  return (
    <footer id="footer" className="bottom-0 bg-CustomGray mt-[40px]">
      <div className=" pt-[30px] lg:mx-[50px] py-3 w-screen lg:w-[1088px]">
        <div className="flex md:flex-row md:justify-evenly gap-x-5">
          <div className="flex flex-col items-center px-[55px] xl:px-1">
            <div className="rounded-full bg-CustomGray w-[90px] h-[90px] flex items-center justify-center hover:bg-LightBlue transition duration-500 ease-in-out transform px-[15px] ">
              <Image
                src={footerLogo[0].logosrc}
                width={70}
                height={70}
                alt="Çalışkan Arı Mağaza"
              />
            </div>
            <div className="text-lg text-white font-medium">Çalışkan Arı Yayınları</div>
            <div className="flex justify-center items-center underline gap-x-1 text-gray-100">
              <AiFillPhone /> <a href="tel:+902126393912">(0212) 639 39 12</a>
            </div>
          </div>
          <div className="flex justify-center items-center w-56 text-gray-100">
            <div>
              KARTALTEPE MH. 5. ŞİRİN SOKAK NO: 6 - 8 SEFAKÖY, 34295
              Küçükçekmece
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center mt-10 text-sm text-gray-100">Bu panel yanlızca çalışkan arı ve anlaşmalı olduğu bayiler tarafından kullanılmaktadır.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
