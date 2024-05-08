import Loading from "../Loading/Loading";

export default function ProductFormPreview({ details, t, headers, loading }) {
  return (
    <dl className="">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor">
              {headers?.code} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?._id.slice(-4)}
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
              {headers?.description} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.description}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.category} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.category.name}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.quantity} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.quantity}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.productPrice} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.productPrice}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.sellingPrice} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.sellingPrice}
            </dd>
          </div>

          <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.sold} :
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {details?.sold}
            </dd>
          </div>
          {/* <div className="d-flex gap-2 items-center">
            <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
              {headers?.images}:
            </dt>
            <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
              {loading ? (
                <Loading />
              ) : details?.images && details.images.length > 0 ? ( // Check if images array exists and has items
                <div className="grid grid-cols-2 gap-1 m-0">
                  {details.images.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt=""
                      className="max-w-full h-auto"
                    />
                  ))}
                </div>
              ) : (
                "No Images Yet"
              )}
            </dd>
          </div> */}

            <div className="d-flex gap-2 items-center">
              <dt className=" font-semibold leading-none text-gray-900 dark:text-themeColor d-flex">
                {headers?.images}:
              </dt>
              <dd className=" font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                {details.images && details.images.length > 0 ? (
                  <div className="d-grid grid-cols-2">
                    {details.images.map((imageUrl, index) => (
                      <img
                        key={index}
                        src={imageUrl}
                        alt="Product"
                        className="max-w-full h-75"
                        crossOrigin="anonymous"
                      />
                    ))}
                  </div>
                ) : (
                  "No Images Yet"
                )}
              </dd>
            </div>


        </>
      )}
    </dl>
  );
}
