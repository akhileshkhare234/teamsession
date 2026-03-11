// components/PDFDownloadButton.tsx
import React from "react";
import { downloadFile } from "../../utility/downloadPDF ";

interface PDFDownloadButtonProps {
  url: string;
  fileName?: string;
  label?: string;
  className?: string;
  token: string;
  params?: Record<string, any>;
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  url,
  fileName = "document.xlsx",
  label = "Download PDF",
  className = "",
  token,
  params = {},
}) => {
  return (
    <button
      onClick={() => downloadFile(url, fileName, params, token)}
      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${className}`}
    >
      {label}
    </button>
  );
};

export default PDFDownloadButton;
