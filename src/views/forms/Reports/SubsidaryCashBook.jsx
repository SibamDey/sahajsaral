import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { getRealAccList } from "../../../Service/Transaction/TransactionService";
import { getSubsidaryCashbook, getStatus } from "../../../Service/Reports/ReportsService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LOGO from "../../../Img/logo.png"
import { getLgdDetails } from "../../../Service/LgdCodeGet/LgdCodeService";
import { getDistrictListforEvent, getBlockList, getGpList, getParabaithakActivity } from "../../../Service/Project/ActivityDetailsService";
import { format } from "date-fns";

const SubsidaryCashBook = () => {
    const getCurrentDate = () => new Date().toISOString().split("T")[0];
    // State for From Date, To Date, and Input Box
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState(getCurrentDate());
    const [realAccList, setRealAccList] = useState();
    const [bank, setBank] = useState();
    const [data, setData] = useState();
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const printRef = useRef();
    const [statusData, setStatus] = useState();
    const [lgd, setLgd] = useState([]);
    const [district, setDistrict] = useState();
    const [block, setBlock] = useState();
    const [gp, setGp] = useState();
    const [getDistrictDataList, setDistrictDataList] = useState([]);
    const [getBlockDataList, setBlockDataList] = useState([]);
    const [getGpDataList, setGpDataList] = useState([]);



    useEffect(() => {
        getRealAccList(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,

        ).then(function (result) {
            const response = result?.data;
            setRealAccList(response);


        })

        getLgdDetails(userData?.CORE_LGD).then((response) => {
            if (response.status === 200) {
                setLgd(response.data);
            } else {
                toast.error("Failed to fetch data");
            }
        });
    }, []);

    const onBank = (e) => {
        setBank(e.target.value);
    }

    const onSearch = () => {
        if (!bank) {
            toast.error("Please select a Bank Account");
        } else if (!fromDate) {
            toast.error("Please select a From Date");
        } else if (!toDate) {
            toast.error("Please select a To Date");
        } else {
            getSubsidaryCashbook(userData?.CORE_LGD, bank, fromDate, toDate,).then((response) => {
                if (response.status === 200) {
                    toast.error(response?.data?.message);
                    setData(response.data);
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
                <title>Subsidary Cash Book</title>
                <style>
                .prd{float:left; font-weight:bold;text-align:left;margin:10px !important;padding:0 !important;}
                .stts{float:right; font-weight:bold;text-align:right;margin:10px !important;padding:0 !important;}
                .logo{float:left;width:200px;}
                .logo p{margin:10px;}
                .info h2{text-align:center}
                .prn-dt{text-align:right !important;position:absolute;top:0px;right:0px !important;}
                .info{text-align:center !important;}
                    .info p,.info h2{text-align:center !important;margin:10px;}
                    .info span{text-align:center}
                    .xx{position:relative;}
                    .sch{margin-top:10px !important;text-align:center !important;}
                    .info p:last-child{margin-top:10px !important;}

                  @media print {

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

                      .whiteclr {
  color: #fff !important; /* Black text color */
  }

  .openClr {
  background-color: #cce5ff !important; /* Light blue background */
  }

  .blueclr {
  color: #cce5ff !important; /* Blue text color */
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

    const formatCurrentDate = () => {
        const options = { weekday: "long", day: "2-digit", month: "long", year: "numeric" };
        const today = new Date();

        // Format the date with commas
        return today.toLocaleDateString("en-GB", options).replace(/ (\d{2}) /, ", $1 ");
    };

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


    return (

        <div>
            <ToastContainer />
            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Subsidary Cash Book</legend>
                <div className=" flex flex-col space-y-2 ">
                    <div className="flex flex-col w-full mb-4 space-y-2">
                        <div className="flex items-center w-full space-x-2 p-2">
                            {/* <div className="w-1/4">
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

                            <div className="w-1/4 px-2">
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

                            <div className="w-1/4 px-2">
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
                            </div> */}

                            <div className="w-1/4">

                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Bank Account <span className="text-red-500 "> * </span>

                                </label>
                                <select
                                    className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
                                    onChange={onBank}
                                    value={bank}
                                >
                                    <option value="" selected hidden>--Select Bank Account--</option>

                                    {realAccList?.map((d) => (
                                        <option value={d?.accountCode}>
                                            {d?.accountCodeDesc}
                                        </option>
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
                </div>
            </div>
            {data ?
                <div className="p-6 bg-white min-h-screen flex flex-col items-center">
                    <div ref={printRef} className="max-w-6xl w-full bg-white p-6 shadow-lg border border-gray-300">
                        <div className="flex justify-between items-start mb-4 ">
                            <div className="text-left logo w-1/4">
                                {/* <img src={LOGO} alt="Logo" className="h-12 mb-2 logo" /> */}
                                <p className="text-blue-700 font-bold text-sm">{data?.bank?.bankName}</p>
                                <p className="text-blue-700 font-bold text-sm">{data?.bank?.branchName}</p>
                                <p className="text-blue-700 font-bold text-sm">Account No.: <span className="font-bold">{data?.bank?.accountNo}</span></p>
                            </div>
                            <div className="w-1/4 text-center info" style={{ fontFamily: "InterVariable, sans-serif" }}>
                                <span className="text-xs font-bold" style={{ fontFamily: "InterVariable, sans-serif", margin: "0", padding: "0" }}>FORM NO: 1A RULE : 6(5)(D)</span>
                                <h2 className="text-xl font-bold" style={{ fontFamily: "InterVariable, sans-serif", padding: "0" }}>Subsidiary Cash Book</h2>
                                <p className="font-semibold" style={{ fontFamily: "InterVariable, sans-serif", margin: "0", padding: "0" }}>{lgd[0]?.lsgName}</p>
                                <p className="font-semibold" style={{ fontFamily: "InterVariable, sans-serif", margin: "0", padding: "0" }}>{lgd[0]?.lgdAdd1}</p>
                                {/* <p className="font-semibold" style={{ fontFamily: "InterVariable, sans-serif", margin: "0", padding: "0" }}>{realAccList.find((c) => c.accountCode === bank)?.accountCodeDesc}</p> */}
                            </div>
                            <div className="w-1/4 text-right font-bold italic text-sm prn-dt" style={{ fontFamily: "InterVariable, sans-serif" }}>
                                <p>{formatCurrentDate()}</p>
                            </div>
                        </div>
                        <div className="flex justify-between text-center text-sm" style={{ fontFamily: "InterVariable, sans-serif" }}>
                            <p className="font-semibold text-center text-xs prd" style={{ fontFamily: "InterVariable, sans-serif", margin: "0", padding: "0" }}>Period: <span className="font-normal">{format(new Date(fromDate), "dd-MM-yyyy")} to {format(new Date(toDate), "dd-MM-yyyy")}</span></p>
                            {/* <p className="font-semibold text-center text-xs">Name of scheme: <span className="font-normal">{data?.bank?.schemeName}</span></p> */}
                            <div className="text-right font-bold italic text-xs stts">{statusData?.statusTag}</div>

                        </div>
                        {bank === "900000001" ? "" :
                            <div className="text-center text-sm sch">
                                {/* <p className="font-semibold text-left text-xs">Period: <span className="font-normal">{fromDate} to {toDate}</span></p> */}
                                {/* <p className="font-semibold text-center text-xs"> <span className="font-normal text-center">{lgd[0]?.lgdAdd1}</span></p> */}
                                <p className="font-semibold text-center text-xs"> <span className="font-normal text-center">{realAccList.find((c) => c.accountCode === bank)?.accountCodeDesc}</span></p>

                                {/* <div className="text-right font-bold italic text-xs">{data?.bank?.voucherStts}</div> */}

                            </div>}

                        {/* Table Section */}
                        <div className="mt-2 overflow-x-auto">
                            <table className="w-full border-collapse border border-black text-sm">
                                <thead>
                                    <tr className="border border-black text-center">
                                        <th colSpan={4} className="border border-black py-2">Receipt</th>
                                        <th colSpan={5} className="border border-black py-2">Payment</th>
                                    </tr>
                                    <tr className="border border-black text-center">
                                        <th className="border border-black px-2 py-1">Date</th>
                                        <th className="border border-black px-2 py-1 text-left">Particulars</th>
                                        <th className="border border-black px-2 py-1">Voucher Id.</th>
                                        <th className="border border-black px-2 py-1">Amount</th>
                                        <th className="border border-black px-2 py-1">Date</th>
                                        <th className="border border-black px-2 py-1 text-left">Particulars</th>
                                        <th className="border border-black px-2 py-1">Voucher Id.</th>
                                        <th className="border border-black px-2 py-1">Amount</th>
                                        <th className="border border-black px-2 py-1">Remarks</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.dtls?.map((i, index) => (
                                        <tr key={i} className={`border border-black text-center text-xs ${i?.receiptParticulars === "Opening Balance" ? "bg-blue-200 openClr" : i?.paymentParticulars === "Total Payments" ? "" : i?.paymentParticulars === "Closing Balance" ? "" : ""
                                            }`} style={{ fontFamily: "InterVariable, sans-serif" }}>
                                            <td className="border border-black px-2 py-1">{i?.receiptDate}</td>
                                            <td className="border border-black px-2 py-1 text-left">{i?.receiptParticulars}</td>
                                            <td className="border border-black px-2 py-1">{i?.receiptVoucherId}</td>
                                            <td className={`border border-black px-2 py-1 text-right ${String(i?.receiptVoucherAmount) === "0.00" ? "text-white whiteclr" : ""} `}>{i?.receiptVoucherAmount}</td>
                                            <td className="border border-black px-2 py-1">{i?.paymentDate}</td>
                                            <td className="border border-black px-2 py-1 text-left">{i?.paymentParticulars}</td>
                                            <td className="border border-black px-2 py-1">{i?.paymentVoucherId}</td>
                                            <td className={`border border-black px-2 py-1 text-right ${i?.receiptParticulars === "Opening Balance" && String(i?.paymentVoucherAmount) !== "0.00" || i?.receiptParticulars === "Opening Balance" && String(i?.paymentVoucherAmount) === "0.00" ? "text-blue-200 blueclr" : String(i?.paymentVoucherAmount) === "0.00" ? "text-white whiteclr" : ""} `}>{i?.paymentVoucherAmount}</td>
                                            <td className="border border-black px-2 py-1"></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 text-center text-xs italic foot" style={{ fontFamily: "InterVariable, sans-serif" }}>Sahaj-Saral :: Subsidary Cash Book :: {lgd[0]?.lsgName}</div>

                    </div>
                    <div className="flex justify-center space-x-4 ">
                        <div className="text-right text-xs mt-4 italic">
                            <button className="bg-green-500 text-white px-4 h-10 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handlePrint}>
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div> : ""}
        </div>

    );
};

export default SubsidaryCashBook;
