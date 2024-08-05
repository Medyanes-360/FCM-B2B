export default function TopSection({ day, month, year, time, description }) {
  return (
    <>
      <div id="top-section" className="w-full">
        <div id="categories" className="flex rounded-t-xl border-b xl:py-2.5">
          <a
            href="/"
            className="text-xs md:text-base text-left ms-2 p-0.5 py-2 border-b-2 border-blue-600"
          >
            SİPARİŞ DETAYLARI
          </a>
        </div>
        <div id="content" className="p-3 xl:py-6 shadow-md rounded-xl">
          <h1 className="font-bold text-sm md:text-sm mb-3">GENEL BAKIŞ</h1>
          <ul className="flex flex-col gap-3">
            <li className="text-sm"><span className="font-semibold">Sipariş Tarihi:</span> {day}/{month}/{year}</li>
            <li className="text-sm"><span className="font-semibold">Sipariş Saati:</span> {time}</li>
            <li className="text-sm"><span className="font-semibold">Açıklama:</span> {description === null ? "-" : description}</li>
          </ul>
        </div>
      </div>
    </>
  );
}
