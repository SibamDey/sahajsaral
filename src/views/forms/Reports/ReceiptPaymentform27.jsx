import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LOGO from "../../../Img/logo.png";

import {
    getDistrictListforEvent,
    getBlockList,
    getGpList,
} from "../../../Service/Project/ActivityDetailsService";

import { getLgdDetails } from "../../../Service/LgdCodeGet/LgdCodeService";
import { getForm27Details } from "../../../Service/Reports/ReportsService";
import { getStatus } from "../../../Service/Reports/ReportsService";

const ReceiptPayment27 = () => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);

    const [districtList, setDistrictList] = useState([]);
    const [blockList, setBlockList] = useState([]);
    const [gpList, setGpList] = useState([]);

    const [district, setDistrict] = useState("");
    const [block, setBlock] = useState("");
    const [gp, setGp] = useState("");

    const [form27Data, setForm27Data] = useState([]);
    const [lgd, setLgd] = useState([]);

    const [statusData, setStatus] = useState();

    const printRef = useRef();

    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    console.log("User Data:", userData?.CORE_LGD);

    // useEffect(() => {
    //     getLgdDetails(userData?.CORE_LGD).then((res) => {
    //         if (res.status === 200) {
    //             setLgd(res.data);
    //         }
    //     });
    // }, []);

    useEffect(() => {
        const user = userData;

        getDistrictListforEvent(
            user?.USER_LEVEL !== "STATE" ? user?.DIST_LGD : 0
        ).then((res) => {
            setDistrictList(res.data);
            setDistrict(user?.DIST_LGD || "");
        });

        getBlockList(user?.DIST_LGD || 0, user?.BLOCK_LGD || 0).then((res) => {
            setBlockList(res.data);
            setBlock(user?.BLOCK_LGD || "");
        });

        getGpList(
            user?.DIST_LGD || 0,
            user?.BLOCK_LGD || 0,
            user?.GP_LGD || 0
        ).then((res) => {
            setGpList(res.data);
            setGp(user?.GP_LGD || "");
        });
    }, []);

    const onDistrict = (e) => {
        setDistrict(e.target.value);
        setBlock("");
        setGp("");

        getBlockList(e.target.value, 0).then((res) => {
            setBlockList(res.data);
        });
    };

    const onBlock = (e) => {
        setBlock(e.target.value);
        setGp("");

        getGpList(district, e.target.value, 0).then((res) => {
            setGpList(res.data);
        });
    };

    const onSearch = () => {
        if (!district) {
            toast.error("Please Select District");
            return;
        }

        if (!fromDate) {
            toast.error ("Please Choose From Date");
            return;
        }

        if (!toDate) {
            toast.error ("Please Choose To Date");
            return;
        }


        const normalizeLgd = (val) => {
            if (val === "" || val === null || val === undefined || val === "0" || val === 0) {
                return null;
            }
            return val;
        };

        const selectedLgd =
            normalizeLgd(gp) ||
            normalizeLgd(block) ||
            normalizeLgd(userData?.CORE_LGD);

        console.log("gp =", gp, typeof gp);
        console.log("block =", block, typeof block);
        console.log("CORE_LGD =", userData?.CORE_LGD, typeof userData?.CORE_LGD);
        console.log("selectedLgd =", selectedLgd, typeof selectedLgd);

        if (!selectedLgd) {
            toast.error("No valid LGD found");
            return;
        }

        getLgdDetails(selectedLgd).then((res) => {
            if (res.status === 200) {
                setLgd(res.data);
            }
        });

        getForm27Details(selectedLgd, fromDate, toDate)
            .then((res) => {
                setForm27Data(res.data);
                toast.success("Data Loaded Successfully");
            })
            .catch(() => toast.error("Error loading data"));

        getStatus(selectedLgd, fromDate, toDate)
            .then((response) => {
                if (response.status === 200) {
                    response?.data?.statusMsg === "Success"
                        ? toast.success("Data Fetched Successfully")
                        : toast.error(response?.data?.statusMsg);

                    setStatus(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            })
            .catch(() => toast.error("Error loading status"));
    };

    const handlePrint = () => {
        const printContent = printRef.current?.innerHTML;

        if (!printContent) {
            toast.error("Nothing to print");
            return;
        }

        const myWindow = window.open("", "prnt_area", "height=900,width=900");

        myWindow.document.write(`
        <html>
        <head>
            <title>Form 27 Details</title>
            <style>
                * {
                    box-sizing: border-box;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }

                body {
                    margin: 0;
                    padding: 10px;
                    font-family: "Times New Roman", serif;
                    color: #000;
                    background: #fff;
                    font-size: 11px;
                }

                p, h1, h2, h3, h4, h5, h6 {
                    margin: 0;
                    padding: 0;
                    line-height: 1.2;
                }

                .relative { position: relative !important; }
                .absolute { position: absolute !important; }
                .right-0 { right: 0 !important; }
                .left-0 { left: 0 !important; }
                .top-0 { top: 0 !important; }
                .bottom-0 { bottom: 0 !important; }

                .text-right { text-align: right !important; }
                .text-left { text-align: left !important; }
                .text-center { text-align: center !important; }

                .font-bold { font-weight: bold !important; }
                .font-semibold { font-weight: 600 !important; }
                .uppercase { text-transform: uppercase !important; }

                .border-b { border-bottom: 1px solid #000 !important; }
                .border { border: 1px solid #000 !important; }

                .pb-4 { padding-bottom: 12px !important; }
                .mb-4 { margin-bottom: 12px !important; }
                .mt-1 { margin-top: 4px !important; }
                .mt-6 { margin-top: 8px !important; }

                .p-2 { padding: 4px 3px !important; }
                .p-4 { padding: 8px !important; }

                .text-xl { font-size: 16px !important; }
                .text-lg { font-size: 14px !important; }
                .text-xs { font-size: 10px !important; }

                .text-cyan-700 { color: #000 !important; }
                .text-gray-600 { color: #000 !important; }
                .bg-gray-100 { background: #fff !important; }

                .w-20 { width: 70px !important; }
                .ml-auto { margin-left: auto !important; }

                img { display: block; }

                table {
                    width: 100% !important;
                    border-collapse: collapse !important;
                    table-layout: fixed !important;
                    margin-top: 6px !important;
                    font-size: 10px !important;
                }

                thead { display: table-header-group; }
                tfoot { display: table-footer-group; }

                th, td {
                    border: 1px solid #000 !important;
                    padding: 4px 3px !important;
                    vertical-align: middle !important;
                    word-break: break-word !important;
                    overflow-wrap: break-word !important;
                }

                th {
                    text-align: center !important;
                    font-weight: bold !important;
                    line-height: 1.15 !important;
                }

                td {
                    text-align: right !important;
                    line-height: 1.15 !important;
                }

                td.text-left { text-align: left !important; }

                tr { page-break-inside: avoid !important; }

                .print-wrap {
                    width: 94%;
                    margin: 0 auto;
                }

                /* ✅ LANDSCAPE FIX */
                @page {
                    size: A4 landscape;
                    margin: 10mm;
                }

                @media print {
                    body { padding: 0; }

                    .print-wrap {
                        width: 100%;
                        margin: 0;
                    }

                    table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                    }

                    thead { display: table-header-group; }
                    tfoot { display: table-footer-group; }

                    th, td {
                        border: 1px solid #000 !important;
                        padding: 4px 3px !important;
                    }

                    /* ✅ FORCE LANDSCAPE AGAIN (for Chrome reliability) */
                    @page {
                        size: A4 landscape;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-wrap">
                ${printContent}
            </div>
        </body>
        </html>
    `);

        myWindow.document.close();
        myWindow.focus();

        setTimeout(() => {
            myWindow.print();
            myWindow.close();
        }, 500);
    };

    return (
        <div className="p-2 bg-white rounded">
            <ToastContainer />

            <div className="bg-white rounded-2xl shadow-md border border-cyan-100 p-4">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h2 className="text-2xl font-bold text-cyan-800">Receipt-Payment Form-27 Details</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            District
                        </label>
                        <select
                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                            value={district}
                            onChange={onDistrict}
                        >
                            <option value="">Select District</option>
                            {districtList.map((d) => (
                                <option key={d.DistLgd} value={d.DistLgd}>
                                    {d.DistName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Block
                        </label>
                        <select
                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                            value={block}
                            onChange={onBlock}
                        >
                            <option value="">Select Block</option>
                            {blockList.map((b) => (
                                <option key={b.BlockLgd} value={b.BlockLgd}>
                                    {b.BlockName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            GP
                        </label>
                        <select
                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                            value={gp}
                            onChange={(e) => setGp(e.target.value)}
                        >
                            <option value="">Select GP</option>
                            {gpList.map((g) => (
                                <option key={g.GPLgd} value={g.GPLgd}>
                                    {g.GPName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            From Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            To Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
                    <div className="lg:col-span-4 flex justify-end gap-3">
                        <button
                            className="rounded-xl bg-cyan-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-cyan-800 focus:outline-none focus:ring-2 focus:ring-cyan-300"
                            onClick={onSearch}
                        >
                            Search
                        </button>

                        <button
                            type="button"
                            className="rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
                            onClick={() => {
                                setDistrict("");
                                setBlock("");
                                setGp("");
                                setFromDate("");
                                setToDate("");
                            }}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>

            {form27Data.length > 0 && (
                <div className="mt-4 border shadow bg-white">
                    <div ref={printRef} className="p-4">
                        <div className="relative border-b pb-4 mb-4">
                            <div className="absolute right-0 top-0 text-right">
                                <img src={LOGO} className="w-20 ml-auto" alt="Logo" />
                            </div>

                            <div className="text-center">
                                <p className="text-xl font-bold uppercase">
                                    {lgd[0]?.lsgName}
                                </p>

                                <p className="text-lg font-semibold">
                                    {lgd[0]?.lgdAdd1}
                                </p>

                                <p className="text-cyan-700 font-bold text-lg mt-1">
                                    Receipts & Payments Accounts
                                </p>

                                <p className="text-gray-600 font-semibold">
                                    {statusData?.statusTag}
                                </p>
                            </div>

                            <div className="absolute left-0 bottom-0">
                                <p className="text-cyan-700 font-semibold">
                                    Period: {fromDate} to {toDate}
                                </p>
                            </div>
                        </div>

                        <table className="mt-6 text-xs">
                            <thead>
                                <tr className="bg-gray-100 font-bold text-center">
                                    <th className="border p-2">Receipt Particulars</th>
                                    <th className="border p-2">Budget Provision for the year</th>
                                    <th className="border p-2">Up to Last Month</th>
                                    <th className="border p-2">During this Period</th>
                                    <th className="border p-2">Cumulative total</th>
                                    <th className="border p-2">Payment Particulars</th>
                                    <th className="border p-2">Budget Provision for the year</th>
                                    <th className="border p-2">Up to Last Month</th>
                                    <th className="border p-2">During this Period</th>
                                    <th className="border p-2">Cumulative total</th>
                                    <th className="border p-2">Balance</th>
                                </tr>
                            </thead>

                            <tbody>
                                {form27Data.map((row, index) => {
                                    const cumulativeReceipt =
                                        Number(row.receiptLastBalance || 0) +
                                        Number(row.receiptDuringPeriod || 0);

                                    const cumulativePayment =
                                        Number(row.paymentLastBalance || 0) +
                                        Number(row.paymentDuringPeriod || 0);

                                    const balance = cumulativeReceipt - cumulativePayment;

                                    return (
                                        <tr key={index}>
                                            <td className="border p-2 text-left">{row.receiptDetails}</td>
                                            <td className="border p-2">{row.receiptBudget}</td>
                                            <td className="border p-2">{row.receiptLastBalance}</td>
                                            <td className="border p-2">{row.receiptDuringPeriod}</td>
                                            <td className="border p-2">{cumulativeReceipt.toFixed(2)}</td>
                                            <td className="border p-2 text-left">{row.paymentDetails}</td>
                                            <td className="border p-2">{row.paymentBudget}</td>
                                            <td className="border p-2">{row.paymentLastBalance}</td>
                                            <td className="border p-2">{row.paymentDuringPeriod}</td>
                                            <td className="border p-2">{cumulativePayment.toFixed(2)}</td>
                                            <td className="border p-2 font-bold">{balance.toFixed(2)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center py-3">
                        <button
                            className="bg-green-600 text-white px-4 py-1 rounded"
                            onClick={handlePrint}
                        >
                            Download PDF
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReceiptPayment27;