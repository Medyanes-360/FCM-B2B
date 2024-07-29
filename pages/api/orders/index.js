// pages/api/orders.js
import { createNewData, getAllData } from "@/services/serviceOperations";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const orderItems = req.body; // Bu artık bir dizi olacak

      const createdOrders = [];

      for (const item of orderItems) {
        const entry = {
          ORDERNO: item.ORDERNO,
          CARKOD: item.CARKOD,
          CARUNVAN: item.CARUNVAN,
          STKKOD: item.STKKOD,
          STKNAME: item.STKNAME,
          STKCINSI: item.STKCINSI,
          STKADET: item.STKADET,
          STKBIRIMFIYAT: item.STKBIRIMFIYAT,
          STKBIRIMFIYATTOPLAM: item.STKBIRIMFIYAT * item.STKADET,
          ORDERFIYATTOPLAM: item.ORDERFIYATTOPLAM,
          ACIKLAMA: item.ACIKLAMA || "",
          CIKISFISEVRNO: item.CIKISFISEVRNO,
          SATISIRSEVRNO: item.SATISIRSEVRNO,
          HARREFDEGER1: item.HARREFDEGER1,
          STKFISREFNO: item.STKFISREFNO,
          ORDERYIL: item.ORDERYIL,
          ORDERAY: item.ORDERAY,
          ORDERGUN: item.ORDERGUN,
          ORDERSAAT: item.ORDERSAAT,
          STKFISEVRAKNO1: item.STKFISEVRAKNO1 || null,
          STKFISEVRAKNO2: item.STKFISEVRAKNO2 || null,
          EKXTRA1: item.EKXTRA1 || null,
          EKXTRA2: item.EKXTRA2 || null,
          EKXTRA3: item.EKXTRA3 || null,
          EKXTRA4: item.EKXTRA4 || null,
          EKXTRA5: item.EKXTRA5 || null,
          EKXTRA6: item.EKXTRA6 || null,
          EKXTRA7: item.EKXTRA7 || null,
          EKXTRA8: item.EKXTRA8 || null,
          EKXTRA9: item.EKXTRA9 || null,
        };

        console.log("Veri tabanına yazılacak veri:", entry);

        const result = await createNewData("ALLORDERS", entry);
        console.log("Veri tabanına yazma sonucu:", result);

        createdOrders.push(entry);
      }

      // Veri tabanından tüm verileri oku ve kontrol et
      const allOrders = await getAllData("ALLORDERS");
      console.log("Veri tabanındaki tüm siparişler:", allOrders);

      res.status(200).json({
        success: true,
        message: "Order items created successfully",
        createdOrders: createdOrders,
        allOrders: allOrders,
      });
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(500).json({
        success: false,
        message: "Error creating order items",
        error: error.message,
      });
    }
  } else if (req.method === "GET") {
    try {
      const allOrders = await getAllData("ALLORDERS");
      res.status(200).json({
        success: true,
        orders: allOrders,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching orders",
        error: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
