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


const ListOfUsers = () => {
    const [mutationId, setMutationId] = useState(null);
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const [openModal, setOpenModal] = useState(false);


    const { data: schemeList } = useQuery({
        queryKey: ["schemeList"],
        queryFn: async () => {
            const data = await fetch.get("/UserList/Get?lgdCode=" + userData?.CORE_LGD);
            // console.log(Array.isArray(data.data.result));
            return data?.data;
        },
    });


    console.log(mutationId, "mutationId")

    const groupId = useRef(null);
    const groupName = useRef(null);
    const groupDesc = useRef(null);
    const lfId = useRef(null);
    const queryClient = useQueryClient();

    const { mutate: addPed, isPending: addPending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(newTodo, "/GlGroup/Insert");
        },
        onSuccess: () => {
            queryClient.invalidateQueries("schemeList");
            // designation.current.value = "";
            groupId.current.value = "";
            groupName.current.value = "";
            groupDesc.current.value = "";
            lfId.current.value = "";
        },
        mutationKey: ["adddesignation"],
    });
    console.log(mutationId, "mutationId")
    const { mutate: updatePed, isPending: updatePending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(
                newTodo,
                "/glGroup/update/" + mutationId
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries("schemeList");
            // designation.current.value = "";
            groupId.current.value = "";
            groupName.current.value = "";
            groupDesc.current.value = "";
            lfId.current.value = "";
            setMutationId(null);
        },
        mutationKey: ["updatedesignation"],
    });

    function performMutation() {
        if (groupId.current.value === "") {
            toast.error("Please Type Group Id")
        } else if (groupId.current.value.length != 4) {
            toast.error("Group Id should be 4 digit")
        } else if (groupName.current.value === "") {
            toast.error("Please Type Group Name")
        } else {
            if (mutationId === null)
                addPed({
                    "groupId": groupId.current.value,
                    "groupName": groupName.current.value,
                    "lfId": lfId.current.value,
                    "groupDesc": groupDesc.current.value,
                });
            else
                updatePed({
                    "groupId": groupId.current.value,
                    "groupName": groupName.current.value,
                    "lfId": lfId.current.value,
                    "groupDesc": groupDesc.current.value,
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
        const sortedList = [...(schemeList ?? [])];
        sortedList.sort((a, b) => b.designationId - a.designationId);
        return sortedList;
    }, [schemeList]);

    const list = [
        {
            header: "User Id",
            accessorKey: "userId",
            headclass: "cursor-pointer",
        },
        {
            header: "User Name",
            accessorKey: "userName",
            headclass: "cursor-pointer",
        },
        {
            header: "User Designation",
            accessorKey: "userDesignation",
            headclass: "cursor-pointer",
        },
        {
            header: "User Role",
            accessorKey: "userRole",
            headclass: "cursor-pointer",
        },
        {
            header: "User Mobile",
            accessorKey: "userMobile",
            headclass: "cursor-pointer",
        },
        {
            header: "User Status",
            accessorKey: "userStatus",
            headclass: "cursor-pointer",
        },
        {
            header: "User Created By",
            accessorKey: "userCreatedBy",
            headclass: "cursor-pointer",
        },
        {
            header: "User Created On",
            accessorKey: "userCreatedOn",
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

            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700 py-4">List of SAHAJ-SARAL Users </legend>

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
                            onClick={() => exportToExcel(data, "List_of_Users")}

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
                    <Pagination data={data} table={table} />
                </div>
            </div>
        </>
    );
};

export default ListOfUsers;
