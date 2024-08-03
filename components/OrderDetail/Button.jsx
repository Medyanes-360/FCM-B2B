export default function Button({ id }) {
  // hover:scale-110 transition-all duration-500 ease-in-out transform
  //   return (
  //     <>
  //       <button className="bg-blue-600 text-white rounded-xl px-3 py-2 w-46 text-sm hover:scale-110 hover:transition-all hover:duration-500 hover:ease-in-out hover:transform">
  //         BACK TO ORDERS
  //       </button>
  //     </>
  //   );

  const button = () => {
    switch (id) {
      case 1:
        return (
          <button className="bg-blue-600 text-white rounded-xl px-2 py-1 w-46 text-sm hover:scale-110 hover:transition-all hover:duration-500 hover:ease-in-out hover:transform md:px-3 md:py-2">
            SİPARİŞLERE GERİ DÖN
          </button>
        );
      case 2:
        return (
          <button className="bg-gray-200 text-gray-700 font-medium px-2 py-1 md:py-2 md:px-4 rounded-lg text-xs hover:scale-110 hover:transition-all hover:duration-500 hover:ease-in-out hover:transform">
            STOKTA YOK E-POSTASI GÖNDER
          </button>
        );
      case 3:
        return (
          <button className="bg-blue-600 text-white font-medium px-2 py-1 md:py-2 md:px-4 rounded-lg text-xs hover:scale-110 hover:transition-all hover:duration-500 hover:ease-in-out hover:transform">
            + ADD PRODUCT
          </button>
        );
      case 4:
        return (
          <button className="bg-gray-100 flex items-center justify-center tracking-wide gap-1 text-gray-700 rounded-lg py-1 px-2 text-xs">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2V1L8 5L12 9V6C15.31 6 18 8.69 18 12C18 15.31 15.31 18 12 18C10.53 18 9.17 17.47 8.11 16.54L6.7 17.95C8.12 19.23 9.96 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4ZM6 12C6 8.69 8.69 6 12 6V4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20V18C8.69 18 6 15.31 6 12Z"
                fill="#B3B3B3"
              />
            </svg>
            CHANGE
          </button>
        );
    }
  };
  return <>{button()}</>;
}
