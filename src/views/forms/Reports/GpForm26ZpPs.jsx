import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { getRealAccList } from "../../../Service/Transaction/TransactionService";
import { getGpForm26 } from "../../../Service/Reports/ReportsService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LOGO from "../../../Img/logo.png"
import { getDistrictListforEvent, getBlockList, getGpList, getParabaithakActivity } from "../../../Service/Project/ActivityDetailsService";


const GpForm26ZpPs = () => {
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
            getGpForm26(district != 0 && block != 0 && gp != 0 ? gp : district != 0 && block != 0 && gp == 0 ? block : district != 0 && block == 0 && gp == 0 ? district : 0, fromDate, toDate,).then((response) => {
                if (response.status === 200) {
                    { response?.data?.statusMsg === "Success" ? toast.success("Data Fetched Successfully") : toast.error(response?.data?.statusMsg) }
                    setGpForm26Dtls(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });

        }
    }


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
                            </div>
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
                            <div id="voucher-container" className=" bg-white p-4 shadow-lg text-xs">

                                {/* Header */}
                                <div className="flex w-full justify-between items-center relative">
                                    {/* Centered span message */}
                                    <span className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-black-700">
                                        FORM 26 [SEE RULE 27(1)]


                                    </span>


                                </div>
                                <div className="flex w-full justify-between items-center relative">
                                    {/* Centered span message */}
                                    <span className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-black-700">
                                        MONTHLY STATEMENT OF FUND POSITION

                                    </span>

                                    {/* Right-aligned image */}
                                    <div className="w-24 h-12 flex items-center justify-end ml-auto">
                                        <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                                    </div>
                                </div>
                                <div className="text-center font-bold text-md text-cyan-700">
                                    {/* {reportType} */} OFFICE OF THE JATESWAR-II GRAM PANCHAYAT <br></br>
                                    <span>UNDER FALAKATA PANCHAYAT SAMITY, DISTRICT - ALIPURDUAR</span>
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
                                                <tr key={index} className={entry?.receiptGroupId ? "font-bold bg-blue-200 text-right" : entry?.receiptGroupName === "SUB TOTAL" ? "font-bold text-right" : "text-right"}>
                                                    <td className="border p-2 text-left">{entry?.receiptGroupName}</td>
                                                    <td className="border p-2">{entry?.openingBalance}</td>
                                                    <td className="border p-2">{entry?.receiptAmount}</td>
                                                    <td className="border p-2">{entry?.fundTotal}</td>
                                                    <td className="border p-2">{entry?.paymentAmount}</td>
                                                    <td className="border p-2">{entry?.fundAvailable}</td>
                                                    <td className="border p-2">{entry?.paymentCommitment}</td>
                                                    <td className="border p-2">{entry?.closingBalance}</td>

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

export default GpForm26ZpPs;
