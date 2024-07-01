import axios from "axios";
import { useI18nContext } from "../context/i18n-context";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Loading from "../Loading/Loading";
import Cookies from "js-cookie";
import { CiSearch } from "react-icons/ci";
import {
  CaretLeft,
  CaretRight,
  DotsThree,
  Eye,
  NotePencil,
} from "@phosphor-icons/react";
import { FaCircle } from "react-icons/fa6";
import { MdPersonAddDisabled, MdPassword } from "react-icons/md";
import { VscActivateBreakpoints } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";

const API_users = "https://store-system-api.gleeze.com/api/users";

const UserTable = ({ openCreate, openEdit }) => {
  const token = Cookies.get("token");
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [nextPageData, setNextPageData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPge: 1,
    totalPages: 1,
  });
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      if (token) {
        const response = await axios.get(
          `${API_users}?sort=-role name&search=${searchTerm}&page=${pagination.currentPge}&limit=5`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(response.data.data);
        setPagination({
          currentPge: pagination.currentPge,
          totalPages: response.data.paginationResult.numberOfPages,
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [token, pagination.currentPge, searchTerm]);

  useEffect(() => {
    fetchData();
  }, [searchTerm, pagination.currentPge, token, fetchData]);

  useEffect(() => {
    if (pagination.currentPge < pagination.totalPages) {
      axios
        .get(
          `${API_users}?sort=-role name&fields=username name email phone address active role&search=${searchTerm}&page=${pagination.currentPge}&limit=5`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          setNextPageData(response.data.data);
        })
        .catch((error) => {
          console.error("Error preloading next page:", error);
        });
    }
  }, [pagination.currentPge, pagination.totalPages, searchTerm, token]);

  const { t, language } = useI18nContext();

  const handleUpdateActive = (id, newActiveStatus) => {
    axios
      .put(
        `https://store-system-api.gleeze.com/api/users/${id}/activeUser?search=${searchInput}&page=${pagination.currentPge}&limit=20`,
        { active: newActiveStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        fetchData();
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  const toggleEditDropdown = (productId) => {
    setSelectedUserId((prevProductId) =>
      prevProductId === productId ? null : productId
    );
  };

  const dropdownRefs = useRef({});

  const handleEditUser = (user) => {
    openEdit(user);
  };
  useEffect(() => {
    if (pagination.currentPge < pagination.totalPages) {
      axios
        .get(
          `${API_users}?sort=-role name&fields=username name email phone address active role&search=${searchTerm}&page=${
            pagination.currentPge + 1
          }&limit=3`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          setNextPageData(response.data.data);
        })
        .catch((error) => {
          console.error("Error preloading next page:", error);
        });
    }
  }, [pagination.currentPge, pagination.totalPages, searchTerm, token]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
  };

  const handleClickOutside = (event) => {
    const isOutsideDropdown = Object.values(dropdownRefs.current).every(
      (ref) => ref && !ref.contains(event.target)
    );
    if (isOutsideDropdown) {
      setSelectedUserId(null);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handlePageChange = (newPage) => {
    setPagination({
      ...pagination,
      currentPge: newPage,
    });
  };

  const MAX_DISPLAY_PAGES = 5;

  const startPage = Math.max(
    1,
    Math.min(
      pagination.currentPge - Math.floor(MAX_DISPLAY_PAGES / 2),
      pagination.totalPages - MAX_DISPLAY_PAGES + 1
    )
  );
  const endPage = Math.min(
    startPage + MAX_DISPLAY_PAGES - 1,
    pagination.totalPages
  );

  const pageButtons = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );
  const handlePreviousPage = () => {
    if (pagination.currentPge > 1) {
      handlePageChange(pagination.currentPge - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPge < pagination.totalPages) {
      handlePageChange(pagination.currentPge + 1);
    }
  };

  return (
    <div>
      <section
        className={`secondary mx-10 pt-2 absolute top-32 -z-50 w-3/4 ${
          language === "ar" ? "left-10" : "right-10"
        }`}
      >
        <div className="flex justify-between">
        <div className="relative w-96 m-3">
          <input
            className="px-4 py-2 pl-10 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:bg-gray-500"
            type="text"
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
            placeholder={t("Products.Search")}
          />
          <CiSearch
            className={`absolute top-2 text-gray-900 dark:text-gray-50 text-xl ${
              language === "ar" ? "left-3" : "right-3"
            } cursor-pointer`}
            onClick={handleSearch}
          />
        </div>
          <div>
            <button
              className="secondaryBtn w-28 rounded-md m-3 fw-bold"
              onClick={openCreate}
            >
              {t("Users.ADD")}
            </button>
          </div>
          {/* <div>
            <Link to='/users/addUser' className='btn btn-primary AddUser p-2' >
              <Translate>ِAdd user</Translate>
            </Link>
              </div>*/}
        </div>

        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xm text-gray-50 dark:text-gray-200 uppercase">
            <tr className="text-center fs-6 bg-gray-700   tracking-wide  transition ease-out duration-200">
              <th scope="col" className="px-4 py-4">
                ID
              </th>
              <th scope="col" className="px-4 py-4">
                {t("Users.USERNAME")}
              </th>
              <th scope="col" className="px-4 py-4">
                {t("Users.NAME")}
              </th>
              <th scope="col" className="px-4 py-4">
                {t("Users.PHONE")}
              </th>
              <th scope="col" className="px-4 py-4">
                {t("Users.ROLE")}
              </th>
              <th scope="col" className="px-4 py-4">
                {t("Users.ACTIVE")}
              </th>
              <th scope="col" className="px-4 py-4">
                {t("Users.ADDRESS")}
              </th>
              <th scope="col" className="px-4 py-4"></th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan="8" className="fs-4 text-center mb-5 pb-3">
                  <Loading />
                </td>
              </tr>
            </tbody>
          ) : (
            <>
              <tbody>
                {users.length === 0 && (
                  <tr className="text-xl text-center">
                    <td colSpan="8" style={{lineHeight: 3}}>{t("Products.NoProductsAvailable")}</td>
                  </tr>
                )}
                {users.map((user) => (
                  <tr
                    className="w-full border-b dark:border-gray-700 text-center hover:bg-gray-600 hover:bg-opacity-25 transition ease-out duration-200"
                    key={user._id}
                  >
                    <th
                      scope="row"
                      className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white max-w-[5rem] truncate"
                    >
                      {user._id.slice(-4)}
                    </th>
                    <td className="px-4 py-4">{user.username}</td>
                    <td className="px-4 py-4">{user.name}</td>

                    {/*decodedToken.role === 'admin' && (
                    <td className="px-4 py-4">
                      <Link to={`/users/${user._id}/userBills`}  >
                        {user.name}
                      </Link>
                    </td>
                  )*/}

                    {/*decodedToken.role === 'manager' && <td>{user.name}</td>*/}
                    <td className="px-4 py-4">
                      {user.phone.map((phone, index) => (
                        <div key={index}>{phone}</div>
                      ))}
                    </td>
                    <td className="px-4 py-4">{user.role}</td>
                    <td className="px-4 py-4">
                      {user.active === true ? (
                        <FaCircle className="!text-green-600 w-full text-center" />
                      ) : (
                        <FaCircle className="!text-red-600 w-full text-center" />
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {user.address.map((address, index) => (
                        <div key={index}>
                          {`${address.street},  
            ${
              language === "ar"
                ? address.city?.city_name_ar
                : address.city?.city_name_en
            },  
            ${
              language === "ar"
                ? address.governorate?.governorate_name_ar
                : address.governorate?.governorate_name_en
            }`}
                        </div>
                      ))}
                    </td>

                    <td className="px-4 py-3 flex items-center justify-end">
                      <button
                        className="inline-flex items-center text-sm font-medium   p-1.5  text-center text-gray-500 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100 bg-transparent"
                        type="button"
                        onClick={() => toggleEditDropdown(user._id)}
                        ref={(el) => (dropdownRefs.current[user._id] = el)}
                      >
                        <DotsThree
                          size={25}
                          weight="bold"
                          className="hover:bg-slate-300  dark:hover:bg-gray-600 w-10 rounded-lg"
                        />
                      </button>
                      <div
                        className="absolute z-50"
                        dir={language === "ar" ? "rtl" : "ltr"}
                      >
                        <div
                          className={`${
                            selectedUserId === user._id
                              ? `absolute -top-3 ${
                                  language === "en" ? "right-full" : "left-full"
                                } overflow-auto`
                              : "hidden"
                          } z-10 w-56  rounded divide-y divide-gray-100 shadow secondary `}
                        >
                          <div>
                            <ul className="text-sm bg-transparent pl-0 mb-0">
                              <li>
                                <button
                                  type="button"
                                  className="flex w-56 items-center gap-3 fs-6 fw-bold justify-content-start py-2 px-4 dots hover:bg-slate-300 dark:hover:bg-gray-600 dark:text-white text-gray-700 "
                                  onClick={() => handleEditUser(user)}
                                >
                                  <NotePencil size={18} weight="bold" />
                                  {t("Users.Edit")}
                                </button>
                              </li>
                              {/* <li>
                                <button
                                  type="button"
                                  className="flex w-56 items-center gap-3 fs-6 fw-bold justify-content-start py-2 px-4 bg-gray-700 hover:bg-gray-600  dark:hover:text-white text-gray-700 dark:text-gray-200"
                                  onClick={() =>
                                    navigate(`/${user._id}/userBill`)
                                  }
                                >
                                  <Eye size={18} weight="bold" />
                                  {t("Users.Preview")}
                                </button>
                              </li> */}
                              <li>
                                <button
                                  type="button"
                                  className="flex w-56 items-center gap-3 fs-6 fw-bold justify-content-start py-2 px-4 dots hover:bg-slate-300 dark:hover:bg-gray-600 dark:text-white text-gray-700 "
                                  onClick={() => {
                                    navigate(`/changeUserPassword/${user._id}`);
                                  }}
                                >
                                  <MdPassword size={18} weight="bold" />
                                  {t("Users.changePassword")}
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  className="flex w-56 items-center gap-3 fs-6 fw-bold justify-content-start py-2 px-4 dots hover:bg-slate-300 dark:hover:bg-gray-600 dark:text-white text-gray-700 "
                                  onClick={() =>
                                    handleUpdateActive(user._id, !user.active)
                                  }
                                >
                                  {user.active === true ? (
                                    <>
                                      <MdPersonAddDisabled
                                        size={18}
                                        weight="bold"
                                      />
                                      {t("Users.Disable")}
                                    </>
                                  ) : (
                                    <>
                                      <VscActivateBreakpoints
                                        size={18}
                                        weight="bold"
                                        className="text-green-600"
                                      />
                                      {t("Users.Enable")}
                                    </>
                                  )}
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
          )}
        </table>

        <nav className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4 gap-8 ">
          <ul className="inline-flex items-stretch -space-x-px" dir="ltr">
            <li>
              <button
                className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={handlePreviousPage}
              >
                <span className="sr-only">Previous</span>
                <CaretLeft size={18} weight="bold" />
              </button>
            </li>
            {pageButtons.map((page) => (
              <li key={page}>
                <button
                  className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${
                    pagination.currentPge === page
                      ? "bg-gray-200 text-gray-800"
                      : "text-gray-500  border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  }`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              </li>
            ))}
            <li>
              <button
                className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500  rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={handleNextPage}
              >
                <span className="sr-only">Next</span>
                <CaretRight size={18} weight="bold" />
              </button>
            </li> 
          </ul>
        </nav>
      </section>
    </div>
  );
};

export default UserTable;
