export default function GeneralSummary({ order }) {
  return (
    <>
      <div
        id="general-summary"
        className="mt-2 rounded-xl shadow-md md:mx-8 xl:mx-32"
      >
        <div id="title-section" className="border-b p-2">
          <h1 className="font-bold text-xs md:text-base">Genel Özet</h1>
        </div>
        <div id="personal-info">
          <ul className="grid grid-cols-2 grid-rows-4 gap-1 md:gap-4 p-3">
            <li className="text-xs md:text-sm">
              CARKOD: <span className="font-semibold">{order.CARKOD}</span>
            </li>
            <li className="text-xs md:text-sm">
              ÜRÜN:
              <span className="font-semibold"> {order.STKNAME}</span>
            </li>
            <li className="text-xs md:text-sm">
              ŞİRKET: <span className="font-semibold">{order.CARUNVAN}</span>
            </li>
            <li className="text-xs md:text-sm">
              STK ADET: {order.STKADET}
              <span className="font-semibold"></span>
            </li>
            <li className="text-xs md:text-sm">
              STK FİŞ REF NO:{" "}
              <span className="font-semibold">{order.STKFISREFNO}</span>
            </li>
            <li className="text-xs md:text-sm">
              STK BİRİM FİYAT:{" "}
              <span className="font-semibold">{order.STKBIRIMFIYAT}</span>
            </li>
            <li className="text-xs md:text-sm">
              STK FİŞ EVRAK NO:{" "}
              <span className="font-semibold">{order.STKFISEVRAKNO1}</span>
            </li>
            <li className="text-xs md:text-sm">
              SİPARİŞ DURUMU:
              <span className="font-semibold"> {order.ORDERSTATUS}</span>
            </li>
          </ul>
          <h1 className="text-right font-bold p-3">Toplam {order.STKBIRIMFIYAT * order.STKADET}₺</h1>
        </div>
      </div>
    </>
  );
}
