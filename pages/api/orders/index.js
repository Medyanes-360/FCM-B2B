// pages/api/orders.js
import {
  createNewData,
  getAllData,
  updateDataByAny,
  getDataByUnique,
} from "@/services/serviceOperations";

const now = new Date();

const generateOrderNo = (userId) => {
  const day = now.getDate().toString().padStart(2, "0");
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const year = now.getFullYear().toString();
  const hour = now.getHours().toString().padStart(2, "0");
  const minute = now.getMinutes().toString().padStart(2, "0");
  const randomLetters =
    String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
    String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const randomNumber = Math.floor(Math.random() * 10) + 1;

  return `${day}-${month}-${year}-${hour}-${minute}-${userId}-${randomLetters}-${randomNumber}`;
};

const prepareOrderData = (
  cartItems,
  totalPrice,
  userId,
  userName,
  harRefDeger,
  cikisFisEvrNo,
  satisIrsaliyesiEvrNo
) => {
  const orderNo = generateOrderNo(userId);

  const baseOrderData = {
    ORDERNO: orderNo,
    CARKOD: userId,
    CARUNVAN: userName,
    ORDERFIYATTOPLAM: totalPrice,
    ORDERYIL: now.getFullYear(),
    ORDERAY: now.getMonth() + 1,
    ORDERGUN: now.getDate(),
    ORDERSAAT: now.toTimeString().split(" ")[0],
  };

  const orderItems = cartItems.map((item) => ({
    ...baseOrderData,
    STKKOD: item.STKKOD,
    STKNAME: item.STKCINSI || null,
    STKCINSI: item.STKCINSI || null,
    STKADET: item.quantity,
    STKBIRIMFIYAT: parseFloat(item.STKOZKOD5) || 0,
    STKBIRIMFIYATTOPLAM: (parseFloat(item.STKOZKOD5) || 0) * item.quantity,
    CIKISFISEVRNO: cikisFisEvrNo,
    SATISIRSEVRNO: satisIrsaliyesiEvrNo,
    HARREFDEGER1: harRefDeger,
  }));

  return orderItems;
};

const getAndUpdateReferences = async () => {
  try {
    const harrefnoData = await getAllData("HARREFNO");
    const evraknoData = await getAllData("EVRAKNO");

    const harrefModule6 = harrefnoData.find((item) => item.HARREFMODUL === 6);
    let newHarRefDeger = harrefModule6 ? harrefModule6.HARREFDEGER + 1 : 1;

    const cikisFisEvrako = evraknoData.find(
      (item) => item.EVRACIKLAMA === "Çıkış Fişleri"
    );
    let newCikisFisEvrNo = cikisFisEvrako ? cikisFisEvrako.EVRNO + 1 : 1;

    const satisIrsaliyesiEvrako = evraknoData.find(
      (item) => item.EVRACIKLAMA === "Satış İrsaliyeleri"
    );
    let newSatisIrsaliyesiEvrNo = satisIrsaliyesiEvrako
      ? satisIrsaliyesiEvrako.EVRNO + 1
      : 1;

    await updateDataByAny(
      "HARREFNO",
      { HARREFMODUL: 6 },
      { HARREFDEGER: newHarRefDeger }
    );
    await updateDataByAny(
      "EVRAKNO",
      { EVRACIKLAMA: "Çıkış Fişleri" },
      { EVRNO: newCikisFisEvrNo }
    );
    await updateDataByAny(
      "EVRAKNO",
      { EVRACIKLAMA: "Satış İrsaliyeleri" },
      { EVRNO: newSatisIrsaliyesiEvrNo }
    );

    return {
      harRefDeger: newHarRefDeger,
      cikisFisEvrNo: newCikisFisEvrNo,
      satisIrsaliyesiEvrNo: newSatisIrsaliyesiEvrNo,
    };
  } catch (error) {
    console.error("Referans değerlerini güncellerken hata oluştu:", error);
    throw error;
  }
};

const updateSTKKART = async (STKKOD, quantity) => {
  try {
    const stkKart = await getDataByUnique("STKKART", { STKKOD: STKKOD });
    console.log(`STKKART güncelleme başlıyor: ${STKKOD}`);
    console.log("Mevcut STKKART verisi:", stkKart);

    if (stkKart && typeof stkKart === "object" && !stkKart.error) {
      const currentSTKBAKIYE = parseFloat(stkKart.STKBAKIYE) || 0;
      const newSTKBAKIYE = Math.max(currentSTKBAKIYE - quantity, 0); // Negatif bakiye olmaması için

      console.log(`STKKOD: ${STKKOD}`);
      console.log(`Mevcut STKBAKIYE: ${currentSTKBAKIYE}`);
      console.log(`Sipariş miktarı: ${quantity}`);
      console.log(`Hesaplanan yeni STKBAKIYE: ${newSTKBAKIYE}`);

      await updateDataByAny(
        "STKKART",
        { STKKOD: STKKOD },
        { STKBAKIYE: newSTKBAKIYE }
      );

      const updatedStkKart = await getDataByUnique("STKKART", {
        STKKOD: STKKOD,
      });
      console.log("Güncellenmiş STKKART verisi:", updatedStkKart);
      console.log(
        `STKKART güncellendi: ${STKKOD}, Yeni STKBAKIYE: ${updatedStkKart.STKBAKIYE}`
      );
    } else {
      console.log(`STKKART verisi bulunamadı veya hatalı: ${STKKOD}`);
      console.log("Hata detayı:", stkKart.error);
    }
  } catch (error) {
    console.error(`STKKART güncellenirken hata oluştu (${STKKOD}):`, error);
  }
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { cartItems, totalPrice, userId, userName } = req.body;

      const { harRefDeger, cikisFisEvrNo, satisIrsaliyesiEvrNo } =
        await getAndUpdateReferences();

      const stkfisData = await getAllData("STKFIS");
      const stkFisRefNo = (stkfisData[0]?.STKFISREFNO || 0) + 1;

      const orderItems = prepareOrderData(
        cartItems,
        totalPrice,
        userId,
        userName,
        harRefDeger,
        cikisFisEvrNo,
        satisIrsaliyesiEvrNo
      );

      const createdOrders = [];

      for (const item of orderItems) {
        const entry = {
          ...item,
          STKFISREFNO: stkFisRefNo,
          STKFISEVRAKNO1: null,
          STKFISEVRAKNO2: null,
          ACIKLAMA: null,
          EKXTRA1: null,
          EKXTRA2: null,
          EKXTRA3: null,
          EKXTRA4: null,
          EKXTRA5: null,
          EKXTRA6: null,
          EKXTRA7: null,
          EKXTRA8: null,
          EKXTRA9: null,
        };

        console.log("Veri tabanına yazılacak veri:", entry);

        const result = await createNewData("ALLORDERS", entry);
        console.log("Veri tabanına yazma sonucu:", result);

        createdOrders.push(entry);

        console.log(
          `STKKART güncelleme öncesi - STKKOD: ${item.STKKOD}, Miktar: ${item.STKADET}`
        );
        await updateSTKKART(item.STKKOD, item.STKADET);
        console.log(`STKKART güncelleme sonrası - STKKOD: ${item.STKKOD}`);
      }

      // CARKART tablosundaki CARCIKIRSTOP değerini güncelle
      const userCARKART = await getDataByUnique("CARKART", { CARKOD: userId });
      console.log("Mevcut CARKART verisi:", userCARKART);

      if (
        userCARKART &&
        typeof userCARKART === "object" &&
        !userCARKART.error
      ) {
        const currentCARCIKIRSTOP = parseFloat(userCARKART.CARCIKIRSTOP) || 0;
        const newCARCIKIRSTOP = currentCARCIKIRSTOP + totalPrice;

        console.log("Mevcut CARCIKIRSTOP:", currentCARCIKIRSTOP);
        console.log("Yeni sipariş tutarı:", totalPrice);
        console.log("Güncellenecek CARCIKIRSTOP:", newCARCIKIRSTOP);

        await updateDataByAny(
          "CARKART",
          { CARKOD: userId },
          { CARCIKIRSTOP: newCARCIKIRSTOP }
        );

        console.log("CARKART güncelleme sonucu:", {
          CARKOD: userId,
          CARCIKIRSTOP: newCARCIKIRSTOP,
        });
      } else {
        console.log("CARKART verisi bulunamadı veya hata oluştu:", userId);
        console.log("Hata detayı:", userCARKART.error);
      }

      const allOrders = await getAllData("ALLORDERS");

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
