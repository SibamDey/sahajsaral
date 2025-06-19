import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
    getCashAnalysisDetails
} from "../../../Service/Reports/ReportsService";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from 'react-modal';
import html2canvas from "html2canvas";
import LOGO from "../../../Img/logo.png"
import { getDistrictListforEvent, getBlockList, getGpList, getParabaithakActivity } from "../../../Service/Project/ActivityDetailsService";
import { getLgdDetails } from "../../../Service/LgdCodeGet/LgdCodeService";
import { getAllGlGroupList } from "../../../Service/Transaction/TransactionService";

const CashAnalysisDetails = () => {
    const getCurrentDate = () => new Date().toISOString().split("T")[0];
    // State for From Date, To Date, and Input Box
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState(getCurrentDate());
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const [district, setDistrict] = useState();
    const [block, setBlock] = useState();
    const [gp, setGp] = useState();
    const [getDistrictDataList, setDistrictDataList] = useState([]);
    const [getBlockDataList, setBlockDataList] = useState([]);
    const [getGpDataList, setGpDataList] = useState([]);
    const printRef = useRef();
    const [statusData, setStatus] = useState();
    const [partyTypeAllList, setPartyTypeAllList] = useState([]);

    const [currentFinancialYear, setCurrentFinancialYear] = useState("");

    const [cashAnalysisSummaryOB, setCashAnalysisSummaryOB] = useState();
    const [cashAnalysisUtilization, setCashAnalysisUtilization] = useState();
    const [cashAnalysisSummaryDtls, setCashAnalysisSummaryDtls] = useState([]);
    const [cashAnalysisSummaryCB, setCashAnalysisSummaryCB] = useState();
    const [glGroup, setGlGroup] = useState();
    const [lgd, setLgd] = useState([]);
    const formatDate = (date) =>
        date ? new Date(date).toLocaleDateString("en-GB").replace(/\//g, '.') : "Invalid Date";


    console.log(cashAnalysisSummaryDtls, "cashAnalysisSummaryDtls")
    const totals = {
        openingBalance: 0,
        receiptAmount: 0,
        paymentAmount: 0,
        closingBalance: 0
    };

    // Iterate through the array and sum the values
    cashAnalysisSummaryOB?.dtls?.forEach(item => {
        totals.openingBalance += parseFloat(item.openingBalance) || 0;
        totals.receiptAmount += parseFloat(item.receiptAmount) || 0;
        totals.paymentAmount += parseFloat(item.paymentAmount) || 0;
        totals.closingBalance += parseFloat(item.closingBalance) || 0;
    });


    console.log(cashAnalysisSummaryOB, "cashAnalysisSummaryOB")


    const onSearch = () => {
        if (!fromDate) {
            toast.error("Please select a From Date");
        } else if (!toDate) {
            toast.error("Please select a To Date");
        } else {
            getCashAnalysisDetails(userData?.CORE_LGD, glGroup ? glGroup : 0, fromDate, toDate).then((response) => {
                if (response.status === 200) {
                    setCashAnalysisSummaryOB(response.data);
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


    const handlePrint = () => {
        const printContent = printRef.current.innerHTML;
        const myWindow = window.open("", "prnt_area", "height=800,width=700");
        myWindow.document.write(`
              <html>
              <head>
                <title>Cash Analysis Details</title>
                <style>
                .mm p{position:absolute;top:150px;right:20px !important;}
                .col-span-12{text-align:center;}
                p {line-height:.5 !important;}
                .clearfix{clear:both;}

                .prd}{float:left; font-weight:bold;text-align:left;margin:10px !important;padding:0 !important;}
                .stts{float:right; font-weight:bold;text-align:right;margin:10px !important;padding:0 !important;}
                .logo{float:left;}
                .info h2{text-align:center}
                .prn-dt{text-align:right !important;position:absolute;top:0px;right:0px !important;}
                .info{text-align:center !important}
                    .info p{text-align:center !important}
                    .info span{text-align:center}
                    .xx{position:relative;}

                  @media print {
.hh {
  border-width: 0 !important; /* Removes border but keeps color settings */
}   
                  .info h2{text-align:center}
                .prn-dt{text-align:right !important;}
                .info{text-align:center !important;margin:0 !important;padding:0 !important}
                    .info p{text-align:center !important;margin:0 !important;padding:0 !important}
                    .info span{text-align:center;margin:0 !important;padding:0 !important}
                    .mylogo img{width:100px;}
.redclr {color:red}
.tbsize {font-size:12px}

.smallbold {font-size:12px;font-weight:bold;}
.rightall {text-align:right;}
.bigbold {font-size:20px;font-weight:bold;}
.vv p>span{line-height:1;margin-bottom:5px;}
.vv {margin-top:25px;border-top:1px solid #ccc;}
                    thead { display: table-header-group; }
                    tfoot { display: table-footer-group; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid black; padding: 8px;}
                    .vert div {
                    writing-mode: vertical-rl; 
                    transform: rotate(180deg); 
                    white-space: nowrap;
                    text-align: center;
                    height: 8rem;
                    width: 2.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    }

      /* Target both regular and header cells in .parti containers */
.parti {
  width:300px !important;       /* Fixed width */
  max-width: 300px !important;   /* Ensures width doesn't exceed */
  min-width: 300px !important;   /* Prevents shrinking */
  white-space: normal !important; /* Allows text wrapping */
  word-wrap: break-word !important; /* Breaks long words */
  overflow-wrap: break-word !important; /* Modern alternative */
}

.openClr {
  background-color: #cce5ff !important; /* Light blue background */
  }

  .whiteclr {
  color: #fff !important; /* Black text color */
  }

  .blueclr {
  color: #cce5ff !important; /* Blue text color */
  }

.foot {
text-align: center !important;font-style: italic; margin:30px !important;padding:0 !important;}
                </style>
              </head>
              <body>
                ${printContent}
              </body>
              </html>
            `);
        myWindow.document.close();
        myWindow.focus();
        myWindow.print();
        myWindow.close();
    };


    const onGlGroup = (e) => {
        setGlGroup(e.target.value);
    }

    useEffect(() => {
        const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
        const data = JSON.parse(jsonString);

        getAllGlGroupList(userData?.CORE_LGD, 0,
        ).then(function (result) {
            const response = result?.data;
            console.log(response, "report")
            setPartyTypeAllList(response);
        })
    }, []);



    return (
        <>
            <ToastContainer />
            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Cash Analysis (Details)</legend>
                {/* From Date */}
                <div className="flex flex-col space-y-2 py-3">
                    <div className="flex flex-col w-full space-y-1">
                        <div className="flex items-center space-x-4">
                            <div className="w-1/3">

                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    GL Group

                                </label>
                                <select
                                    className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
                                    onChange={onGlGroup}
                                    value={glGroup}
                                >
                                    <option value="" selected>--Select GL Group--</option>
                                    {partyTypeAllList?.map((item, index) => (
                                        <option key={index} value={item?.groupId}>
                                            {item?.groupName}
                                        </option>
                                    ))}

                                </select>

                            </div>
                            <div className="w-1/5 px-2">
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
                            <div className="w-1/5 px-2">
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


                {cashAnalysisSummaryOB?.dtls?.length > 0 ? (
                    <>
                        <div className=" bg-white shadow-lg border text-xs">
                            <div ref={printRef} id="voucher-container" style={{ position: "relative" }} className="bg-white p-4 shadow-lg text-xs">

                                <div className="mt-2 overflow-x-auto">
                                    <div className="info text-center font-semibold text-sm text-cyan-700" style={{ fontFamily: "InterVariable, sans-serif", marginTop: "5px" }}>
                                        Details Receipt & Payment
                                    </div>
                                    <table className="w-full border-collapse border text-xs">
                                        <thead>
                                            <tr className="text-black-700 smallbold bg-cyan-600">
                                                {/* <th className="border p-2" style={{ fontFamily: "InterVariable, sans-serif" }}>Sl No</th> */}
                                                {/* <th className="border p-2" style={{ fontFamily: "InterVariable, sans-serif" }}>Group Name</th> */}
                                                <th className="border p-2" style={{ fontFamily: "InterVariable, sans-serif" }}>A/C Code Desc</th>
                                                <th className="border p-2" style={{ fontFamily: "InterVariable, sans-serif" }}>Opening Balance</th>
                                                <th className="border p-2" style={{ fontFamily: "InterVariable, sans-serif" }}>Receipt</th>
                                                <th className="border p-2" style={{ fontFamily: "InterVariable, sans-serif" }}>Payment</th>
                                                <th className="border p-2" style={{ fontFamily: "InterVariable, sans-serif" }}>Closing Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cashAnalysisSummaryOB?.dtls?.map((entry, index) => {
                                                // Show groupName as heading row (if present and not "Z")
                                                if (entry?.groupName && entry?.groupName !== "Z") {
                                                    return (
                                                        <tr key={`group-${index}`}>
                                                            <td
                                                                colSpan={6}
                                                                className="border p-2 text-center font-semibold bg-blue-200"
                                                                style={{ fontFamily: "InterVariable, sans-serif" }}
                                                            >
                                                                {entry.groupName}
                                                            </td>
                                                        </tr>
                                                    );
                                                }

                                                // ✅ Skip rows where all four values are "0.00"
                                                const isAllZero =
                                                    entry?.openingBalance === "0.00" &&
                                                    entry?.receiptAmount === "0.00" &&
                                                    entry?.paymentAmount === "0.00" &&
                                                    entry?.closingBalance === "0.00";

                                                if (isAllZero) return null;

                                                // ✅ Render normal data row
                                                return (
                                                    <tr key={`data-${index}`}>
                                                        <td className="border p-2 text-left" style={{ fontFamily: "InterVariable, sans-serif" }}>
                                                            {entry?.accountCodeDesc}
                                                        </td>
                                                        <td className="border p-2 text-right">{entry?.openingBalance}</td>
                                                        <td className="border p-2 text-right">
                                                            {entry?.receiptAmount === "0.00" ? "" : entry?.receiptAmount}
                                                        </td>
                                                        <td className="border p-2 text-right">
                                                            {entry?.paymentAmount === "0.00" ? "" : entry?.paymentAmount}
                                                        </td>
                                                        <td className="border p-2 text-right">{entry?.closingBalance}</td>

                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                        <tfoot>
                                            <tr className="bg-gray-300 font-bold text-black tbsize rightall">
                                                <td colSpan="1" className="border p-2 text-right" style={{ fontFamily: "InterVariable, sans-serif" }}>Grand Total:</td>
                                                <td className="border p-2 text-right" style={{ fontFamily: "InterVariable, sans-serif" }}>{cashAnalysisSummaryOB?.total?.totalOpeningBalance}</td>
                                                <td className="border p-2 text-right" style={{ fontFamily: "InterVariable, sans-serif" }}>{cashAnalysisSummaryOB?.total?.totalReceiptAmount}</td>
                                                <td className="border p-2 text-right" style={{ fontFamily: "InterVariable, sans-serif" }}>{cashAnalysisSummaryOB?.total?.totalPaymentAmount}</td>
                                                <td className="border p-2 text-right" style={{ fontFamily: "InterVariable, sans-serif" }}>{cashAnalysisSummaryOB?.total?.totalClosingBalance}</td>

                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center space-x-4 py-1">
                            <div className="text-right text-xs mt-4 italic">
                                <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handlePrint}>
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    </>
                ) : ""}

       
                {cashAnalysisSummaryOB?.dtls?.length === 0 ? <div className="flex items-center justify-center bg-gray-200" style={{ marginTop: "10px" }}>
                    <div className="text-center">
                        <h1 className="text-xl font-semibold text-black-800">No Data Found</h1>

                    </div>
                </div> : ""}



            </div>
        </>
    );
};

export default CashAnalysisDetails;
