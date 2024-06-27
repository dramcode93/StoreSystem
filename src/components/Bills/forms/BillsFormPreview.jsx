import { useEffect, useState } from "react";
import Loading from "../../Loading/Loading";

export default function BillsFormPreview({ details, t, headers }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (details) {
      setLoading(false);
    }
  }, [details]);
  console.log(details)
  return (
    <dl>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.code} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.code}
            </dd>
          </div>
          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.name} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.name}
            </dd>
          </div>
          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.userName} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.userName}
            </dd>
          </div>
          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.totalAmount} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.totalAmount}
            </dd>
          </div>
          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.discount} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.discount}
            </dd>
          </div>
          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.paidAmount} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.paidAmount}
            </dd>
          </div>
          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.remainingAmount} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.remainingAmount}
            </dd>
          </div>

          <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor">
            {headers?.products} :
          </dt>
          <div className="grid grid-cols-2 gap-2 text-gray-900 dark:text-gray-300 m-0">
            {details.products ? (
              details.products.map((item) => (
                 <div className="d-flex gap-1" key={item._id}>
                  <dd className="!text-base font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                    {item.product ? item.product.name : "No products yet"}
                  </dd>
                </div>
              ))
            ) : (
              <div className="d-flex gap-1">
                <dd className="!text-base font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                  No products yet
                </dd>
              </div>
            )}
          </div>
        </>
      )}
    </dl>
  );
}
