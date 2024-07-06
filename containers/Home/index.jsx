"use client";
import React, { useState, useEffect } from "react";
import SliderComponent from "@/components/SliderComponent";
import HomeCategories from "@/components/HomeCategories";
import WelcomeSection from "@/components/WelcomeSection";
import { useSession } from "next-auth/react";
import FixedHeader from "@/components/FixedHeader";
import MainButtonsComponent from "@/components/MainButtons";
import Loading from "@/components/Loading";

const HomeContainer = () => {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
    } else if (status === "authenticated") {
      setLoading(false);
      const savedCartItems = sessionStorage.getItem("cart");
      if (savedCartItems) {
        setCart(JSON.parse(savedCartItems));
      }
    } else {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated") {
      sessionStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, status]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col items-center">
          <div className="bg-white">
            <SliderComponent />
          </div>
          {session ? (
            <>
              <MainButtonsComponent />
              <FixedHeader />
              <div className="bg-white">
                <HomeCategories />
              </div>
            </>
          ) : (
            <div className="bg-white">
              <WelcomeSection />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default HomeContainer;
