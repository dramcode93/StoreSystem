import { Link } from "react-router-dom";
import { useI18nContext } from "../components/context/i18n-context";

export default function Card({
  id,
  icon,
  name,
  adminName,
  showMore,
  rooms,
  click,
}) {
  const language = useI18nContext();
  return (
    <div
      onClick={click}
      // dark:bg-gray-800 bg-gray-100
      className={`cursor-pointer secondary  rounded-md -z-3  ${
        language === "ar" ? "left-10" : "right-10"
      }`}
    >
      <div
        className={`border-2 border-gray-200 shadow-md hover:shadow-xl
        ease-linear duration-100 m-3 relative hover:translate-y-0.5 rounded-md
        dark:bg-gray-900 dark:shadow-slate-800 dark:border-gray-600 
        dark:hover:bg-gray-950 w-80 h-56`}
      >
        <span
          className={`after:content-['${id}'] after:ml-0.5
          after:bg-orange-500 text-gray-900 fw-bold text-center text-xl 
          after:w-9 after:h-2.5 after:absolute after:top-0
          after:right-2 top-3 -right-[100%] after:border-t-4 absolute ${language === "ar" ? "left-20" : "right-0"}`}
        ></span>
        <div
        // dark:hover:text-gray-900
          className={`px-10 pt-5 text-gray-700 
          dark:text-orange-100 
          ease-linear duration-100 flex flex-col gap-2 justify-between items-center`}
        >
          <div className="d-flex items-center justify-between py-5">
            <div className="absolute right-10 ">{icon}</div>
            <div className=" w-full">
              <h1 className=" absolute left-10 bottom-24 fs-5 ">{name}</h1>
            </div>
          </div>
          <div className="flex flex-col items-center w-2/6 text-center">
            <p className="text-slate-400">{adminName}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <p className="text-slate-400 text-center ">{rooms}</p>{" "}
          </div>

          <div
            className={`flex justify-center mt-2
              h-full  w-3/6 hover:text-white
              hover:bg-orange-500 text-orange-800
            ease-linear duration-100 hover:translate-y-0.5`}
          >
            <Link
              onClick={click}
              className={` w-full h-full mx-auto ease-linear duration-100 text-center
              bg-orange-300 hover:bg-orange-500
                 font-semibold `}
            >
              {showMore}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
