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


const EmployeeMaster = () => {
    const [mutationId, setMutationId] = useState(null);

    const [contractorName, setContractorName] = useState('');
    const [employeeyerCode, setEmployeeyerCode] = useState('');
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


    const { data: employeeList } = useQuery({
        queryKey: ["employeeList"],
        queryFn: async () => {
            const data = await fetch.get("/Employee/Get?lgdCode=" + (userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD) + "&empName=" + 0);
            // console.log(Array.isArray(data.data.result));
            return data?.data;
        },
    });


    console.log(mutationId, "mutationId")

    const employeeNm = useRef(null);
    const employeeCode = useRef(null);
    const employeePan = useRef(null);
    const employeeMob = useRef(null);
    const employeeAdress = useRef(null);
    const queryClient = useQueryClient();

    const { mutate: addPed, isPending: addPending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(newTodo, "/Employee/Insert");
        },
        onSuccess: () => {
            queryClient.invalidateQueries("employeeList");
            // designation.current.value = "";
            employeeNm.current.value = "";
            employeeCode.current.value = "";
            employeePan.current.value = "";
            employeeMob.current.value = "";
            employeeAdress.current.value = "";
        },
        mutationKey: ["adddesignation"],
    });
    console.log(mutationId, "mutationId")
    const { mutate: updatePed, isPending: updatePending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(
                newTodo,
                "/Employee/Update"
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries("employeeList");
            // designation.current.value = "";
            employeeNm.current.value = "";
            employeeCode.current.value = "";
            employeePan.current.value = "";
            employeeMob.current.value = "";
            employeeAdress.current.value = "";
            setMutationId(null);
        },
        mutationKey: ["updatedesignation"],
    });

    function performMutation() {
        if (employeeNm.current.value === "") {
            toast.error("Please Type Employee name")
        } else {
            if (mutationId === null)
                addPed({
                    "lgdCode": userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD,
                    "empName": employeeNm.current.value,
                    "empCode": employeeCode.current.value,
                    "empPan": employeePan.current.value,
                    "empAddress": employeeAdress.current.value,
                    "empPhone": employeeMob.current.value,
                    "lgdType": userData?.USER_LEVEL === "GP" ? "3" : userData?.USER_LEVEL === "BLOCK" ? "2" : "1",
                });
            else
                updatePed({
                    "lgdCode": userData?.CORE_LGD,
                    "empId": mutationId,
                    "empName": employeeNm.current.value,
                    "empCode": employeeCode.current.value,
                    "empPan": employeePan.current.value,
                    "empAddress": employeeAdress.current.value,
                    "empPhone": employeeMob.current.value,
                    "lgdType": userData?.USER_LEVEL === "GP" ? "3" : userData?.USER_LEVEL === "BLOCK" ? "2" : "1",
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
        const sortedList = [...(employeeList ?? [])];
        sortedList.sort((a, b) => b.designationId - a.designationId);
        return sortedList;
    }, [employeeList]);

    const list = [
        {
            header: "Code",
            accessorKey: "empId",
            className: "text-left cursor-pointer",
            // cell: ({ row }) => row.index + 1,
            headclass: "cursor-pointer w-32",
            // sortingFn: "id",
        },
        {
            header: "Employee Name",
            accessorKey: "empName",
            headclass: "cursor-pointer",
        },
        {
            header: "Employee ID",
            accessorKey: "empCode",
            headclass: "cursor-pointer",
        },
        {
            header: "Employee PAN",
            accessorKey: "empPAN",
            headclass: "cursor-pointer",
        },

        {
            header: "Employee Mobile number",
            accessorKey: "empPhone",
            headclass: "cursor-pointer",
        },

        {
            header: "Employee Designation",
            accessorKey: "empAddress",
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
        setAddress(event.target.value);

    };

    const onEmployeeName = (e) => {
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

    const onEmployeeCode = (e) => {
        setEmployeeyerCode(e.target.value)
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
        employeePan.current.value = e.target.value.toUpperCase()

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

            <div className="bg-white rounded-lg p-1 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Employee Master</legend>
                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full mb-4 space-y-1">
                        <div className="flex items-center gap-4 ">
                            {/* Employee Name */}
                            <div className="flex-1">
                                <label
                                    htmlFor="employee_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Employee Name <span className="text-red-500"> * </span>
                                </label>
                                <input
                                    id="employee_name"
                                    name="employee_name"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Employee Name"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                    onChange={onEmployeeName}
                                    onKeyDown={handleKeyDown}
                                    ref={employeeNm}
                                    maxLength={100}
                                />

                            </div>
                            {/* Employee Code */}

                            <div className="flex-1">
                                <label
                                    htmlFor="employee_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Employee ID
                                </label>
                                <input
                                    id="employee_name"
                                    name="employee_name"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Employee ID"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                    onChange={onEmployeeCode}
                                    // onKeyDown={handleKeyDown}
                                    ref={employeeCode}
                                    maxLength={100}
                                />

                            </div>

                            {/* Employee PAN */}
                            <div className="flex-1">
                                <label
                                    htmlFor="employee_pan"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Employee PAN
                                </label>
                                <input
                                    ref={employeePan}
                                    id="employee_pan"
                                    name="employee_pan"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Employee PAN"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                    required
                                    onChange={onPanCard}
                                    maxLength={10}
                                />
                                {!isValidPan && (
                                    <div style={{ color: "red" }}>Please enter a valid PAN Number</div>
                                )}
                            </div>

                            {/* Employee Mobile */}
                            <div className="flex-1">
                                <label
                                    htmlFor="employee_mobile"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Employee Mobile
                                </label>
                                <input
                                    ref={employeeMob}
                                    id="employee_mobile"
                                    name="employee_mobile"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Employee Mobile"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                    required
                                    onChange={onMobile}
                                    maxLength={10}
                                />
                                {!isValidMobile && (
                                    <div style={{ color: "red" }}>Please enter a valid Mobile Number</div>
                                )}
                            </div>

                            {/* Employee Address */}
                            <div className="flex-1">
                                <label
                                    htmlFor="employee_address"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Employee Designation
                                </label>
                                <input
                                    ref={employeeAdress}
                                    id="employee_address"
                                    name="employee_address"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Employee Designation"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                    onChange={onAddress}
                                />
                                {!isValidAddress && (
                                    <div style={{ color: "red" }}>Please enter a valid Address</div>
                                )}
                            </div>
                        </div>


                        <div className="w-1/6">
                            <button
                                type="button"
                                className={classNames(
                                    "btn-submit  py-1 px-10 border mt-2 border-transparent rounded-md shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                                    mutationId
                                        ? "btn-submit  py-1 px-10 border mt-2 border-transparent rounded-md shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        : "btn-submit  py-1 px-10 border mt-2 border-transparent rounded-md shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                )}
                                onClick={performMutation}

                            >
                                {!mutationId ? "Submit" : "Update"}
                            </button>
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
                            onClick={() => exportToExcel(data, "EMPLOYEE_MASTER")}
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
                                <Table.HeadCell className="normal-case bg-cyan-400/90 btn-blue">
                                    Edit
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
                                                employeeNm.current.value = row.original.empName;
                                                employeeCode.current.value = row.original.empCode;
                                                employeePan.current.value = row.original.empPAN;
                                                employeeAdress.current.value = row.original.empAddress;
                                                employeeMob.current.value = row.original.empPhone;
                                                setMutationId(row.original?.empId);
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

export default EmployeeMaster;
