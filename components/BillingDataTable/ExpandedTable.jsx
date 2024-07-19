import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./TableComponents";

export default function ExpandedTable({
  detailedData,
  formatDate,
  formatCurrency,
}) {
  return (
    <Table className="w-full border-collapse">
      <TableHeader>
        <TableRow className="bg-blue-200">
          <TableHead className="py-2">Tarih</TableHead>
          <TableHead className="py-2">Ürün Kodu</TableHead>
          <TableHead className="py-2">Ürün Cinsi</TableHead>
          <TableHead className="py-2">Miktar</TableHead>
          <TableHead className="py-2">Fiyat</TableHead>
          <TableHead className="py-2">Toplam</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {detailedData.map((detailItem, detailIndex) => (
          <TableRow key={detailIndex}>
            <TableCell className="py-2 pl-4">
              {formatDate(detailItem.FATHARTAR)}
            </TableCell>
            <TableCell className="py-2 pl-4">
              {detailItem.FATHARSTKKOD}
            </TableCell>
            <TableCell className="py-2 pl-4">
              {detailItem.FATHARSTKCINS}
            </TableCell>
            <TableCell className="py-2 pl-4">
              {detailItem.FATHARMIKTAR}
            </TableCell>
            <TableCell className="py-2 pl-4">
              {formatCurrency(detailItem.FATHARFIYAT)}
            </TableCell>
            <TableCell className="py-2 pl-4">
              {formatCurrency(detailItem.FATHARTUTAR)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
