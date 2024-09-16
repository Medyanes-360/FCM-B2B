import CustomerOrdersContainer from "@/containers/AdminCustomerOrders";
import React, { Suspense } from "react";

function page() {
  return (
    <Suspense fallback={<Loading />}>
      <CustomerOrdersContainer />
    </Suspense>
  );
}

export default page;
