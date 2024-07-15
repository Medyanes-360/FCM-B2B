"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaSortUp, FaSortDown, FaPrint } from "react-icons/fa";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./TableComponents";
import Loading from "../Loading";
import "./printdata.css";
import { getAPI } from "../../services/fetchAPI/index";

export default function DetailedDataTable() {
  const { data: session } = useSession(); //session bilgisi icin state
  const [billingData, setBillingData] = useState([]);
  const [userCarBakiye, setUserCarBakiye] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); //Tarih sıralaması için kullandığımız state
  const [currentPage, setCurrentPage] = useState(1); //Sayfalama için kullandığımız state
  const [isLoading, setIsLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false); //Yazdırma durumu için kullandığımız state
  const itemsPerPage = 8; //Her sayfada kac satır oldugunu belirlemek için kullanılan state

  useEffect(() => {
    async function fetchData() {
      //Eğer kullanıcı giriş yapmamış ise istek atmaz.
      if (!session?.user?.id) return;

      try {
        // Verileri getirme işlemlerini tek promise ile birleştiriyoruz. Fetch için services kısmından getirdiğimiz getAPI fonksiyonunu kullanıyoruz.
        const [billingResponse, tableCartResponse] = await Promise.all([
          getAPI("/detailed-billings"),
          getAPI("/table-cart"),
        ]);

        if (!billingResponse || !tableCartResponse)
          throw new Error("API error");

        setBillingData(billingResponse.data);

        const userTableCartData = tableCartResponse.data.find(
          (item) => item.CARKOD === session?.user?.id
        );
        if (userTableCartData) setUserCarBakiye(userTableCartData.CARBAKIYE);
      } catch (error) {
        console.error("Data fetching error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [session?.user?.id]);

  const filteredData = billingData.filter(
    (item) => item.FATHARCARKOD === session?.user?.id
  );

  // Tarih sıralaması için kullandığımız fonksiyon
  const handleSort = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      const dateA = new Date(a.FATHARTAR);
      const dateB = new Date(b.FATHARTAR);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setBillingData(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  //Sayfalama için kullandığımız fonksiyon
  const paginatedData = isPrinting
    ? filteredData
    : filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  //Pagination butonlarını oluşturmak için kullandığımız fonksiyon
  function Pagination({ currentPage, totalPages, onPageChange }) {
    return (
      <div className="flex items-center no-print">
        <PaginationButton
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          icon={<MdKeyboardDoubleArrowLeft />}
        />
        <PaginationButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          icon={<MdKeyboardArrowLeft />}
        />
        <span className="border md:px-4 md:py-2 py-1 px-3 rounded-full bg-NavyBlue text-white ml-1">
          {currentPage}
        </span>
        <span className="mx-1">/</span>
        <span className="md:px-2 md:py-2 py-1 px-3 rounded-full">
          {totalPages}
        </span>
        <PaginationButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          icon={<MdKeyboardArrowRight />}
        />
        <PaginationButton
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          icon={<MdKeyboardDoubleArrowRight />}
        />
      </div>
    );
  }

  function PaginationButton({ onClick, disabled, icon }) {
    return (
      <button
        className={`border-2 rounded-sm text-[18px] mx-1 md:p-3 p-1 ${
          disabled
            ? "cursor-not-allowed text-gray-300"
            : "cursor-pointer hover:bg-gray-200 duration-300 hover:border-NavyBlue hover:rounded-xl"
        }`}
        onClick={onClick}
        disabled={disabled}
      >
        {icon}
      </button>
    );
  }

  //Tarih formatlamak için kullandığımız fonksiyon
  function formatDate(dateString) {
    return dateString
      ? new Date(dateString).toLocaleDateString("tr-TR")
      : "N/A";
  }

  //Para birimi formatlamak için kullandığımız fonksiyon
  function formatCurrency(amount) {
    return (
      amount?.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 2,
      }) || "N/A"
    );
  }

  //Yazdırma işlemleri için kullandığımız fonksiyon
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  //Eğer herhangi bir nedenden dolayı loading true olursa, Loading componenti render edilir.
  if (isLoading) return <Loading />;

  return (
    <div className="print-section">
      <div className="max-w-[1880px] mx-auto mt-8 flex flex-col justify-between items-center px-8 gap-4 md:flex-row">
        <div className="flex flex-col text-center md:text-left">
          <h1 className="text-xl md:text-2xl text-blue-500">
            Stoklu Cari Bilgisi
          </h1>
          <h1>
            <span className="font-bold">Cari Kodu:</span> {session?.user?.id}
          </h1>
          <h1>
            <span className="font-bold">Cari Unvanı:</span>{" "}
            {session?.user?.name}
          </h1>
          <h1>
            <span className="font-bold">Bakiye:</span>{" "}
            {formatCurrency(userCarBakiye)}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          <button
            onClick={handlePrint}
            className="bg-NavyBlue text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 flex items-center no-print"
          >
            <FaPrint className="mr-2" /> Yazdır
          </button>
        </div>
      </div>

      <div className="max-w-[1880px] mx-auto mt-6 border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={handleSort}
                className="cursor-pointer flex items-center py-12 md:py-6"
              >
                Tarih
                {sortOrder === "asc" ? (
                  <FaSortUp className="ml-2 no-print" />
                ) : (
                  <FaSortDown className="ml-2 no-print" />
                )}
              </TableHead>
              <TableHead>Ürün Kodu</TableHead>
              <TableHead>Ürün Cinsi</TableHead>
              <TableHead>Miktar</TableHead>
              <TableHead>Fiyat</TableHead>
              <TableHead>Borç</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow
                key={index}
                className={index % 2 === 0 ? "" : "bg-gray-100"}
              >
                <TableCell>{formatDate(item.FATHARTAR)}</TableCell>
                <TableCell>{item.FATHARSTKKOD}</TableCell>
                <TableCell>{item.FATHARSTKCINS}</TableCell>
                <TableCell>{item.FATHARMIKTAR}</TableCell>
                <TableCell>{formatCurrency(item.FATHARFIYAT)}</TableCell>
                <TableCell>
                  {formatCurrency(item.FATHARFIYAT * item.FATHARMIKTAR)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
