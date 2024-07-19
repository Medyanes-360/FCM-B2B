"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaPrint, FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./TableComponents";
import "./printdata.css";
import Loading from "../Loading";
import { getAPI } from "../../services/fetchAPI/index";
import ScrollButtons from "../ScrollButtons/ScrollButtons";
import ExpandedTable from "./ExpandedTable";

// DataTable bileşeni: Kullanıcının cari hesap bilgilerini ve işlem geçmişini gösteren ana bileşen
export default function DataTable() {
  // NextAuth oturumu kullanarak kullanıcı bilgilerini alma
  const { data: session } = useSession();

  // State tanımlamaları
  const [data, setData] = useState([]); // Ana tablo verisi
  const [detailedData, setDetailedData] = useState([]); // Detaylı tablo verisi
  const [userCarBakiye, setUserCarBakiye] = useState(null); // Kullanıcı cari bakiyesi
  const [isLoading, setIsLoading] = useState(true); // Yükleme durumu
  const [borcToplam, setBorcToplam] = useState(0); // Toplam borç
  const [alacakToplam, setAlacakToplam] = useState(0); // Toplam alacak
  const [carBorcToplam, setCarBorcToplam] = useState(0); // Cari borç toplamı
  const [expandedRow, setExpandedRow] = useState(null); // Genişletilmiş satır

  // Kullanıcı oturumu başladığında verileri çekme
  useEffect(() => {
    if (session?.user?.id) {
      fetchData();
    }
  }, [session?.user?.id]);

  // Verileri API'den çeken asenkron fonksiyon
  async function fetchData() {
    try {
      // Birden fazla API çağrısını paralel olarak yapma
      const [billingData, tableCartData, detailedBillings, fatfis] =
        await Promise.all([
          getAPI("/billings"),
          getAPI("/table-cart"),
          getAPI("/detailed-billings"),
          getAPI("/fatfis"),
        ]);

      // API yanıtlarının geçerliliğini kontrol etme
      if (!billingData || !tableCartData || !detailedBillings || !fatfis) {
        throw new Error("API hatası: Bir veya daha fazla API yanıt vermedi");
      }

      // Kullanıcıya ait verileri filtreleme
      const filteredData = billingData.data.filter(
        (item) => item.CARHARCARKOD === session.user.id
      );

      // Verileri tarih sırasına göre sıralama (eskiden yeniye)
      const sortedData = filteredData.sort((a, b) => {
        const dateA = new Date(a.CARHARTAR);
        const dateB = new Date(b.CARHARTAR);
        return dateA - dateB;
      });

      // Sıralanmış verileri state'e atama
      setData(sortedData);

      // Detaylı fatura verilerini işleme
      const enhancedDetailedData = enhanceBillingData(
        detailedBillings.data,
        fatfis.data,
        billingData.data
      );
      // Kullanıcıya ait detaylı verileri filtreleme ve state'e atama
      setDetailedData(
        enhancedDetailedData.filter(
          (item) => item.FATHARCARKOD === session.user.id
        )
      );

      // Kullanıcının cari kart bilgilerini bulma
      const userTableCartData = tableCartData.data.find(
        (item) => item.CARKOD === session.user.id
      );
      if (userTableCartData) {
        // Kullanıcı cari bilgilerini state'e atama
        setUserCarBakiye(userTableCartData.CARBAKIYE);
        setAlacakToplam(userTableCartData.CARALACAKTOP);
        setCarBorcToplam(userTableCartData.CARBORCTOP);
        setBorcToplam(
          userTableCartData.CARBORCTOP - userTableCartData.CARALACAKTOP
        );
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      // Yükleme durumunu sonlandırma
      setIsLoading(false);
    }
  }

  // Detaylı fatura verilerini işleyen yardımcı fonksiyon
  function enhanceBillingData(detailedBillings, fatfisData, billingsData) {
    return detailedBillings.reduce((acc, billing) => {
      // Eşleşen fatura fişini bulma
      const matchingFatfis = fatfisData.find(
        (ff) => ff.FATFISREFNO === billing.FATHARREFNO
      );
      if (matchingFatfis) {
        // Eşleşen fatura kaydını bulma
        const matchingBilling = billingsData.find(
          (b) => b.CARHARREFNO === matchingFatfis.FATFISCARREFNO
        );
        if (matchingBilling) {
          // Eşleşen verileri birleştirip yeni nesne oluşturma
          acc.push({
            ...billing,
            CARHARREFNO: matchingBilling.CARHARREFNO,
            CARHARACIKLAMA: matchingBilling.CARHARACIKLAMA,
            CARHARACIKLAMA1: matchingBilling.CARHARACIKLAMA1,
            CARHARISTIPKOD: matchingBilling.CARHARISTIPKOD,
          });
        }
      }
      return acc;
    }, []);
  }

  // Tarih formatını düzenleyen yardımcı fonksiyon
  function formatDate(dateString) {
    return dateString ? new Date(dateString).toLocaleDateString("tr-TR") : "-";
  }

  // Para birimini formatlayan yardımcı fonksiyon
  function formatCurrency(amount) {
    return (
      amount?.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 2,
      }) || "N/A"
    );
  }

  // Yazdırma işlemini başlatan fonksiyon
  function handlePrint() {
    window.print();
  }

  // Satır genişletme/daraltma işlemini yöneten fonksiyon
  function handleRowClick(carharItem) {
    setExpandedRow(
      expandedRow === carharItem.CARHARREFNO ? null : carharItem.CARHARREFNO
    );
  }

  // Yükleme durumunda Loading bileşenini gösterme
  if (isLoading) return <Loading />;

  // Ana bileşen render'ı
  return (
    <div className="print-section">
      {/* Üst bilgi bölümü */}
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
            {formatCurrency(-userCarBakiye)}{" "}
            <span
              className={`${
                borcToplam > 0 ? "text-red-500" : "text-green-500"
              }`}
            >
              {borcToplam < 0 ? "(ALACAK)" : "(BORÇ)"}
            </span>
          </h1>
        </div>
        {/* Çıktı butonu */}
        <button
          onClick={handlePrint}
          className="bg-NavyBlue text-white px-4 py-2 rounded-full hover:bg-LightBlue transition duration-300 flex items-center no-print"
        >
          <FaPrint className="mr-2" /> Yazdır
        </button>
      </div>

      {/* Ana tablo bölümü */}
      <div className="max-w-[1880px] mx-auto mt-4 mb-8 border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-10">Tarih</TableHead>
              <TableHead className="py-4">İşlem</TableHead>
              <TableHead className="py-4">Vade Tarihi</TableHead>
              <TableHead className="py-4">Ek Açıklama</TableHead>
              <TableHead className="py-4">Açıklama</TableHead>
              <TableHead className="py-4">Borç</TableHead>
              <TableHead className="py-4">Alacak</TableHead>
              <TableHead className="py-4">Bakiye</TableHead>
              <TableHead className="py-4">Detaylar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data
              .reduce((acc, item, index) => {
                // Borç ve alacak hesaplamaları
                const isBorc = item.CARHARGCFLAG === 1;
                const isAlacak = item.CARHARGCFLAG === 2;
                const borcAmount = isBorc ? item.CARHARTUTAR : 0;
                const alacakAmount = isAlacak ? item.CARHARTUTAR : 0;
                const previousBalance =
                  acc.length > 0 ? acc[acc.length - 1].balance : 0;
                const balance = previousBalance + borcAmount - alacakAmount;

                // Hesaplanan değerlerle yeni nesne oluşturma
                acc.push({
                  ...item,
                  borcAmount,
                  alacakAmount,
                  balance,
                });

                return acc;
              }, [])
              .map((item, index) => (
                <React.Fragment key={item.CARHARREFNO}>
                  {/* Ana tablo satırı */}
                  <TableRow
                    className={`${
                      expandedRow === item.CARHARREFNO
                        ? "bg-blue-50 border-2 border-NavyBlue"
                        : index % 2 === 0
                        ? "bg-gray-100 hover:bg-gray-200"
                        : "bg-white hover:bg-gray-200"
                    } cursor-pointer transition-all duration-300`}
                    onClick={() => handleRowClick(item)}
                  >
                    <TableCell className="py-4 pl-4">
                      {formatDate(item.CARHARTAR)}
                    </TableCell>
                    <TableCell className="py-4 pl-4">
                      {item.CARHARISTIPKOD}
                    </TableCell>
                    <TableCell className="py-4 pl-4">
                      {formatDate(item.CARHARVADETAR) === "01.01.1900"
                        ? "-"
                        : formatDate(item.CARHARVADETAR)}
                    </TableCell>
                    <TableCell className="py-4 pl-4">
                      {item.CARHARACIKLAMA1}
                    </TableCell>
                    <TableCell className="py-4 pl-4">
                      {item.CARHARACIKLAMA}
                    </TableCell>
                    <TableCell
                      className={`py-4 pl-4 ${
                        item.borcAmount > 0 ? "text-red-500" : ""
                      }`}
                    >
                      {formatCurrency(item.borcAmount)}
                    </TableCell>
                    <TableCell
                      className={`py-4 pl-4 ${
                        item.alacakAmount > 0 ? "text-green-500" : ""
                      }`}
                    >
                      {formatCurrency(item.alacakAmount)}
                    </TableCell>
                    <TableCell className="py-4 pl-4">
                      {formatCurrency(Math.abs(item.balance))}
                      {item.balance > 0
                        ? " (B)"
                        : item.balance < 0
                        ? " (A)"
                        : ""}
                    </TableCell>
                    <TableCell className="py-4 pl-4">
                      <div className="flex items-center">
                        {expandedRow === item.CARHARREFNO ? (
                          <FaChevronUp className="text-blue-500" />
                        ) : (
                          <FaChevronDown />
                        )}
                        <span className="ml-2">
                          {expandedRow === item.CARHARREFNO
                            ? "Kapat"
                            : "Stok Bilgisi"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                  {/* Genişletilmiş satır (detay tablosu) */}
                  {expandedRow === item.CARHARREFNO && (
                    <TableRow className="bg-white border-2 border-b-2 border-t-0 border-NavyBlue">
                      <TableCell colSpan={9} className="p-0">
                        <ExpandedTable
                          detailedData={detailedData.filter(
                            (fathar) => fathar.CARHARREFNO === item.CARHARREFNO
                          )}
                          formatDate={formatDate}
                          formatCurrency={formatCurrency}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
        <div className="text-right md:w-[1880px] border-b-0 border-x-0 border-t flex items-center justify-end py-6 px-4 gap-4 no-print">
          <div className="font-normal">
            Borç Toplam:
            <span className="ml-2 text-red-500">
              {formatCurrency(carBorcToplam)}
            </span>
          </div>
          <div className="font-normal">
            Alacak Toplam:
            <span className="ml-2 text-green-500">
              {formatCurrency(alacakToplam)}
            </span>
          </div>
          <div className="font-normal">
            Genel Toplam:
            <span
              className={`ml-2 ${
                borcToplam > 0 ? "text-red-500" : "text-green-500"
              }`}
            >
              {formatCurrency(Math.abs(borcToplam))}
              {borcToplam > 0 ? " (B)" : " (A)"}
            </span>
          </div>
        </div>
        <div className="flex justify-end no-print">
          <ScrollButtons />
        </div>
      </div>
    </div>
  );
}
