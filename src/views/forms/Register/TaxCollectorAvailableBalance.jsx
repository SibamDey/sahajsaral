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

// 🔽 Excel export imports
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const TaxCollectorAvailableBalance = () => {
  // Page size options
  const ListOptions = [10, 20, 50, "all"];
  const [items, setItems] = useState(ListOptions[0]);

  // Success modal (you can change the text / usage as needed)
  const [openModal, setOpenModal] = useState(false);

  // Get lgdCode from localStorage (fallback to 107946 for testing)
  const jsonString = localStorage.getItem("SAHAJ_SARAL_USER");
  const userData = jsonString ? JSON.parse(jsonString) : null;
  const lgdCode = userData?.CORE_LGD ;

  // ============================
  // React Query – API call
  // ============================
  const {
    data: apiData = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["TaxCollectorAvailableBalance", lgdCode],
    enabled: !!lgdCode, // don't call if lgdCode missing
    queryFn: async () => {
      try {
        const res = await axios.get(
          "https://javaapi.wbpms.in/api/PtaxWallet/TaxCollcetorWiseAvlBalance",
          {
            params: { lgdCode },
            // If API needs auth, uncomment & fill:
            // headers: {
            //   Authorization: `Bearer ${token}`,
            //   "deadlock-header": "xyz",
            // },
          }
        );

        console.log("API response:", res.data);

        // Your API already returns the array directly:
        // [ { tcsId, tcsName, activateDate, availableBalance } ]
        if (Array.isArray(res.data)) return res.data;

        // Fallbacks if the backend later wraps it inside result/message
        if (Array.isArray(res.data?.result)) return res.data.result;
        if (Array.isArray(res.data?.message)) return res.data.message;

        return [];
      } catch (err) {
        console.error("API error:", err);
        toast.error(
          err?.response
            ? `Error ${err.response.status}: ${err.response.statusText}`
            : "Network / CORS error when calling TaxCollcetorWiseAvlBalance"
        );
        throw err;
      }
    },
  });

  // ============================
  // Table data & columns
  // ============================

  const data = useMemo(() => {
    const list = [...apiData];
    // Example: sort by tcsName alphabetically (optional)
    // list.sort((a, b) => a.tcsName.localeCompare(b.tcsName));
    return list;
  }, [apiData]);

  const columns = useMemo(
    () => [
      {
        header: "Tax Collector ID",
        accessorKey: "tcsId",
        headclass: "cursor-pointer",
      },
      {
        header: "Tax Collector Name",
        accessorKey: "tcsName",
        headclass: "cursor-pointer",
      },
      {
        header: "Activation Date",
        accessorKey: "activateDate",
        headclass: "cursor-pointer",
      },
      {
        header: "Available Balance (₹)",
        accessorKey: "availableBalance",
        headclass: "cursor-pointer",
        cell: (info) => {
          const raw = info.getValue();
          const num = Number(raw);
          if (Number.isNaN(num)) return raw ?? "";
          return num.toLocaleString("en-IN", {
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
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
    },
    initialState: {
      pagination: {
        pageSize: parseInt(items),
      },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  // Update page size when dropdown changes
  useEffect(() => {
    if (items === "all") table.setPageSize(9999);
    else table.setPageSize(parseInt(items));
  }, [items, table]);

  // ============================
  // Excel Download Handler
  // ============================

  const handleDownloadExcel = () => {
    if (!data || data.length === 0) {
      toast.warn("No data available to download");
      return;
    }

    // Shape data for Excel (with pretty column names)
    const exportData = data.map((row) => ({
      "Tax Collector ID": row.tcsId,
      "Tax Collector Name": row.tcsName,
      "Activation Date": row.activateDate,
      "Available Balance (₹)": row.availableBalance,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "TaxCollectorBalance"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName = `TaxCollector_Balance_${lgdCode}.xlsx`;
    saveAs(blob, fileName);
  };

  // ============================
  // Render
  // ============================

  return (
    <>
      <SuccessModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        message={"Contractor Created Successfully"}
        to="contractor-master"
        isSuccess={true}
      />
      <ToastContainer />

      <div
        className="bg-white rounded-lg p-2 flex flex-col flex-grow"
        style={{ marginTop: "-50px" }}
      >
        <legend className="text-lg font-semibold text-cyan-700 py-4">
          Tax Collector Available Balance
        </legend>

        {/* Controls row: page size + search + Excel download */}
        <div className="flex flex-wrap gap-2 justify-between items-center h-auto mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Rows per page:</span>
            <select
              className="rounded-lg border border-zinc-400 px-2 py-1 text-sm"
              value={items}
              onChange={(e) => setItems(e.target.value)}
            >
              {ListOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={filtering}
              placeholder="Search..."
              className="border-2 rounded-lg border-zinc-400 px-2 py-1 text-sm"
              onChange={(e) => setFiltering(e.target.value)}
            />

            <button
              type="button"
              onClick={handleDownloadExcel}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 py-2 rounded-lg"
            >
              Download Excel
            </button>
          </div>
        </div>

        {/* Loading / Error / Empty states */}
        {isLoading && (
          <div className="p-4 text-sm text-gray-600">Loading data...</div>
        )}

        {isError && (
          <div className="p-4 text-sm text-red-600">
            Failed to load data. Check console / Network tab for details.
            <br />
            {error?.response && (
              <>
                Status: {error.response.status} –{" "}
                {error.response.statusText || "Error"}
              </>
            )}
          </div>
        )}

        {!isLoading && !isError && data.length === 0 && (
          <div className="p-4 text-sm text-gray-600">
            No records found for LGD Code: {lgdCode}
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && data.length > 0 && (
          <div className="px-2 flex flex-col">
            <Table style={{ border: "1px solid #444" }}>
              {/* Header */}
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Head key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.HeadCell
                      key={header.id}
                      className="p-2 bg-cyan-400/100 text-xs text-white font-semibold"
                      style={{ border: "1px solid #444", cursor: "pointer" }}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center justify-between space-x-2">
                          <span className="normal-case">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                          <SortIcon sort={header.column.getIsSorted()} />
                        </div>
                      )}
                    </Table.HeadCell>
                  ))}
                </Table.Head>
              ))}

              {/* Body */}
              <Table.Body
                className="divide-y"
                style={{ border: "1px solid #444" }}
              >
                {table.getRowModel().rows.map((row) => (
                  <Table.Row key={row.id} style={{ border: "1px solid #444" }}>
                    {row.getVisibleCells().map((cell) => (
                      <Table.Cell
                        key={cell.id}
                        className="p-1 text-xs"
                        style={{ border: "1px solid #444" }}
                      >
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

            {/* Pagination component (your existing one) */}
            <Pagination data={data} table={table} />
          </div>
        )}
      </div>
    </>
  );
};

export default TaxCollectorAvailableBalance;