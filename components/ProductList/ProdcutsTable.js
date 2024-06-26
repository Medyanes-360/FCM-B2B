import React, { useState, useEffect } from 'react';
import { FaImage } from "react-icons/fa6";
import { PiCaretUpDownFill } from "react-icons/pi";
import { FaCaretDown } from "react-icons/fa";
import { FaCaretUp } from "react-icons/fa";
import ProductModal from './ProductModal';
import Link from 'next/link';
import { IoIosCloseCircle } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import Loading from '../Loading';





function ProdcutsTable({currentProducts,setSelectedProducts,selectedProducts, loading}) {
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortedColumn, setSortedColumn] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [productImage, setProductImage] = useState(null)
 const [selectAll, setSelectAll] = useState(false);

  const handleOpenModal = (product) => {
    setIsOpenModal(true)
    setProductImage(product)
  }
  const handleSort = (column) => {
    if (sortedColumn === column) {
      // Sıralama sırasını tersine çevir
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Yeni bir sütuna tıklandığında sıralama sırasını varsayılan olarak ayarla
      setSortedColumn(column);
      setSortOrder('asc');
    }
  };

 
  useEffect(() => {
    // Tüm ürünler seçiliyse, seçili ürünleri güncelle
    if (selectAll) {
      setSelectedProducts(currentProducts.map((product) => product));
    } else {
      setSelectedProducts([]);
    }
  }, [selectAll]);
    // checkbox işlmeleri BAşlangıç

   

  
    const handleSelectAll = () => {
      setSelectAll(!selectAll);
    };
    
  
    const handleProductSelect = (product) => {
      if (selectedProducts.some((p) => p.STKKOD === product.STKKOD)) {
        setSelectedProducts(selectedProducts.filter((p) => p.STKKOD !== product.STKKOD));
      } else {
        setSelectedProducts([...selectedProducts, product]);
      }
    };
    // checkbox işlmeleri Bitiş

  let sortedProducts = [...currentProducts];

  if (sortedColumn === 'name') {
    sortedProducts = [...currentProducts].sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      let comparison = 0;
      if (nameA > nameB) comparison = 1;
      else if (nameA < nameB) comparison = -1;
      return sortOrder === 'desc' ? comparison * -1 : comparison;
    });
  } else if (sortedColumn === 'price') {
    sortedProducts = [...currentProducts].sort((a, b) => {
      const priceA = a.price;
      const priceB = b.price;
      let comparison = 0;
      if (priceA > priceB) comparison = 1;
      else if (priceA < priceB) comparison = -1;
      return sortOrder === 'desc' ? comparison * -1 : comparison;
    });
  } else if (sortedColumn === 'stokCount') {
    sortedProducts = [...currentProducts].sort((a, b) => {
      const stokCountA = a.stokCount;
      const stokCountB = b.stokCount;
      let comparison = 0;
      if (stokCountA > stokCountB) comparison = 1;
      else if (stokCountA < stokCountB) comparison = -1;
      return sortOrder === 'desc' ? comparison * -1 : comparison;
    });
    
  }else if (sortedColumn === 'lastUpdateDate') {
    sortedProducts.sort((a, b) => {
      const dateA = new Date(a.date.lastUpdateDate);
      const dateB = new Date(b.date.lastUpdateDate);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }

  return (  
    <div className="overflow-x-auto border">
    {
      loading ? <Loading/> : <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-NavyBlue text-white ">
        <tr>
          {/*<th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium "
          >
            <input type="checkbox"onChange={handleSelectAll} checked={selectAll}  className='w-4 h-4 '/>
    </th>*/}
          <th
            scope="col"
            className="px-10 py-3 text-left text-base font-medium "
          >
            <FaImage />
          </th>
          <th
            scope="col"
            className="px-6 flex items-center cursor-pointer  py-3 text-left text-base font-medium"
            onClick={() => handleSort('name')}
          >
           İsim
           {sortedColumn === 'name' ? (
            <span>
              {sortOrder === 'asc' ? <FaCaretUp/> : <FaCaretDown/>}
            </span>
          ):<PiCaretUpDownFill />}
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-base font-medium  "
            
          >
            Stok Kodu
          </th>
           {/**   <th
            scope="col"
            className="px-6 py-3 text-left text-base font-medium cursor-pointer  "
            onClick={() => handleSort('stokCount')}
          >
            <span className='flex items-center'>
            <span>Stok Sayısı</span>
            {sortedColumn === 'stokCount' ? (
              <span>
                {sortOrder === 'asc' ? <FaCaretUp /> : <FaCaretDown />}
              </span>
            ) : <PiCaretUpDownFill />}
            </span>
          </th> */}
          <th
            scope="col"
            className="px-6 flex items-center cursor-pointer py-3 text-left text-base font-medium  "
            onClick={() => handleSort('price')}
          >
            Fiyat
            {sortedColumn === 'price' ? (
              <span>
                {sortOrder === 'asc' ? <FaCaretUp/> : <FaCaretDown/>}
              </span>
            ):<PiCaretUpDownFill/>}
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-base font-medium "
          >
            Kategori
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-base font-medium "
          >
            Sınıf
          </th>
        
          {/**<th
            scope="col"
            className="px-6 py-3 text-left text-base font-medium "
            onClick={() => handleSort('lastUpdateDate')}
          >
          <span className='flex items-center'>
          <span>Ürünü Son Güncelleme Tarihi</span>
          {sortedColumn === 'lastUpdateDate' ? (
            <span>{sortOrder === 'asc' ? <FaCaretUp /> : <FaCaretDown />}</span>
          ) : <PiCaretUpDownFill />}
        </span>
          </th> */}
          <th
          scope="col"
          className="px-6 py-3 text-left text-base font-medium "
        >
          Ürün Durumu
        </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {sortedProducts.map((product, index) => (
          <tr key={product.id}  className={`${index % 2 === 1 ? "bg-white" : "bg-gray-50"} `}>
          {/**<td className="px-6 py-4 whitespace-nowrap">
          <input 
            type="checkbox" 
            
            className="w-4 h-4 text-LightBlue focus:bg-LightBlue border-LightBlue rounded-xl focus:ring-LightBlue "
            checked={selectedProducts.includes(product)} 
            onChange={() => handleProductSelect(product)} // Her bir ürünün onay kutusunu seçim işleyicisiyle bağla
          />
        </td> */}
            <td className="px-8 py-4 whitespace-nowrap  cursor-pointer" onClick={() => {handleOpenModal(product)}}>
            img
            </td>
           
             <td className="px-6 py-4 whitespace-nowrap  ">
             <Link href={`/products/${product.id}`} className='cursor-pointer hover:text-[#0284c7]  '>
              {product.STKCINSI}
              </Link>
            </td>
            
           
            <td className="px-6 py-4 whitespace-nowrap text-BaseDark ">{product.STKKOD}</td>
        {/**<td className="px-6 py-4 whitespace-nowrap text-BaseDark">{product.STOK}</td> */}
            <td className="px-6 py-4 whitespace-nowrap text-BaseDark">₺{product.STKOZKOD5}</td>
            <td className="px-6 py-4 whitespace-nowrap text-BaseDark">{product.STKOZKOD2}</td>
            <td className="px-6 py-4 whitespace-nowrap text-BaseDark">{product.STKOZKOD3}</td>
            {/**<td className="px-6  text-center py-4 whitespace-nowrap space-x-10 text-BaseDark">
            <span>{product?.date?.lastUpdateDate}</span>
           
            </td> */}
            <td className=' p-2'>
         
            {product?.STKOZKOD1 === 'A' ? <span className="p-2  flex items-center justify-center space-x-1   rounded-xl text-sm bg-green-400 text-white"> <FaCheckCircle className='text-xl'/><span>Satışa uygun </span> </span>:
              <span className="p-2  flex items-center space-x-1   rounded-xl text-sm bg-red-400 text-white"> <IoIosCloseCircle className='text-xl'/><span>Satışa uygun değil</span> </span> 
             
            }

            </td>
          </tr>
        ))}
      </tbody>
    </table>    }
    
         { isOpenModal && <ProductModal setIsOpenModal={setIsOpenModal} productImage={productImage} />}
    
  </div>
  )
}

export default ProdcutsTable