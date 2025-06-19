import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getNominalAccountForOBList, addInsertNominalAccountOB } from "../../../Service/OpeningBalance/OpeningBalance";
import { getBankName, getReconsiliation, addReconsilition } from "../../../Service/Utility/UtilityService";

const ReconsilationHelp = () => {
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [type, setType] = useState("");
    const [bank, setBank] = useState("");
    const [instrumentNo, setInstrumentNo] = useState("");
    const [conStatus, setConStatus] = useState("");
    const [bankList, setBankList] = useState([]);
    const [data, setData] = useState([]);


    const handleInputChange = (index, key, value) => {
        const updatedData = [...data];
        updatedData[index] = {
            ...updatedData[index],
            [key]: value === "" ? null : value,
            lgdCode: userData?.CORE_LGD,
            userIndex: userData?.USER_INDEX
        };
        setData(updatedData);
    };



    useEffect(() => {
        getBankName(userData?.CORE_LGD,
        ).then(function (result) {
            const response = result?.data;
            console.log(response, "resresres")
            setBankList(response);
        });

    }, []);


    const onType = (e) => {
        setType(e.target.value)
    }

    const onBank = (e) => {
        setBank(e.target.value)
    }

    const onInstrumentNo = (e) => {
        setInstrumentNo(e.target.value)
    }

    const onStatus = (e) => {
        setConStatus(e.target.value)
    }

    const parseDMYToISO = (dateStr) => {
        const [day, month, year] = dateStr.split(".");
        console.log(day, month, year, "year")
        return `${year}-${month}-${day}`; // YYYY-MM-DD
    };

    console.log(parseDMYToISO("01.02.2025"), "dateStr")


    const onSearch = () => {
        if (!fromDate) {
            toast.error("Please select From Date");

        } else if (!toDate) {
            toast.error("Please select To Date");
        } else if (!type) {
            toast.error("Please select a Type");
        } else if (!bank) {
            toast.error("Please select Bank Account");
        } else if (!conStatus) {
            toast.error("Please select a Status");
        } else {
            getReconsiliation(userData?.CORE_LGD, bank, type, fromDate, toDate, instrumentNo ? instrumentNo : 0, conStatus).then((response) => {
                if (response.status === 200) {
                    setData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        }
    }
    console.log(data, "data")

    const onSave = () => {
        // Ensure reconDate is set to null if it's an empty string before making the API call
        const modifiedData = data.map(item => ({
            ...item,
            reconDate: item.reconDate === "" ? null : item.reconDate,
        }));

        addReconsilition(modifiedData, (r) => {
            console.log(r, "dd");
            if (r.status == 0) {
                setData([]);
                setFromDate("");
                setToDate("");
                setType("");
                setBank("");
                setInstrumentNo("");
                setConStatus("");
                toast.success(r.message);
            } else if (r.status == 1) {
                toast.error(r.message);
            }
        });
    };


    return (
        <>
            <ToastContainer />

            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Cheque Status as per Pass Book</legend>
                <div className=" flex flex-col space-y-2 py-1">
                    <div className=" flex flex-col space-y-2 py-1">
                        <div className="flex flex-col w-full space-y-2">
                            <div className="flex items-center gap-4">
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
                                        value={fromDate}
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
                                        value={toDate}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label
                                        htmlFor="financial_institute"
                                        className="block text-sm font-medium text-gray-700 "
                                    >
                                        Type<span className="text-red-500"> * </span>
                                    </label>
                                    <select
                                        id="financial_institute"
                                        name="financial_institute"
                                        autoComplete="off"
                                        className="text-sm mt-1 p-2 block w-full border border-gray-300 rounded-md h-9"
                                        onChange={onType}
                                        value={type}

                                    >
                                        <option value="">--Select Type--</option>
                                        <option value="P">Withdrawal (Payment)</option>
                                        <option value="R">Deposit (Receipt)</option>
                                        {/* {EntityListDropDown} */}
                                    </select>
                                </div>

                                <div className="flex-1">
                                    <label
                                        htmlFor="financial_institute"
                                        className="block text-sm font-medium text-gray-700 "
                                    >
                                        Bank Account<span className="text-red-500"> * </span>
                                    </label>
                                    <select
                                        id="financial_institute"
                                        name="financial_institute"
                                        autoComplete="off"
                                        className="text-sm mt-1 p-2 block w-full border border-gray-300 rounded-md h-9"
                                        onChange={onBank}
                                        value={bank}

                                    >
                                        <option value="">--Select Bank Account--</option>
                                        {bankList?.map((i) => (

                                            <option value={i?.accountCode}>{i?.accountCodeDesc}</option>
                                        ))}


                                        {/* {EntityListDropDown} */}
                                    </select>
                                </div>
                            </div>

                        </div>
                        <div className="flex flex-col w-full mb-2 space-y-2">

                            <div className="flex flex-col w-full mb-4 space-y-1">
                                <div className="flex items-center gap-4">
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
                                            value={instrumentNo}
                                        />

                                    </div>

                                    <div className="flex-1">
                                        <label
                                            htmlFor="financial_institute"
                                            className="block text-sm font-medium text-gray-700 "
                                        >
                                            Status<span className="text-red-500"> * </span>
                                        </label>
                                        <select
                                            id="financial_institute"
                                            name="financial_institute"
                                            autoComplete="off"
                                            className="text-sm mt-1 p-2 block w-full border border-gray-300 rounded-md h-9"
                                            onChange={onStatus}
                                            value={conStatus}

                                        >
                                            <option value="">--Select Status--</option>
                                            <option value="0">ALL</option>
                                            <option value="Y">Yes</option>
                                            <option value="N">No</option>

                                            {/* {EntityListDropDown} */}
                                        </select>
                                    </div>

                                    <div className="flex-1">
                                        <button
                                            style={{ marginTop: "22px" }}
                                            type="button"
                                            className="py-2 px-2 border border-transparent rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"

                                            onClick={onSearch}
                                        >
                                            Search
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                    </div>


                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {data?.length > 0 ? <>
                    <table className="min-w-full border-collapse border border-black-900 ">
                        <thead>
                            <tr className="bg-blue-300 text-sm text-center">
                                <th className="border border-gray-300 p-1">Voucher Id</th>
                                <th className="border border-gray-300 p-1">Voucher Date</th>
                                <th className="border border-gray-300 p-1">Head of Account</th>
                                <th className="border border-gray-300 p-1">Instrument Type</th>
                                <th className="border border-gray-300 p-1">Instrument No</th>
                                <th className="border border-gray-300 p-1">Instrument Date</th>
                                <th className="border border-gray-300 p-1">Voucher Amount</th>
                                <th className="border border-gray-300 p-1">Passbook Date</th>
                                <th className="border border-gray-300 p-1">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? "bg-white text-center" : "bg-gray-100 text-center"}
                                >
                                    <td className="border border-gray-300 text-sm p-1">{row.voucherId}</td>
                                    <td className="border border-gray-300 text-sm p-1">{row.voucherDate}</td>
                                    <td className="border border-gray-300 text-sm p-1">{row.accountHead}</td>
                                    <td className="border border-gray-300 text-sm p-1">{row.instrumentType}</td>
                                    <td className="border border-gray-300 text-sm p-1">{row.instrumentNo}</td>
                                    <td className="border border-gray-300 text-sm p-1">{row.visibleInstrumentDate}</td>
                                    <td className="border border-gray-300 text-sm p-1">{row.voucherAmount}</td>
                                    
                                    <td className="border border-gray-300 text-sm p-1">
                                        <input
                                            type="date"
                                            value={row.reconDate || ""}
                                            className="border p-1 w-full text-sm"
                                            min={row.instrumentDate}
                                            onChange={(e) => {
                                                console.log(e.target.value, "asdfasdf")
                                                const selectedDate = e.target.value;

                                                handleInputChange(index, "reconDate", selectedDate);
                                            }}
                                        />



                                    </td>
                                    <td className="border border-gray-300 text-sm p-1">
                                        <input
                                            type="text"
                                            value={row.status || ""}
                                            className="border p-1 w-full text-sm"
                                            onChange={(e) => handleInputChange(index, "status", e.target.value)}
                                            maxLength={50}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                    <div className="w-1/2 flex justify-end">
                        <button
                            type="button"
                            className="btn-submit h-10 py-2 px-6 mt-5 shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={onSave}
                        >
                            Save
                        </button>
                    </div>
                </> :
                    <div className="flex items-center justify-center h-10 bg-gray-100 rounded-lg shadow-md text-gray-700 text-lg font-semibold">
                        No Data Found
                    </div>
                }

            </div >
        </>
    );
};

export default ReconsilationHelp;
