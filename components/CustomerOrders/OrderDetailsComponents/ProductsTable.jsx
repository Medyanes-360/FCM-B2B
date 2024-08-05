export default function ProductsTable({
  product,
  company,
  quantity,
  quantityCost,
  totalCost,
}) {
  return (
    <div id="table">
      <div className="bg-white rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-xs md:text-sm p-1">ÜRÜN</th>
              <th className="text-xs md:text-sm p-1">BİRİM FİYAT</th>
              <th className="text-xs md:text-sm p-1">İSK.</th>
              <th className="text-xs md:text-sm p-1">ADET</th>
              <th className="text-xs md:text-sm p-1">TOPLAM</th>
            </tr>
          </thead>
          <tbody>
                <>
                  <tr className="border-b hover:bg-gray-200">
                    <td className="text-xs md:text-sm text-center py-0.5 md:py-2 px-1">
                      {product}
                    </td>
                    <td className="text-xs md:text-sm text-center py-0.5 px-1">
                      {quantityCost}
                    </td>
                    <td className="text-xs md:text-sm text-center py-0.5 px-1">
                      %0
                    </td>
                    <td className="text-xs md:text-sm text-center py-0.5 px-1">
                      {quantity}
                    </td>
                    <td className="text-xs md:text-sm text-center py-0.5 px-1">
                      {totalCost} ₺
                    </td>
                  </tr>
                </>
          </tbody>
        </table>
      </div>
    </div>
  );
}
