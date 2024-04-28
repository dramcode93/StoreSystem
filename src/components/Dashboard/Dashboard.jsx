import React, { useState } from "react";
import { BiCategory } from "react-icons/bi";
import { LiaMoneyBillSolid } from "react-icons/lia";
import { MdProductionQuantityLimits, MdBorderColor } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { NavLink } from "react-router-dom";
import { useI18nContext } from "../context/i18n-context";
import module from "./Dashboard.module.css";
import { House } from "@phosphor-icons/react";
import { FiChevronDown, FiChevronUp, FiShoppingCart } from "react-icons/fi";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { FaPeopleArrows } from "react-icons/fa";

const Dashboard = ({ children }) => {
  const token = Cookies.get("token");
  const decodedToken = jwtDecode(token);
  const { t, language } = useI18nContext();

  const admin = [
    {
      path: "/Home",
      name: t("Home.Home"),
      icon: <House />,
    },
    {
      path: "/shop",
      name: t("Home.shop"),
      icon: <FiShoppingCart />,
    },
    {
      path: "/category",
      name: t("Home.Category"),
      icon: <BiCategory />,
    },
    {
      path: "/products",
      name: t("Home.products"),
      icon: <MdProductionQuantityLimits />,
    },
    {
      path: "/customers",
      name: t("Home.Customers"),
      icon: <FaPeopleArrows />,
    },
    {
      path: "/bills",
      name: t("Home.Bill"),
      icon: <LiaMoneyBillSolid />,
    },
    {
      name: t("Home.Profile"),
      icon: <CgProfile />,
      dropdownItems: [
        { text: t("Home.Information"), path: "/information" },
        { text: t("Home.ChangePassword"), path: "/change-password" },
        { text: "Users", path: "/users" },
      ],
    },
  ];

  const manager = [
    {
      path: "/Home",
      name: t("Home.Home"),
      icon: <House />,
    },
    {
      path: "/products",
      name: t("Home.products"),
      icon: <MdProductionQuantityLimits />,
    },
    {
      path: "/bills",
      name: t("Home.Bill"),
      icon: <LiaMoneyBillSolid />,
    },
    {
      name: t("Home.Profile"),
      icon: <CgProfile />,
      dropdownItems: [
        { text: "Information", path: "/information" },
        { text: "Change Password", path: "/change-password" },
        { text: "Users", path: "/users" },
      ],
    },
  ];

  const user = [
    {
      path: "/Home",
      name: t("Home.Home"),
      icon: <House />,
    },
    {
      path: "/category",
      name: t("Home.Category"),
      icon: <BiCategory />,
    },
    {
      path: "/products",
      name: t("Home.products"),
      icon: <MdProductionQuantityLimits />,
    },
    {
      name: t("Home.Bill"),
      icon: <LiaMoneyBillSolid />,
      dropdownItems: [{ text: "Create bills", path: "/create-bills" }],
    },
    {
      name: t("Home.Order"),
      icon: <MdBorderColor />,
      dropdownItems: [
        { text: "Agree", path: "/agree" },
        { text: "Accept", path: "/accept" },
      ],
    },
    {
      name: t("Home.Customer"),
      icon: <BsFillPersonVcardFill />,
      dropdownItems: [
        { text: "Create", path: "/create" },
        { text: "Show bills", path: "/show-bills" },
      ],
    },
    {
      name: t("Home.Profile"),
      icon: <CgProfile />,
      dropdownItems: [{ text: "Information", path: "/information" }],
    },
  ];
  //manager : profile(change pass , info ), users (admin , manager)
  //admin : profile(change pass , info ), users ( users ) , category,products,bills,shop
  //user : profile( info ) , category,products,bills{create bill},order(agree , accept), customer(create , show bills )
  const sidebarStyle = {
    width: "18vw",
    height: "97vh",
    paddingRight: "2vw",
    paddingTop: "20vh",
    boxShadow:
      language === "ar"
        ? "-5px 0px 3px  rgba(0, 0, 0, 0.1)"
        : "5px 0px 3px  rgba(0, 0, 0, 0.1)",
  };

  const [activeLink, setActiveLink] = useState(null);
  const [isProfileActive, setIsProfileActive] = useState(false);

  const handleLinkClick = (index) => {
    setActiveLink(index);
    if (index === admin.length - 1) {
      setIsProfileActive(!isProfileActive);
    } else {
      setIsProfileActive(false);
    }
  };

  return (
    <div
      className="text-gray-900 dark:text-gray-100"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {decodedToken.role === "admin" && (
        <div
          style={sidebarStyle}
          className={`${
            language === "ar" ? module.sidebarArabic : module.sidebar
          }`}
        >
          {admin.map((item, index) => (
            <div key={index}>
              <NavLink
                to={item.path}
                className={module.link}
                onClick={() => handleLinkClick(index)}
                style={
                  activeLink === index
                    ? { backgroundColor: "#713f12", borderRadius: "10px" }
                    : {}
                }
              >
                <div className={module.icon}>{item.icon}</div>
                {item.name === "The Profile" ? (
                  <div className={`${module.link_text} flex`}>
                    {item.name}{" "}
                    {activeLink === index ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                ) : (
                  <div className={module.link_text}>{item.name}</div>
                )}
              </NavLink>
              {activeLink === index &&
                isProfileActive &&
                item.dropdownItems && (
                  <div
                    className="transition ease-in-out duration-75"
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    <div className="flex flex-col w-full mx-auto justify-start font-bold text-white">
                      {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                        <NavLink
                          key={dropdownIndex}
                          to={dropdownItem.path}
                          className={module.link}
                        >
                          <p className="text-white">{dropdownItem.text}</p>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
      {decodedToken.role === "user" && (
        <div
          style={sidebarStyle}
          className={`${
            language === "ar" ? module.sidebarArabic : module.sidebar
          }`}
        >
          {user.map((item, index) => (
            <div key={index}>
              <NavLink
                to={item.path}
                className={module.link}
                onClick={() => handleLinkClick(index)}
                style={
                  activeLink === index
                    ? { backgroundColor: "#713f12", borderRadius: "10px" }
                    : {}
                }
              >
                <div className={module.icon}>{item.icon}</div>
                {item.name === "The Profile" ? (
                  <div className={`${module.link_text} flex`}>
                    {item.name}{" "}
                    {activeLink === index ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                ) : (
                  <div className={module.link_text}>{item.name}</div>
                )}
              </NavLink>
              {activeLink === index &&
                isProfileActive &&
                item.dropdownItems && (
                  <div
                    className="transition ease-in-out duration-75"
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    <div className="flex flex-col w-full mx-auto justify-start font-bold text-white">
                      {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                        <NavLink
                          key={dropdownIndex}
                          to={dropdownItem.path}
                          className={module.link}
                        >
                          <p className="text-white">{dropdownItem.text}</p>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}

      {decodedToken.role === "manager" && (
        <div
          style={sidebarStyle}
          className={`${
            language === "ar" ? module.sidebarArabic : module.sidebar
          }`}
        >
          {manager.map((item, index) => (
            <div key={index}>
              <NavLink
                to={item.path}
                className={module.link}
                onClick={() => handleLinkClick(index)}
                style={
                  activeLink === index
                    ? { backgroundColor: "#713f12", borderRadius: "10px" }
                    : {}
                }
              >
                <div className={module.icon}>{item.icon}</div>
                {item.name === "The Profile" ? (
                  <div className={`${module.link_text} flex`}>
                    {item.name}{" "}
                    {activeLink === index ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                ) : (
                  <div className={module.link_text}>{item.name}</div>
                )}
              </NavLink>
              {activeLink === index &&
                      isProfileActive &&
                item.dropdownItems && (
                  <div
                    className="transition ease-in-out duration-75"
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    <div className="flex flex-col w-full mx-auto justify-start font-bold text-white">
                      {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                        <NavLink
                          key={dropdownIndex}
                          to={dropdownItem.path}
                          className={module.link}
                        >
                          <p className="text-white">{dropdownItem.text}</p>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}
      <main>{children}</main>
    </div>
  );
};

export default Dashboard;
