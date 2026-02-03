import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { getDistrictListforEvent, getBlockList, getGpList } from "../../../Service/Project/ActivityDetailsService";
import { ToastContainer, toast } from "react-toastify";
import LOGO from "../../../Img/logo.png"
import {
    getCashAnalysisUtilization, getCashAnalysisSummaryOB, getCashAnalysisSummaryDtls, getCashAnalysisSummaryCB, getCashAnalysisReceiptDtls, getCashAnalysisHeadDtls, getCashAnalysisPriGlDtls
} from "../../../Service/Reports/ReportsService";
import { getLgdDetails } from "../../../Service/LgdCodeGet/LgdCodeService";
import { getStatus } from "../../../Service/Reports/ReportsService";

const MonthClosingModule = () => {
    const [financialYear, setFinancialYear] = useState('');
    const [data, setData] = useState([]);
    const [yearOptions, setYearOptions] = useState([]);
    const [district, setDistrict] = useState();
    const [block, setBlock] = useState();
    const [gp, setGp] = useState();
    const [getDistrictDataList, setDistrictDataList] = useState([]);
    const [getBlockDataList, setBlockDataList] = useState([]);
    const [getGpDataList, setGpDataList] = useState([]);
    const [popupData, setPopupData] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [lgd, setLgd] = useState([]);
    const [statusData, setStatus] = useState();
    const [cashAnalysisSummaryOB, setCashAnalysisSummaryOB] = useState();
    const [cashAnalysisUtilization, setCashAnalysisUtilization] = useState();
    const [cashAnalysisSummaryDtls, setCashAnalysisSummaryDtls] = useState([]);
    const [cashAnalysisSummaryCB, setCashAnalysisSummaryCB] = useState();
    const [tier, setTier] = useState("")
    const userData = JSON.parse(sessionStorage.getItem('SAHAJ_SARAL_USER'));
    const printRef = useRef();
    const formatDate = (date) =>
        date ? new Date(date).toLocaleDateString("en-GB").replace(/\//g, '.') : "Invalid Date";

    const monthList = [
        'april', 'may', 'june', 'july',
        'august', 'september',
        'october', 'november', 'december',
        'january', 'february', 'march'
    ];


    useEffect(() => {

        if (popupData?.lgdCode && popupData?.fromDate && popupData?.toDate) {
            setLoading(true);
            getLgdDetails(popupData?.lgdCode).then((response) => {
                if (response.status === 200) {
                    setLgd(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });

            getCashAnalysisSummaryCB(popupData?.lgdCode, financialYear, popupData.fromDate, popupData.toDate,).then((response) => {
                if (response.status === 200) {
                    setCashAnalysisSummaryCB(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });

            getCashAnalysisSummaryDtls(popupData?.lgdCode, popupData.fromDate, popupData.toDate,).then((response) => {
                if (response.status === 200) {
                    setCashAnalysisSummaryDtls(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }

            });

            getStatus(popupData?.lgdCode, popupData.fromDate, popupData.toDate,).then((response) => {
                if (response.status === 200) {
                    { response?.data?.statusMsg === "Success" ? toast.success("Data Fetched Successfully") : toast.error(response?.data?.statusMsg) }
                    setStatus(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });

            getCashAnalysisSummaryOB(popupData?.lgdCode, financialYear, popupData.fromDate, popupData.toDate,).then((response) => {
                if (response.status === 200) {
                    setCashAnalysisSummaryOB(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });

            getCashAnalysisUtilization(popupData?.lgdCode, popupData.fromDate, popupData.toDate,).then((response) => {
                if (response.status === 200) {
                    setCashAnalysisUtilization(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        }
    }, [popupData]);

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

    const handleMonthClick = (monthKey, row) => {
        if (!financialYear) {
            toast.error("Please select financial year first");
            return;
        }

        const [startYear, endYear] = financialYear.split("-").map(Number);

        const monthMap = {
            april: 3,
            may: 4,
            june: 5,
            july: 6,
            august: 7,
            september: 8,
            october: 9,
            november: 10,
            december: 11,
            january: 0,
            february: 1,
            march: 2,
        };

        const lowerCaseMonth = monthKey.toLowerCase();
        const monthIndex = monthMap[lowerCaseMonth];

        const year = monthIndex >= 3 ? startYear : endYear;

        const firstDay = new Date(Date.UTC(year, monthIndex, 1));
        const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0));

        setPopupData({
            ...row,
            fromDate: firstDay.toISOString().split("T")[0],
            toDate: lastDay.toISOString().split("T")[0],
        });

        setSelectedMonth(monthKey.charAt(0).toUpperCase() + monthKey.slice(1));
    };




    const closePopup = () => {
        setPopupData(null);
        setSelectedMonth('');
    };

    useEffect(() => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth(); // 0 = Jan, 3 = April

        // Financial year starts from April
        const fyStartYear = currentMonth >= 3 ? currentYear : currentYear - 1;

        const years = [];
        for (let i = 0; i < 1; i++) {
            const start = fyStartYear - i;
            const end = start + 1;
            years.push(`${start}-${end}`);
        }

        setYearOptions(years);
    }, []);


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

    const fetchData = async () => {
        if (!tier) {
            toast.error("Please select a Tier")
        } else if (!financialYear) {
            toast.error('Please select a financial year');
            return;
        }

        try {
            const res = await axios.get('https://javaapi.wbpms.in/api/MonthClose/MonthClosing', {
                params: {
                    distLgd: district || 0,
                    blkLgd: block || 0,
                    gpLgd: gp || 0,
                    finYear: financialYear,
                    lgdType: tier
                }
            });
            setData(res.data);
        } catch (error) {
            console.error(error);
            toast.error('Error fetching data');
        }
    };

    useEffect(() => {
        const data = JSON.parse(sessionStorage.getItem("SAHAJ_SARAL_USER"));

        getDistrictListforEvent(data?.DIST_LGD || 0).then((res) => {
            setDistrictDataList(res?.data || []);
            setDistrict(data?.DIST_LGD || 0);
        });

        getBlockList(data?.DIST_LGD || 0, data?.BLOCK_LGD || 0).then((res) => {
            setBlockDataList(res?.data || []);
            setBlock(data?.BLOCK_LGD || 0);
        });

        getGpList(data?.DIST_LGD || 0, data?.BLOCK_LGD || 0, data?.GP_LGD || 0).then((res) => {
            setGpDataList(res?.data || []);
            setGp(data?.GP_LGD || 0);
        });
    }, []);

    const onDistrict = (e) => {
        const val = e.target.value;
        setDistrict(val);
        setBlock('');
        setGp('');
        getBlockList(val, 0).then(res => setBlockDataList(res?.data || []));
    };

    const onBlock = (e) => {
        const val = e.target.value;
        setBlock(val);
        setGp('');
        getGpList(district, val, 0).then(res => setGpDataList(res?.data || []));
    };

    return (
        <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
            <ToastContainer />
            <h2 className="text-lg font-semibold text-cyan-700 mb-4">Monthly Account Closing Status</h2>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div>
                    <label className="text-sm font-medium">District<span className="text-red-500">*</span></label>
                    <select className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md" value={district || ''} onChange={onDistrict}>
                        <option value="">--Select District--</option>
                        {getDistrictDataList.map((d, i) => (
                            <option key={i} value={d.DistLgd}>{d.DistName}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium">Block</label>
                    <select className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md" value={block || ''} onChange={onBlock}>
                        <option value="">--Select Block--</option>
                        {getBlockDataList.map((b, i) => (
                            <option key={i} value={b.BlockLgd}>{b.BlockName}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium">Gram Panchayat</label>
                    <select className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md" value={gp || ''} onChange={e => setGp(e.target.value)}>
                        <option value="">--Select GP--</option>
                        {getGpDataList.map((g, i) => (
                            <option key={i} value={g.GPLgd}>{g.GPName}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium">Tier<span className="text-red-500">*</span></label>
                    <select className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md" value={tier} onChange={e => setTier(e.target.value)}>
                        <option value="">--Select Tier--</option>
                        <option value="1">Zilla Parishad</option>
                        <option value="2">Panchayat Samiti</option>
                        <option value="3">Gram Panchayat</option>
                        <option value="0">ALL</option>

                    </select>
                </div>
                <div>
                    <label className="text-sm font-medium">Financial Year<span className="text-red-500">*</span></label>
                    <select className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md" value={financialYear} onChange={e => setFinancialYear(e.target.value)}>
                        <option value="">--Select Year--</option>
                        {yearOptions.map((y, i) => (
                            <option key={i} value={y}>{y}</option>
                        ))}
                    </select>
                </div>



            </div>
            <div className="flex justify-center items-end mb-4">
                <button onClick={fetchData} className="bg-cyan-600 text-white px-2 py-2 rounded hover:bg-cyan-700">
                    Search
                </button>
            </div>

            {/* Table */}
            {data.length > 0 && (
                <div className="overflow-auto">
                    <table className="min-w-full border text-sm text-center">
                        <thead className="bg-blue-200">
                            <tr>
                                <th className="border p-2">District</th>
                                <th className="border p-2">Block</th>
                                <th className="border p-2">PRI Name</th>
                                {monthList.map(month => (
                                    <th key={month} className="border p-2 capitalize">{month}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, i) => (
                                <tr key={i} className="hover:bg-blue-50">
                                    <td className="border p-2">{row.distName}</td>
                                    <td className="border p-2">{row.blockName || '-'}</td>
                                    <td className="border p-2">{row.lgdName}</td>
                                    {monthList.map(month => (
                                        <td
                                            key={month}
                                            className={`border p-2 cursor-pointer ${row[month] !== 'Y' ? 'pointer-events-none opacity-50' : ''}`}
                                            onClick={() => handleMonthClick(month, row)} // ✅ Correct order
                                        >
                                            {row[month] === 'Y' ? (
                                                <span className="inline-block px-2 py-1 bg-green-100 text-green-700 font-bold rounded">
                                                    ✓
                                                </span>
                                            ) : (
                                                <span className="inline-block px-2 py-1 bg-red-100 text-red-700 font-bold rounded">
                                                    ✗
                                                </span>
                                            )}
                                        </td>


                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Popup */}
            {/* Popup for report */}
            {popupData && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-4 rounded-md w-11/12 max-w-5xl relative shadow-lg overflow-auto max-h-[90vh]">
                        <button
                            className="absolute top-2 right-2 text-red-600 font-bold text-lg"
                            onClick={closePopup}
                        >
                            ✕
                        </button>

                        <h2 className="text-lg font-semibold text-center text-cyan-700 mb-2">
                            Report for {selectedMonth} {formatDate(popupData.fromDate)} to {formatDate(popupData.toDate)}
                        </h2>

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
                                                    Cash Analysis (Summary)-{statusData?.statusTag}
                                                </div>
                                                <div className="text-center font-semibold text-sm text-cyan-700" style={{ fontFamily: "InterVariable, sans-serif", marginTop: "5px" }}>
                                                    Period: {formatDate(popupData.fromDate)} to {formatDate(popupData.toDate)}
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
                                        </div>

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
                </div>
            )}

        </div>
    );
};

export default MonthClosingModule;
