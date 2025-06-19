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
import * as XLSX from "xlsx";


const RealAccountCode = () => {
    const [mutationId, setMutationId] = useState(null);
    console.log(mutationId, "mutationId")


    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const [openModal, setOpenModal] = useState(false);


    const { data: realAccList } = useQuery({
        queryKey: ["realAccList"],
        queryFn: async () => {
            const data = await fetch.get("/RealAccount/Get?lgdCode=" + (userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD));
            // console.log(Array.isArray(data.data.result));
            return data?.data;
        },
    });


    console.log(mutationId, "mutationId")

    const schemeNmBankAcc = useRef(null);

    const queryClient = useQueryClient();

    const { mutate: addPed, isPending: addPending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(newTodo, "/RealAccount/Insert");
        },
        onSuccess: () => {
            queryClient.invalidateQueries("realAccList");
            // designation.current.value = "";
            schemeNmBankAcc.current.value = "";

        },
        mutationKey: ["adddesignation"],
    });
    console.log(mutationId, "mutationId")
    const { mutate: updatePed, isPending: updatePending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(
                newTodo,
                "/employee/update/" + mutationId
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries("realAccList");
            // designation.current.value = "";

            setMutationId(null);
        },
        mutationKey: ["updatedesignation"],
    });

    function performMutation() {
        if (schemeNmBankAcc.current.value === "") {
            toast.error("Please Type Bank Account")
        } else {
            if (mutationId === null)
                addPed({
                    "lgdCode": userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD,
                    "accountCodeDesc": schemeNmBankAcc.current.value,

                });
            else
                updatePed({
                    "lgdCode": userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD,
                    "accountCodeDesc": schemeNmBankAcc.current.value,

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
        const sortedList = [...(realAccList ?? [])];
        sortedList.sort((a, b) => b.designationId - a.designationId);
        return sortedList;
    }, [realAccList]);

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
            header: "Scheme Name of Bank Account",
            accessorKey: "accountCodeDesc",
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

            <div className="bg-white rounded-lg p-1 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Real Account Code - Bank</legend>
                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-1/2 mb-2 space-y-2">
                        <div className="flex items-center space-x-6">
                            {/* Input Field */}
                            <div className="flex-1">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Scheme Name of Bank Account <span className="text-red-500"> * </span>
                                </label>
                                <input
                                    id="contractor_name"
                                    name="contractor_name"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Scheme Name of Bank Account"
                                    className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                                    ref={schemeNmBankAcc}
                                />
                            </div>

                            {/* Button */}
                            <button
                                type="button"
                                className={classNames(
                                    "py-1 px-2 mt-6 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                )}
                                onClick={performMutation}

                            >
                                {!mutationId ? "Submit" : "Update"}
                            </button>
                        </div>

                        <div className="w-1/6 px-12 ">

                        </div>
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
                            onClick={() => exportToExcel(data, "Real_Account_Code")}

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

                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    {realAccList?.length === 0 ? <div className="flex items-center justify-center bg-gray-200" style={{ marginTop: "10px" }}>
                        <div className="text-center">
                            <h1 className="text-2xl font-semibold text-black-800">No Data Found</h1>

                        </div>
                    </div> : ""}
                    <Pagination data={data} table={table} />
                </div>
            </div>
        </>
    );
};

export default RealAccountCode;
