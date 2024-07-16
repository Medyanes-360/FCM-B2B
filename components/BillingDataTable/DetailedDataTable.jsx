"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaSortUp, FaSortDown, FaPrint } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "./TableComponents";
import Loading from "../Loading";
import Link from "next/link";
import "./printdata.css";
import { getAPI } from "../../services/fetchAPI/index";
import ScrollButtons from "../ScrollButtons/ScrollButtons";

export default function DetailedDataTable() {
  const { data: session } = useSession();
  const [billingData, setBillingData] = useState([]);
  const [userCarBakiye, setUserCarBakiye] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [borcToplam, setBorcToplam] = useState(0);
  const [alacakToplam, setAlacakToplam] = useState(0);
  const [carBorcToplam, setCarBorcToplam] = useState(0);

  useEffect(() => {
    fetchData();
  }, [session?.user?.id]);

  const fetchData = async () => {
    //EGER KULLANICI GIRIS YAPMAMIS ISE TABLOYU GORUNTULUYEMEZ
    if (!session?.user?.id) return;

    try {
      // TUM ISTEKLERI TEK PROMISE ILE BIRLESTIRIYORUZ. CUNKU BIR VERI ERKEN YUKLENIRKEN DIGERLERI GEC YUKLENEBILIR.
      const [detailedBillings, tableCart, fatfis, billings] = await Promise.all(
        [
          getAPI("/detailed-billings"),
          getAPI("/table-cart"),
          getAPI("/fatfis"),
          getAPI("/billings"),
        ]
      );

      // EGER API'LERIN HERHANGI BIRI YOK ISE HATA MESAJI VERIR
      if (!detailedBillings || !tableCart || !fatfis || !billings) {
        throw new Error("API error");
      }

      // TUM DATALARI BIRLESTIRIYORUZ
      const enhancedBillingData = enhanceBillingData(
        detailedBillings.data,
        fatfis.data,
        billings.data
      );
      setBillingData(enhancedBillingData);

      processUserTableCartData(tableCart.data);
    } catch (error) {
      console.error("Data fetching error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // FATHAR VE CARHAR VERILERINI BURADA MATCHLIYORUZ.
  const enhanceBillingData = (detailedBillings, fatfisData, billingsData) => {
    return detailedBillings.map((billing) => {
      const matchingFatfis = fatfisData.find(
        (ff) => ff.FATFISREFNO === billing.FATHARREFNO
      );
      if (matchingFatfis) {
        const matchingBilling = billingsData.find(
          (b) => b.CARHARREFNO === matchingFatfis.FATFISCARREFNO
        );
        if (matchingBilling) {
          return {
            ...billing,
            CARHARACIKLAMA: matchingBilling.CARHARACIKLAMA,
            CARHARACIKLAMA1: matchingBilling.CARHARACIKLAMA1,
            CARHARISTIPKOD: matchingBilling.CARHARISTIPKOD,
          };
        }
      }
      return billing;
    });
  };

  //TABLO CART BILGILERINI ALIYORUZ
  const processUserTableCartData = (tableCartData) => {
    const userTableCartData = tableCartData.find(
      (item) => item.CARKOD === session?.user?.id
    );
    if (userTableCartData) {
      setUserCarBakiye(userTableCartData.CARBAKIYE);
      setAlacakToplam(userTableCartData.CARALACAKTOP);
      setCarBorcToplam(userTableCartData.CARBORCTOP);
      setBorcToplam(
        userTableCartData.CARBORCTOP - userTableCartData.CARALACAKTOP
      );
    }
  };

  //VERİYİ FİLTRELİYORUZ
  const filteredData = billingData.filter(
    (item) => item.FATHARCARKOD === session?.user?.id
  );

  //TARİHE GÖRE SIRALAMA
  const handleSort = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      const dateA = new Date(a.FATHARTAR);
      const dateB = new Date(b.FATHARTAR);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setBillingData(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  //TARIH FORMATLAMA
  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString("tr-TR") : "N/A";

  //PARA BİRİMİ FORMATLAMA
  const formatCurrency = (amount) =>
    amount?.toLocaleString("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
    }) || "N/A";

  //ÇIKTI ALMA ISLEMI
  const handlePrint = () => window.print();

  //EGER HERHANGI BIR OLAYDAN OTURU isLoading = true OLURSA EKRANDA LOADING COMP. GOZUKECEK.
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
            {/* TOPLAM BORCUN NEGATIF VEYA POZITIF OLMA DURUMUNA GORE RENGINI BELIRLIYORUZ. */}
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
          <Link href="/billings">
            <button className="bg-NavyBlue no-print text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300 flex items-center">
              Stoksuz Tabloya Geç
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
                className="cursor-pointer flex items-center py-8"
              >
                Tarih
                {sortOrder === "asc" ? (
                  <FaSortUp className="ml-2 no-print" />
                ) : (
                  <FaSortDown className="ml-2 no-print" />
                )}
              </TableHead>
              <TableHead>Ürün Kodu</TableHead>
              <TableHead>İşlem Tipi</TableHead>
              <TableHead>Ürün Cinsi</TableHead>
              <TableHead>Açıklama</TableHead>
              <TableHead>Ek Açıklama</TableHead>
              <TableHead>Miktar</TableHead>
              <TableHead>Fiyat</TableHead>
              <TableHead className="text-center">Borç</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item, index) => (
              <TableRow
                key={index}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <TableCell>{formatDate(item.FATHARTAR)}</TableCell>
                <TableCell>{item.FATHARSTKKOD}</TableCell>
                <TableCell>{item.CARHARISTIPKOD || "-"}</TableCell>
                <TableCell>{item.FATHARSTKCINS}</TableCell>
                <TableCell>{item.CARHARACIKLAMA || "-"}</TableCell>
                <TableCell>{item.CARHARACIKLAMA1 || "-"}</TableCell>
                <TableCell>{item.FATHARMIKTAR}</TableCell>
                <TableCell>{formatCurrency(item.FATHARFIYAT)}</TableCell>
                <TableCell className="text-center">
                  {/* URUN FIYATI ILE SATIN ALINAN MIKTAR CARPILARAK BORC TUTARI ALINIR */}
                  {formatCurrency(item.FATHARFIYAT * item.FATHARMIKTAR)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="no-print">
            <TableRow>
              <TableCell colSpan={4}></TableCell>
              <TableCell colSpan={2} className="text-right font-bold">
                Alacak Toplam:
                <span className="ml-2 text-green-500">
                  {formatCurrency(alacakToplam)}
                </span>
              </TableCell>
              <TableCell colSpan={2} className="text-left font-bold">
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
          {/* SCROLL BUTONLARI */}
          <ScrollButtons />
        </div>
      </div>
    </div>
  );
}
