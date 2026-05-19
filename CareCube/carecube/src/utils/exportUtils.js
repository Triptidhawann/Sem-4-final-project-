import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";

/**
 * Helper to download a generated file Blob
 */
const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

/**
 * Generate and download a PDF report
 * @param {string} title - The title of the PDF document
 * @param {string} filename - The filename without extension
 * @param {Array} columns - Array of string column headers
 * @param {Array} data - Array of arrays containing row data corresponding to columns
 */
export const exportToPDF = (title, filename, columns, data) => {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleString();
  const finalFilename = `${filename}-${new Date().toISOString().split('T')[0]}.pdf`;

  // Add header
  doc.setFontSize(18);
  doc.setTextColor(40);
  doc.text("CareCube Platform Report", 14, 22);
  
  doc.setFontSize(14);
  doc.text(title, 14, 30);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${dateStr}`, 14, 36);

  // Add table
  autoTable(doc, {
    startY: 42,
    head: [columns],
    body: data,
    theme: "grid",
    headStyles: { fillColor: [13, 148, 136] }, // Teal matching CareCube UI
    styles: { fontSize: 8, cellPadding: 3 },
  });

  doc.save(finalFilename);
};

/**
 * Generate and download a CSV report
 * @param {string} filename - The filename without extension
 * @param {Array} columns - Array of string column headers
 * @param {Array} data - Array of arrays containing row data corresponding to columns
 */
export const exportToCSV = (filename, columns, data) => {
  const finalFilename = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  
  const csvData = [columns, ...data];
  const csvString = Papa.unparse(csvData);
  
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, finalFilename);
};
