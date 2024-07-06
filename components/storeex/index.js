"use client"
import React, { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";

function StoreComponent() {
  const [urunler, setUrunler] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/products");
        if (!response.ok) {
          throw new Error("API hatası: " + response.status);
        }
        const data = await response.json();
        const filteredData = data.data.filter((urun) => urun.STKOZKOD1 === "A");
        setUrunler(filteredData);
      } catch (error) {
        console.error("Veri çekme hatası: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const classes = [
    "1.SINIF",
    "2.SINIF",
    "3.SINIF",
    "4.SINIF",
    "ANASINIFI",
    "İNGİLİZCE",
  ];

  const getClassCategories = (classType) => {
    const filteredUrunler = urunler.filter(
      (urun) => urun.STKOZKOD3 === classType && urun.STKOZKOD2.trim() !== ""
    );
    const categories = [...new Set(filteredUrunler.map((urun) => urun.STKOZKOD2))];
    return categories;
  };

  const handleCategoryChange = (classType, category) => {
    if (selectedClass !== classType) {
      setSelectedClass(classType);
      setSelectedCategories([category]);
    } else {
      setSelectedCategories((prevCategories) =>
        prevCategories.includes(category)
          ? prevCategories.filter((cat) => cat !== category)
          : [...prevCategories, category]
      );
    }
  };

  const renderFilterSidebar = () => {
    return (
      <div className="bg-gray-200 p-4 rounded-md shadow-md">
        <h2 className="text-lg font-semibold mb-2">Filtrele</h2>
        <ul>
          {classes.map((classType) => (
            <li key={classType} className="mb-2">
              <div className="flex items-center justify-between w-full px-3 py-1 rounded-md bg-gray-300">
                {classType}
              </div>
              {classType !== "ANASINIFI" && classType !== "İNGİLİZCE" && (
                <ul className="ml-4">
                  <li>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedClass === classType && selectedCategories.includes("Tümü")}
                        onChange={() => handleCategoryChange(classType, "Tümü")}
                      />
                      <span className="ml-2">Tümü</span>
                    </label>
                  </li>
                  {getClassCategories(classType).map((category) => (
                    <li key={category}>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedClass === classType && selectedCategories.includes(category)}
                          onChange={() => handleCategoryChange(classType, category)}
                        />
                        <span className="ml-2">{category}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
              {(classType === "ANASINIFI" || classType === "İNGİLİZCE") && (
                <label className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={selectedClass === classType && selectedCategories.includes("Tümü")}
                    onChange={() => handleCategoryChange(classType, "Tümü")}
                  />
                  <span className="ml-2">Tümü</span>
                </label>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderBooks = () => {
    let filteredUrunler = urunler.filter((urun) => {
      if (selectedClass === "ANASINIFI") {
        return urun.STKOZKOD3 === selectedClass;
      }
      if (selectedClass === "İNGİLİZCE") {
        return urun.STKOZKOD2 === "İNGİLİZCE";
      }
      if (selectedClass && selectedCategories.length > 0) {
        if (selectedCategories.includes("Tümü")) {
          return urun.STKOZKOD3 === selectedClass;
        }
        return (
          urun.STKOZKOD3 === selectedClass &&
          selectedCategories.includes(urun.STKOZKOD2)
        );
      }
      return true;
    });

    return (
      <div className="bg-white p-4 rounded-md shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUrunler.map((urun) => (
            <div key={urun.STKKOD} className="p-2 bg-gray-100 rounded-md">
              {urun.STKCINSI}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex">
      <div className="flex-1 mr-4">{renderFilterSidebar()}</div>
      <div className="flex-3">{renderBooks()}</div>
    </div>
  );
}

export default StoreComponent;
