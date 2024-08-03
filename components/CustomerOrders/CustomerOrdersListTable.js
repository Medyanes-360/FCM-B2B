import React, { useState } from "react";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { FaEye } from "react-icons/fa";

import { ImCancelCircle } from "react-icons/im";

import RequestModal from "./RequestModal";
import OrderCancellation from "./OrderCancallation";
import Link from "next/link";

const CustomerOrdersListTable = ({ orders }) => {
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedOrderCheckboxes, setSelectedOrderCheckboxes] = useState({});
  const [isOpenReqModal, setIsOpenReqModal] = useState(false);
  const [isOpenOrderCanModal, setIsOpenOrderCanModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  // statu Renkleri
  const statusColors = {
    Beklemede: "bg-[#e5e5e5] text-[#80808b]",
    Hazırlanıyor: "bg-[#c7e1c7] text-[#5d7b45]",
    "Ödeme bekleniyor": "bg-[#f8dda5] text-[#876b17]",
    Tamamlandı: "bg-[#c7d8e2] text-[#324356]",
    "İptal edildi": "bg-[#e3e5e3] text-[#7a7a7c]",
    Başarısız: "bg-[#eaa4a4] text-[#762024]",
  };

  const handleSelectAllCheckboxChange = (event) => {
    const { checked } = event.target;
    setSelectAllChecked(checked);

    const updatedSelectedOrderCheckboxes = {};
    orders.forEach((order) => {
      updatedSelectedOrderCheckboxes[order.id] = checked;
    });
    setSelectedOrderCheckboxes(updatedSelectedOrderCheckboxes);
  };

  const handleSingleCheckboxChange = (orderId) => {
    setSelectedOrderCheckboxes((prevSelectedOrderCheckboxes) => ({
      ...prevSelectedOrderCheckboxes,
      [orderId]: !prevSelectedOrderCheckboxes[orderId],
    }));
  };

  const handleOpenRequestModal = (order) => {
    setSelectedOrder(order);
    setIsOpenReqModal(true);
  };

  const handleOrderCancellation = (order) => {
    setSelectedOrder(order);
    setIsOpenOrderCanModal(true);
  };

  return (
    <>
      <div className="overflow-x-auto border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-NavyBlue text-white ">
            <tr className="text-center">
              <th className="px-6 py-3  text-left text-xs font-medium">
                <input
                  type="checkbox"
                  checked={selectAllChecked}
                  onChange={handleSelectAllCheckboxChange}
                />
              </th>
              <th className="px-6 py-3 text-center text-base font-medium  ">
                Sipariş
              </th>

              <th className="px-6 py-3  text-base font-medium  text-center">
                Tarih
              </th>
              <th className="px-6 py-3  text-base font-medium">Durum</th>
              <th className="px-6 py-3  text-base font-medium">Toplam</th>
              <th className="px-6 py-3 text-center text-base font-medium">
                Eylemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 ">
            {orders.map((order, index) => (
              <tr
                key={order.id}
                className={`${
                  index % 2 === 1 ? "bg-white" : "bg-gray-50"
                } text-center`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedOrderCheckboxes[order.id] || false}
                    onChange={() => handleSingleCheckboxChange(order.id)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-LightBlue">
                  {order.orderNumber}
                </td>

                <td className="px-6 py-4 whitespace-nowrap ">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className={`inline-block rounded-sm px-2 py-1  ${
                      statusColors[order.status]
                    }`}
                  >
                    {order.status}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.total}₺</td>
                <td className="px-6 py-4 space-x-2 flex   whitespace-nowrap ">
                  <button
                    className="bg-NavyBlue/75 p-2 rounded-md  hover:bg-NavyBlue text-white flex items-center space-x-1 "
                    onClick={() => handleOpenRequestModal(order)}
                  >
                    <HiOutlineDocumentAdd />{" "}
                    <span>Talep oluştur</span>{" "}
                  </button>
                  <button
                    className="bg-red-300 p-2 rounded-md hover:bg-red-400 flex items-center space-x-1"
                    onClick={() => handleOrderCancellation(order)}
                  >
                    <ImCancelCircle /> <span> Sipariş İptal</span>
                  </button>
                  <Link href={`/customer-orders/${order.id}`}>
                    <button className="bg-LightBlue/75  p-2 rounded-md hover:bg-LightBlue flex items-center space-x-1">
                      <FaEye /> <span>Sipariş İncele</span>{" "}
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isOpenReqModal && (
        <RequestModal
          isOpen={isOpenReqModal}
          setIsOpen={setIsOpenReqModal}
          order={selectedOrder}
        />
      )}
      {isOpenOrderCanModal && (
        <OrderCancellation
          isOpen={isOpenOrderCanModal}
          setIsOpen={setIsOpenOrderCanModal}
          order={selectedOrder}
        />
      )}
    </>
  );
};

export default CustomerOrdersListTable;
