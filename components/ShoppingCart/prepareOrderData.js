import { getAPI, putAPI } from "@/services/fetchAPI";
import { updateDataByAny } from "@/services/serviceOperations";

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

const getAndUpdateReferences = async () => {
  try {
    // Önce mevcut değerleri alalım
    const cartApiResponse = await getAPI("/cart-api");
    const harrefnoData = cartApiResponse?.data?.HARREFNO || [];
    const evraknoData = cartApiResponse?.data?.EVRAKNO || [];

    // HARREFNO işlemleri
    const harrefModule6 = harrefnoData.find((item) => item.HARREFMODUL === 6);
    let newHarRefDeger = harrefModule6 ? harrefModule6.HARREFDEGER + 1 : 1;

    // EVRAKNO işlemleri
    const cikisFisEvrako = evraknoData.find(
      (item) => item.EVRACIKLAMA === "Çıkış Fişleri"
    );
    let newCikisFisEvrNo = cikisFisEvrako ? cikisFisEvrako.EVRNO + 1 : 1;

    // Şimdi güncellemeleri yapalım
    const updatePromises = [
      updateDataByAny(
        "HARREFNO",
        { HARREFMODUL: 6 },
        { HARREFDEGER: newHarRefDeger }
      ),
      updateDataByAny(
        "EVRAKNO",
        { EVRACIKLAMA: "Çıkış Fişleri" },
        { EVRNO: newCikisFisEvrNo }
      ),
    ];

    await Promise.all(updatePromises);
    console.log("All Order Data Updated:", updatePromises);

    return {
      harRefDeger: newHarRefDeger,
      cikisFisEvrNo: newCikisFisEvrNo,
    };
  } catch (error) {
    console.error("Referans değerlerini güncellerken hata oluştu:", error);
    throw error;
  }
};

const prepareOrderData = async (cartItems, totalPrice, userId, userName) => {
  try {
    const orderNo = generateOrderNo(userId);

    // Referans değerlerini güncelleyelim ve alalım
    const { harRefDeger, cikisFisEvrNo } = await getAndUpdateReferences();

    // Cart API'den diğer gerekli verileri çekelim
    const cartApiResponse = await getAPI("/cart-api");
    const stkfisData = cartApiResponse?.data?.STKFIS?.[0] || {};
    const stkFisRefNo = (stkfisData?.STKFISREFNO || 0) + 1;

    const baseOrderData = {
      ORDERNO: orderNo,
      CARKOD: userId,
      CARUNVAN: userName,
      ORDERFIYATTOPLAM: totalPrice,
      CIKISFISEVRNO: cikisFisEvrNo,
      SATISIRSEVRNO: cikisFisEvrNo,
      HARREFDEGER1: harRefDeger,
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
  } catch (error) {
    console.error("Sipariş verilerini hazırlarken hata oluştu:", error);
    throw error;
  }
};

export default prepareOrderData;
