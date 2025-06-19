import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useSearchParams } from 'react-router-dom';
import { getUserDetails } from "../../../Service/DashboardService"
// import emblem from "../../../image/biswa.png";
import LOGO from "../../../Img/logo.png"
import { motion } from "framer-motion";
const LandingPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [certificateList, setCertificateList] = useState([]);
  const [integerValue, setIntegerValue] = useState(null);
  const [userData, setUserData] = useState(null);
  const [countdown, setCountdown] = useState(5);
  useEffect(() => {
    convertToInteger();

  }, []);

  console.log(userData, "userData")

  const texts = [
    "Welcome to Advance PRI Account!",
    "A Unified Accounting Software for ZP, PS & GP",
    "Empowering Panchayats, Ensuring Transparency",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Change the text every 3 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 1800); // 3000ms = 3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [texts.length]);

  const convertToInteger = () => {
    // Decode the Base64 string
    const decodedString = atob(params.get('evnt'));
    console.log(decodedString.substring(16, decodedString.length), "decodedString")
    // Parse the resulting string getCertificateListinto an integer
    const integerValue = parseInt(decodedString, 10);
    // Update the state to reflect the converted value
    console.log(integerValue, "integerValue")
    setIntegerValue(decodedString.substring(16, decodedString.length));

    getUserDetails(decodedString.substring(16, decodedString.length)).then(function (result) {
      const response = result?.data;
      setUserData(response);
      console.log(response, "resres")

    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1); // Decrease countdown by 1 every second
    }, 1000);


    if (countdown === 0) {
      navigate("/dashboard"); // Redirect to another page when countdown reaches 0
    }

    return () => clearInterval(timer); // Clear interval when component unmounts
  }, [countdown, navigate]);

  useEffect(() => {
    const speakOnce = (text) => {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);

        // Load voices
        const loadVoices = () => {
          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            utterance.voice = voices[0]; // Use the first available voice
            utterance.rate = 1; // Normal speech rate
            utterance.pitch = 1; // Neutral pitch
            utterance.volume = 1; // Full volume

            // Speak the text
            speechSynthesis.speak(utterance);
          } else {
            setTimeout(loadVoices, 100); // Retry if voices aren't loaded yet
          }
        };

        // Only trigger speech if no speech is currently active
        if (!speechSynthesis.speaking) {
          loadVoices();
        }

        // Stop speaking when the utterance is done
        utterance.onend = () => {
          console.log("Speech completed.");
        };
      } else {
        console.error("Speech Synthesis not supported in this browser.");
      }
    };

    // Trigger the speech once
    speakOnce("Welcome to Sahaj Saral");
  }, []);



  return (
    <div className="relative h-screen bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% text-white overflow-hidden">

      {/* ✅ Flying Symbols Background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="absolute text-black text-5xl opacity-30 animate-fly "
            style={{
              top: `${Math.random() * 100}vh`,
              left: `${Math.random() * 100}vw`,
              animationDuration: `${Math.random() * 5 + 5}s`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            {["₹", "+", "-", "=", "Voucher", "Payment", "Debit", "Credit",][Math.floor(Math.random() * 10)]}
          </span>
        ))}
      </div>

      {/* ✅ Fixed Header */}
      <div className="fixed top-0 w-full bg-gradient-to-r from-indigo-500 via-sky-300 to-emerald-500 text-white py-4 text-center z-10">
        <h2 className="font-bold text-4xl tracking-tight text-black">
          Department of Panchayats & Rural Development
        </h2>
        <h3 className="text-black text-3xl font-bold">
          Government of West Bengal
        </h3>
      </div>

      {/* ✅ Main Content */}
      <div className="flex flex-col items-center justify-center h-screen text-center pt-24 relative z-10">

        {/* Logo */}
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg mb-12">
          <img src={LOGO} alt="Company Logo" className="w-28 h-28 object-contain" />
        </div>

        {/* Animated Text */}
        <h1 className="text-5xl font-bold mb-4 ">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
          >
            {texts[currentIndex]}
          </motion.div>
        </h1>


        {/* Countdown */}
        <h2 className="mt-2 text-black text-3xl font-semibold">
        Redirecting in {countdown} seconds...
        </h2>

      </div>

    </div>




  );
};

export default LandingPage;
