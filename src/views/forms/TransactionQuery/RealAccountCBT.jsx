import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getRealAccSummary, getRealAccSummaryDetails } from "../../../Service/TransactionQuery/TransactionQueryService";
import Modal from 'react-modal';
import {
    getDebitVoucher, getContraVoucher, getReceiptVoucher,
} from "../../../Service/Document/DocumentService";
import LOGO from "../../../Img/logo.png"
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const RealAccountCBT = () => {
    const getCurrentDate = () => new Date().toISOString().split("T")[0];
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState(getCurrentDate());
    const [data, setData] = useState([]);
    const [realAccountById, setRealAccountById] = useState(false);
    const [realAccDataById, setRealAccDataById] = useState([]);
    const [realAccountId, setRealAccountId] = useState("");
    const [realAccountDesc, setRealAccountDesc] = useState("");

    const [voucherData, setVoucherData] = useState(null);
    const [voucherPaymentFlag, setVoucherPaymentFlag] = useState(false);
    const [voucherContraFlag, setVoucherContraFlag] = useState(false);
    const [voucherCreditFlag, setVoucherCreditFlag] = useState(false);
    const [voucherId, setVoucherId] = useState(null);
    const [voucherMode, setVoucherMode] = useState(null);

    const onClosePreview = () => {
        if (voucherMode === "Payment") {
            setVoucherPaymentFlag(false);
        } else if (voucherMode === "Transfer") {
            setVoucherContraFlag(false);
        } else if (voucherMode === "Reciept") {
            setVoucherCreditFlag(false);
        }

    }

    const handleDownload = () => {
        const input = document.getElementById("voucher-container"); // Select the container

        if (!input) {
            console.error("Element #voucher-container not found.");
            return;
        }

        html2canvas(input, {
            scale: 2, // Ensure better resolution
            useCORS: true, // Fixes font and image loading issues
        }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

            pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
            pdf.save("voucher.pdf"); // Trigger download
        }).catch((error) => {
            console.error("Error generating PDF:", error);
        });
    };

    const onFromDate = (e) => {
        setFromDate(e.target.value)
    }

    const onToDate = (e) => {
        setToDate(e.target.value)
    }

    const onSearch = () => {
        if (!fromDate) {
            toast.error("Please select From Date");

        } else if (!toDate) {
            toast.error("Please select To Date")
        }
        else {
            getRealAccSummary(userData?.CORE_LGD, fromDate, toDate).then((response) => {
                if (response.status === 200) {
                    setData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        }
    }

    const onRealAccount = (i, j) => {
        setRealAccountById(true)
        setRealAccountId(i)
        setRealAccountDesc(j)

        getRealAccSummaryDetails(userData?.CORE_LGD, i, fromDate, toDate).then((response) => {
            if (response.status === 200) {
                setRealAccDataById(response.data);
            } else {
                toast.error("Failed to fetch data");
            }
        });
    }

    const onCloseRealAccount = () => {
        setRealAccountById(false)
    }

    const handleRowClick = (row, mode) => {
        setVoucherId(row)
        setVoucherMode(mode)

        if (mode === "Payment") {
            setRealAccountById(false)
            setVoucherPaymentFlag(true);
            getDebitVoucher(userData?.CORE_LGD, row).then((response) => {
                if (response.status === 200) {
                    setVoucherData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        } else if (mode === "Transfer") {
            setRealAccountById(false)
            setVoucherContraFlag(true)
            getContraVoucher(userData?.CORE_LGD, row).then((response) => {
                if (response.status === 200) {
                    setVoucherData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        } else if (mode === "Reciept") {
            setRealAccountById(false)
            setVoucherCreditFlag(true)
            getReceiptVoucher(userData?.CORE_LGD, row).then((response) => {
                if (response.status === 200) {
                    setVoucherData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        }
    }

    return (
        <>
            <ToastContainer />
            {/* voucher payment */}
            <Modal isOpen={voucherPaymentFlag}
                // onRequestClose={() => setIsPartyDetailsOpen(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "50%",
                        height: "90%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                <div id="voucher-container" className="max-w-5xl mx-auto border p-2 bg-white shadow-lg text-xs">
                    {/* Header */}
                    <div className="text-center">
                        <span className="flex-1 text-center font-bold">{voucherData?.voucherDetails?.rule}</span>
                    </div>
                    <div className="flex w-full justify-between items-center relative">
                        {/* Centered span message */}
                        <span className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
                            DEBIT VOUCHER
                        </span>

                        {/* Right-aligned image */}
                        <div className="w-24 h-12 flex items-center justify-end ml-auto">
                            <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                        </div>
                    </div>


                    <div className="text-center font-semibold">{voucherData?.voucherDetails?.lgdName}</div>
                    <div className="text-center font-semibold mb-4">{voucherData?.voucherDetails?.lgdAddress}</div>

                    {/* Account Details */}
                    <div className="grid grid-cols-2 gap-4 border-b pb-2">
                        <div>
                            <p><span className="font-semibold text-cyan-700">Head of Account: </span>{voucherData?.voucherDetails?.accountHead}</p>
                            <p><span className="font-semibold text-cyan-700">Account Code: </span>{voucherData?.voucherDetails?.accountCode}</p>
                            <p><span className="font-semibold text-cyan-700">Account Code Desc: </span>{voucherData?.voucherDetails?.accountDesc}</p>
                            <p><span className="font-semibold text-cyan-700">National A/C Code: </span>{voucherData?.voucherDetails?.nationalCode}</p>
                        </div>
                        <div className="text-right">
                            <p><span className="font-semibold text-cyan-700">Voucher Date: </span>{voucherData?.voucherDetails?.voucherDate}</p>
                            <p><span className="font-semibold text-cyan-700">Voucher ID: </span>{voucherData?.voucherDetails?.voucherId}</p>
                            <p><span className="font-semibold text-cyan-700">Voucher No.: </span>{voucherData?.voucherDetails?.voucherNo}</p>
                            <p><span className="font-semibold text-cyan-700">Pass for Payment ID: </span>{voucherData?.voucherDetails?.pfpId}</p>
                        </div>
                    </div>

                    {/* Payee Details & Table Side by Side */}
                    <div className="mt-4 flex justify-between gap-4 print:flex print-row">
                        {/* Payee Details */}
                        <div className="w-1/2 print-half">
                            <p><span className="font-semibold text-cyan-700">Pay to:</span> {voucherData?.voucherDetails?.payTo}</p>
                            <p><span className="font-semibold text-cyan-700">of:</span> {voucherData?.voucherDetails?.partyAddress}</p>
                            <p><span className="font-semibold text-cyan-700">Description:</span> {voucherData?.voucherDetails?.voucherNarration}</p>
                            <p><span className="font-semibold text-cyan-700">Rs.:</span> {voucherData?.voucherDetails?.voucherNetAmount}/- (Rs.{voucherData?.voucherDetails?.voucherNetAmountWord})</p>
                            <p><span className="font-semibold text-cyan-700">Paid by:</span> {voucherData?.voucherDetails?.instrumentType}</p>
                            <p><span className="font-semibold text-cyan-700">No.:</span> {voucherData?.voucherDetails?.instrumentNo}</p>
                            <p><span className="font-semibold text-cyan-700">Dated:</span> {voucherData?.voucherDetails?.instrumentType === "None" ? "" : voucherData?.voucherDetails?.instrumentDate}</p>
                            <p><span className="font-semibold text-cyan-700">Drawn on:</span> {voucherData?.voucherDetails?.instrumentDetails}</p>
                        </div>

                        {/* Amount Details (Table) */}
                        {voucherData?.deductionDetails?.length > 0 && (
                            <div className="w-1/2 print-half">
                                <table className="w-full border-collapse border border-black-900 text-center">
                                    {/* <thead>
                                                    <tr className="bg-yellow-300">
                                                        <th className="border border-gray-400 px-2 py-2 w-1/2 text-center">Deduction Account Head</th>
                                                        <th className="border border-gray-400 px-2 py-2 w-1/2 text-center">Amount</th>
                                                    </tr>
                                                </thead> */}
                                    <tbody>
                                        {voucherData?.deductionDetails.map((user, index) => (
                                            <tr key={index} className="bg-white">
                                                <td className="border border-gray-900 px-4 py-2 text-center">{user.accountDescActual}</td>
                                                <td className="border border-gray-900 px-4 py-2 text-center">Rs. {user.deductionAmount}/-</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>

                        )}
                    </div>

                    {/* Signatures */}
                    <div className="flex justify-between mt-4 font-semibold pt-4">
                        <span>{voucherData?.voucherDetails?.leftSignatory}</span>
                        <span>{voucherData?.voucherDetails?.rightSignatory}</span>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 font-semibold text-xs">
                        <i>
                            <p><span className="font-semibold text-cyan-700">Voucher Prepared by:</span> {voucherData?.voucherDetails?.entryBy}</p>
                            <p><span className="font-semibold text-cyan-700">Voucher Verified By:</span> {voucherData?.voucherDetails?.verifiedBy}</p>
                        </i>
                    </div>

                    <div className="flex justify-between mt-2 pt-2 font-semibold border-t-2 border-black text-xs">
                        <p><i>Received Rs.{voucherData?.voucherDetails?.voucherNetAmount}/- (Rs.{voucherData?.voucherDetails?.voucherNetAmountWord}) </i></p>
                    </div>

                    <div className="flex justify-between mt-2 font-semibold text-xs">
                        <p><i>Paid by {voucherData?.voucherDetails?.instrumentType} No.{voucherData?.voucherDetails?.instrumentNo} Dated {voucherData?.voucherDetails?.instrumentDate} drawn on {voucherData?.voucherDetails?.instrumentDetails}</i></p>
                        <p><span className="font-semibold text-cyan-700">Signature of Payee</span></p>
                    </div>
                </div>

                <div className="flex justify-center space-x-4 py-1">
                    <div className="text-right text-xs mt-4 italic">
                        <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onClosePreview}>
                            Close
                        </button>&nbsp;
                        <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handleDownload}>
                            Print
                        </button>
                    </div>
                </div>

            </Modal>

            {/* voucher contra */}
            <Modal isOpen={voucherContraFlag}
                // onRequestClose={() => setIsPartyDetailsOpen(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "50%",
                        height: "70%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                <div id="voucher-container" className="w-full max-w-6xl mx-auto border p-2 bg-white shadow-lg text-xs">

                    {/* Header */}
                    <div className="text-center">
                        <span className="flex-1 text-center font-bold">{voucherData?.rule}</span>
                    </div>
                    <div className="flex w-full justify-between items-center relative">
                        {/* Centered span message */}
                        <span className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
                            CONTRA VOUCHER
                        </span>

                        {/* Right-aligned image */}
                        <div className="w-24 h-12 flex items-center justify-end ml-auto">
                            <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                        </div>
                    </div>

                    <div className="text-center font-semibold">{voucherData?.lgdName}</div>
                    <div className="text-center font-semibold mb-4">{voucherData?.lgdAddress}</div>
                    <hr className="border-gray-400 mb-2" />

                    {/* Voucher Info */}
                    <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                        <div>
                            <p><span className="font-bold text-cyan-700">Encashed from:</span> {voucherData?.encahAccountCode} - {voucherData?.encashAccountDesc}</p>
                            <p><span className="font-bold text-cyan-700">Deposited to:</span> {voucherData?.depositAccountCode} - {voucherData?.depositAccountDesc}</p>
                            <p><span className="font-bold text-cyan-700">Narration:</span> {voucherData?.voucherNarration}</p>
                            <p><span className="font-bold text-cyan-700">Rs.:</span> {voucherData?.voucherNetAmount}/- (Rs.{voucherData?.voucherNetAmountWord})</p>
                            {/* <p><span className="font-bold text-cyan-700">Rs. in Words:</span> {voucherData?.voucherNetAmountWord}</p> */}
                        </div>

                        <div className="text-right">
                            <p><span className="font-bold text-cyan-700">Voucher ID:</span> {voucherData?.voucherId}</p>
                            <p><span className="font-bold text-cyan-700">Voucher No.:</span> {voucherData?.voucherNo}</p>
                            <p><span className="font-bold text-cyan-700">Voucher Date:</span> {voucherData?.voucherDate}</p>
                        </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="grid grid-cols-2 gap-4 text-xs font-semibold mt-3">
                        <div>
                            <p><span className="font-bold text-cyan-700">Transaction By:</span> {voucherData?.instrumentType}</p>
                            <p><span className="font-bold text-cyan-700">Drawn on:</span> {voucherData?.instrumentDetails}</p>
                            <p><span className="font-bold text-cyan-700">No.:</span> {voucherData?.instrumentNo}</p>
                            <p><span className="font-bold text-cyan-700">Dated:</span> {voucherData?.instrumentDate}</p>

                        </div>

                    </div>

                    {/* Signatures */}
                    <div className="flex justify-between text-black-600 font-semibold text-xs mt-4">
                        <span>{voucherData?.leftSignatory}</span>
                        <span>{voucherData?.rightSignatory}</span>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 font-semibold text-xs">
                        <i>
                            <p><span className="font-semibold text-cyan-700">Voucher Prepared By:</span> {voucherData?.entryBy}</p>
                            <p><span className="font-semibold text-cyan-700">Voucher Verified By:</span> {voucherData?.verifiedBy}</p>
                        </i>
                    </div>
                </div>



                <div className="flex justify-center space-x-4 py-1">
                    <div className="text-right text-xs mt-4 italic">
                        <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onClosePreview}>
                            Close
                        </button>&nbsp;
                        <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handleDownload}>
                            Print
                        </button>
                    </div>
                </div>

            </Modal>

            {/* voucher Receipt */}
            <Modal isOpen={voucherCreditFlag}
                // onRequestClose={() => setIsPartyDetailsOpen(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "50%",
                        height: "85%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                <div id="voucher-container" className="max-w-5xl mx-auto border p-2 bg-white shadow-lg text-xs">
                    {/* Header */}
                    <div className="text-center">
                        <span className="flex-1 text-center font-bold">{voucherData?.rule}</span>
                    </div>
                    <div className="flex w-full justify-between items-center relative">
                        {/* Centered span message */}
                        <span className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
                            CREDIT VOUCHER
                        </span>

                        {/* Right-aligned image */}
                        <div className="w-24 h-12 flex items-center justify-end ml-auto">
                            <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                        </div>
                    </div>

                    <div className="text-center font-semibold">{voucherData?.lgdName}</div>
                    <div className="text-center mb-4 font-semibold">{voucherData?.lgdAddress}</div>

                    {/* Account Details */}
                    <div className="grid grid-cols-2 gap-4 border-b pb-2">
                        <div>
                            <p><span className="font-semibold text-cyan-700">Head of Account: </span>{voucherData?.accountHead}</p>
                            <p><span className="font-semibold text-cyan-700">Account Codes: </span>{voucherData?.accountCode}</p>
                            <p><span className="font-semibold text-cyan-700">Account Code Desc: </span>{voucherData?.accountDesc}</p>
                            <p><span className="font-semibold text-cyan-700">National A/C Code: </span>{voucherData?.nationalCode}</p>
                        </div>
                        <div className="text-right">
                            <p><span className="font-semibold text-cyan-700">Voucher Date: </span>{voucherData?.voucherDate}</p>
                            <p><span className="font-semibold text-cyan-700">Voucher ID: </span>{voucherData?.voucherId}</p>
                            <p><span className="font-semibold text-cyan-700">Voucher No.: </span>{voucherData?.voucherNo}</p>
                            {/* <p><span className="font-semibold">Pass for Payment ID: </span>{voucherData?.pfpId}</p> */}
                        </div>
                    </div>

                    {/* Payee Details & Table Side by Side */}
                    <div className="mt-4 flex justify-between gap-4 print:flex print-row">
                        {/* Payee Details */}
                        <div className="w-1/2 print-half">
                            <p><span className="font-semibold text-cyan-700">Received from:</span> {voucherData?.payTo}</p>
                            <p><span className="font-semibold text-cyan-700">of:</span> {voucherData?.partyAddress}</p>
                            <p><span className="font-semibold text-cyan-700">Description:</span> {voucherData?.voucherNarration}</p>
                            <p><span className="font-semibold text-cyan-700">Rs.:</span> {voucherData?.voucherNetAmount}/- (Rs.{voucherData?.voucherNetAmountWord})</p>
                            <p><span className="font-semibold text-cyan-700">Received by:</span> {voucherData?.instrumentType}</p>
                            <p><span className="font-semibold text-cyan-700">No.:</span> {voucherData?.instrumentNo}</p>
                            <p><span className="font-semibold text-cyan-700">Dated:</span> {voucherData?.instrumentType === "None" ? "" : voucherData?.instrumentDate}</p>
                            <p><span className="font-semibold text-cyan-700">Drawn on:</span> {voucherData?.instrumentDetails}</p>
                        </div>

                    </div>

                    {/* Signatures */}
                    <div className="flex justify-between mt-4 font-semibold pt-4">
                        <span>{voucherData?.leftSignatory}</span>
                        <span>{voucherData?.rightSignatory}</span>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 font-semibold text-xs">
                        <i>
                            <p><span className="font-semibold text-cyan-700">Voucher Prepared by:</span> {voucherData?.entryBy}</p>
                            <p><span className="font-semibold text-cyan-700">Voucher Verified By:</span> {voucherData?.verifiedBy}</p>
                        </i>
                    </div>


                </div>

                <div className="flex justify-center space-x-4 py-1">
                    <div className="text-right text-xs mt-4 italic">
                        <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onClosePreview}>
                            Close
                        </button>&nbsp;
                        <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handleDownload}>
                            Print
                        </button>
                    </div>
                </div>

            </Modal>

            <Modal
                isOpen={realAccountById}
                onRequestClose={() => setRealAccountById(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "70%",
                        height: "60%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                <h2 className="text-xl font-semibold text-center mb-4">Transaction Details</h2>
                <p className="text-sm text-bold text-black-700 text-left">
                    <strong className="text-sm text-cyan-700 text-left">Account Code:</strong> {realAccountId}
                </p>
                <p className="text-sm text-black-700 text-left ">
                    <strong className="text-sm text-cyan-700 text-left">Account Code Desc:</strong> {realAccountDesc}
                </p>
                <p className="text-sm text-black-700 text-left mb-6">
                    <strong className="text-sm text-cyan-700 text-left">From:</strong> {fromDate} To {toDate}
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-black-900 text-sm">
                        <thead className="bg-cyan-400">
                            <tr>
                                <th className="border ">Voucher Date</th>
                                <th className="border ">Voucher Id</th>
                                <th className="border ">Voucher Mode</th>
                                <th className="border ">Party</th>
                                <th className="border ">Pay to/Receipt from</th>
                                <th className="border ">Instrument</th>
                                <th className="border ">Instrument No.</th>
                                <th className="border ">Voucher Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {realAccDataById.map((txn, index) => (
                                <tr key={index} className="text-center">
                                    <td className="border cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleRowClick(txn?.voucherId, txn.voucherMode)}>{txn.voucherDate}</td>
                                    <td className="border cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleRowClick(txn?.voucherId, txn.voucherMode)}>{txn.voucherId}</td>
                                    <td className="border cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleRowClick(txn?.voucherId, txn.voucherMode)}>{txn.voucherMode}</td>
                                    <td className="border cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleRowClick(txn?.voucherId, txn.voucherMode)}>{txn.partyType}</td>
                                    <td className="border cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleRowClick(txn?.voucherId, txn.voucherMode)}>{txn.payTo}</td>
                                    <td className="border cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleRowClick(txn?.voucherId, txn.voucherMode)}>{txn.instrumentType}</td>
                                    <td className="border cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleRowClick(txn?.voucherId, txn.voucherMode)}>{txn.instrumentNo}</td>
                                    <td className="border cursor-pointer text-right hover:bg-gray-100"
                                        onClick={() => handleRowClick(txn?.voucherId, txn.voucherMode)}>{txn.voucherAmount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Close Button */}
                <div className="mt-8 text-center">
                    <button
                        type="button"
                        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={onCloseRealAccount}
                    >
                        CLOSE
                    </button>
                </div>
            </Modal>


            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Real Account – Cash/Bank/Treasury</legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full space-y-2">
                        <div className="flex items-center gap-4 ">

                            <div className="w-1/5 px-2">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    From Date
                                    <span className="text-red-500"> *</span>
                                </label>

                                <input
                                    id="scheme_name"
                                    name="scheme_name"
                                    autoComplete="off"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300 "
                                    onChange={onFromDate}
                                    value={fromDate}
                                    type="date"
                                />


                            </div>

                            <div className="w-1/5 px-2">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    To Date
                                    <span className="text-red-500"> *</span>
                                </label>

                                <input
                                    id="scheme_name"
                                    name="scheme_name"
                                    autoComplete="off"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300 "
                                    onChange={onToDate}
                                    value={toDate}
                                    type="date"
                                />


                            </div>
                            <div className="w-1/2">
                                <button
                                    type="button"
                                    className="btn-submit h-8 py-1 px-2 mt-5 shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={onSearch}
                                >
                                    Search
                                </button>
                            </div>


                        </div>

                    </div>
                </div>


                {data?.length > 0 ? <>
                    <h2 className="text-sm font-semibold mb-4 text-center">
                        Transaction Between <span className="text-cyan-500">{fromDate}</span> To <span className="text-cyan-500">{toDate}</span> :: Type: Bank/Try/Cash
                    </h2>
                    <table className="w-full border-collapse border border-gray-300 shadow-lg text-sm">
                        <thead className="bg-cyan-400">
                            <tr>
                                <th className="border border-gray-300 px-2 py-1">Account Code</th>
                                <th className="border border-gray-300 px-2 py-1">Account Desc</th>
                                <th className="border border-gray-300 px-2 py-1">Opening Balance</th>
                                <th className="border border-gray-300 px-2 py-1">Receipt</th>
                                <th className="border border-gray-300 px-2 py-1">Payment</th>
                                <th className="border border-gray-300 px-2 py-1">Closing Balance</th>
                                <th className="border border-gray-300 px-2 py-1">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((transaction, index) => (
                                <tr key={index} className="text-center border border-gray-300 text-sm">
                                    <td className="border border-gray-300 px-2 py-1">{transaction.accountCode}</td>
                                    <td className="border border-gray-300 px-2 py-1">{transaction.accountCodeDesc}</td>
                                    <td className="border border-gray-300 px-2 py-1">{transaction.openingBalance}</td>
                                    <td className="border border-gray-300 px-2 py-1">{transaction.receipt}</td>
                                    <td className="border border-gray-300 px-2 py-1">{transaction.payment}</td>
                                    <td className="border border-gray-300 px-2 py-1">{transaction.closingBalance}</td>
                                    <td className="border border-gray-300 px-2 py-1">
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => onRealAccount(transaction?.accountCode, transaction?.accountCodeDesc)}>
                                            👁️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </> : ""}

            </div>
        </>
    );
};

export default RealAccountCBT;
