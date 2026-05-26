import { useState, useEffect, useRef, useMemo } from "react";
import { Table } from "flowbite-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetch } from "../../../functions/Fetchfunctions";
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

const BankInterestCharges = () => {

    const [mutationId, setMutationId] = useState(null);

    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);

    const fromDate = useRef(null);
    const toDate = useRef(null);

    const queryClient = useQueryClient();

    /* ---------------- SEARCH API ---------------- */

    const {
        mutate: addPed,
        isPending: addPending,
        data: result
    } = useMutation({
        mutationFn: () => {
            return fetch.get(
                `/Register/BankInterestCharges?lgdCode=${userData?.CORE_LGD}&frmDate=${fromDate.current.value}&toDate=${toDate.current.value}`
            );
        },

        onSuccess: (res) => {

            if (res?.data?.statusCode === 0) {
                toast.success(
                    res?.data?.message || "Data Loaded Successfully"
                );
            }
            else {
                toast.error(
                    res?.data?.message || "Error loading data"
                );
            }
        },

        onError: () => {
            toast.error("API Error");
        },

        mutationKey: ["bankInterestCharges"]
    });

    /* optional update mutation (kept from original structure) */

    const {
        mutate: updatePed,
        isPending: updatePending
    } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(
                newTodo,
                "/contractor/update/" + mutationId
            );
        },

        onSuccess: () => {
            queryClient.invalidateQueries("FinBranchList");

            fromDate.current.value = "";
            toDate.current.value = "";

            setMutationId(null);
        },

        mutationKey: ["updatedesignation"],
    });

    /* ---------------- SEARCH FUNCTION ---------------- */

    function performMutation() {

        if (fromDate.current.value === "") {
            toast.error("Please select from date");
        }

        else if (toDate.current.value === "") {
            toast.error("Please select to date");
        }

        else {

            if (mutationId === null) {

                addPed();

            } else {

                updatePed();

            }
        }
    }

    /* prevent scrolling during loading */

    useEffect(() => {

        if (addPending || updatePending) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };

    }, [addPending, updatePending]);



    /* ---------------- TABLE DATA ---------------- */

    const ListOptions = [10, 20, 50, "all"];

    const [items, setItems] = useState(ListOptions[0]);

    const data = useMemo(() => {
        return result?.data?.data ?? [];
    }, [result]);



    const list = [
        {
            header: "Account Code",
            accessorKey: "accountCode",
            headclass: "cursor-pointer",
        },
        {
            header: "Account Description",
            accessorKey: "accountDescription",
            headclass: "cursor-pointer",
        },
        {
            header: "Bank Interest",
            accessorKey: "bankInterest",
            headclass: "cursor-pointer",
        },
        {
            header: "Bank Charges",
            accessorKey: "bankCharges",
            headclass: "cursor-pointer",
        }
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
            sorting,
            globalFilter: filtering
        },

        initialState: {
            pagination: {
                pageSize: parseInt(items)
            }
        },

        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering

    });


    useEffect(() => {

        if (items === "all") {
            table.setPageSize(9999);
        }
        else {
            table.setPageSize(parseInt(items));
        }

    }, [items]);



    /* ---------------- EXCEL EXPORT ---------------- */

    const exportToExcel = (tableData, fileName) => {

        const ws = XLSX.utils.json_to_sheet(tableData);

        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            wb,
            ws,
            "Sheet1"
        );

        XLSX.writeFile(
            wb,
            `${fileName}.xlsx`
        );
    };



    return (
        <>

            <ToastContainer />

            <div
                className="bg-white rounded-lg p-2 flex flex-col flex-grow"
                style={{ marginTop: "-40px" }}
            >

                <legend className="text-lg font-semibold text-cyan-700">
                    Bank Interest Charges
                </legend>


                {/* Filters */}

                <div className="flex flex-col space-y-2 py-1">

                    <div className="flex items-center gap-4">

                        <div className="flex-1">

                            <label className="block text-sm font-medium text-gray-700">
                                From Date
                                <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="date"
                                ref={fromDate}
                                className="text-sm h-9 mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            />

                        </div>


                        <div className="flex-1">

                            <label className="block text-sm font-medium text-gray-700">
                                To Date
                                <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="date"
                                ref={toDate}
                                className="text-sm h-9 mt-1 p-2 block w-full border border-gray-300 rounded-md"
                            />

                        </div>


                        <div className="flex-1">

                            <button
                                style={{ marginTop: "22px" }}
                                type="button"
                                className={classNames(
                                    "py-2 px-6 border border-transparent rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700"
                                )}
                                onClick={performMutation}
                            >
                                Search
                            </button>

                        </div>

                    </div>

                </div>


                {/* Top controls */}

                <div className="flex justify-between items-center h-12">

                    <div className="flex items-center">

                        <select
                            className="rounded-lg"
                            value={items}
                            onChange={(e) =>
                                setItems(e.target.value)
                            }
                        >
                            {
                                ListOptions.map((e) => (
                                    <option
                                        key={e}
                                        value={e}
                                    >
                                        {e}
                                    </option>
                                ))
                            }
                        </select>

                        &nbsp;

                        <button
                            className="bg-cyan-700 text-white px-2 py-2 rounded text-sm"
                            onClick={() =>
                                exportToExcel(
                                    data,
                                    "Bank_Interest_Charges"
                                )
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
                        onChange={(e) =>
                            setFiltering(e.target.value)
                        }
                    />

                </div>



                {/* Table */}

                <div className="flex flex-col space-y-6 pb-8">

                    <Table style={{ border: "1px solid #444" }}>

                        {table.getHeaderGroups().map((headerGroup) => (

                            <Table.Head key={headerGroup.id}>

                                {headerGroup.headers.map((header) => (

                                    <Table.HeadCell
                                        key={header.id}
                                        style={{
                                            border: "1px solid #444",
                                            padding: "4px 8px"
                                        }}
                                        className="bg-cyan-400/90"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >

                                        <div className="flex items-center justify-between">

                                            <span>
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            </span>

                                            <SortIcon
                                                sort={header.column.getIsSorted()}
                                            />

                                        </div>

                                    </Table.HeadCell>

                                ))}

                            </Table.Head>

                        ))}



                        <Table.Body>

                            {table.getRowModel().rows.map((row) => (

                                <Table.Row key={row.id}>

                                    {row.getVisibleCells().map((cell) => (

                                        <Table.Cell
                                            key={cell.id}
                                            className="p-1 text-xs"
                                            style={{
                                                border: "1px solid #444"
                                            }}
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

                    <Pagination
                        data={data}
                        table={table}
                    />

                </div>

            </div>

        </>
    );
};

export default BankInterestCharges;