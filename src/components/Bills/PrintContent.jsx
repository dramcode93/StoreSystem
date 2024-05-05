import React from "react";
import styles from "./PrintBill.module.css"; // Import the CSS module

const PrintContent = ({ billToPrint, language }) => {
  return (
    <html>
      <head>
        <style>{`
        @media print {
                    body {
                      font-family: Arial, sans-serif;
                      margin: 0;
                      padding: 0;
                      direction: rtl;
                      background-color: #abda;
                    }
                    h1 {
                      text-align: center;
                    }
                    table {
                      width: 100%;
                      border-collapse: collapse;
                      margin-bottom: 3vh;
                    }
                    th, td {
                      border: 1px solid #ddd;
                      padding: 8px;
                      text-align: center;
                    }
                    th {
                      background-color: #f2f2f2;
                    }
                    tr:nth-child(even) {
                      background-color: #f2f2f2;
                    }
                    tr:hover {
                      background-color: #ddd;
                    }
                    h2 {
                      font-size: 18px;
                      margin-bottom: 10px;
                    }
                    h3 {
                      margin-top: 0vh;
                    }
                    p {
                      font-size: 20px;
                      margin: 2vh 0;
                    }
                    div {
                      padding: 2vw 0;
                    }
                    span {
                      font-size: 18px;
                      border: 1px solid gray;
                      padding: 1vh 3vw;
                      margin: 5px 0vw 50px 9vw;
                    }
                    section {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                    }
                  }

        `}</style>
      </head>
      <body className={styles.body}>
        <h1 className={styles.h1}>فاتورة</h1>
        <section className={styles.section}>
          <div>
            <p className={styles.p}>اسم العميل : {billToPrint.customerName} </p>
            <p className={styles.p}>
              رقم التليفون :{" "}
              {billToPrint.customer?.phone
                .map((phone, index) => phone)
                .join(", ")}{" "}
            </p>
            <p className={styles.p}>
              كود الفاتورة : {billToPrint._id.slice(-4)}{" "}
            </p>
          </div>
          <div>
            <p className={styles.p}>اسم البائع : {billToPrint.user.name} </p>
            <p className={styles.p}>
              تاريخ الفاتورة :{" "}
              {billToPrint.createdAt &&
                new Date(billToPrint.createdAt).toLocaleDateString("ar", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}{" "}
            </p>
            <p className={styles.p}>
              آخر تعديل للفاتورة :{" "}
              {billToPrint.updatedAt &&
                new Date(billToPrint.updatedAt).toLocaleDateString("ar", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}{" "}
            </p>
          </div>
        </section>
        <h3 className={styles.h3}>
          عنوان العميل :
          {billToPrint.customer?.address.map(
            (address) =>
              `${
                language === "ar"
                  ? address.city.city_name_ar
                  : address.city.city_name_en
              }, ${
                language === "ar"
                  ? address.governorate.governorate_name_ar
                  : address.governorate.governorate_name_en
              }`
          )}
        </h3>
        <table className={styles.table}>
          <thead>
            <tr className={`${styles.textCenter} ${styles.th}`}>
              <th>المنتج</th>
              <th>السعر</th>
              <th>الكمية</th>
              <th>السعر الكلي</th>
            </tr>
          </thead>
          <tbody>
            {billToPrint.products.map((product) => (
              <tr key={product._id}>
                <td>{product?.product?.name}</td>
                <td>{product?.product?.sellingPrice}</td>
                <td>{product?.productQuantity}</td>
                <td>{product?.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.div}>
          <span className={styles.span}>
            الإجمالي: {billToPrint.totalAmountAfterDiscount}
          </span>
          <span className={styles.span}>المدفوع: {billToPrint.paidAmount}</span>
          <span className={styles.span}>
            الباقي: {billToPrint.remainingAmount}
          </span>
        </div>
        <p className={styles.p}>
          إمضاء العميل / ...................................................
        </p>
      </body>
    </html>
  );
};

export default PrintContent;
