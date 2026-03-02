import { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { getRealAccList } from "../../../Service/Transaction/TransactionService";
import { ToastContainer, toast } from "react-toastify";

const BankTryReconciliation = () => {
  const [accountCode, setAccountCode] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [data, setData] = useState(null);
  const [realAccList, setRealAccList] = useState();

  const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
  const userData = JSON.parse(jsonString);

  const onSearch = async () => {
    if (!accountCode) {
      toast.error("Please Select a Account Code");
      return;
    }
    if (!fromDate) {
      toast.error("Please Select a From Date");
      return;
    }
    if (!toDate) {
      toast.error("Please Select a To Date");
      return;
    }

    try {
      const response = await axios.get(
        "https://javaapi.wbpms.in/api/Reconciliation/FinalReconciliation",
        {
          params: {
            lgdCode: userData?.CORE_LGD,
            accountCode,
            frmDate: fromDate,
            toDate,
          },
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Failed to fetch data");
    }
  };

  useEffect(() => {
    getRealAccList(
      userData?.USER_LEVEL === "DIST"
        ? userData?.DIST_LGD
        : userData?.USER_LEVEL === "BLOCK"
        ? userData?.BLOCK_LGD
        : userData?.USER_LEVEL === "GP"
        ? userData?.GP_LGD
        : 0
    ).then((result) => {
      setRealAccList(result?.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔹 Helper to compute "CLOSING BALANCE AS PER PASSBOOK"
  // Formula: slNo 1 amount + 2 amount + 4 amount - 3 amount
  const getClosingBalanceFromPartInfo = () => {
    if (!data?.partInfo || !data.partInfo.length) return null;

    const getAmountBySlNo = (slNo) => {
      const item = data.partInfo.find(
        (row) => Number(row.slNo) === Number(slNo)
      );
      return item ? Number(item.particularsAmount) || 0 : 0;
    };

    const amt1 = getAmountBySlNo(1);
    const amt2 = getAmountBySlNo(2);
    const amt3 = getAmountBySlNo(3);
    const amt4 = getAmountBySlNo(4);

    return amt1 + amt2 + amt4 - amt3;
  };

  // 🔹 Ensure sheet name is valid for Excel (max 31 chars)
  const safeSheetName = (name) =>
    name && name.length > 31 ? name.substring(0, 31) : name || "Sheet";

  // 🔹 Build sheet with header rows + right-aligned amount column
  const buildSheetWithHeader = (headers, rows, amountColIndex) => {
    const accDesc = data?.acInfo?.accountDesc || "";
    const accCode = accountCode || "";

    const wsData = [];

    // Header rows
    wsData.push([`Account: ${accDesc} (${accCode})`]);
    wsData.push([`Period: ${fromDate} to ${toDate}`]);
    wsData.push([]); // blank row
    wsData.push(headers);

    // Data rows
    rows.forEach((r) => wsData.push(r));

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Optional: basic column widths
    ws["!cols"] = headers.map(() => ({ wch: 20 }));

    // Right-align amount column (if provided)
    if (typeof amountColIndex === "number") {
      // Data starts from row index 4 (0-based):
      // 0: Account
      // 1: Period
      // 2: blank
      // 3: header
      // 4+: data
      for (let r = 4; r < wsData.length; r++) {
        const addr = XLSX.utils.encode_cell({ r, c: amountColIndex });
        const cell = ws[addr];
        if (cell) {
          if (!cell.s) cell.s = {};
          if (!cell.s.alignment) cell.s.alignment = {};
          cell.s.alignment.horizontal = "right";
        }
      }
    }

    return ws;
  };

  // 🔹 Excel export with header rows + right-aligned amount columns
  const downloadExcel = () => {
    if (!data) {
      toast.error("No data to export");
      return;
    }

    const wb = XLSX.utils.book_new();

    // Sheet 1: Particulars Info (+ Closing balance row)
    if (data.partInfo && data.partInfo.length > 0) {
      const closingBalance = getClosingBalanceFromPartInfo();

      const headersPart = ["Sl No", "Particulars", "Amount"];

      const partRows = data.partInfo.map((row) => [
        row.slNo,
        row.particulars,
        Number(row.particularsAmount) || 0,
      ]);

      if (closingBalance !== null) {
        partRows.push([
          "",
          "CLOSING BALANCE AS PER PASSBOOK",
          closingBalance,
        ]);
      }

      const wsPart = buildSheetWithHeader(headersPart, partRows, 2);
      XLSX.utils.book_append_sheet(
        wb,
        wsPart,
        safeSheetName("PARTICULARS INFO")
      );
    }

    // Sheet 2: CHEQUE ISSUED BUT NOT ENCASHED
    if (data.pmntInfo && data.pmntInfo.length > 0) {
      const headersPmnt = ["Date", "Voucher ID", "Amount", "Group Name"];

      const pmntRows = data.pmntInfo.map((p) => [
        p.paymentVoucherDate,
        p.paymentVoucherId,
        Number(p.paymentAmount) || 0,
        p.paymentGroupName,
      ]);

      const wsPmnt = buildSheetWithHeader(headersPmnt, pmntRows, 2);
      XLSX.utils.book_append_sheet(
        wb,
        wsPmnt,
        safeSheetName("CHEQUE ISSUED BUT NOT ENCASHED")
      );
    }

    // Sheet 3: RECEIPT ENTERED IN CASH BOOK BUT NOT IN PASS BOOK
    if (data.rcptInfo && data.rcptInfo.length > 0) {
      const headersRcpt = [
        "Date",
        "Voucher ID",
        "Amount",
        "Group Name",
      ];

      const rcptRows = data.rcptInfo.map((r) => [
        r.receiptVoucherDate,
        r.receiptVoucherId,
        Number(r.receiptAmount) || 0,
        r.receiptGroupName,
      ]);

      const wsRcpt = buildSheetWithHeader(headersRcpt, rcptRows, 2);
      XLSX.utils.book_append_sheet(
        wb,
        wsRcpt,
        safeSheetName(
          "RECEIPT ENTERED IN CASH BOOK BUT NOT IN PASS BOOK"
        )
      );
    }

    // Sheet 4: RECEIPT IN PASS BOOK BUT NOT ENTERED IN CASH BOOK
    if (data.trnInfo && data.trnInfo.length > 0) {
      const headersTrn = ["Date", "Voucher ID", "Amount", "Reference"];

      const trnRows = data.trnInfo.map((t) => [
        t.transacVoucherDate,
        t.transacVoucherId,
        Number(t.transacAmount) || 0,
        t.transacRef,
      ]);

      const wsTrn = buildSheetWithHeader(headersTrn, trnRows, 2);
      XLSX.utils.book_append_sheet(
        wb,
        wsTrn,
        safeSheetName(
          "RECEIPT IN PASS BOOK BUT NOT ENTERED IN CASH BOOK"
        )
      );
    }

    const fileName = `Reconciliation_${accountCode || "Account"}_${fromDate}_to_${toDate}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const renderTable = (title, headers, dataRows) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-blue-700 mb-2 text-center">
        {title}
      </h3>
      <table className="w-full border border-blue-200 rounded shadow-sm text-sm">
        <thead className="bg-blue-100 text-blue-900">
          <tr>
            {headers.map((h, idx) => (
              <th key={idx} className="border p-2 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, idx) => (
            <tr key={idx} className="hover:bg-blue-50">
              {row.map((cell, cidx) => (
                <td key={cidx} className="border p-2 text-left">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div
      className="bg-white rounded-lg p-2 flex flex-col flex-grow"
      style={{ marginTop: "-40px" }}
    >
      <ToastContainer />

      <legend className="text-lg font-semibold text-cyan-700 mb-2">
        Bank/Treasury Reconciliation
      </legend>

      {/* Filter Section */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex flex-col w-60">
          <label className="text-sm font-medium text-gray-700">
            Bank Account <span className="text-red-500">*</span>
          </label>
          <select
            className="text-sm border h-9 rounded-md p-1"
            onChange={(e) => setAccountCode(e.target.value)}
            value={accountCode}
          >
            <option value="" hidden>
              --Select Bank Account--
            </option>
            {realAccList?.map((d, idx) => (
              <option key={idx} value={d?.accountCode}>
                {d?.accountCodeDesc}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-48">
          <label className="text-sm font-medium text-gray-700">
            From Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            className="text-sm border h-9 rounded-md p-1"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col w-48">
          <label className="text-sm font-medium text-gray-700">
            To Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            className="text-sm border h-9 rounded-md p-1"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={onSearch}
            className="h-9 px-4 bg-cyan-600 text-white rounded hover:bg-cyan-700"
          >
            Search
          </button>
        </div>
      </div>

      {data?.acInfo && (
        <div className="mb-4 font-medium text-center text-gray-700">
          {data.acInfo.accountDesc} <br/>
          <span className="ml-2 text-sm text-gray-700">
            Period : {fromDate} to {toDate}
            </span>
        </div>
        
      )}

      {/* Particulars Info (with Closing balance row) */}
      {data?.partInfo && data.partInfo.length > 0 &&
        (() => {
          const closingBalance = getClosingBalanceFromPartInfo();

          const partRows = data.partInfo.map((row) => [
            row.slNo,
            row.particulars,
            Number(row.particularsAmount).toLocaleString(),
          ]);

          if (closingBalance !== null) {
            partRows.push([
              "",
              "CLOSING BALANCE AS PER PASSBOOK",
              closingBalance.toLocaleString(),
            ]);
          }

          return renderTable(
            "Particulars Info",
            ["Sl No", "Particulars", "Amount"],
            partRows
          );
        })()}

      {data?.pmntInfo && data.pmntInfo.length > 0 &&
        renderTable(
          "CHEQUE ISSUED BUT NOT ENCASHED",
          ["Date", "Voucher ID", "Amount", "Group Name"],
          data.pmntInfo.map((p) => [
            p.paymentVoucherDate,
            p.paymentVoucherId,
            Number(p.paymentAmount).toLocaleString(),
            p.paymentGroupName,
          ])
        )}

      {data?.rcptInfo && data.rcptInfo.length > 0 &&
        renderTable(
          "RECEIPT ENTERED IN CASH BOOK BUT NOT IN PASS BOOK",
          ["Date", "Voucher ID", "Amount", "Group Name"],
          data.rcptInfo.map((r) => [
            r.receiptVoucherDate,
            r.receiptVoucherId,
            Number(r.receiptAmount).toLocaleString(),
            r.receiptGroupName,
          ])
        )}

      {data?.trnInfo && data.trnInfo.length > 0 &&
        renderTable(
          "RECEIPT IN PASS BOOK BUT NOT ENTERED IN CASH BOOK",
          ["Date", "Voucher ID", "Amount", "Reference"],
          data.trnInfo.map((t) => [
            t.transacVoucherDate,
            t.transacVoucherId,
            Number(t.transacAmount).toLocaleString(),
            t.transacRef,
          ])
        )}

      {data && (
        <div className="text-center">
          <button
            onClick={downloadExcel}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Download Excel
          </button>
        </div>
      )}
    </div>
  );
};

export default BankTryReconciliation;