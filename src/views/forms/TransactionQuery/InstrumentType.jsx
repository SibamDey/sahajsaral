import { useState, useEffect, useRef, useMemo } from "react";
import classNames from "classnames";
import { ToastContainer, toast } from "react-toastify";
import { getInstrumentType } from "../../../Service/TransactionQuery/TransactionQueryService";
import { getRealAccList } from "../../../Service/Transaction/TransactionService";

const InstrumentType = () => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [instrumentType, setInstrumentType] = useState("");
    const [instrumentNo, setInstrumentNo] = useState("");
    const [data, setData] = useState([]);
    const [realAccList, setRealAccList] = useState();
    const [bank, setBank] = useState();

    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);

    const instrumentTypeData = [
        { value: "None", label: "None" },
        { value: "Cheque", label: "Cheque" },
        { value: "Challan", label: "Challan" },
        { value: "DD", label: "DD" },
        { value: "Advice", label: "Advice" },
        { value: "By Transfer", label: "By Transfer" },
        { value: "Token", label: "Token" },
        { value: "Penal Interest", label: "Penal Interest" },
        { value: "Bank Interest", label: "Bank Interest" },
        { value: "Bank Charges", label: "Bank Charges" },
        { value: "Fund Transfer", label: "Fund Transfer" },
        { value: "Certificate", label: "Certificate" },
        { value: "Online", label: "Online" },
        { value: "ECS", label: "ECS" },
        { value: "PFMS", label: "PFMS" },
        { value: "Bill", label: "Bill" },
        { value: "UPI Trn ID", label: "UPI Trn ID" },
        { value: "Direct Deposit", label: "Direct Deposit" }
    ];

    const onInstrumentType = (e) => {
        setInstrumentType(e.target.value);
        setData([]);
    }

    const onInstrumentNo = (e) => {
        setInstrumentNo(e.target.value)
    }

    const onSearch = () => {
        if (!fromDate) {
            toast.error("Please select from date");
        } else if (!toDate) {
            toast.error("Please select to date");
        } else {
            getInstrumentType(userData.CORE_LGD, fromDate, toDate, instrumentType ? instrumentType : 0, instrumentNo ? instrumentNo : 0, bank ? bank : 0)
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

    return (
        <>

            <ToastContainer />

            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Instrument Type & No.</legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full space-y-2">
                        <div className="flex items-center gap-4 ">
                            {/* Group ID */}
                            <div className="flex-1">
                                <label
                                    htmlFor="financial_institute"
                                    className="block text-sm font-medium text-gray-700 "
                                >
                                    Instrument Type
                                </label>
                                <select
                                    id="financial_institute"
                                    name="financial_institute"
                                    autoComplete="off"
                                    className="text-sm mt-1 p-2 block w-full border border-gray-300 rounded-md h-9"
                                    onChange={onInstrumentType}
                                    value={instrumentType}

                                >
                                    <option value="" selected>
                                        Select Instrument Type
                                    </option>
                                    {instrumentTypeData?.map((d, i) => (

                                        <option value={d?.value}>
                                            {d?.label}
                                        </option>
                                    ))}




                                    {/* {EntityListDropDown} */}
                                </select>
                            </div>
                            <div className="flex-1">
                                <label
                                    htmlFor="financial_institute"
                                    className="block text-sm font-medium text-gray-700 "
                                >
                                    Instrument No
                                </label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Instrument No"
                                    className="text-sm mt-1 p-2 block w-full border border-gray-300 rounded-md h-9"
                                    onChange={onInstrumentNo}
                                />

                            </div>
                            <div className="w-1/4">

                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Bank Account

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
                {data?.length > 0 ?
                    <div className="p-4">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-cyan-500 text-sm">
                                    <th className="border p-2">GL Group</th>
                                    <th className="border p-2">Bank A/C</th>
                                    <th className="border p-2">Voucher ID</th>
                                    <th className="border p-2">Voucher Date</th>
                                    <th className="border p-2">Voucher Desc</th>
                                    <th className="border p-2">Voucher Amount</th>
                                    <th className="border p-2">Pay To</th>
                                    <th className="border p-2">Instrument Type</th>
                                    <th className="border p-2">Instrument No</th>
                                    <th className="border p-2">Instrument Date</th>
                                    <th className="border p-2">Instrument Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.map((entry, index) => (
                                    <tr key={index} className="text-right bg-white-200">
                                        <td className="border p-2 text-center text-sm">{entry?.glGroupName}</td>
                                        <td className="border p-2 text-center text-sm">{entry?.accountCodeDesc}</td>
                                        <td className="border p-2 text-center text-sm">{entry?.voucherId}</td>
                                        <td className="border p-2 text-center text-sm">{entry?.voucherDate}</td>
                                        <td className="border p-2 text-center text-sm">{entry?.voucherDesc}</td>
                                        <td className="border p-2 text-right text-sm">{entry?.voucherAmount}</td>
                                        <td className="border p-2 text-center text-sm">{entry?.payTo}</td>
                                        <td className="border p-2 text-center text-sm">{entry?.instrumentType}</td>
                                        <td className="border p-2 text-center text-sm">{entry?.instrumentNo}</td>
                                        <td className="border p-2 text-center text-sm">{entry?.instrumentDate}</td>
                                        <td className="border p-2 text-center text-sm">{entry?.instrumentDetails}</td>
                                    </tr>
                                ))}
                            </tbody>
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

export default InstrumentType;
