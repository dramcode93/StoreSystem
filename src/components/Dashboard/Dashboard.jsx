import React, { useEffect, useState, useCallback } from "react";
import { BiCategory } from "react-icons/bi";
import { LiaMoneyBillSolid } from "react-icons/lia";
import { MdProductionQuantityLimits, MdBorderColor } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { NavLink } from "react-router-dom";
import { useI18nContext } from "../context/i18n-context";
import module from "./Dashboard.module.css";
import { House } from "@phosphor-icons/react";
import { FiChevronDown, FiChevronUp, FiShoppingCart } from "react-icons/fi";
import Cookies from "js-cookie";
import { BsFillPersonVcardFill } from "react-icons/bs";
import axios from "axios";
import { FaHome, FaStore, FaSitemap, FaChartBar, FaReceipt, FaUsers, FaTag, FaClipboardList, FaShoppingBag, FaUserCircle, FaFileInvoice, FaFileInvoiceDollar, FaPercentage, FaLock, FaChartPie, FaChartLine } from "react-icons/fa";
import { MdCategory, MdShoppingCart, MdAccountCircle, MdOutlineInventory } from "react-icons/md";
import { HiOutlineDocumentReport, HiUserGroup } from "react-icons/hi";
import { IoMdPricetags } from "react-icons/io";
const roleRoutes = {
  admin: [
    { path: "/Home", name: "Home.Home", icon: <FaHome /> },
    {
      name: "Home.shop",
      icon: <FaStore />,
      dropdownItems: [
        { text: "Main Shop", path: "/shop", icon: <FaStore /> },
        { text: "Information", path: "/shopInformation", icon: <HiOutlineDocumentReport /> },
      ],
    },
    {
      name: "Home.branches",
      icon: <FaSitemap />,
      dropdownItems: [],
    },
    {
      path: "/SalesTable",
      name: "Home.Sales",
      icon: <FaChartLine />,
    },
    {
      path: "/SubSalesTable",
      name: "Home.subSales",
      icon: <FaChartPie />,
    },
    {
      path: "/FinancialTransactions",
      name: "Home.FinancialTransactions",
      icon: <FaFileInvoiceDollar />,
    },
    { path: "/category", name: "Home.Category", icon: <MdCategory /> },
    {
      path: "/products",
      name: "Home.products",
      icon: <MdOutlineInventory />,
    },
    {
      path: "/customers",
      name: "Home.Customer",
      icon: <FaUsers />,
      // dropdownItems: [
      //   { text: "Create", path: "/create", icon: <MdAccountCircle /> },
      //   { text: "Show bills", path: "/show-bills", icon: <FaFileInvoice /> },
      // ],
    },
    { path: "/bills", name: "Home.Bill", icon: <FaFileInvoice /> },
    { path: "/order", name: "Home.orders", icon: <FaShoppingBag /> },
    { path: "/coupons", name: "Home.coupons", icon: <IoMdPricetags /> },
    {
      name: "Home.Profile",
      icon: <FaUserCircle />,
      dropdownItems: [
        { text: "Information", path: "/information", icon: <FaUserCircle /> },
        { text: "Change Password", path: "/change-password", icon: <FaLock /> },
        { text: "Users", path: "/users", icon: <HiUserGroup /> },
      ],
    },
  ],
  manager: [
    { path: "/Home", name: "Home.Home", icon: <FaHome /> },
    { path: "/shopTypes", name: "Home.shopTypes", icon: <FaStore /> },
    {
      name: "Home.Profile",
      icon: <FaUserCircle />,
      dropdownItems: [
        { text: "Information", path: "/information", icon: <FaUserCircle /> },
        { text: "Change Password", path: "/change-password", icon: <FaLock /> },
        { text: "Users", path: "/users", icon: <HiUserGroup /> },
      ],
    },
  ],
  user: [
    { path: "/Home", name: "Home.Home", icon: <FaHome /> },
    { path: "/category", name: "Home.Category", icon: <MdCategory /> },
    {
      path: "/products",
      name: "Home.products",
      icon: <MdOutlineInventory />,
    },
    {
      name: "Home.Bill",
      icon: <FaFileInvoice />,
      dropdownItems: [{ text: "Create bills", path: "/create-bills", icon: <FaFileInvoiceDollar /> }],
    },
    {
      name: "Home.Order",
      icon: <FaShoppingBag />,
      dropdownItems: [
        { text: "Agree", path: "/agree", icon: <FaClipboardList /> },
        { text: "Accept", path: "/accept", icon: <FaClipboardList /> },
      ],
    },
    {
      path: "/customers",
      name: "Home.Customer",
      icon: <FaUsers />,
      // dropdownItems: [
      //   { text: "Create", path: "/create", icon: <MdAccountCircle /> },
      //   { text: "Show bills", path: "/show-bills", icon: <FaFileInvoice /> },
      // ],
    },
    {
      name: "Home.Profile",
      icon: <FaUserCircle />,
      dropdownItems: [{ text: "Information", path: "/information", icon: <FaUserCircle /> }],
    },
  ],
  customer: [
    { path: "/Home", name: "Home.Home", icon: <FaHome /> },
    { path: "/cart", name: "Home.Cart", icon: <MdShoppingCart /> },
    { path: "/orders", name: "Home.Order", icon: <FaShoppingBag /> },
    {
      name: "Home.Profile",
      icon: <FaUserCircle />,
      dropdownItems: [
        { text: "Information", path: "/information", icon: <FaUserCircle /> },
        { text: "Change Password", path: "/change-password", icon: <FaLock /> },
      ],
    },
  ],
};

const Dashboard = ({ children }) => {
  const token = Cookies.get("token");
  const { t, language } = useI18nContext();
  const [role, setRole] = useState("");
  const [activeLink, setActiveLink] = useState(null);
  const [isProfileActive, setIsProfileActive] = useState(false);
  const [isShopActive, setIsShopActive] = useState(false);
  const [isBranchesActive, setIsBranchesActive] = useState(false);
  const [activeDropdownItem, setActiveDropdownItem] = useState(null);
  const [activeBranch, setActiveBranch] = useState(null);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await axios.get(
            "https://store-system-api.gleeze.com/api/Users/getMe",
            { headers: { Authorization: `Bearer ${token} ` } }
          );
          setRole(response.data.data.role || "Home.shop");
        } catch (error) {
          console.error("Error fetching user data:", error);
          if (
            error.response &&
            error.response.data.message === "jwt malformed"
          ) {
            Cookies.remove("token");
          }
          setRole("Home.shop");
        }
      }
    };
    fetchUserData();
  }, [token]);

  useEffect(() => {
    const storedActiveLinkIndex = localStorage.getItem("activeLinkIndex");
    const storedIsProfileActive = localStorage.getItem("isProfileActive");
    const storedIsShopActive = localStorage.getItem("isShopActive");
    const storedIsBranchesActive = localStorage.getItem("isBranchesActive");
    const storedActiveDropdownItem = localStorage.getItem("activeDropdownItem");
    const storedActiveBranch = localStorage.getItem("activeBranch");

    if (storedActiveLinkIndex !== null) {
      setActiveLink(parseInt(storedActiveLinkIndex));
    }

    if (storedIsProfileActive !== null) {
      setIsProfileActive(storedIsProfileActive === "true");
    }

    if (storedIsShopActive !== null) {
      setIsShopActive(storedIsShopActive === "true");
    }

    if (storedIsBranchesActive !== null) {
      setIsBranchesActive(storedIsBranchesActive === "true");
    }

    if (storedActiveDropdownItem !== null) {
      setActiveDropdownItem(parseInt(storedActiveDropdownItem));
    }

    if (storedActiveBranch !== null) {
      setActiveBranch(parseInt(storedActiveBranch));
    }
  }, []);

  const handleLinkClick = useCallback(
    (index, item) => {
      setActiveLink(index);
      if (item.name === "Home.Profile") {
        setIsProfileActive(!isProfileActive);
        localStorage.setItem("isProfileActive", !isProfileActive);
      } else if (item.name === "Home.shop") {
        setIsShopActive(!isShopActive);
        localStorage.setItem("isShopActive", !isShopActive);
      } else if (item.name === "Home.branches") {
        setIsBranchesActive(!isBranchesActive);
        localStorage.setItem("isBranchesActive", !isBranchesActive);
      } else {
        setIsProfileActive(false);
        setIsShopActive(false);
        setIsBranchesActive(false);
        localStorage.setItem("isProfileActive", false);
        localStorage.setItem("isShopActive", false);
        localStorage.setItem("isBranchesActive", false);
      }
      localStorage.setItem("activeLinkIndex", index);
      setActiveDropdownItem(null);
      setActiveBranch(null);
    },
    [isProfileActive, isShopActive, isBranchesActive]
  );

  const handleDropdownItemClick = useCallback((dropdownIndex) => {
    setActiveDropdownItem(dropdownIndex);
    localStorage.setItem("activeDropdownItem", dropdownIndex);
  }, []);

  const handleBranchClick = useCallback(
    (index) => {
      setActiveBranch(index === activeBranch ? null : index);
      localStorage.setItem("activeBranch", index === activeBranch ? null : index);
    },
    [activeBranch]
  );

  const routes = roleRoutes[role] || roleRoutes["Home.shop"];
  useEffect(() => {
    const fetchBranches = async () => {
      if (token) {
        try {
          const response = await axios.get(
            "https://store-system-api.gleeze.com/api/subShops/list?sort=name&fields=name",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const fetchedBranches = response.data.data;

          const updatedRoutes = roleRoutes.admin.map((route) => {
            if (route.name === "Home.branches") {
              return {
                ...route,
                dropdownItems: fetchedBranches.map((branch, branchIndex) => ({
                  text: branch.name,
                  path: `/branch/${branch._id}/information`,
                  icon: <FiShoppingCart />,
                  dropdownItems: [
                    {
                      text: "Financial Dealings",
                      path: `/branch/${branch._id}/financial`,
                    },
                    {
                      text: "Branch Information",
                      path: `/branch/${branch._id}/information`,
                    },
                  ],
                })),
              };
            }
            return route;
          });

          roleRoutes.admin = updatedRoutes;
          setBranches(fetchedBranches);
        } catch (error) {
          console.error("Error fetching branches data:", error);
        }
      }
    };
    fetchBranches();
  }, [token]);

  return (
    <div
      className="fixed top-0 dark:text-gray-100 z-40"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {routes && (
        <div
          style={{
            // width:isSideBarOpen?"260px":"0px",
            marginTop: "12.3vh",
            boxShadow:
              language === "ar"
                ? "-4px 0px 2px rgba(0, 0, 0, 0.1)"
                : "4.0px 8.0px 8.0px hsl(0deg 0% 0% / 0.08)",
          }}
          className={`${module.sidebar}`}
          dir={language === "ar" ? "rtl" : "ltr"}

        >
          {routes.map((item, index) => (
            <div key={index}>
              <NavLink
                to={item.path}
                className={module.link}
                onClick={() => handleLinkClick(index, item)}
                style={
                  activeLink === index
                    ? {
                      backgroundColor: "#006edc",
                      color: "white",
                      borderRadius: "0px",
                    }
                    : {}
                }
              >
                <div className={module.icon}>{item.icon}</div>
                <div className={`${module.link_text} flex`}>
                  {t(item.name)}{"   "}
                  {item.dropdownItems && (
                    <>
                      {activeLink === index &&
                        ((item.name === "Home.Profile" && isProfileActive) ||
                          (item.name === "Home.shop" && isShopActive) ||
                          (item.name === "Home.branches" && isBranchesActive)) ? (
                        <FiChevronUp />
                      ) : (
                        <FiChevronDown />
                      )}
                    </>
                  )}
                </div>
              </NavLink>
              {activeLink === index &&
                ((item.name === "Home.Profile" && isProfileActive) ||
                  (item.name === "Home.shop" && isShopActive) ||
                  (item.name === "Home.branches" && isBranchesActive)) &&
                item.dropdownItems && (
                  <div
                    className="transition ease-in-out duration-75"
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    <div className="flex flex-col w-full mx-auto font-bold">
                      {item.dropdownItems.map(
                        (dropdownItem, dropdownIndex) => (
                          <div key={dropdownIndex}>
                            <NavLink
                              to={dropdownItem.path}
                              className={`${module.branch}`}
                              onClick={() =>
                                handleDropdownItemClick(dropdownIndex)
                              }
                              style={
                                activeDropdownItem === dropdownIndex
                                  ? {
                                    backgroundColor: "transparent",
                                    borderRadius: "0px",
                                  }
                                  : {}
                              }
                            >
                              <div className="flex items-center hover:none">
                                <p className=" m-2 w-32" >{dropdownItem.text}</p>
                                {dropdownItem.dropdownItems && (
                                  <>
                                    {activeBranch === dropdownIndex ? (
                                      <FiChevronUp />
                                    ) : (
                                      <FiChevronDown />
                                    )}
                                  </>
                                )}
                              </div>
                            </NavLink>
                            {activeDropdownItem === dropdownIndex &&
                              dropdownItem.dropdownItems && (
                                <div className="ml-4">
                                  {dropdownItem.dropdownItems.map(
                                    (subItem, subIndex) => (
                                      <NavLink
                                        key={subIndex}
                                        to={subItem.path}
                                        className={module.subDropDown}
                                        style={{
                                          marginLeft: "0",
                                          display: "block",
                                        }}
                                      >
                                        {subItem.text}
                                      </NavLink>
                                    )
                                  )}
                                </div>
                              )}
                          </div>
                        )
                      )}
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
