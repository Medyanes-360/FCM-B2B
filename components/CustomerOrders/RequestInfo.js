import React from "react";

function RequestInfo({ requestInfo }) {
  if (!requestInfo) return null;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">Sipariş Talebi</h2>
      <p className="text-gray-700">{requestInfo}</p>
    </div>
  );
}

export default RequestInfo;
