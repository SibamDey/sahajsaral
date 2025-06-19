import { useState, useEffect, useRef, useMemo } from "react";
import classNames from "classnames";
import { ToastContainer, toast } from "react-toastify";
import { getHeadwiseTransit, getHeadwiseLiquid, getHeadwiseBalance, getHeadwiseAdvance } from "../../../Service/Document/DocumentService";

const HeadWiseTransit = () => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [reportType, setReportType] = useState("");
    const [data, setData] = useState([]);
    console.log(data, "data")

    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);

    const onReportType = (e) => {
        setReportType(e.target.value);
        setData([]);
    }

    const onSearch = () => {
        if (!reportType) {
            toast.error("Please select report type");
        } else if (!fromDate) {
            toast.error("Please select from date");
        } else if (!toDate) {
            toast.error("Please select to date");
        } else {
            if (reportType === "T") {
                getHeadwiseTransit(userData.CORE_LGD, fromDate, toDate)
                    .then((res) => {
                        setData(res?.data)
                        if (res?.data?.statusCode == 1) {
                            toast.error(res?.data?.statusMsg)
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else if (reportType === "L") {
                getHeadwiseLiquid(userData.CORE_LGD, fromDate, toDate)
                    .then((res) => {
                        setData(res?.data)
                        if (res?.data?.statusCode == 1) {
                            toast.error(res?.data?.statusMsg)
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else if (reportType === "B") {
                getHeadwiseBalance(userData.CORE_LGD, fromDate, toDate)
                    .then((res) => {
                        setData(res?.data)
                        if (res?.data?.statusCode == 1) {
                            toast.error(res?.data?.statusMsg)
                        }
                    })
                    .catch((err) => {
                        console.log(err, "err");
                    });
            } else if (reportType === "A")

                getHeadwiseAdvance(userData.CORE_LGD, fromDate, toDate)
                    .then((res) => {
                        setData(res?.data)
                        if (res?.data?.statusCode == 1) {
                            toast.error(res?.data?.statusMsg)
                        }
                    })
                    .catch((err) => {
                        console.log(err, "err");
                    });

        }
    }


    const totals = {
        openingBalance: 0,
        receiptAmount: 0,
        paymentAmount: 0,
        closingBalance: 0,
        advanceAmount: 0,
        adjustAmount: 0
    };

    data?.dtls?.forEach(item => {
        totals.openingBalance += parseFloat(item.openingBalance) || 0;
        totals.receiptAmount += parseFloat(item.receiptAmount) || 0;
        totals.paymentAmount += parseFloat(item.paymentAmount) || 0;
        totals.closingBalance += parseFloat(item.closingBalance) || 0;
        totals.advanceAmount += parseFloat(item.advanceAmount) || 0;
        totals.adjustAmount += parseFloat(item.adjustAmount) || 0;
    });

    console.log(totals?.advanceAmount, "sssss")

    return (
        <>

            <ToastContainer />

            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Headwise-Balance</legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full space-y-2">
                        <div className="flex items-center gap-4 ">
                            <div className="flex-1">
                                <label
                                    htmlFor="financial_institute"
                                    className="block text-sm font-medium text-gray-700 "
                                >
                                    Report Type <span className="text-red-500"> * </span>
                                </label>
                                <select
                                    id="financial_institute"
                                    name="financial_institute"
                                    autoComplete="off"
                                    className="text-sm mt-1 p-2 block w-full border border-gray-300 rounded-md h-9"
                                    onChange={onReportType}

                                >
                                    <option value="" selected hidden>
                                        Select Report Type
                                    </option>
                                    <option value="T">
                                        Headwise-Transit
                                    </option>
                                    <option value="A">
                                        Headwise-Advance
                                    </option>
                                    <option value="L">
                                        Headwise-Liquid-Cash
                                    </option>
                                    <option value="B">
                                        Headwise-Balance
                                    </option>

                                    {/* {EntityListDropDown} */}
                                </select>
                            </div>
                            {/* Branch Name */}
                            <div className="flex-1">
                                <label
                                    htmlFor="branch_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    From date<span className="text-red-500"> * </span>
                                </label>
                                <input
                                    id="From"
                                    name="From"
                                    type="Date"
                                    onChange={(e) => { setFromDate(e.target.value) }}
                                    className="text-sm h-9 mt-1 p-2 block w-full border border-gray-300 rounded-md"

                                />
                            </div>

                            {/* Branch IFSC */}
                            <div className="flex-1">
                                <label
                                    htmlFor="branch_ifsc"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    To Date<span className="text-red-500"> * </span>
                                </label>
                                <input
                                    id="To"
                                    name="To"
                                    type="Date"
                                    className="text-sm h-9 mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                    onChange={(e) => { setToDate(e.target.value) }}
                                />
                            </div>


                            <div className="flex-1">
                                <button
                                    style={{ marginTop: "22px" }}
                                    type="button"
                                    className={classNames(
                                        "py-2 px-6 border border-transparent rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500",

                                    )}
                                    onClick={onSearch}
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
                {data?.dtls?.length > 0 ?
                    <div className="p-4">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-cyan-500">
                                    <th className="border p-2">#</th>
                                    <th className="border p-2">GL Group ID</th>
                                    <th className="border p-2">GL Group Name</th>
                                    <th className="border p-2">Opening Balance</th>
                                    {reportType === "A" ? <>
                                        <th className="border p-2">Advance Amount</th>
                                        <th className="border p-2">Adjustment Amount</th></> :
                                        <>
                                            <th className="border p-2">Receipt Amount</th>
                                            <th className="border p-2">Payment Amount</th></>
                                    }
                                    <th className="border p-2">Closing Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.dtls?.map((entry, index) => (
                                    <tr key={index} className="text-right bg-white-200">
                                        <td className="border p-2 text-left text-sm">{index + 1}</td>
                                        <td className="border p-2 text-left text-sm">{entry.glGroupId}</td>
                                        <td className="border p-2 text-left text-sm">{entry.glGroupName}</td>
                                        <td className="border p-2 text-sm">{entry.openingBalance}</td>
                                        {reportType === "A" ? <>
                                            <td className="border p-2 text-sm">{entry.advanceAmount}</td>
                                            <td className="border p-2 text-sm">{entry.adjustAmount}</td>
                                        </> : <>
                                            <td className="border p-2 text-sm">{entry.receiptAmount}</td>
                                            <td className="border p-2 text-sm">{entry.paymentAmount}</td>
                                        </>}
                                        <td className="border p-2 text-sm">{entry.closingBalance}</td>
                                    </tr>
                                ))}

                            </tbody>
                            <tfoot>
                                <tr className="bg-gray-300 font-bold text-black">
                                    <td colSpan="2" className="border p-2 text-right text-sm"></td>
                                    <td className="border p-2 text-right text-sm">Grand Total:</td>
                                    <td className="border p-2 text-right text-sm">{(totals?.openingBalance).toFixed(2)}</td>
                                    {reportType === "A" ? <>
                                        <td className="border p-2 text-right text-sm">{(totals?.advanceAmount).toFixed(2)}</td>
                                        <td className="border p-2 text-right text-sm">{(totals?.adjustAmount).toFixed(2)}</td>
                                    </> : <>
                                        <td className="border p-2 text-right text-sm">{(totals?.receiptAmount).toFixed(2)}</td>
                                        <td className="border p-2 text-right text-sm">{(totals?.paymentAmount).toFixed(2)}</td>
                                    </>}


                                    <td className="border p-2 text-right text-sm">{(totals?.closingBalance).toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div> :
                    <div className="flex items-center justify-center h-10 bg-gray-100 rounded-lg shadow-md text-gray-700 text-lg font-semibold">
                        No Data Found
                    </div>
                }


            </div>
        </>
    );
};

export default HeadWiseTransit;
