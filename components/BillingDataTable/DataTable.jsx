"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaSortUp, FaSortDown, FaPrint } from "react-icons/fa";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "./TableComponents";
import "./printdata.css";
import Loading from "../Loading";
import { getAPI } from "../../services/fetchAPI/index";
import ScrollButtons from "../ScrollButtons/ScrollButtons";

export default function DataTable() {
  const { data: session } = useSession();
  const [data, setData] = useState([]);
  const [userCarBakiye, setUserCarBakiye] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [borcToplam, setBorcToplam] = useState(0);
  const [alacakToplam, setAlacakToplam] = useState(0);
  const [carBorcToplam, setCarBorcToplam] = useState(0);

  useEffect(() => {
    async function fetchData() {
      if (!session?.user?.id) return;

      try {
        const [billingData, tableCartData] = await Promise.all([
          getAPI("/billings"),
          getAPI("/table-cart"),
        ]);

        if (!billingData || !tableCartData) throw new Error("API error");

        const filteredData = billingData.data.filter(
          (item) => item.CARHARCARKOD === session.user.id
        );
        setData(filteredData);

        const userTableCartData = tableCartData.data.find(
          (item) => item.CARKOD === session.user.id
        );
        if (userTableCartData) {
          setUserCarBakiye(userTableCartData.CARBAKIYE);
          setAlacakToplam(userTableCartData.CARALACAKTOP);
          setCarBorcToplam(userTableCartData.CARBORCTOP);
          const borcToplam =
            userTableCartData.CARBORCTOP - userTableCartData.CARALACAKTOP;
          setBorcToplam(borcToplam);
        }
      } catch (error) {
        console.error("Data fetching error:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [session?.user?.id]);

  const handleSort = () => {
    const sortedData = [...data].sort((a, b) => {
      const dateA = new Date(a.CARHARTAR);
      const dateB = new Date(b.CARHARTAR);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setData(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  function formatDate(dateString) {
    return dateString
      ? new Date(dateString).toLocaleDateString("tr-TR")
      : "N/A";
  }

  function formatCurrency(amount) {
    return (
      amount?.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 2,
      }) || "N/A"
    );
  }

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return <Loading />;

  return (
    <div className="print-section">
      <div className="max-w-[1880px] mx-auto mt-8 flex flex-col justify-between items-center px-8 gap-4 md:flex-row">
        <div className="flex flex-col text-center md:text-left">
          <h1 className="text-xl md:text-2xl text-blue-500">Cari Bilgisi</h1>
          <h1>
            <span className="font-bold">Cari Kodu:</span> {session?.user?.id}
          </h1>
          <h1>
            <span className="font-bold">Cari Unvanı:</span>{" "}
            {session?.user?.name}
          </h1>
          <h1>
            <span className="font-bold">Bakiye:</span>{" "}
            {formatCurrency(userCarBakiye)}{" "}
            <span
              className={`${
                borcToplam > 0 ? "text-red-500" : "text-green-500"
              }`}
            >
              {borcToplam < 0 ? "(ALACAK)" : "(BORÇ)"}
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/detailed-billings">
            <button className="bg-NavyBlue text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 flex items-center">
              Stoklu Tabloya Geç
            </button>
          </Link>
          <button
            onClick={handlePrint}
            className="bg-NavyBlue text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 flex items-center no-print"
          >
            <FaPrint className="mr-2" /> Yazdır
          </button>
        </div>
      </div>
      <div className="max-w-[1880px] mx-auto mt-4 mb-8 border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={handleSort}
                className="cursor-pointer py-8 flex items-center"
              >
                Tarih
                {sortOrder === "asc" ? (
                  <FaSortUp className="ml-2 no-print" />
                ) : (
                  <FaSortDown className="ml-2 no-print" />
                )}
              </TableHead>
              <TableHead>İşlem</TableHead>
              <TableHead>Vade Tarihi</TableHead>
              <TableHead>Ek Açıklama</TableHead>
              <TableHead>Açıklama</TableHead>
              <TableHead>Borç</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow
                key={index}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <TableCell>{formatDate(item.CARHARTAR)}</TableCell>
                <TableCell>{item.CARHARISTIPKOD}</TableCell>
                <TableCell>
                  {formatDate(item.CARHARVADETAR) === "01.01.1900"
                    ? "-"
                    : formatDate(item.CARHARVADETAR)}
                </TableCell>
                <TableCell>{item.CARHARACIKLAMA1}</TableCell>
                <TableCell>{item.CARHARACIKLAMA}</TableCell>
                <TableCell>{formatCurrency(item.CARHARTUTAR)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="no-print">
            <TableRow>
              <TableCell colSpan={3}></TableCell>
              <TableCell className="text-right font-bold">
                {/* Alacak Toplam:
                <span className="ml-2 text-green-500">
                  {formatCurrency(alacakToplam)}
                </span> */}
              </TableCell>
              <TableCell className="text-right font-bold">
                Alacak Toplam:
                <span className="ml-2 mr-6 text-green-500">
                  {formatCurrency(alacakToplam)}
                </span>
                Borç Toplam:
                <span className="ml-2 text-red-500">
                  {formatCurrency(carBorcToplam)}
                </span>
              </TableCell>
              <TableCell className="text-left font-bold">
                Genel Toplam:
                <span
                  className={`ml-2 ${
                    borcToplam > 0 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {formatCurrency(borcToplam)}
                </span>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <div className="flex justify-end no-print">
          <ScrollButtons />
        </div>
      </div>
    </div>
  );
}
