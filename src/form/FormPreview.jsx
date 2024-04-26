export default function FormPreview({ details, name, t, center, role }) {
  return (
    <dl>
      <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-themeColor">
        {t("previewForm.name")}
      </dt>
      <dd className="mb-4 font-bold text-gray-500 sm:mb-5 dark:text-gray-300">
        {name}
      </dd>
      <dt>
        <dt className="mb-4 font-semibold leading-none text-gray-900 dark:text-themeColor">
          {t("previewForm.detailsHead")}
        </dt>
        <dt className="grid grid-cols-1 md:grid-cols-2 gap-x-3 text-gray-900 dark:text-gray-300">
          {details.map((detail, index) => (
            <dt className="flex gap-2 mb-3 items-start" key={index}>
              <dd className="!text-base font-medium">{detail.head}</dd>
              <dd className="!text-base font-light text-gray-500 sm:mb-5 dark:text-gray-400">
                {detail.value}
              </dd>
            </dt>
          ))}
        </dt>
      </dt>
      <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-themeColor">
        {role? t("previewForm.job") : ""}
      </dt>
      <dd className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">
        {role}
      </dd>
      <dt className="mb-2 font-semibold leading-none text-gray-900 dark:text-themeColor">
        {center? t("previewForm.place") : ""}
      </dt>
      <dd className="mb-4 font-semibold text-gray-500 sm:mb-5 dark:text-gray-300">
        {center}
      </dd>
    </dl>
  );
}
