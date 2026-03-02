import { useState, useEffect, useRef, useMemo } from "react";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Table } from "flowbite-react";
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

const TaxCollectorTransaction = () => {
    const [mutationId, setMutationId] = useState(null);
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const [openModal, setOpenModal] = useState(false);

    // 🔹 Transaction type: 0 = both, R = recharge, W = withdrawal
    const [tranType, setTranType] = useState("0");

    // 🔹 Selected Tax Collector ID (from dropdown)
    const [selectedTcsId, setSelectedTcsId] = useState("");

    const mode = useRef(null);
    const fromDate = useRef(null);
    const toDate = useRef(null);
    const groupName = useRef(null);
    const queryClient = useQueryClient();

    // 🔹 Common LGD code derived from userData
    const lgdCode = useMemo(() => {
        if (userData?.USER_LEVEL === "GP") return userData?.GP_LGD;
        if (userData?.USER_LEVEL === "BLOCK") return userData?.BLOCK_LGD;
        return userData?.DIST_LGD;
    }, [userData]);

    // (Optional) FinBranchList kept from your original code
    const { data: FinBranchList } = useQuery({
        queryKey: ["FinBranchList", lgdCode],
        queryFn: async () => {
            const data = await fetch.get(
                `/FinBranch/Get?lgdCode=${lgdCode}&mode=0`
            );
            return data?.data;
        },
        enabled: !!lgdCode,
    });

    // 🔹 NEW: Fetch Tax Collector list for dropdown
    const {
        data: taxCollectors = [],
        isLoading: tcsLoading,
    } = useQuery({
        queryKey: ["taxCollectors", lgdCode],
        queryFn: async () => {
            const res = await fetch.get(
                `/PtaxWallet/TaxCollcetorWiseAvlBalance?lgdCode=${userData?.CORE_LGD}`
            );
            // Expecting array like:
            // [{ tcsId, tcsName, activateDate, availableBalance }]
            return res?.data || [];
        },
        enabled: !!lgdCode,
    });

    console.log(mutationId, "mutationId");

    // 🔹 Fetch Tax Collector Transaction list
    const {
        mutate: addPed,
        isPending: addPending,
        data: result,
    } = useMutation({
        mutationFn: () => {
            return fetch.get(
                `/PtaxWallet/TaxCollcetorTransaction?lgdCode=${userData?.CORE_LGD}&tcsId=${selectedTcsId}&tranType=${tranType}&frmDate=${fromDate.current.value}&toDate=${toDate.current.value}`
            );
        },
        mutationKey: ["taxCollectorTransaction"],
    });

    console.log(result, "result");

    const { mutate: updatePed, isPending: updatePending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(newTodo, "/contractor/update/" + mutationId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["FinBranchList", lgdCode]);
            mode.current.value = "";
            fromDate.current.value = "";
            toDate.current.value = "";
            groupName.current.value = "";
            setMutationId(null);
        },
        mutationKey: ["updatedesignation"],
    });

    console.log(userData?.USER_LEVEL, "userData?.USER_LEVEL");

    function performMutation() {
        if (fromDate.current.value === "") {
            toast.error("Please select from date");
        } else if (toDate.current.value === "") {
            toast.error("Please select to date");
        } else if (!selectedTcsId) {
            toast.error("Please select Tax Collector");
        } else {
            if (mutationId === null) {
                addPed();
            } else {
                updatePed({
                    lgdCode: lgdCode,
                    mode: mode.current.value,
                    fromDate: fromDate.current.value,
                    toDate: toDate.current.value,
                    groupName: groupName.current.value,
                });
            }
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

    // 🔹 Table data from transaction API
    const data = useMemo(() => {
        const list = result?.data ?? [];
        if (!Array.isArray(list)) return [];
        return list;
    }, [result]);

    // 🔹 Table columns matching your transaction API response
    const list = [
        {
            header: "TCS ID",
            accessorKey: "tcsId",
            headclass: "cursor-pointer w-32",
        },
        {
            header: "Tax Collector Name",
            accessorKey: "tcsName",
            headclass: "cursor-pointer",
        },
        {
            header: "Transaction Date",
            accessorKey: "transactionDate",
            headclass: "cursor-pointer",
        },
        {
            header: "Transaction Type",
            accessorKey: "transactionType",
            headclass: "cursor-pointer",
        },
        {
            header: "Transaction Amount",
            accessorKey: "transactionAmount",
            headclass: "cursor-pointer",
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
        if (items === "all") table.setPageSize(9999);
        else table.setPageSize(parseInt(items));
    }, [items, table]);

    // (Optional) finInstitution kept from original
    const { data: finInstitution } = useQuery({
        queryKey: ["finInstitution", userData?.CORE_LGD],
        queryFn: async () => {
            const data = await fetch.get(
                `/GlGroup/GetAccountHeadGlGroup?lgdCode=${userData?.CORE_LGD}&groupName=0`
            );
            return data?.data;
        },
        enabled: !!userData?.CORE_LGD,
    });

    const exportToExcel = (tableData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(tableData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };

    return (
        <>
            <ToastContainer />

            <div
                className="bg-white rounded-lg p-2 flex flex-col flex-grow"
                style={{ marginTop: "-40px" }}
            >
                <legend className="text-lg font-semibold text-cyan-700">
                    Tax Collector Transaction
                </legend>

                <div className="flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full space-y-2">
                        <div className="flex items-center gap-4 ">
                            {/* From Date */}
                            <div className="flex-1">
                                <label
                                    htmlFor="From"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    From Date
                                    <span className="text-red-500"> * </span>
                                </label>
                                <input
                                    id="From"
                                    name="From"
                                    type="date"
                                    ref={fromDate}
                                    className="text-sm h-9 mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                />
                            </div>

                            {/* To Date */}
                            <div className="flex-1">
                                <label
                                    htmlFor="To"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    To Date
                                    <span className="text-red-500"> * </span>
                                </label>
                                <input
                                    id="To"
                                    name="To"
                                    type="date"
                                    className="text-sm h-9 mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                    ref={toDate}
                                />
                            </div>

                            {/* 🔹 Transaction Type dropdown */}
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Transaction Type
                                </label>

                                <select
                                    value={tranType}
                                    onChange={(e) => setTranType(e.target.value)}
                                    className="text-sm h-9 mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                >
                                    <option value="0">Both</option>
                                    <option value="R">Wallet Recharge</option>
                                    <option value="P">Wallet Withdrawal</option>
                                </select>
                            </div>

                            {/* 🔹 NEW: Tax Collector dropdown */}
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    Tax Collector
                                    <span className="text-red-500"> * </span>
                                </label>

                                <select
                                    value={selectedTcsId}
                                    onChange={(e) => setSelectedTcsId(e.target.value)}
                                    className="text-sm h-9 mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                >
                                    <option value="">
                                        {tcsLoading
                                            ? "Loading tax collectors..."
                                            : "Select Tax Collector"}
                                    </option>

                                    {taxCollectors.map((tcs) => (
                                        <option key={tcs.tcsId} value={tcs.tcsId}>
                                            {/* label: tcsName (tcsId) */}
                                            {tcs.tcsName} ({tcs.tcsId})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Search Button */}
                            <div className="flex-1">
                                <button
                                    style={{ marginTop: "22px" }}
                                    type="button"
                                    className={classNames(
                                        "py-2 px-6 border border-transparent rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500",
                                        mutationId ? "py-2 px-6" : "py-2 px-6"
                                    )}
                                    onClick={performMutation}
                                >
                                    {!mutationId ? "Search" : "Update"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top bar: page size + Excel + search box */}
                <div className="flex justify-between items-center h-12">
                    <div className="flex items-center space-x-0">
                        <select
                            className="rounded-lg "
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
                            onClick={() =>
                                exportToExcel(data, "tax_collector_transactions")
                            }
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

                {/* Table */}
                <div className="flex flex-col space-y-6 pb-8">
                    <Table style={{ border: "1px solid #444 " }}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Table.Head key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <Table.HeadCell
                                        style={{
                                            border: "1px solid #444 ",
                                            padding: "4px 8px",
                                            lineHeight: "1.2",
                                        }}
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

                        <Table.Body
                            className="divide-y"
                            style={{ border: "1px solid #444 " }}
                        >
                            {table.getRowModel().rows.map((row) => (
                                <Table.Row
                                    key={row.id}
                                    style={{ border: "1px solid #444 " }}
                                >
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

export default TaxCollectorTransaction;