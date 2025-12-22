import React, { useEffect, useMemo, useState } from "react";
import {
  getAdvanceRegisterSummary,
  getAdvanceRegisterDetails,
} from "../../../Service/Document/DocumentService";
import LOGO from "../../../Img/logo.png";
import { getLgdDetails } from "../../../Service/LgdCodeGet/LgdCodeService";


export default function AdvanceRegister() {
  const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
  const userData = jsonString ? JSON.parse(jsonString) : null;
  const [lgd, setLgd] = useState([]);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Modal states
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [detailRows, setDetailRows] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, r) => {
        acc.advance += Number(r.advanceAmount || 0);
        acc.bill += Number(r.billAmount || 0);
        acc.cash += Number(r.cashAmount || 0);
        acc.balance += Number(r.advanceBalance || 0);
        return acc;
      },
      { advance: 0, bill: 0, cash: 0, balance: 0 }
    );
  }, [rows]);

  const loadData = async () => {
    if (!userData?.DIST_LGD) return;

    setLoading(true);
    setError("");

    try {
      const res = await getAdvanceRegisterSummary(userData?.DIST_LGD);

      if (res?.data && Array.isArray(res.data)) {
        setRows(res.data);
      } else {
        setRows([]);
        setError("Invalid response format");
      }
    } catch (err) {
      console.error("Advance Register API Error:", err);
      setRows([]);
      setError("Failed to fetch advance register summary");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    getLgdDetails(userData?.CORE_LGD).then((response) => {
      if (response.status === 200) {
        setLgd(response.data);
      } else {

      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Details fetch
  const loadDetails = async (voucherId) => {
    if (!userData?.DIST_LGD || !voucherId) return;

    setDetailLoading(true);
    setDetailError("");
    setDetailRows([]);

    try {
      const res = await getAdvanceRegisterDetails(userData?.DIST_LGD, voucherId);

      if (res?.data && Array.isArray(res.data)) {
        setDetailRows(res.data);
      } else {
        setDetailRows([]);
        setDetailError("Invalid details response format");
      }
    } catch (err) {
      console.error("Advance Register Details API Error:", err);
      setDetailRows([]);
      setDetailError("Failed to fetch advance register details");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleAction = (row) => {
    setSelectedRow(row);
    setOpen(true);
    loadDetails(row?.voucherId);
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedRow(null);
    setDetailRows([]);
    setDetailError("");
  };


  const totalAdjustAmount = detailRows.reduce(
    (sum, r) => sum + Number(r.advanceAmount || 0),
    0
  );

  const totalNetAmount = detailRows.reduce(
    (sum, r) => sum + Number(r.voucherNetAmount || 0),
    0
  );


  const handlePrint = () => {
    if (!selectedRow) return;

    const printWindow = window.open("", "_blank", "width=1000,height=800");

    const html = `
  <html>
    <head>
      <title>Advance Register</title>
<style>
  body {
    font-family: Arial, sans-serif;
    font-size: 10px;          /* ↓ overall text */
    margin: 20px;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }

  .logo {
    width: 60px;              /* ↓ logo size */
    height: auto;
  }

  .title {
    flex: 1;
    text-align: center;
  }

  .title h2 {
    font-size: 14px;          /* GP / LSG Name */
    margin: 0;
  }

  .title h3 {
    font-size: 12px;          /* ADVANCE REGISTER */
    margin: 0;
  }

  .meta {
    margin: 6px 0;
    font-size: 10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 6px;
    font-size: 9.5px;         /* ↓ table text */
  }

  th, td {
    border: 1px solid #000;
    padding: 4px;             /* ↓ row height */
    text-align: center;
  }

  th {
    background: #e6f6f8;
    font-weight: bold;
    font-size: 9.5px;
  }

  .footer {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    font-size: 10px;
  }

  @media print {
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  }
</style>

    </head>

    <body>
      <div class="header">
        <img id="printLogo" src="${LOGO}" class="logo" alt="Logo" />
        <div class="title">
        <h2>${lgd[0]?.lsgName || "-"}</h2>
          <h3>ADVANCE REGISTER</h3>
        </div>
      </div>

      <div class="meta">
      <b>Period:</b> 01/04/2025 
      <b>to </b> ${new Date().toLocaleDateString("en-GB")}
      </div>


      <table>
        <thead>
          <tr>
          <th>Party</th>
          <th>Voucher ID</th>
          <th>Voucher Date</th>
          <th>GL Group</th>
          <th>Adjust Voucher</th>
          <th>Adjust Date</th>
          <th>Adjust Type</th>
          <th>Adjust Amount</th>
          <th>Net Amount</th> 
          </tr>
        </thead>
        <tbody>
          ${(detailRows?.length || 0) === 0
        ? `<tr><td colspan="6">No details found</td></tr>`
        : detailRows
          .map(
            (d) => `
                    <tr>
                    <td>${d.partyName || "-"}</td>
                    <td>${d.voucherId || "-"}</td>
                    <td>${d.voucherDate || "-"}</td>
                    <td>${d.glGroupName || "-"}</td>
                      <td>${d.adjustVoucherId || "-"}</td>
                      <td>${d.adjustVoucherDate || "-"}</td>
                      <td>${d.adjustType || "-"}</td>
                      <td style="text-align:right;">${d.advanceAmount || "-"}</td>
                      <td style="text-align:right;">${d.voucherNetAmount || "-"}</td>
                    </tr>
                  `
          )
          .join("")}
          <tr style="font-weight:bold;background:#f0f0f0;">
          <td colspan="7" style="text-align:right;">GRAND TOTAL</td>
          <td style="text-align:right;">
            ${totalAdjustAmount.toFixed(2)}
          </td>
          <td style="text-align:right;">
            ${totalNetAmount.toFixed(2)}
          </td>
        </tr>
      
        </tbody>
      </table>



      <script>
        (function(){
          const img = document.getElementById('printLogo');

          function doPrint(){
            setTimeout(() => {
              window.print();
              window.close();
            }, 150);
          }

          // If image loads late, wait; if already cached, print soon.
          if (img && !img.complete) {
            img.onload = doPrint;
            img.onerror = doPrint; // even if logo fails, still print
          } else {
            doPrint();
          }
        })();
      </script>
    </body>
  </html>
  `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };




  return (
    <div className="p-1 bg-white min-h-screen">
      <h3 className="text-lg font-semibold mb-1">Advance Register Summary</h3>

      {error && (
        <div className="mb-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-cyan-400 text-black text-sm font-bold">
              <th className="border border-gray-300 px-3 py-2 text-center">Voucher ID</th>
              <th className="border border-gray-300 px-3 py-2 text-center">Date</th>
              <th className="border border-gray-300 px-3 py-2 text-center">GL Group</th>
              <th className="border border-gray-300 px-3 py-2 text-center">Party</th>
              <th className="border border-gray-300 px-3 py-2 text-center">Advance</th>
              <th className="border border-gray-300 px-3 py-2 text-center">Bill</th>
              <th className="border border-gray-300 px-3 py-2 text-center">Cash</th>
              <th className="border border-gray-300 px-3 py-2 text-center">Balance</th>
              <th className="border border-gray-300 px-3 py-2 text-center w-24">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-500">
                  No data
                </td>
              </tr>
            ) : (
              <>
                {rows.map((r, i) => (
                  <tr key={i} className="text-sm">
                    <td className="border border-gray-300 px-3 py-2 text-center font-medium">
                      {r.voucherId}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {r.voucherDate}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {r.glGroupName}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {r.partyName}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {r.advanceAmount}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {r.billAmount}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {r.cashAmount}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      {r.advanceBalance}
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <button
                        onClick={() => handleAction(r)}
                        title="View"
                        className="w-10 h-8 rounded-md bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow mx-auto"
                      >
                        👁
                      </button>
                    </td>
                  </tr>
                ))}

                {/* TOTAL ROW */}
                <tr className="bg-gray-100 font-bold text-sm">
                  <td colSpan={4} className="border border-gray-300 px-3 py-1 text-right">
                    TOTAL
                  </td>
                  <td className="border border-gray-300 px-3 py-1 text-center">
                    {totals.advance.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-3 py-1 text-center">
                    {totals.bill.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-3 py-1 text-center">
                    {totals.cash.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-3 py-1 text-center">
                    {totals.balance.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-3 py-1 text-center">—</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
          />

          {/* modal box */}
          <div className="relative bg-white w-[95%] max-w-5xl rounded-lg shadow-lg border border-gray-200">
            {/* header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div>
                <div className="text-base font-semibold">Advance Register Details</div>
                <div className="text-xs text-gray-600">
                  Voucher Id:{" "}
                  <b>{selectedRow?.voucherId}</b>
                </div>
              </div>
              {/* <button
                onClick={closeModal}
                className="px-3 py-1 rounded bg-red-500 hover:bg-red-400 text-sm"
              >
                Close
              </button> */}
            </div>

            {/* body */}
            <div className="p-4">
              {detailError && (
                <div className="mb-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                  {detailError}
                </div>
              )}

              {detailLoading ? (
                <div className="text-center py-6 text-gray-500">Loading details...</div>
              ) : detailRows.length === 0 ? (
                <div className="text-center py-6 text-gray-500">No details found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300 text-xs">
                    <thead className="text-xs">
                      <tr className="bg-cyan-400 text-black text-sm font-bold">
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs">Party</th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs">Voucher ID</th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs">Voucher Date</th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs">GL Group</th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs">Adjust Voucher</th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs">Adjust Date</th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs">Adjust Type</th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs">Adjust Amount</th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-xs">Net Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailRows.map((d, idx) => (
                        <tr key={idx} className="text-xs">
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            {d.partyName || "-"}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            {d.voucherId || "-"}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center font-medium">
                            {d.voucherDate || "-"}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            {d.glGroupName || "-"}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center font-medium">
                            {d.adjustVoucherId || "-"}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            {d.adjustVoucherDate || "-"}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            {d.adjustType || "-"}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            {d.advanceAmount || "-"}
                          </td>
                          <td className="border border-gray-300 px-3 py-2 text-center">
                            {d.voucherNetAmount || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* footer */}
            <div className="px-4 py-3 border-t flex justify-end gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
              >
                🖨 Print
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-1.5 rounded bg-red-500 hover:bg-red-400 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
