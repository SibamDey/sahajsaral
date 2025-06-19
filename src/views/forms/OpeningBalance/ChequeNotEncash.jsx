import { useState, useEffect, useRef, useMemo } from "react";
import classNames from "classnames";
import { ToastContainer, toast } from "react-toastify";
import { addCreateContractor } from "../../../Service/Contractor/ContractorService";
import { getPartyTypeList } from "../../../Service/Transaction/TransactionService";
import { addChequeNotEncash } from "../../../Service/OpeningBalance/OpeningBalance";
import { getFinInstitute } from "../../../Service/Cheque/ChequeService";



const ChequeNotEncash = () => {
    const [date, setDate] = useState();
    const [voucherSlNo, setVoucherSlNo] = useState();
    const [chequeNo, setChequeNo] = useState();
    const [amount, setAmount] = useState();
    const [narration, setNarration] = useState();
    const [partyType, setPartyType] = useState("");
    const [partyTypeAllList, setPartyTypeAllList] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [bank, setBank] = useState("")
    const [statusRP, setStatusRP] = useState("")
    const [finInstitution, setfinInstitute] = useState([]);
    const [paidTo, setPaidTo] = useState("");
    const [instType, setInstType] = useState("");
    const [instDate, setInstDate] = useState("");
    const [instNo, setInstNo] = useState("");
    const [instDetails, setInstDetails] = useState("");

    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);

    const instrumentType = [
        { value: "None", label: "None" },
        { value: "Cheque", label: "Cheque" },
        { value: "Challan", label: "Challan" },
        { value: "DD", label: "DD" },
        { value: "Advice", label: "Advice" },
        { value: "By Transfer", label: "By Transfer" },
        { value: "Token", label: "Token" },
        { value: "Bank Interest", label: "Bank Interest" },
        { value: "Bank Charges", label: "Bank Charges" },
        { value: "Fund Transfer", label: "Fund Transfer" },
        { value: "Certificate", label: "Certificate" },
        { value: "Bill", label: "Bill" },
        { value: "UPI Trn ID", label: "UPI Trn ID" },
        { value: "Direct Deposit", label: "Direct Deposit" }
    ];


    useEffect(() => {
        getFinInstitute(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
            "R",
        ).then(function (result) {
            const response = result?.data;
            console.log(response, "report")
            setfinInstitute(response);

        })
    }, []);

    const onDate = (e) => {
        const selectedDate = new Date(e.target.value);
        const minAllowedDate = new Date("2025-03-31"); // only allow dates *after* April 1, 2025

        if (selectedDate > minAllowedDate) {
            toast.error("Please select a date before April 1st, 2025.");
            setDate(""); // reset
        } else {
            setDate(e.target.value);
        }
    };

    const onVoucherSLNo = (e) => {
        let value = e.target.value;
        setVoucherSlNo(value); // Update state
    };

    const onChequeNo = (e) => {
        setChequeNo(e.target.value)
    }

    const onAmount = (e) => {
        setAmount(e.target.value)
    }

    const onPaidTo = (e) => {
        setPaidTo(e.target.value)
    }

    const onNarration = (e) => {
        setNarration(e.target.value)
    }

    const onPartyType = (e) => {
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
        } else if (!voucherSlNo) {
            toast.error("Please type Voucher SL No")
        } else if (voucherSlNo.length != 4) {
            toast.error("Please type Voucher SL No 4 digit")
        } else if (!amount) {
            toast.error("Please Type Amount")
        } else if (!paidTo) {
            toast.error("Please Type Paid To")
        } else if (!bank) {
            toast.error("Please Select Bank/Treasury")
        } else if (!statusRP) {
            toast.error("Please select Status")
        } else if (!partyType) {
            toast.error("Please select Head of Accounts")
        } else if (!narration) {
            toast.error("Please Type Narration")
        } else if (!instType) {
            toast.error("Please select Instrument Type")
        } else if (!instDate) {
            toast.error("Please select Instrument Date")
        } else if (!instNo) {
            toast.error("Please Type Instrument No")
        } else if (!instDetails) {
            toast.error("Please Type Instrument Details")
        } else {
            addChequeNotEncash(
                userData?.CORE_LGD, voucherSlNo, date, bank, partyTypeAllList.find(item => item.groupName === partyType)?.groupId, narration, amount, paidTo, userData?.USER_INDEX, statusRP,
                instType, instDate, instNo, instDetails,
                (r) => {
                    if (r.status === 0) {
                        toast.success(r.message)
                        setDate("");
                        setAmount("");
                        setChequeNo("");
                        setNarration("");
                        setPartyType("");
                        setPartyTypeAllList([]);
                        setVoucherSlNo("");
                        setInstDate("");
                        setInstNo("");
                        setInstDetails("");
                        setPaidTo("");
                        setBank("");
                        setStatusRP("");
                        setInstType("");


                    } else {
                        toast.error(r.message);
                    }
                }
            );
        }


    }


    const onBank = (e) => {
        setBank(e.target.value)
    }

    const onStatusRP = (e) => {
        setStatusRP(e.target.value)
    }

    const onInstType = (e) => {
        setInstType(e.target.value)
    }

    const onInstDate = (e) => {
        setInstDate(e.target.value)
    }

    const onInstNo = (e) => {
        setInstNo(e.target.value)
    }

    const onInstDetails = (e) => {
        setInstDetails(e.target.value)
    }

    return (
        <>
            <ToastContainer />

            <div className="bg-white rounded-lg p-1 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Receipt/Issue But not in Bank/Try Passbook as on 31.03.2025</legend>

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
                                    Transaction Date<span className="text-red-500"> * </span>
                                </label>
                                <input
                                    id="branch_name"
                                    name="branch_name"
                                    type="date"
                                    autoComplete="off"
                                    placeholder="Transaction Date"
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
                                    Voucher Sl. No<span className="text-red-500"> * </span>
                                </label>
                                <input
                                    id="branch_ifsc"
                                    name="branch_ifsc"
                                    type="text" // Change type to "text"
                                    inputMode="numeric" // Ensures number keypad on mobile
                                    pattern="[0-9]*" // Allows only numbers
                                    autoComplete="off"
                                    placeholder="Voucher Sl. No"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md text-sm"
                                    onChange={onVoucherSLNo}
                                    value={voucherSlNo}
                                    maxLength={4}
                                />

                            </div>

                            {/* Branch Code */}
                            <div className="flex-1">
                                <label
                                    htmlFor="branch_code"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Amount<span className="text-red-500"> * </span>
                                </label>
                                <input
                                    id="branch_code"
                                    name="branch_code"
                                    type="number"
                                    autoComplete="off"
                                    placeholder="Amount"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md text-sm"
                                    onChange={onAmount}
                                    value={amount}
                                />
                            </div>

                            <div className="flex-1">
                                <label
                                    htmlFor="branch_address"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Paid to<span className="text-red-500"> * </span>
                                </label>
                                <input
                                    id="branch_address"
                                    name="branch_address"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Paid to"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md text-sm"
                                    onChange={onPaidTo}
                                    value={paidTo}

                                />

                            </div>
                        </div>

                        <div className="flex items-center gap-2">

                            <div className="w-1/4">

                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Bank Treasury<span className="text-red-500"> * </span>

                                </label>
                                <select
                                    className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
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


                            <div className="w-1/4">

                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Status<span className="text-red-500"> * </span>

                                </label>
                                <select
                                    className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
                                    onChange={onStatusRP}
                                    value={statusRP}
                                >
                                    <option value="" selected>--Select Status--</option>
                                    <option value="R" >Receipt but not in passbook</option>
                                    <option value="P">Issued but not in passbook</option>

                                </select>

                            </div>

                            <div className="w-1/2 relative"> {/* Added relative for positioning */}
                                <label
                                    htmlFor="branch_email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Head of Accounts<span className="text-red-500"> * </span>
                                </label>
                                <input
                                    id="branch_email"
                                    name="branch_email"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Search Head of Accounts"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md text-sm"
                                    onChange={onPartyType}
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
                            <div className="w-1/4 ">
                                <label
                                    htmlFor="branch_mobile"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Voucher Narration<span className="text-red-500"> * </span>
                                </label>
                                <input

                                    id="branch_mobile"
                                    name="branch_mobile"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Voucher Narration"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md text-sm"
                                    onChange={onNarration}
                                    value={narration}

                                />

                            </div>



                        </div>

                        <div className="flex items-center gap-2">

                            <div className="w-1/4">

                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Instrument Type<span className="text-red-500"> * </span>

                                </label>
                                <select
                                    className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
                                    onChange={onInstType}
                                    value={instType}
                                >
                                    <option value="">--Select Instrument Type--</option>
                                    {instrumentType.map((item) => (
                                        <option key={item.value} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}

                                </select>

                            </div>

                            <div className="flex-1">
                                <label
                                    htmlFor="branch_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Instrument Date<span className="text-red-500"> * </span>
                                </label>
                                <input
                                    id="branch_name"
                                    name="branch_name"
                                    type="date"
                                    autoComplete="off"
                                    placeholder="Instrument Date"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md text-sm"
                                    onChange={onInstDate}
                                    value={instDate}

                                />
                            </div>

                            <div className="w-1/4 ">
                                <label
                                    htmlFor="branch_mobile"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Instrument No<span className="text-red-500"> * </span>
                                </label>
                                <input

                                    id="branch_mobile"
                                    name="branch_mobile"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Instrument No"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md text-sm"
                                    onChange={onInstNo}
                                    value={instNo}

                                />

                            </div>


                            <div className="w-1/2 relative"> {/* Added relative for positioning */}
                                <label
                                    htmlFor="branch_email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Instrument Details<span className="text-red-500"> * </span>
                                </label>
                                <input
                                    id="branch_email"
                                    name="branch_email"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Instrument Details"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md text-sm"
                                    onChange={onInstDetails}
                                    value={instDetails}
                                />

                            </div>

                            {/* Submit Button */}
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

                    </div>
                </div>

                {/* <div className=" flex justify-between items-center h-12">
                    <select
                        className="rounded-lg"
                        name=""
                        id=""
                        value={items}
                        onChange={(e) => setItems(e.target.value)}
                    >
                        {ListOptions.map((e) => (
                            <option key={e} value={e}>
                                {e}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={filtering}
                        placeholder="search..."
                        className="border-2 rounded-lg border-zinc-400"
                        onChange={(e) => setFiltering(e.target.value)}
                    />
                </div>
                <div className=" flex flex-col space-y-6 pb-8">
                    <Table style={{ border: "1px solid #444 " }}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Table.Head key={headerGroup.id}>

                                {headerGroup.headers.map((header) => (
                                    <Table.HeadCell
                                        style={{ border: "1px solid #444 " }}
                                        key={header.id}
                                        className={classNames(
                                            header.column.columnDef.headclass,
                                            " bg-cyan-400/90 btn-blue transition-all whitespace-nowrap"
                                        )}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div className="flex items-center space-x-2 justify-between">
                                                <span className="normal-case">
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                </span>
                                                <SortIcon sort={header.column.getIsSorted()} />
                                            </div>
                                        )}
                                    </Table.HeadCell>
                                ))}
                                <Table.HeadCell className="normal-case bg-cyan-400/90 btn-blue">
                                    Actions
                                </Table.HeadCell>
                            </Table.Head>
                        ))}

                        <Table.Body className="divide-y" style={{ border: "1px solid #444 " }}>
                            {table.getRowModel().rows.map((row) => (
                                <Table.Row key={row.id} style={{ border: "1px solid #444 " }}>
                                    {row.getVisibleCells().map((cell) => (
                                        <Table.Cell
                                            style={{ border: "1px solid #444 " }}
                                            key={cell.id}
                                            className={cell.column.columnDef.className}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </Table.Cell>
                                    ))}

                                    <Table.Cell className="flex items-center justify-center space-x-8">
                                        <button
                                            onClick={() => {
                                                // designation.current.value = row.original.designation;
                                                finInstId.current.value = row.original.finInstId;
                                                branchName.current.value = row.original.branchName;
                                                brnchIfsc.current.value = row.original.brnchIfsc;
                                                branchCode.current.value = row.original.branchCode;
                                                branchPhone.current.value = row.original.branchPhone;
                                                branchEmail.current.value = row.original.branchEmail;
                                                branchAddress.current.value = row.original.contractorPh;
                                                // setCurrentDate(row.original?.branchName);
                                                setMutationId(row.original.id?.contractorId);
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
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    <Pagination data={data} table={table} />
                </div> */}
            </div>
        </>
    );
};

export default ChequeNotEncash;
