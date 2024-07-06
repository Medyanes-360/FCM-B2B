"use client";
import React, { useState } from "react";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaTimes } from "react-icons/fa";
import { RiHome3Line } from "react-icons/ri";
import { AiOutlineShop } from "react-icons/ai";
import { MdOutlineContactPage } from "react-icons/md";
import Image from "next/image";

const MobileMenu = ({ header, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex xl:hidden justify-between items-center px-4">
      <button
        className="w-[70px] h-[70px] "
        onClick={() => setIsMenuOpen(true)}
      >
        <GiHamburgerMenu className=" w-[20px] h-[20px] text-white transition-all transform duration-700 ease-in-out hover:text-LightBlue hover:scale-105 " />
      </button>{" "}
      <Link href="/" className="ml-5">
        <Image
          src={header.mainMenuLogo[0].logosrc}
          width={70}
          height={70}
          alt="Çalışkan Arı Mağaza"
          className="p-2"
        />
      </Link>
      {user ? (
        <div className="text-white hover:text-red-500 text-2xl">
          {/* signOut */}
          <Link href="/auth/login" onClick={() => signOut()}>
            <Image
              src="/assets/images/cikisyap.svg"
              width={100}
              height={100}
              alt=""
              className="mx-4 w-28 hover:scale-110 transition-all transform ease-in-out duration-700"
            />
          </Link>
        </div>
      ) : null}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div
            className={`absolute left-0 top-0 h-full  bg-white w-[300px] overflow-y-auto
            `}
          >
            <div className="flex items-center px-4 py-4 relative">
              <Link href="/">
                <Image
                  src={header.mainMenuLogo[0].logosrc}
                  width={90}
                  height={90}
                  alt="Çalışkan Arı Mağaza"
                  className="p-2"
                />
              </Link>
            </div>
            <div className=" mt-2 mr-4 h-[70px] flex justify-end absolute top-0 right-0">
              <button onClick={() => setIsMenuOpen(false)}>
                <FaTimes className=" w-[20px] h-[20px] text-[#555555] hover:text-red-600 hover:scale-110 transition duration-300 ease-in-out transform " />
              </button>
            </div>
            <div className="flex flex-row items-center text-LightBlue px-[30px] py-[15px] text-[13px] font-extrabold uppercase">
              <Link href={"#"} className="">
                <button className="flex flex-row items-center gap-3">
                  <RiHome3Line className="w-5 h-5" />
                  <span className="hover:scale-105 transition-all duration-700 ease-in-out transform">
                    ANASAYFA
                  </span>
                </button>
              </Link>
            </div>
            <div className="flex flex-row items-center text-LightBlue px-[30px] py-[15px] text-[13px] font-extrabold uppercase ">
              <button className="flex flex-row items-center gap-3">
                <AiOutlineShop className="w-5 h-5" />
                <span className="hover:scale-105 transition-all duration-700 ease-in-out transform">
                  MAĞAZA
                </span>
              </button>
            </div>
            <div className="flex flex-row items-center text-LightBlue px-[30px] py-[15px] text-[13px] font-extrabold uppercase ">
              <button className="flex flex-row items-center justify-center gap-3">
                <MdOutlineContactPage className="w-5 h-5" />
                <span className="hover:scale-105 transition-all duration-700 ease-in-out transform ">
                  İLETİŞİM
                </span>
              </button>
            </div>
            {!user ? (
              <div className=" flex justify-center">
                <Link
                  href="/auth/login"
                  className="hover:scale-105 transition-all duration-700 ease-in-out transform"
                >
                  <Image
                    src="/assets/images/giris.svg"
                    alt=""
                    width={50}
                    height={50}
                    className="w-32"
                  />
                </Link>
              </div>
            ) : (
              <div className="text-white hover:text-red-500 text-2xl flex justify-center mt-24">
                {/* signOut */}
                <Link href="/auth/login" onClick={() => signOut()}>
                  <Image
                    src="/assets/images/cikisyap.svg"
                    width={100}
                    height={100}
                    alt=""
                    className="mx-4 w-28 hover:scale-110 transition-all transform ease-in-out duration-700"
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
