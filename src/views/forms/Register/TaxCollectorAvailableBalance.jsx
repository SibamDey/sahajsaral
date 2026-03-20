// src/pages/TaxCollectorAvailableBalance.jsx

import { useState, useEffect, useMemo } from "react";
import { Table } from "flowbite-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Pagination } from "../../../components/Pagination";
import { SortIcon } from "../../../components/SortIcon";
import SuccessModal from "../../../components/SuccessModal";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const TaxCollectorAvailableBalance = () => {
  const ListOptions = [10, 20, 50, "all"];
  const [items, setItems] = useState(ListOptions[0]);

  const [openModal, setOpenModal] = useState(false);

  // ============================
  // Read LGD code safely
  // ============================

  const [lgdCode, setLgdCode] = useState(null);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;

      const raw = sessionStorage.getItem("SAHAJ_SARAL_USER");
      if (!raw) {
        console.warn("SAHAJ_SARAL_USER not found.");
        return;
      }

      const userData = JSON.parse(raw);

      // ➤ ONLY get the key you need
      const code = userData?.CORE_LGD;

      if (code) {
        setLgdCode(String(code));
      } else {
        console.warn("CORE_LGD missing in user object.");
      }
    } catch (err) {
      console.error("LocalStorage parse error:", err);
    }
  }, []);

  // ============================
  // React Query API Call
  // ============================

  const {
    data: apiData = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["TaxCollectorAvailableBalance", lgdCode],
    enabled: Boolean(lgdCode), // API runs only when LGD exists
    queryFn: async () => {
      const res = await axios.get(
        "https://javaapi.wbpms.in/api/PtaxWallet/TaxCollcetorWiseAvlBalance",
        { params: { lgdCode } }
      );

      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data?.result)) return res.data.result;
      if (Array.isArray(res.data?.message)) return res.data.message;

      return [];
    },
  });

  // ============================
  // Table Data
  // ============================

  const data = useMemo(() => [...apiData], [apiData]);

  const columns = useMemo(
    () => [
      { header: "Tax Collector ID", accessorKey: "tcsId" },
      { header: "Tax Collector Name", accessorKey: "tcsName" },
      { header: "Activation Date", accessorKey: "activateDate" },
      {
        header: "Available Balance (₹)",
        accessorKey: "availableBalance",
        cell: (info) => {
          const num = Number(info.getValue());
          return Number.isNaN(num)
            ? info.getValue()
            : num.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
        },
      },
    ],
    []
  );

  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter: filtering },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: { pageSize: parseInt(items) },
    },
  });

  useEffect(() => {
    table.setPageSize(items === "all" ? 99999 : parseInt(items));
  }, [items]);

  // ============================
  // Excel Download
  // ============================

  const handleDownloadExcel = () => {
    if (!data.length) {
      toast.warn("No data available for Excel export");
      return;
    }

    const exportData = data.map((row) => ({
      "Tax Collector ID": row.tcsId,
      "Tax Collector Name": row.tcsName,
      "Activation Date": row.activateDate,
      "Available Balance (₹)": row.availableBalance,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Balance");

    const buffer = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `TaxCollector_Balance_${lgdCode}.xlsx`
    );
  };

  // ============================
  // Render
  // ============================

  return (
    <>
      <ToastContainer />

      <div className="bg-white rounded-lg p-2 flex flex-col flex-grow">
        <legend className="text-lg font-semibold text-cyan-700 py-4">
          Tax Collector Available Balance
        </legend>

        {/* If lgdCode missing */}
        {!lgdCode && (
          <div className="p-3 text-sm text-red-600">
            LGD Code not found in localStorage.  
            API call skipped.
          </div>
        )}

        {/* Controls */}
        {lgdCode && (
          <div className="flex justify-between items-center mb-2">
            <div>
              <span className="text-xs">Rows:</span>
              <select
                className="border px-2 py-1 ml-2 text-sm"
                value={items}
                onChange={(e) => setItems(e.target.value)}
              >
                {ListOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                className="border px-2 py-1 text-sm"
                placeholder="Search..."
                value={filtering}
                onChange={(e) => setFiltering(e.target.value)}
              />

              <button
                onClick={handleDownloadExcel}
                className="bg-green-600 text-white px-3 py-1 rounded text-xs"
              >
                Download Excel
              </button>
            </div>
          </div>
        )}

        {/* API States */}
        {isLoading && <div className="p-4 text-sm">Loading...</div>}

        {isError && (
          <div className="p-4 text-red-600 text-sm">
            API Error — {error?.message}
          </div>
        )}

        {!isLoading && lgdCode && !data.length && (
          <div className="p-4 text-sm text-gray-600">
            No records found for LGD Code: {lgdCode}
          </div>
        )}

        {/* Table */}
        {lgdCode && !isLoading && data.length > 0 && (
          <div>
            <Table>
              <Table.Head>
                {table.getHeaderGroups().map((hg) =>
                  hg.headers.map((header) => (
                    <Table.HeadCell
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="bg-cyan-500 text-white cursor-pointer text-xs"
                    >
                      <div className="flex justify-between">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <SortIcon sort={header.column.getIsSorted()} />
                      </div>
                    </Table.HeadCell>
                  ))
                )}
              </Table.Head>

              <Table.Body>
                {table.getRowModel().rows.map((row) => (
                  <Table.Row key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Table.Cell key={cell.id} className="text-xs">
                        {flexRender(
                          cell.column.columnDef.cell ??
                            ((ctx) => ctx.getValue()),
                          cell.getContext()
                        )}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            <Pagination data={data} table={table} />
          </div>
        )}
      </div>
    </>
  );
};

export default TaxCollectorAvailableBalance;