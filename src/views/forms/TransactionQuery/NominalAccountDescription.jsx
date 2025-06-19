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
import { getRealAccSummary, getNominalAccSummaryDetails } from "../../../Service/TransactionQuery/TransactionQueryService";
import Modal from 'react-modal';
import {
    getDebitVoucher, getJournalVoucher, getReceiptVoucher,
} from "../../../Service/Document/DocumentService";
import LOGO from "../../../Img/logo.png"
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const NominalAccountDescription = () => {
    const [mutationId, setMutationId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [nominalAccDataById, setNominalAccDataById] = useState([]);
    const [nominalAccountById, setNominalAccountById] = useState(false);
    const [nominalAccountId, setNominalAccountId] = useState("");
    const [nominalAccountDesc, setNominalAccountDesc] = useState("");
    const [voucherMode, setVoucherMode] = useState(null);
    const [realAccountById, setRealAccountById] = useState(false);
    const [voucherData, setVoucherData] = useState(null);
    const [voucherCreditFlag, setVoucherCreditFlag] = useState(false);
    const [voucherJournalFlag, setVoucherJournalFlag] = useState(false);
    const [voucherPaymentFlag, setVoucherPaymentFlag] = useState(false);

    console.log(nominalAccDataById, "nominalAccDataById")

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
    const fromDate = useRef(null);
    const toDate = useRef(null);
    const queryClient = useQueryClient();
    const [glGroupName, setGlGroupName] = useState("");
    const [glGroupAllList, setGlGroupNameAllList] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const { mutate: addPed, isPending: addPending, data: result, } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.get(`/ReportViewer/NominalAccountTransaction?lgdCode=${userData?.CORE_LGD}&frmDate=${fromDate.current.value}&toDate=${toDate.current.value}&vouchermode=${receiptPayment.current.value ? receiptPayment.current.value : 0}&deptId=${department.current.value ? department.current.value : 0}&schemeId=${scheme.current.value ? scheme.current.value : 0}&accountCodeDesc=${accountCodeDesc.current.value ? accountCodeDesc.current.value : 0}&rcptPmntNature=${receiptPaymentNature.current.value ? receiptPaymentNature.current.value : 0}&fundType=${fundType.current.value ? fundType.current.value : 0}&glGroup=${glGroupAllList.find((c) => c.groupName === glGroup.current.value)?.groupId ? glGroupAllList.find((c) => c.groupName === glGroup.current.value)?.groupId : 0}&receiptGroup=${receiptPaymentGroup.current.value ? receiptPaymentGroup.current.value : 0}&receiptGroupGp=${receiptPaymentGp.current.value ? receiptPaymentGp.current.value : 0}`);
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

    const onRealAccount = (lgdCode, accCode, fromDate, toDate, rcptpmntFlag, accountCodeDesc) => {
        setNominalAccountById(true)
        setNominalAccountId(accCode)
        setNominalAccountDesc(accountCodeDesc)

        getNominalAccSummaryDetails(lgdCode, accCode, fromDate, toDate, rcptpmntFlag).then((response) => {
            console.log(response.data, "response")
            if (response.status === 200) {
                setNominalAccDataById(response.data);
            } else {
                toast.error("Failed to fetch data");
            }
        });
    }

    function performMutation() {
        if (fromDate.current.value === "") {
            toast.error("Please Select From Date")

        } else if (toDate.current.value === "") {
            toast.error("Please Select To Date")

        } else {
            addPed({
                "rcptpmntFlag": receiptPayment.current.value,

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
        const sortedList = [...(result?.data ?? [])]; // Extracting the data array safely
        sortedList.sort((a, b) => (b.designationId ?? 0) - (a.designationId ?? 0)); // Sorting by designationId if it exists
        return sortedList;
    }, [result]);


    const list = [
        {
            header: "Acc Code",
            accessorKey: "accountCode",
            className: "text-left cursor-pointer px-2",
        },

        {
            header: "Account Code Desc",
            accessorKey: "accountCodeDesc",
            className: "text-left cursor-pointer px-2",

        },

        {
            header: "Group Name",
            accessorKey: "groupName",
            className: "text-left cursor-pointer px-2",
        },
        {
            header: "Amount Debit",
            accessorKey: "debitAmount",
            className: "text-left cursor-pointer px-2",
        },

        {
            header: "Amount Credit",
            accessorKey: "creditAmount",
            className: "text-left cursor-pointer px-2",
        },
        // {
        //     header: "From Date",
        //     accessorKey: "rcptGroupGPName",
        //     className: "text-left cursor-pointer px-2",
        // },
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

    const handleRowClick = (row, mode) => {

        setVoucherMode(mode)

        if (mode === "P") {
            setRealAccountById(false)
            setVoucherPaymentFlag(true);
            getDebitVoucher(userData?.CORE_LGD, row).then((response) => {
                if (response.status === 200) {
                    setVoucherData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        }
        else if (mode === "R") {
            setRealAccountById(false)
            setVoucherCreditFlag(true)
            getReceiptVoucher(userData?.CORE_LGD, row).then((response) => {
                if (response.status === 200) {
                    setVoucherData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        } else if (mode === "N") {
            setVoucherJournalFlag(true)
            getJournalVoucher(userData?.CORE_LGD, row).then((response) => {
                if (response.status === 200) {
                    setVoucherData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        }
    }

    const onClosePreview = () => {
        if (voucherMode === "P") {
            setVoucherPaymentFlag(false);
        } else if (voucherMode === "R") {
            setVoucherCreditFlag(false);
        } else if (voucherMode === "N") {
            setVoucherJournalFlag(false);
        }

    }

    const handleDownload = () => {
        const input = document.getElementById("voucher-container"); // Select the container

        if (!input) {
            console.error("Element #voucher-container not found.");
            return;
        }

        html2canvas(input, {
            scale: 2, // Ensure better resolution
            useCORS: true, // Fixes font and image loading issues
        }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

            pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
            pdf.save("voucher.pdf"); // Trigger download
        }).catch((error) => {
            console.error("Error generating PDF:", error);
        });
    };

    const onCloseRealAccount = () => {
        setNominalAccountById(false)
    }
    return (
        <>
            <Modal
                isOpen={nominalAccountById}
                onRequestClose={() => setNominalAccountById(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "70%",
                        height: "60%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                <h2 className="text-xl font-semibold text-center mb-4">Transaction Details</h2>
                <p className="text-sm text-bold text-black-700 text-left">
                    <strong className="text-sm text-cyan-700 text-left">Account Code:</strong> {nominalAccountId ?? ""}
                </p>
                <p className="text-sm text-black-700 text-left ">
                    <strong className="text-sm text-cyan-700 text-left">Account Code Desc:</strong> {nominalAccountDesc ?? ""}
                </p>
                <p className="text-sm text-black-700 text-left mb-6">
                    <strong className="text-sm text-cyan-700 text-left">From:</strong> {fromDate?.current?.value ?? ""} To {toDate?.current?.value ?? ""}
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-black-900 text-sm">
                        <thead className="bg-cyan-400">
                            <tr>
                                <th className="border ">Voucher Date</th>
                                <th className="border ">Voucher Id</th>
                                <th className="border ">Voucher Mode</th>
                                <th className="border ">Voucher Narration</th>
                                <th className="border ">Pay to/Receipt from</th>
                                <th className="border ">Pay Address</th>
                                <th className="border ">Voucher Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {nominalAccDataById.map((txn, index) => (
                                <tr key={index} className="text-center">
                                    <td className="border cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleRowClick(txn?.voucherId, txn.voucherMode)}>{txn.voucherDate}</td>
                                    <td className="border cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleRowClick(txn?.voucherId, txn.voucherMode)}>{txn.voucherId}</td>
                                    <td className="border cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleRowClick(txn?.voucherId, txn.voucherMode)}>{txn.voucherMode}</td>
                                    <td className="border cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleRowClick(txn?.voucherId, txn.voucherMode)}>{txn.voucherNarration}</td>
                                    <td className="border cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleRowClick(txn?.voucherId, txn.voucherMode)}>{txn.payTo}</td>
                                    <td className="border cursor-pointer hover:bg-gray-100"
                                        onClick={() => handleRowClick(txn?.voucherId, txn.voucherMode)}>{txn.partyAddress}</td>
                                    <td className="border cursor-pointer text-right hover:bg-gray-100"
                                        onClick={() => handleRowClick(txn?.voucherId, txn.voucherMode)}>{txn.voucherAmount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Close Button */}
                <div className="mt-8 text-center">
                    <button
                        type="button"
                        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={onCloseRealAccount}
                    >
                        CLOSE
                    </button>
                </div>
            </Modal>

            <Modal isOpen={voucherJournalFlag}
                // onRequestClose={() => setIsPartyDetailsOpen(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "50%",
                        height: "80%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                <div id="voucher-container" className="w-full max-w-5xl mx-auto border p-2 bg-white shadow-lg text-xs">

                    {/* Header */}
                    <div className="text-center">
                        <span className="flex-1 text-center font-bold">{voucherData?.journalVoucherDetails?.rule}</span>
                    </div>
                    <div className="flex w-full justify-between items-center relative">
                        {/* Centered span message */}
                        <span className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
                            JOURNAL VOUCHER
                        </span>

                        {/* Right-aligned image */}
                        <div className="w-24 h-12 flex items-center justify-end ml-auto">
                            <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                        </div>
                    </div>

                    <div className="text-center font-semibold">{voucherData?.journalVoucherDetails?.lgdName}</div>
                    <div className="text-center font-semibold mb-2">{voucherData?.journalVoucherDetails?.lgdAddress}</div>
                    <hr className="border-gray-400 mb-2" />

                    {/* Voucher Info */}
                    <div className="text-right">
                        <p><span className="font-bold text-cyan-700">Voucher ID:</span> {voucherData?.journalVoucherDetails?.voucherId}</p>
                        <p><span className="font-bold text-cyan-700">Voucher No.:</span> {voucherData?.journalVoucherDetails?.voucherNo}</p>
                        <p><span className="font-bold text-cyan-700">Voucher Date:</span> {voucherData?.journalVoucherDetails?.voucherDate}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-xs font-semibold">
                        <div>
                            <p>
                                <span className="font-bold">{voucherData?.journalVoucherDetails?.accountHead} {voucherData?.journalVoucherDetails?.voucherNetAmount}</span>
                            </p>
                            {/* <br /> */}
                            {voucherData?.journalDeductionDetails?.map((transfer, index) => (
                                <p key={index}>
                                    <span className="font-bold"></span> {transfer.accountHead} {transfer.voucherAmount}
                                </p>
                            ))}
                        </div>


                    </div>

                    {/* Narration & Party */}
                    <div className="grid text-xs font-semibold mt-3">
                        <p><span className="font-bold text-cyan-700">Narration:</span> {voucherData?.journalVoucherDetails?.voucherNarration}</p>
                        <p>
                            <span className="font-bold text-cyan-700">Party: </span>
                            {voucherData?.journalVoucherDetails?.partyType === "C" ? "Contractor" :
                                voucherData?.journalVoucherDetails?.partyType === "E" ? "Employee" :
                                    voucherData?.journalVoucherDetails?.partyType === "J" ? "Job Worker" :
                                        voucherData?.journalVoucherDetails?.partyType === "D" ? "Department" :
                                            voucherData?.journalVoucherDetails?.partyType === "L" ? "LSG" : "Beneficiary"}
                            - {voucherData?.journalVoucherDetails?.partyCode}
                        </p>
                    </div>

                    {/* Signatures */}
                    <div className="flex justify-between text-black-600 font-semibold text-xs mt-6">
                        <span>{voucherData?.journalVoucherDetails?.leftSignatory}</span>
                        <span>{voucherData?.journalVoucherDetails?.rightSignatory}</span>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 font-semibold text-xs ">
                        <i>
                            <p><span className="font-semibold text-cyan-700">Voucher Prepared By:</span> {voucherData?.journalVoucherDetails?.entryBy} </p>
                            <p><span className="font-semibold text-cyan-700">Voucher Verified By:</span> {voucherData?.journalVoucherDetails?.verifiedBy}</p>
                        </i>
                    </div>
                </div>


                <div className="flex justify-center space-x-4 py-1">
                    <div className="text-right text-xs mt-4 italic">
                        <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onClosePreview}>
                            Close
                        </button>&nbsp;
                        <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handleDownload}>
                            Print
                        </button>
                    </div>
                </div>

            </Modal>

            <Modal isOpen={voucherPaymentFlag}
                // onRequestClose={() => setIsPartyDetailsOpen(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "50%",
                        height: "90%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                <div id="voucher-container" className="max-w-5xl mx-auto border p-2 bg-white shadow-lg text-xs">
                    {/* Header */}
                    <div className="text-center">
                        <span className="flex-1 text-center font-bold">{voucherData?.voucherDetails?.rule}</span>
                    </div>
                    <div className="flex w-full justify-between items-center relative">
                        {/* Centered span message */}
                        <span className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
                            DEBIT VOUCHER
                        </span>

                        {/* Right-aligned image */}
                        <div className="w-24 h-12 flex items-center justify-end ml-auto">
                            <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                        </div>
                    </div>


                    <div className="text-center font-semibold">{voucherData?.voucherDetails?.lgdName}</div>
                    <div className="text-center font-semibold mb-4">{voucherData?.voucherDetails?.lgdAddress}</div>

                    {/* Account Details */}
                    <div className="grid grid-cols-2 gap-4 border-b pb-2">
                        <div>
                            <p><span className="font-semibold text-cyan-700">Head of Account: </span>{voucherData?.voucherDetails?.accountHead}</p>
                            <p><span className="font-semibold text-cyan-700">Account Code: </span>{voucherData?.voucherDetails?.accountCode}</p>
                            <p><span className="font-semibold text-cyan-700">Account Code Desc: </span>{voucherData?.voucherDetails?.accountDesc}</p>
                            <p><span className="font-semibold text-cyan-700">National A/C Code: </span>{voucherData?.voucherDetails?.nationalCode}</p>
                        </div>
                        <div className="text-right">
                            <p><span className="font-semibold text-cyan-700">Voucher Date: </span>{voucherData?.voucherDetails?.voucherDate}</p>
                            <p><span className="font-semibold text-cyan-700">Voucher ID: </span>{voucherData?.voucherDetails?.voucherId}</p>
                            <p><span className="font-semibold text-cyan-700">Voucher No.: </span>{voucherData?.voucherDetails?.voucherNo}</p>
                            <p><span className="font-semibold text-cyan-700">Pass for Payment ID: </span>{voucherData?.voucherDetails?.pfpId}</p>
                        </div>
                    </div>

                    {/* Payee Details & Table Side by Side */}
                    <div className="mt-4 flex justify-between gap-4 print:flex print-row">
                        {/* Payee Details */}
                        <div className="w-1/2 print-half">
                            <p><span className="font-semibold text-cyan-700">Pay to:</span> {voucherData?.voucherDetails?.payTo}</p>
                            <p><span className="font-semibold text-cyan-700">of:</span> {voucherData?.voucherDetails?.partyAddress}</p>
                            <p><span className="font-semibold text-cyan-700">Description:</span> {voucherData?.voucherDetails?.voucherNarration}</p>
                            <p><span className="font-semibold text-cyan-700">Rs.:</span> {voucherData?.voucherDetails?.voucherNetAmount}/- (Rs.{voucherData?.voucherDetails?.voucherNetAmountWord})</p>
                            <p><span className="font-semibold text-cyan-700">Paid by:</span> {voucherData?.voucherDetails?.instrumentType}</p>
                            <p><span className="font-semibold text-cyan-700">No.:</span> {voucherData?.voucherDetails?.instrumentNo}</p>
                            <p><span className="font-semibold text-cyan-700">Dated:</span> {voucherData?.voucherDetails?.instrumentType === "None" ? "" : voucherData?.voucherDetails?.instrumentDate}</p>
                            <p><span className="font-semibold text-cyan-700">Drawn on:</span> {voucherData?.voucherDetails?.instrumentDetails}</p>
                        </div>

                        {/* Amount Details (Table) */}
                        {voucherData?.deductionDetails?.length > 0 && (
                            <div className="w-1/2 print-half">
                                <table className="w-full border-collapse border border-black-900 text-center">
                                    {/* <thead>
                                                                <tr className="bg-yellow-300">
                                                                    <th className="border border-gray-400 px-2 py-2 w-1/2 text-center">Deduction Account Head</th>
                                                                    <th className="border border-gray-400 px-2 py-2 w-1/2 text-center">Amount</th>
                                                                </tr>
                                                            </thead> */}
                                    <tbody>
                                        {voucherData?.deductionDetails.map((user, index) => (
                                            <tr key={index} className="bg-white">
                                                <td className="border border-gray-900 px-4 py-2 text-center">{user.accountDescActual}</td>
                                                <td className="border border-gray-900 px-4 py-2 text-center">Rs. {user.deductionAmount}/-</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>

                        )}
                    </div>

                    {/* Signatures */}
                    <div className="flex justify-between mt-4 font-semibold pt-4">
                        <span>{voucherData?.voucherDetails?.leftSignatory}</span>
                        <span>{voucherData?.voucherDetails?.rightSignatory}</span>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 font-semibold text-xs">
                        <i>
                            <p><span className="font-semibold text-cyan-700">Voucher Prepared by:</span> {voucherData?.voucherDetails?.entryBy}</p>
                            <p><span className="font-semibold text-cyan-700">Voucher Verified By:</span> {voucherData?.voucherDetails?.verifiedBy}</p>
                        </i>
                    </div>

                    <div className="flex justify-between mt-2 pt-2 font-semibold border-t-2 border-black text-xs">
                        <p><i>Received Rs.{voucherData?.voucherDetails?.voucherNetAmount}/- (Rs.{voucherData?.voucherDetails?.voucherNetAmountWord}) </i></p>
                    </div>

                    <div className="flex justify-between mt-2 font-semibold text-xs">
                        <p><i>Paid by {voucherData?.voucherDetails?.instrumentType} No.{voucherData?.voucherDetails?.instrumentNo} Dated {voucherData?.voucherDetails?.instrumentDate} drawn on {voucherData?.voucherDetails?.instrumentDetails}</i></p>
                        <p><span className="font-semibold text-cyan-700">Signature of Payee</span></p>
                    </div>
                </div>

                <div className="flex justify-center space-x-4 py-1">
                    <div className="text-right text-xs mt-4 italic">
                        <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onClosePreview}>
                            Close
                        </button>&nbsp;
                        <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handleDownload}>
                            Print
                        </button>
                    </div>
                </div>

            </Modal>

            <Modal isOpen={voucherCreditFlag}
                // onRequestClose={() => setIsPartyDetailsOpen(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "50%",
                        height: "85%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                <div id="voucher-container" className="max-w-5xl mx-auto border p-2 bg-white shadow-lg text-xs">
                    {/* Header */}
                    <div className="text-center">
                        <span className="flex-1 text-center font-bold">{voucherData?.rule}</span>
                    </div>
                    <div className="flex w-full justify-between items-center relative">
                        {/* Centered span message */}
                        <span className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
                            CREDIT VOUCHER
                        </span>

                        {/* Right-aligned image */}
                        <div className="w-24 h-12 flex items-center justify-end ml-auto">
                            <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                        </div>
                    </div>

                    <div className="text-center font-semibold">{voucherData?.lgdName}</div>
                    <div className="text-center mb-4 font-semibold">{voucherData?.lgdAddress}</div>

                    {/* Account Details */}
                    <div className="grid grid-cols-2 gap-4 border-b pb-2">
                        <div>
                            <p><span className="font-semibold text-cyan-700">Head of Account: </span>{voucherData?.accountHead}</p>
                            <p><span className="font-semibold text-cyan-700">Account Codes: </span>{voucherData?.accountCode}</p>
                            <p><span className="font-semibold text-cyan-700">Account Code Desc: </span>{voucherData?.accountDesc}</p>
                            <p><span className="font-semibold text-cyan-700">National A/C Code: </span>{voucherData?.nationalCode}</p>
                        </div>
                        <div className="text-right">
                            <p><span className="font-semibold text-cyan-700">Voucher Date: </span>{voucherData?.voucherDate}</p>
                            <p><span className="font-semibold text-cyan-700">Voucher ID: </span>{voucherData?.voucherId}</p>
                            <p><span className="font-semibold text-cyan-700">Voucher No.: </span>{voucherData?.voucherNo}</p>
                            {/* <p><span className="font-semibold">Pass for Payment ID: </span>{voucherData?.pfpId}</p> */}
                        </div>
                    </div>

                    {/* Payee Details & Table Side by Side */}
                    <div className="mt-4 flex justify-between gap-4 print:flex print-row">
                        {/* Payee Details */}
                        <div className="w-1/2 print-half">
                            <p><span className="font-semibold text-cyan-700">Received from:</span> {voucherData?.payTo}</p>
                            <p><span className="font-semibold text-cyan-700">of:</span> {voucherData?.partyAddress}</p>
                            <p><span className="font-semibold text-cyan-700">Description:</span> {voucherData?.voucherNarration}</p>
                            <p><span className="font-semibold text-cyan-700">Rs.:</span> {voucherData?.voucherNetAmount}/- (Rs.{voucherData?.voucherNetAmountWord})</p>
                            <p><span className="font-semibold text-cyan-700">Received by:</span> {voucherData?.instrumentType}</p>
                            <p><span className="font-semibold text-cyan-700">No.:</span> {voucherData?.instrumentNo}</p>
                            <p><span className="font-semibold text-cyan-700">Dated:</span> {voucherData?.instrumentType === "None" ? "" : voucherData?.instrumentDate}</p>
                            <p><span className="font-semibold text-cyan-700">Drawn on:</span> {voucherData?.instrumentDetails}</p>
                        </div>

                    </div>

                    {/* Signatures */}
                    <div className="flex justify-between mt-4 font-semibold pt-4">
                        <span>{voucherData?.leftSignatory}</span>
                        <span>{voucherData?.rightSignatory}</span>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 font-semibold text-xs">
                        <i>
                            <p><span className="font-semibold text-cyan-700">Voucher Prepared by:</span> {voucherData?.entryBy}</p>
                            <p><span className="font-semibold text-cyan-700">Voucher Verified By:</span> {voucherData?.verifiedBy}</p>
                        </i>
                    </div>


                </div>

                <div className="flex justify-center space-x-4 py-1">
                    <div className="text-right text-xs mt-4 italic">
                        <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onClosePreview}>
                            Close
                        </button>&nbsp;
                        <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handleDownload}>
                            Print
                        </button>
                    </div>
                </div>

            </Modal>

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
                <legend className="text-lg font-semibold text-cyan-700">Nominal Account Description</legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full mb-1 space-y-2">
                        <div className="flex items-center space-x-4">
                            <div className="w-1/3">
                                <label
                                    htmlFor="receipt_name"
                                    className="block text-xsm font-medium text-gray-700"
                                >
                                    Receipt/Payment

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
                                    <option value="N">Journal</option>
                                </select>
                            </div>

                            <div className="w-1/3">
                                <label
                                    htmlFor="department_name"
                                    className="block text-xsm font-medium text-gray-700"
                                >
                                    Department

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
                        <div className="flex items-center space-x-4">
                            <div className="w-1/7">
                                <label
                                    htmlFor="account_code_desc"
                                    className="block text-xsm font-medium text-gray-700"
                                >
                                    From Date<span className="text-red-500"> *</span>
                                </label>
                                <input
                                    ref={fromDate}
                                    id="account_code_desc"
                                    name="account_code_desc"
                                    type="date"
                                    autoComplete="off"
                                    placeholder="Account Code Desc"
                                    className="block w-full p-1 border border-gray-300 rounded-md"
                                    required
                                    maxLength={50}
                                // onChange={onMobile}
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
                                    ref={toDate}
                                    id="account_code_desc"
                                    name="account_code_desc"
                                    type="date"
                                    autoComplete="off"
                                    placeholder="Account Code Desc"
                                    className="block w-full p-1 border border-gray-300 rounded-md"
                                    required
                                    maxLength={50}
                                // onChange={onMobile}
                                />

                            </div>
                        </div>

                        <div className="col-span-2 flex justify-center items-center mt-2 gap-2">

                            <button
                                type="search"
                                className="bg-cyan-700 hover:bg-cyan-600 text-white font-bold py-1 px-8 rounded"
                                onClick={performMutation}
                            >
                                Search
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
                            onClick={() => exportToExcel(data, "Nominal_Account_Code")}

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
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => onRealAccount(userData?.CORE_LGD, row.original.accountCode, fromDate.current.value, toDate.current.value, receiptPayment.current.value, row.original.accountCodeDesc)}>
                                            👁️
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

export default NominalAccountDescription;
