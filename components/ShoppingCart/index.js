"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdImages } from "react-icons/io";
import Loading from "../Loading";
import { MdDeleteForever } from "react-icons/md";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GiCancel } from "react-icons/gi";
import { RiShoppingCartLine } from "react-icons/ri";
import OrderConfirmation from "@/components/OrderConfirmation/index.";
import Link from "next/link";
import { TbShoppingCartX } from "react-icons/tb";

const ShoppingCart = () => {
  const [storedCart, setStoredCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [confirmOrder, setConfirmOrder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageMap, setImageMap] = useState({});

  const handleConfirmOrder = () => {
    setConfirmOrder(true);
  };

  const handleCloseOrderConfirmation = () => {
    setConfirmOrder(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cartData = localStorage.getItem("cart");
      const parsedCart = cartData ? JSON.parse(cartData) : [];
      setStoredCart(parsedCart);
      updateTotalPrice(parsedCart);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchImageData = async () => {
      try {
        const response = await fetch("/data.json");
        const imageData = await response.json();
        const imgMap = {};
        imageData.forEach((item) => {
          imgMap[item.stkkod] = item.path;
        });
        setImageMap(imgMap);
      } catch (error) {
        console.error("Resim verisi yükleme hatası:", error);
      }
    };

    fetchImageData();
  }, []);

  const handleQuantityChange = (index, change) => {
    const updatedCart = [...storedCart];
    const newQuantity = updatedCart[index].quantity + change;

    if (newQuantity >= 1) {
      updatedCart[index].quantity = newQuantity;
      setStoredCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      updateTotalPrice(updatedCart);

      toast.success("Ürün adedi başarıyla güncellendi.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const updateTotalPrice = (cart) => {
    const totalPrice = cart.reduce((acc, item) => {
      return acc + item.STKOZKOD5 * item.quantity;
    }, 0);
    setTotalPrice(totalPrice);
  };

  const handleDeleteItem = (index) => {
    setDeleteIndex(index);
    setConfirmDelete(true);
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
    setDeleteIndex(null);
  };

  const confirmDeleteItem = () => {
    if (deleteIndex !== null) {
      const updatedCart = [...storedCart];
      updatedCart.splice(deleteIndex, 1);
      setStoredCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      toast.success("Ürün sepetten başarıyla silindi.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      updateTotalPrice(updatedCart);
      setConfirmDelete(false);
      setDeleteIndex(null);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      id="shoppingcart"
      className="bg-white flex items-center flex-col py-[35px] sm:py-[60px] w-screen lg:w-[1188px] min-h-[600px]"
    >
      <div className="flex items-center justify-center text-[35px] md:text-[48px] text-CustomGray leading-[41px] font-bold italic mb-[60px]">
        Sepet
      </div>
      {storedCart.length === 0 ? (
        <div className="flex items-center  justify-center flex-col">
          <span className="flex items-center justify-center my-[20px]">
            <TbShoppingCartX className="w-[140px] h-[140px] text-CustomGray" />
          </span>
          <span className="text-[20px] text-CustomGray font-bold my-[20px]">
            Sepetiniz şu anda boş.
          </span>
          <Link href={"/"}>
            <button className="bg-LightBlue text-white px-[24px] py-[10px] rounded-md font-bold text-[14px] mt-[50px] mb-[15px] hover:scale-105 transition-all duration-500 transform ease-in-out hover:bg-LightBlue/50">
              Mağazaya geri dön
            </button>
          </Link>
        </div>
      ) : (
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
                        <div className="w-24 h-24 mr-4">
                          <Image
                            src={
                              item.imagePath ||
                              "https://caliskanari.com/wp-content/uploads/2022/11/X7-420x420.png.webp"
                            }
                            alt={item.STKCINSI}
                            width={96}
                            height={96}
                            className="object-cover rounded"
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
                          <div className="border border-CustomGray/25 rounded-full py-2 px-2 flex flex-row items-center justify-center">
                            <button
                              type="button"
                              className="text-sm sm:text-xl text-LightBlue hover:scale-110 transition duration-500 ease-in-out transform"
                              onClick={() => handleQuantityChange(index, -1)}
                            >
                              <AiOutlineMinus />
                            </button>
                            <span className="w-6 sm:w-12 p-1 text-center outline-none">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="text-sm sm:text-xl text-LightBlue hover:scale-110 transition duration-500 ease-in-out transform"
                              onClick={() => handleQuantityChange(index, 1)}
                            >
                              <AiOutlinePlus />
                            </button>
                          </div>
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
                      <span className="absolute -top-1 -right-2 text-white bg-gradient-to-r from-sky-700 to-LightBlue p-4  rounded-full group-hover:scale-110 transition-all duration-500 transform ease-in-out">
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
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              Ürünü silmek istediğinize emin misiniz?
            </h2>
            <div className="flex justify-end">
              <button
                onClick={cancelDelete}
                className="mr-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                İptal
              </button>
              <button
                onClick={confirmDeleteItem}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmOrder && (
        <OrderConfirmation
          onClose={handleCloseOrderConfirmation}
          cartItems={storedCart}
          totalPrice={totalPrice}
        />
      )}
    </div>
  );
};

export default ShoppingCart;
