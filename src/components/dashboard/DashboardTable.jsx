/**
 * Reusable Dashboard Table Component
 * Consolidates common table rendering patterns across all dashboard variants
 * Eliminates duplication in table setup, pagination, and column definitions
 */

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

/**
 * Generic dashboard table component
 * @param {Object} props
 * @param {string} props.title - Table title
 * @param {Array} props.dataSource - Table data
 * @param {Array} props.columns - Column definitions
 * @param {boolean} props.loading - Loading state
 * @param {number} props.pageSize - Items per page (default 10)
 * @param {Function} props.onRow - Row click handler
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.pagination - Pagination config
 */
export const DashboardTable = ({
  title,
  dataSource = [],
  columns = [],
  loading = false,
  pageSize = 10,
  onRow,
  className = "",
  pagination = {},
  showTotal = true,
}) => {
  if (loading) {
    return (
      <Card className={`shadow-sm border-none ${className}`}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!dataSource || dataSource.length === 0) {
    return (
      <Card className={`shadow-sm border-none ${className}`}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-slate-500 py-8">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`shadow-sm border-none ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col, idx) => (
                  <TableHead key={idx} className="font-semibold">
                    {col.title}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataSource.slice(0, pageSize).map((row, rowIdx) => (
                <TableRow key={row.id || rowIdx} className="cursor-pointer hover:bg-slate-50">
                  {columns.map((col, colIdx) => (
                    <TableCell key={colIdx}>
                      {col.render ? col.render(row[col.dataIndex], row) : row[col.dataIndex] || "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {showTotal && (
          <p className="text-xs text-slate-500 mt-4">
            Showing {Math.min(pageSize, dataSource.length)} of {dataSource.length} items
          </p>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Table column helpers for common data types
 */
export const tableColumnHelpers = {
  /**
   * Currency column renderer
   */
  currency: (dataIndex, title = "Amount") => ({
    title,
    dataIndex,
    render: (value) =>
      value !== undefined && value !== null
        ? `₦${parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        : "-",
    sorter: (a, b) => (a[dataIndex] || 0) - (b[dataIndex] || 0),
  }),

  /**
   * Date column renderer
   */
  date: (dataIndex, title = "Date", format_str = "MMM dd, yyyy") => ({
    title,
    dataIndex,
    render: (value) =>
      value ? format(new Date(value), format_str) : "-",
    sorter: (a, b) =>
      new Date(a[dataIndex]) - new Date(b[dataIndex]),
  }),

/**
 * Table column helpers for common data types
 */
export const tableColumnHelpers = {
  /**
   * Currency column renderer
   */
  currency: (dataIndex, title = "Amount") => ({
    title,
    dataIndex,
    render: (value) =>
      value !== undefined && value !== null
        ? `₦${parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
        : "-",
  }),

  /**
   * Date column renderer
   */
  date: (dataIndex, title = "Date", format_str = "MMM dd, yyyy") => ({
    title,
    dataIndex,
    render: (value) =>
      value ? format(new Date(value), format_str) : "-",
  }),

  /**
   * Status column renderer (with color coding)
   */
  status: (dataIndex, title = "Status", statusColors = {}) => ({
    title,
    dataIndex,
    render: (status) => {
      const defaultColors = {
        active: "default",
        pending: "secondary",
        completed: "outline",
        cancelled: "destructive",
        processing: "default",
        hold: "secondary",
      };
      const colorClass = statusColors[status?.toLowerCase()] || defaultColors[status?.toLowerCase()] || "default";
      return <Badge variant={colorClass}>{status || "-"}</Badge>;
    },
  }),

  /**
   * Simple text column
   */
  text: (dataIndex, title = "Name", render = null) => ({
    title,
    dataIndex,
    render: render || ((text) => text || "-"),
  }),

  /**
   * Number column with formatting
   */
  number: (dataIndex, title = "Value") => ({
    title,
    dataIndex,
    render: (value) =>
      value !== undefined && value !== null
        ? parseFloat(value).toLocaleString('en-US')
        : "-",
  }),

  /**
   * Boolean column with icon/text
   */
  boolean: (dataIndex, title = "Active") => ({
    title,
    dataIndex,
    render: (value) => <Badge variant={value ? "default" : "secondary"}>{value ? "Yes" : "No"}</Badge>,
  }),
};

export default DashboardTable;
