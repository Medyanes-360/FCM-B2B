"use client";
import React, { useState, useEffect } from "react";
import CustomerOrdersListTable from "./CustomerOrdersListTable";
import { orders, statuses } from "./data";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

const CustomerOrdersList = () => {
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [searchValue, setSearchValue] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Tümü");
  const [orderDate, setOrderDate] = useState("Tüm Tarihler");
  const [uniqueDates, setUniqueDates] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectAll, setSelectAll] = useState("Toplu İşlemler");
  const [priceSortType, setPriceSortType] = useState("Fiyata Göre Sırala");
  const [dateSortType, setDateSortType] = useState("Tarihe Göre Sırala");
  const [anyFilterSelected, setAnyFilterSelected]=useState(false)

  const handleSelectAll = (e) => {
    setSelectAll(e.target.value);
  };

  useEffect(() => {
    const dates = [...new Set(filteredOrders.map((order) => order.date))];
    setUniqueDates(dates);
  }, [filteredOrders]);

  const filterOrders = (searchValue, status, date) => {
    let filteredOrders = orders;

    if (searchValue) {
      filteredOrders = filteredOrders.filter((order) =>
        order.orderNumber.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (status !== "Tümü") {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === status
      );
    }

    if (date !== "Tüm Tarihler") {
      filteredOrders = filteredOrders.filter((order) => order.date === date);
    }

    filteredOrders.forEach((order) => {
      if (order.status === "Tamamlanan") {
        order.status = "Tamamlandı";
      } else if (order.status === "İptal edilen") {
        order.status = "İptal edildi";
      } else if (order.status === "Başarısız olan") {
        order.status = "Başarısız";
      }
    });
    setFilteredOrders(filteredOrders);
  };

  // Arama
  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchValue(value);
    filterOrders(value, selectedStatus, orderDate);
  };

  // status fiiltresi  degisikligini yonetiyor
  const filterStatus = (status) => {
    setSelectedStatus(status);
    filterOrders(searchValue, status, orderDate, uniqueDates);
  };

  const handleChangePage = (direction) => {
    if (direction === "prev" && page > 0) {
      setPage(page - 1);
    } else if (
      direction === "next" &&
      (page + 1) * rowsPerPage < filteredOrders.length
    ) {
      setPage(page + 1);
    }
  };

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const sortOrders = (priceSortType, dateSortType) => {
    let sortedOrders = [...filteredOrders];
    if (priceSortType === "Önce en yüksek") {
      sortedOrders.sort((a, b) => b.total - a.total);
    } else if (priceSortType === "Önce en düşük") {
      sortedOrders.sort((a, b) => a.total - b.total);
    }

    if (dateSortType === "Önce en yeni") {
      sortedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (dateSortType === "Önce en eski") {
      sortedOrders.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    setFilteredOrders(sortedOrders);
  };

  const handlePriceSortChange = (event) => {
    const sortType = event.target.value;
    setPriceSortType(sortType);
    sortOrders(sortType, dateSortType);
    setAnyFilterSelected(true)
  };

  const handleDateSortChange = (event) => {
    const sortType = event.target.value;
    setDateSortType(sortType);
    sortOrders(priceSortType, sortType);
    setAnyFilterSelected(true)
  };
  const handleClearFilters = () => {
    setSearchValue("");
    setSelectedStatus("Tümü");
    setOrderDate("Tüm Tarihler");
    setPriceSortType("Fiyata Göre Sırala");
    setDateSortType("Tarihe Göre Sırala");
    setSelectAll("Toplu İşlemler");
    setAnyFilterSelected(false)
    setFilteredOrders(orders);
  };
  return (
    <>
   {/* <div className=" text-center pt-5 pb-7 text-3xl text-NavyBlue font[600]">Siparişler</div>*/}
      <div className="justify-between flex flex-wrap">
        <div className="flex gap-2 text-LightBlue flex-wrap" >
          {statuses.map((status, index) => (
            <React.Fragment key={index}>
              <span
                onClick={() => filterStatus(status.name)}
                className={
                  selectedStatus === status.name
                    ? "text-BaseDark cursor-pointer"
                    : "cursor-pointer"
                }
              >
                {status.name}
              </span>
              <span className="text-CustomGray">({status.count})</span>
              {index !== statuses.length - 1 && (
                <span className="text-CustomGray">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex">
          <form action="" className="flex gap-2">
            <input
              value={searchValue}
              onChange={handleSearchChange}
              type="text"
              className="p-2 border rounded-md"
            />
            <button
              className="p-1 border border-LightBlue text-sm rounded-md"
              type="submit"
            >
              Siparişleri Ara
            </button>
          </form>
        </div>
      </div>
      <div className="flex flex-wrap justify-between items-center py-3">
        <div className="flex gap-4 flex-wrap">
          {/* Filtreleme Seçenekleri */}
          <div className="flex gap-2">
            {/* Toplu İşlemler Select */}

            <select
              className={`p-1 border rounded-md text-CustomGray w-52 ${
                selectAll !== "Toplu İşlemler" ? "bg-NavyBlue text-white" : ""
              }`}
              name="filterActions"
              value={selectAll}
              onChange={handleSelectAll}
            >
              <option hidden>Toplu İşlemler</option>
              <option>Toplu İşlemler</option>
              <option>Çöp kutusuna taşı</option>
              <option>Kargoya verildi</option>
              <option>PDF Fatura</option>
              <option>PDF Paketleme Fişi</option>
            </select>
          </div>

          <div className="flex gap-2 flex-wrap">
            {/* Tarihler Select */}
            <select
              className={`p-1 border rounded-md text-BaseDark w-54 font-medium ${
                orderDate !== "Tüm Tarihler" ? "bg-NavyBlue text-white" : ""
              }`}
              name="filterDates"
              onChange={(e) => {
                const selectedDate = e.target.value;
                setOrderDate(selectedDate);
                filterOrders(searchValue, selectedStatus, selectedDate);
              }}
              value={orderDate}
            >
              <option>Tüm Tarihler</option>
              {uniqueDates.map((date, index) => (
                <option key={index} value={date}>
                  {date}
                </option>
              ))}
            </select>

         
            <select   className={`${priceSortType === "Fiyata Göre Sırala" ?"": "bg-NavyBlue text-white" }`} name="filterUsers" onChange={handlePriceSortChange} value={priceSortType}>
              <option hidden>Fiyata Göre Sırala</option>
              <option >Fiyata Göre Sırala</option>
              <option >Önce en yüksek</option>
              <option >Önce en düşük</option>
              
            </select>
            <select   className={`${dateSortType === "Tarihe Göre Sırala" ?"": "bg-NavyBlue text-white" }`} name="filterUsers"  onChange={handleDateSortChange} value={dateSortType}>
     
            <option >Tarihe Göre Sırala</option>
            <option >Önce en yeni</option>
            <option >Önce en eski</option>
            
          </select>
            {/* Filtrele Butonu */}
            <button
            onClick={handleClearFilters}
            className={`p-[6px]  font-[500] border text-NavyBlue  rounded-md   text-sm whitespace-nowrap
            ${anyFilterSelected ?"border-NavyBlue cursor-pointer hover:bg-NavyBlue hover:text-white" :  "  text-NavyBlue opacity-50 border-gray-400 cursor-not-allowed"}
`}            >
              Filtre Temizle
            </button>
          </div>
        </div>

        {/* Sıralama ve Sayfalama */}
        <div className="flex items-center gap-2 ">
          <p className="text-CustomGray">{filteredOrders.length} öge</p>
          <div
            className={`border-2 rounded-sm text-[18px]  md:p-3 p-1 ${
              page === 0
                ? "cursor-not-allowed text-gray-300"
                : "cursor-pointer hover:bg-gray-200 duration-300 hover:border-NavyBlue hover:rounded-xl"
            }`}
            onClick={() => handleChangePage("prev")}
          >
            <MdKeyboardDoubleArrowLeft />
          </div>

          <div
            className={`border-2 rounded-sm text-[18px] md:p-3 p-1 ${
              page === 0
                ? " cursor-not-allowed text-gray-300"
                : "cursor-pointer hover:bg-gray-200 duration-300 hover:border-NavyBlue hover:rounded-xl"
            }`}
            onClick={() => handleChangePage("prev")}
          >
            <MdKeyboardArrowLeft />
          </div>

          <span className="border  md:px-4 md:py-2 py-1 px-3 rounded-full bg-NavyBlue text-white">{page + 1}</span>
          <span>/ {Math.ceil(filteredOrders.length / rowsPerPage)}</span>

          <div
            className={`border-2 rounded-sm text-[18px] md:p-3 p-1 ${
              (page + 1) * rowsPerPage >= filteredOrders.length
                ? " cursor-not-allowed text-gray-300"
                : "cursor-pointer hover:bg-gray-200 duration-300 hover:border-NavyBlue hover:rounded-xl"
            }`}
            onClick={() => handleChangePage("next")}
          >
            <MdKeyboardArrowRight />
          </div>

          <div
            className={`border-2 rounded-sm text-[18px] md:p-3 p-1 ${
              (page + 1) * rowsPerPage >= filteredOrders.length
                ? "cursor-not-allowed text-gray-300 "
                : "cursor-pointer hover:bg-gray-200 duration-300 hover:border-NavyBlue hover:rounded-xl"
            }`}
            onClick={() => handleChangePage("next")}
          >
            <MdKeyboardDoubleArrowRight />
          </div>
        </div>
      </div>
      <CustomerOrdersListTable orders={paginatedOrders} />
    </>
  );
};

export default CustomerOrdersList;
