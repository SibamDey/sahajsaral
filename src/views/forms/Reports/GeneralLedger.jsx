import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LOGO from "../../../Img/logo.png";
import { getLgdDetails } from "../../../Service/LgdCodeGet/LgdCodeService";
import { getAllGlGroupList } from "../../../Service/Transaction/TransactionService";

const GeneralLedger = () => {
    const getCurrentDate = () => new Date().toISOString().split("T")[0];

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState(getCurrentDate());
    const [glGroup, setGlGroup] = useState("");
    const [lgd, setLgd] = useState([]);

    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = jsonString ? JSON.parse(jsonString) : null;

    const [partyTypeAllList, setPartyTypeAllList] = useState([]);
    const [loading, setLoading] = useState(false);

    // API response
    const [ledgerMsg, setLedgerMsg] = useState("");
    const [ledgerRows, setLedgerRows] = useState([]);

    const printRef = useRef(null);

    // ---- Helpers ----
    const safeText = (v) => (v === null || v === undefined ? "" : String(v).trim());
    const safeNum = (v) => {
        const n = parseFloat(String(v || "0").replace(/,/g, ""));
        return Number.isFinite(n) ? n : 0;
    };
    const formatMoney = (v) => {
        const n = safeNum(v);
        return n === 0 && !String(v || "").trim() ? "" : n.toFixed(2);
    };

    const onGlGroup = (e) => setGlGroup(e.target.value);

    const onFromDate = (e) => {
        const selectedDate = e.target.value;
        setFromDate(selectedDate);
    };

    // ---- Fetch GL Group list ----
    useEffect(() => {
        if (!userData?.CORE_LGD) return;

        getAllGlGroupList(userData?.CORE_LGD, 0).then((result) => {
            const response = result?.data || [];
            setPartyTypeAllList(response);
        });

        getLgdDetails(userData?.CORE_LGD).then((response) => {
            if (response.status === 200) {
                setLgd(response.data);
            } else {

            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ---- NEW API CALL ----
    const onSearch = async () => {
        if (!glGroup) return toast.error("Please select a GL Group");
        if (!fromDate) return toast.error("Please select a From Date");
        if (!toDate) return toast.error("Please select a To Date");
        if (!userData?.CORE_LGD) return toast.error("LGD not found in session");

        try {
            setLoading(true);
            setLedgerMsg("");
            setLedgerRows([]);

            const url =
                `https://javaapi.wbpms.in/api/GeneralLedger/Get` +
                `?lgdCode=${encodeURIComponent(userData.CORE_LGD)}` +
                `&glGroup=${encodeURIComponent(glGroup)}` +
                `&frmDate=${encodeURIComponent(fromDate)}` +
                `&toDate=${encodeURIComponent(toDate)}`;

            const res = await fetch(url, { method: "GET" });
            const data = await res.json();

            // expected: { statusCode, message, genLedger: [] }
            if (!res.ok) {
                toast.error("Failed to fetch data");
                return;
            }

            if (data?.statusCode !== 0) {
                toast.error(data?.message || "No data found");
                setLedgerMsg(data?.message || "");
                setLedgerRows([]);
                return;
            }

            setLedgerMsg(data?.message || "");
            setLedgerRows(Array.isArray(data?.genLedger) ? data.genLedger : []);
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong while fetching ledger");
        } finally {
            setLoading(false);
        }
    };

    const glGroupName =
        partyTypeAllList?.find((x) => String(x?.groupId) === String(glGroup))?.groupName || "-";


    // ---- PRINT (only report area) ----
    const onPrint = async () => {
        if (!printRef.current) return;

        const printContents = printRef.current.innerHTML;

        // Safe LGD Name
        const lgdName = lgd?.[0]?.lsgName || "-";

        // Convert logo to base64 so it always prints
        const toBase64 = async (url) => {
            const res = await fetch(url);
            const blob = await res.blob();
            return await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result); // data:image/png;base64,...
                reader.readAsDataURL(blob);
            });
        };

        let logoBase64 = "";
        try {
            logoBase64 = await toBase64(LOGO);
        } catch (e) {
            console.warn("Logo base64 failed, fallback to normal URL", e);
            logoBase64 = LOGO; // fallback
        }

        const win = window.open("", "", "height=800,width=1100");
        if (!win) return toast.error("Popup blocked! Please allow popups for print.");

        win.document.open();
        win.document.write(`
    <html>
      <head>
        <title>General Ledger</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 16px; color:#000; }

          /* ===== HEADER STYLES ===== */
          .print-header{
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:12px;
            margin-bottom:10px;
          }
          .print-logo{ width:120px; }
          .print-logo img{ height:70px; width:auto; object-fit:contain; display:block; }

          .print-title{
            flex:1;
            text-align:center;
          }
          .print-title h2{
            margin:0;
            font-size:18px;
            font-weight:700;
            line-height:1.2;
          }
          .print-title h3{
            margin:4px 0 0;
            font-size:14px;
            font-weight:600;
            letter-spacing:0.5px;
            text-transform:uppercase;
          }

          .divider{
            border-top:2px solid #000;
            margin:10px 0 14px;
          }
            .print-meta{
  margin-top: 6px;
  font-size: 12px;
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}
.print-meta span{
  padding: 2px 8px;
  border: 1px solid #000;
  border-radius: 6px;
  background: #fff;
}


          /* ===== TABLE ===== */
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #333; padding: 6px; vertical-align: top; }
          th { background: #f3f3f3; text-align: left; }
          .right { text-align: right; }
          .center { text-align: center; }

          @media print {
            button { display:none !important; }
            @page { size: landscape; margin: 10mm; } /* optional: landscape for wide table */
          }
        </style>
      </head>
      <body>
        <div class="print-header">
          <div class="print-logo">
            <img id="printLogo" src="${logoBase64}" alt="Logo" />
          </div>

      <div class="print-title">
            <h2>${lgdName}</h2>
            <h3>General Ledger</h3>

        <div class="print-meta">
            <span><b>From:</b> ${fromDate || "-"}</span>
            <span><b>To:</b> ${toDate || "-"}</span>
            <span><b>GL Group:</b> ${glGroupName}</span>
        </div>
        </div>


          <div style="width:120px;"></div>
        </div>

        <div class="divider"></div>

        ${printContents}

        <script>
          // Wait for logo to load before printing (very important)
          (function(){
            const img = document.getElementById('printLogo');
            if (!img) { window.print(); window.close(); return; }

            const doPrint = () => {
              setTimeout(() => { window.print(); window.close(); }, 300);
            };

            if (img.complete) doPrint();
            else {
              img.onload = doPrint;
              img.onerror = doPrint;
            }
          })();
        </script>
      </body>
    </html>
  `);
        win.document.close();
    };


    // Totals (optional)
    const totalPayment = ledgerRows.reduce((s, r) => s + safeNum(r.paymentAmount), 0);
    const totalReceipt = ledgerRows.reduce((s, r) => s + safeNum(r.receiptAmount), 0);

    return (
        <>
            <ToastContainer />
            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">General Ledger</legend>

                {/* Filters */}
                <div className="flex flex-col space-y-2 py-3">
                    <div className="flex items-center space-x-4">
                        <div className="w-1/3">
                            <label className="block text-sm font-medium text-gray-700">GL Group<span className="text-red-500"> * </span></label>
                            <select
                                className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
                                onChange={onGlGroup}
                                value={glGroup}
                            >
                                <option value="">--Select GL Group--</option>
                                {partyTypeAllList?.map((item, index) => (
                                    <option key={index} value={item?.groupId}>
                                        {item?.groupName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-1/5 px-2">
                            <label className="block text-sm font-medium text-gray-700">
                                From Date<span className="text-red-500"> * </span>
                            </label>
                            <input
                                type="date"
                                className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
                                value={fromDate}
                                onChange={onFromDate}
                            />
                        </div>

                        <div className="w-1/5 px-2">
                            <label className="block text-sm font-medium text-gray-700">
                                To Date<span className="text-red-500"> * </span>
                            </label>
                            <input
                                type="date"
                                className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>

                        <div className="w-1/8">
                            <button
                                type="button"
                                className="btn-submit h-9 px-2 mt-5 shadow-sm text-white hover:bg-cyan-700 focus:outline-none"
                                onClick={onSearch}
                                disabled={loading}
                            >
                                {loading ? "Loading..." : "Search"}
                            </button>
                        </div>

                        <div className="w-1/6">
                            <button
                                type="button"
                                className="h-9 px-3 mt-5 shadow-sm rounded bg-gray-800 text-white hover:bg-green-700 disabled:opacity-50"
                                onClick={onPrint}
                                disabled={ledgerRows.length === 0}
                            >
                                Print
                            </button>
                        </div>
                    </div>
                </div>

                {/* Report Area (PRINT THIS) */}
                <div ref={printRef}>


                    {/* Table */}
                    {ledgerRows && ledgerRows.length > 0 && (
                        <div className="border rounded-lg shadow-sm bg-white">
                            {/* Scroll container (controls both X and Y scroll) */}
                            <div className="max-h-[70vh] overflow-auto">
                                <table className="min-w-[1400px] w-full text-sm border-separate border-spacing-0">
                                    {/* Sticky Header */}
                                    <thead className="sticky top-0 z-20 bg-blue-300">
                                        <tr className="text-slate-700">
                                            <th className="sticky left-0 z-30 bg-blue-300 px-3 py-2 border-b border-slate-200 text-left whitespace-nowrap">
                                                SL
                                            </th>

                                            <th className="px-3 py-2 border-b border-slate-200 text-left whitespace-nowrap">Payment Date</th>
                                            <th className="px-3 py-2 border-b border-slate-200 text-left whitespace-nowrap">Payment Voucher ID</th>
                                            <th className="px-3 py-2 border-b border-slate-200 text-left whitespace-nowrap">Payment Voucher No</th>
                                            <th className="px-3 py-2 border-b border-slate-200 text-left">Payment Particulars</th>
                                            <th className="px-3 py-2 border-b border-slate-200 text-right whitespace-nowrap">Payment Amount</th>
                                            <th className="px-3 py-2 border-b border-slate-200 text-right whitespace-nowrap">
                                                Payment Cumulative Amount
                                            </th>

                                            <th className="px-3 py-2 border-b border-slate-200 text-left whitespace-nowrap">Receipt Date</th>
                                            <th className="px-3 py-2 border-b border-slate-200 text-left whitespace-nowrap">Receipt Voucher ID</th>
                                            <th className="px-3 py-2 border-b border-slate-200 text-left whitespace-nowrap">Receipt Voucher No</th>
                                            <th className="px-3 py-2 border-b border-slate-200 text-left">Receipt Particulars</th>
                                            <th className="px-3 py-2 border-b border-slate-200 text-right whitespace-nowrap">Receipt Amount</th>
                                            <th className="px-3 py-2 border-b border-slate-200 text-right whitespace-nowrap">
                                                Receipt Cumulative Amount
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="text-slate-800">
                                        {ledgerRows.length === 0 ? (
                                            <tr>
                                                <td className="px-3 py-6 text-center text-slate-500" colSpan={13}>
                                                    No data
                                                </td>
                                            </tr>
                                        ) : (
                                            ledgerRows.map((r, idx) => (
                                                <tr
                                                    key={idx}
                                                    className={`border-b border-slate-100 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                                                        } hover:bg-cyan-50 transition text-xs`}
                                                >
                                                    {/* Sticky first column */}
                                                    <td className="sticky left-0 z-10 px-3 py-2 border-b border-slate-100 bg-inherit font-medium whitespace-nowrap">
                                                        {idx + 1}
                                                    </td>

                                                    <td className="px-3 py-2 border-b border-slate-100 whitespace-nowrap">
                                                        {safeText(r.paymentVoucherDate)}
                                                    </td>
                                                    <td className="px-3 py-2 border-b border-slate-100 whitespace-nowrap">
                                                        {safeText(r.paymentVoucherId)}
                                                    </td>
                                                    <td className="px-3 py-2 border-b border-slate-100 whitespace-nowrap">
                                                        {safeText(r.paymentVoucherNo)}
                                                    </td>
                                                    <td className="px-3 py-2 border-b border-slate-100 min-w-[360px] whitespace-normal">
                                                        {safeText(r.paymentParticulars)}
                                                    </td>
                                                    <td className="px-3 py-2 border-b border-slate-100 text-right whitespace-nowrap">
                                                        {formatMoney(r.paymentAmount)}
                                                    </td>
                                                    <td className="px-3 py-2 border-b border-slate-100 text-right whitespace-nowrap">
                                                        {formatMoney(r.paymentCumulitiveAmount)}
                                                    </td>

                                                    <td className="px-3 py-2 border-b border-slate-100 whitespace-nowrap">
                                                        {safeText(r.receiptVoucherDate)}
                                                    </td>
                                                    <td className="px-3 py-2 border-b border-slate-100 whitespace-nowrap">
                                                        {safeText(r.receiptVoucherId)}
                                                    </td>
                                                    <td className="px-3 py-2 border-b border-slate-100 whitespace-nowrap">
                                                        {safeText(r.receiptVoucherNo)}
                                                    </td>
                                                    <td className="px-3 py-2 border-b border-slate-100 min-w-[360px] whitespace-normal">
                                                        {safeText(r.receiptParticulars)}
                                                    </td>
                                                    <td className="px-3 py-2 border-b border-slate-100 text-right whitespace-nowrap">
                                                        {formatMoney(r.receiptAmount)}
                                                    </td>
                                                    <td className="px-3 py-2 border-b border-slate-100 text-right whitespace-nowrap">
                                                        {formatMoney(r.receiptCumulitiveAmount)}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>

                                    {/* Sticky Total Row */}
                                    {ledgerRows.length > 0 && (
                                        <tfoot className="sticky bottom-0 z-20 bg-blue-200">
                                            <tr className="text-slate-800">
                                                <td className="sticky left-0 z-30 bg-blue-200 px-3 py-2 border-t border-slate-300 font-semibold whitespace-nowrap">
                                                    Total
                                                </td>

                                                <td className="px-3 py-2 border-t border-blue-300" colSpan={4}></td>

                                                <td className="px-3 py-2 border-t border-blue-300 text-right font-semibold whitespace-nowrap">
                                                    {totalPayment.toFixed(2)}
                                                </td>

                                                <td className="px-3 py-2 border-t border-slate-300"></td>

                                                <td className="px-3 py-2 border-t border-slate-300" colSpan={4}></td>

                                                <td className="px-3 py-2 border-t border-slate-300 text-right font-semibold whitespace-nowrap">
                                                    {totalReceipt.toFixed(2)}
                                                </td>

                                                <td className="px-3 py-2 border-t border-slate-300"></td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </table>
                            </div>

                            {/* Optional footer hint */}

                        </div>)}

                </div>
            </div>
        </>
    );
};

export default GeneralLedger;
