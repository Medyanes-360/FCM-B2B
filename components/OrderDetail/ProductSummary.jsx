import Button from "./Button";
import ProductsTable from "./ProductsTable";

export default function ProductSummary({order}) {
  return (
    <>
      <div id="product-summary" className="mt-2 rounded-xl shadow-md md:mx-8 xl:mx-32">
        <div id="title-section" className="flex justify-between px-2 gap-1 items-center md:py-2">
          <h1 className="text-xs md:text-base text-center font-bold">Ürün Özeti</h1>
          <div className="flex flex-col md:flex-row gap-2 my-1">
            <Button id={2} />
          </div>
        </div>
        <div className="w-full">
          <ProductsTable order={order}
          />
        </div>
      </div>
    </>
  );
}
