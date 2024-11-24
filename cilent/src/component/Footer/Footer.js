import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const Footer = () => {
    return(
        <footer className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        <div className="absolute inset-0 bg-custom opacity-10 blur-3xl"></div>
        <div>
          <img src={logo} alt="logo" className="mb-4 max-w-[150px]" />
          <p className="text-gray-400">
            Take the first step towards transforming your fitness journey with us today...
          </p>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-4">Company</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Our Program</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Our Plan</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Become a member</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">About</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Contact Us</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition duration-300">Support</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-4">Social Links</h4>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-2xl"><i className="ri-facebook-circle-line"></i></a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-2xl"><i className="ri-instagram-line"></i></a>
            <a href="#" className="text-gray-400 hover:text-white transition duration-300 text-2xl"><i className="ri-twitter-line"></i></a>
          </div>
        </div>
      </footer>

    )
}
export default Footer;
