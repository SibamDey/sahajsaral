import { useState, useEffect, useRef, useMemo } from "react";
import classNames from "classnames";
import { ToastContainer, toast } from "react-toastify";
import { addCreateContractor } from "../../../Service/Contractor/ContractorService";
import { getPartyTypeList } from "../../../Service/Transaction/TransactionService";
import { InsertTrnPassbokNotCashbook, getTrnPassbokNotCashbook, UpdateTrnPassbokNotCashbook } from "../../../Service/OpeningBalance/OpeningBalance";
import { getFinInstitute } from "../../../Service/Cheque/ChequeService";
import { Icon } from "@iconify/react/dist/iconify.js";



const TransactionNotOB = () => {
    const [passBookDate, setPassBookDate] = useState();
    const [cashBookDate, setCashBookDate] = useState();
    const [amount, setAmount] = useState();
    const [transactionRefId, setTransactionRefId] = useState();
    const [bank, setBank] = useState("")
    const [finInstitution, setfinInstitute] = useState([]);
    const [remarks, setRemarks] = useState("");
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const [submittedData, setSubmittedData] = useState([]);
    const [updateFlag, setUpdateFlag] = useState(true);
    const [updateData, setUpdateData] = useState({});


    useEffect(() => {
        getTrnPassbokNotCashbook(userData?.CORE_LGD,).then((response) => {
            console.log(response, "response")
            if (response.status === 200) {
                setSubmittedData(response?.data);
            } else {
                toast.error("Failed to fetch data");
            }
        });

        getFinInstitute(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
            "R",
        ).then(function (result) {
            const response = result?.data;
            console.log(response, "report")
            setfinInstitute(response);

        })
    }, []);

    const onPassBookDate = (e) => {
        setPassBookDate(e.target.value);
    };

    const onCashBookDate = (e) => {
        setCashBookDate(e.target.value);
    };

    const onAmount = (e) => {
        setAmount(e.target.value)
    }

    const onTransactionRefId = (e) => {
        setTransactionRefId(e.target.value)
    }

    const onRemarks = (e) => {
        setRemarks(e.target.value)
    }

    const onBank = (e) => {
        setBank(e.target.value)
    }

    const onSubmit = () => {
        if (!passBookDate) {
            toast.error("Please Select Entry at Bank Pass Book")
        } else if (!amount) {
            toast.error("Please type Transaction Amount")
        } else if (!amount) {
            toast.error("Please Type Amount")
        } else if (!bank) {
            toast.error("Please Select Bank/Treasury")
        } else {
            InsertTrnPassbokNotCashbook(
                userData?.CORE_LGD, passBookDate, amount, bank, transactionRefId, userData?.USER_INDEX,
                (r) => {
                    if (r.status === 0) {
                        toast.success(r.message)
                        setPassBookDate("");
                        // setCashBookDate("");
                        setAmount("");
                        setTransactionRefId("");
                        // setRemarks("");
                        setBank("");
                        getTrnPassbokNotCashbook(userData?.CORE_LGD,).then((response) => {
                            console.log(response, "response")
                            if (response.status === 200) {
                                setSubmittedData(response?.data);
                            } else {
                                toast.error("Failed to fetch data");
                            }
                        });




                    } else {
                        toast.error(r.message);
                    }
                }
            );
        }


    }


    const onUpdate = () => {
        if (!cashBookDate) {
            toast.error("Please Select Entry in Cash Book")
        } else if (!remarks) {
            toast.error("Please Type Remarks")
        } else {
            UpdateTrnPassbokNotCashbook(
                userData?.CORE_LGD, updateData?.trnId, remarks, cashBookDate, userData?.USER_INDEX,
                (r) => {
                    if (r.status === 0) {
                        toast.success(r.message)
                        setCashBookDate("");
                        setRemarks("");
                        setUpdateFlag(true);
                        setUpdateData({});
                        setPassBookDate("");
                        setAmount("");
                        setTransactionRefId("");
                        setBank("");
                        getTrnPassbokNotCashbook(userData?.CORE_LGD,).then((response) => {
                            console.log(response, "response")
                            if (response.status === 200) {
                                setSubmittedData(response?.data);
                            } else {
                                toast.error("Failed to fetch data");
                            }
                        });




                    } else {
                        toast.error(r.message);
                    }
                }
            );

        }
    }

    console.log(updateData, "updateData")

    return (
        <>
            <ToastContainer />

            <div className="bg-white rounded-lg p-1 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Not in Subsidiary Cash Book but in Pass Book</legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full mb-2 space-y-2">
                        {updateFlag ?
                            <>
                                <div className="flex items-center gap-2">
                                    {/* Financial Institute */}


                                    {/* Branch Name */}
                                    <div className="flex-1">
                                        <label
                                            htmlFor="branch_name"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Entry at Bank Pass Book<span className="text-red-500"> * </span>
                                        </label>
                                        <input
                                            id="branch_name"
                                            name="branch_name"
                                            type="date"
                                            autoComplete="off"
                                            placeholder="Transaction Date"
                                            className="mt-1 p-1 block w-full border border-gray-300 rounded-md text-sm"
                                            onChange={onPassBookDate}
                                            value={passBookDate}
                                        />
                                    </div>

                                    {/* Branch Code */}
                                    <div className="flex-1">
                                        <label
                                            htmlFor="branch_code"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Transaction Amount<span className="text-red-500"> * </span>
                                        </label>
                                        <input
                                            id="branch_code"
                                            name="branch_code"
                                            type="number"
                                            autoComplete="off"
                                            placeholder="Transaction Amount"
                                            className="mt-1 p-1 block w-full border border-gray-300 rounded-md text-sm"
                                            onChange={onAmount}
                                            value={amount}
                                        />
                                    </div>

                                    <div className="w-1/4">

                                        <label
                                            htmlFor="scheme_name"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Bank/Treasury Account<span className="text-red-500"> * </span>

                                        </label>
                                        <select
                                            className="text-sm block w-full p-1 h-8 border border-gray-300 rounded-md"
                                            onChange={onBank}
                                            value={bank}
                                        >
                                            <option value="" selected hidden>--Select Bank / Treasury--</option>
                                            {finInstitution?.map((d) => (
                                                <option value={d?.accountCode}>
                                                    {d?.accountCodeDesc}
                                                </option>
                                            ))}
                                        </select>

                                    </div>

                                    <div className="w-1/4 ">
                                        <label
                                            htmlFor="branch_mobile"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Transaction Reference ID
                                        </label>
                                        <input

                                            id="branch_mobile"
                                            name="branch_mobile"
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Transaction Reference ID"
                                            className="mt-1 p-1 block w-full border border-gray-300 rounded-md text-sm"
                                            onChange={onTransactionRefId}
                                            value={transactionRefId}

                                        />

                                    </div>
                                    <div className="flex-1">
                                        <button
                                            style={{ marginTop: "22px" }}
                                            type="button"
                                            className={classNames(
                                                "text-sm py-1 px-4 border border-transparent rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500",

                                            )}
                                            onClick={onSubmit}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </> :

                            <>
                                <div className="flex items-center gap-2">
                                    {/* Financial Institute */}


                                    {/* Branch Name */}
                                    <div className="flex-1">
                                        <label
                                            htmlFor="branch_name"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Entry at Bank Pass Book<span className="text-red-500"> * </span>
                                        </label>
                                        <input
                                            id="branch_name"
                                            name="branch_name"
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Entry at Bank Pass Book Date"
                                            className="mt-1 p-1 block w-full border border-gray-300 rounded-md text-sm"
                                            disabled
                                            value={updateData?.trndate}
                                        />
                                    </div>

                                    {/* Branch Code */}
                                    <div className="flex-1">
                                        <label
                                            htmlFor="branch_code"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Transaction Amount<span className="text-red-500"> * </span>
                                        </label>
                                        <input
                                            id="branch_code"
                                            name="branch_code"
                                            type="number"
                                            autoComplete="off"
                                            placeholder="Transaction Amount"
                                            className="mt-1 p-1 block w-full border border-gray-300 rounded-md text-sm"
                                            disabled
                                            value={updateData?.amount}
                                        />
                                    </div>

                                    <div className="w-1/4">

                                        <label
                                            htmlFor="scheme_name"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Bank/Treasury Account<span className="text-red-500"> * </span>

                                        </label>
                                        <input
                                            id="branch_code"
                                            name="branch_code"
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Bank/Treasury Account"
                                            className="mt-1 p-1 block w-full border border-gray-300 rounded-md text-sm"
                                            disabled
                                            // value={updateData?.accountCode}
                                            value={finInstitution.find(item => item.accountCode === updateData?.accountCode)?.accountCodeDesc}
                                        />

                                    </div>

                                    <div className="w-1/4 ">
                                        <label
                                            htmlFor="branch_mobile"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Transaction Reference ID
                                        </label>
                                        <input

                                            id="branch_mobile"
                                            name="branch_mobile"
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Transaction Reference ID"
                                            className="mt-1 p-1 block w-full border border-gray-300 rounded-md text-sm"
                                            disabled
                                            value={updateData?.refNo}
                                        />

                                    </div>

                                </div>
                                <div className="flex items-center gap-2">

                                    <div className="w-1/4">
                                        <label
                                            htmlFor="branch_name"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Entry in Cash Book
                                        </label>
                                        <input
                                            id="branch_name"
                                            name="branch_name"
                                            type="date"
                                            autoComplete="off"
                                            placeholder="Entry in Cash Book"
                                            className="mt-1 p-1 block w-full border border-gray-300 rounded-md text-sm"
                                            onChange={onCashBookDate}
                                            value={cashBookDate}

                                        />
                                    </div>


                                    <div className="w-1/2">
                                        <label
                                            htmlFor="branch_mobile"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Remarks
                                        </label>
                                        <input

                                            id="branch_mobile"
                                            name="branch_mobile"
                                            type="text"
                                            autoComplete="off"
                                            placeholder="Remarks"
                                            className="mt-1 p-1 block w-full border border-gray-300 rounded-md text-sm"
                                            onChange={onRemarks}
                                            value={remarks}

                                        />

                                    </div>

                                    <div className="flex-1">
                                        <button
                                            style={{ marginTop: "22px" }}
                                            type="button"
                                            className={classNames(
                                                "text-sm py-1 px-4 border border-transparent rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500",

                                            )}
                                            onClick={onUpdate}
                                        >
                                            Update
                                        </button>
                                    </div>



                                </div>
                            </>}

                        <div className="mt-2 overflow-auto">
                            {/* <h3 className="text-lg font-semibold text-cyan-700 mb-2">Submitted Entries</h3> */}
                            <table className="min-w-full bg-blue border border-blue-200 rounded shadow">
                                <thead className="bg-cyan-300 text-sm text-gray-700">
                                    <tr>
                                        <th className="py-2 px-3 border">Transaction Date</th>
                                        <th className="py-2 px-3 border">Transaction  Amount</th>
                                        <th className="py-2 px-3 border">Bank / Try Account</th>
                                        <th className="py-2 px-3 border">Transaction Reference ID</th>
                                        <th className="py-2 px-3 border">Transaction Date</th>
                                        <th className="py-2 px-3 border">Remarks</th>

                                        <th className="py-2 px-3 border">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submittedData.map((entry, index) => (
                                        <tr key={index} className="text-sm text-center text-gray-800 hover:bg-gray-50">
                                            <td className="py-2 px-3 border">{entry?.trndate}</td>
                                            <td className="py-2 px-3 border text-right">{entry?.amount}</td>
                                            <td className="py-2 px-3 border">{finInstitution.find(item => item.accountCode === entry?.accountCode)?.accountCodeDesc}</td>
                                            <td className="py-2 px-3 border">{entry?.refNo ? entry?.refNo : "-"}</td>
                                            <td className="py-2 px-3 border">{entry?.entryCB ? entry?.entryCB : "-"}</td>
                                            <td className="py-2 px-3 border">{entry?.remarks ? entry?.remarks : "-"}</td>
                                            <td className="py-2 px-3 border">
                                                <button
                                                    onClick={() => {
                                                        setUpdateData(entry);
                                                        setUpdateFlag(false);
                                                        window.scrollTo({
                                                            top: 0,
                                                            behavior: "smooth",
                                                        });
                                                    }}
                                                >
                                                    <Icon
                                                        icon={"mingcute:edit-line"}
                                                        className="font-medium text-cyan-600 hover:underline text-2xl cursor-pointer"
                                                    />
                                                </button>

                                            </td>


                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>


            </div>
        </>
    );
};

export default TransactionNotOB;
