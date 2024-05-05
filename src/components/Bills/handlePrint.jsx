
import ReactDOMServer from 'react-dom/server';
import PrintContent from './PrintContent';

export const handlePrint = (model, billId,language) => {
  const billToPrint = model.find((bill) => bill._id === billId);
  if (billToPrint) {
    const left = window.screen.width / 2;
    const top = window.screen.height / 2;
    const printWindow = window.open('', '', `left=${left}, top=${top}`);
    printWindow.document.write(
      ReactDOMServer.renderToString(
        <PrintContent billToPrint={billToPrint} language={language} />
      )
    );
    printWindow.document.close();
    printWindow.print();
  }
};