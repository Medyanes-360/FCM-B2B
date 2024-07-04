import React, { forwardRef } from "react";

const Table = forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={`w-full caption-bottom text-sm ${className || ""}`}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = forwardRef(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={`[&_tr]:border-b ${className || ""}`}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={`[&_tr:last-child]:border-0 ${className || ""}`}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableFooter = forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={`border-t bg-muted/50 font-medium [&>tr]:last:border-b-0 ${
      className || ""
    }`}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${
      className || ""
    }`}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={`h-10 px-4 py-3 font-bold text-left align-middle text-white bg-NavyBlue text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] ${
      className || ""
    }`}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={`py-6 px-3 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] ${
      className || ""
    }`}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={`mt-4 text-sm text-muted-foreground ${className || ""}`}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};