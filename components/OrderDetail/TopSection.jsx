export default function TopSection({ order }) {
  return (
    <>
      <div id="top-section" className="rounded-xl shadow-md md:mx-8 xl:mx-32">
        <div id="categories" className="flex rounded-t-xl border-b xl:py-2.5">
          <a
            href="/"
            className="text-xs md:text-base text-left ms-2 p-0.5 py-2 border-b-2 border-blue-600"
          >
            SİPARİŞ DETAYLARI
          </a>
        </div>
        <div id="content" className="p-3 xl:py-6 shadow-md rounded-xl">
          <h1 className="font-bold text-xs md:text-sm mb-3">GENEL BAKIŞ</h1>
          <ul>
            <li className="text-xs md:text-sm my-1 lg:my-3">
              <span className="font-semibold">Sipariş Tarihi:</span>
              {order.ORDERGUN}/{order.ORDERAY}/{order.ORDERYIL}
            </li>
            <li className="text-xs md:text-sm my-1 lg:my-3">
              <span className="font-semibold">Sipariş Saati:</span>
              {order.ORDERSAAT}
            </li>
            <li className="text-xs md:text-sm my-1 lg:my-3">
              <span className="font-semibold">Açıklama:</span>
              {order.ACIKLAMA === null ? "-" : order.ACIKLAMA}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
