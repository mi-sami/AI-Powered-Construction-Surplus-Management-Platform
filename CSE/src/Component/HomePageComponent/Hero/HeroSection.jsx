import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import img1 from "../../../assets/07-May-24-Building-Materials.jpg";
import img2 from "../../../assets/construction-materials-bricks-pipes-gravel-on-a-building-site-free-photo.jpeg";
import img3 from "../../../assets/istockphoto-504749256-170667a.jpg";

const HeroSection = () => {
  // Initially 3rd image দেখাবে, এরপর প্রতি ৫ সেকেন্ড পরপর 2nd -> 1st -> 3rd এভাবে ঘুরবে
  const bgImages = [img3, img2, img1];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // পেজ ওপেন হওয়ার সাথে সাথে সাইড থেকে লেখার ট্রানজিশন ট্রিগার করা
  useEffect(() => {
    const entryTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(entryTimer);
  }, []);

  // প্রতি ৫ সেকেন্ড (5000ms) পরপর ব্যাকগ্রাউন্ড ইমেজ পরিবর্তন করা
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
    },5000);

    return () => clearInterval(slideInterval);
  }, [bgImages.length]);

  return (
    <section className="relative min-h-[520px] md:min-h-[600px] w-full overflow-hidden flex items-center justify-center text-white px-6 py-16">
      {/* Full-Screen Sliding Background Images */}
      {bgImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
            index === currentIndex
              ? "opacity-100 scale-105"
              : "opacity-0 scale-100"
          }`}
          style={{
            backgroundImage: `url(${image})`,
            transitionProperty: "opacity, transform",
            transitionDuration: "1200ms",
          }}
        />
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-[#1e232a]/75 backdrop-blur-[1px]" />

      {/* Center Content with Slide-in Transition from Side */}
      <div
        className={`relative z-10 max-w-3xl mx-auto text-center space-y-6 transition-all duration-1000 ease-out transform ${
          isLoaded ? "translate-x-0 opacity-100" : "-translate-x-24 opacity-0"
        }`}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight drop-shadow-md">
          Give leftover construction material a second life.
        </h1>

        <p className="text-gray-200 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          Have leftover building materials? Sell them here. Need materials? Find
          them here, often for less than new.
        </p>

        {/* Centered Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
          <Link to="/register">
            <button className="px-9 py-3 bg-[#4f5bd5] hover:bg-[#3f4bc2] text-white text-xs font-bold tracking-widest uppercase rounded-full shadow-lg shadow-[#4f5bd5]/30 transition-all cursor-pointer disabled:opacity-50">
              Register
            </button>
          </Link>

          <Link to="/login">
            <button className="px-9 py-3 text-sm font-medium text-gray-900 bg-white rounded hover:bg-gray-200 transition-all cursor-pointer rounded-full">
              Login
            </button>
          </Link>
        </div>

        {/* Slide Indicator Dots */}
        <div className="flex items-center justify-center space-x-2 pt-4">
          {bgImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex
                  ? "w-7 bg-[#008ba9]"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
