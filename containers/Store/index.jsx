import MainButtonsComponent from "@/components/MainButtons";
import StoreComponent from "@/components/StoreComponent";
import React from "react";

function StoreContainer() {
  return (
    <div>
      <div>
        <MainButtonsComponent />
      </div>
      <div>
        <StoreComponent />
      </div>
    </div>
  );
}

export default StoreContainer;
