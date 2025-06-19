import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
    getSearchPassForPayment, getDebitVoucher, getPfpDetails
} from "../../../Service/Document/DocumentService";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from 'react-modal';
import html2canvas from "html2canvas";
import LOGO from "../../../Img/logo.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { getLgdDetails } from "../../../Service/LgdCodeGet/LgdCodeService";

const PassForPaymentsDetails = () => {
    const getCurrentDate = () => new Date().toISOString().split("T")[0];
    const certificateRef = useRef();

    // State for From Date, To Date, and Input Box
    const [fromDate, setFromDate] = useState(getCurrentDate());
    const [toDate, setToDate] = useState(getCurrentDate());
    const [voucherNarration, setVoucherNarration] = React.useState("");
    const [voucherData, setVoucherData] = useState(null);
    const [pfpData, setPfpData] = useState(null);
    const [voucherPaymentFlag, setVoucherPaymentFlag] = useState(false);
    const [pfpFlag, setPfpFlag] = useState(false);
    const [status, setStatus] = useState("");
    const [voucherVerified, setVoucherVerified] = useState("");
    const [data, setData] = useState([]);
    const [lgd, setLgd] = useState([]);

    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);

    const onVoucherView = (row) => {


        setVoucherPaymentFlag(true);
        getDebitVoucher(userData?.CORE_LGD, row).then((response) => {
            if (response.status === 200) {
                setVoucherData(response.data);
            } else {
                toast.error("Failed to fetch data");
            }
        });

    };

    const onPassView = (row) => {
        setPfpFlag(true);
        getPfpDetails(userData?.CORE_LGD, row).then((response) => {
            if (response.status === 200) {
                setPfpData(response.data);
            } else {
                toast.error("Failed to fetch data");
            }
        });

    };

    const onPassForPaymentsStatus = (e) => {
        setStatus(e.target.value);
        setData([])
    }

    const onVoucherVerified = (e) => {
        setVoucherVerified(e.target.value)
        setData([]);
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
    useEffect(() => {
        getLgdDetails(userData?.CORE_LGD).then((response) => {
            if (response.status === 200) {
                setLgd(response.data);
            } else {
                toast.error("Failed to fetch data");
            }
        });
    }, [])

    const onSearch = () => {
        if (!fromDate) {
            toast.error("Please select a From Date");
        } else if (!toDate) {
            toast.error("Please select a To Date");
        } else {
            getSearchPassForPayment(userData?.CORE_LGD, fromDate, toDate, status ? status : 0, voucherVerified ? voucherVerified : 0, voucherNarration ? voucherNarration : 0).then((response) => {
                if (response.status === 200) {
                    setData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        }
    }

    const onClosePreview = () => {
        setVoucherPaymentFlag(false)
    }

    const onPfpClose = () => {
        setPfpFlag(false)
    }


    const exportToExcel = (tableData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(tableData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };

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


                    <div className="text-center font-semibold">{lgd[0]?.lsgName}</div>
                    <div className="text-center font-semibold mb-4">{lgd[0]?.lgdAdd1}</div>

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
                            <p><span className="font-semibold text-cyan-700">Voucher Entered by:</span> {voucherData?.voucherDetails?.entryBy}</p>
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

            {/* pfp details */}
            <Modal isOpen={pfpFlag}
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
                    {/* <div className="text-center">
                        <span className="flex-1 text-center font-bold">{voucherData?.voucherDetails?.rule}</span>
                    </div> */}
                    <div className="flex w-full justify-between items-center relative">
                        {/* Centered span message */}
                        <span className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
                            PASS FOR PAYMENT
                        </span>

                        {/* Right-aligned image */}
                        <div className="w-24 h-12 flex items-center justify-end ml-auto">
                            <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                        </div>
                    </div>


                    <div className="text-center font-semibold">{lgd[0]?.lsgName}</div>
                    <div className="text-center font-semibold mb-4">{lgd[0]?.lgdAdd1}</div>

                    {/* Account Details */}
                    <div className="grid grid-cols-2 gap-4 border-b pb-2">
                        <div>
                            <p><span className="font-semibold text-cyan-700">Head of Account: </span>{pfpData?.basic?.glGroupName}</p>
                            <p><span className="font-semibold text-cyan-700">Account Code: </span>{pfpData?.basic?.accountCode}</p>
                            <p><span className="font-semibold text-cyan-700">Account Code Desc: </span>{pfpData?.basic?.accountCodeDesc}</p>
                            <p><span className="font-semibold text-cyan-700">National A/C Code: </span>{pfpData?.basic?.nationalCode}</p>
                        </div>
                        <div className="text-right">
                            <p><span className="font-semibold text-cyan-700">Pass for Payment Date.: </span>{pfpData?.basic?.paymentDate}</p>
                            <p><span className="font-semibold text-cyan-700">Pass for Payment ID: </span>{pfpData?.basic?.pfpId}</p>
                            <p><span className="font-semibold text-cyan-700">Pass for Payment Status: </span>{pfpData?.basic?.pfpStts}</p>
                            {pfpData?.basic?.voucherDate ?
                                <p><span className="font-semibold text-cyan-700">Voucher Date: </span>{pfpData?.basic?.voucherDate}</p> : ""}
                            {pfpData?.basic?.voucherId ?
                                <p><span className="font-semibold text-cyan-700">Voucher ID: </span>{pfpData?.basic?.voucherId}</p> : ""}
                        </div>
                    </div>

                    {/* Payee Details & Table Side by Side */}
                    <div className="mt-4 flex justify-between gap-4 print:flex print-row">
                        {/* Payee Details */}
                        <div className="w-1/2 print-half">
                            <p><span className="font-semibold text-cyan-700">Pay to:</span> {pfpData?.basic?.payTo} - {pfpData?.basic?.partyCode}</p>
                            <p><span className="font-semibold text-cyan-700">of:</span> {pfpData?.basic?.payAddress}</p>
                            <p><span className="font-semibold text-cyan-700">Description:</span> {pfpData?.basic?.paymentDesc}</p>
                            <p><span className="font-semibold text-cyan-700">Rs.:</span> {pfpData?.basic?.netAmount}/- (Rs.{pfpData?.basic?.netAmountWord})</p>
                            <p><span className="font-semibold text-cyan-700">Scheme Name:</span> {pfpData?.basic?.schemeName}</p>
                            <p><span className="font-semibold text-cyan-700">Activity Desc:</span> {pfpData?.basic?.activityDesc}</p>
                            <p><span className="font-semibold text-cyan-700">Tendor No.:</span> {pfpData?.basic?.tenderNo}</p>
                            <p><span className="font-semibold text-cyan-700">Work Order No:</span> {pfpData?.basic?.woNo}</p>
                            <p><span className="font-semibold text-cyan-700">Allotment No:</span> {pfpData?.basic?.allotmentNo}</p>
                            <p><span className="font-semibold text-cyan-700">Bill Type:</span> {pfpData?.basic?.billType === "1" ? "RA" : pfpData?.basic?.billType === "2" ? "Restricted" : "Final"}{pfpData?.basic?.billType === "1" ? "-" + pfpData?.basic?.billTypeDesc : ""}</p>
                            <p><span className="font-semibold text-cyan-700">Schematic Type:</span> {pfpData?.basic?.schemeType === "1" ? "Work" : pfpData?.basic?.schemeType === "2" ? "Non-Work" : pfpData?.basic?.schemeType === "0" ? "None" : ""}</p>
                            <p><span className="font-semibold text-cyan-700">Expenditure Type:</span> {pfpData?.basic?.expType === "1" ? "Compact" : pfpData?.basic?.expType === "2" ? "Material" : pfpData?.basic?.expType === "3" ? "Wage" : pfpData?.basic?.expType === "4" ? "Contigency" : pfpData?.basic?.expType === "0" ? "Others" : ""}</p>
                            <p><span className="font-semibold text-cyan-700">Theme Name:</span> {pfpData?.basic?.theme1Name}{pfpData?.basic?.theme2Name}{pfpData?.basic?.theme3Name}</p>
                            <p><span className="font-semibold text-cyan-700">Documents Uploaded:</span> {pfpData?.basic?.docType}</p>

                        </div>

                        {/* Amount Details (Table) */}
                        {pfpData?.deduct?.length > 0 && (
                            <div className="w-1/2 print-half">
                                <table className="w-full border-collapse border border-black-900 text-center">
                                    <tbody>
                                        <th className="border border-gray-900 px-4 py-2 text-center">Contractor Deduction</th>
                                        <th className="border border-gray-900 px-4 py-2 text-center">Amount</th>
                                        {pfpData?.deduct.map((user, index) => (
                                            <tr key={index} className="bg-white">
                                                <td className="border border-gray-900 px-4 py-2 text-center">{user?.accountDescActual}</td>
                                                <td className="border border-gray-900 px-4 py-2 text-center">Rs. {user?.deductionAmount}/-</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>

                        )}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 border-b pb-2">
                        <div>
                            <i>
                                <p><span className="font-semibold text-cyan-700">Pass For Payment Entered by:</span> {pfpData?.basic?.entryBy} {pfpData?.basic?.entryDate}</p>
                            </i>
                        </div>
                        <div className="text-right">
                            <i>
                                <p><span className="font-semibold text-cyan-700">Pass For Payment Verified By:</span> {pfpData?.basic?.verifyBy} {pfpData?.basic?.verifyDate}</p>
                            </i>
                        </div>
                    </div>


                </div>

                <div className="flex justify-center space-x-4 py-1">
                    <div className="text-right text-xs mt-4 italic">
                        <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onPfpClose}>
                            Close
                        </button>&nbsp;
                        <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handleDownload}>
                            Print
                        </button>
                    </div>
                </div>

            </Modal>



            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700 py-2">Payment Authorization Documents</legend>


                <div className="flex flex-col space-y-2 py-2">
                    <div className="flex flex-col w-full mb-4 space-y-2">
                        <div className="flex items-center w-full space-x-4">

                            {/* Voucher Type Dropdown */}


                            {/* From Date */}
                            <div className="w-1/4 px-2">
                                <label htmlFor="from_date" className="block text-sm font-medium text-gray-700">
                                    From Date<span className="text-red-500"> * </span>
                                </label>
                                <input
                                    type="date"
                                    id="from_date"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                            </div>

                            {/* To Date */}
                            <div className="w-1/4 px-2">
                                <label htmlFor="to_date" className="block text-sm font-medium text-gray-700">
                                    To Date<span className="text-red-500"> * </span>
                                </label>
                                <input
                                    type="date"
                                    id="to_date"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                            </div>

                            <div className="w-1/3 px-2">
                                <label htmlFor="voucher_type" className="block text-sm font-medium text-gray-700">
                                    Whether Voucher Verified
                                </label>
                                <select
                                    id="voucher_type"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300"
                                    onChange={onPassForPaymentsStatus}
                                // value={status}
                                >
                                    <option value="0" selected>--Select Whether Voucher Verified--</option>
                                    <option value="V">Yes</option>
                                    <option value="I">No</option>

                                </select>
                            </div>


                            <div className="w-1/3 px-2">
                                <label htmlFor="voucher_type" className="block text-sm font-medium text-gray-700">
                                    Whether Voucher Generated
                                </label>
                                <select
                                    id="voucher_type"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300"
                                    onChange={onVoucherVerified}
                                // value={status}
                                >
                                    <option value="0" selected>--Select Whether Voucher Generated--</option>
                                    <option value="Y">Yes</option>
                                    <option value="N">No</option>
                                </select>
                            </div>

                            <div className="w-1/3 px-2">
                                <label htmlFor="input_box" className="block text-sm font-medium text-gray-700">
                                    Narration
                                </label>
                                <input
                                    type="text"
                                    id="input_box"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300"
                                    value={voucherNarration}
                                    placeholder="Narration"
                                    onChange={(e) => setVoucherNarration(e.target.value)}
                                    maxLength={200}
                                />
                            </div>


                            {/* Generate Button */}
                            <div className="w-1/6">
                                <button
                                    type="button"
                                    className="btn-submit h-9 px-2 mt-5 shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={onSearch}
                                >
                                    Search
                                </button>
                            </div>

                        </div>
                    </div>
                </div>


                {data?.length > 0 ? (
                    <>
                        <div>
                            <button
                                onClick={() => exportToExcel(data, "Pass-for-payment")}
                                className="bg-green-500 text-white px-2 py-2 rounded mr-2 text-sm"
                            >
                                Download Excel
                            </button>
                        </div>

                        {/* Table Container with Scrollable Body */}
                        <div className="border border-gray-300 min-w-[300px] max-h-[450px] overflow-y-auto">
                            <table className="w-full border-collapse border border-gray-300 text-center text-sm">
                                {/* Fixed Header */}
                                <thead className="sticky top-0">
                                    <tr className="bg-cyan-500">
                                        <th className="border p-1">Date</th>
                                        <th className="border p-1">PFP ID</th>
                                        <th className="border p-1">Pay To</th>
                                        <th className="border p-1">Head of Accounts</th>
                                        <th className="border p-1">Description</th>
                                        <th className="border p-1 text-left">Net Amount</th>
                                        <th className="border p-1 text-left">Deduct Amount</th>
                                        <th className="border p-1">PFP Status</th>
                                        <th className="border p-1">Voucher ID</th>
                                        <th className="border p-1">Action</th>
                                        <th className="border p-1">View Doc</th>


                                    </tr>
                                </thead>

                                {/* Scrollable Table Body */}
                                <tbody className="overflow-y-auto">
                                    {data.map((row, rowIndex) => (
                                        <tr
                                            key={rowIndex}
                                            className="text-center cursor-pointer hover:bg-gray-100"
                                        // Pass row data when clicked
                                        >

                                            <td className="border p-2 text-sm">{row.paymentDate}</td>
                                            <td className="border p-2 text-sm">{row?.pfpId}</td>
                                            <td className="border p-2 text-sm">{row?.payTo}</td>
                                            <td className="border p-2 text-sm">{row.glGroup}</td>
                                            <td className="border p-2 text-sm">{row.paymentDesc}</td>
                                            <td className="border p-2 text-left text-sm">{row.netAmount}</td>
                                            <td className="border p-2 text-left text-sm">{row.deductAmount}</td>
                                            <td className="border p-2 text-sm">{row.pfpStatus}</td>
                                            <td className="border p-2 text-sm">{row.voucherId ? row.voucherId : "-"}</td>
                                            <td className="border p-2 text-sm flex justify-center gap-2">
                                                <button
                                                    onClick={() => onPassView(row?.pfpId)}
                                                    className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                                                    <FontAwesomeIcon icon={faEye} title="View Pass For Payment Details" />

                                                </button>
                                                {row.voucherId ?
                                                    <button
                                                        onClick={() => onVoucherView(row?.voucherId)}
                                                        className="p-1 bg-orange-400 text-white rounded hover:bg-orange-600">
                                                        <FontAwesomeIcon icon={faEye} title="View Voucher Details" />
                                                    </button> : ""}
                                            </td>

                                            <td className="border p-2 text-sm">
                                                {row?.uploadFile ?
                                                    <button
                                                        onClick={() => {
                                                            if (row?.uploadFile) {
                                                                window.open("https://javaapi.wbpms.in/" + row.uploadFile, "_blank");
                                                            } else {
                                                                toast.error("No document available.");
                                                            }
                                                        }}
                                                        className="p-1 bg-cyan-500 text-white rounded hover:bg-cyan-600">
                                                        <FontAwesomeIcon icon={faEye} title="View Pass For Payment Details" />

                                                    </button> : ""}

                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Show Selected Row Data */}

                        </div>
                    </>
                ) : ""}
                {data?.length === 0 ? <div className="flex items-center justify-center bg-gray-200" style={{ marginTop: "10px" }}>
                    <div className="text-center">
                        <h1 className="text-xl font-semibold text-black-800">No Data Found</h1>

                    </div>
                </div> : ""}



            </div>
        </>
    );
};

export default PassForPaymentsDetails;
