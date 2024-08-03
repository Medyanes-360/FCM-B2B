import GeneralSummary from "../OrderDetail/GeneralSummary";
import Navbar from "../OrderDetail/Navbar";
import ProductSummary from "../OrderDetail/ProductSummary";
import TopSection from "../OrderDetail/TopSection";

export default function OrderDetailModal({ isOpen, onClose, order }) {
    console.log(order)
  return (
    <>
      <div className="fixed inset-0 bg-gray-50 flex flex-col ">
        <Navbar
            orderNo={order.CARKOD}
            onClose={onClose}
        />
        <TopSection order={order} />
        <ProductSummary order={order} />
        <GeneralSummary
            order={order}
        />
      </div>
    </>
  );
}

{
  /* <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl mb-4">Order Details</h2>
          <p>
            <strong>ID:</strong> {order.ID}
          </p>
          <p>
            <strong>Name:</strong> {order.STKNAME}
          </p>
          <p>
            <strong>Customer:</strong> {order.CARUNVAN}
          </p>
          <p>
            <strong>Date:</strong> {order.DATE}
          </p>
          <p>
            <strong>Status:</strong> {order.ORDERSTATUS}
          </p>
          <p>
            <strong>Total Price:</strong> {order.ORDERFIYATTOPLAM}₺
          </p>
          <p>
            <strong>Address:</strong> {order.dealerAddress}
          </p>
          <button
            onClick={onClose}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div> */
}
