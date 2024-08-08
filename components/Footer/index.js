"use client";
import useFooterStore from "@/utils/footerStore"; // Assuming it's a hook
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { AiOutlinePhone } from "react-icons/ai";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

function Footer() {
  const { footerLogo } = useFooterStore();

  return (
    <footer id="footer" className="bg-CustomGray mt-[40px] w-full">
      <div  className="pb-3 w-screen lg:w-[1188px] py-3 md:py-10 text-gray-300">
        <div className="flex flex-col gap-y-10">
          <div className="flex flex-col md:flex-row md:justify-evenly gap-5 p-4">
            {/* Logo */}
            <div className="flex flex-col items-center xl:px-1">
              <div className="rounded-full bg-CustomGray w-[90px] h-[90px] flex items-center justify-center hover:bg-LightBlue transition duration-500 ease-in-out transform px-[15px]">
                <Image
                  src={footerLogo[0].logosrc}
                  width={70}
                  height={70}
                  alt="Çalışkan Arı Mağaza"
                />
              </div>
              {/* isim */}
              <div className="text-center mt-2">
                <div className="text-lg font-medium">
                  Çalışkan Arı Yayınları
                </div>
              </div>
            </div>
            {/* Sayfalar */}
            <div className="flex flex-col items-center md:items-start justify-evenly gap-2 mb-4 md:mb-0">
              <Link
                className="hover:text-LightBlue/75 hover:underline underline-offset-3 transition-all duration-75"
                href={"/"}
              >
                Ana sayfa
              </Link>
              <Link
                className="hover:text-LightBlue/75 hover:underline underline-offset-3 transition-all duration-75"
                href={"/shop"}
              >
                Mağaza
              </Link>
              <Link
                className="hover:text-LightBlue/75 hover:underline underline-offset-3 transition-all duration-75"
                href={"/cart"}
              >
                Sepet
              </Link>
            </div>
            {/** Sosyal Medya */}
            <div className="flex flex-col md:items-start justify-evenly mt-4 gap-2">
             
              <div className="flex mr-3 md:ml-0 justify-center items-center  gap-x-1 hover:text-green-600 transition-all duration-75">
                <AiOutlinePhone className="w-8 h-6" />
                <a
                  className="hover:text-LightBlue/75 transition-all duration-75"
                  href="tel:+902126393912"
                >
                  (0212) 639 39 12
                </a>
              </div>
              <div className="flex justify-center items-center mr-14 gap-x-1 hover:text-green-500 transition-all duration-75">
                <FaWhatsapp className="w-8 h-6" />
                <a
                  className="hover:text-LightBlue/75 transition-all duration-75"
                  href="https://wa.me/+905550013912"
                >
                  Whatsapp
                </a>
              </div>
              <div className="flex justify-center items-center mr-14  gap-x-1 hover:text-pink-500 transition-all duration-75">
                <FaInstagram className="w-8 h-6" />
                <a
                  className="hover:text-LightBlue/75 transition-all duration-75"
                  href="https://www.instagram.com/caliskanariyayincilik?igsh=MXFzODRzeDlnY3R2bg=="
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
          {/* Adres */}
          <div className="flex justify-center items-center md:border-t w-full md:w-2/3 md:mx-auto pt-5 md:pt-10 mt-3">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.955757648957!2d28.798848983261117!3d41.00434154581372!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa3f696d37023%3A0x696073342d19d92e!2zw4dBTEnFnktBTiBBUsSwIFlBWUlOTEFSSQ!5e0!3m2!1str!2str!4v1723046034048!5m2!1str!2str"
              className="w-full md:w-3/5 lg:w-4/5 h-80"
              style={{ border: "0" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Not */}
        <div className="h-10 mt-8 flex justify-center items-end text-center text-xs">
          Bu panel yalnızca Çalışkan Arı ve anlaşmalı olduğu bayiler tarafından
          kullanılmaktadır.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
