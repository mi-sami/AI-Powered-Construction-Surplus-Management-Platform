import React from 'react'
import Navbar from '../Component/Navbar/Navbar'
import HeroSection from '../Component/HomePageComponent/Hero/HeroSection'
import WhatItDoesSection from '../Component/HomePageComponent/whatsDoes/WhatItDoesSection'
import HowItWorksSection from '../Component/HomePageComponent/HowWorks/HowItWorksSection'
import SmartToolsSection from '../Component/HomePageComponent/SmartToolsSection/SmartToolsSection'
import MaterialsSection from '../Component/HomePageComponent/MaterialsSection/MaterialsSection'
import CtaSection from '../Component/HomePageComponent/CtaSection/CtaSection'


const Home = () => {
  return (
    <div className='w-full '>
      <Navbar/>
      {/* 1. Home / Hero Section */}
      <div id="home">
        <HeroSection />
      </div>

      {/* What It Does Section */}
      <WhatItDoesSection />

      {/* 2. How It Works Section */}
      <div id="how-it-works">
        <HowItWorksSection />
      </div>

      {/* 3. Smart Tools Section */}
      <div id="smart-tools">
        <SmartToolsSection />
      </div>
        

        <MaterialsSection/>
        <CtaSection/>

      
    </div>
  )
}

export default Home
