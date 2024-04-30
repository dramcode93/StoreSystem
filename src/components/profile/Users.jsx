import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useI18nContext } from "../context/i18n-context";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Translate, useLanguage } from 'translate-easy';
import styles from '../Category/Category.module.css';
import { Link } from 'react-router-dom';
import Loading from '../Loading/Loading';
import Cookies from 'js-cookie';
import LogOut from '../LogOut/LogOut';
import MyComponent from '../MyComponent';
import MainComponent from '../Aside/MainComponent';
import { CiSearch } from "react-icons/ci";
import { CaretLeft, CaretRight, DotsThree, Eye, NotePencil, TrashSimple } from "@phosphor-icons/react";

const API_users = 'https://store-system-api.gleeze.com/api/users';

const Users = () => {
  const token = Cookies.get('token');
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const { selectedLanguage } = useLanguage();
  const decodedToken = jwtDecode(token);

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        const response = await axios.get(`${API_users}?search=${searchInput}&page=${pagination.currentPge}&limit=20`, { headers: { Authorization: `Bearer ${token}` } });
        setUsers(response.data.data);
        setPagination(response.data.paginationResult);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [token, searchInput, pagination.currentPge]);

  useEffect(() => {
    fetchData();
  }, [searchInput, fetchData]);

  const handleSearch = () => {
    setSearchInput(searchTerm);
  };





  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      currentPge: newPage,
    });
  };
  const { t, language } = useI18nContext();

  const handleUpdateActive = (id, newActiveStatus) => {
    axios
      .put(`https://store-system-api.gleeze.com/api/users/${id}`, { active: newActiveStatus }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        fetchData();
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
  };

  const toggleEditDropdown = (productId) => {
    setSelectedUserId((prevProductId) =>
      prevProductId === productId ? null : productId
    );
  };
  const handleClickOutside = (event, productId) => {
    const dropdown = dropdownRefs.current[productId];

    if (
      dropdown &&
      !dropdown.contains(event.target) &&
      !event.target.classList.contains("edit-button")
    ) {
      setSelectedUserId(null);
    }
  };
  const dropdownRefs = useRef({});

  return (
    <div>
      <section className="bg-gray-700 bg-opacity-25 mx-10 rounded-md pt-2 absolute top-40 w-3/4">
        <div className="flex justify-between">
          <div className="relative w-96 m-3">
            <input
              className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-gray-500"
              type="text"
              onClick={handleSearch}
              placeholder={t("Products.Search")}
            />
            <CiSearch
              className={`absolute top-2 text-white text-xl ${language === "ar" ? "left-3" : "right-3"
                } `}
            />
          </div>
          <div>
            <button
              className="bg-yellow-900 w-28 rounded-md m-3 hover:bg-yellow-800 fw-bold"
            >
              {t("Products.Add")}
            </button>

          </div>
          {/* <div>
            <Link to='/users/addUser' className='btn btn-primary AddUser p-2' >
              <Translate>ِAdd user</Translate>
            </Link>
              </div>*/}
        </div>

        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xm text-gray-200 uppercase">
            <tr className="text-center bg-gray-500 bg-opacity-25 transition ease-out duration-200">
              <th scope="col" className="px-4 py-4">ID</th>
              <th scope="col" className="px-4 py-4">Name</th>
              <th scope="col" className="px-4 py-4">Active</th>
              <th scope="col" className="px-4 py-4">Actions</th>
              <th scope="col" className="px-4 py-4">Role</th>
            </tr>
          </thead>
          {loading ? (
            <tr>
              <td colSpan="8" className="fs-4 text-center mb-5 pb-3">
                <Loading />
              </td>
            </tr>
          ) :
            (<><tbody>
              {users.length === 0 && (
                <tr className="text-xl text-center">
                  <td colSpan="8">{t("Products.NoProductsAvailable")}</td>
                </tr>
              )}
              {users.map((user) => (
                <tr className="border-b dark:border-gray-700 text-center hover:bg-gray-500 hover:bg-opacity-25 transition ease-out duration-200"
                  key={user._id}>
                  <th scope="row"
                    className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white max-w-[5rem] truncate"
                  >{user._id.slice(-4)}</th>
                  {decodedToken.role === 'admin' && (
                    <td className="px-4 py-4">
                      <Link to={`/users/${user._id}/userBills`}  >
                        {user.name}
                      </Link>
                    </td>
                  )}
                  {decodedToken.role === 'manager' && <td>{user.name}</td>}
                  <td className="px-4 py-4">{user?.role}</td>

                  <td className="px-4 py-3 flex items-center justify-end">
                    <button
                      className="inline-flex items-center text-sm font-medium p-1.5 text-center text-gray-500 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100 bg-transparent"
                      type="button"
                      onClick={() => toggleEditDropdown(user._id)}
                      ref={(el) => (dropdownRefs.current[user._id] = el)}
                    >
                      <DotsThree
                        size={25}
                        weight="bold"
                        className="hover:bg-gray-700 w-10 rounded-lg"
                      />
                    </button>
                    <div
                      className={`absolute z-20 ${selectedUserId === user._id ? "block" : "hidden"
                        }`}
                      //   onClick={handleBackgroundClick}
                      dir={language === "ar" ? "rtl" : "ltr"}
                    >
                      <div
                        //  id={`product-dropdown-${product._id}`}
                        className="bg-gray-900 rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                      >
                        <ul className="text-sm bg-transparent pl-0 mb-0">
                          <li>
                            <button
                              type="button"
                              className="flex w-full items-center gap-3 fs-6 fw-bold justify-content-start py-2 px-4 bg-gray-700 hover:bg-gray-600 dark:hover:text-white text-gray-700 dark:text-gray-200"
                            //      onClick={() => handleEditProduct(product)}
                            >
                              <NotePencil size={18} weight="bold" />
                              {t("Edit")}
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="flex w-full items-center gap-3 fs-6 fw-bold justify-content-start py-2 px-4 bg-gray-700 hover:bg-gray-600 dark:hover:text-white text-gray-700 dark:text-gray-200"
                            //  onClick={() => openPreview(product)}
                            >
                              <Eye size={18} weight="bold" />
                              {t("Category.Preview")}
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="flex w-full items-center gap-3 fs-6 fw-bold justify-content-start py-2 px-4 bg-gray-700 hover:bg-gray-600 dark:hover:text-white text-gray-700 dark:text-gray-200"
                            // onClick={() => handleDeleteProduct(product._id)}
                            >
                              <TrashSimple size={18} weight="bold" />
                              {t("Category.Delete")}
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </td>


                  {/*decodedToken._id !== user._id &&
                    <td className="px-4 py-4">
                      <button className='border'
                        value={!user.active}
                        onClick={() => handleUpdateActive(user._id, !user.active)}
                      >
                        {user.active === true ? (
                          <Translate>active</Translate>
                        ) : (
                          <Translate>deactive</Translate>
                        )}
                      </button>
                      </td>*/}
                  {decodedToken.role !== 'user' &&
                    user.role !== 'manager' && (
                      <td className="px-4 py-4">
                        <Link to={`/changeUserPassword/${user._id}`} className={styles.deleteBtn}>
                          <Translate translations={{ ar: 'تغيير كلمة المرور', en: 'change password' }}>{selectedLanguage === 'ar' ? 'تغيير كلمة المرور' : 'change password'}</Translate>
                        </Link>
                      </td>
                    )}
                </tr>
              ))}
            </tbody></>)}
        </table>

        <nav
          className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4 gap-8 "
          dir="rtl"
        >
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ">
            {"      "} {t("Products.appear")}
            {"   "}
            <span
              className="font-semibold text-gray-900 dark:text-white m-2"
              dir="ltr"
            >
              {"     "} 1-10 {"      "}
            </span>{" "}
            {"  "}
            {"   "}
            {t("Products.from")}
            <span className="font-semibold text-gray-900 dark:text-white m-2">
              {"   "}1000 {"   "}
            </span>
          </span>
          <ul className="inline-flex items-stretch -space-x-px" dir="ltr">
            <li>
              <a
                href="/"
                className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-gray-700 rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Previous</span>
                <CaretLeft size={18} weight="bold" />
              </a>
            </li>
            <li>
              <a
                href="/"
                className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-gray-700 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                1
              </a>
            </li>
            <li>
              <a
                href="/"
                className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-gray-700 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                2
              </a>
            </li>
            <li>
              <a
                href="/"
                aria-current="page"
                className="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-gray-700 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              >
                3
              </a>
            </li>
            <li>
              <a
                href="/"
                className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-gray-700 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                ...
              </a>
            </li>
            <li>
              <a
                href="/"
                className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-gray-700 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                100
              </a>
            </li>
            <li>
              <a
                href="/"
                className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-gray-700 rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span className="sr-only">Next</span>
                <CaretRight size={18} weight="bold" />
              </a>
            </li>
          </ul>
        </nav>

      </section>
    </div>
  );
};

export default Users;
