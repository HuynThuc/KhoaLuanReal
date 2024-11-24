// Home.jsx
import React from 'react';
import 'remixicon/fonts/remixicon.css';
import logo from '../assets/logo.png'; // Đảm bảo bạn thay đổi đường dẫn nếu khác
import headerImage from '../assets/header.png';
import class1Image from '../assets/class-1.jpg';
import class2Image from '../assets/class-2.jpg';
import joinImage from '../assets/join.jpg';
import memberImage from '../assets/member.jpg';
import hero from '../assets/hero-1.jpg';

const Home = () => {
  return (
    <div>
     

      {/* Explore Section */}
      <section className="section__container explore__container">
        <div className="explore__header">
          <h2 className="section__header">EXPLORE OUR PROGRAM</h2>
          <div className="explore__nav">
            <span><i className="ri-arrow-left-line"></i></span>
            <span><i className="ri-arrow-right-line"></i></span>
          </div>
        </div>
        <div className="explore__grid">
          <ExploreCard icon="ri-boxing-fill" title="Strength" description="Embrace the essence of strength as we delve into its various dimensions physical, mental, and emotional." />
          <ExploreCard icon="ri-heart-pulse-fill" title="Physical Fitness" description="It encompasses a range of activities that improve health, strength, flexibility, and overall well-being." />
          <ExploreCard icon="ri-run-line" title="Fat Lose" description="Through a combination of workout routines and expert guidance, we'll empower you to reach your goals." />
          <ExploreCard icon="ri-shopping-basket-fill" title="Weight Gain" description="Designed for individuals, our program offers an effective approach to gaining weight in a sustainable manner." />
        </div>
      </section>

      {/* Class Section */}
      <section className="section__container class__container">
        <div className="class__image">
          <span className="bg__blur"></span>
          <img src={class1Image} alt="class" className="class__img-1" />
          <img src={class2Image} alt="class" className="class__img-2" />
        </div>
        <div className="class__content">
          <h2 className="section__header">THE CLASS YOU WILL GET HERE</h2>
          <p>
            Led by our team of expert and motivational instructors, "The Class You
            Will Get Here" is a high-energy, results-driven session that combines
            a perfect blend of cardio, strength training, and functional
            exercises.
          </p>
          <button className="btn">Book A Class</button>
        </div>
      </section>

      {/* Join Section */}
      <section className="section__container join__container">
        <h2 className="section__header">WHY JOIN US ?</h2>
        <p className="section__subheader">
          Our diverse membership base creates a friendly and supportive
          atmosphere, where you can make friends and stay motivated.
        </p>
        <div className="join__image">
          <img src={joinImage} alt="Join" />
          <div className="join__grid">
            <JoinCard icon="ri-user-star-fill" title="Personal Trainer" description="Unlock your potential with our expert Personal Trainers." />
            <JoinCard icon="ri-vidicon-fill" title="Practice Sessions" description="Elevate your fitness with practice sessions." />
            <JoinCard icon="ri-building-line" title="Good Management" description="Supportive management, for your fitness success." />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section__container price__container">
        <h2 className="section__header">OUR PRICING PLAN</h2>
        <p className="section__subheader">
          Our pricing plan comes with various membership tiers, each tailored to
          cater to different preferences and fitness aspirations.
        </p>
        <div className="price__grid">
          <PriceCard title="Basic Plan" price="$16" features={["Smart workout plan", "At home workouts"]} />
          <PriceCard title="Weekly Plan" price="$25" features={["PRO Gyms", "Smart workout plan", "At home workouts"]} />
          <PriceCard title="Monthly Plan" price="$45" features={["ELITE Gyms & Classes", "PRO Gyms", "Smart workout plan", "At home workouts", "Personal Training"]} />
        </div>
      </section>

      {/* Review Section */}
      <section className="review">
        <div className="section__container review__container">
          <span><i className="ri-double-quotes-r"></i></span>
          <div className="review__content">
            <h4>MEMBER REVIEW</h4>
            <p>
              What truly sets this gym apart is their expert team of trainers...
            </p>
            <div className="review__rating">
              <span><i className="ri-star-fill"></i></span>
              <span><i className="ri-star-fill"></i></span>
              <span><i className="ri-star-fill"></i></span>
              <span><i className="ri-star-fill"></i></span>
              <span><i className="ri-star-half-fill"></i></span>
            </div>
            <div className="review__footer">
              <div className="review__member">
                <img src={memberImage} alt="member" />
                <div className="review__member__details">
                  <h4>Jane Cooper</h4>
                  <p>Software Developer</p>
                </div>
              </div>
              <div className="review__nav">
                <span><i className="ri-arrow-left-line"></i></span>
                <span><i className="ri-arrow-right-line"></i></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

// Reusable Components for Explore and Join Cards
const ExploreCard = ({ icon, title, description }) => (
  <div className="explore__card">
    <span><i className={icon}></i></span>
    <h4>{title}</h4>
    <p>{description}</p>
    <a href="#">Join Now <i className="ri-arrow-right-line"></i></a>
  </div>
);

const JoinCard = ({ icon, title, description }) => (
  <div className="join__card">
    <span><i className={icon}></i></span>
    <div className="join__card__content">
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  </div>
);

const PriceCard = ({ title, price, features }) => (
  <div className="price__card">
    <div className="price__card__content">
      <h4>{title}</h4>
      <h3>{price}</h3>
      {features.map((feature, index) => (
        <p key={index}><i className="ri-checkbox-circle-line"></i> {feature}</p>
      ))}
    </div>
    <button className="btn price__btn">Join Now</button>
  </div>
);

const Footer = () => (
  <footer className="section__container footer__container">
    <span className="bg__blur"></span>
    <span className="bg__blur footer__blur"></span>
    <div className="footer__col">
      <div className="footer__logo"><img src={logo} alt="logo" /></div>
      <p>
        Take the first step towards transforming your fitness journey with us today...
      </p>
    </div>
    <div className="footer__col">
      <h4>Company</h4>
      <ul>
        <li><a href="#">Our Program</a></li>
        <li><a href="#">Our Plan</a></li>
        <li><a href="#">Become a member</a></li>
      </ul>
    </div>
    <div className="footer__col">
      <h4>Quick Links</h4>
      <ul>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact Us</a></li>
        <li><a href="#">Support</a></li>
      </ul>
    </div>
    <div className="footer__col">
      <h4>Social Links</h4>
      <ul className="footer__social__links">
        <li><a href="#"><i className="ri-facebook-circle-line"></i></a></li>
        <li><a href="#"><i className="ri-instagram-line"></i></a></li>
        <li><a href="#"><i className="ri-twitter-line"></i></a></li>
      </ul>
    </div>
  </footer>
);

export default Home;
