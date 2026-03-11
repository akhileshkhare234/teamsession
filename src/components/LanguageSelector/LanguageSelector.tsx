import React from "react";
import { useLanguage } from "../../context/LanguageContext";

const LanguageSelector: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();

  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "French" },
  ];

  return (
    <select
      value={currentLanguage}
      onChange={(e) => changeLanguage(e.target.value)}
      className="w-24  rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm px-2"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;
