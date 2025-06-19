import { useState, useEffect, useRef, useMemo } from "react";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Table } from "flowbite-react";
// import { devApi } from "../../WebApi/WebApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { fetch } from "../../../functions/Fetchfunctions";
import SuccessModal from "../../../components/SuccessModal";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Pagination } from "../../../components/Pagination";
import classNames from "classnames";
import { SortIcon } from "../../../components/SortIcon";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { addCreateContractor } from "../../../Service/Contractor/ContractorService";
import { addInsertRealAccountOB } from "../../../Service/OpeningBalance/OpeningBalance";
import * as XLSX from "xlsx";


const ObForReal = () => {
    const [mutationId, setMutationId] = useState(null);
    console.log(mutationId, "mutationId")
    const accCode = useRef(null);
    const schemeName = useRef(null);
    const bankName = useRef(null);
    const branchName = useRef(null);
    const accNo = useRef(null);
    const finYear = useRef(null);
    const monthName = useRef(null);
    const blnc = useRef(null);

    const [accountCode, setAccountCode] = useState();
    const [scheme, setScheme] = useState();
    const [bank, setBank] = useState();
    const [branch, setBranch] = useState();
    const [accountNo, setAccountNo] = useState();
    const [balance, setBalance] = useState();
    const [passBookBalance, setPassBookBalance] = useState();
    const [month, setMonth] = useState();
    const [openModal, setOpenModal] = useState(false);
    const [year, setYear] = useState();

    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);

    const [currentFinancialYear, setCurrentFinancialYear] = useState("");

    const currentYear = new Date().getFullYear();

    const generateYearRanges = (startYear, rangeCount) => {
        console.log(startYear, rangeCount, "start")
        const ranges = [];
        for (let i = 0; i < rangeCount; i++) {
            const start = startYear - i; // Start from the highest year
            const end = start + 1;
            ranges.push(`${start}-${end}`);
        }
        return ranges;
    };

    // Calculate the current financial year dynamically
    useEffect(() => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth(); // 0-indexed, so 3 = April

        // Determine the start and end years of the current financial year
        const startYear = currentMonth >= 3 ? currentYear : currentYear - 1; // April onwards belongs to the next FY
        const endYear = startYear + 1;

        setCurrentFinancialYear(`${startYear}-${endYear}`);
    }, []);

    // useEffect(() => {
    //     const currentDate = new Date();
    //     const currentYear = currentDate.getFullYear();
    //     const currentMonth = currentDate.getMonth(); // 0-indexed (Jan = 0, Feb = 1, ..., Dec = 11)

    //     // Determine the start and end years of the previous financial year
    //     const startYear = currentMonth >= 3 ? currentYear - 1 : currentYear - 2; // Shift back by one FY
    //     const endYear = startYear + 1;

    //     setCurrentFinancialYear(`${startYear}-${endYear}`);
    // }, []);

    const yearRanges = generateYearRanges(currentYear + 1, 5);

    const onYear = (e) => {
        console.log(e.target.value)
        setYear(e.target.value)
    }

    const { data: realAccObList } = useQuery({
        queryKey: ["realAccObList"],
        queryFn: async () => {
            const data = await fetch.get("/RealAccount/GetRealAccountOB?lgdCode=" + (userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD));
            // console.log(Array.isArray(data.data.result));
            return data?.data;
        },
    });

    const { data: realAccList } = useQuery({
        queryKey: ["realAccList"],
        queryFn: async () => {
            const data = await fetch.get("/RealAccount/Get?lgdCode=" + (userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD));
            // console.log(Array.isArray(data.data.result));
            return data?.data;
        },
    });

    const schemeNmBankAcc = useRef(null);

    const queryClient = useQueryClient();

    const { mutate: addPed, isPending: addPending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(newTodo, "/RealAccount/InsertRealAccountOB");
        },
        onSuccess: () => {
            queryClient.invalidateQueries("realAccObList");

            accCode.current.value = "";
            schemeName.current.value = "";
            bankName.current.value = "";
            branchName.current.value = "";
            accNo.current.value = "";
            finYear.current.value = "";
            monthName.current.value = "";
            blnc.current.value = "";

        },
        mutationKey: ["adddesignation"],
    });

    const { mutate: updatePed, isPending: updatePending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(
                newTodo,
                "/employee/update/" + mutationId
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries("realAccObList");
            // designation.current.value = "";
            schemeNmBankAcc.current.value = "";
            accCode.current.value = "";
            schemeName.current.value = "";
            bankName.current.value = "";
            branchName.current.value = "";
            accNo.current.value = "";
            finYear.current.value = "";
            monthName.current.value = "";
            blnc.current.value = "";
            setMutationId(null);
        },
        mutationKey: ["updatedesignation"],
    });

    function performMutation() {
        if (accCode.current.value === "") {
            toast.error("Please Select Account Code")
        } else if (!(accCode.current.value === "900000601" || accCode.current.value === "900000001") &&
            schemeName.current.value === "") {
            toast.error("Please Select Scheme");
        }

        else if (!(accCode.current.value === "900000601") && bankName.current.value === "") {
            toast.error("Please Select Bank")
        }
        else if (!(accCode.current.value === "900000601") && branchName.current.value === "") {
            toast.error("Please Select Branch")
        }
        else if (!(accCode.current.value == "900000601") && accNo.current.value === "") {
            toast.error("Please Enter Account No")
        }
        else if (finYear.current.value === "") {
            toast.error("Please Select Year")
        }
        else if (monthName.current.value === "") {
            toast.error("Please Select Month")
        }
        else if (blnc.current.value === "") {
            toast.error("Please Enter Balance")
        } else {
            addInsertRealAccountOB(userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD, accountCode, scheme, bank, branch, accountNo, balance, currentFinancialYear, month, userData?.USER_INDEX, (res) => {
                if (res?.status === 0) {
                    toast.success(res?.message);
                    setAccountCode("");
                    setScheme("");
                    setBank("");
                    setBranch("");
                    setAccountNo("");
                    setBalance("");
                    setYear("");
                    setMonth("");

                    schemeNmBankAcc.current.value = "";
                    accCode.current.value = "";
                    schemeName.current.value = "";
                    bankName.current.value = "";
                    branchName.current.value = "";
                    accNo.current.value = "";
                    finYear.current.value = "";
                    monthName.current.value = "";
                    blnc.current.value = "";
                    setMutationId(null);

                    queryClient.invalidateQueries("realAccObList");

                } else {
                    toast.error(res?.message);
                }
            }, (err) => {
                toast.error(err);
            })
            // if (mutationId === null)
            // console.log("");
            // addPed({
            //     "lgdCode": userData?.CORE_LGD,
            //     "accountCode": accCode,
            //     "schemeId": schemeName,
            //     "finInstId": bankName,
            //     "branchId": branchName,
            //     "accountNo": accNo,
            //     "openingBalance": blnc,
            //     "finYear": finYear,
            //     "month": monthName,
            //     "userIndex": userData?.USER_INDEX,

            // });
            // else
            //     updatePed({
            //         "lgdCode": userData?.CORE_LGD,
            //         "accountCode": accCode,
            //         "schemeId": schemeName,
            //         "finInstId": bankName,
            //         "branchId": branchName,
            //         "accountNo": accNo,
            //         "openingBalance": blnc,
            //         "finYear": finYear,
            //         "month": monthName,
            //         "userIndex": userData?.USER_INDEX,
            //     });
        }
    }
    useEffect(() => {
        const preventScroll = () => {
            document.body.style.overflow = "hidden";
        };

        const allowScroll = () => {
            document.body.style.overflow = "auto";
        };

        if (addPending || updatePending) {
            preventScroll();
        } else {
            allowScroll();
        }

        return () => {
            allowScroll();
        };
    }, [addPending, updatePending]);

    const ListOptions = [10, 20, 50, "all"];
    const [items, setItems] = useState(ListOptions[0]);

    const data = useMemo(() => {
        const sortedList = [...(realAccObList ?? [])];
        sortedList.sort((a, b) => b.designationId - a.designationId);
        return sortedList;
    }, [realAccObList]);

    const list = [
        {
            header: "Account Code",
            accessorKey: "accountCode",
            className: "text-left cursor-pointer",
            // cell: ({ row }) => row.index + 1,
            // headclass: "cursor-pointer w-32",
            // sortingFn: "id",
        },
        {
            header: "Account Code Desc",
            accessorKey: "accountCodeDesc",
            headclass: "cursor-pointer text-center",
        },

        {
            header: "Account No",
            accessorKey: "accountNumber",
            headclass: "cursor-pointer text-center",
        },

        {
            header: "Bank Name",
            accessorKey: "bankName",
            headclass: "cursor-pointer text-center",
        },
        {
            header: "Branch Name",
            accessorKey: "branchName",
            headclass: "cursor-pointer text-center",
        },

        {
            header: "Opening Balance",
            accessorKey: "openingBalance",
            headclass: "cursor-pointer text-center",
        },

        {
            header: "Month/Year",
            accessorKey: "monthName",
            headclass: "cursor-pointer text-center",
        },
    ];

    const [sorting, setSorting] = useState([]);
    const [filtering, setFiltering] = useState("");

    const table = useReactTable({
        data,
        columns: list,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting: sorting,
            globalFilter: filtering,
        },
        initialState: {
            pagination: {
                pageSize: parseInt(items),
            },
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
    });

    useEffect(() => {
        if (items == "all") table.setPageSize(9999);
        else table.setPageSize(parseInt(items));
    }, [items]);

    const { data: schemeList } = useQuery({
        queryKey: ["schemeList"],
        queryFn: async () => {
            const data = await fetch.get("/scheme/Get");
            return data?.data;
        },
    });

    const { data: finInstitution } = useQuery({
        queryKey: ["finInstitution"],
        queryFn: async () => {
            const data = await fetch.get("/FinInstitution/GetFinInstitutionForLGD?lgdCode=" + userData?.CORE_LGD);
            return data?.data;
        },
    });

    const { data: FinBranchList } = useQuery({
        queryKey: ["FinBranchList", bank], // Add `bank` to the query key
        queryFn: async () => {
            if (!bank) return null; // Prevent fetching if `bank` is empty
            const data = await fetch.get(
                `/FinBranch/Get?lgdCode=${userData?.USER_LEVEL === "GP"
                    ? userData?.GP_LGD
                    : userData?.USER_LEVEL === "BLOCK"
                        ? userData?.BLOCK_LGD
                        : userData?.DIST_LGD
                }&finInstId=${bank || branchName}`
            );
            return data?.data;
        },
        enabled: !!bank, // Disable query until `bank` is set
    });


    const months = [
        // { value: "1", label: "January" },
        // { value: "2", label: "February" },
        // { value: "3", label: "March" },
        { value: "4", label: "April" },
        // { value: "5", label: "May" },
        // { value: "6", label: "June" },
        // { value: "7", label: "July" },
        // { value: "8", label: "August" },
        // { value: "9", label: "September" },
        // { value: "10", label: "October" },
        // { value: "11", label: "November" },
        // { value: "12", label: "December" },
    ];

    const onAccountCode = (e) => {

        setAccountCode(e.target.value)
        if (e.target.value == 900000601) {
            setScheme("");
            setBank("");
            setBranch("");
            setAccountNo("");
        } else if (e.target.value == 900000001) {
            setScheme("");
        }
    }

    const onScheme = (e) => {
        setScheme(e.target.value)
    }
    const onBank = (e) => {
        setBank(e.target.value)

    }

    const onBranch = (e) => {
        setBranch(e.target.value)
    }

    const onAccountNo = (e) => {
        setAccountNo(e.target.value)
    }

    const onBalance = (e) => {
        setBalance(e.target.value)
    }

    const onPassBookBalance = (e) => {
        setPassBookBalance(e.target.value)

    }

    const onMonth = (e) => {
        setMonth(e.target.value)
    }


    const onSave = () => {
        if (!accountCode) {
            toast.error("Please Select Account Code")
        } else if (!(accountCode == 900000601 || accountCode == 900000001) && !scheme) {
            toast.error("Please Select Scheme");
        }

        else if (!(accountCode == 900000601) && !bank) {
            toast.error("Please Select Bank")
        }
        else if (!(accountCode == 900000601) && !branch) {
            toast.error("Please Select Branch")
        }
        else if (!(accountCode == 900000601) && !accountNo) {
            toast.error("Please Enter Account No")
        }
        else if (!month) {
            toast.error("Please Select Month")
        }
        else if (!balance) {
            toast.error("Please Enter Balance")
        }
        else if (!(accountCode == 900000601) && !passBookBalance) {
            toast.error("Please Enter Passbook Balance")
        } else {
            addInsertRealAccountOB(userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD, accountCode, scheme, bank, branch, accountNo, balance, currentFinancialYear, month, userData?.USER_INDEX, passBookBalance, (res) => {
                if (res?.status === 0) {
                    toast.success(res?.message);
                    setAccountCode("");
                    setScheme("");
                    setBank("");
                    setBranch("");
                    setAccountNo("");
                    setBalance("");
                    setYear("");
                    setMonth("");
                    setPassBookBalance("");
                    queryClient.invalidateQueries("realAccObList");

                } else {
                    toast.error(res?.message);
                }
            }, (err) => {
                toast.error(err);
            })
        }
    }

    const exportToExcel = (tableData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(tableData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };

    return (
        <>
            <SuccessModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                message={"Contractor Created Successfully"}
                to="contractor-master"
                // resetData={resetData}
                isSuccess={true}
            />
            <ToastContainer />

            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Real Account Code-Wise Opening Balance
                </legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full space-y-2">
                        <div className="flex items-center gap-4 ">

                            <div className="w-1/3">
                                <label
                                    htmlFor="receipt_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Bank Account Name/Cash/Try
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="receipt_name"
                                    name="receipt_name"
                                    autoComplete="off"
                                    className="block w-full p-2 border border-gray-300 rounded-md"
                                    onChange={onAccountCode}
                                    value={accountCode}
                                    ref={accCode}
                                >
                                    <option value="" selected hidden>
                                        Select Account Code
                                    </option>
                                    {realAccList?.map((d) => (
                                        <option value={d?.accountCode}>
                                            {d?.accountCodeDesc}
                                        </option>
                                    ))}
                                </select>
                            </div>



                            <div className="w-1/3">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Scheme
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    ref={schemeName}
                                    id="scheme_name"
                                    name="scheme_name"
                                    autoComplete="off"
                                    className="block w-full p-2 border border-gray-300 rounded-md"
                                    onChange={onScheme}
                                    value={scheme}
                                    disabled={accountCode == 900000601 || accountCode == 900000001 ? true : false}
                                >
                                    <option value="" selected hidden>
                                        Select Scheme
                                    </option>
                                    {schemeList?.map((d) => (
                                        <option value={d?.schemeId}>
                                            {d?.schemeName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-1/3">
                                <label
                                    htmlFor="department_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Bank name
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    ref={bankName}
                                    id="department_name"
                                    name="department_name"
                                    autoComplete="off"
                                    className="block w-full p-2 border border-gray-300 rounded-md"
                                    onChange={onBank}
                                    value={bank}
                                    disabled={accountCode == 900000601 ? true : false}

                                >
                                    <option value="" selected hidden>
                                        Select Bank
                                    </option>
                                    {finInstitution?.map((d) => (
                                        <option value={d?.finInstitutionId}>
                                            {d?.finInstitutionName}
                                        </option>
                                    ))}

                                </select>
                            </div>



                            <div className="w-1/3">
                                <label
                                    htmlFor="department_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Branch name
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    ref={branchName}
                                    id="department_name"
                                    name="department_name"
                                    autoComplete="off"
                                    className="block w-full p-2 border border-gray-300 rounded-md"
                                    onChange={onBranch}
                                    // value={branch}
                                    disabled={accountCode == 900000601 ? true : false}

                                >
                                    <option value="" selected hidden>
                                        Select Branch
                                    </option>

                                    {FinBranchList?.map((d) => (
                                        <option value={d?.branchId}>
                                            {d?.branchName}
                                        </option>
                                    ))}

                                </select>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="w-1/3">
                                <label
                                    htmlFor="receipt_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Account No
                                    <span className="text-red-500"> *</span>
                                </label>
                                <input
                                    ref={accNo}
                                    type="number"
                                    id="receipt_name"
                                    name="receipt_name"
                                    autoComplete="off"
                                    className="block w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Account No"
                                    onChange={onAccountNo}
                                    value={accountNo}
                                    disabled={accountCode == 900000601 ? true : false}
                                />

                            </div>

                            <div className="w-1/3">
                                <label
                                    htmlFor="department_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Fin Year
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select value={currentFinancialYear}
                                    disabled className="block w-full p-2 border border-gray-300 rounded-md">
                                    <option value={currentFinancialYear}>{currentFinancialYear}</option>
                                </select>
                            </div>

                            <div className="w-1/3">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Month
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    ref={monthName}
                                    id="scheme_name"
                                    name="scheme_name"
                                    autoComplete="off"
                                    className="block w-full p-2 border border-gray-300 rounded-md"
                                    onChange={onMonth}
                                    value={month}
                                >
                                    <option value="" selected hidden>
                                        Select Month
                                    </option>
                                    {months.map((month) => (
                                        <option key={month.value} value={month.value}>
                                            {month.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-1/3">
                                <label
                                    htmlFor="receipt_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Balance As Per Subsidiary
                                    <span className="text-red-500"> *</span>
                                </label>
                                <input
                                    ref={blnc}
                                    type="number"
                                    id="receipt_name"
                                    name="receipt_name"
                                    autoComplete="off"
                                    className="block w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Balance"
                                    onChange={onBalance}
                                    value={balance}
                                />

                            </div>
                            <div className="w-1/3">
                                <label
                                    htmlFor="receipt_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Passbook Balance
                                    <span className="text-red-500"> *</span>
                                </label>
                                <input
                                    ref={blnc}
                                    type="number"
                                    id="receipt_name"
                                    name="receipt_name"
                                    autoComplete="off"
                                    className="block w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Passbook Balance"
                                    onChange={onPassBookBalance}
                                    value={passBookBalance}
                                    disabled={accountCode == 900000601 ? true : false}
                                />

                            </div>
                            <div className="w-1/6 ">
                                <button
                                    type="button"
                                    className={classNames(
                                        "py-2 px-6 mt-5 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    )}
                                    onClick={onSave}


                                >
                                    {!mutationId ? "Submit" : "Update"}

                                </button>

                            </div>
                        </div>


                        {/* Button */}

                    </div>
                    <div className=" flex justify-between items-center h-10">
                        <div className="flex items-center space-x-0 h-8">
                            <select
                                className="rounded-lg h-10"
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
                            &nbsp;

                            <button
                                className="bg-cyan-700 text-white px-2 py-2 rounded text-sm "
                                onClick={() => exportToExcel(data, "OB_For_Real")}

                            >
                                Download Excel
                            </button>
                        </div>


                        <input
                            type="text"
                            value={filtering}
                            placeholder="search..."
                            className="border-2 rounded-lg border-zinc-400 h-10"
                            onChange={(e) => setFiltering(e.target.value)}
                        />

                    </div>
                    <div className="px-2 flex flex-col ">
                        <Table style={{ border: "1px solid #444 " }}>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <Table.Head key={headerGroup.id}>

                                    {headerGroup.headers.map((header) => (
                                        <Table.HeadCell
                                            key={header.id}
                                            className="p-2 bg-cyan-400/100 btn-blue text-xs"
                                            style={{ border: "1px solid #444" }} // Keep borders
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

                                </Table.Head>
                            ))}

                            <Table.Body className="divide-y" style={{ border: "1px solid #444 " }}>
                                {table.getRowModel().rows.map((row) => (
                                    <Table.Row key={row.id} style={{ border: "1px solid #444 " }}>
                                        {row.getVisibleCells().map((cell) => (
                                            <Table.Cell
                                                style={{ border: "1px solid #444 " }}
                                                key={cell.id}
                                                className="p-1 text-xs"

                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </Table.Cell>
                                        ))}
                                        {/* <Table.Cell className="flex items-center justify-center space-x-8">
                                        <button
                                            onClick={() => {

                                                accCode.current.value = row.original.accountCode;
                                                schemeName.current.value = row.original.schemeId;
                                                bankName.current.value = row.original.finInstId;
                                                branchName.current.value = row.original.branchId;
                                                accNo.current.value = row.original.accountNumber;
                                                finYear.current.value = row.original.finYear;
                                                monthName.current.value = row.original.monthNo;
                                                blnc.current.value = row.original.openingBalance;
                                                queryClient.invalidateQueries("FinBranchList");

                                                setMutationId(row.original?.accountCode);
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
                                    </Table.Cell> */}

                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                        {realAccObList?.length === 0 ? <div className="flex items-center justify-center bg-gray-200" style={{ marginTop: "10px" }}>
                            <div className="text-center">
                                <h1 className="text-2xl font-semibold text-black-800">No Data Found</h1>

                            </div>
                        </div> : ""}
                        <Pagination data={data} table={table} />
                    </div>

                </div>
            </div>



        </>
    );
};

export default ObForReal;
