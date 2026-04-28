import React, { useState } from "react";
import { showSuccess, showError } from "@/hooks/useToast";
import { Download } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/Button";
import { exportDashboardPdf } from "@/api/analytics";

export function ExportButton({ dashboardData, dateRange }) {
  const [isExporting, setIsExporting] = useState(false);
  const { baseURL } = useApp();

  // Helper to safely handle file downloads and memory cleanup
  const downloadFile = (blob, fileName) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const blob = await exportDashboardPdf(dashboardData, dateRange);
      if (!blob) throw new Error("Server returned no file");
      downloadFile(blob, `Dashboard_Report_${new Date().toLocaleDateString()}.pdf`);
      showSuccess("Download started!");
    } catch (err) {
      showError("Export failed: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = () => {
    const csvRows = [
      ["Dashboard Summary Report"],
      ["Generated", new Date().toLocaleString()],
      ["Date Range", `${dateRange} Days`],
      [""],
      ["Metric", "Value"],
      ["Total Revenue", `₦${dashboardData?.totalRevenue || 0}`],
      ["Total Orders", dashboardData?.totalOrders || 0],
      ["Active Customers", dashboardData?.totalCustomers || 0],
      ["Pending Orders", dashboardData?.pendingOrders || 0],
    ];

    const csvContent = csvRows
      .map((row) => row.map((value) => `"${value}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    downloadFile(
      blob,
      `laundry-stats-${new Date().toISOString().split("T")[0]}.csv`,
    );
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleExportPDF}
        disabled={isExporting}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Download size={16} className="mr-2" />
        {isExporting ? "Generating PDF..." : "Export PDF"}
      </Button>

      <Button
        onClick={handleExportCSV}
        disabled={isExporting}
        variant="secondary"
      >
        <Download size={16} className="mr-2" />
        Export CSV
      </Button>
    </div>
  );
}
