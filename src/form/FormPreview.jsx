export default function FormPreview({ details, name, t, center, role , headers }) {
  return (
    <dl>
      <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor">
       {headers?.code}
      </dt>
      <dd className="mb-4 font-bold text-gray-500 sm:mb-5 dark:text-gray-300">
        {headers? name:""}
      </dd>
      <dt>
        <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor">
        {headers?.name}
        </dt>
        <dt className="grid grid-cols-2 gap-2 text-gray-900 dark:text-gray-300 m-0">
          {headers?  details.map((detail, index) => (
            <dt className="d-flex gap-1" key={index}>
              <dd className="!text-base font-medium">{detail.head}</dd>
              <dd className="!text-base font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                {detail.value}
              </dd>
            </dt>
          )):""}
        </dt>
      </dt>
      <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor">
        {role? headers?.job : ""}
      </dt>
      <dd className="mb-2 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
        {headers? role:""}
      </dd>
      <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor">
        {center? headers?.place : ""}
      </dt>
      <dd className="mb-2 font-semibold text-gray-500 sm:mb-5 dark:text-gray-300">
        {headers? center :""}
      </dd>
    </dl>
  );
}
