import HeroSection from "../component/HeroSection/HeroSection";
import ExploreSection from "../component/ExploreSection/ExploreSection";
import ClassSection from "../component/ClassSection/ClassSection";
import JoinSection from "../component/JoinSection/JoinSection";
import PricingSection from "../component/PricingPlan/PricingPlan";
import ServiceDetailFeature from "../component/ServiceDetailFeature/ServiceDetailFeature";
import MembershipTable from "../component/MemberShiptable/member";
import RegistrationForm from "../component/RegisterForm/RegisterForm";
import BMICalculator from "../component/BMI/Bmi";
import ServicesSection from "../component/ServiceHome/ServiceHome";
import React, { useEffect, useState } from 'react';



function Home() {
  const [pricingPlans, setPricingPlans] = useState([]);

  useEffect(() => {
    const fetchPricingPlans = async () => {
        try {
            const response = await fetch('http://localhost:3002/gymPackage/getAllPackage');
            const data = await response.json();
            console.log(data); // Xem dữ liệu trả về từ API
            const plansWithoutService = data.filter(plan => !plan.service); // Lọc gói không có dịch vụ
            console.log(plansWithoutService); // Xem các gói đã lọc
            setPricingPlans(plansWithoutService);
        } catch (error) {
            console.error('Error fetching pricing plans:', error);
        }
    };

    fetchPricingPlans();
}, []);


  const handleEnrollNow = (id, price) => {
      console.log(`Enroll for package id: ${id} with price: ${price}`);
      // Bạn có thể thêm logic xử lý khi nhấn nút đăng ký ở đây
  };

    return (
        <div className="bg-[#0a0a0a] text-white">
        
       <HeroSection/>
       <ExploreSection/>
       <ServicesSection/>
       <ClassSection/>
       <JoinSection/>
       <PricingSection pricingPlans={pricingPlans} onEnrollNow={handleEnrollNow} />
       <RegistrationForm/>
       <BMICalculator/>
     
      
      
     
    
   
     
  

      </div>
    );
  }
  
  export default Home;
  