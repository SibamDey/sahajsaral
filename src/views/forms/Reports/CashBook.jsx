import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { getRealAccList } from "../../../Service/Transaction/TransactionService";
import { getCashbook, getStatus, getCashbookZpPs } from "../../../Service/Reports/ReportsService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LOGO from "../../../Img/logo.png"
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from 'react-modal';
import html2canvas from "html2canvas";
import { getLgdDetails } from "../../../Service/LgdCodeGet/LgdCodeService";


const CashBook = () => {
    const getCurrentDate = () => new Date().toISOString().split("T")[0];
    // State for From Date, To Date, and Input Box
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState(getCurrentDate());
    const [realAccList, setRealAccList] = useState();
    const [bank, setBank] = useState();
    const [data, setData] = useState([]);
    const [statusData, setStatus] = useState();
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const printRef = useRef();
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


    useEffect(() => {
        getRealAccList(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
        ).then(function (result) {
            const response = result?.data;
            setRealAccList(response);
        })
    }, []);

    const onBank = (e) => {
        setBank(e.target.value);
    }
    const formatCurrentDate = () => {
        const options = { weekday: "long", day: "2-digit", month: "long", year: "numeric" };
        const today = new Date();

        // Format the date with commas
        return today.toLocaleDateString("en-GB", options).replace(/ (\d{2}) /, ", $1 ");
    };

    const onSearch = () => {
        if (!fromDate) {
            toast.error("Please select a From Date");
        } else if (!toDate) {
            toast.error("Please select a To Date");
        } else {
            {
                userData?.USER_LEVEL === "GP" ?
                    getCashbook(userData?.CORE_LGD, fromDate, toDate,).then((response) => {
                        if (response.status === 200) {
                            { response?.data?.statusMsg === "Success" ? toast.success("Data Fetched Successfully") : toast.error(response?.data?.statusMsg) }
                            setData(response.data);
                        } else {
                            toast.error("Failed to fetch data");
                        }
                    }) :
                    getCashbookZpPs(userData?.CORE_LGD, fromDate, toDate,).then((response) => {
                        if (response.status === 200) {
                            { response?.data?.statusMsg === "Success" ? toast.success("Data Fetched Successfully") : toast.error(response?.data?.statusMsg) }
                            setData(response.data);
                        } else {
                            toast.error("Failed to fetch data");
                        }
                    })
            }
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

    const handlePrint = () => {
        const printContent = printRef.current.innerHTML;
        const myWindow = window.open("", "prnt_area", "height=800,width=700");
        myWindow.document.write(`
              <html>
              <head>
                <title>General Cash Book</title>
                <style>
                

                .prd{float:left; font-weight:bold;text-align:left;margin:10px !important;padding:0 !important;}
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

    console.log(data, "data")


    return (

        <div>
            <ToastContainer />
            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Cash Book</legend>
                {/* From Date */}
                <div className=" flex flex-col space-y-2 ">
                    <div className="flex flex-col w-full mb-4 space-y-2">
                        <div className="flex items-center ">
                            <div className="w-1/4">
                                <label htmlFor="from_date" className="block text-sm font-medium text-gray-700 ">
                                    From Date<span className="text-red-500"> * </span>
                                </label>
                                <input
                                    type="date"
                                    id="from_date"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
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

                    {data && data?.data?.length > 0 ? (userData?.USER_LEVEL === "GP" ?
                        <div className="p-6 bg-white min-h-screen flex flex-col items-center">
                            <div ref={printRef} className="max-w-6xl w-full bg-white p-6 shadow-lg border border-gray-300 page">
                                <div className="flex justify-between items-start mb-4 xx">
                                    <div className="text-left">
                                        <img src={LOGO} alt="Logo" className="h-12 mb-2 logo" />
                                    </div>
                                    <div className="text-center info" style={{ fontFamily: "InterVariable, sans-serif" }}>
                                        <span className="text-xs font-bold" style={{ fontFamily: "InterVariable, sans-serif", margin: "0", padding: "0" }}>FORM NO: 1 RULE : 6(1)</span>
                                        <h2 className="text-xl font-bold" style={{ fontFamily: "InterVariable, sans-serif", padding: "0" }}>Cash Book</h2>
                                        <p className="font-semibold" style={{ fontFamily: "InterVariable, sans-serif", margin: "0", padding: "0" }}>{lgd[0]?.lsgName}</p>
                                        <p className="font-semibold" style={{ fontFamily: "InterVariable, sans-serif", margin: "0", padding: "0" }}>{lgd[0]?.lgdAdd1}</p>

                                        <p className="font-semibold" style={{ fontFamily: "InterVariable, sans-serif", margin: "0", padding: "0" }}>{realAccList?.find((c) => c.accountCode === bank)?.accountCodeDesc}</p>
                                    </div>
                                    <div className="text-right font-bold italic text-sm prn-dt" style={{ fontFamily: "InterVariable, sans-serif" }}>
                                        <p>{formatCurrentDate()}</p>
                                    </div>
                                </div>
                                {/* <div className="flex justify-between text-center text-sm" style={{ fontFamily: "InterVariable, sans-serif" }}>
                                    <p className="font-semibold text-center text-xs prd" style={{ fontFamily: "InterVariable, sans-serif", margin: "0", padding: "0" }}>Period: <span className="font-normal">{fromDate} to {toDate}</span></p>
                                    
                                    <div className="text-right font-bold italic text-xs stts">{statusData?.statusTag}</div>

                                </div> */}


                                {/* Table Section */}
                                <div className="mt-2 overflow-x-auto">

                                    <table className="w-full border-collapse text-sm">
                                        <thead>
                                            <tr className="text-left" style={{ fontFamily: "InterVariable, sans-serif" }}>
                                                <td className="hh" colspan={5} style={{ fontWeight: "bold", fontFamily: "InterVariable, sans-serif" }}>Period: {formatDate(fromDate)} to {formatDate(toDate)}</td>
                                                <td className="hh text-xs" colspan={9} style={{ fontWeight: "bold", fontFamily: "InterVariable, sans-serif" }}>Sahaj-Saral :: Cash Book :: {lgd[0]?.lsgName}</td>
                                                <td className="text-left hh" colspan={2} style={{ fontWeight: "bold", fontFamily: "InterVariable, sans-serif" }}>{statusData?.statusTag}</td>
                                            </tr>
                                            <tr className="border border-black text-center" style={{ fontFamily: "InterVariable, sans-serif" }}>
                                                <th colSpan={8} className="border border-black py-2">Receipt</th>
                                                <th colSpan={8} className="border border-black py-2">Payment</th>
                                            </tr>
                                            <tr className="border border-black text-center" style={{ fontFamily: "InterVariable, sans-serif" }}>
                                                <th className="border border-black px-2 ">Date</th>
                                                <th className="border border-black px-2  text-left min-w-[300px] parti">Particulars</th>
                                                <th className="border border-black relative p-2 h-24 ">
                                                    <div className="absolute inset-0 flex items-center justify-center whitespace-nowrap">
                                                        ID
                                                    </div>
                                                </th>
                                                <th className="border border-black px-2 ">Cash</th>
                                                {/* <th className="border border-black px-2 ">Treasury</th> */}
                                                <th className="border border-black px-2 ">Bank</th>
                                                <th className="border border-black px-2 ">Head of Accounts</th>
                                                <th className="border border-black relative p-2 h-24 vert">
                                                    <div className="absolute inset-0 flex items-center justify-center transform -rotate-90 whitespace-nowrap">
                                                        Entry By
                                                    </div>
                                                </th>
                                                <th className="border border-black relative p-2 h-24 vert">
                                                    <div className="absolute inset-0 flex items-center justify-center transform -rotate-90 whitespace-nowrap">
                                                        Verify By
                                                    </div>
                                                </th>
                                                <th className="border border-black px-2 ">Date</th>
                                                <th className="border border-black px-2  text-left min-w-[300px] parti">Particulars</th>
                                                <th className="border border-black relative p-2 h-24 ">
                                                    <div className="absolute inset-0 flex items-center justify-center whitespace-nowrap">
                                                        ID
                                                    </div>
                                                </th>
                                                <th className="border border-black px-2 ">Cash</th>
                                                {/* <th className="border border-black px-2 ">Treasury</th> */}
                                                <th className="border border-black px-2 ">Bank</th>
                                                <th className="border border-black px-2 ">Head of Accounts</th><th className="border border-black relative p-2 h-24 vert">
                                                    <div className="absolute inset-0 flex items-center justify-center transform -rotate-90 whitespace-nowrap">
                                                        Entry By
                                                    </div>
                                                </th>
                                                <th className="border border-black relative p-2 h-24 vert">
                                                    <div className="absolute inset-0 flex items-center justify-center transform -rotate-90 whitespace-nowrap">
                                                        Verify By
                                                    </div>
                                                </th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.data?.map((i, index) => (
                                                <tr
                                                    key={i}
                                                    className={`border border-black text-center text-xs ${i?.receiptNarration === "Opening Balance" ? "bg-blue-200 openClr" : ""}`}
                                                    style={{ fontFamily: "InterVariable, sans-serif" }}
                                                >
                                                    <td className="border border-black px-2 ">{i?.receiptVoucherDate}</td>
                                                    <td className="border border-black px-2 text-left whitespace-normal">
                                                        {i?.receiptNarration}
                                                    </td>
                                                    <td className="border border-black p-0 align-top vert">
                                                        {i?.receiptVoucherId ? (
                                                            <div className="relative h-24 w-full min-w-[1.5rem]">  {/* Height only when ID exists */}
                                                                <div className="absolute inset-0 flex items-center justify-center whitespace-nowrap -rotate-90 origin-center transform">
                                                                    {i?.receiptVoucherId}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </td>
                                                    <td className={`border border-black px-2  text-right ${i?.receiptNarration === "Opening Balance" && String(i?.receiptCashAmount) === "0.00" ? "text-blue-200 blueclr" : i?.receiptNarration !== "Opening Balance" && String(i?.receiptCashAmount) === "0.00" ? "text-white whiteclr" : ""}`} style={{ textAlign: "right" }}>{i?.receiptCashAmount}</td>
                                                    {/* <td className={`border border-black px-2  text-right ${String(i?.receiptTryAmount) === "0.00" ? "text-white whiteclr" : ""} `} style={{ textAlign: "right" }}>{i?.receiptTryAmount}</td> */}
                                                    <td className={`border border-black px-2  text-right ${i?.receiptNarration === "Opening Balance" && String(i?.receiptBankAmount) === "0.00" ? "text-blue-200 blueclr" : i?.receiptNarration !== "Opening Balance" && String(i?.receiptBankAmount) === "0.00" ? "text-white whiteclr" : ""}`} style={{ textAlign: "right" }}>{i?.receiptBankAmount}</td>
                                                    <td className="border border-black px-2  text-center">{i?.receiptAccountHead}</td>
                                                    <td className="border border-black p-0 align-top vert">
                                                        {i?.receiptEntryBy ? (
                                                            <div className="relative h-24 w-full min-w-[1.5rem]">  {/* Height only when ID exists */}
                                                                <div className="absolute inset-0 flex items-center justify-center whitespace-nowrap -rotate-90 origin-center transform">
                                                                    {i?.receiptEntryBy}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </td>
                                                    <td className="border border-black p-0 align-top vert">
                                                        {i?.receiptVerifyBy ? (
                                                            <div className="relative h-24 w-full min-w-[1.5rem]">  {/* Height only when ID exists */}
                                                                <div className="absolute inset-0 flex items-center justify-center whitespace-nowrap -rotate-90 origin-center transform">
                                                                    {i?.receiptVerifyBy}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </td>
                                                    <td className="border border-black px-2">{i?.paymentVoucherDate}</td>
                                                    <td className="border border-black px-2 text-left whitespace-normal">
                                                        {i?.paymentNarration}
                                                    </td>
                                                    <td className="border border-black p-0 align-top vert">
                                                        {i?.paymentVoucherId ? (
                                                            <div className="relative h-24 w-full min-w-[1.5rem]">  {/* Height only when ID exists */}
                                                                <div className="absolute inset-0 flex items-center justify-center whitespace-nowrap -rotate-90 origin-center transform">
                                                                    {i?.paymentVoucherId}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </td>

                                                    <td className={`border border-black px-2  text-right ${i?.receiptNarration === "Opening Balance" && String(i?.paymentCashAmount) !== "0.00" || i?.receiptNarration === "Opening Balance" && String(i?.paymentCashAmount) === "0.00" ? "text-blue-200 blueclr" : String(i?.paymentCashAmount) === "0.00" ? "text-white whiteclr" : ""}`} style={{ textAlign: "right" }}>{i?.paymentCashAmount}</td>
                                                    {/* <td className={`border border-black px-2  text-right ${i?.receiptNarration === "Opening Balance" && String(i?.paymentTryAmount) !== "0.00" || i?.receiptNarration === "Opening Balance" && String(i?.paymentTryAmount) === "0.00" ? "text-blue-200 blueclr" : String(i?.paymentTryAmount) === "0.00" ? "text-white whiteclr" : ""}`} style={{ textAlign: "right" }}>{i?.paymentTryAmount}</td> */}
                                                    <td className={`border border-black px-2  text-right ${i?.receiptNarration === "Opening Balance" && String(i?.paymentBankAmount) !== "0.00" || i?.receiptNarration === "Opening Balance" && String(i?.paymentBankAmount) === "0.00" ? "text-blue-200 blueclr" : String(i?.paymentBankAmount) === "0.00" ? "text-white whiteclr" : ""}`} style={{ textAlign: "right" }}>{i?.paymentBankAmount}</td>
                                                    <td className="border border-black px-2  text-center">{i?.paymentAccountHead}</td>
                                                    <td className="border border-black p-0 align-top vert">
                                                        {i?.paymentEntryBy ? (
                                                            <div className="relative h-24 w-full min-w-[1.5rem]">  {/* Height only when ID exists */}
                                                                <div className="absolute inset-0 flex items-center justify-center whitespace-nowrap -rotate-90 origin-center transform">
                                                                    {i?.paymentEntryBy}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </td>

                                                    <td className="border border-black p-0 align-top vert">
                                                        {i?.paymentVerifyBy ? (
                                                            <div className="relative h-24 w-full min-w-[1.5rem]">  {/* Height only when ID exists */}
                                                                <div className="absolute inset-0 flex items-center justify-center whitespace-nowrap -rotate-90 origin-center transform">
                                                                    {i?.paymentVerifyBy}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </td>

                                                </tr>
                                            ))}

                                        </tbody>

                                    </table>
                                </div>

                                {/* <div className="mt-4 text-center text-xs italic foot" style={{ fontFamily: "InterVariable, sans-serif" }}></div> */}
                                {/* <div className="text-xs italic text-center">Page 1 of 8</div> */}
                                {/* <div className="text-xs italic text-right font-semibold">DINHATA -I PS</div> */}
                            </div>
                            {/* <div className="footer"><span className="page-number"></span></div> */}
                            <div className="flex justify-center space-x-4 ">
                                <div className="text-right text-xs mt-4 italic">
                                    <button className="bg-green-500 text-white px-4 h-10 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handlePrint}>
                                        Download PDF
                                    </button>
                                </div>
                            </div>
                        </div> :
                        <div className="p-6 bg-white min-h-screen flex flex-col items-center">
                            <div ref={printRef} className="max-w-6xl w-full bg-white p-6 shadow-lg border border-gray-300 page">
                                <div className="flex justify-between items-start mb-4 xx">
                                    <div className="text-left">
                                        <img src={LOGO} alt="Logo" className="h-12 mb-2 logo" />
                                    </div>
                                    <div className="text-center info" style={{ fontFamily: "InterVariable, sans-serif" }}>
                                        <span className="text-xs font-bold" style={{ fontFamily: "InterVariable, sans-serif", margin: "0", padding: "0" }}>Form No. 12 [Rule 22A(1)]</span>
                                        <h2 className="text-xl font-bold" style={{ fontFamily: "InterVariable, sans-serif", padding: "0" }}>Cash Book</h2>
                                        <p className="font-semibold" style={{ fontFamily: "InterVariable, sans-serif", margin: "0", padding: "0" }}>{lgd[0]?.lsgName}</p>
                                        <p className="font-semibold" style={{ fontFamily: "InterVariable, sans-serif", margin: "0", padding: "0" }}>{lgd[0]?.lgdAdd1}</p>
                                        <p className="font-semibold" style={{ fontFamily: "InterVariable, sans-serif", margin: "0", padding: "0" }}>{realAccList?.find((c) => c.accountCode === bank)?.accountCodeDesc}</p>
                                    </div>
                                    <div className="text-right font-bold italic text-sm prn-dt" style={{ fontFamily: "InterVariable, sans-serif" }}>
                                        <p>{formatCurrentDate()}</p>
                                    </div>
                                </div>
                                {/* <div className="flex justify-between text-center text-sm" style={{ fontFamily: "InterVariable, sans-serif" }}>
                                <p className="font-semibold text-center text-xs prd" style={{ fontFamily: "InterVariable, sans-serif", margin: "0", padding: "0" }}>Period: <span className="font-normal">{fromDate} to {toDate}</span></p>
                                
                                <div className="text-right font-bold italic text-xs stts">{statusData?.statusTag}</div>

                            </div> */}


                                {/* Table Section */}
                                <div className="mt-2 overflow-x-auto">

                                    <table className="w-full border-collapse text-sm">
                                        <thead>
                                            <tr className="text-left" style={{ fontFamily: "InterVariable, sans-serif" }}>
                                                <td className="hh" colspan={6} style={{ fontWeight: "bold", fontFamily: "InterVariable, sans-serif" }}>Period: {formatDate(fromDate)} to {formatDate(toDate)}</td>
                                                <td className="hh text-xs" colspan={10} style={{ fontWeight: "bold", fontFamily: "InterVariable, sans-serif" }}>Sahaj-Saral :: Cash Book :: {lgd[0]?.lsgName}</td>
                                                <td className="text-left hh" colspan={2} style={{ fontWeight: "bold", fontFamily: "InterVariable, sans-serif" }}>{statusData?.statusTag}</td>
                                            </tr>
                                            <tr className="border border-black text-center" style={{ fontFamily: "InterVariable, sans-serif" }}>
                                                <th colSpan={9} className="border border-black py-2">Receipt</th>
                                                <th colSpan={9} className="border border-black py-2">Payment</th>
                                            </tr>
                                            <tr className="border border-black text-center" style={{ fontFamily: "InterVariable, sans-serif" }}>
                                                <th className="border border-black px-2 ">Date</th>
                                                <th className="border border-black px-2  text-left min-w-[300px] parti">Particulars</th>
                                                <th className="border border-black relative p-2 h-24 ">
                                                    <div className="absolute inset-0 flex items-center justify-center whitespace-nowrap">
                                                        ID
                                                    </div>
                                                </th>
                                                <th className="border border-black px-2 ">Cash</th>
                                                <th className="border border-black px-2 ">Treasury</th>
                                                <th className="border border-black px-2 ">Bank</th>
                                                <th className="border border-black px-2 ">Head of Accounts</th>
                                                <th className="border border-black relative p-2 h-24 vert">
                                                    <div className="absolute inset-0 flex items-center justify-center transform -rotate-90 whitespace-nowrap">
                                                        Entry By
                                                    </div>
                                                </th>
                                                <th className="border border-black relative p-2 h-24 vert">
                                                    <div className="absolute inset-0 flex items-center justify-center transform -rotate-90 whitespace-nowrap">
                                                        Verify By
                                                    </div>
                                                </th>
                                                <th className="border border-black px-2 ">Date</th>
                                                <th className="border border-black px-2  text-left min-w-[300px] parti">Particulars</th>
                                                <th className="border border-black relative p-2 h-24 ">
                                                    <div className="absolute inset-0 flex items-center justify-center whitespace-nowrap">
                                                        ID
                                                    </div>
                                                </th>
                                                <th className="border border-black px-2 ">Cash</th>
                                                <th className="border border-black px-2 ">Treasury</th>
                                                <th className="border border-black px-2 ">Bank</th>
                                                <th className="border border-black px-2 ">Head of Accounts</th><th className="border border-black relative p-2 h-24 vert">
                                                    <div className="absolute inset-0 flex items-center justify-center transform -rotate-90 whitespace-nowrap">
                                                        Entry By
                                                    </div>
                                                </th>
                                                <th className="border border-black relative p-2 h-24 vert">
                                                    <div className="absolute inset-0 flex items-center justify-center transform -rotate-90 whitespace-nowrap">
                                                        Verify By
                                                    </div>
                                                </th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.data?.map((i, index) => (
                                                <tr
                                                    key={i}
                                                    className={`border border-black text-center text-xs ${i?.receiptNarration === "Opening Balance" ? "bg-blue-200 openClr" : ""}`}
                                                    style={{ fontFamily: "InterVariable, sans-serif" }}
                                                >
                                                    <td className="border border-black px-2 ">{i?.receiptVoucherDate}</td>
                                                    <td className="border border-black px-2 text-left whitespace-normal">
                                                        {i?.receiptNarration}
                                                    </td>
                                                    <td className="border border-black p-0 align-top vert">
                                                        {i?.receiptVoucherId ? (
                                                            <div className="relative h-24 w-full min-w-[1.5rem]">  {/* Height only when ID exists */}
                                                                <div className="absolute inset-0 flex items-center justify-center whitespace-nowrap -rotate-90 origin-center transform">
                                                                    {i?.receiptVoucherId}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </td>
                                                    <td className={`border border-black px-2  text-right ${i?.receiptNarration === "Opening Balance" && String(i?.receiptCashAmount) === "0.00" ? "text-blue-200 blueclr" : i?.receiptNarration !== "Opening Balance" && String(i?.receiptCashAmount) === "0.00" ? "text-white whiteclr" : ""}`} style={{ textAlign: "right" }}>{i?.receiptCashAmount}</td>
                                                    {/* <td className={`border border-black px-2  text-right ${String(i?.receiptTryAmount) === "0.00" ? "text-white whiteclr" : ""} `} style={{ textAlign: "right" }}>{i?.receiptTryAmount}</td> */}
                                                    <td className={`border border-black px-2  text-right ${i?.receiptNarration === "Opening Balance" && String(i?.receiptTryAmount) === "0.00" ? "text-blue-200 blueclr" : i?.receiptNarration !== "Opening Balance" && String(i?.receiptTryAmount) === "0.00" ? "text-white whiteclr" : ""}`} style={{ textAlign: "right" }}>{i?.receiptTryAmount}</td>

                                                    <td className={`border border-black px-2  text-right ${i?.receiptNarration === "Opening Balance" && String(i?.receiptBankAmount) === "0.00" ? "text-blue-200 blueclr" : i?.receiptNarration !== "Opening Balance" && String(i?.receiptBankAmount) === "0.00" ? "text-white whiteclr" : ""}`} style={{ textAlign: "right" }}>{i?.receiptBankAmount}</td>


                                                    <td className="border border-black px-2  text-center">{i?.receiptAccountHead}</td>
                                                    <td className="border border-black p-0 align-top vert">
                                                        {i?.receiptEntryBy ? (
                                                            <div className="relative h-24 w-full min-w-[1.5rem]">  {/* Height only when ID exists */}
                                                                <div className="absolute inset-0 flex items-center justify-center whitespace-nowrap -rotate-90 origin-center transform">
                                                                    {i?.receiptEntryBy}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </td>
                                                    <td className="border border-black p-0 align-top vert">
                                                        {i?.receiptVerifyBy ? (
                                                            <div className="relative h-24 w-full min-w-[1.5rem]">  {/* Height only when ID exists */}
                                                                <div className="absolute inset-0 flex items-center justify-center whitespace-nowrap -rotate-90 origin-center transform">
                                                                    {i?.receiptVerifyBy}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </td>
                                                    <td className="border border-black px-2">{i?.paymentVoucherDate}</td>
                                                    <td className="border border-black px-2 text-left whitespace-normal">
                                                        {i?.paymentNarration}
                                                    </td>
                                                    <td className="border border-black p-0 align-top vert">
                                                        {i?.paymentVoucherId ? (
                                                            <div className="relative h-24 w-full min-w-[1.5rem]">  {/* Height only when ID exists */}
                                                                <div className="absolute inset-0 flex items-center justify-center whitespace-nowrap -rotate-90 origin-center transform">
                                                                    {i?.paymentVoucherId}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </td>

                                                    <td className={`border border-black px-2  text-right ${i?.receiptNarration === "Opening Balance" && String(i?.paymentCashAmount) !== "0.00" || i?.receiptNarration === "Opening Balance" && String(i?.paymentCashAmount) === "0.00" ? "text-blue-200 blueclr" : String(i?.paymentCashAmount) === "0.00" ? "text-white whiteclr" : ""}`} style={{ textAlign: "right" }}>{i?.paymentCashAmount}</td>
                                                    <td className={`border border-black px-2  text-right ${i?.receiptNarration === "Opening Balance" && String(i?.paymentTryAmount) !== "0.00" || i?.receiptNarration === "Opening Balance" && String(i?.paymentTryAmount) === "0.00" ? "text-blue-200 blueclr" : String(i?.paymentTryAmount) === "0.00" ? "text-white whiteclr" : ""}`} style={{ textAlign: "right" }}>{i?.paymentTryAmount}</td>
                                                    <td className={`border border-black px-2  text-right ${i?.receiptNarration === "Opening Balance" && String(i?.paymentBankAmount) !== "0.00" || i?.receiptNarration === "Opening Balance" && String(i?.paymentBankAmount) === "0.00" ? "text-blue-200 blueclr" : String(i?.paymentBankAmount) === "0.00" ? "text-white whiteclr" : ""}`} style={{ textAlign: "right" }}>{i?.paymentBankAmount}</td>
                                                    <td className="border border-black px-2  text-center">{i?.paymentAccountHead}</td>
                                                    <td className="border border-black p-0 align-top vert">
                                                        {i?.paymentEntryBy ? (
                                                            <div className="relative h-24 w-full min-w-[1.5rem]">  {/* Height only when ID exists */}
                                                                <div className="absolute inset-0 flex items-center justify-center whitespace-nowrap -rotate-90 origin-center transform">
                                                                    {i?.paymentEntryBy}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </td>

                                                    <td className="border border-black p-0 align-top vert">
                                                        {i?.paymentVerifyBy ? (
                                                            <div className="relative h-24 w-full min-w-[1.5rem]">  {/* Height only when ID exists */}
                                                                <div className="absolute inset-0 flex items-center justify-center whitespace-nowrap -rotate-90 origin-center transform">
                                                                    {i?.paymentVerifyBy}
                                                                </div>
                                                            </div>
                                                        ) : null}
                                                    </td>

                                                </tr>
                                            ))}

                                        </tbody>

                                    </table>
                                </div>

                                {/* <div className="mt-4 text-center text-xs italic foot" style={{ fontFamily: "InterVariable, sans-serif" }}></div> */}
                                {/* <div className="text-xs italic text-center">Page 1 of 8</div> */}
                                {/* <div className="text-xs italic text-right font-semibold">DINHATA -I PS</div> */}
                            </div>
                            {/* <div className="footer"><span className="page-number"></span></div> */}
                            <div className="flex justify-center space-x-4 ">
                                <div className="text-right text-xs mt-4 italic">
                                    <button className="bg-green-500 text-white px-4 h-10 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handlePrint}>
                                        Download PDF
                                    </button>
                                </div>
                            </div>
                        </div>) : null}
                </div>
            </div>
        </div>

    );
};

export default CashBook;