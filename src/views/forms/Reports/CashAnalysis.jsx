import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
    getCashAnalysisUtilization, getCashAnalysisSummaryOB, getCashAnalysisSummaryDtls, getCashAnalysisSummaryCB, getCashAnalysisReceiptDtls, getCashAnalysisHeadDtls, getCashAnalysisPriGlDtls
} from "../../../Service/Reports/ReportsService";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from 'react-modal';
import html2canvas from "html2canvas";
import LOGO from "../../../Img/logo.png"
import { getDistrictListforEvent, getBlockList, getGpList, getParabaithakActivity } from "../../../Service/Project/ActivityDetailsService";
import { getLgdDetails } from "../../../Service/LgdCodeGet/LgdCodeService";
import { getStatus } from "../../../Service/Reports/ReportsService";

const CashAnalysis = () => {
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

    const [currentFinancialYear, setCurrentFinancialYear] = useState("");

    const [cashAnalysisSummaryOB, setCashAnalysisSummaryOB] = useState();
    const [cashAnalysisUtilization, setCashAnalysisUtilization] = useState();
    const [cashAnalysisSummaryDtls, setCashAnalysisSummaryDtls] = useState([]);
    const [cashAnalysisSummaryCB, setCashAnalysisSummaryCB] = useState();
    const [reportType, setReportType] = useState();
    const [lgd, setLgd] = useState([]);
    
    const formatDate = (date) =>
        date ? new Date(date).toLocaleDateString("en-GB").replace(/\//g, '.') : "Invalid Date";


    useEffect(() => {
        getLgdDetails(userData?.CORE_LGD).then((response) => {
            if (response.status === 200) {
                setLgd(response.data);
            } else {
                toast.error("Failed to fetch data");
            }
        });
    }, [])

    console.log(cashAnalysisSummaryDtls, "cashAnalysisSummaryDtls")
    const totals = {
        openingBalance: 0,
        receiptAmount: 0,
        paymentAmount: 0,
        closingBalance: 0
    };

    // Iterate through the array and sum the values
    cashAnalysisSummaryDtls?.dtls?.forEach(item => {
        totals.openingBalance += parseFloat(item.openingBalance) || 0;
        totals.receiptAmount += parseFloat(item.receiptAmount) || 0;
        totals.paymentAmount += parseFloat(item.paymentAmount) || 0;
        totals.closingBalance += parseFloat(item.closingBalance) || 0;
    });


    console.log(totals?.openingBalance, "totals")


    const onSearch = () => {
        if (!district) {
            toast.error("Please select a District");
        } else if (!fromDate) {
            toast.error("Please select a From Date");
        } else if (!toDate) {
            toast.error("Please select a To Date");
        } else if (!reportType) {
            toast.error("Please select a Report Type");
        } else {
            getCashAnalysisSummaryOB(district != 0 && block != 0 && gp != 0 ? gp : district != 0 && block != 0 && gp == 0 ? block : district != 0 && block == 0 && gp == 0 ? district : 0, currentFinancialYear, fromDate, toDate,).then((response) => {
                if (response.status === 200) {
                    setCashAnalysisSummaryOB(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
            getCashAnalysisUtilization(district != 0 && block != 0 && gp != 0 ? gp : district != 0 && block != 0 && gp == 0 ? block : district != 0 && block == 0 && gp == 0 ? district : 0, fromDate, toDate,).then((response) => {
                if (response.status === 200) {
                    setCashAnalysisUtilization(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });



            {
                reportType === "Cash Analysis (Summary)" ? getCashAnalysisSummaryDtls(district != 0 && block != 0 && gp != 0 ? gp : district != 0 && block != 0 && gp == 0 ? block : district != 0 && block == 0 && gp == 0 ? district : 0, fromDate, toDate,).then((response) => {
                    if (response.status === 200) {
                        setCashAnalysisSummaryDtls(response.data);
                    } else {
                        toast.error("Failed to fetch data");
                    }

                }
                ) : reportType === "Cash Analysis (Receipt-Payment Groupwise)" ? getCashAnalysisReceiptDtls(district != 0 && block != 0 && gp != 0 ? gp : district != 0 && block != 0 && gp == 0 ? block : district != 0 && block == 0 && gp == 0 ? district : 0, fromDate, toDate,).then((response) => {
                    if (response.status === 200) {
                        setCashAnalysisSummaryDtls(response.data);
                    } else {
                        toast.error("Failed to fetch data");
                    }
                }) : reportType === "Cash Analysis (PRI GL wise)" ? getCashAnalysisPriGlDtls(userData?.CORE_LGD, fromDate, toDate,).then((response) => {
                    if (response.status === 200) {
                        setCashAnalysisSummaryDtls(response.data);
                    } else {
                        toast.error("Failed to fetch data");
                    }
                }) : getCashAnalysisHeadDtls(userData?.CORE_LGD, fromDate, toDate,).then((response) => {
                    if (response.status === 200) {
                        setCashAnalysisSummaryDtls(response.data);
                    } else {
                        toast.error("Failed to fetch data");

                    }
                })
            }

            getCashAnalysisSummaryCB(district != 0 && block != 0 && gp != 0 ? gp : district != 0 && block != 0 && gp == 0 ? block : district != 0 && block == 0 && gp == 0 ? district : 0, currentFinancialYear, fromDate, toDate,).then((response) => {
                if (response.status === 200) {
                    setCashAnalysisSummaryCB(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });

            getStatus(userData?.CORE_LGD, fromDate, toDate,).then((response) => {
                if (response.status === 200) {
                    { response?.data?.statusMsg === "Success" ? toast.success("Data Fetched Successfully") : toast.error(response?.data?.statusMsg) }
                    setStatus(response.data);
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
                <title>Cash Analysis</title>
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


    const onReportType = (e) => {
        setReportType(e.target.value);
        setCashAnalysisSummaryDtls([]);
    }

    useEffect(() => {
        const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
        const data = JSON.parse(jsonString);

        getDistrictListforEvent(data?.USER_LEVEL == "DIST" || data?.USER_LEVEL == "BLOCK" || data?.USER_LEVEL == "GP" ? data?.DIST_LGD : 0).then(function (result) {
            const response = result?.data;
            console.log(response, "resresres")
            setDistrictDataList(response);
            setDistrict(data?.USER_LEVEL == "DIST" || data?.USER_LEVEL == "BLOCK" || data?.USER_LEVEL == "GP" ? data?.DIST_LGD : 0)
        });

        getBlockList(data?.USER_LEVEL == "DIST" || data?.USER_LEVEL == "BLOCK" || data?.USER_LEVEL == "GP" ? data?.DIST_LGD : 0, data?.USER_LEVEL == "DIST" || data?.USER_LEVEL == "BLOCK" || data?.USER_LEVEL == "GP" ? data?.BLOCK_LGD : 0).then(function (result) {
            const response = result?.data;
            console.log(response, "resresres")
            setBlockDataList(response);
            setBlock(data?.USER_LEVEL == "DIST" || data?.USER_LEVEL == "BLOCK" || data?.USER_LEVEL == "GP" ? data?.BLOCK_LGD : 0)
        });

        getGpList(data?.USER_LEVEL == "DIST" || data?.USER_LEVEL == "BLOCK" || data?.USER_LEVEL == "GP" ? data?.DIST_LGD : 0, data?.USER_LEVEL == "DIST" || data?.USER_LEVEL == "BLOCK" || data?.USER_LEVEL == "GP" ? data?.BLOCK_LGD : 0,
            data?.USER_LEVEL == "DIST" || data?.USER_LEVEL == "BLOCK" || data?.USER_LEVEL == "GP" ? data?.GP_LGD : 0,
        ).then(function (result) {
            const response = result?.data;
            console.log(response, "resresres")
            setGpDataList(response);
            setGp(data?.USER_LEVEL == "DIST" || data?.USER_LEVEL == "BLOCK" || data?.USER_LEVEL == "GP" ? data?.GP_LGD : 0)
        });

    }, []);



    let DistrictListDropDown = <option>Loading...</option>;
    if (getDistrictDataList && getDistrictDataList.length > 0) {
        DistrictListDropDown = getDistrictDataList.map((distRow, index) => (
            <option value={distRow.DistLgd}>{distRow.DistName}</option>
        ));
    }

    console.log(DistrictListDropDown, "DistrictListDropDown")


    const onDistrict = (e) => {
        setDistrict(e.target.value)
        setBlock('')
        setGp('')
        getBlockList(e.target.value, 0).then(function (result) {
            const response = result?.data;
            console.log(response, "resresres")
            setBlockDataList(response);
        });
    }
    let BlockListDropDown = <option>Loading...</option>;
    if (getBlockDataList && getBlockDataList.length > 0) {
        BlockListDropDown = getBlockDataList.map((blRow, index) => (
            <option value={blRow.BLOCK_LGD}>{blRow.BLOCK_NAME}</option>
        ));
    }

    const onBlock = (e) => {
        setBlock(e.target.value)
        setGp('')

        getGpList(district ? district : userData?.DIST_LGD, e.target.value, 0).then(function (result) {
            const response = result?.data;
            console.log(response, "resresres")
            setGpDataList(response);
        });
    }
    let GpListDropDown = <option>Loading...</option>;
    if (getGpDataList && getGpDataList.length > 0) {
        GpListDropDown = getGpDataList.map((gpRow, index) => (
            <option value={gpRow.GP_LGD}>{gpRow.GP_NAME}</option>
        ));
    }

    const onGp = (e) => {
        setGp(e.target.value)
    }


    console.log(district, block, gp, "districtdistrict")

    return (
        <>
            <ToastContainer />
            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Cash Analysis</legend>

                <div className="flex flex-col space-y-2 py-3">
                    <div className="flex flex-col w-full space-y-1">
                        <div className="flex items-center space-x-4">
                            <div className="w-1/3">
                                <label
                                    htmlFor="receipt_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    District
                                </label>
                                <select
                                    id="receipt_name"
                                    name="receipt_name"
                                    autoComplete="off"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
                                    value={district}
                                    onChange={onDistrict}
                                // disabled={userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? true : false}

                                >
                                    {userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? "" :
                                        <option value="0" selected >
                                            Select District
                                        </option>}

                                    {getDistrictDataList.map((distRow, index) => (
                                        <option value={distRow.DistLgd}>{distRow.DistName}</option>
                                    ))}

                                </select>
                            </div>

                            <div className="w-1/3">
                                <label
                                    htmlFor="department_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Block
                                </label>
                                <select
                                    id="department_name"
                                    name="department_name"
                                    autoComplete="off"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
                                    onChange={onBlock}
                                    value={block}
                                // disabled={userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? true : false}
                                >
                                    {userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? "" :
                                        <option value="0" selected >
                                            Select Block
                                        </option>}
                                    {getBlockDataList.map((blRow, index) => (
                                        <option value={blRow.BlockLgd}>{blRow.BlockName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-1/3">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Gram Panchayat
                                </label>
                                <select
                                    id="scheme_name"
                                    name="scheme_name"
                                    autoComplete="off"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
                                    onChange={onGp}
                                    value={gp}
                                // disabled={userData?.USER_LEVEL == "GP" ? true : false}
                                >
                                    {userData?.USER_LEVEL == "GP" ? "" :
                                        <option value="0" selected >
                                            Select Gram Panchayat
                                        </option>}
                                    {getGpDataList.map((gpRow, index) => (
                                        <option value={gpRow.GPLgd}>{gpRow.GPName}</option>
                                    ))}
                                </select>
                            </div>
                            {/* From Date */}
                            <div className="w-1/4 px-2">
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
                            <div className="w-1/4 px-2">
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

                        </div>
                        <div className="flex items-center w-full space-x-4">

                            <div className="w-1/5">

                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Report Type <span className="text-red-500 "> * </span>

                                </label>
                                <select
                                    className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
                                    onChange={onReportType}
                                    value={reportType}
                                >
                                    <option value="" selected hidden>--Select Report Type--</option>
                                    <option value="Cash Analysis (Summary)">Cash Analysis (Summary)</option>
                                    <option value="Cash Analysis (Receipt-Payment Groupwise)">Cash Analysis (Receipt-Payment Groupwise)</option>
                                    <option value="Cash Analysis (Head Classification wise)">Cash Analysis (Head Classification wise)</option>
                                    <option value="Cash Analysis (PRI GL wise)">Cash Analysis (PRI GL wise)</option>
                                </select>

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


                {cashAnalysisSummaryDtls?.dtls?.length > 0 ? (
                    <>
                        <div className=" bg-white shadow-lg border text-xs">
                            <div ref={printRef} id="voucher-container" style={{ position: "relative" }} className="bg-white p-4 shadow-lg text-xs">
                                <div className="mylogo" style={{ position: "absolute", top: 0, right: 20 }}>
                                    <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                                </div>
                                <div className="grid">

                                    <div className="col-span-12">
                                        <p className="text-center font-bold text-xl text-black-700 bigbold" style={{ fontFamily: "InterVariable, sans-serif" }}>
                                            {lgd[0]?.lsgName}
                                        </p>
                                        <p className="text-center font-bold text-xl text-black-700 bigbold" style={{ fontFamily: "InterVariable, sans-serif" }}>
                                            {lgd[0]?.lgdAdd1}
                                        </p>
                                        <div className="text-center font-bold text-lg text-cyan-700 bigbold mb-4" style={{ fontFamily: "InterVariable, sans-serif", marginBottom: "0px" }}>
                                            {reportType}-{statusData?.statusTag}
                                        </div>
                                        <div className="text-center font-semibold text-sm text-cyan-700" style={{ fontFamily: "InterVariable, sans-serif", marginTop: "5px" }}>
                                            Period: {formatDate(fromDate)} to {formatDate(toDate)}
                                        </div>
                                    </div>

                                </div>

                                <div className="text-sm text-left tbsize" style={{ marginBottom: 10 }}>
                                    <p style={{ fontFamily: "InterVariable, sans-serif" }}><span className="smallbold font-bold text-cyan-700" style={{ fontFamily: "InterVariable, sans-serif", lineHeight: .5 }}>Opening Balance:</span> {cashAnalysisSummaryOB?.totalOB}</p>
                                    <p style={{ fontFamily: "InterVariable, sans-serif" }}><span className="smallbold font-bold text-cyan-700" style={{ fontFamily: "InterVariable, sans-serif", lineHeight: .5 }}>Bank:</span> {cashAnalysisSummaryOB?.bank}</p>
                                    <p style={{ fontFamily: "InterVariable, sans-serif" }}><span className="smallbold font-bold text-cyan-700" style={{ fontFamily: "InterVariable, sans-serif", lineHeight: .5 }}>Treasury:</span> {cashAnalysisSummaryOB?.treasury}</p>
                                    <p style={{ fontFamily: "InterVariable, sans-serif" }}><span className="smallbold font-bold text-cyan-700" style={{ fontFamily: "InterVariable, sans-serif", lineHeight: .5 }}>Cash:</span> {cashAnalysisSummaryOB?.cash}</p>

                                </div>
                                {/* Header */}


                                {/* Balance Details */}



                                {/* Table Container */}
                                {reportType === "Cash Analysis (Summary)" ?
                                    <div className="mt-2 overflow-x-auto">
                                        <table className="w-full border-collapse border text-xs">
                                            <thead>
                                                <tr className="text-black-700 smallbold">
                                                    <th className="border p-2" style={{ fontFamily: "InterVariable, sans-serif" }}>Sl No</th>
                                                    <th className="border p-2" style={{ fontFamily: "InterVariable, sans-serif" }}>Head of Account</th>
                                                    <th className="border p-2" style={{ fontFamily: "InterVariable, sans-serif" }}>Opening Balance</th>
                                                    <th className="border p-2" style={{ fontFamily: "InterVariable, sans-serif" }}>Receipt</th>
                                                    <th className="border p-2" style={{ fontFamily: "InterVariable, sans-serif" }}>Payment</th>
                                                    <th className="border p-2" style={{ fontFamily: "InterVariable, sans-serif" }}>Closing Balance</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cashAnalysisSummaryDtls?.dtls?.map((entry, index) => (
                                                    <tr key={index} className="text-right tbsize">
                                                        <td className="border p-2 text-right rightall" style={{ fontFamily: "InterVariable, sans-serif" }}>{index + 1}</td>
                                                        <td className="border p-2 text-left" style={{ fontFamily: "InterVariable, sans-serif" }}>{entry?.glGroupName}</td>
                                                        <td className={entry?.openingBalance < 0 ? "border p-2 text-red-600 redclr rightall" : "border p-2 rightall"} style={{ fontFamily: "InterVariable, sans-serif" }}>{entry?.openingBalance}</td>
                                                        <td className={entry?.receiptAmount < 0 ? "border p-2 text-red-600 redclr rightall" : "border p-2 rightall"} style={{ fontFamily: "InterVariable, sans-serif" }}>{entry?.receiptAmount}</td>
                                                        <td className={entry?.paymentAmount < 0 ? "border p-2 text-red-600 redclr rightall" : "border p-2 rightall"} style={{ fontFamily: "InterVariable, sans-serif" }}>{entry?.paymentAmount}</td>
                                                        <td className={entry?.closingBalance < 0 ? "border p-2 text-red-600 redclr rightall" : "border p-2 rightall"} style={{ fontFamily: "InterVariable, sans-serif" }}>{entry?.closingBalance}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr className="bg-gray-300 font-bold text-black tbsize rightall">

                                                    <td colSpan="2" className="border p-2 text-right" style={{ fontFamily: "InterVariable, sans-serif" }}>Grand Total:</td>
                                                    <td className="border p-2 text-right" style={{ fontFamily: "InterVariable, sans-serif" }}>{(totals?.openingBalance).toFixed(2)}</td>
                                                    <td className="border p-2 text-right" style={{ fontFamily: "InterVariable, sans-serif" }}>{(totals?.receiptAmount).toFixed(2)}</td>
                                                    <td className="border p-2 text-right" style={{ fontFamily: "InterVariable, sans-serif" }}>{(totals?.paymentAmount).toFixed(2)}</td>
                                                    <td className="border p-2 text-right" style={{ fontFamily: "InterVariable, sans-serif" }}>{(totals?.closingBalance).toFixed(2)}</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div> :
                                    <div className="mt-2 overflow-x-auto">
                                        <table className="w-full border-collapse border text-xs">
                                            <thead>
                                                <tr className="text-black-700 smallbold">
                                                    <th className="smallbold border p-2" style={{ fontFamily: "InterVariable, sans-serif" }}>Sl No</th>
                                                    <th className="smallbold border p-2" style={{ fontFamily: "InterVariable, sans-serif" }}>{reportType === "Cash Analysis (PRI GL wise)" ? "Gl Group Id" : "Receipt Group Id"}</th>
                                                    <th className="smallbold border p-2" style={{ fontFamily: "InterVariable, sans-serif" }}>{reportType === "Cash Analysis (PRI GL wise)" ? "Gl Group Name" : "Receipt Group Name"}</th>
                                                    {/* <th className="border p-2">GL Group ID</th>
                                                    <th className="border p-2">GL Group Name</th> */}
                                                    <th className="smallbold border p-2" style={{ fontFamily: "InterVariable, sans-serif" }}>Opening Balance</th>
                                                    <th className="smallbold border p-2" style={{ fontFamily: "InterVariable, sans-serif" }}>Receipt</th>
                                                    <th className="smallbold border p-2" style={{ fontFamily: "InterVariable, sans-serif" }}>Payment</th>
                                                    <th className="smallbold border p-2" style={{ fontFamily: "InterVariable, sans-serif" }}>Closing Balance</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cashAnalysisSummaryDtls?.dtls.map((entry, index) => (
                                                    <tr key={index} className={entry?.receiptGroupId ? "bg-blue-200 text-right" : "text-right"}>
                                                        <td className="border p-2 text-left">{index + 1}</td>
                                                        <td className="border p-2 text-left">
                                                            {reportType === "Cash Analysis (PRI GL wise)" ? entry?.glGroupId : entry?.receiptGroupId}
                                                        </td>
                                                        <td className="border p-2 text-left">
                                                            {reportType === "Cash Analysis (PRI GL wise)" ? entry?.glGroupName : entry?.receiptGroupName}
                                                        </td>
                                                        <td className="border p-2">{entry?.openingBalance}</td>
                                                        <td className="border p-2">{entry?.receiptAmount}</td>
                                                        <td className="border p-2">{entry?.paymentAmount}</td>
                                                        <td className="border p-2">{entry?.closingBalance}</td>
                                                    </tr>

                                                ))}
                                            </tbody>

                                        </table>

                                    </div>}

                                {/* Right-aligned text */}
                                <div className="text-sm text-right tbsize" style={{ textAlign: "right" }}>
                                    <p style={{ fontFamily: "InterVariable, sans-serif" }}><span className="smallbold font-bold text-cyan-700" style={{ fontFamily: "InterVariable, sans-serif", lineHeight: .5 }}>Closing Balance:</span> {cashAnalysisSummaryCB?.totalCB}</p>

                                    <p style={{ fontFamily: "InterVariable, sans-serif" }}><span className="smallbold font-bold text-cyan-700" style={{ fontFamily: "InterVariable, sans-serif", lineHeight: .5 }}>Bank:</span> {cashAnalysisSummaryCB?.bank}</p>
                                    <p style={{ fontFamily: "InterVariable, sans-serif" }}><span className="smallbold font-bold text-cyan-700" style={{ fontFamily: "InterVariable, sans-serif", lineHeight: .5 }}>Treasury:</span> {cashAnalysisSummaryCB?.treasury}</p>
                                    <p style={{ fontFamily: "InterVariable, sans-serif" }}><span className="smallbold font-bold text-cyan-700" style={{ fontFamily: "InterVariable, sans-serif", lineHeight: .5 }}>Cash:</span> {cashAnalysisSummaryCB?.cash}</p>
                                </div>
                                <div className="mt-4 text-sm flex justify-between">
                                    {/* Left-aligned text */}
                                    <div className="space-y-1 text-left vv">
                                        <p style={{ fontFamily: "InterVariable, sans-serif" }}><span className="tbsize font-bold text-cyan-700" style={{ fontFamily: "InterVariable, sans-serif" }}>Available Fund:{cashAnalysisUtilization?.availableFund}</span></p>
                                        <p style={{ fontFamily: "InterVariable, sans-serif" }}><span className="tbsize font-bold text-cyan-700" style={{ fontFamily: "InterVariable, sans-serif" }}>Expenditure:{cashAnalysisUtilization?.expenditureAmount}</span></p>
                                        <p style={{ fontFamily: "InterVariable, sans-serif" }}><span className="tbsize font-bold text-cyan-700" style={{ fontFamily: "InterVariable, sans-serif" }}>Percentage of utilization:{cashAnalysisUtilization?.percentageUtilization}</span></p>

                                    </div>


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
                {cashAnalysisSummaryDtls?.length === 0 ? <div className="flex items-center justify-center bg-gray-200" style={{ marginTop: "10px" }}>
                    <div className="text-center">
                        <h1 className="text-xl font-semibold text-black-800">No Data Found</h1>

                    </div>
                </div> : ""}



            </div>
        </>
    );
};

export default CashAnalysis;
