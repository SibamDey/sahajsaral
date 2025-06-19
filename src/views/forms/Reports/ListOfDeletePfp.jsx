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
import { getListDeletePfp } from "../../../Service/Reports/ReportsService";
import * as XLSX from "xlsx";


const ListOfDeletePfp = () => {
    const [mutationId, setMutationId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [fromDate, setFromDate] = useState(false);
    const [toDate, setToDate] = useState(false);

    const accCode = useRef(null);
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const receiptPayment = useRef(null);
    const department = useRef(null);
    const scheme = useRef(null);
    const accountCodeDesc = useRef(null);
    const receiptPaymentNature = useRef(null);
    const fundType = useRef(null);
    const glGroup = useRef(null);
    const receiptPaymentGroup = useRef(null);
    const receiptPaymentGp = useRef(null);
    const majorCode = useRef(null);
    const minorCode = useRef(null);
    const subGroup = useRef(null);
    const objCode = useRef(null);
    const schemeUid = useRef(null);

    const schemeChildUid = useRef(null);
    const queryClient = useQueryClient();
    const [glGroupName, setGlGroupName] = useState("");
    const [listDeletepfpData, setListDeletepfpData] = useState([]);

    console.log(userData?.CORE_LGD, "userData")

    const { data: nominalAccList } = useQuery({
        queryKey: ["nominalAccList"],
        queryFn: async () => {
            const data = await fetch.get("/ReportViewer/DeletedPfpList?lgdCode=" + (userData?.CORE_LGD) + "&frmDate=" + (fromDate) + "&toDate=" + (toDate));
            return data?.data;
        },
    });

    const { data: getdata, mutate: addPed, isPending: addPending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(newTodo, "/StateAccountCode/Insert");
        },
        onSuccess: () => {
            queryClient.invalidateQueries("nominalAccList");
            if (receiptPayment.current.value === "R") {
                receiptPayment.current.value = "";
            } else {
                setGlGroupName("");
                receiptPayment.current.value = "";
                department.current.value = "";
                scheme.current.value = "";
                accountCodeDesc.current.value = "";
                receiptPaymentNature.current.value = "";
                fundType.current.value = "";
                glGroup.current.value = "";
                receiptPaymentGroup.current.value = "";
                receiptPaymentGp.current.value = "";
                majorCode.current.value = "";
                minorCode.current.value = "";
                subGroup.current.value = "";
                objCode.current.value = "";
                schemeUid.current.value = "";
                schemeChildUid.current.value = "";
            }

        },
        mutationKey: ["adddesignation"],
    });


    const { mutate: updatePed, isPending: updatePending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(
                newTodo,
                "/contractor/update/" + mutationId
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries("nominalAccList");
            receiptPayment.current.value = "";
            department.current.value = "";
            scheme.current.value = "";
            accountCodeDesc.current.value = "";
            receiptPaymentNature.current.value = "";
            fundType.current.value = "";
            glGroup.current.value = "";
            receiptPaymentGroup.current.value = "";
            receiptPaymentGp.current.value = "";
            majorCode.current.value = "";
            minorCode.current.value = "";
            subGroup.current.value = "";
            objCode.current.value = "";
            schemeUid.current.value = "";
            schemeChildUid.current.value = "";
            setMutationId(null);
        },
        mutationKey: ["updatedesignation"],
    });


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
        const sortedList = [...(nominalAccList ?? [])];
        sortedList.sort((a, b) => b.designationId - a.designationId);
        return sortedList;
    }, [nominalAccList]);

    const list = [
        {
            header: "PFP Date",
            accessorKey: "pfpDate",
            className: "text-left cursor-pointer px-2",
        },

        {
            header: "PFP ID",
            accessorKey: "pfpId",
            className: "text-left cursor-pointer px-2",

        },

        {
            header: "GL Group",
            accessorKey: "glGroup",
            className: "text-left cursor-pointer px-2",
        },
        // {
        //     header: "A/C Code Desc",
        //     accessorKey: "accountCodeDesc",
        //     className: "text-left cursor-pointer px-2",
        // },
        {
            header: "Amount",
            accessorKey: "netAmount",
            className: "text-left cursor-pointer px-2",
        },
        {
            header: "Remarks",
            accessorKey: "remarks",
            className: "text-left cursor-pointer px-2",
        },
        {
            header: "Delete Date",
            accessorKey: "deletedDate",
            className: "text-left cursor-pointer px-2",
        },
        {
            header: "Deleted By",
            accessorKey: "deletedBy",
            className: "text-left cursor-pointer px-2",
        },
        {
            header: "Delete Reason",
            accessorKey: "deletedreason",
            className: "text-left cursor-pointer px-2",
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

    const onFromDate = (e) => {
        setFromDate(e.target.value);
    }
    const onToDate = (e) => {
        setToDate(e.target.value);
    };

    const onSearch = () => {
        if (!fromDate) {
            toast.error("Please select from date")
        }
        else if (!toDate) {
            toast.error("Please select to date")
        } else {
            getListDeletePfp(userData?.CORE_LGD, fromDate, toDate)
                .then(function (result) {
                    const response = result?.data;
                    console.log(response, "report")
                    setListDeletepfpData(response);
                })
            queryClient.fetchQuery({ queryKey: ["nominalAccList"] });
        }
    }
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
                <legend className="text-lg font-semibold text-cyan-700">List of Deleted Pass for Payments</legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full mb-1 space-y-2">

                        <div className="flex items-center space-x-4">
                            <div className="w-1/7">
                                <label
                                    htmlFor="account_code_desc"
                                    className="block text-xsm font-medium text-gray-700"
                                >
                                    From Date<span className="text-red-500"> *</span>
                                </label>
                                <input

                                    id="account_code_desc"
                                    name="account_code_desc"
                                    type="date"
                                    autoComplete="off"
                                    placeholder="Account Code Desc"
                                    className="block w-full p-1 border border-gray-300 rounded-md"
                                    required
                                    maxLength={50}
                                    value={fromDate}
                                    onChange={onFromDate}
                                />
                            </div>
                            <div className="w-1/7">

                                <label
                                    htmlFor="account_code_desc"
                                    className="block text-xsm font-medium text-gray-700"
                                >
                                    To Date<span className="text-red-500"> *</span>
                                </label>
                                <input
                                    value={toDate}
                                    id="account_code_desc"
                                    name="account_code_desc"
                                    type="date"
                                    autoComplete="off"
                                    placeholder="Account Code Desc"
                                    className="block w-full p-1 border border-gray-300 rounded-md"
                                    required
                                    maxLength={50}
                                    onChange={onToDate}
                                />

                            </div>
                            <div className="col-span-2 flex justify-center items-center mt-6 gap-2">

                                <button
                                    type="search"
                                    className="bg-cyan-700 hover:bg-cyan-600 text-white font-bold py-1 px-8 rounded"
                                    onClick={onSearch}
                                >
                                    Search
                                </button>

                            </div>
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
                            onClick={() => exportToExcel(data, "Deleted_pfp_list")}

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
                                        className="p-1 bg-cyan-400/100 btn-blue text-xs"
                                        style={{ border: "1px solid #444" }} // Keep borders
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div className="flex items-center space-x-1 justify-between">
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
                                {/* <Table.HeadCell className="p-1 normal-case bg-cyan-400/90 border-black btn-blue text-xs">
                                    Actions
                                </Table.HeadCell> */}
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
                                    {/* 
                                    <Table.Cell className="border-gray-600 flex items-center justify-center space-x-4 p-1">
                                        <button onClick={() => {
                                            accCode.current.value = row.original.accountCode;
                                            receiptPayment.current.value = row.original.rcptpmntFlag === "Receipt" ? "R" : "P";
                                            department.current.value = row.original.deptId;
                                            scheme.current.value = row.original.schemeId;
                                            accountCodeDesc.current.value = row.original.accountCodeDescAct;
                                            receiptPaymentNature.current.value = row.original.rcptpmntNature;
                                            fundType.current.value = row.original.fundType;
                                            setGlGroupName(row.original.glGroupName);
                                            receiptPaymentGroup.current.value = row.original.rcptGroupPS;
                                            receiptPaymentGp.current.value = row.original.rcptGroupGP;
                                            majorCode.current.value = row.original.majorCode;
                                            minorCode.current.value = row.original.minorCode;
                                            subGroup.current.value = row.original.subCode;
                                            objCode.current.value = row.original.objectCode;
                                            schemeUid.current.value = row.original.schemeUid;
                                            schemeChildUid.current.value = row.original.schemechildUid;
                                            setMutationId(row.original.accountCode);
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        }}>
                                            <Icon
                                                icon={"mingcute:edit-line"}
                                                className="text-cyan-600 hover:underline text-lg cursor-pointer"
                                            />
                                        </button>
                                    </Table.Cell> */}
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

export default ListOfDeletePfp;
