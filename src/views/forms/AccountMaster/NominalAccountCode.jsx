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
import { addAddedPriAcc, getGlGroupList, addDeletePriAcc } from "../../../Service/NominalAccount/NominalAccountService";
import * as XLSX from "xlsx";


const NominalAccountCode = () => {
    const [mutationId, setMutationId] = useState(null);
    const [openModal, setOpenModal] = useState(false);

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
    const [glGroupAllList, setGlGroupNameAllList] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);


    const { data: nominalAccList } = useQuery({
        queryKey: ["nominalAccList"],
        queryFn: async () => {
            const data = await fetch.get("/StateAccountCode/Get?lgdCode=0");
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

    console.log(getdata, "getdata")
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
            addPed({
                "accountCodeDesc": accountCodeDesc.current.value,
                "deptId": department.current.value,
                "schemeId": scheme.current.value,
                "rcptpmntFlag": receiptPayment.current.value,
                "rcptpmntNature": receiptPaymentNature.current.value,
                "fundType": fundType.current.value,
                "rcptGroup": receiptPaymentGroup.current.value,
                "rcptGroupGP": receiptPaymentGp.current.value,
                "glGroup": glGroupAllList.find((c) => c.groupName === glGroup.current.value)?.groupId,
                "majorCode": majorCode.current.value,
                "minorCode": minorCode.current.value,
                "subCode": subGroup.current.value,
                "objectCode": objCode.current.value,
                "schemeUid": schemeUid.current.value,
                "schemechildUid": schemeChildUid.current.value,
                "userIndex": userData?.USER_INDEX
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
            header: "GL Group",
            accessorKey: "glGroupName",
            className: "text-left cursor-pointer px-2",
        },
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
            const data = await fetch.get("/Department/Get?deptName=" + 0);
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


    // const { data: glGroupList } = useQuery({
    //     queryKey: ["glGroupList"],
    //     queryFn: async () => {
    //         const data = await fetch.get("/GetGlGroup/Get?groupName="+glGroupName?glGroupName:0);
    //         return data?.data;
    //     },
    // });


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

    const onDelete = () => {
        if (!accCode.current.value) {
            toast.error("Please Select a Account Code No")
        } else {
            addDeletePriAcc(
                userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : 0 || userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : 0 || userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
                accCode.current.value,
                (r) => {
                    console.log(r, "dd");
                    if (r.status == 0) {
                        // setOpenModal(true);
                        toast.success(r.message);
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
                        accCode.current.value = "";
                        setMutationId(null);
                        setGlGroupName("");

                    } else if (r.status == 1) {
                        toast.error(r.message);
                    }
                }
            );
        }
    }

    const onAddedPri = () => {

        if (!accCode.current.value) {
            toast.error("Please Select a Account Code No")


        } else {
            addAddedPriAcc(
                userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : 0 || userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : 0 || userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
                accCode.current.value, userData?.USER_INDEX,
                (r) => {
                    console.log(r, "dd");
                    if (r.status == 0) {
                        // setOpenModal(true);
                        toast.success(r.message);
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
                        accCode.current.value = "";
                        setMutationId(null);
                        setGlGroupName("");

                    } else if (r.status == 1) {
                        toast.error(r.message);
                    }
                }
            );
        }
    }

    const onGlGroupName = (e) => {
        const value = e.target.value
        setGlGroupName(value)

        setShowDropdown(true)
        getGlGroupList(value,
        ).then(function (result) {
            const response = result?.data;
            console.log(response, "report")
            setGlGroupNameAllList(response);
        })
    }

    const onSetPartType = (i) => {
        setGlGroupName(i?.groupName)
        // glGroup?.current?.value = i?.groupId;
        setShowDropdown(false)

    }
    const gst = glGroupAllList.find((c) => c.groupName === glGroup.current.value)
        ?.groupId;
    console.log(gst, "sisisisisi")

    console.log(glGroupAllList.find((c) => c.groupName === glGroup.current.value)
        ?.groupId, "glGroupAllList")

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
                <legend className="text-lg font-semibold text-cyan-700">Nominal Account Code</legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full mb-1 space-y-2">
                        <div className="flex items-center space-x-4">
                            <div className="w-1/3">
                                <label
                                    htmlFor="receipt_name"
                                    className="block text-xsm font-medium text-gray-700"
                                >
                                    Receipt/Payment
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="receipt_name"
                                    name="receipt_name"
                                    autoComplete="off"
                                    className="block w-full p-1 border border-gray-300 rounded-md"
                                    ref={receiptPayment}
                                >
                                    <option value="" selected hidden>
                                        Select Receipt/Payment
                                    </option>
                                    <option value="R">Receipt</option>
                                    <option value="P">Payment</option>
                                </select>
                            </div>

                            <div className="w-1/3">
                                <label
                                    htmlFor="department_name"
                                    className="block text-xsm font-medium text-gray-700"
                                >
                                    Department
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="department_name"
                                    name="department_name"
                                    autoComplete="off"
                                    className="block w-full p-1 border border-gray-300 rounded-md"
                                    ref={department}
                                >
                                    <option value="" selected hidden>
                                        Select Department
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
                                    className="block text-xsm font-medium text-gray-700"
                                >
                                    Scheme
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="scheme_name"
                                    name="scheme_name"
                                    autoComplete="off"
                                    className="block w-full p-1 border border-gray-300 rounded-md"
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
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Account Code Desc */}
                            <div className="w-1/3">
                                <label
                                    htmlFor="account_code_desc"
                                    className="block text-xsm font-medium text-gray-700"
                                >
                                    Account Code Desc
                                </label>
                                <input
                                    ref={accountCodeDesc}
                                    id="account_code_desc"
                                    name="account_code_desc"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Account Code Desc"
                                    className="block w-full p-1 border border-gray-300 rounded-md"
                                    required
                                    maxLength={50}
                                // onChange={onMobile}
                                />
                            </div>

                            {/* Receipt Payment Nature */}
                            <div className="w-1/3">
                                <label
                                    htmlFor="receipt_payment_nature"
                                    className="block text-xsm font-medium text-gray-700"
                                >
                                    Receipt Payment Nature
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="receipt_payment_nature"
                                    name="receipt_payment_nature"
                                    autoComplete="off"
                                    className="block w-full p-1 border border-gray-300 rounded-md"
                                    ref={receiptPaymentNature}
                                >
                                    <option value="" selected hidden>
                                        Select Receipt Payment Nature
                                    </option>
                                    <option value="1">Revenue</option>
                                    <option value="2">Capital</option>
                                    <option value="3">Receivable</option>
                                    <option value="4">Payable</option>
                                    <option value="5">Loan</option>
                                    <option value="6">Advance</option>
                                </select>
                            </div>

                            {/* Fund Type */}
                            <div className="w-1/3">
                                <label
                                    htmlFor="fund_type"
                                    className="block text-xsm font-medium text-gray-700"
                                >
                                    Fund Type
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="fund_type"
                                    name="fund_type"
                                    autoComplete="off"
                                    className="block w-full p-1 border border-gray-300 rounded-md"
                                    ref={fundType}
                                >
                                    <option value="" selected hidden>
                                        Select Fund Type
                                    </option>
                                    <option value="1">Non-Plan</option>
                                    <option value="2">Plan</option>
                                    <option value="3">Own</option>
                                    <option value="4">Others</option>
                                </select>
                            </div>
                        </div>


                        <div className="flex items-center space-x-4">
                            {/* GL Group */}
                            <div className="w-1/3">
                                <label
                                    htmlFor="gl_group"
                                    className="block text-xsm font-medium text-gray-700"
                                >
                                    GL Group
                                    <span className="text-red-500"> *</span>
                                </label>
                                <input
                                    type="url"
                                    className="block w-full p-1 border border-gray-300 rounded-md"
                                    placeholder="Search GL Group Name..."
                                    onChange={onGlGroupName}
                                    value={glGroupName}
                                    ref={glGroup}


                                />
                                {showDropdown && (
                                    <div className="absolute z-10  bg-white border border-gray-300 rounded shadow-md max-h-30 overflow-y-auto w-[390px]">
                                        {glGroupAllList.length > 0 ? (
                                            glGroupAllList.map((d, index) => (
                                                <div
                                                    key={index}
                                                    className="text-s w-full px-1 py-1 border border-gray-300 hover:bg-gray-200 cursor-pointer"
                                                    onClick={() => onSetPartType(d)} // Call the select function
                                                >
                                                    {d?.groupName}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-1 text-gray-500">No results found</div>
                                        )}
                                    </div>
                                )}
                            </div>


                            {/* Receipt Payment Group */}
                            <div className="w-1/3">
                                <label
                                    htmlFor="receipt_payment_group"
                                    className="block text-xsm font-medium text-gray-700"
                                >
                                    Receipt Payment Group
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="receipt_payment_group"
                                    name="receipt_payment_group"
                                    autoComplete="off"
                                    className="block w-full p-1 border border-gray-300 rounded-md"
                                    ref={receiptPaymentGroup}
                                >
                                    <option value="" selected hidden>
                                        Select Receipt Group
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
                                    className="block text-xsm font-medium text-gray-700"
                                >
                                    Head Classification
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="head_classification"
                                    name="head_classification"
                                    autoComplete="off"
                                    className="block w-full p-1 border border-gray-300 rounded-md"
                                    ref={receiptPaymentGp}
                                >
                                    <option value="" selected hidden>
                                        Select Head Classification
                                    </option>

                                    {receipt_payment_group_gpLIST?.map((d) => (
                                        <option value={d?.groupId}>
                                            {d?.groupName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>


                        <div className="flex items-center gap-4">
                            {/* Major Code */}
                            <div className="w-[200px]">
                                <label
                                    htmlFor="major_code"
                                    className="block text-xsm font-medium text-gray-700"
                                >
                                    Major Code
                                    <span className="text-red-500"> *</span>

                                </label>
                                <input
                                    id="major_code"
                                    name="major_code"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Major Code"
                                    className="p-1 block w-full border border-gray-300 rounded-md"
                                    ref={majorCode}
                                    maxLength={4}
                                />
                            </div>

                            {/* Minor Code */}
                            <div className="w-[200px]">
                                <label
                                    htmlFor="minor_code"
                                    className="block text-xsm font-medium text-gray-700"
                                >
                                    Minor Code
                                    <span className="text-red-500"> *</span>

                                </label>
                                <input
                                    id="minor_code"
                                    name="minor_code"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Minor Code"
                                    className="p-1 block w-full border border-gray-300 rounded-md"
                                    ref={minorCode}
                                    maxLength={3}

                                />
                            </div>

                            {/* Sub Group */}
                            <div className="w-[200px]">
                                <label
                                    htmlFor="sub_group"
                                    className="block text-xsm font-medium text-gray-700"
                                >
                                    Sub Group
                                    <span className="text-red-500"> *</span>

                                </label>
                                <input
                                    id="sub_group"
                                    name="sub_group"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Sub Group"
                                    className="p-1 block w-full border border-gray-300 rounded-md"
                                    ref={subGroup}
                                    maxLength={4}

                                />
                            </div>

                            {/* Object Code */}
                            <div className="w-[200px]">
                                <label
                                    htmlFor="object_code"
                                    className="block text-xsm font-medium text-gray-700"
                                >
                                    Object Code
                                    <span className="text-red-500"> *</span>

                                </label>
                                <input
                                    id="object_code"
                                    name="object_code"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Object Code"
                                    className="p-1 block w-full border border-gray-300 rounded-md"
                                    ref={objCode}
                                    maxLength={2}


                                />
                            </div>

                            {/* Scheme UID */}
                            <div className="w-[200px]">
                                <label
                                    htmlFor="scheme_uid"
                                    className="block text-xsm font-medium text-gray-700"
                                >
                                    Scheme Uid
                                    <span className="text-red-500"> *</span>

                                </label>
                                <input
                                    id="scheme_uid"
                                    name="scheme_uid"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Scheme Uid"
                                    className="p-1 block w-full border border-gray-300 rounded-md"
                                    ref={schemeUid}
                                    maxLength={4}

                                />
                            </div>

                            {/* Scheme Child UID */}
                            <div className="w-[200px]">
                                <label
                                    htmlFor="scheme_child_uid"
                                    className="block text-xsm font-medium text-gray-700"
                                >
                                    Scheme Child Uid
                                    <span className="text-red-500"> *</span>

                                </label>
                                <input
                                    id="scheme_child_uid"
                                    name="scheme_child_uid"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Scheme Child Uid"
                                    className="p-1 block w-full border border-gray-300 rounded-md"
                                    ref={schemeChildUid}
                                    maxLength={4}

                                />
                            </div>
                        </div>

                        <div className="col-span-2 flex justify-left items-center mt-2 gap-2">
                            <label
                                htmlFor="major_code"
                                className="block text-xsm font-medium text-gray-700"
                            >
                                Acc Code
                            </label>
                            <input
                                type="text"
                                placeholder="Account Code"
                                ref={accCode}
                                disabled
                                className="border border-gray-300 rounded py-1 px-4 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="reset"
                                className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-1 px-8 rounded"
                                onClick={() => window.location.reload()}
                            >
                                Reset
                            </button>
                            {userData?.USER_LEVEL === "HQ" ?
                                <button
                                    type="button"
                                    className={classNames(
                                        "bg-orange-500 hover:bg-orange-400 text-black font-bold py-1 px-8 rounded",
                                        mutationId
                                            ? "bg-orange-500 hover:bg-orange-400 text-black font-bold py-1 px-8 rounded"
                                            : "bg-orange-500 hover:bg-orange-400 text-black font-bold py-1 px-8 rounded"
                                    )}
                                    onClick={performMutation}
                                // disabled={getdata?.data?.status == 0 ? true : false}
                                >
                                    Submit
                                </button> : ""}

                            {userData?.USER_LEVEL === "HQ" ? "" :
                                <>
                                    {/* <button
                                        type="button"
                                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-8 rounded"
                                        onClick={onDelete}
                                    >
                                        Deleted From PRI Accounts
                                    </button> */}

                                    <button
                                        type="button"
                                        className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-1 px-4 rounded"
                                        onClick={onAddedPri}
                                    >
                                        Added to PRI Accounts
                                    </button>
                                </>
                            }
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
                            onClick={() => exportToExcel(data, "Nominal Account Code")}

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

export default NominalAccountCode;
