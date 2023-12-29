import React from "react";
import {Translate, useLanguage } from "translate-easy";
import { FaArrowUp } from "react-icons/fa";
import Header from "./Header/header";
 
const MyComponent = () => {
 

  return (
    <div>
      <LanguageSelector />
    </div>
  );
};

function LanguageSelector() {
  const { selectedLanguage, handleChangeLanguage, languages } = useLanguage();
  const handleLanguageClick = (languageCode) => {
    handleChangeLanguage(languageCode);
  };

  return (
    <div>
     <ul className="FormTranslate fw-bold font2">
 <p><Translate translations={{ar:'اختر اللغة'}}>Select Language</Translate><FaArrowUp className="arrow mx-1 fs-5" /></p>
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
    <Header/>
     </div>
   );
}

export default MyComponent;