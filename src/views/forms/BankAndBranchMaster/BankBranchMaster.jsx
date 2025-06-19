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



const BankBranchMaster = () => {
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

    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const [openModal, setOpenModal] = useState(false);
    const [ifsc, setIfsc] = useState("");
    const [error, setError] = useState(false);

    const { data: FinBranchList } = useQuery({
        queryKey: ["FinBranchList"],
        queryFn: async () => {
            const data = await fetch.get("/FinBranch/Get?lgdCode=" + (userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD) + "&finInstId=" + 0);
            // console.log(Array.isArray(data.data.result));
            return data?.data;
        },
    });


    console.log(mutationId, "mutationId")



    const finInstId = useRef(null);
    const branchName = useRef(null);
    const brnchIfsc = useRef(null);
    const branchCode = useRef(null);
    const branchAddress = useRef(null);
    const branchPhone = useRef(null);
    const branchEmail = useRef(null);
    const queryClient = useQueryClient();

    const { mutate: addPed, isPending: addPending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(newTodo, "/FinBranch/Insert");
        },

        onSuccess: () => {
            queryClient.invalidateQueries("FinBranchList");
            // designation.current.value = "";
            finInstId.current.value = "";
            branchName.current.value = "";
            brnchIfsc.current.value = "";
            branchCode.current.value = "";
            branchAddress.current.value = "";
            branchPhone.current.value = "";
            branchEmail.current.value = "";
        },
        mutationKey: ["adddesignation"],
    });
    console.log(mutationId, "mutationId")
    const { mutate: updatePed, isPending: updatePending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(
                newTodo,
                "/FinBranch/Update"
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries("FinBranchList");
            // designation.current.value = "";
            finInstId.current.value = "";
            branchName.current.value = "";
            brnchIfsc.current.value = "";
            branchCode.current.value = "";
            branchAddress.current.value = "";
            branchPhone.current.value = "";
            branchEmail.current.value = "";

            setMutationId(null);
        },
        mutationKey: ["updatedesignation"],
    });

    function performMutation() {
        if (finInstId.current.value === "") {
            toast.error("Please Select Financial Institute")

        } else if (branchName.current.value === "") {
            toast.error("Please Type Branch Name")
        } else if (error) {
            toast.error("Branch IFSC 5th character must be '0'")

        } else {
            if (mutationId === null)
                addPed({
                    "lgdCode": userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD,
                    "finInstId": finInstId.current.value,
                    "branchName": branchName.current.value,
                    "brnchIfsc": brnchIfsc.current.value,
                    "branchCode": branchCode.current.value,
                    "branchAddress": branchAddress.current.value,
                    "branchPhone": branchPhone.current.value,
                    "branchEmail": branchEmail.current.value,

                });
            else
                updatePed({
                    "lgdCode": userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD,
                    "branchId": mutationId,
                    "finInstId": finInstId.current.value,
                    "branchName": branchName.current.value,
                    "brnchIfsc": brnchIfsc.current.value,
                    "branchCode": branchCode.current.value,
                    "branchAddress": branchAddress.current.value,
                    "branchPhone": branchPhone.current.value,
                    "branchEmail": branchEmail.current.value,

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
        const sortedList = [...(FinBranchList ?? [])];
        sortedList.sort((a, b) => b.designationId - a.designationId);
        return sortedList;
    }, [FinBranchList]);

    const list = [
        {
            header: "Branch Id",
            accessorKey: "branchId",
            className: "text-left cursor-pointer",
            // cell: ({ row }) => row.index + 1,
            headclass: "cursor-pointer w-32",
            // sortingFn: "id",
        },
        {
            header: "Financial Institute",
            accessorKey: "finInstCode",
            headclass: "cursor-pointer",
        },
        {
            header: "Branch Name",
            accessorKey: "branchName",
            headclass: "cursor-pointer",
        },
        {
            header: "Branch Code",
            accessorKey: "branchCode",
            headclass: "cursor-pointer",
        },
        {
            header: "Branch Mobile",
            accessorKey: "branchPhone",
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

    // Function to extract PAN from GST number
    function extractPANFromGST(gstNumber) {
        if (gstNumber.length === 15) {
            return gstNumber.substring(2, 12);
        }
        return '';
    }


    const onGstIn = (event) => {
        const value = event.target.value.toUpperCase();
        // Regular expression to match GSTIN format
        const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
        if (regex.test(value) || value === '') {
            setGSTIN(value);
            setIsValid(true);
        } else {
            setIsValid(false);
        }

        if (value.length === 15) {
            const extractedPan = extractPANFromGST(value);
            branchCode.current.value = extractedPan;
            setPanNumber(extractedPan);
        } else {
            setPanNumber('');
        }
    };


    const onIfsc = (e) => {
        let value = e.target.value.toUpperCase().slice(0, 11); // Convert to uppercase & limit to 11 chars

        if (value.length >= 5 && value[4] !== "0") {
            toast.error("5th character must be '0'");
            setError(true);
        } else {
            setError(false);
        }

        setIfsc(value);
    };


    const onDate = (e) => {
        console.log(e, "eeeee")
        branchName.current.value = e;
        // console.log(new Date(e).toLocaleDateString("en-IN"))
        setCurrentDate(new Date(e))
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
        branchCode.current.value = e.target.value.toUpperCase()

        setPanNumber(value);

    }

    const onSubmit = () => {
        console.log("CLICKED")

        if (contractorName === '') {
            toast.error("Please Type Contractor name")
        } else if (currentDate === "") {
            toast.error("Please add Contractor DOB")
        } else if (mobileNumber === "") {
            toast.error("Please Type Contractor Mobile number")
        } else {
            addCreateContractor(
                contractorName, gstin, panNumber, mobileNumber, address, currentDate, userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD, userData?.USER_LEVEL === "GP" ? "3" : userData?.USER_LEVEL === "BLOCK" ? "2" : "1",
                (r) => {
                    console.log(r, "GPMSSIBAM");
                    if (r.statusCode === "0") {
                        setOpenModal(true);

                    } else {
                        toast.error(r.msg);
                    }
                }
            );
        }
    }

    const { data: finInstitution } = useQuery({
        queryKey: ["finInstitution"],
        queryFn: async () => {
            const data = await fetch.get("/FinInstitution/Get");
            return data?.data;
        },
    });

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
                <legend className="text-lg font-semibold text-cyan-700">Bank / Treasury Branch</legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full mb-2 space-y-2">
                        <div className="flex items-center gap-2">
                            {/* Financial Institute */}
                            <div className="flex-1">
                                <label
                                    htmlFor="financial_institute"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Financial Institute <span className="text-red-500"> * </span>
                                </label>
                                <select
                                    id="financial_institute"
                                    name="financial_institute"
                                    autoComplete="off"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                    ref={finInstId}
                                >
                                    <option value="" selected hidden>
                                        Select Bank / Treasury
                                    </option>
                                    {finInstitution?.map((d) => (
                                        <option value={d?.finInstitutionId}>
                                            {d?.finInstitutionName}
                                        </option>
                                    ))}
                                    {/* {EntityListDropDown} */}
                                </select>
                            </div>

                            {/* Branch Name */}
                            <div className="flex-1">
                                <label
                                    htmlFor="branch_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Bank / Treasury Branch Name<span className="text-red-500"> * </span>
                                </label>
                                <input
                                    id="branch_name"
                                    name="branch_name"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Bank / Treasury Branch Name"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                    ref={branchName}
                                    onChange={onGstIn}
                                    maxLength={50}
                                />
                            </div>

                            {/* Branch IFSC */}
                            <div className="flex-1">
                                <label
                                    htmlFor="branch_ifsc"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Branch IFSC
                                </label>
                                <input
                                    id="branch_ifsc"
                                    name="branch_ifsc"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Branch IFSC"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                    ref={brnchIfsc}
                                    required
                                    maxLength={11}
                                    onChange={onIfsc}

                                />
                            </div>

                            {/* Branch Code */}
                            <div className="flex-1">
                                <label
                                    htmlFor="branch_code"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Branch Code
                                </label>
                                <input
                                    id="branch_code"
                                    name="branch_code"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Branch Code"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                    ref={branchCode}
                                    required
                                    // onChange={onPanCard}
                                    maxLength={6}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">

                            {/* Branch Address */}
                            <div className="flex-1">
                                <label
                                    htmlFor="branch_address"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Branch Address
                                </label>
                                <input
                                    ref={branchAddress}
                                    id="branch_address"
                                    name="branch_address"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Branch Address"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                    onChange={onAddress}
                                    maxLength={50}
                                />
                                {!isValidAddress && (
                                    <div style={{ color: "red" }}>Please enter a valid Address</div>
                                )}
                            </div>

                            {/* Branch Mobile */}
                            <div className="flex-1">
                                <label
                                    htmlFor="branch_mobile"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Branch Mobile
                                </label>
                                <input
                                    ref={branchPhone}
                                    id="branch_mobile"
                                    name="branch_mobile"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Branch Mobile"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                    required
                                    onChange={onMobile}
                                    maxLength={10}
                                />
                                {!isValidMobile && (
                                    <div style={{ color: "red" }}>Please enter a valid Mobile Number</div>
                                )}
                            </div>

                            {/* Branch Email */}
                            <div className="flex-1">
                                <label
                                    htmlFor="branch_email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Branch Email
                                </label>
                                <input
                                    ref={branchEmail}
                                    id="branch_email"
                                    name="branch_email"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Branch Email"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                    required
                                    // onChange={onMobile}
                                    maxLength={50}
                                />

                            </div>



                            {/* Submit Button */}
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
                                // disabled
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
                            onClick={() => exportToExcel(data, "Bank_Treasury_Branch")}

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
                                <Table.HeadCell className="p-1 normal-case bg-cyan-400/90 border-black btn-blue text-xs">
                                    Actions
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
                                                finInstId.current.value = row.original.finInstId;
                                                branchName.current.value = row.original.branchName;
                                                brnchIfsc.current.value = row.original.empIfsc;
                                                branchCode.current.value = row.original.branchCode;
                                                branchPhone.current.value = row.original.branchPhone;
                                                branchEmail.current.value = row.original.branchEmail;
                                                branchAddress.current.value = row.original.branchAddress;
                                                // setCurrentDate(row.original?.branchName);
                                                setMutationId(row.original?.branchId);
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

export default BankBranchMaster;
