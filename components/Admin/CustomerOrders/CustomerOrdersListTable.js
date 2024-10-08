import React, { useState } from "react";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { FaEye } from "react-icons/fa";
import { ImCancelCircle } from "react-icons/im";
import RequestModal from "./RequestModal";
import OrderCancellation from "./OrderCancallation";
import Link from "next/link";
import UpdateStatusModal from "../UpdateStatusModal";
import KargoUpdateModal from "../KargoUpdateModal";
import { useSearchParams } from "next/navigation";

const CustomerOrdersListTable = ({ orders, allOrders, updateOrderStatus }) => {
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("page") || "1";
  const [isOpenUpdateStatusModal, setIsOpenUpdateStatusModal] = useState(false);
  const [isOpenKargoUpdateModal, setIsOpenKargoUpdateModal] = useState(false);
  const [isChecked, setIsChecked] = useState(orders.map(() => false));
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [isOpenReqModal, setIsOpenReqModal] = useState(false);
  const [isOpenOrderCanModal, setIsOpenOrderCanModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // statu Renkleri
  const statusColors = {
    Beklemede: "bg-[#e5e5e5] text-[#80808b]",
    Hazırlanıyor: "bg-[#c7d8e2] text-[#324356]",
    "Ödeme Bekleniyor": "bg-[#f8dda5] text-[#876b17]",
    "Sipariş Oluşturuldu": "bg-[#f8dda5] text-[#876b17]",
    Tamamlandı: "bg-[#c7e1c7] text-[#5d7b45]",
    İptal: "bg-[#e3e5e3] text-[#7a7a7c]",
    Başarısız: "bg-[#eaa4a4] text-[#762024]",
    "Kargoya Verildi": "bg-[#295F98] text-[#fff]",
  };

  // single check process for inputs
  const handleCheckboxChange = (index) => {
    const newCheckedItems = [...isChecked];
    newCheckedItems[index] = !newCheckedItems[index];
    setIsChecked(newCheckedItems);

    const allChecked = newCheckedItems.every((item) => item);
    setIsAllChecked(allChecked);
  };

  const handleOpenKargoUpdateModal = (order) => {
    setSelectedOrder(order);
    setIsOpenKargoUpdateModal(true);
  };
  const handleOpenUpdateStatusModal = (order) => {
    setSelectedOrder(order);
    setIsOpenUpdateStatusModal(true);
  };
  // all check process for "select all" input
  const handleAllCheck = () => {
    const newAllCheckState = !isAllChecked;
    setIsAllChecked(newAllCheckState);

    const newCheckedElements = orders.map(() => newAllCheckState);
    return setIsChecked(newCheckedElements);
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
      <div className="overflow-x-auto overflow-y-hidden border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-NavyBlue text-white ">
            <tr className="text-center">
              <th className="px-6 py-3 text-center text-base font-medium  ">
                Sipariş No
              </th>
              <th className="px-6 py-3 text-center text-base font-medium  ">
                Cari Unvanı
              </th>
              <th className="px-6 py-3  text-base font-medium  text-center">
                Tarih
              </th>
              <th className="px-6 py-3  text-base font-medium">Durum</th>
              <th className="px-6 py-3  text-base font-medium">Ürün Adedi</th>
              <th className="px-6 py-3  text-base font-medium">Toplam</th>
              <th className="px-6 py-3  text-base font-medium">Eylemler</th>
              <th className="px-6 py-3  text-base font-medium text-left">
                Kargo İşlemleri
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 ">
            {orders.map((order, index) => (
              <tr
                key={order.ID}
                className={`${
                  index % 2 === 1 ? "bg-white" : "bg-gray-50"
                } text-center`}
              >
                <td className="text-center px-6 py-4 whitespace-nowrap hover:scale-105 transition-all ">
                  <Link
                    href={{
                      pathname: `/customer-orders/${order.ID}`,
                      query: {
                        orderno: order.ORDERNO,
                        returnPage: currentPage,
                      },
                    }}
                  >
                    <div className="bg-gray-100 p-2 rounded">
                      <div>{order.ORDERNO}</div>
                      <div className="text-LightBlue font-bold">
                        {order.STKNAME}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="text-center px-6 py-4 whitespace-nowrap flex flex-col justify-center items-center">
                  <div className="bg-NavyBlue text-white px-2 rounded">
                    {order.CARKOD}
                  </div>
                  <div className="relative group">
                    <div className="truncate max-w-[20ch]">
                      {order.CARUNVAN}
                    </div>
                    <div className="absolute left-0 top-full mt-2 w-max max-w-xs bg-gray-700 text-white text-xs rounded-md p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {order.CARUNVAN}
                    </div>
                  </div>
                </td>
                <td className="text-center px-6 py-4 whitespace-nowrap ">
                  <div className="flex flex-col justify-center items-center">
                    <div>
                      {order.ORDERGUN}.{order.ORDERAY}.{order.ORDERYIL}
                    </div>
                    <div className="bg-gray-200 rounded px-2">
                      {order.ORDERSAAT && order.ORDERSAAT.substring(0, 5)}
                    </div>
                  </div>
                </td>
                <td className="text-center px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col  w-40">
                    <div
                      className={`inline-block rounded-sm px-2 py-1  ${
                        statusColors[order.ORDERSTATUS]
                      }`}
                    >
                      {order.ORDERSTATUS}
                    </div>
                    {order.KARGO && order.KARGOTAKIPNO && (
                      <div className="flex-col text-sm font-bold tracking-wider bg-NavyBlue p-2 rounded-md mt-2 text-white flex items-center justify-center">
                        <h2>{order.KARGO}</h2>
                        <h2>{order.KARGOTAKIPNO}</h2>
                      </div>
                    )}
                  </div>
                </td>
                <td className="text-center px-6 py-4 whitespace-nowrap">
                  {new Intl.NumberFormat("tr-TR", {
                    style: "decimal",
                  }).format(order.STKADET)}{" "}
                  Adet
                </td>
                <td className="text-center px-6 py-4 whitespace-nowrap">
                  {new Intl.NumberFormat("tr-TR", {
                    style: "decimal",
                  }).format(order.STKBIRIMFIYATTOPLAM)}
                  ₺
                </td>
                <td className="text-center px-6 py-4 flex justify-center whitespace-nowrap flex-col  gap-2 ">
                  <Link
                    href={{
                      pathname: `/customer-orders/${order.ID}`,
                      query: { orderno: order.ORDERNO },
                    }}
                    onClick={() =>
                      localStorage.setItem(
                        "currentOrderPage",
                        localStorage.getItem("currentOrderPage") || "0"
                      )
                    }
                  >
                    <button className="bg-gray-300 p-2 rounded-md hover:bg-gray-400 flex items-center w-36">
                      <FaEye /> <span>Sipariş İncele</span>
                    </button>
                  </Link>
                  {order.ORDERSTATUS === "İptal" ? (
                    <button
                      disabled
                      className="bg-red-100 p-2 rounded-md flex items-center w-36 justify-center"
                    >
                      Sipariş İptal Edildi
                    </button>
                  ) : (
                    <button
                      className="bg-NavyBlue p-2 rounded-md hover:bg-LightBlue text-white flex items-center w-36 justify-center"
                      onClick={() => handleOpenUpdateStatusModal(order)}
                    >
                      Durumu Güncelle
                    </button>
                  )}
                </td>
                <td className="text-center px-6 py-4 whitespace-nowrap">
                  <button
                    className="bg-NavyBlue p-2 rounded-md hover:bg-LightBlue text-white flex items-center w-36 justify-center"
                    onClick={() => handleOpenKargoUpdateModal(order)}
                  >
                    Kargoyu Güncelle
                  </button>
                  <span
                    className={`p-2 rounded-md flex items-center mt-2 w-36 justify-center ${
                      order.TALEP
                        ? "bg-orange-500 text-white"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {order.TALEP ? "Talep var!" : "Talep yok"}
                  </span>
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
      {isOpenUpdateStatusModal && (
        <UpdateStatusModal
          isOpen={isOpenUpdateStatusModal}
          setIsOpen={setIsOpenUpdateStatusModal}
          order={selectedOrder}
          updateOrderStatus={updateOrderStatus}
        />
      )}
      {isOpenKargoUpdateModal && (
        <KargoUpdateModal
          isOpen={isOpenKargoUpdateModal}
          setIsOpen={setIsOpenKargoUpdateModal}
          order={selectedOrder}
          updateOrderStatus={updateOrderStatus}
        />
      )}
    </>
  );
};

export default CustomerOrdersListTable;
