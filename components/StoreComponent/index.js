"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { FaCheck, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function StoreComponent() {
  const [urunler, setUrunler] = useState([]); // Tüm ürünlerin listesi
  const [selectedCategories, setSelectedCategories] = useState({}); // Seçilen kategorilerin tutulduğu state
  const [cart, setCart] = useState([]); // Sepetin içeriğini tutan state

  // Verileri API'den çekme işlemi
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/products");
        if (!response.ok) {
          throw new Error("API hatası: " + response.status);
        }
        const data = await response.json();
        // API'den gelen verileri filtreleyerek sadece "A" sınıfına ait ürünleri al
        const filteredData = data.data.filter((urun) => urun.STKOZKOD1 === "A");
        setUrunler(filteredData);
      } catch (error) {
        console.error("Veri çekme hatası: ", error);
      }
    };

    fetchData();
  }, []); // Boş dependency array: Sadece bir kez çalışır, component yüklendiğinde

  // LocalStorage'dan sepet verisini yükleme işlemi
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []); // Boş dependency array: Sadece bir kez çalışır, component yüklendiğinde

  // Sepet içeriğini güncelleme işlemi
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]); // `cart` state'i her güncellendiğinde çalışır, sepet güncellendiğinde LocalStorage'a kaydeder

  // Belirli bir ürünün sepete eklenip eklenmediğini kontrol etme
  const isInCart = (urun) => {
    return cart.some((item) => item.STKKOD === urun.STKKOD);
  };

  // Sepete ürün ekleme işlemi
  const handleAddToCart = async (values, urun) => {
    try {
      // Belirli ürün için yükleme durumu ayarla
      setUrunler((prevUrunler) =>
        prevUrunler.map((item) =>
          item.STKKOD === urun.STKKOD ? { ...item, addingToCart: true } : item
        )
      );

      // Yükleme süresi bekletme (1 saniye)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Ürün miktarını güncelle ve yükleme durumunu sıfırla
      const updatedUrunler = urunler.map((item) =>
        item.STKKOD === urun.STKKOD
          ? {
              ...item,
              quantity: item.quantity + values.quantity,
              addingToCart: false,
            }
          : item
      );
      setUrunler(updatedUrunler);

      // Yeni veya varolan ürünü sepete ekle
      const updatedCart = [...cart];
      const existingItemIndex = updatedCart.findIndex(
        (item) => item.STKKOD === urun.STKKOD
      );

      if (existingItemIndex !== -1) {
        updatedCart[existingItemIndex].quantity += values.quantity;
      } else {
        updatedCart.push({ ...urun, quantity: values.quantity });
      }

      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      // Başarılı bildirimi gösterme
      toast.success("Ürün sepete eklendi.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      // Hata durumunda konsola hata yazdırma ve hata bildirimi gösterme
      console.error("Sepete ekleme hatası: ", error);
      toast.error("Ürün sepete eklenirken bir hata oluştu.");
    }
  };

  // Sınıf kategorilerini belirleme (filtreleme işlemi)
  const classes = [
    "1.SINIF",
    "2.SINIF",
    "3.SINIF",
    "4.SINIF",
    "ANASINIFI",
    "İNGİLİZCE",
  ];

  // Belirli sınıfa ait kategorileri getirme işlemi
  const getClassCategories = (classType) => {
    const filteredUrunler = urunler.filter(
      (urun) => urun.STKOZKOD3 === classType && urun.STKOZKOD2.trim() !== ""
    );
    const categories = [
      ...new Set(filteredUrunler.map((urun) => urun.STKOZKOD2)),
    ];
    return categories;
  };

  // Kategori seçimini yönetme işlemi
  const handleCategoryChange = (classType, category) => {
    setSelectedCategories((prevCategories) => {
      const classCategories = prevCategories[classType] || [];
      const updatedCategories = classCategories.includes(category)
        ? classCategories.filter((cat) => cat !== category)
        : [...classCategories, category];
      return {
        ...prevCategories,
        [classType]: updatedCategories,
      };
    });
  };

  // Filtreleri temizleme işlemi
  const clearFilters = () => {
    setSelectedCategories({});
  };


  const renderFilterSidebar = () => {
    return (
      <div className="text-[14px] md:p-4 flex flex-col items-center border-r border-CustomGray/25 max-h-[650px] overflow-y-auto	">
        <ul className="">
          {classes.map((classType) => (
            <li key={classType} className="mb-2 ">
              <div className="flex items-center justify-between w-full px-3 py-1 font-bold  rounded-md text-LightBlue">
                {classType}
              </div>
              {classType !== "ANASINIFI" && classType !== "İNGİLİZCE" && (
                <ul className="ml-4">
                  <li>
                    <label className="flex items-center ml-2">
                      <input
                        type="checkbox"
                        checked={
                          selectedCategories[classType]?.includes("Tümü") ||
                          false
                        }
                        onChange={() => handleCategoryChange(classType, "Tümü")}
                      />
                      <span className="ml-2">HEPSİ</span>
                    </label>
                  </li>
                  {getClassCategories(classType).map((category) => (
                    <li key={category}>
                      <label className="flex items-center ml-2">
                        <input
                          type="checkbox"
                          checked={
                            selectedCategories[classType]?.includes(category) ||
                            false
                          }
                          onChange={() =>
                            handleCategoryChange(classType, category)
                          }
                        />
                        <span className="ml-2">{category}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
              {(classType === "ANASINIFI" || classType === "İNGİLİZCE") && (
                <label className="flex items-center ml-6">
                  <input
                    type="checkbox"
                    checked={
                      selectedCategories[classType]?.includes("Tümü") || false
                    }
                    onChange={() => handleCategoryChange(classType, "Tümü")}
                  />
                  <span className="ml-2">HEPSİ</span>
                </label>
              )}
            </li>
          ))}
        </ul>
        <button
          onClick={clearFilters}
          className="mt-4 ml-4 px-4 py-2 bg-CustomRed text-white rounded-md hidden md:flex"
        >
          Filtreleri Temizle
        </button>
        <button
          onClick={clearFilters}
          className="my-4 ml-4 px-4 py-2 bg-CustomRed text-white rounded-md flex md:hidden"
        >
          Temizle
        </button>
      </div>
    );
  };

  const renderBooks = () => {
    let filteredUrunler = urunler;

    if (Object.keys(selectedCategories).length > 0) {
      filteredUrunler = urunler.filter((urun) => {
        if (selectedCategories[urun.STKOZKOD3]?.includes("Tümü")) {
          return true;
        }
        if (
          urun.STKOZKOD3 === "ANASINIFI" &&
          selectedCategories["ANASINIFI"]?.includes("Tümü")
        ) {
          return true;
        }
        if (
          urun.STKOZKOD2 === "İNGİLİZCE" &&
          selectedCategories["İNGİLİZCE"]?.includes("Tümü")
        ) {
          return true;
        }
        return selectedCategories[urun.STKOZKOD3]?.includes(urun.STKOZKOD2);
      });
    }

    return (
      <div className="bg-white p-4 rounded-md ">
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 justify-center sm:mx-[35px] mb-[30px] px-[15px] w-auto ">
          {filteredUrunler.map((urun) => (
            <div
              key={urun.STKKOD}
              className="relative p-[10px] sm:p-[20px] border border-ProductsBorder rounded-md shadow-sm transition duration-300 ease-in-out transform hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] overflow-hidden flex flex-row sm:flex-col items-center sm:justify-center max-w-[300px]"
            >
              {urun.discount && (
                <p className="absolute flex flex-col items-center justify-center top-16 -right-12 transform origin-top-right rotate-45 text-[12px] sm:text-[16px] font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-600 px-2 w-40 shadow-md shadow-orange-200">
                  %{urun.discount}
                  <span>İNDİRİM</span>
                </p>
              )}

              {isInCart(urun) && (
                <p className="absolute flex flex-row items-center gap-2 top-0 left-0 transform  stext-[12px] sm:text-[16px] font-bold text-CustomRed py-2 px-4 z-1000 bg-white rounded-md">
                  <FaShoppingCart className="" />
                  <span>Sepette</span>
                </p>
              )}
              <div className="w-2/5 sm:w-full mr-[10px] sm:mr-0">
                <span className="flex items-center justify-center">
                  <Image
                    src={
                      "https://caliskanari.com/wp-content/uploads/2022/11/X7-420x420.png.webp"
                    }
                    alt={"image"}
                    className="object-cover w-[140px] md:w-[210px] h-[140px] md:h-[210px]"
                    width={210}
                    height={210}
                  />
                </span>
              </div>
              <div className="w-3/5 sm:w-full flex flex-col justify-between">
                <div className={`text-left md:pt-[15px] min-h-12 md:min-h-20 `}>
                  <Link
                    href={""}
                    className="font-bold text-[14px] md:text-[16px] text-CustomGray leading-tight"
                  >
                    <p>{urun.STKCINSI}</p>
                  </Link>
                </div>
                <div className="flex-none">
                  <div>
                    {urun.STKOZKOD5 && (
                      <p
                        className="italic text-LightBlue text-[20px] md:text-[23px] sm:pt-[20
px] font-semibold"
                      >
                        <span>₺</span>
                        {urun.STKOZKOD5}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex mt-[20px] items-center justify-center ">
                  <Formik
                    initialValues={{ quantity: 1 }}
                    validationSchema={Yup.object().shape({
                      quantity: Yup.number()
                        .min(1, "En az 1 olmalı")
                        .required("Zorunlu alan"),
                    })}
                    onSubmit={(values, { resetForm }) => {
                      handleAddToCart(values, urun);
                      resetForm();
                    }}
                  >
                    {({
                      values,
                      handleChange,
                      handleSubmit,
                      errors,
                      touched,
                    }) => (
                      <Form>
                        <div className="flex flex-col items-center justify-center text-LightBlue">
                          <div className="flex flex-row items-center justify-center gap-2">
                            <div className="flex items-center mt-2">
                              <button
                                type="button"
                                className="text-sm sm:text-md text-LightBlue hover:scale-110 transition duration-500 ease-in-out transform"
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
                                <FaMinus />
                              </button>
                              <Field
                                min="1"
                                name="quantity"
                                className="w-6 text-center outline-none text-CustomGray"
                              />
                              <button
                                type="button"
                                className="text-LightBlue hover:scale-110 text-sm sm:text-md transition duration-500 ease-in-out transform"
                                onClick={() =>
                                  handleChange({
                                    target: {
                                      name: "quantity",
                                      value: values.quantity + 1,
                                    },
                                  })
                                }
                              >
                                <FaPlus />
                              </button>
                            </div>
                            {errors.quantity && touched.quantity && (
                              <div className="text-red-500 mt-1">
                                {errors.quantity}
                              </div>
                            )}
                            <button
                              type="submit"
                              className="flex flex-row items-center justify-center gap-2 ml-2 sm:ml-4 lg:ml-2 text-white font-bold hover:scale-105 transition-all transform easy-in-out duration-500 cursor-pointer bg-LightBlue/75 pl-2 pr-9 py-2 rounded-full relative w-[130px] sm:w-[160px] h-[40px] text-[13px] sm:text-[15px]"
                              onClick={handleSubmit}
                              disabled={urun.addingToCart}
                            >
                              {urun.addingToCart ? (
                                <div className="flex flex-row items-center justify-center gap-1">
                                  <div className="h-2 w-2 rounded-full animate-pulse bg-blue-900"></div>
                                  <div className="h-2 w-2 rounded-full animate-pulse bg-blue-900"></div>
                                  <div className="h-2 w-2 rounded-full animate-pulse bg-blue-900"></div>
                                </div>
                              ) : (
                                <>Sepete Ekle</>
                              )}
                              <span
                                className={`absolute -top-1 -right-2 text-white bg-gradient-to-r from-sky-600 to-cyan-700 p-3 border-4 border-white rounded-full transition-all duration-500 ease-out transform`}
                              >
                                {isInCart(urun) ? (
                                  <FaCheck
                                    className={`transition-all duration-1000 ease-in-out transform ${
                                      isInCart(urun) ? "scale-100" : "scale-0"
                                    }`}
                                  />
                                ) : (
                                  <FaPlus />
                                )}
                              </span>
                            </button>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-row w-full justify-center pt-5  ">
      <div className="md:w-64 drop-shadow-lg ">{renderFilterSidebar()}</div>{" "}
      {/* Sabit genişlik: 256px */}
      <div className="flex-1">{renderBooks()}</div>{" "}
      {/* Kalan genişliği kaplar */}
    </div>
  );
}

export default StoreComponent;
