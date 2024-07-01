import { useEffect, useState } from "react";
import Loading from "../../Loading/Loading";

export default function BillsFormPreview({ details, t, headers }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (details) {
      setLoading(false);
    }
  }, [details]);
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
              {headers?.sellerName} :
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
          {details.products?.length > 0 ? (
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xm text-gray-50 dark:text-gray-200 uppercase">
                <tr className="text-center fs-6 bg-gray-700   tracking-wide  transition ease-out duration-200">
                  <th scope="col" className="px-4 py-3">
                    Product
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Quantity
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Price
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Total Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {details.products.map((item, index) => (
                  <tr
                    key={index}
                    className="w-full border-b dark:border-gray-700 text-center hover:bg-gray-600 hover:bg-opacity-25 transition ease-out duration-200"
                  >
                    <td className="px-4 py-3">{item.product?.name}</td>
                    <td className="px-4 py-3">{item.productQuantity}</td>
                    <td className="px-4 py-3">
                      {item.product?.sellingPrice} $
                    </td>
                    <td className="px-4 py-3">{item.totalPrice} $</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="d-flex gap-1">
              <td
                colSpan="4"
                className="!text-base font-light  sm:mb-5 secondaryF"
              >
                No products yet
              </td>
            </div>
          )}
        </>
      )}
    </dl>
  );
}
