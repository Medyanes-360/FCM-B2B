import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Banner from '@/components/Banner';

export default function HomeLayout({ children}) {
  return (
    <div className=" flex w-screen lg:w-full h-full flex-col items-center bg-[url('/backgroundImage.webp')] bg-no-repeat  bg-contain bg-[#6bcdec]">
      <div className='bg-white w-screen xl:w-[1188px]'>
        <Header />
      </div>
      <div className='bg-white'>{children}</div>
      <div className='bg-white  bottom-0'>
        <Footer />
      </div>
      <Banner />
    </div>
  );
}
