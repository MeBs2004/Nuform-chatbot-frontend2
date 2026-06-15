import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";
import { ThreeDots } from 'react-loading';
import ReactLoading from "react-loading";

import {
  FaTimes,
  FaPaperPlane,
  FaMoon,
  FaSun,
} from "react-icons/fa";

function Bot() {

  const [language, setLanguage] = useState("English");

  const [darkMode, setDarkMode] = useState(true);

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [suggestions, setSuggestions] = useState([]);

  const [showSuggestions, setShowSuggestions] = useState(true);

  const [openBot, setOpenBot] = useState(true);

  const messagesEndRef = useRef(null);

  // Auto Scroll
  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  // Fetch Suggestions
  useEffect(() => {

    const fetchSuggestions = async () => {

      try {

        const res = await axios.get(
          `${process.env.Frontend_URL}bot/v1/suggestions`
        );

        if (res.data.success) {
          setSuggestions(res.data.suggestions);
        }

      } catch (error) {

        console.log(error);
      }
    };

    fetchSuggestions();

  }, []);

  // Send Message
  const handleSendMessage = async (customMessage = null) => {

    const messageText = customMessage || input;

    if (!messageText.trim()) return;

    setLoading(true);

    setShowSuggestions(false);

    // Add User Message
    setMessages((prev) => [
      ...prev,
      {
        text: messageText,
        sender: "user",
      },
    ]);

    try {

      const res = await axios.post(
        `${process.env.Frontend_URL}bot/v1/message`,
        {
          text: messageText,
          language,
        }
      );

      if (res.status === 200) {

        setMessages((prev) => [
          ...prev,
          {
            text: res.data.botMessage,
            sender: "bot",
          },
        ]);
      }

    } catch (error) {

      console.log(error);

    } finally {

      setInput("");
      setLoading(false);
    }
  };

  // Enter Key
  const handleKeyPress = (e) => {

    if (e.key === "Enter") {

      handleSendMessage();
    }
  };

  return (
    <>

      {/* Floating Button */}
      {!openBot && (

        <button
          onClick={() => setOpenBot(true)}
          className="
            fixed
            bottom-5
            right-5
            w-[60px]
            h-[60px]
            rounded-full
            bg-[#067647]
            shadow-2xl
            flex
            items-center
            justify-center
            text-white
            z-50
          "
        >

          <img
            src={logo}
            alt="Logo"
            className="
              w-[34px]
              h-[34px]
              object-cover
              rounded-full
            "
          />

        </button>

      )}

      {/* Chatbot */}
      {openBot && (

        <div
          className="
            fixed
            bottom-5
            right-5
            w-[365px]
            h-[547px]
            bg-[#f7f7f7]
            rounded-[28px]
            shadow-2xl
            overflow-hidden
            flex
            flex-col
            z-50
            border
            border-[#dcdcdc]
          "
        >

          {/* Header */}
          <div
            className="
              h-[74px]
              px-4
              flex
              items-center
              justify-between
              text-white
            "
            style={{
              background:
                "linear-gradient(135deg, #0d5537 0%, #067647 100%)",
            }}
          >

            {/* Left */}
            <div className="flex items-center gap-3">

              {/* Logo */}
              <div
                className="
                  w-[40px]
                  h-[40px]
                  rounded-[12px]
                  bg-[#ffffff22]
                  flex
                  items-center
                  justify-center
                  overflow-hidden
                "
              >

                <img
                  src={logo}
                  alt="Logo"
                  className="
                    w-[32px]
                    h-[32px]
                    object-cover
                    rounded-[8px]
                  "
                />

              </div>

              {/* Text */}
              <div>

                <h2 className="font-semibold text-[16px] leading-none">
                  Nuform Social Assistant
                </h2>

                {/* Online Status */}
                <div className="flex items-center gap-2 mt-[5px]">

                  {/* Glowing Dot */}
                  <span
                    className="
                      w-[6px]
                      h-[6px]
                      rounded-full
                      bg-[#8dffb3]
                      shadow-[0_0_8px_#8dffb3]
                      animate-pulse
                    "
                  ></span>

                  {/* Status Text */}
                  <p className="text-[11px] text-[#d5f5e3] leading-none">
                    Online · Always ready
                  </p>

                </div>

              </div>

            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
            
              {/* Language Dropdown */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="
                  bg-[#ffffff22]
                  text-white
                  text-[10px]
                  px-2
                  py-1
                  rounded-[8px]
                  outline-none
                  border-none
                  cursor-pointer
                "
              >
                <option value="English" className="text-black">EN</option>
                <option value="Hindi" className="text-black">हिं</option>
              </select>

              {/* Close */}
              <button
                onClick={() => setOpenBot(false)}
                className="
                  w-[25px]
                  h-[25px]
                  rounded-full
                  bg-[#ffffff22]
                  flex
                  items-center
                  justify-center
                "
              >
                <FaTimes size={13} />
              </button>

            </div>

          </div>

          {/* Chat Area */}
          <div
            className="
              flex-1
              overflow-y-auto
              px-4
              py-4
            "
          >

            {/* Welcome */}
            {messages.length === 0 && (

              <div
                className="
                  bg-[#edf7f1]
                  border
                  border-[#d8e9de]
                  rounded-[18px]
                  p-4
                  text-[#333]
                  text-[14px]
                  leading-7
                  mb-5
                "
              >

                👋 Hey! I'm the Nuform Social Assistant.
                Whether you're looking to grow your
                brand, build a website, or run high-ROI
                campaigns — I'm here to help.

                What brings you here today?

              </div>

            )}

            {/* Messages */}
            {messages.map((msg, index) => (

              <div
                key={index}
                className={`flex mb-4
                  ${
                    msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                  }
                `}
              >

                <div
                  className={`
                    px-[15px]
                    py-[12px]
                    text-[14px]
                    leading-[26px]
                    font-[400]
                    max-w-[82%]
                    ${
                      msg.sender === "user"
                        ? "bg-[#067647] text-white rounded-[16px] rounded-br-[6px] shadow-md"
                        : "bg-[#edf5ef] text-[#2d2d2d] border border-[#d7e7dc] rounded-[18px] rounded-bl-[6px]"
                    }
                  `}
                >
                  {msg.text}
                </div>

              </div>

            ))}

            {/* Loading Animation */}
{loading && (

  <div
    className="
      inline-flex
      items-center
      gap-2
      bg-[#edf5ef]
      border
      border-[#d7e7dc]
      px-4
      py-3
      rounded-[18px]
      rounded-bl-[6px]
      shadow-sm
    "
  >

    {/* Dot 1 */}
    <span
      className="
        w-[8px]
        h-[8px]
        rounded-full
        bg-[#00c853]
        animate-bounce
      "
      style={{
        animationDelay: "0s",
      }}
    ></span>

    {/* Dot 2 */}
    <span
      className="
        w-[8px]
        h-[8px]
        rounded-full
        bg-[#00b0ff]
        animate-bounce
      "
      style={{
        animationDelay: "0.15s",
      }}
    ></span>

    {/* Dot 3 */}
    <span
      className="
        w-[8px]
        h-[8px]
        rounded-full
        bg-[#ff9100]
        animate-bounce
      "
      style={{
        animationDelay: "0.3s",
      }}
    ></span>

  </div>

)}

            {/* Suggestions */}
            {showSuggestions && (

              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                  mt-3
                "
              >

                {suggestions.map((item, index) => (

                  <button
                    key={index}
                    onClick={() => handleSendMessage(item)}
                    className="
                   min-h-[32px]
                   px-3
                   rounded-full
                   border
                   border-[#d6e8dd]
                   bg-[#daf7e1]
                   text-[#1f5138]
                   text-[9px]
                   font-[500]
                   leading-4
                   hover:bg-[#e3f1e8]
                   transition-all
                   duration-200
                   text-left
                   flex
                   items-center
                   shadow-sm
                  "
                  >
                    {item}
                  </button>

                ))}

              </div>

            )}

            <div ref={messagesEndRef} />

          </div>

          {/* Footer */}
          <div
            className="
              bg-white
              border-t
              border-[#e8e8e8]
              px-4
              py-4
            "
          >

            {/* Input */}
            <div
              className="
                flex
                items-center
                border-2
                border-[#067647]
                rounded-[18px]
                px-3
                py-2
                bg-white
              "
            >

              <input
                type="text"
                placeholder="Ask me anything about our services..."
                className="
                  flex-1
                  outline-none
                  text-[14px]
                  text-[#333]
                  opacity-90
                  placeholder:text-[#9aa5a0]
                "
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
              />

              <button
                onClick={() => handleSendMessage()}
                className="
                  w-[40px]
                  h-[40px]
                  rounded-[12px]
                  bg-[#067647]
                  flex
                  items-center
                  justify-center
                  text-white
                "
              >
                <FaPaperPlane size={14} />
              </button>

            </div>

            {/* Footer */}
            <div
              className="
                text-center
                text-[11px]
                text-[#9ca3af]
                mt-3
              "
            >

              Powered by

              <span className="text-[#e36b0a] font-semibold">
                {" "}Nuform Social
              </span>

              &nbsp;

              <span style={{ opacity: 0.8 }}>
                nuformsocial.com
              </span>

            </div>

          </div>

        </div>
      )}

    </>
  );
}

export default Bot;