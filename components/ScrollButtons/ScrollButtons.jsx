import React, { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

//BUTTONLARI KULLANMAK ICIN COMPONENTIN EN ALTINA <ScrollButtons /> SEKLINDE YAPISTIRIN.

const ScrollButtons = () => {
  const [showTopButton, setShowTopButton] = useState(false);
  const [showBottomButton, setShowBottomButton] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      setShowTopButton(scrollTop > 300);
      setShowBottomButton(scrollTop + clientHeight < scrollHeight - 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      {showTopButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 w-[85px] opacity-70 hover:opacity-100 flex items-center bg-NavyBlue text-white px-2 py-3 mb-2 rounded-full shadow-lg transition-colors duration-300"
          aria-label="Scroll to top"
        >
          <FaArrowUp />
          En üst
        </button>
      )}
      {showBottomButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-8 right-4 opacity-70 hover:opacity-100 flex w-[85px] items-center bg-NavyBlue text-white px-2 py-3 rounded-full shadow-lg transition-colors duration-300"
          aria-label="Scroll to bottom"
        >
          <FaArrowDown />
          En alt
        </button>
      )}
    </>
  );
};

export default ScrollButtons;
