"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import Image from "next/image";
import { TbShoppingCartX } from "react-icons/tb";
import Link from "next/link";
import categoryStore from "@/utils/categoryStore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdDeleteForever } from "react-icons/md";
import { IoMdImages } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GiCancel } from "react-icons/gi";
import { RiShoppingCartLine } from "react-icons/ri";
import { RxUpdate } from "react-icons/rx";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";

function OrderDetails({ order }) {
  // console.log(order);
  return (
    <div className="flex justify-center items-center">
      <div
        id="shoppingcart"
        className="bg-white flex items-center flex-col py-[35px] sm:py-[60px] w-screen lg:w-[1188px] min-h-[600px]"
      >
        <div className="flex items-center justify-center text-[35px] md:text-[48px] text-CustomGray leading-[41px] font-bold italic mb-[45px]">
          Sipariş Özeti
        </div>

        <div className="px-5 sm:px-0 ">
          <table className="w-screen lg:w-[1188px] px-5 py-3 text-[12px] md:text-[14px] lg:text-[16px] mx-auto sm:mx-0  shadow-lg rounded-md">
            <thead className=" px-5 py-3 bg-DarkBlue text-white tracking-wide ">
              <tr>
                <th className="px-5 py-3 ">
                  <span className="flex items-center justify-center">
                    <IoMdImages className="w-6 h-6 " />
                  </span>
                </th>
                <th className="px-5 py-3">
                  <p className="flex items-center justify-center">Ürün Adı</p>
                </th>
                <th className="px-5 py-3 hidden lg:table-cell">Birim</th>
                <th className=" px-5 py-3 hidden lg:table-cell">İsk.</th>
                <th className=" px-5 py-3 hidden lg:table-cell w-32">
                  Birim Net
                </th>
                <th className=" px-5 py-3 w-32 sm:w-40">Toplam Tutar</th>
                <th className=" px-5 py-3 hidden lg:table-cell">Stok</th>
                <th className=" px-5 py-3">
                  <p className="flex justify-center ">Adet</p>
                </th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((item, index) => (
                <tr key={index} className="shadow-sm">
                  <td className=" px-2 sm:px-5 py-5  ">
                    <div className="flex flex-col sm:flex-row items-center text-center">
                      <Image
                        src={item.imgPath}
                        alt={item.name}
                        width={70}
                        height={70}
                      />
                    </div>
                  </td>
                  <td className=" px-2 sm:px-5 py-3 ">
                    <div className="flex flex-col sm:flex-row items-center ">
                      {item.name}
                    </div>
                  </td>
                  <td className=" px-5 py-3  hidden lg:table-cell">
                    <span className="flex items-center justify-center">
                      ₺{item.price}
                    </span>
                  </td>

                  <td className=" px-5 py-3 hidden lg:table-cell">
                    <p className="w-full flex items-center justify-center">
                      ₺ 200
                    </p>
                  </td>
                  <td className=" px-5 py-3">
                    <p className="w-full flex items-center justify-center">
                      ₺ 200
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-center mt-24">
            {/* <div className="w-full lg:w-1/2 ">
            <OrderInformation />
          </div> */}
            <div className="w-full lg:w-1/2 mt-12 lg:mt-0">
              <div className="flex flex-col items-center ">
                <div className="flex flex-col items-center justify-center bg-slate-100 w-[350px] sm:w-[450px] rounded-2xl shadow-lg p-10">
                  <div className="flex items-center justify-end">
                    {" "}
                    <h1 className="text-[20px] md:text-[32px] font-bold text-CustomGray flex items-center justify-center ">
                      Sipariş Özeti
                    </h1>
                  </div>

                  <div className="flex justify-center sm:justify-end mb-12 text-[16px]">
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-row gap-12 border-b border-slate-200 py-4">
                        <p className="w-[100px] flex justify-start font-bold text-CustomGray">
                          <span className="">Ara Toplam</span>
                        </p>
                        <p className="w-[100px] flex justify-end font-bold text-CustomGray">
                          <span className="">₺100 </span>
                        </p>
                      </div>
                      <div className="flex flex-row gap-12">
                        <p className="w-[100px] flex justify-start font-medium text-slate-400">
                          <span className="">İndirim</span>
                        </p>
                        <p className="w-[100px] flex justify-end font-medium text-slate-400">
                          <span className="">₺100</span>
                        </p>
                      </div>
                      <div className="flex flex-row gap-12 ">
                        <p className="w-[100px] flex justify-start font-medium text-slate-400">
                          <span className="">KDV</span>
                        </p>
                        <p className="w-[100px] flex justify-end font-medium text-slate-400">
                          <span className="">₺0,00 </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-12 text-[24px] mb-12">
                    <p className="w-[150px] flex justify-start font-extrabold text-CustomGray">
                      <span className="">Toplam</span>
                    </p>
                    <p className="w-[100px] flex justify-end font-extrabold text-CustomGray">
                      <span className="">₺100</span>
                    </p>
                  </div>
                  <div className="flex flex-row items-center justify-center gap-5">
                    <div className="group">
                      <button
                        type="submit"
                        className="flex flex-row items-center justify-center gap-2 ml-3 text-white font-bold hover:scale-105 transition-all transform ease-out duration-500 cursor-pointer bg-gradient-to-r from-LightBlue to-sky-700 pl-3 pr-11 py-2 rounded-full relative w-[250px] h-[58px] text-[18px]"
                      >
                        Geri
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
}

export default OrderDetails;
