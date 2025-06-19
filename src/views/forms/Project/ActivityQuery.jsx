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

const ActivityQuery = () => {
    const [mutationId, setMutationId] = useState(null);
    const [openModal, setOpenModal] = useState(false);


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


    const { data: nominalAccList } = useQuery({
        queryKey: ["nominalAccList"],
        queryFn: async () => {
            const data = await fetch.get("/StateAccountCode/Get");
            return data?.data;
        },
    });

    const { mutate: addPed, isPending: addPending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(newTodo, "/StateAccountCode/Insert");
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

    function performMutation() {
        if (receiptPayment.current.value === "") {
            toast.error("Please Select Receipt/Payment")

        } else if (department.current.value === "") {
            toast.error("Please Select Department")

        } else if (scheme.current.value === "") {
            toast.error("Please Select Scheme")

        } else if (receiptPaymentNature.current.value === "") {
            toast.error("Please Select Receipt/Payment Nature")

        } else if (fundType.current.value === "") {
            toast.error("Please Select Fund Type")

        } else if (glGroup.current.value === "") {
            toast.error("Please Select GL Group")

        } else if (receiptPaymentGroup.current.value === "") {
            toast.error("Please Select Receipt/Payment Group")

        } else if (receiptPaymentGp.current.value === "") {
            toast.error("Please Select Head Classification")

        } else if (majorCode.current.value === "") {
            toast.error("Please Type Major Code")

        } else if (majorCode.current.value.length != 4) {
            toast.error("Major code should be 4 Digit")

        } else if (minorCode.current.value === "") {
            toast.error("Please Type Minor Code")

        } else if (minorCode.current.value.length != 3) {
            toast.error("Minor code should be 3 Digit")

        } else if (subGroup.current.value === "") {
            toast.error("Please Type Sub Group")

        } else if (subGroup.current.value.length != 4) {
            toast.error("Sub Group should be 4 Digit")

        } else if (objCode.current.value === "") {
            toast.error("Please Type Object Code")

        } else if (objCode.current.value.length != 2) {
            toast.error("object Code should be 2 Digit")

        } else if (schemeUid.current.value === "") {
            toast.error("Please Type Scheme Uid")

        } else if (schemeUid.current.value.length != 4) {
            toast.error("Scheme Uid should be 4 Digit")

        } else if (schemeChildUid.current.value === "") {
            toast.error("Please Type Scheme Child Uid")

        } else if (schemeChildUid.current.value.length != 4) {
            toast.error("Scheme Child Uid should be 4 Digit")

        } else {
            if (mutationId === null)
                addPed({
                    "accountCodeDesc": accountCodeDesc.current.value,
                    "deptId": department.current.value,
                    "schemeId": scheme.current.value,
                    "rcptpmntFlag": receiptPayment.current.value,
                    "rcptpmntNature": receiptPaymentNature.current.value,
                    "fundType": fundType.current.value,
                    "rcptGroup": receiptPaymentGroup.current.value,
                    "rcptGroupGP": receiptPaymentGp.current.value,
                    "glGroup": glGroup.current.value,
                    "majorCode": majorCode.current.value,
                    "minorCode": minorCode.current.value,
                    "subCode": subGroup.current.value,
                    "objectCode": objCode.current.value,
                    "schemeUid": schemeUid.current.value,
                    "schemechildUid": schemeChildUid.current.value,
                });
            else
                updatePed({
                    "accountCodeDesc": accountCodeDesc.current.value,
                    "deptId": department.current.value,
                    "schemeId": scheme.current.value,
                    "rcptpmntFlag": receiptPayment.current.value,
                    "rcptpmntNature": receiptPaymentNature.current.value,
                    "fundType": fundType.current.value,
                    "rcptGroup": receiptPaymentGroup.current.value,
                    "rcptGroupGP": receiptPaymentGp.current.value,
                    "glGroup": glGroup.current.value,
                    "majorCode": majorCode.current.value,
                    "minorCode": minorCode.current.value,
                    "subCode": subGroup.current.value,
                    "objectCode": objCode.current.value,
                    "schemeUid": schemeUid.current.value,
                    "schemechildUid": schemeChildUid.current.value,
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
        const sortedList = [...(nominalAccList ?? [])];
        sortedList.sort((a, b) => b.designationId - a.designationId);
        return sortedList;
    }, [nominalAccList]);

    const list = [
        {
            header: "Acc Code",
            accessorKey: "accountCode",
            className: "text-left cursor-pointer px-2",
        },
        // {
        //     header: "Recpt/Pay",
        //     accessorKey: "rcptpmntFlag",
        //     className: "text-left cursor-pointer px-2",

        // },
        // {
        //     header: "Dept",
        //     accessorKey: "deptName",
        //     className: "text-left cursor-pointer px-2",

        // },

        // {
        //     header: "Scheme",
        //     accessorKey: "schemeName",
        //     className: "text-left cursor-pointer px-2",

        // },
        {
            header: "Account Code Desc",
            accessorKey: "accountCodeDesc",
            className: "text-left cursor-pointer px-2",

        },
        // {
        //     header: "Recpt Pay Nature",
        //     accessorKey: "rcptpmntNatureName",
        //     className: "text-left cursor-pointer px-2",
        // },
        // {
        //     header: "Fund Type",
        //     accessorKey: "fundTypeName",
        //     className: "text-left cursor-pointer px-2",
        // },
        {
            header: "GL Group",
            accessorKey: "glGroupName",
            className: "text-left cursor-pointer px-2",
        },
        {
            header: "Receipt Pay Group",
            accessorKey: "rcptGroupPSName",
            className: "text-left cursor-pointer px-2",
        },
        {
            header: "Head Classification",
            accessorKey: "rcptGroupGPName",
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

    //department list
    const { data: departmentList } = useQuery({
        queryKey: ["departmentList"],
        queryFn: async () => {
            const data = await fetch.get("/Department/Get");
            return data?.data;
        },
    });


    const { data: schemeList } = useQuery({
        queryKey: ["schemeList"],
        queryFn: async () => {
            const data = await fetch.get("/scheme/Get");
            return data?.data;
        },
    });


    const { data: glGroupList } = useQuery({
        queryKey: ["glGroupList"],
        queryFn: async () => {
            const data = await fetch.get("/GlGroup/Get");
            return data?.data;
        },
    });


    const { data: receipt_payment_group_lIST } = useQuery({
        queryKey: ["receipt_payment_group_lIST"],
        queryFn: async () => {
            const data = await fetch.get("/ReceiptGroup/Get");
            return data?.data;
        },
    });


    const { data: receipt_payment_group_gpLIST } = useQuery({
        queryKey: ["receipt_payment_group_gpLIST"],
        queryFn: async () => {
            const data = await fetch.get("/ReceiptGroupGP/Get");
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

            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Activity Query</legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full space-y-2">
                        <div className="flex items-center gap-4 ">
                            <div className="w-1/3">
                                <label
                                    htmlFor="receipt_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    District
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="receipt_name"
                                    name="receipt_name"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    ref={receiptPayment}
                                >
                                    <option value="" selected hidden>
                                        Select District
                                    </option>
                                    <option value="R">Receipt</option>
                                    <option value="P">Payment</option>
                                </select>
                            </div>

                            <div className="w-1/3">
                                <label
                                    htmlFor="department_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Block
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="department_name"
                                    name="department_name"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    ref={department}
                                >
                                    <option value="" selected hidden>
                                        Select Block
                                    </option>
                                    {departmentList?.map((d) => (
                                        <option value={d?.deptId}>
                                            {d?.deptName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-1/3">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    GP
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="scheme_name"
                                    name="scheme_name"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    ref={scheme}
                                >
                                    <option value="" selected hidden>
                                        Select GP
                                    </option>
                                    {schemeList?.map((d) => (
                                        <option value={d?.schemeId}>
                                            {d?.schemeName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-1/3">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Plan Year
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="scheme_name"
                                    name="scheme_name"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    ref={scheme}
                                >
                                    <option value="" selected hidden>
                                        Select Plan Year
                                    </option>
                                    {schemeList?.map((d) => (
                                        <option value={d?.schemeId}>
                                            {d?.schemeName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="w-1/3">
                                <label
                                    htmlFor="receipt_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Activity output
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="receipt_name"
                                    name="receipt_name"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    ref={receiptPayment}
                                >
                                    <option value="" selected hidden>
                                        Select Output
                                    </option>
                                    <option value="R">Receipt</option>
                                    <option value="P">Payment</option>
                                </select>
                            </div>

                            <div className="w-1/3">
                                <label
                                    htmlFor="department_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Activity Is
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="department_name"
                                    name="department_name"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    ref={department}
                                >
                                    <option value="" selected hidden>
                                        Select Activity Is
                                    </option>
                                    {departmentList?.map((d) => (
                                        <option value={d?.deptId}>
                                            {d?.deptName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-1/3">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Scheme Name
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="scheme_name"
                                    name="scheme_name"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    ref={scheme}
                                >
                                    <option value="" selected hidden>
                                        Select Scheme
                                    </option>
                                    {schemeList?.map((d) => (
                                        <option value={d?.schemeId}>
                                            {d?.schemeName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-1/3">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Component
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="scheme_name"
                                    name="scheme_name"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    ref={scheme}
                                >
                                    <option value="" selected hidden>
                                        Select Component
                                    </option>
                                    {schemeList?.map((d) => (
                                        <option value={d?.schemeId}>
                                            {d?.schemeName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center w-full space-x-4">
                            {/* Account Code Desc */}


                            {/* Receipt Payment Nature */}
                            <div className="w-1/2">
                                <label
                                    htmlFor="receipt_payment_nature"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Upa Samiti
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="receipt_payment_nature"
                                    name="receipt_payment_nature"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    ref={receiptPaymentNature}
                                >
                                    <option value="" selected hidden>
                                        Select Upa Samiti
                                    </option>

                                </select>
                            </div>

                            {/* Fund Type */}
                            <div className="w-1/2">
                                <label
                                    htmlFor="fund_type"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Sector
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="fund_type"
                                    name="fund_type"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    ref={fundType}
                                >
                                    <option value="" selected hidden>
                                        Select Sector
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center w-full space-x-4">
                            {/* Account Code Desc */}


                            {/* Receipt Payment Nature */}
                            <div className="w-1/2">
                                <label
                                    htmlFor="receipt_payment_nature"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Focus Area
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="receipt_payment_nature"
                                    name="receipt_payment_nature"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    ref={receiptPaymentNature}
                                >
                                    <option value="" selected hidden>
                                        Select Focus Area
                                    </option>

                                </select>
                            </div>

                            {/* Fund Type */}
                            <div className="w-1/2">
                                <label
                                    htmlFor="fund_type"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Category
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="fund_type"
                                    name="fund_type"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    ref={fundType}
                                >
                                    <option value="" selected hidden>
                                        Select Category
                                    </option>
                                </select>
                            </div>
                        </div>


                        <div className="flex items-center space-x-4">
                            {/* GL Group */}
                            <div className="w-1/3">
                                <label
                                    htmlFor="gl_group"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    SDG
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="gl_group"
                                    name="gl_group"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    ref={glGroup}
                                >
                                    <option value="" selected hidden>
                                        Select SDG Category
                                    </option>

                                    {glGroupList?.map((d) => (
                                        <option value={d?.groupId}>
                                            {d?.groupName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Receipt Payment Group */}
                            <div className="w-1/3">
                                <label
                                    htmlFor="receipt_payment_group"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Convergence
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="receipt_payment_group"
                                    name="receipt_payment_group"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    ref={receiptPaymentGroup}
                                >
                                    <option value="" selected hidden>
                                        Select Convergence
                                    </option>
                                    {receipt_payment_group_lIST?.map((d) => (
                                        <option value={d?.groupId}>
                                            {d?.groupName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Head Classification */}
                            <div className="w-1/3">
                                <label
                                    htmlFor="head_classification"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Activity Status
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="head_classification"
                                    name="head_classification"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    ref={receiptPaymentGp}
                                >
                                    <option value="" selected hidden>
                                        Select Status
                                    </option>

                                    {receipt_payment_group_gpLIST?.map((d) => (
                                        <option value={d?.groupId}>
                                            {d?.groupName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-1/3">
                                <label
                                    htmlFor="major_code"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Activity Name
                                    <span className="text-red-500"> *</span>

                                </label>
                                <input
                                    id="major_code"
                                    name="major_code"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Activity Name"
                                    className="p-2 block w-full h-9 border border-gray-300 "
                                    ref={majorCode}
                                // maxLength={4}
                                />
                            </div>
                        </div>


                        <div className="col-span-2 flex justify-center items-center mt-4 px-32 gap-4">


                            <button
                                type="button"
                                className={classNames(
                                    "bg-yellow-500 hover:bg-orange-400 text-white font-bold py-1 px-2 rounded",
                                    mutationId
                                        ? "bg-orange-300 hover:bg-orange-400 text-white font-bold py-1 px-2 rounded"
                                        : "bg-orange-300 hover:bg-orange-400 text-white font-bold py-1 px-2 rounded"
                                )}
                            // onClick={performMutation}
                            >
                                Details Report
                            </button>
                            <button
                                type="button"
                                className="bg-orange-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded"
                            >
                                Show Summary
                            </button>
                            <button
                                type="button"
                                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-1 px-2 rounded"
                            >
                                Show Activity List
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
                            onClick={() => exportToExcel(data, "Activity_Query")}

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

                                    <Table.Cell className="flex items-center justify-center space-x-8">
                                        <button
                                            onClick={() => {
                                                // designation.current.value = row.original.designation;
                                                accountCodeDesc.current.value = row.original.accountCodeDesc;
                                                department.current.value = row.original.deptId;
                                                scheme.current.value = row.original.schemeId;
                                                receiptPayment.current.value = row.original.rcptpmntFlag;
                                                receiptPaymentNature.current.value = row.original.rcptpmntNature;
                                                fundType.current.value = row.original.fundType;
                                                receiptPaymentGroup.current.value = row.original.rcptGroup;
                                                receiptPaymentGp.current.value = row.original.rcptGroupGP;
                                                glGroup.current.value = row.original.glGroup;
                                                majorCode.current.value = row.original.majorCode;
                                                minorCode.current.value = row.original.minorCode;
                                                subGroup.current.value = row.original.subCode;
                                                objCode.current.value = row.original.objectCode;
                                                schemeUid.current.value = row.original.schemeUid;
                                                schemeChildUid.current.value = row.original.schemechildUid;

                                                setMutationId(row.original.accountCodeDesc);
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

export default ActivityQuery;
