import { getAPI } from "@/services/fetchAPI";
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

const prepareOrderData = async (cartItems, totalPrice, userId, userName) => {
  const orderNo = generateOrderNo(userId);

  // Cart API'den tüm gerekli verileri çekelim
  const cartApiResponse = await getAPI("/cart-api");

  console.log("Cart API Response:", cartApiResponse);

  // API'den gelen verileri güvenli bir şekilde alın
  const evraknoData = cartApiResponse?.data?.EVRAKNO?.[0] || {};
  const harrefnoData = cartApiResponse?.data?.HARREFNO?.[0] || {};
  const stkfisData = cartApiResponse?.data?.STKFIS?.[0] || {};

  // Gerekli değerleri hesaplayın, varsayılan değerler kullanarak
  const cikisFisEvrNo = (evraknoData?.CIKISFISEVRNO || 0) + 1;
  const satisIrsEvrNo = (evraknoData?.SATISIRSEVRNO || 0) + 1;
  const harRefDeger1 = (harrefnoData?.HARREFDEGER || 0) + 1;
  const stkFisRefNo = (stkfisData?.STKFISREFNO || 0) + 1;

  const baseOrderData = {
    ORDERNO: orderNo,
    CARKOD: userId,
    CARUNVAN: userName,
    ORDERFIYATTOPLAM: totalPrice,
    CIKISFISEVRNO: cikisFisEvrNo,
    SATISIRSEVRNO: satisIrsEvrNo,
    HARREFDEGER1: harRefDeger1,
    STKFISREFNO: stkFisRefNo,
    ORDERYIL: now.getFullYear(),
    ORDERAY: now.getMonth() + 1,
    ORDERGUN: now.getDate(),
    ORDERSAAT: now.toTimeString().split(" ")[0],
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

  const orderItems = cartItems.map((item) => ({
    ...baseOrderData,
    STKKOD: item.STKKOD,
    STKNAME: item.STKCINSI || null,
    STKCINSI: item.STKCINSI || null,
    STKADET: item.quantity,
    STKBIRIMFIYAT: parseFloat(item.STKOZKOD5) || 0,
    STKBIRIMFIYATTOPLAM: (parseFloat(item.STKOZKOD5) || 0) * item.quantity,
  }));

  return orderItems;
};

export default prepareOrderData;
