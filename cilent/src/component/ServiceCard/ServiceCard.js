import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ServiceCard = () => {
  const [cardData, setCardData] = useState([]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch('http://localhost:3002/service/getAllServices');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCardData(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchService();
  }, []);
  
  

  return (
    <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16">
      <div className="border-b mb-5 flex justify-between text-sm">
        <div className="text-white flex items-center pb-2 pr-2  uppercase">
          <a href="#" className="font-semibold inline-block">Các Dịch Vụ Của Chúng Tôi</a>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-10 gap-10">
        {cardData.length > 0 ? (
          cardData.map((card) => (
            <Link to={`/servicedetail/${card.id}`} key={card.id} className="rounded overflow-hidden shadow-lg flex flex-col bg-white"> {/* Thêm bg-white ở đây */}
              <div className="relative">
                <img 
                  className="w-full h-48 object-cover"
                  src={`/images/${card.image}`}
                  alt={card.serviceName}
                />
                <div className="hover:bg-transparent transition duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-900 opacity-25">
                  {card.packageName}
                </div>
              </div>
              <div className="px-6 py-4 mb-auto">
                <h3 className="font-medium text-lg inline-block hover:text-indigo-600 text-black transition duration-500 ease-in-out mb-2">
                  {card.serviceName}
                </h3>
                <p className="text-gray-500 text-sm">
                  {card.description}
                </p>
              </div>
              registration now to get more deals
              Where health, beauty and fitness meet.
            </Link>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
