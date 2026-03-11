import PillButton from "components/button/Pills";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import React from "react";
import { useTranslation } from "react-i18next";

interface ExcelExportProps {
  data: any[];
  fileName?: string;
}

interface StoreProp {
  key: string;
  label: string;
}

const ExportComponent = ({
  data,
  fileName = "export.xlsx",
}: ExcelExportProps) => {
  const { t } = useTranslation(); // Assuming you have a translation function
  if (data.length === 0) return null;

  const columns = Array.from(
  new Set(data.flatMap((item) => Object.keys(item)))// issue fixed, if first row do not have appr ammnt, then column won't come in xl
);

const normalizedData = data.map(item => {
  const row: any = {};
  columns.forEach(col => {
    row[col] = item[col] ?? "";  // force missing fields to empty
  });
  return row;
});

  const store = (items: string[]): StoreProp[] =>
    items.map((col) => ({
      key: col,
      label: col.charAt(0).toUpperCase() + col.slice(1),
    }));

  const handleExport = async () => {
    if (data.length === 0) {
      alert("No data available to export.");
      return;
    }

    const columnMetadata = store(columns);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");

    worksheet.addRow(columnMetadata.map((col) => col.label));

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFCCCCCC" },
      };
      cell.alignment = { horizontal: "center", vertical: "middle" };
    });

    normalizedData.forEach((item) => {
      const row = worksheet.addRow(
        columnMetadata.map((col) => item[col.key] ?? "")
      );
      row.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });
    });

    worksheet.columns = columnMetadata.map((col) => ({
      key: col.key,
      width: 20,
    }));

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, fileName);
  };

  return (
    <PillButton
      onClick={handleExport}
      variant="primary"
      className="w-[96px] h-[32px]  font-medium text-sm p-1 flex items-center justify-center"
    >
      {t("button.export")}
    </PillButton>
  );
};

export default ExportComponent;
