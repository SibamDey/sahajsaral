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
import { getForm27 } from "../../../Service/Reports/ReportsService"; // NEW API SERVICE

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

    const printRef = useRef();

    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);

    // Fetch LGD Details
    useEffect(() => {
        getLgdDetails(userData?.CORE_LGD).then((res) => {
            if (res.status === 200) {
                setLgd(res.data);
            }
        });
    }, []);

    // District/Block/GP dropdown loading
    useEffect(() => {
        const user = userData;

        getDistrictListforEvent(
            user?.USER_LEVEL !== "STATE" ? user?.DIST_LGD : 0
        ).then((res) => {
            setDistrictList(res.data);
            setDistrict(user?.DIST_LGD || "");
        });

        getBlockList(
            user?.DIST_LGD || 0,
            user?.BLOCK_LGD || 0
        ).then((res) => {
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

    // Dropdown handlers
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

    // Fetch Form-27 data
    const onSearch = () => {
        if (!district || !fromDate || !toDate) {
            toast.error("Please fill all required fields");
            return;
        }

        getForm27(userData?.CORE_LGD, fromDate, toDate)
            .then((res) => {
                setForm27Data(res.data);
                toast.success("Data Loaded Successfully");
            })
            .catch(() => toast.error("Error loading data"));
    };

    // Print Function
    const handlePrint = () => {
        const content = printRef.current.innerHTML;
        const win = window.open("", "PRINT", "height=800,width=900");

        win.document.write(`
      <html>
      <head>
        <title>Form 27</title>
        <style>
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #000; padding: 6px; }
          .header { text-align:center; font-size:20px; font-weight:bold; }
          .subheader { text-align:center; font-weight:bold; }
        </style>
      </head>
      <body>${content}</body></html>
    `);

        win.document.close();
        win.focus();
        win.print();
        win.close();
    };

    return (
        <div className="p-4 bg-white rounded">
            <ToastContainer />

            <h2 className="text-xl font-bold text-cyan-700 mb-3">GP Form-27</h2>

            {/* Filters */}
            <div className="flex space-x-4 mb-4">

                <div className="w-1/4">
                    <label className="text-sm font-semibold">District</label>
                    <select
                        className="w-full border p-1 text-sm"
                        value={district}
                        onChange={onDistrict}
                    >
                        <option value="">Select</option>
                        {districtList.map((d) => (
                            <option value={d.DistLgd}>{d.DistName}</option>
                        ))}
                    </select>
                </div>

                <div className="w-1/4">
                    <label className="text-sm font-semibold">Block</label>
                    <select
                        className="w-full border p-1 text-sm"
                        value={block}
                        onChange={onBlock}
                    >
                        <option value="">Select</option>
                        {blockList.map((b) => (
                            <option value={b.BLOCK_LGD}>{b.BLOCK_NAME}</option>
                        ))}
                    </select>
                </div>

                <div className="w-1/4">
                    <label className="text-sm font-semibold">GP</label>
                    <select
                        className="w-full border p-1 text-sm"
                        value={gp}
                        onChange={(e) => setGp(e.target.value)}
                    >
                        <option value="">Select</option>
                        {gpList.map((g) => (
                            <option value={g.GP_LGD}>{g.GP_NAME}</option>
                        ))}
                    </select>
                </div>

            </div>

            {/* Date inputs */}
            <div className="flex space-x-4 mb-3">

                <div className="w-1/4">
                    <label className="text-sm font-semibold">From Date *</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="w-full border p-1 text-sm"
                    />
                </div>

                <div className="w-1/4">
                    <label className="text-sm font-semibold">To Date *</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="w-full border p-1 text-sm"
                    />
                </div>

                <button
                    className="bg-cyan-700 text-white px-4 h-9 mt-5 rounded"
                    onClick={onSearch}
                >
                    Search
                </button>

            </div>

            {/* RESULT TABLE */}
            {form27Data.length > 0 && (
                <div className="mt-4 border shadow bg-white">
                    <div ref={printRef} className="p-4">

                        {/* Header */}
                        <div className="flex justify-between">
                            <div>
                                <p className="header">{lgd[0]?.lsgName}</p>
                                <p className="subheader">{lgd[0]?.lgdAdd1}</p>
                                <p className="subheader text-cyan-700 text-lg">
                                    Receipts & Payments Accounts
                                </p>
                                <p className="subheader text-cyan-700">
                                    PERIOD: {fromDate} to {toDate}
                                </p>
                            </div>

                            <div className="text-right">
                                <img src={LOGO} className="w-20" />
                                <p>{new Date().toLocaleDateString()}</p>
                                <p>{new Date().toLocaleTimeString()}</p>
                                <p className="text-red-600 font-bold mt-1">UNVERIFIED</p>
                            </div>
                        </div>

                        {/* Table */}
                        <table className="mt-6 text-xs">
                            <thead>
                                <tr className="bg-gray-100 font-bold text-center">
                                    <th className="border p-2">Receipt Particulars</th>
                                    <th className="border p-2">Budget</th>
                                    <th className="border p-2">Up to Last Month</th>
                                    <th className="border p-2">During Period</th>
                                    <th className="border p-2">Cumulative</th>

                                    <th className="border p-2">Payment Particulars</th>
                                    <th className="border p-2">Budget</th>
                                    <th className="border p-2">Up to Last Month</th>
                                    <th className="border p-2">During Period</th>
                                    <th className="border p-2">Cumulative</th>
                                    <th className="border p-2">Balance</th>
                                </tr>
                            </thead>

                            <tbody>
                                {form27Data.map((row) => {
                                    const cumulativeReceipt =
                                        Number(row.receiptLastBalance) +
                                        Number(row.receiptDuringPeriod);

                                    const cumulativePayment =
                                        Number(row.paymentLastBalance) +
                                        Number(row.paymentDuringPeriod);

                                    const balance = cumulativeReceipt - cumulativePayment;

                                    return (
                                        <tr>
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