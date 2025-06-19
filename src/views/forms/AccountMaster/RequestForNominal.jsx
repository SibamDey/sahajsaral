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
const RequestForNominal = () => {
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


    const { data: FinBranchList } = useQuery({
        queryKey: ["FinBranchList"],
        queryFn: async () => {
            const data = await fetch.get("/NominalAccount/RequestAccountCode?lgdCode=" + (userData?.CORE_LGD));
            // console.log(Array.isArray(data.data.result));
            return data?.data;
        },
    });

    const deptId = useRef(null);
    const schemId = useRef(null);
    const glId = useRef(null);
    const accDesc = useRef(null);
    const remarks = useRef(null);

    const queryClient = useQueryClient();

    const { mutate: addPed, isPending: addPending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(newTodo, "/NominalAccount/RequestAccountCode");
        },

        onSuccess: () => {
            queryClient.invalidateQueries("FinBranchList");
            // designation.current.value = "";
            deptId.current.value = "";
            schemId.current.value = "";
            glId.current.value = "";
            accDesc.current.value = "";
            remarks.current.value = "";

        },
        mutationKey: ["adddesignation"],
    });
    console.log(mutationId, "mutationId")
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
            deptId.current.value = "";
            schemId.current.value = "";
            glId.current.value = "";
            accDesc.current.value = "";
            remarks.current.value = "";


            setMutationId(null);
        },
        mutationKey: ["updatedesignation"],
    });
    console.log(userData?.USER_LEVEL, "userData?.USER_LEVEL")
    function performMutation() {
        if (deptId.current.value === "") {
            toast.error("Please Select Department")
        } else if (schemId.current.value === "") {
            toast.error("Please Select Scheme")
        } else if (glId.current.value === "") {
            toast.error("Please Type General Ledger")
        } else if (accDesc.current.value === "") {
            toast.error("Please Type Account Description")
        } else {
            if (mutationId === null)
                addPed({
                    "lgdCode": userData?.CORE_LGD,
                    "deptId": deptId.current.value,
                    "schemeId": schemId.current.value,
                    "groupName": glId.current.value,
                    "accountDesc": accDesc.current.value,
                    "remarks": remarks.current.value,
                    "userIndex": userData?.USER_INDEX,


                });
            else
                updatePed({
                    "lgdCode": userData?.CORE_LGD,
                    "deptId": deptId.current.value,
                    "schemeId": schemId.current.value,
                    "groupName": glId.current.value,
                    "accountDesc": accDesc.current.value,
                    "remarks": remarks.current.value,
                    "userIndex": userData?.USER_INDEX,

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
            header: "PRI Address",
            accessorKey: "priName",
            headclass: "cursor-pointer",
        },
        {
            header: "Name of Department",
            accessorKey: "deptName",
            headclass: "cursor-pointer",
        },
        {
            header: "Name of Scheme",
            accessorKey: "schemeName",
            headclass: "cursor-pointer",
        },
        {
            header: "Group Name",
            accessorKey: "groupName",
            headclass: "cursor-pointer",
        },
        {
            header: "Account Description",
            accessorKey: "accountDesc",
            headclass: "cursor-pointer",
        },
        {
            header: "Remarks",
            accessorKey: "remarks",
            headclass: "cursor-pointer",
        },

        {
            header: "Status",
            accessorKey: "stts",
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

    const { data: departmentList } = useQuery({
        queryKey: ["departmentList"],
        queryFn: async () => {
            const data = await fetch.get("/department/Get?deptName=0");
            return data?.data;
        },
    });

    const { data: schemeData } = useQuery({
        queryKey: ["schemeData"],
        queryFn: async () => {
            const data = await fetch.get("/scheme/Get");
            return data?.data;
        },
    });

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
                <legend className="text-lg font-semibold text-cyan-700">Request For New Nominal A/C</legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full mb-2 space-y-2">
                        <div className="flex items-center gap-2">
                            {/* Financial Institute */}
                            <div className="flex-1">
                                <label
                                    htmlFor="financial_institute"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Source Department <span className="text-red-500"> * </span>
                                </label>
                                <select
                                    id="financial_institute"
                                    name="financial_institute"
                                    autoComplete="off"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md text-sm"
                                    ref={deptId}
                                >
                                    <option value="" selected hidden>
                                        Select Source Department
                                    </option>
                                    {departmentList?.map((d) => (
                                        <option value={d?.deptId}>
                                            {d?.deptName}
                                        </option>
                                    ))}
                                    {/* {EntityListDropDown} */}
                                </select>
                            </div>

                            <div className="flex-1">
                                <label
                                    htmlFor="financial_institute"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Name of Scheme <span className="text-red-500"> * </span>
                                </label>
                                <select
                                    id="financial_institute"
                                    name="financial_institute"
                                    autoComplete="off"
                                    className="text-sm mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                    ref={schemId}
                                >
                                    <option value="" selected hidden>
                                        Select Scheme
                                    </option>
                                    {schemeData?.map((d) => (
                                        <option value={d?.schemeId}>
                                            {d?.schemeName}
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
                                    General Ledger<span className="text-red-500"> * </span>
                                </label>
                                <input
                                    id="branch_name"
                                    name="branch_name"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="General Ledger"
                                    className="text-sm mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                    ref={glId}
                                // onChange={onGstIn}
                                // maxLength={15}
                                />
                            </div>

                            {/* Branch IFSC */}
                            <div className="flex-1">
                                <label
                                    htmlFor="branch_ifsc"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Account Description<span className="text-red-500"> * </span>
                                </label>
                                <input
                                    id="branch_ifsc"
                                    name="branch_ifsc"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Account Description"
                                    className="text-sm mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                    ref={accDesc}
                                    maxLength={100}
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
                                    Remarks
                                </label>
                                <input
                                    ref={remarks}
                                    id="branch_address"
                                    name="branch_address"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Remarks"
                                    className="text-sm mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                // onChange={onAddress}
                                />

                            </div>




                            {/* Submit Button */}
                            <div className="flex-1">
                                <button
                                    style={{ marginTop: "22px" }}
                                    type="button"
                                    className={classNames(
                                        "py-1 px-2 border border-transparent rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500",
                                        mutationId
                                            ? "py-1 px-2"
                                            : "py-1 px-2"
                                    )}
                                    onClick={performMutation}
                                >
                                    Forward
                                </button>
                                &nbsp;

                                <button
                                    style={{ marginTop: "22px" }}
                                    type="button"
                                    className={classNames(
                                        "py-1 px-2 border border-transparent rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500",
                                        mutationId
                                            ? "py-1 px-2"
                                            : "py-1 px-2"
                                    )}
                                // onClick={performMutation}
                                >
                                    Reset
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

export default RequestForNominal;
