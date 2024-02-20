import React, { useState, useEffect } from "react";
import { Translate, useLanguage } from "translate-easy";
import { FaArrowUp } from "react-icons/fa";
import Header from "./Header/header";

const MyComponent = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener("scroll", handleScroll);

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
        className={`FormTranslate fw-bold font2 ${isScrolled ? "scrolled" : ""}`} >
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
