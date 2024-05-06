import Loading from "../Loading/Loading";

export default function ProductFormPreview({ details, t, headers, loading }) {
  return (
    <dl className="">
      {/* <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
        {headers?.code} :
      </dt>
      <dd className="mb-4 font-bold text-gray-500 sm:mb-5 dark:text-gray-300">
        {details?.code}
      </dd> */}
      {loading ? (
        <Loading />
      ) : (
        <>
          <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
            {headers?.name} :
          </dt>
          <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
            {details?.name}
          </dd>

          <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor">
            {headers?.products} :
          </dt>
          <div className="grid grid-cols-2 gap-2 text-gray-900 dark:text-gray-300 m-0">
            {headers && details?.products && details.products.length > 0 ? (
              details.products.map((product, index) => (
                <div className="d-flex gap-1" key={product.id}>
                  <dd className="!text-base font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                    {product.name}
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
