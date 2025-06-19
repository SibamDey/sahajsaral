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


const JobWorker = () => {
    const [mutationId, setMutationId] = useState(null);
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

    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const [openModal, setOpenModal] = useState(false);


    const { data: jobWorkerList } = useQuery({
        queryKey: ["jobWorkerList"],
        queryFn: async () => {
            const data = await fetch.get("/JobWorker/Get?lgdCode=" + (userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD) + "&jobWorkerName=" + 0);
            return data?.data;
        },
    });

    const jobWorkerName = useRef(null);
    const jobWorkerMobile = useRef(null);
    const jobWorkerAddress = useRef(null);
    const queryClient = useQueryClient();

    const { mutate: addPed, isPending: addPending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(newTodo, "/JobWorker/Insert");
        },
        onSuccess: () => {
            queryClient.invalidateQueries("jobWorkerList");

            jobWorkerName.current.value = "";
            jobWorkerMobile.current.value = "";
            jobWorkerAddress.current.value = "";
        },
        mutationKey: ["adddesignation"],
    });

    const { mutate: updatePed, isPending: updatePending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(
                newTodo,
                "/jobWorker/update"
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries("jobWorkerList");
            // designation.current.value = "";
            jobWorkerName.current.value = "";
            jobWorkerMobile.current.value = "";
            jobWorkerAddress.current.value = "";
            setMutationId(null);
        },
        mutationKey: ["updatedesignation"],
    });

    function performMutation() {
        if (jobWorkerName.current.value === "") {
            toast.error("Please Type Job worker name")
        } else {
            if (mutationId === null)
                addPed({
                    "lgdCode": userData?.CORE_LGD,
                    "jobWorkerName": jobWorkerName.current.value,
                    "jobWorkerAddress": jobWorkerAddress.current.value,
                    "jobWorkerPhone": jobWorkerMobile.current.value,
                    "lgdType": userData?.USER_LEVEL === "GP" ? "3" : userData?.USER_LEVEL === "BLOCK" ? "2" : "1",
                });
            else
                updatePed({
                    "lgdCode": userData?.CORE_LGD,
                    "jobWorkerId": mutationId,
                    "jobWorkerName": jobWorkerName.current.value,
                    "jobWorkerAddress": jobWorkerAddress.current.value,
                    "jobWorkerPhone": jobWorkerMobile.current.value,
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
        const sortedList = [...(jobWorkerList ?? [])];
        sortedList.sort((a, b) => b.designationId - a.designationId);
        return sortedList;
    }, [jobWorkerList]);

    const list = [
        {
            header: "ID",
            accessorKey: "jobWorkerId",
            className: "text-center cursor-pointer",
            // cell: ({ row }) => row.index + 1,
            headclass: "cursor-pointer w-32",
            // sortingFn: "id",
        },
        {
            header: "Job Worker Name",
            accessorKey: "jobWorkerName",
            headclass: "cursor-pointer",
        },
        {
            header: "Job Worker Mobile Number",
            accessorKey: "jobWorkerPhone",
            headclass: "cursor-pointer",
        },
        {
            header: "Job Worker Address",
            accessorKey: "jobWorkerAddress",
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

    const onAddress = (event) => {
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
                <legend className="text-lg font-semibold text-cyan-700">Job Worker Master</legend>
                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full mb-2 space-y-2">
                        <div className="flex items-center space-x-4">
                            <div className="w-1/3">
                                <label
                                    htmlFor="job_worker_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Job Worker Name <span className="text-red-500"> * </span>
                                </label>
                                <input
                                    id="job_worker_name"
                                    name="job_worker_name"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Job Worker Name"
                                    className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                                    onChange={onContractorName}
                                    onKeyDown={handleKeyDown}
                                    ref={jobWorkerName}
                                />
                                {!isValidContractorName && (
                                    <div style={{ color: "red" }}>Please enter a valid Job Worker Name</div>
                                )}
                            </div>

                            <div className="w-1/3">
                                <label
                                    htmlFor="job_worker_mobile"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Job Worker Mobile Number
                                </label>
                                <input
                                    ref={jobWorkerMobile}
                                    id="job_worker_mobile"
                                    name="job_worker_mobile"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Job Worker Mobile Number"
                                    className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                                    required
                                    onChange={onMobile}
                                    maxLength={10}
                                />
                                {!isValidMobile && (
                                    <div style={{ color: "red" }}>Please enter a valid Mobile Number</div>
                                )}
                            </div>

                            <div className="w-1/3">
                                <label
                                    htmlFor="job_worker_address"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Job Worker Address
                                </label>
                                <input
                                    ref={jobWorkerAddress}
                                    id="job_worker_address"
                                    name="job_worker_address"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Job Worker Address"
                                    className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                                    onChange={onAddress}
                                />
                                {!isValidAddress && (
                                    <div style={{ color: "red" }}>Please enter a valid Address</div>
                                )}
                            </div>

                            <div className="w-1/3 ">
                                <button
                                    type="button"
                                    className={classNames(
                                        "btn-submit  py-1 px-10 border mt-6 border-transparent rounded-md shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                                        mutationId
                                            ? "btn-submit  py-1 px-10 border mt-6 border-transparent rounded-md shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            : "btn-submit  py-1 px-10 border mt-6 border-transparent rounded-md shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    )}
                                    onClick={performMutation}

                                >
                                    {!mutationId ? "Submit" : "Update"}
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
                            onClick={() => exportToExcel(data, "JOB_WORKER_LIST")}
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
                            <Table.Head key={headerGroup.id} className="text-center">

                                {headerGroup.headers.map((header) => (
                                    <Table.HeadCell
                                        key={header.id}
                                        className="p-2 bg-cyan-400/100 btn-blue text-xs text-center"
                                        style={{ border: "1px solid #444" }} // Keep borders
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div className="flex items-center space-x-2 justify-between text-center">
                                                <span className="normal-case text-center">
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
                                    Edit
                                </Table.HeadCell>
                            </Table.Head>
                        ))}

                        <Table.Body className="divide-y " style={{ border: "1px solid #444 " }}>
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

                                    <Table.Cell className="border-gray-600 flex items-center justify-center space-x-4 p-1">
                                        <button
                                            onClick={() => {
                                                // designation.current.value = row.original.designation;
                                                jobWorkerName.current.value = row.original.jobWorkerName;
                                                jobWorkerAddress.current.value = row.original.jobWorkerAddress;
                                                jobWorkerMobile.current.value = row.original.jobWorkerPhone;
                                                setMutationId(row.original?.jobWorkerId);
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
                </div>
            </div>
        </>
    );
};

export default JobWorker;
