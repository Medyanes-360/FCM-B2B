import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Banner from "@/components/Banner";

const StoreLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-DarkBlue">
      <Header />
      <div className="bg-white flex-grow ">
        {children}
        <Footer />
        <Banner />
      </div>
    </div>
  );
};

export default StoreLayout;
