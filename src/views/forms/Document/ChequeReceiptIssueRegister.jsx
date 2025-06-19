import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
    getCashAnalysisSummaryOB, getCashAnalysisSummaryDtls, getCashAnalysisSummaryCB
} from "../../../Service/Reports/ReportsService";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from 'react-modal';
import html2canvas from "html2canvas";
import LOGO from "../../../Img/logo.png"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFinInstitute } from "../../../Service/Cheque/ChequeService";
import { getChequeIssue } from "../../../Service/Document/DocumentService";
import { saveAs } from "file-saver";


const ChequeReceiptIssueRegister = () => {
    const getCurrentDate = () => new Date().toISOString().split("T")[0];
    // State for From Date, To Date, and Input Box
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState(getCurrentDate());
    const [bank, setBank] = useState("")
    const [report, setReport] = useState("")
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const queryClient = useQueryClient();

    const [currentFinancialYear, setCurrentFinancialYear] = useState("");
    const [cashAnalysisSummaryOB, setCashAnalysisSummaryOB] = useState();
    const [cashAnalysisSummaryDtls, setCashAnalysisSummaryDtls] = useState([]);
    const [cashAnalysisSummaryCB, setCashAnalysisSummaryCB] = useState();
    const [finInstitution, setfinInstitute] = useState([]);


    // Calculate the current financial year dynamically
    useEffect(() => {
        getFinInstitute(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
            "R",
        ).then(function (result) {
            const response = result?.data;
            console.log(response, "report")
            setfinInstitute(response);

        })
    }, []);

    const onBank = (e) => {
        setBank(e.target.value)
    }

    const onReport = (e) => {
        setReport(e.target.value)
    }




    // const totalClosingBalance = Object.values(cashAnalysisSummaryCB).reduce((sum, value) => sum + value, 0);
    const handleDownloadExcel = () => {
        if (!cashAnalysisSummaryDtls || cashAnalysisSummaryDtls.length === 0) return;

        const worksheet = XLSX.utils.json_to_sheet(cashAnalysisSummaryDtls);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "CashAnalysis");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(data, "cheque_receipt_issue_register.xlsx");
    };


    const onSearch = () => {
        if (!report) {
            toast.error("Please Select Report Type")
        } else if (!fromDate) {
            toast.error("Please select a From Date");
        } else if (!toDate) {
            toast.error("Please select a To Date");
        } else {
            getChequeIssue(userData?.CORE_LGD, bank ? bank : 0, report, fromDate, toDate,).then((response) => {
                if (response) {
                    console.log(response, "res")
                    setCashAnalysisSummaryDtls(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });

        }
    }



    const onFromDate = (e) => {
        const selectedDate = e.target.value;
        setFromDate(selectedDate);

        // Function to get financial year
        const getFinancialYear = (dateInput) => {
            const date = new Date(dateInput);
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // Months are zero-based (0 = January)

            return month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
        };

        // Get financial year from selected date
        const financialYear = getFinancialYear(selectedDate === "" ? getCurrentDate() : selectedDate);

        // Assuming you have a state to store financial year
        setCurrentFinancialYear(financialYear);
    };


    const handleDownload = () => {
        const input = document.getElementById("voucher-container"); // Select the container

        if (!input) {
            console.error("Element #voucher-container not found.");
            return;
        }

        html2canvas(input, {
            scale: 1.2, // Ensure better resolution
            useCORS: true, // Fixes font and image loading issues
        }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

            pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
            pdf.save("cash_analysis_report.pdf"); // Trigger download
        }).catch((error) => {
            console.error("Error generating PDF:", error);
        });
    };


    return (
        <>
            <ToastContainer />

            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Cheque Receipt & Issue Register</legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full space-y-2">
                        <div className="flex items-center gap-4 ">

                            <div className="w-1/4">

                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Report Type <span className="text-red-500 "> * </span>

                                </label>
                                <select
                                    className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
                                    onChange={onReport}
                                    value={report}
                                >
                                    <option value="" selected hidden>--Select Report Type--</option>
                                    <option value="R">Register of Receipt by Cheque</option>
                                    <option value="P">Cheque Issue Register</option>

                                </select>

                            </div>

                            <div className="w-1/4">

                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Bank Treasury

                                </label>
                                <select
                                    className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
                                    onChange={onBank}
                                    value={bank}
                                >
                                    <option value="" selected hidden>--Select Bank / Treasury--</option>
                                    {finInstitution?.map((d) => (
                                        <option value={d?.accountCode}>
                                            {d?.accountCodeDesc}
                                        </option>
                                    ))}
                                </select>

                            </div>
                            {/* From Date */}
                            <div className="w-1/4">
                                <label htmlFor="from_date" className="block text-sm font-medium text-gray-700 ">
                                    From Date<span className="text-red-500"> * </span>
                                </label>
                                <input
                                    type="date"
                                    id="from_date"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
                                    value={fromDate}
                                    onChange={onFromDate}
                                />
                            </div>

                            {/* To Date */}
                            <div className="w-1/4">
                                <label htmlFor="to_date" className="block text-sm font-medium text-gray-700">
                                    To Date<span className="text-red-500"> * </span>
                                </label>
                                <input
                                    type="date"
                                    id="to_date"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
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


                {cashAnalysisSummaryDtls?.length > 0 ? (
                    <>
                        
                        <div id="voucher-container" className=" bg-white p-4 shadow-lg text-xs">



                            {/* Table Container */}
                            <button
                            className="bg-cyan-800 text-white px-2 py-2 text-xs rounded hover:bg-cyan-600 transition duration-200"
                            onClick={handleDownloadExcel}
                        >
                            Download Excel
                        </button>
                            <div className="mt-2 overflow-x-auto">
                                <table className="w-full border-collapse border text-xs">
                                    <thead>
                                        <tr className="bg-cyan-500 text-black-700">
                                            <th className="border border-gray-400 p-2">A/C Head</th>
                                            <th className="border border-gray-400 p-2">Bank A/C</th>
                                            <th className="border border-gray-400 p-2">Cheque No</th>
                                            <th className="border border-gray-400 p-2">Cheque Date</th>
                                            <th className="border border-gray-400 p-2">In Favour Of</th>
                                            <th className="border border-gray-400 p-2">Particulars</th>
                                            <th className="border border-gray-400 p-2">Amount</th>
                                            <th className="border border-gray-400 p-2">Voucher ID</th>
                                            <th className="border border-gray-400 p-2">Voucher Date</th>
                                            {/* <th className="border border-gray-400 p-2">Status</th> */}
                                            <th className="border border-gray-400 p-2">Passbook Entry</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cashAnalysisSummaryDtls?.map((entry, index) => (
                                            <tr key={index} className="text-center">
                                                <td className="border p-2">{entry?.glGroupName}</td>
                                                <td className="border p-2">{entry?.accountHead}</td>
                                                <td className="border p-2">{entry?.chequeNo}</td>
                                                <td className="border p-2">{entry?.chequeDate}</td>
                                                <td className="border p-2">{entry?.inFavourOf}</td>
                                                <td className="border p-2">{entry?.particulars}</td>
                                                <td className="border p-2">{entry?.amount}</td>
                                                <td className="border p-2">{entry?.voucherId}</td>
                                                <td className="border p-2">{entry?.voucherDate}</td>
                                                {/* <td className="border p-2">{entry?.voucherStatus}</td> */}
                                                <td className="border p-2">{entry?.reconciliationDate}</td>

                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>

                            {/* Footer */}


                        </div>

                        {/* <div className="flex justify-center space-x-4 py-1">
                            <div className="text-right text-xs mt-4 italic">
                                <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handleDownload}>
                                    Download PDF
                                </button>
                            </div>
                        </div> */}
                    </>
                ) : ""}
                {cashAnalysisSummaryDtls?.length === 0 ? <div className="flex items-center justify-center bg-gray-200" style={{ marginTop: "10px" }}>
                    <div className="text-center">
                        <h1 className="text-xl font-semibold text-black-800">No Data Found</h1>

                    </div>
                </div> : ""}



            </div>
        </>
    );
};

export default ChequeReceiptIssueRegister;
