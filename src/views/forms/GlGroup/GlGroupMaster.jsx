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


const GlGroupMaster = () => {
    const [mutationId, setMutationId] = useState(null);
    console.log(mutationId, "mutationId")
    const [contractorName, setContractorName] = useState('');
    const [gstin, setGSTIN] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [isValidContractorName, setIsValidContractorName] = useState(true);
    const [panNumber, setPanNumber] = useState('');
    const [isValidPan, setIsValidPan] = useState(true);
    const [mobileNumber, setMobileNumber] = useState("");
    const [isValidMobile, setIsValidMobile] = useState(true);
    const [address, setAddress] = useState("");
    const [isValidAddress, setIsValidAddress] = useState(true);
    const [currentDate, setCurrentDate] = useState("");

    const jsonString = localStorage.getItem("event_management_user_details");
    const userData = JSON.parse(jsonString);
    const [openModal, setOpenModal] = useState(false);


    const { data: schemeList } = useQuery({
        queryKey: ["schemeList"],
        queryFn: async () => {
            const data = await fetch.get("/GlGroup/Get?groupName=" + 0);
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
                    // "lfId": lfId.current.value,
                    "groupDesc": groupDesc.current.value,
                });
            else
                updatePed({
                    "groupId": groupId.current.value,
                    "groupName": groupName.current.value,
                    // "lfId": lfId.current.value,
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
            header: "Group Id",
            accessorKey: "groupId",
            headclass: "cursor-pointer",
        },
        {
            header: "Group Name",
            accessorKey: "groupName",
            headclass: "cursor-pointer",
        },

        {
            header: "Group Description",
            accessorKey: "groupDesc",
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

    const onDescription = (event) => {
        const value = event.target.value;
        const regex = /^[a-zA-Z0-9\s,\/]*$/;
        if (regex.test(value) || value === '') {
            setAddress(value);
            setIsValidAddress(true);
        } else {
            setIsValidAddress(false);
        }
    };

    const onContractorName = (e) => {
        const value = e.target.value;
        // Regular expression to allow only alphabets and white spaces
        const regex = /^[A-Za-z\s]+$/;
        if (regex.test(value)) {
            setContractorName(value);
            setIsValidContractorName(true)
        } else {
            setIsValidContractorName(false)
            // toast.error("Please use only Alphabet characters")

        }
    }

    const handleKeyDown = (event) => {
        // Allow only alphabets and white spaces
        if (
            !(
                (event.keyCode >= 65 && event.keyCode <= 90) || // A-Z
                (event.keyCode >= 97 && event.keyCode <= 122) || // a-z
                event.keyCode === 32 || event.key === "Backspace"
            )
        ) {
            event.preventDefault();
        }
    }

    const onMobile = (event) => {
        const value = event.target.value;
        const regex = /^[6-9]{1}[0-9]{9}$/;
        if (regex.test(value) || value === '') {
            setMobileNumber(value);
            setIsValidMobile(true);
        } else {
            setIsValidMobile(false);
        }
    };

    const onPanCard = (e) => {
        const value = e.target.value.toUpperCase()
        groupName.current.value = e.target.value.toUpperCase()

        setPanNumber(value);

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
                <legend className="text-lg font-semibold text-cyan-700">GL Group State Master</legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full space-y-2">
                        <div className="flex items-center gap-4 ">
                            {/* Group ID */}
                            <div className="flex-2">
                                <label
                                    htmlFor="group_id"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Group ID <span className="text-red-500"> * </span>
                                </label>
                                <input
                                    ref={groupId}
                                    id="group_id"
                                    name="group_id"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Group ID"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                    required
                                    maxLength={4}
                                />
                            </div>

                            {/* Group Name */}
                            <div className="flex-1">
                                <label
                                    htmlFor="group_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Group Name <span className="text-red-500"> * </span>
                                </label>
                                <input
                                    id="group_name"
                                    name="group_name"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Group Name"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                    onChange={onContractorName}
                                    onKeyDown={handleKeyDown}
                                    ref={groupName}
                                />
                                {!isValidContractorName && (
                                    <div style={{ color: "red" }}>Please enter a valid Group Name</div>
                                )}
                            </div>

                            {/* LF ID */}
                            {/* <div className="flex-1">
                                <label
                                    htmlFor="lf_id"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    LF ID
                                </label>
                                <input
                                    ref={lfId}
                                    id="lf_id"
                                    name="lf_id"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="LF ID"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                    required
                                />
                            </div> */}

                            {/* Group Description */}
                            <div className="flex-1">
                                <label
                                    htmlFor="group_desc"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Group Description
                                </label>
                                <input
                                    ref={groupDesc}
                                    id="group_desc"
                                    name="group_desc"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Group Description"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                    onChange={onDescription}
                                />

                            </div>
                            {userData?.USER_LEVEL === "HQ" ?
                            <div className="flex-2">
                                <button
                                    type="button"
                                    className={classNames(
                                        "btn-submit px-10 border mt-6 border-transparent rounded-md shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                                        mutationId
                                            ? "btn-submit  py-1 px-10 border mt-6 border-transparent rounded-md shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            : "btn-submit  py-1 px-10 border mt-6 border-transparent rounded-md shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    )}
                                    onClick={performMutation}
                            

                                >
                                    {!mutationId ? "Submit" : "Update"}
                                </button>
                            </div>:""}
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
                            onClick={() => exportToExcel(data, "GL_Group_Master")}

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
                                {userData?.USER_LEVEL === "HQ" ?
                                    <Table.HeadCell className="normal-case bg-cyan-400/90 btn-blue">
                                        Actions
                                    </Table.HeadCell> : ""}
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
                                    {userData?.USER_LEVEL === "HQ" ?
                                        <Table.Cell className="border-gray-600 flex items-center justify-center space-x-4 p-1">
                                            <button
                                                onClick={() => {
                                                    // designation.current.value = row.original.designation;
                                                    groupId.current.value = row.original.groupId;
                                                    groupName.current.value = row.original.groupName;
                                                    lfId.current.value = row.original.lfId;
                                                    groupDesc.current.value = row.original.groupDesc;
                                                    setMutationId(row.original?.groupId);
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
                                        </Table.Cell> : ""}
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    <Pagination data={data} table={table} />
                </div>
            </div >
        </>
    );
};

export default GlGroupMaster;
