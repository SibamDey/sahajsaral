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
import * as XLSX from "xlsx";
import { getAccountHeadList } from "../../../Service/Transaction/TransactionService";
const BankTrePassbook = () => {
    const [mutationId, setMutationId] = useState(null);
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const [accountHead, setAccountHead] = useState("")
    const [accountHeadId, setAccountHeadId] = useState("")
    const [headShowDropdown, setHeadShowDropdown] = useState(false);
    const [accountHeadAllList, setAccountHeadAllList] = useState([]);
    const [deductionHeadId, setDeductionHeadId] = useState("");


    const { data: contractorList } = useQuery({
        queryKey: ["contractorList"],
        queryFn: async () => {
            const data = await fetch.get("/Contractor/Get?lgdCode=" + (userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD) + "&contractorName=" + 0);
            // console.log(Array.isArray(data.data.result));
            return data?.data;
        },
    });

    const fromDate = useRef(null);
    const toDate = useRef(null);
    const deduction = useRef(null);
    const account = useRef(null);
    const groupName = useRef(null);
    const queryClient = useQueryClient();

    const { mutate: addPed, isPending: addPending, data: result, } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.get(`/Passbook/PrintPassBook?lgdCode=${userData?.CORE_LGD}&frmDate=${fromDate.current.value}&toDate=${toDate.current.value}&accountCode=${deductionHeadId ? deductionHeadId : 0}`);
        },

        mutationKey: ["adddesignation"],
    });
    console.log(result, "result")
    const { mutate: updatePed, isPending: updatePending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(
                newTodo,
                "/contractor/update/" + mutationId
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries("FinBranchList");
            // designation.current.value = "";

            fromDate.current.value = "";
            toDate.current.value = "";
            account.current.value = "";
            deduction.current.value = "";


            setMutationId(null);
        },
        mutationKey: ["updatedesignation"],
    });

    function performMutation() {
        if (deductionHeadId === "") {
            toast.error("Please select bank account")
        } else if (fromDate.current.value === "") {
            toast.error("Please select from date")
        } else if (toDate.current.value === "") {
            toast.error("Please select to date")
        } else {
            if (mutationId === null)
                addPed({
                    "lgdCode": userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD,
                    "fromDate": fromDate.current.value,
                    "toDate": toDate.current.value,



                });
            else
                updatePed({
                    "lgdCode": userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD,
                    "fromDate": fromDate.current.value,
                    "toDate": toDate.current.value,
                    "groupName": groupName.current.value,


                });
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
        const sortedList = [...(result?.data?.data ?? [])]; // Extracting the data array safely
        sortedList.sort((a, b) => (b.designationId ?? 0) - (a.designationId ?? 0)); // Sorting by designationId if it exists
        return sortedList;
    }, [result]);


    const list = [
        {
            header: "Voucher ID",
            accessorKey: "voucherId",
            headclass: "cursor-pointer",
            cell: ({ row }) => (
                <div className="flex items-center justify-center h-full px-2 py-1">
                    {row.original.voucherId}
                </div>
            ),
        },
        {
            header: "Voucher Date",
            accessorKey: "voucherDate",
            headclass: "cursor-pointer",
            cell: ({ row }) => (
                <div className="flex items-center justify-center h-full px-2 py-1">
                    {row.original.voucherDate}
                </div>
            ),
        },
        {
            header: "Instrument Type",
            accessorKey: "instrumentType",
            headclass: "cursor-pointer",
            cell: ({ row }) => (
                <div className="flex items-center justify-center h-full px-2 py-1">
                    {row.original.instrumentType}
                </div>
            ),
        },
        {
            header: "Instrument No",
            accessorKey: "instrumentNo",
            headclass: "cursor-pointer",
            cell: ({ row }) => (
                <div className="flex items-center justify-center h-full px-2 py-1">
                    {row.original.instrumentNo}
                </div>
            ),
        },
        {
            header: "Instrument Date",
            accessorKey: "instrumentDate",
            headclass: "cursor-pointer text-center",
            cell: ({ row }) => (
                <div className="flex items-center justify-center h-full px-2 py-1">
                    {row.original.instrumentDate}
                </div>
            ),
        },
        {
            header: "Passbook Date",
            accessorKey: "reconciliationDate",
            headclass: "cursor-pointer text-center", // optional: align header too
            cell: ({ row }) => {
                const value = row.original.reconciliationDate;
                const bgColor = !value ? "bg-red-100 text-red-700" : "";
                return (
                    <div className={`px-2 py-1 text-center ${bgColor}`}>
                        {value || "N/A"}
                    </div>
                );
            },
        },

        {
            header: "Amount Credit",
            accessorKey: "amountCredit",
            headclass: "cursor-pointer text-right", // aligns the header
            cell: ({ row }) => {
                const value = row.original.amountCredit;
                return (
                    <div className="text-right">
                        {value === "0.00" ? "" : value}
                    </div>
                );
            },
        },
        {
            header: "Amount Debit",
            accessorKey: "amountDebit",
            headclass: "cursor-pointer text-right", // Right-aligns the header
            cell: ({ row }) => {
                const value = row.original.amountDebit;
                return (
                    <div className="text-right">
                        {value === "0.00" ? "" : value}
                    </div>
                );
            },
        }
        ,

        {
            header: "Balance",
            accessorKey: "closingBalance",
            headclass: "cursor-pointer text-right", // Right-aligns the header
            cell: ({ row }) => {
                const value = row.original.closingBalance;
                return (
                    <div className="text-right">
                        {value ? value : value}
                    </div>
                );
            },
        }
        ,

    ]


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

    const { data: finInstitution } = useQuery({
        queryKey: ["finInstitution"],
        queryFn: async () => {
            const data = await fetch.get(`/RealAccount/GetRealAccountWithNumber?lgdCode=${userData?.CORE_LGD}`);
            return data?.data;
        },
    });

    const onAccountHead = (e) => {
        const value = e.target.value

        setAccountHead(value)

        setHeadShowDropdown(true)
        getAccountHeadList(userData?.CORE_LGD, value,
        ).then(function (result) {
            const response = result?.data;
            console.log(response, "report")
            setAccountHeadAllList(response);
        })
    }

    const onAccountHeadType = (i) => {
        setAccountHead(i?.groupName)
        setAccountHeadId(i?.groupId)
        setHeadShowDropdown(false)
    }

    const exportToExcel = (tableData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(tableData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };


    const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const day = selectedDate.getDate();

        if (day !== 1) {
            toast.error("Please select the 1st day of a month.");
            // Reset input
            e.target.value = "";
        } else {
            // setError("");
        }
    };

    return (
        <>

            <ToastContainer />

            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Bank/Treasury Passbook</legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full mb-4 space-y-1">
                        <div className="flex items-center gap-2">

                            <div className="flex-1">
                                <label
                                    htmlFor="financial_institute"
                                    className="block text-sm font-medium text-gray-700 "
                                >
                                    Bank Account
                                </label>
                                <select
                                    id="financial_institute"
                                    name="financial_institute"
                                    autoComplete="off"
                                    className="text-sm mt-1 p-2 block w-full border border-gray-300 rounded-md h-9"
                                    onChange={(e) => setDeductionHeadId(e.target.value)}
                                // ref={deduction}
                                >
                                    <option value="" selected >
                                        Select Bank A/C
                                    </option>
                                    {finInstitution?.map((e) => (
                                        <option value={e.accountCode}>
                                            {e.accountCodeDesc}
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
                                    ref={fromDate}
                                    onChange={handleDateChange}
                                    className="text-sm h-9 mt-1 p-2 block w-full border border-gray-300 rounded-md"

                                />
                            </div>

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
                                    ref={toDate}
                                />
                            </div>


                            <div className="flex-1">
                                <button
                                    style={{ marginTop: "22px" }}
                                    type="button"
                                    className={classNames(
                                        "py-1 px-4 border border-transparent rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500",
                                        mutationId
                                            ? "py-1 px-4"
                                            : "py-1 px-4"
                                    )}
                                    onClick={performMutation}
                                >
                                    {!mutationId ? "Search" : "Update"}
                                </button>
                            </div>
                        </div>
                        {/* <div className="flex items-center gap-2">



                            {headShowDropdown && (
                                <div className="absolute top-56 left-18 z-10  bg-white border border-gray-300 rounded shadow-md max-h-30 overflow-y-auto ml-4 w-[585px]">
                                    {accountHeadAllList.length > 0 ? (
                                        accountHeadAllList.map((d, index) => (
                                            <div
                                                key={index}
                                                className="text-xs w-full px-2 py-2 border border-gray-300 hover:bg-gray-200 cursor-pointer"
                                                onClick={() => onAccountHeadType(d)}
                                            >
                                                {d?.groupName}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-gray-500">No results found</div>
                                    )}
                                </div>
                            )}

                            <div className="flex-1">
                                <button
                                    style={{ marginTop: "22px" }}
                                    type="button"
                                    className={classNames(
                                        "py-1 px-4 border border-transparent rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500",
                                        mutationId
                                            ? "py-1 px-4"
                                            : "py-1 px-4"
                                    )}
                                    onClick={performMutation}
                                >
                                    {!mutationId ? "Search" : "Update"}
                                </button>
                            </div>
                        </div> */}

                    </div>
                </div>

                <div className=" flex justify-between items-center h-12">
                    <div className="flex items-center space-x-0">
                        <select
                            className="rounded-lg "
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
                            onClick={() => exportToExcel(data, "Bank_tre_passbook")}

                        >
                            Download Excel
                        </button>
                    </div>


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
                                        style={{ border: "1px solid #444 ", padding: "4px 8px", lineHeight: "1.2" }} // Reduced padding and line-height
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
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>

                    <Pagination data={data} table={table} />
                </div>
            </div>
        </>
    );
};

export default BankTrePassbook;
