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
import { useSearchParams } from "next/navigation";
import Navbar from "./OrderDetailsComponents/Navbar";
import TopSection from "./OrderDetailsComponents/TopSection";
import ProductSummary from "./OrderDetailsComponents/ProductSummary";

function OrderDetails() {
  const searchParams = useSearchParams();
  const keys = [
    "id",
    "product",
    "company",
    "description",
    "quantity",
    "quantityCost",
    "totalCost",
    "status",
    "day",
    "month",
    "year",
    "time",
  ];
  const params = Object.fromEntries(
    keys.map((key) => [key, searchParams.get(key)])
  );
  const {
    id,
    product,
    company,
    description,
    quantity,
    quantityCost,
    totalCost,
    status,
    day,
    month,
    year,
    time,
  } = params;
  return (
    <>
      <div className="bg-[url('/backgroundImage.webp')] bg-no-repeat   bg-contain bg-[#6bcdec]">
      <div className="min-h-screen-minus-50 bg-gray-50 w-screen xl:w-[1188px] pt-[10px] mx-auto ">
        <div className="flex items-center mt-[3.15rem] justify-center text-[35px] md:text-[48px] text-CustomGray leading-[41px] font-bold italic mb-[60px]">
          Sipariş Detay Sayfası
        </div>
        <Navbar id={id} />
        <div className="flex flex-col md:gap-4 md:mt-4 md:mx-8 xl:mx-32">
          <TopSection
            day={day}
            month={month}
            year={year}
            time={time}
            description={description}
          />
          <ProductSummary
            product={product}
            company={company}
            quantity={quantity}
            quantityCost={quantityCost}
            totalCost={totalCost}
          />
        </div>
      </div>
      </div>
    </>
  );
}

export default OrderDetails;
