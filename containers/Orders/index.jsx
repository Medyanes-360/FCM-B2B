"use client";
import OrderList from "@/components/OrderList/OrderList";
import React, { useState, useEffect } from "react";
import { getAPI } from "@/services/fetchAPI";

const OrderContainer = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAPI("/allorders");
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);
  return (
    <div className="py-5 px-5 bg-BaseLight text-DarkBlue h-screen">
      <OrderList order={orders} />
    </div>
  );
};

export default OrderContainer;
