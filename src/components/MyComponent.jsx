// import React from "react";
// import {Translate, useLanguage } from "translate-easy";
// import { FaArrowUp } from "react-icons/fa";
// import Header from "./Header/header";
 
// const MyComponent = () => {
//   document.addEventListener('DOMContentLoaded', function () {
//     const table = document.querySelector('.categoryTable');
//     const header = document.querySelector('.categoryTable th');
  
//     window.addEventListener('scroll', function () {
//       const tableRect = table.getBoundingClientRect();
  
//       if (tableRect.top < 0) {
//         header.classList.add('sticky-header');
//       } else {
//         header.classList.remove('sticky-header');
//       }
//     });
//   });
  

//   return (
//     <div>
//       <LanguageSelector />
//     </div>
//   );
// };

// function LanguageSelector() {
//   const { selectedLanguage, handleChangeLanguage, languages } = useLanguage();
//   const handleLanguageClick = (languageCode) => {
//     handleChangeLanguage(languageCode);
//   };

//   return (
//     <div>
//      <ul className="FormTranslate fw-bold font2">
//  <p><Translate translations={{ar:'اختر اللغة'}}>Select Language</Translate><FaArrowUp className="arrow mx-1 fs-5" /></p>
//         {languages.map((language) => (
//         <li 
//           key={language.code}
//           onClick={() => handleLanguageClick(language.code)}
//           style={{
//             fontWeight:
//               selectedLanguage.code === language.code ? "bold" : "normal",
//           }}
//         >
//           {language.name}
//         </li>
//       ))}
//     </ul>
//     <Header/>
//      </div>
//    );
// }

// export default MyComponent;

import React, { useState, useEffect } from "react";
import { Translate, useLanguage } from "translate-easy";
import { FaArrowUp } from "react-icons/fa";
import Header from "./Header/header";

const MyComponent = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100); // Adjust the scroll position as needed
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <LanguageSelector isScrolled={isScrolled} />
    </div>
  );
};

function LanguageSelector({ isScrolled }) {
  const { selectedLanguage, handleChangeLanguage, languages } = useLanguage();

  const handleLanguageClick = (languageCode) => {
    handleChangeLanguage(languageCode);
  };

  return (
    <div>
      <ul
        className={`FormTranslate fw-bold font2 ${
          isScrolled ? "scrolled" : ""
        }`}
      >
        <p>
          <Translate translations={{ ar: "اختر اللغة" }}>
            Select Language
          </Translate>
          <FaArrowUp className="arrow mx-1 fs-5" />
        </p>
        {languages.map((language) => (
          <li
            key={language.code}
            onClick={() => handleLanguageClick(language.code)}
            style={{
              fontWeight:
                selectedLanguage.code === language.code ? "bold" : "normal",
            }}
          >
            {language.name}
          </li>
        ))}
      </ul>
      <Header />
    </div>
  );
}

export default MyComponent;
