import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import GenerateInvoicePage from '../GenerateInvoicePage';
const DownloadPDF = () => {
    const contentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => contentRef.current,
    });
    return (
      <div>
        <GenerateInvoicePage contentRef={contentRef} />
        <button onClick={handlePrint}>Download PDF</button>
      </div>
    );
  };

export default DownloadPDF;