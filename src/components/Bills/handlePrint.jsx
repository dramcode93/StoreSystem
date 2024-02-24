export const handlePrint = (model, billId) => {
    const billToPrint = model.find((bill) => bill._id === billId);

    if (billToPrint) {
        const left = window.screen.width / 2;
        const top = window.screen.height / 2;
        const printWindow = window.open(' ', '', `left=${left}, top=${top}`);
        printWindow.document.write(`
        <html>
          <head>
            <h1> فاتورة</h1>
            <style>
              @media print {
                body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  direction: rtl;
                }
                h1{
                  text-align:center;
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
                h3{
                  margin-top:0vh ;
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
                section{
                  display:flex;
                  justify-content:space-between;
                  align-items:center;
                }
              }
            </style>
          </head>
          <body>
          <section>
          <div>
            <p>  اسم العميل : ${billToPrint.customerName} </p>
            <p>  رقم التليفون : ${billToPrint.phone} </p>
            <p>كود الفاتورة : ${billToPrint._id.slice(-4)} </p>
            </div>
          <div>
            <p> اسم البائع : ${billToPrint.user.name} </p>
            <p> تاريخ الفاتورة : ${billToPrint.createdAt && new Date(billToPrint.createdAt).toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })} </p>
            <p> آخر تعديل للفاتورة : ${billToPrint.updatedAt && new Date(billToPrint.updatedAt).toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })} </p>
            </div>
            </section>
            <h3> عنوان العميل : ${billToPrint.customerAddress}</h3>
            <table>
              <thead>
                <tr className='text-center'>
                  <th>المنتج</th>
                  <th>السعر</th>
                  <th>الكمية</th>
                  <th> السعر الكلي</th>
                </tr>
              </thead>
              <tbody>
                ${billToPrint.products.map((product) => `
                  <tr>
                    <td>${product?.product?.name}</td>
                    <td>${product?.product?.price}</td>
                    <td>${product?.productQuantity}</td>
                    <td>${product?.totalPrice}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div>
              <span> الإجمالي : ${billToPrint.totalAmount}</span>
              <span>المدفوع : ${billToPrint.paidAmount} </span>
              <span> الباقي : ${billToPrint.remainingAmount}</span>
            </div>
            <p> إمضاء العميل / ...................................................</p>
          </body>
        </html>
      `);

        printWindow.document.close();
        printWindow.print();
    }
};