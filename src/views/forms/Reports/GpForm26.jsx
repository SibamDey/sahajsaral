import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { getRealAccList } from "../../../Service/Transaction/TransactionService";
import { getGpForm26 } from "../../../Service/Reports/ReportsService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LOGO from "../../../Img/logo.png"
import { getDistrictListforEvent, getBlockList, getGpList, getParabaithakActivity } from "../../../Service/Project/ActivityDetailsService";
import { getLgdDetails } from "../../../Service/LgdCodeGet/LgdCodeService";
import { getStatus } from "../../../Service/Reports/ReportsService";

const GpForm26 = () => {
    const getCurrentDate = () => new Date().toISOString().split("T")[0];
    // State for From Date, To Date, and Input Box
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState(getCurrentDate());
    const [realAccList, setRealAccList] = useState();
    const [bank, setBank] = useState();
    const [data, setData] = useState();
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const [gpForm26Dtls, setGpForm26Dtls] = useState([]);
    const [district, setDistrict] = useState();
    const [block, setBlock] = useState();
    const [gp, setGp] = useState();
    const [getDistrictDataList, setDistrictDataList] = useState([]);
    const [getBlockDataList, setBlockDataList] = useState([]);
    const [getGpDataList, setGpDataList] = useState([]);
    const printRef = useRef();
    const [statusData, setStatus] = useState();
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

    const onSearch = () => {
        if (!district) {
            toast.error("Please select a District");
        } else if (!fromDate) {
            toast.error("Please select a From Date");
        } else if (!toDate) {
            toast.error("Please select a To Date");
        } else {
            getGpForm26(userData?.CORE_LGD, fromDate, toDate,).then((response) => {
                if (response.status === 200) {
                    { response?.data?.statusMsg === "Success" ? toast.success("Data Fetched Successfully") : toast.error(response?.data?.statusMsg) }
                    setGpForm26Dtls(response.data);
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


    return (

        <div>
            <ToastContainer />
            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">GP Form-26</legend>
                {/* From Date */}
                <div className=" flex flex-col space-y-2 py-1">
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
                    {gpForm26Dtls?.dtls?.length > 0 ?
                        <div className=" bg-white shadow-lg border text-xs">
                            <div ref={printRef} id="voucher-container" style={{ position: "relative" }} className=" bg-white p-4 shadow-lg text-xs">
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


                                        {fromDate && toDate &&
                                            ((new Date(toDate)).getTime() - (new Date(fromDate)).getTime()) / (1000 * 3600 * 24) > 30 ? (
                                            <p
                                                className="text-center font-bold text-xl text-cyan-700 bigbold"
                                                style={{ fontFamily: "InterVariable, sans-serif" }}
                                            >
                                                FORM 27 [See Rule 27(2) And 27(3)]
                                            </p>
                                        ) : <p
                                            className="text-center font-bold text-xl text-cyan-700 bigbold"
                                            style={{ fontFamily: "InterVariable, sans-serif" }}
                                        >
                                            FORM 26 [SEE RULE 27(1)]
                                        </p>}

                                        <p className="text-center font-bold text-xl text-cyan-700 bigbold" style={{ fontFamily: "InterVariable, sans-serif" }}>
                                            MONTHLY STATEMENT OF FUND POSITION
                                        </p>

                                        <div className="text-center font-bold text-lg text-cyan-700 bigbold mb-4" style={{ fontFamily: "InterVariable, sans-serif", marginBottom: "0px" }}>
                                            {statusData?.statusTag}
                                        </div>

                                    </div>

                                </div>

                                <div className="text-left font-semibold text-sm text-cyan-700">
                                    Period: {fromDate} to {toDate}
                                </div>




                                <div className="mt-2 overflow-x-auto">
                                    <table className="w-full border-collapse border text-xs">
                                        <thead>
                                            <tr className="text-black-700">
                                                <th className="border p-2">CLASSIFICATION OF FUND</th>
                                                <th className="border p-2">BALANCE OF FUND AT THE BEGINING OF THE MONTH</th>
                                                <th className="border p-2">FUND
                                                    RECEIVED
                                                    DURING THE
                                                    MONTH</th>
                                                <th className="border p-2">TOTAL FUND
                                                    AVAILABLE
                                                    <br></br>(COL 2+COL 3)</th>
                                                <th className="border p-2">PAYMENT
                                                    MADE
                                                    DURING THE
                                                    MONTH</th>
                                                <th className="border p-2">BALANCE
                                                    FUND
                                                    AVAILABLE (COL 4-COL 5)</th>
                                                <th className="border p-2">PAYMENT
                                                    COMMITMENT [TOTAL PENDING
                                                    PAYMENT]</th>
                                                <th className="border p-2">NET
                                                    BALANCE (COL 6-COL 7)</th>

                                            </tr>
                                            <tr className="text-black-700">
                                                <th className="border p-2">[1]</th>
                                                <th className="border p-2">[2]</th>
                                                <th className="border p-2">[3]</th>
                                                <th className="border p-2">[4]</th>
                                                <th className="border p-2">[5]</th>
                                                <th className="border p-2">[6]</th>
                                                <th className="border p-2">[7]</th>
                                                <th className="border p-2">[8]</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {gpForm26Dtls?.dtls?.map((entry, index) => (
                                                <tr key={index} className={entry?.receiptGroupId ? "font-bold bg-blue-200 text-right tbsize" : entry?.receiptGroupName === "SUB TOTAL" ? "font-bold text-right tbsize" : "text-right tbsize"}>
                                                    <td className="border p-2 text-left">{entry?.receiptGroupName}</td>
                                                    <td className="border p-2 rightall">{entry?.openingBalance}</td>
                                                    <td className="border p-2 rightall">{entry?.receiptAmount}</td>
                                                    <td className="border p-2 rightall">{entry?.fundTotal}</td>
                                                    <td className="border p-2 rightall">{entry?.paymentAmount}</td>
                                                    <td className="border p-2 rightall">{entry?.fundAvailable}</td>
                                                    <td className="border p-2 rightall">{entry?.paymentCommitment}</td>
                                                    <td className="border p-2 rightall">{entry?.closingBalance}</td>

                                                </tr>
                                            ))}
                                        </tbody>
                                        <tr className="text-right text-black-800 font-bold">
                                            <td className="border p-2 text-left">GRAND TOTAL</td>

                                            <td className="border p-2 ">{gpForm26Dtls?.total?.totalOpeningBalance}</td>
                                            <td className="border p-2">{gpForm26Dtls?.total?.totalReceiptAmount}</td>
                                            <td className="border p-2">{gpForm26Dtls?.total?.totalFundTotal}</td>
                                            <td className="border p-2">{gpForm26Dtls?.total?.totalPpaymentAmount}</td>
                                            <td className="border p-2">{gpForm26Dtls?.total?.totalFundAvailable}</td>
                                            <td className="border p-2">{gpForm26Dtls?.total?.totalPaymentCommitment}</td>
                                            <td className="border p-2">{gpForm26Dtls?.total?.totalClosingBalance}</td>

                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <div className="flex justify-center space-x-4 py-1">
                                <div className="text-right text-xs mt-4 italic">
                                    <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handlePrint}>
                                        Download PDF
                                    </button>
                                </div>
                            </div>
                        </div> : ""}

                    {gpForm26Dtls?.length === 0 ? <div className="flex items-center justify-center bg-gray-200" style={{ marginTop: "10px" }}>
                        <div className="text-center">
                            <h1 className="text-xl font-semibold text-black-800">No Data Found</h1>

                        </div>
                    </div> : ""}
                </div>
            </div>
        </div>

    );
};

export default GpForm26;

