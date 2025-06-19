import { useState, useEffect, useRef, useMemo } from "react";
import classNames from "classnames";
import { ToastContainer, toast } from "react-toastify";
import { Toast } from "flowbite-react";
import { getEmployeeList, getJobWorkerList } from "../../../Service/Transaction/TransactionService";
import Modal from 'react-modal';
import { getPartyTypeList } from "../../../Service/Transaction/TransactionService";
import { addUnadjustedAdvance } from "../../../Service/OpeningBalance/OpeningBalance";
import { getUnadjustedOb } from "../../../Service/UnadjustedAdvance/UnadjustedAdvanceService";
const UnadjustedAdvanceOb = () => {
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const [partyTypes, setPartyTypes] = useState();
    const [nameList, setNameList] = useState([]);
    const [name, setName] = useState();
    const [activeModal, setActiveModal] = useState(false);
    const [partyName, setPartyName] = useState("");
    const [partyType, setPartyType] = useState("");
    const [partyTypeAllList, setPartyTypeAllList] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isPartyDetailsOpen, setIsPartyDetailsOpen] = useState(false);
    const [date, setDate] = useState();
    const [selfId, setSelfId] = useState();
    const [amount, setAmount] = useState();
    const [submittedData, setSubmittedData] = useState([]);

    useEffect(() => {
        getUnadjustedOb(userData?.CORE_LGD,).then((response) => {
            console.log(response, "response")
            if (response.status === 200) {
                setSubmittedData(response?.data);
            } else {
                toast.error("Failed to fetch data");
            }
        });
    }, []);

    const onAmount = (e) => {
        setAmount(e.target.value)
    }

    const onDate = (e) => {
        setDate(e.target.value)
    }

    const onSelfId = (e) => {
        let value = e.target.value;
        if (value.length > 3) {
            value = value.slice(0, 3); // Limit to 2 characters
        }
        setSelfId(value); // Update state
    };

    const onPartyDetails = () => {
        setIsPartyDetailsOpen(true)
    }

    const onPartyDetailsClose = () => {
        setIsPartyDetailsOpen(false);
        setName("");
        setNameList([]);
    }
    const onPartyTypeChosse = (d) => {
        setActiveModal(true)
        setPartyName(d)
        setIsPartyDetailsOpen(false)
    }
    const onPartyTypesRetrieve = () => {
        if (partyTypes === "E") {
            getEmployeeList(userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD, name ? name : 0,
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setNameList(response);
            })
        } else if (partyTypes === "J") {
            getJobWorkerList(userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD, name ? name : 0,
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setNameList(response);
            })
        } else {
            Toast.error("Benificiary Under Process")
        }

    }

    const onPartyType = (e) => {
        setActiveModal(false)
        setPartyTypes(e.target.value)
        setName("");
        setNameList([]);
        setPartyName({ contractorId: "", contractorNm: "", empId: "", empName: "", jobWorkerId: "", jobWorkerName: "", deptId: "", deptName: "", lsgCode: "", lsgName: "" });

    }

    const onHeadOfAcc = (e) => {
        const value = e.target.value
        setPartyType(value)

        setShowDropdown(true)
        getPartyTypeList(userData?.CORE_LGD, value,
        ).then(function (result) {
            const response = result?.data;
            console.log(response, "report")
            setPartyTypeAllList(response);
        })
    }

    const onSetPartType = (i) => {
        setPartyType(i?.groupName)
        setShowDropdown(false)
    }

    const onSubmit = () => {
        if (!date) {
            toast.error("Please select Date")
        } else if (!selfId) {
            toast.error("Please type Uncashed Self Cheque id")
        } else if (selfId.length !== 3) {
            toast.error("Uncashed Self Cheque id should be 3 digit")
        } else if (!amount) {
            toast.error("Please Type Amount")
        } else if (!partyType) {
            toast.error("Please select Head of Accounts")
        } else {
            addUnadjustedAdvance(
                userData?.CORE_LGD, selfId, date, partyTypeAllList.find(item => item.groupName === partyType)?.groupId, amount, partyTypes === "E" ? partyName?.empId : partyTypes === "J" ? partyName?.jobWorkerId : "",
                (r) => {
                    if (r.status === 0) {
                        toast.success(r.message)
                        setDate("");
                        setAmount("");
                        setPartyType("");
                        setPartyTypeAllList([]);
                        setSelfId("");


                    } else {
                        toast.error(r.message);
                    }
                }
            );
        }


    }

    return (
        <>
            <ToastContainer />
            <Modal
                isOpen={isPartyDetailsOpen}
                onRequestClose={() => setIsPartyDetailsOpen(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "70%",
                        height: "60%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                {/* Title */}
                <h1 className="text-center text-blue-800 text-2xl font-bold mb-1">
                    List of {partyTypes === "E" ? "Employee" : "Job Worker"} Details
                </h1>


                <div className="flex items-center gap-4 mb-6">


                    <div className="flex-1">
                        <label htmlFor="activity" className="block font-semibold mb-1 text-xs">
                            {partyTypes === "E" ? "Employee" : "Job Worker"}  Name
                        </label>
                        <input
                            type="text"
                            id="activity"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            placeholder={partyTypes === "E" ? "Employee" : "Job Worker"}
                            className="text-xs w-full px-3 py-1 border border-gray-300 rounded-md"
                        />
                    </div>



                    {/* Retrieve Button */}
                    <button
                        type="button"
                        onClick={onPartyTypesRetrieve}
                        className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                        style={{ marginTop: "24px" }}
                    >
                        RETRIEVE
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 rounded-md text-xs text-gray-600">
                        <thead className="bg-yellow-100 text-gray-700 font-semibold">
                            <tr>
                                <th className="border px-4 py-2">{partyTypes === "E" ? "Employee Id" : partyTypes === "J" ? "Job Worker Id" : ""}</th>
                                <th className="border px-4 py-2">{partyTypes === "E" ? "Employee Name" : partyTypes === "J" ? "Job Worker Name" : ""}</th>
                                <th className="border px-4 py-2">{partyTypes === "E" ? "Employee Designation" : partyTypes === "J" ? "Job Worker Address" : ""}</th>



                            </tr>
                        </thead>
                        <tbody>
                            {/* Example Row */}
                            {nameList?.map((d, index) => (


                                <tr>
                                    <td
                                        className="border px-2 py-2 text-center cursor-pointer"
                                        onClick={() => onPartyTypeChosse(d)}>
                                        {partyTypes === "C" ? d?.contractorId : partyTypes === "E" ? d?.empId : partyTypes === "J" ? d?.jobWorkerId : partyTypes === "D" ? d?.deptId : partyTypes === "L" ? d?.lsgCode : "Benificiary Scheme"}

                                    </td>
                                    <td className="border px-2 py-2 text-center cursor-pointer"
                                        onClick={() => onPartyTypeChosse(d)}>
                                        {partyTypes === "C" ? d?.contractorNm : partyTypes === "E" ? d?.empName : partyTypes === "J" ? d?.jobWorkerName : partyTypes === "D" ? d?.deptName : partyTypes === "L" ? d?.lsgName : "Benificiary Scheme"}
                                    </td>
                                    <td className="border px-2 py-2 text-center cursor-pointer"
                                        onClick={() => onPartyTypeChosse(d)}>
                                        {partyTypes === "C" ? d?.contractorPan : partyTypes === "E" ? d?.empAddress : partyTypes === "J" ? d?.jobWorkerAddress : partyTypes === "D" ? d?.deptAbv : partyTypes === "L" ? d?.lsgAdd1 + d?.lsgAdd2 : "Benificiary Scheme"}


                                    </td>


                                </tr>
                            ))}

                        </tbody>
                    </table>
                    {nameList?.length === 0 ? <div className="flex items-center justify-center bg-gray-200" style={{ marginTop: "10px" }}>
                        <div className="text-center">
                            <h1 className="text-xl font-semibold text-black-800">No Data Found</h1>

                        </div>
                    </div> : ""}
                </div>

                {/* Close Button */}
                <div className="mt-8 text-center">
                    <button
                        type="button"
                        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={onPartyDetailsClose}
                    >
                        CLOSE
                    </button>
                </div>
            </Modal>

            <div className="bg-white rounded-lg p-1 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Details of Unadjusted Advance as on : <label>31.03.2025</label></legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full mb-2 space-y-2">
                        <div className="flex items-center gap-2">
                            {/* Financial Institute */}


                            {/* Branch Name */}
                            <div className="flex-1">
                                <label
                                    htmlFor="branch_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Voucher Date<span className="text-red-500"> * </span>
                                </label>
                                <input
                                    id="branch_name"
                                    name="branch_name"
                                    type="date"
                                    autoComplete="off"
                                    placeholder="Branch Name"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md text-sm"
                                    onChange={onDate}
                                    value={date}
                                    max="2025-03-31"
                                />
                            </div>

                            {/* Branch IFSC */}
                            <div className="flex-1">
                                <label
                                    htmlFor="branch_ifsc"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Unadjusted Advance Id
                                </label>
                                <input
                                    id="branch_ifsc"
                                    name="branch_ifsc"
                                    type="number" // Change type to "text"
                                    inputMode="numeric" // Ensures number keypad on mobile
                                    pattern="[0-9]*" // Allows only numbers
                                    autoComplete="off"
                                    placeholder="Unadjusted Advance Id"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md text-sm"
                                    onChange={onSelfId}
                                    maxLength={3} // Now works!
                                    value={selfId}
                                />
                            </div>



                            <div className="flex-1">
                                <label
                                    htmlFor="branch_address"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Advance Amount
                                </label>
                                <input
                                    id="branch_address"
                                    name="branch_address"
                                    type="number"
                                    autoComplete="off"
                                    placeholder="Amount"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md text-sm"
                                    onChange={onAmount}
                                    value={amount}

                                />

                            </div>

                            <div className="w-1/2 relative"> {/* Added relative for positioning */}
                                <label
                                    htmlFor="branch_email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Head of Accounts
                                </label>
                                <input
                                    id="branch_email"
                                    name="branch_email"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Search Head of Accounts"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md text-sm"
                                    onChange={onHeadOfAcc}
                                    value={partyType}
                                />

                                {/* Dropdown Menu */}
                                {showDropdown && (
                                    <div className="absolute top-full left-0 w-full z-20 bg-white border border-gray-300 rounded shadow-md max-h-40 overflow-y-auto">
                                        {partyTypeAllList.length > 0 ? (
                                            partyTypeAllList.map((d, index) => (
                                                <div
                                                    key={index}
                                                    className="text-xs px-2 py-2 border-b border-gray-300 hover:bg-gray-200 cursor-pointer"
                                                    onClick={() => onSetPartType(d)} // Select function
                                                >
                                                    {d?.groupName}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-gray-500">No results found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex w-full space-x-2 mt-1">
                                <div className="px- w-1/2 flex flex-col" >
                                    <div class="flex items-center border bg-gray-200 rounded h-8">
                                        <span class="px-2 bg-gray-200 text-xs">Party Type<span className="text-red-500 "> * </span></span>


                                        <select id="DISTRICT"
                                            className="flex-grow text-xs px-2 py-1 h-7 outline-none rounded"
                                            onChange={onPartyType}

                                        >
                                            <option select hidden>--Select Party Type--</option>
                                            <option value="E">Employee</option>
                                            <option value="J">Job Worker</option>
                                        </select>
                                    </div>
                                </div>


                                <div className="px-2 w-full flex flex-col" style={{ paddingRight: "12px" }}>
                                    <div className="flex items-center border bg-gray-200 rounded h-8">
                                        <span className="px-2 bg-gray-200 text-xs">Party Details<span className="text-red-500 "> * </span></span>
                                        <div className="w-1/6 flex items-center border bg-gray-200 rounded h-8">
                                            <input
                                                type="url"
                                                className="flex-grow text-xs px-3 py-2 h-8 outline-none rounded"
                                                placeholder="Party Code"
                                                value={partyTypes === "E" ? partyName?.empId : partyTypes === "J" ? partyName?.jobWorkerId : ""}
                                                disabled
                                            />
                                        </div>

                                        <input
                                            type="url"
                                            className="flex-grow text-xs px-3 py-2 h-8 outline-none rounded"
                                            placeholder="Party Details"
                                            value={partyTypes === "C" ? partyName?.contractorNm : partyTypes === "E" ? partyName?.empName : partyTypes === "J" ? partyName?.jobWorkerName : partyTypes === "D" ? partyName?.deptName : partyTypes === "L" ? partyName?.lsgName : ""}

                                            disabled
                                        />


                                        <button className="px-2 h-8 flex items-center justify-center bg-blue-500 text-white rounded-r" disabled={!partyTypes} onClick={onPartyDetails}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="w-4 h-4"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M21 21l-4.35-4.35M18 10.5a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                            </div>
                            <div className="flex-1">
                                <button
                                    style={{ marginTop: "4px" }}
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




                    </div>
                </div>

                {/* {submittedData.length > 0 && ( */}
                <div className="mt-4 overflow-auto">
                    {/* <h3 className="text-lg font-semibold text-cyan-700 mb-2">Submitted Entries</h3> */}
                    <table className="min-w-full bg-white border border-gray-200 rounded shadow">
                        <thead className="bg-gray-100 text-sm text-gray-700">
                            <tr>
                                <th className="py-2 px-3 border">Voucher Date</th>
                                <th className="py-2 px-3 border">Voucher ID</th>
                                <th className="py-2 px-3 border">Advance  Amount</th>
                                <th className="py-2 px-3 border">Adjusted  Amount</th>
                                <th className="py-2 px-3 border">Head of Account</th>
                                <th className="py-2 px-3 border">Party Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {submittedData.map((entry, index) => (
                                <tr key={index} className="text-sm tex-center text-gray-800 hover:bg-gray-50">
                                    <td className="py-2 px-3 border">{entry.voucherDate}</td>
                                    <td className="py-2 px-3 border">{entry.voucherId}</td>
                                    <td className="py-2 px-3 border">{entry.advanceAmount}</td>
                                    <td className="py-2 px-3 border">{entry.adjustAmount}</td>                                    
                                    <td className="py-2 px-3 border">{entry.glGroupName}</td>
                                    <td className="py-2 px-3 border">{entry.partyName}</td>
                             
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* )} */}


            </div>
        </>
    );
};

export default UnadjustedAdvanceOb;
