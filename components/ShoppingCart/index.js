"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdImages } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GiCancel } from "react-icons/gi";
import { RiShoppingCartLine } from "react-icons/ri";
import OrderConfirmation from "@/components/OrderConfirmation/index.";
import Link from "next/link";
import { TbShoppingCartX } from "react-icons/tb";
import { RxUpdate } from "react-icons/rx";
import Loading from "../Loading";

const ShoppingCart = () => {
  const [storedCart, setStoredCart] = useState([]); // Sepetteki ürünlerin tutulacağı state
  const [totalPrice, setTotalPrice] = useState(0); // Sepet toplam tutarının tutulacağı state
  const [confirmDelete, setConfirmDelete] = useState(false); // Ürün silme onayının tutulacağı state
  const [deleteIndex, setDeleteIndex] = useState(null); // Silinecek ürünün indexinin tutulacağı state
  const [updatingIndex, setUpdatingIndex] = useState(null); // Güncellenen ürünün indexinin tutulacağı state
  const [confirmOrder, setConfirmOrder] = useState(false); // Sipariş onayının tutulacağı state
  const [loading, setLoading] = useState(true);

  // Sipariş onayı işlevi
  const handleConfirmOrder = () => {
    setConfirmOrder(true);
  };

  // Sipariş onayı kapatma işlevi
  const handleCloseOrderConfirmation = () => {
    setConfirmOrder(false);
  };

  // Komponent ilk yüklendiğinde localStorage'dan sepet verilerini al
  useEffect(() => {
    if (typeof window !== "undefined") {
      const cartData = localStorage.getItem("cart");
      const parsedCart = cartData ? JSON.parse(cartData) : [];
      setStoredCart(parsedCart);
      updateTotalPrice(parsedCart); // Toplam tutarı güncelle
      setLoading(false);
    }
  }, []);

  // Ürün miktarının değişim işlevi
  const handleQuantityChange = async (index, quantity) => {
    setUpdatingIndex(index); // Güncellenen ürün index'i ayarla
    const updatedCart = [...storedCart];
    updatedCart[index].quantity = quantity; // Yeni miktarı ayarla
    setStoredCart(updatedCart); // Sepet verilerini güncelle
    localStorage.setItem("cart", JSON.stringify(updatedCart)); // Güncellenmiş sepet verilerini localStorage'a kaydet

    // Total fiyatı ve toast bildirimi gösterimini geciktir
    setTimeout(() => {
      updateTotalPrice(updatedCart); // Toplam tutarı güncelle

      // Başarılı güncelleme bildirimi toast ile göster
      toast.success("Ürün adedi başarıyla güncellendi.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setUpdatingIndex(null); // Güncelleme durumunu sıfırla
    }, 2000); // 2 saniye gecikme sonrası işlemleri gerçekleştir
  };

  // Toplam fiyatı güncelleme işlevi
  const updateTotalPrice = (cart) => {
    const totalPrice = cart.reduce((acc, item) => {
      return acc + item.STKOZKOD5 * item.quantity; // Ürünlerin miktarı ile birim fiyatını çarpıp toplam tutarı hesapla
    }, 0);
    setTotalPrice(totalPrice); // Toplam tutarı güncelle
  };

  // Ürün silme işlevi
  const handleDeleteItem = (index) => {
    setDeleteIndex(index); // Silinecek ürün index'ini ayarla
    setConfirmDelete(true); // Silme onayını göster
  };

  // Silme işlemini iptal etme işlevi
  const cancelDelete = () => {
    setConfirmDelete(false); // Silme onayını kapat
    setDeleteIndex(null); // Silinecek ürün index'ini sıfırla
  };

  // Ürün silme işlemini onaylama işlevi
  const confirmDeleteItem = () => {
    if (deleteIndex !== null) {
      const updatedCart = [...storedCart];
      updatedCart.splice(deleteIndex, 1); // İlgili index'teki ürünü sil
      setStoredCart(updatedCart); // Sepet verilerini güncelle
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Güncellenmiş sepet verilerini localStorage'a kaydet

      // Başarılı silme bildirimi toast ile göster
      toast.success("Ürün sepetten başarıyla silindi.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      updateTotalPrice(updatedCart); // Toplam tutarı güncelle

      setConfirmDelete(false); // Silme onayını kapat
      setDeleteIndex(null); // Silinecek ürün index'ini sıfırla
    }
  };

  return (
   <>
    {loading ? (
     <Loading/>
    ) : (
      <div
      id="shoppingcart"
      className="bg-white flex items-center flex-col py-[35px] sm:py-[60px] w-screen lg:w-[1188px] h-full"
    >
      <div className="flex items-center justify-center text-[35px] md:text-[48px] text-CustomGray leading-[41px] font-bold italic mb-[60px]">
        Sepet
      </div>
      {storedCart.length === 0 ? (
        // Sepet boş ise gösterilecek içerik
        <div className="flex items-center  justify-center flex-col">
          <span className="flex items-center justify-center my-[20px]">
            <TbShoppingCartX className="w-[140px] h-[140px] text-CustomGray" />
          </span>
          <span className="text-[20px] text-CustomGray font-bold my-[20px]">
            Sepetiniz şu anda boş.
          </span>
          <Link href={"#"}>
            <button className="bg-LightBlue text-white px-[24px] py-[10px] rounded-md font-bold text-[14px] mt-[50px] mb-[15px] hover:scale-105 transition-all duration-500 transform ease-in-out hover:bg-LightBlue/50">
              Mağazaya geri dön
            </button>
          </Link>
        </div>
      ) : (
        // Sepet dolu ise gösterilecek içerik
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ">
            <div className="px-5 sm:px-0">
              <table className="w-full lg:w-[1188px] px-5 py-3 text-[12px] md:text-[14px] lg:text-[16px] mx-auto sm:mx-0 shadow-lg rounded-md">
                <thead className="px-5 py-3 bg-DarkBlue text-white tracking-wide">
                  <tr>
                    <th className="px-5 py-3 hidden sm:table-cell">
                      <span className="flex items-center justify-center ">
                        <IoMdImages className="w-6 h-6" />
                      </span>
                    </th>
                    <th className="px-5 py-3">
                      <p className="flex items-center justify-center">
                        Ürün Adı
                      </p>
                    </th>
                    <th className="px-5 py-3 hidden lg:table-cell">Birim</th>
                    <th className="px-5 py-3 hidden lg:table-cell">İsk.</th>
                    <th className="px-5 py-3 hidden lg:table-cell w-32">
                      Birim Net
                    </th>
                    <th className="px-5 py-3 w-32 sm:w-40">Toplam Tutar</th>
                    <th className="px-5 py-3">
                      <p className="flex justify-center">Adet</p>
                    </th>
                    <th className="px-3 sm:px-5 py-3">
                      <span className="flex items-center justify-center">
                        <BsThreeDotsVertical className="w-5 h-5" />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {storedCart.map((item, index) => (
                    <tr key={item.STKKOD} className="shadow-sm">
                      <td className="px-2 sm:px-5 py-5 hidden sm:table-cell">
                        <div className="flex flex-col sm:flex-row items-center text-center ">
                          <Image
                            src={
                              "https://caliskanari.com/wp-content/uploads/2022/11/X7-420x420.png.webp"
                            }
                            alt={"image"}
                            width={70}
                            height={70}
                          />
                        </div>
                      </td>
                      <td className="px-2 sm:px-5 py-3">
                        <div className="flex flex-col sm:flex-row items-center">
                          <span className="w-[70px] sm:w-full text-LightBlue font-medium flex text-center">
                            {item.STKCINSI}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell">
                        <span className="flex items-center justify-center w-[70px]">
                          ₺{item.STKOZKOD5}
                        </span>
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell">
                        <span className="flex items-center justify-center">
                          %0
                        </span>
                      </td>
                      <td className="px-5 py-3 hidden lg:table-cell">
                        <p className="w-full flex items-center justify-center">
                          ₺{item.STKOZKOD5}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="w-full flex items-center justify-center">
                          ₺{item.STKOZKOD5 * item.quantity}
                        </p>
                      </td>
                      <td className="px-2 sm:px-5 py-3">
                        <span className="flex items-center justify-center">
                          <Formik
                            key={item.STKKOD} // Unique key for Formik instance
                            initialValues={{ quantity: item.quantity }}
                            validationSchema={Yup.object().shape({
                              quantity: Yup.number()
                                .min(1, "En az 1 olmalı")
                                .required("Zorunlu alan"),
                            })}
                            onSubmit={(values, { resetForm }) => {
                              handleQuantityChange(index, values.quantity);
                              resetForm({ values });
                            }}
                          >
                            {({
                              values,
                              handleChange,
                              handleSubmit,
                              dirty,
                              isValid,
                            }) => (
                              <Form className="flex items-center">
                                <div className="border border-CustomGray/25 rounded-full py-2 px-2 flex flex-row items-center justify-center">
                                  <button
                                    type="button"
                                    className="text-sm sm:text-xl text-LightBlue hover:scale-110 transition duration-500 ease-in-out transform"
                                    onClick={() => {
                                      if (values.quantity > 1) {
                                        handleChange({
                                          target: {
                                            name: "quantity",
                                            value: values.quantity - 1,
                                          },
                                        });
                                      }
                                    }}
                                  >
                                    <AiOutlineMinus />
                                  </button>
                                  <Field
                                    min="1"
                                    name="quantity"
                                    className="w-6 sm:w-12 p-1 text-center outline-none"
                                    value={values.quantity}
                                  />
                                  <button
                                    type="button"
                                    className="text-sm sm:text-xl text-LightBlue hover:scale-110 transition duration-500 ease-in-out transform"
                                    onClick={() =>
                                      handleChange({
                                        target: {
                                          name: "quantity",
                                          value: values.quantity + 1,
                                        },
                                      })
                                    }
                                  >
                                    <AiOutlinePlus />
                                  </button>
                                </div>
                                <div>
                                  <button
                                    id={`updateButton-${index}`} // Unique ID for each update button
                                    type="submit"
                                    className={`px-4 ml-2 py-2 rounded-md sm:ml-[24px] w-[101px] h-[40px] hidden sm:flex items-center justify-center ${
                                      dirty && isValid
                                        ? "bg-LightBlue text-white hover:scale-105 transition-all duration-700 transform ease-in-out hover:bg-LightBlue"
                                        : "bg-gray-300 text-white cursor-not-allowed"
                                    }`}
                                    onClick={handleSubmit}
                                    disabled={
                                      !dirty ||
                                      !isValid ||
                                      updatingIndex === index
                                    }
                                  >
                                    {updatingIndex === index ? ( // Render loading animation if updating
                                      <div className="flex flex-row items-center justify-center gap-1">
                                        <div className="h-1 w-1 rounded-full animate-pulse bg-LightBlue"></div>
                                        <div className="h-1 w-1 rounded-full animate-pulse bg-LightBlue"></div>
                                        <div className="h-1 w-1 rounded-full animate-pulse bg-LightBlue"></div>
                                      </div>
                                    ) : (
                                      "Güncelle"
                                    )}
                                  </button>
                                  <button
                                    id={`updateButton-${index}`} // Unique ID for each update button
                                    type="submit"
                                    className={`flex sm:hidden items-center justify-center w-[20px] ml-2 ${
                                      dirty && isValid
                                        ? "text-LightBlue hover:scale-105 transition-all duration-700 transform ease-in-out hover:text-LightBlue"
                                        : "text-gray-300  cursor-not-allowed"
                                    }`}
                                    onClick={handleSubmit}
                                    disabled={
                                      !dirty ||
                                      !isValid ||
                                      updatingIndex === index
                                    }
                                  >
                                    {updatingIndex === index ? ( // Render loading animation if updating
                                      <div className="flex flex-row items-center justify-center gap-1 ">
                                        <div className="h-1 w-1 rounded-full animate-pulse bg-LightBlue"></div>
                                        <div className="h-1 w-1 rounded-full animate-pulse bg-LightBlue"></div>
                                        <div className="h-1 w-1 rounded-full animate-pulse bg-LightBlue"></div>
                                      </div>
                                    ) : (
                                      <RxUpdate className={`w-4 h-4 `} />
                                    )}
                                  </button>
                                </div>
                              </Form>
                            )}
                          </Formik>
                        </span>
                      </td>
                      <td className="px-2 sm:px-5 py-3 text-center">
                        <button
                          className="flex items-center justify-center"
                          onClick={() => handleDeleteItem(index)}
                        >
                          <MdDeleteForever className="w-7 h-7 fill-BasketRed hover:fill-red-500 hover:scale-110 transition-all duration-500 transform ease-in-out" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-full lg:w-1/2 mt-24 ">
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
                        <span className="">₺{totalPrice}</span>
                      </p>
                    </div>
                    <div className="flex flex-row gap-12">
                      <p className="w-[100px] flex justify-start font-medium text-slate-400">
                        <span className="">İndirim</span>
                      </p>
                      <p className="w-[100px] flex justify-end font-medium text-slate-400">
                        <span className="">₺0</span>
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
                    <span className="">₺{totalPrice}</span>
                  </p>
                </div>
                <div className="flex flex-row items-center gap-5 mt-12 mb-8">
                  <div className="group">
                    <button
                      type="button"
                      onClick={handleConfirmOrder}
                      className="flex flex-row items-center justify-center gap-2 ml-3 text-white font-bold hover:scale-105 transition-all transform ease-out duration-500 cursor-pointer bg-gradient-to-r from-LightBlue to-sky-700 pl-3 pr-11 py-2 rounded-full relative w-[250px] h-[58px] text-[18px]"
                    >
                      Sipariş Ver
                      <span className="absolute -top-1 -right-2 text-white bg-gradient-to-r from-sky-700 to-LightBlue p-4 border-4 border-white rounded-full transition-all duration-500 ease-out transform group-hover:scale-110">
                        <RiShoppingCartLine className="w-6 h-6" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {confirmOrder && (
        <OrderConfirmation onClose={handleCloseOrderConfirmation} />
      )}
      {confirmDelete && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="absolute w-full h-full bg-gray-900 opacity-50"></div>
          <div className="bg-white p-8 rounded-lg shadow-lg z-20 mx-5 sm:mx-0 flex flex-col items-center justify-center gap-3">
            <span>
              <GiCancel className="fill-BasketRed w-12 h-12" />
            </span>
            <p className="text-lg font-semibold my-4 text-center text-CustomGray">
              Silmek istediğinizden emin misiniz?
            </p>
            <div className="flex justify-center items-center gap-12">
              <button
                className="px-6 py-3 mr-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition duration-500 ease-in-out transform hover:scale-105"
                onClick={cancelDelete}
              >
                Hayır
              </button>
              <button
                className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-500 ease-in-out transform hover:scale-105"
                onClick={confirmDeleteItem}
              >
                Evet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    )}</>
  );
};

export default ShoppingCart;
