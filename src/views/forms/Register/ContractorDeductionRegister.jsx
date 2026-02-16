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
import * as XLSX from "xlsx";
import { getAccountHeadList } from "../../../Service/Transaction/TransactionService";

// ✅ NEW IMPORTS FOR VOUCHER PREVIEW
import Modal from "react-modal";
import {
  getDebitVoucher,
  getJournalVoucher,
} from "../../../Service/Document/DocumentService";
import LOGO from "../../../Img/logo.png";

const ContractorDeductionRegister = () => {
  const [mutationId, setMutationId] = useState(null);
  const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
  const userData = JSON.parse(jsonString);
  const [accountHead, setAccountHead] = useState("");
  const [accountHeadId, setAccountHeadId] = useState("");
  const [headShowDropdown, setHeadShowDropdown] = useState(false);
  const [accountHeadAllList, setAccountHeadAllList] = useState([]);
  const [deductionHeadId, setDeductionHeadId] = useState("");

  // ✅ NEW STATE FOR VOUCHER PREVIEW
  const [voucherType, setVoucherType] = useState("");
  const [voucherData, setVoucherData] = useState(null);
  const [voucherPaymentFlag, setVoucherPaymentFlag] = useState(false); // Debit voucher (P)
  const [voucherJournalFlag, setVoucherJournalFlag] = useState(false); // Journal voucher (J)
  const printRef = useRef(null);

  const { data: contractorList } = useQuery({
    queryKey: ["contractorList"],
    queryFn: async () => {
      const data = await fetch.get(
        "/Contractor/Get?lgdCode=" +
          (userData?.USER_LEVEL === "GP"
            ? userData?.GP_LGD
            : userData?.USER_LEVEL === "BLOCK"
            ? userData?.BLOCK_LGD
            : userData?.DIST_LGD) +
          "&contractorName=" +
          0
      );
      // console.log(Array.isArray(data.data.result));
      return data?.data;
    },
  });

  console.log(deductionHeadId, "deductionHeadId");

  const mode = useRef(null);
  const fromDate = useRef(null);
  const toDate = useRef(null);
  const deduction = useRef(null);
  const account = useRef(null);
  const groupName = useRef(null);
  const queryClient = useQueryClient();

  const {
    mutate: addPed,
    isPending: addPending,
    data: result,
  } = useMutation({
    mutationFn: (newTodo) => {
      return fetch.get(
        `/Register/ContructorDeduction?lgdCode=${userData?.CORE_LGD}&frmDate=${
          fromDate.current.value
        }&toDate=${toDate.current.value}&accountHead=${
          accountHeadId ? accountHeadId : 0
        }&glGroup=${
          deductionHeadId ? deductionHeadId : 0
        }&contructorId=${mode.current.value ? mode.current.value : 0}`
      );
    },

    mutationKey: ["adddesignation"],
  });
  console.log(result, "result");
  const { mutate: updatePed, isPending: updatePending } = useMutation({
    mutationFn: (newTodo) => {
      return fetch.post(newTodo, "/contractor/update/" + mutationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries("FinBranchList");
      // designation.current.value = "";
      mode.current.value = "";
      fromDate.current.value = "";
      toDate.current.value = "";
      account.current.value = "";
      deduction.current.value = "";

      setMutationId(null);
    },
    mutationKey: ["updatedesignation"],
  });
  console.log(userData?.USER_LEVEL, "userData?.USER_LEVEL");
  function performMutation() {
    if (fromDate.current.value === "") {
      toast.error("Please select from date");
    } else if (toDate.current.value === "") {
      toast.error("Please select to date");
    } else {
      if (mutationId === null)
        addPed({
          lgdCode:
            userData?.USER_LEVEL === "GP"
              ? userData?.GP_LGD
              : userData?.USER_LEVEL === "BLOCK"
              ? userData?.BLOCK_LGD
              : userData?.DIST_LGD,
          mode: mode.current.value,
          fromDate: fromDate.current.value,
          toDate: toDate.current.value,
        });
      else
        updatePed({
          lgdCode:
            userData?.USER_LEVEL === "GP"
              ? userData?.GP_LGD
              : userData?.USER_LEVEL === "BLOCK"
              ? userData?.BLOCK_LGD
              : userData?.DIST_LGD,
          mode: mode.current.value,
          fromDate: fromDate.current.value,
          toDate: toDate.current.value,
          groupName: groupName.current.value,
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
    sortedList.sort(
      (a, b) => (b.designationId ?? 0) - (a.designationId ?? 0)
    ); // Sorting by designationId if it exists
    return sortedList;
  }, [result]);

  // ✅ NEW: central voucher click handler
  const handleVoucherClick = (type, voucherId) => {
    if (!voucherId) return;

    setVoucherType(type);

    if (type === "P") {
      // Debit voucher for paymentVoucherId and depositVoucherId
      setVoucherPaymentFlag(true);
      getDebitVoucher(userData?.CORE_LGD, voucherId).then((response) => {
        if (response.status === 200) {
          setVoucherData(response.data);
        } else {
          toast.error("Failed to fetch voucher data");
        }
      });
    } else if (type === "J") {
      // Journal voucher for deductionVoucherId
      setVoucherJournalFlag(true);
      getJournalVoucher(userData?.CORE_LGD, voucherId).then((response) => {
        if (response.status === 200) {
          setVoucherData(response.data);
        } else {
          toast.error("Failed to fetch voucher data");
        }
      });
    }
  };

  // ✅ NEW: close modal handler
  const onClosePreview = () => {
    if (voucherType === "P") {
      setVoucherPaymentFlag(false);
    } else if (voucherType === "J") {
      setVoucherJournalFlag(false);
    }
    setVoucherData(null);
  };

  // ✅ NEW: print handlers (copied from your VoucherCrChallan)
  const handlePrintDebit = () => {
    const printContent = printRef.current.innerHTML;
    const myWindow = window.open("", "prnt_area", "height=800,width=700");
    myWindow.document.write(`
              <html>
              <head>
                <title>Debit Voucher</title>
                <style>
                .mm p{position:absolute;top:150px;right:20px !important;}
                .col-span-12{text-align:center;}
                p {line-height:.5 !important;}
                .clearfix{clear:both;}

                .prd{float:left; font-weight:bold;text-align:left;}
                .stts{float:right; font-weight:bold;text-align:right;}
                .logo{float:left;}
                .info h2{text-align:center}
                .info{text-align:center !important}
                    .info p{text-align:center !important}
                    .info span{text-align:center}
                    .xx{position:relative;}

                  @media print {
.hh {
  border-width: 0 !important; /* Removes border but keeps color settings */
}   
                  .info h2{text-align:center}
                .prn-dt{text-align:right !important;}
                .info{text-align:center !important;margin:0 !important;padding:0 !important}
                    .info p{text-align:center !important;margin:0 !important;padding:0 !important}
                    .info span{text-align:center;margin:0 !important;padding:0 !important}
                    .mylogo img{width:500px; position:absolute; right:0;}
                    .mylogo{position:relative;}
                    .logomy img{width:100px;}
                    .logomy{text-align:right !important;position:absolute;top:0px;right:0px !important;}
.redclr {color:red}
.heightLine {line-height:1.5 !important;}
.lhght{line-height:1.5 !important;}
.half{width:300px !important;float:left !important;}
.tbsize {font-size:12px}
.gap {margin-top:50px !important;}
.smallbold {font-size:12px;font-weight:bold;}
.rightall {text-align:right;}
.bigbold {font-size:20px;font-weight:bold;}
.vv p>span{line-height:1;margin-bottom:5px;}
.vv {margin-top:25px;border-top:1px solid #ccc;}
                    thead { display: table-header-group; }
                    tfoot { display: table-footer-group; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid black; padding: 8px;}
                    .vert div {
                    writing-mode: vertical-rl; 
                    transform: rotate(180deg); 
                    white-space: nowrap;
                    text-align: center;
                    height: 8rem;
                    width: 2.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    }

      /* Target both regular and header cells in .parti containers */
.parti {
  width:300px !important;       /* Fixed width */
  max-width: 300px !important;   /* Ensures width doesn't exceed */
  min-width: 300px !important;   /* Prevents shrinking */
  white-space: normal !important; /* Allows text wrapping */
  word-wrap: break-word !important; /* Breaks long words */
  overflow-wrap: break-word !important; /* Modern alternative */
}

.openClr {
  background-color: #cce5ff !important; /* Light blue background */
  }

  .whiteclr {
  color: #fff !important; /* Black text color */
  }

  .blueclr {
  color: #cce5ff !important; /* Blue text color */
  }

.foot {
text-align: center !important;font-style: italic; margin:30px !important;padding:0 !important;}
                </style>
              </head>
              <body>
                ${printContent}
              </body>
              </html>
            `);
    myWindow.document.close();
    myWindow.focus();
    myWindow.print();
    myWindow.close();
  };

  const handlePrintJournal = () => {
    const printContent = printRef.current.innerHTML;
    const myWindow = window.open("", "prnt_area", "height=800,width=700");
    myWindow.document.write(`
              <html>
              <head>
                <title>CREDIT Voucher</title>
                <style>
                .mm p{position:absolute;top:150px;right:20px !important;}
                .col-span-12{text-align:center;}
                p {line-height:.5 !important;}
                .clearfix{clear:both;}

                .prd{float:left; font-weight:bold;text-align:left;}
                .stts{float:right; font-weight:bold;text-align:right;}
                .logo{float:left;}
                .info h2{text-align:center}
                .info{text-align:center !important}
                    .info p{text-align:center !important}
                    .info span{text-align:center}
                    .xx{position:relative;}

                  @media print {
.hh {
  border-width: 0 !important; /* Removes border but keeps color settings */
}   
                  .info h2{text-align:center}
                .prn-dt{text-align:right !important;}
                .info{text-align:center !important;margin:0 !important;padding:0 !important}
                    .info p{text-align:center !important;margin:0 !important;padding:0 !important}
                    .info span{text-align:center;margin:0 !important;padding:0 !important}
                    .mylogo img{width:500px; position:absolute; right:0;}
                    .mylogo{position:relative;}
                    .logomy img{width:100px;}
                    .logomy{text-align:right !important;position:absolute;top:0px;right:0px !important;}
.redclr {color:red}
.lhght{line-height:1.5 !important;}
.half{width:300px !important;float:left !important;}
.tbsize {font-size:12px}
.gap {margin-top:50px !important;}
.smallbold {font-size:12px;font-weight:bold;}
.rightall {text-align:right;}
.bigbold {font-size:20px;font-weight:bold;}
.vv p>span{line-height:1;margin-bottom:5px;}
.vv {margin-top:25px;border-top:1px solid #ccc;}
                    thead { display: table-header-group; }
                    tfoot { display: table-footer-group; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid black; padding: 8px;}
                    .vert div {
                    writing-mode: vertical-rl; 
                    transform: rotate(180deg); 
                    white-space: nowrap;
                    text-align: center;
                    height: 8rem;
                    width: 2.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    }

      /* Target both regular and header cells in .parti containers */
.parti {
  width:300px !important;       /* Fixed width */
  max-width: 300px !important;   /* Ensures width doesn't exceed */
  min-width: 300px !important;   /* Prevents shrinking */
  white-space: normal !important; /* Allows text wrapping */
  word-wrap: break-word !important; /* Breaks long words */
  overflow-wrap: break-word !important; /* Modern alternative */
}

.openClr {
  background-color: #cce5ff !important; /* Light blue background */
  }

  .whiteclr {
  color: #fff !important; /* Black text color */
  }

  .blueclr {
  color: #cce5ff !important; /* Blue text color */
  }

.foot {
text-align: center !important;font-style: italic; margin:30px !important;padding:0 !important;}
                </style>
              </head>
              <body>
                ${printContent}
              </body>
              </html>
            `);
    myWindow.document.close();
    myWindow.focus();
    myWindow.print();
    myWindow.close();
  };

  const list = [
    {
      header: "Date",
      accessorKey: "voucherDate",
      headclass: "cursor-pointer",
    },
    {
      header: "ID ",
      accessorKey: "contructorId",
      headclass: "cursor-pointer",
    },
    {
      header: "Name ",
      accessorKey: "contructorName",
      headclass: "cursor-pointer",
    },
    {
      header: "GL",
      accessorKey: "glGroupName",
      headclass: "cursor-pointer",
    },

    // 🔹 paymentVoucherId → Debit voucher (P)
    {
      header: "Voucher Id",
      accessorKey: "paymentVoucherId",
      headclass: "cursor-pointer",
      cell: ({ getValue }) => {
        const value = getValue();
        if (!value) return "-";

        return (
          <button
            type="button"
            className="text-blue-600 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleVoucherClick("P", value);
            }}
          >
            {value}
          </button>
        );
      },
    },

    // 🔹 deductionVoucherId → Journal voucher (J)
    {
      header: "Deduction Id",
      accessorKey: "deductionVoucherId",
      headclass: "cursor-pointer",
      cell: ({ getValue }) => {
        const value = getValue();
        if (!value) return "-";

        return (
          <button
            type="button"
            className="text-blue-600 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleVoucherClick("J", value);
            }}
          >
            {value}
          </button>
        );
      },
    },

    // 🔹 PFP Id – untouched, NO click
    {
      header: "Deduction PFP Id",
      accessorKey: "pfpId",
      headclass: "cursor-pointer",
    },

    // 🔹 depositVoucherId → Debit voucher (P)
    {
      header: "Deposit Id",
      accessorKey: "depositVoucherId",
      headclass: "cursor-pointer",
      cell: ({ getValue }) => {
        const value = getValue();
        if (!value) return "-";

        return (
          <button
            type="button"
            className="text-blue-600 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleVoucherClick("P", value);
            }}
          >
            {value}
          </button>
        );
      },
    },

    {
      header: "A/C Head",
      accessorKey: "accountHead",
      headclass: "cursor-pointer",
    },
    {
      header: "Amount",
      accessorKey: "amount",
      headclass: "cursor-pointer",
    },
    {
      header: "Gross Amount",
      accessorKey: "grossAmount",
      headclass: "cursor-pointer",
    },

    {
      header: "GST",
      accessorKey: "contructorGst",
      headclass: "cursor-pointer",
    },

    {
      header: "PAN",
      accessorKey: "contructorPan",
      headclass: "cursor-pointer",
    },
    {
      header: "Invoice No / Bill No",
      accessorKey: "invoiceNo",
      headclass: "cursor-pointer",
    },
    {
      header: "Invoice Date / Bill Date",
      accessorKey: "invoiceDate",
      headclass: "cursor-pointer",
    },
    {
      header: "Taxable Amount",
      accessorKey: "taxableAmount",
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

  const { data: finInstitution } = useQuery({
    queryKey: ["finInstitution"],
    queryFn: async () => {
      const data = await fetch.get(
        `/NominalAccount/GetAccountCodeForDeduction?lgdCode=${userData?.CORE_LGD}&partyFlag=C`
      );
      return data?.data;
    },
  });

  const onAccountHead = (e) => {
    const value = e.target.value;

    setAccountHead(value);

    setHeadShowDropdown(true);
    getAccountHeadList(userData?.CORE_LGD, value).then(function (result) {
      const response = result?.data;
      console.log(response, "report");
      setAccountHeadAllList(response);
    });
  };

  const onAccountHeadType = (i) => {
    setAccountHead(i?.groupName);
    setAccountHeadId(i?.groupId);
    setHeadShowDropdown(false);
  };

  const exportToExcel = (tableData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <>
      <ToastContainer />

      {/* ✅ DEBIT VOUCHER MODAL (P) */}
      <Modal
        isOpen={voucherPaymentFlag}
        shouldCloseOnOverlayClick={false}
        style={{
          content: {
            width: "50%",
            height: "82%",
            margin: "auto",
            padding: "10px",
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
        <div
          id="voucher-container"
          style={{ fontFamily: "InterVariable, sans-serif" }}
          ref={printRef}
          className="w-full max-w-6xl mx-auto p-4 text-xs info"
        >
          {/* Header */}
          <div
            style={{ margin: "0 0 5px !important", padding: "0 !important" }}
            className="text-center info smallbold"
          >
            <span className="flex-1 text-center font-bold">
              {voucherData?.voucherDetails?.rule}
            </span>
          </div>
          <div
            style={{ margin: "0 0 5px !important", padding: "0 !important" }}
            className="info flex w-full justify-between items-center relative"
          >
            {/* Centered span message */}
            <span
              style={{ top: "10px !important" }}
              className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700"
            >
              DEBIT VOUCHER
            </span>

            {/* Right-aligned image */}
            <div className="w-24 h-12 flex items-center justify-end ml-auto logomy">
              <img
                src={LOGO}
                alt="Company Logo"
                className="w-20 h-18 object-contain"
              />
            </div>
          </div>

          <div className="smallbold info text-center font-semibold">
            {voucherData?.voucherDetails?.lgdName}
          </div>
          <div className="smallbold info text-center font-semibold mb-4">
            {voucherData?.voucherDetails?.lgdAddress}
          </div>

          {/* Account Details */}
          <div className="flex justify-between border-b pb-2 smallbold print:flex">
            <div className="w-1/2 pr-4 left prd">
              <p>
                <span className="font-semibold text-cyan-700">
                  Head of Account:{" "}
                </span>
                {voucherData?.voucherDetails?.accountHead}
              </p>
              <p>
                <span className="font-semibold text-cyan-700">
                  Account Code:{" "}
                </span>
                {voucherData?.voucherDetails?.accountCode}
              </p>
              <p>
                <span className="font-semibold text-cyan-700">
                  Account Code Desc:{" "}
                </span>
                {voucherData?.voucherDetails?.accountDesc}
              </p>
              <p>
                <span className="font-semibold text-cyan-700">
                  National A/C Code:{" "}
                </span>
                {voucherData?.voucherDetails?.nationalCode}
              </p>
            </div>

            <div className="w-1/2 text-right pl-4 stts">
              <p>
                <span className="font-semibold text-cyan-700">
                  Voucher Date:{" "}
                </span>
                {voucherData?.voucherDetails?.voucherDate}
              </p>
              <p>
                <span className="font-semibold text-cyan-700">
                  Voucher ID:{" "}
                </span>
                {voucherData?.voucherDetails?.voucherId}
              </p>
              <p>
                <span className="font-semibold text-cyan-700">
                  Voucher No.:{" "}
                </span>
                {voucherData?.voucherDetails?.voucherNo}
              </p>
              <p>
                <span className="font-semibold text-cyan-700">
                  Pass for Payment ID:{" "}
                </span>
                {voucherData?.voucherDetails?.pfpId}
              </p>
            </div>
            <div className="clearfix"></div>
          </div>

          {/* Payee Details & Table Side by Side */}
          <div className="mt-1 flex justify-between gap-4 print:flex print-row smallbold">
            {/* Payee Details */}
            <div className="w-1/2 print-half half">
              <p>
                <span className="lhght font-semibold text-cyan-700">
                  Pay to:
                </span>{" "}
                {voucherData?.voucherDetails?.payTo}
              </p>
              <p>
                <span className="lhght font-semibold text-cyan-700">of:</span>{" "}
                {voucherData?.voucherDetails?.partyAddress}
              </p>
              <p className="lhght">
                <span
                  className="lhght font-semibold text-cyan-700"
                  style={{ lineHeight: "1.5" }}
                >
                  Description:
                </span>{" "}
                {voucherData?.voucherDetails?.voucherNarration}
              </p>
              <p>
                <span
                  className="font-semibold text-cyan-700 lhght"
                  style={{ lineHeight: "1.5" }}
                >
                  Rs.:
                </span>{" "}
                {voucherData?.voucherDetails?.voucherNetAmount}/- (Rs.
                {voucherData?.voucherDetails?.voucherNetAmountWord})
              </p>
              <p>
                <span className="font-semibold text-cyan-700">Paid by:</span>{" "}
                {voucherData?.voucherDetails?.instrumentType}{" "}
                <span>
                  {" "}
                  {voucherData?.voucherDetails?.realAccountDesc === "CASH"
                    ? ""
                    : "(" + voucherData?.voucherDetails?.realAccountDesc + ")"}
                </span>
              </p>
              <p>
                <span className="font-semibold text-cyan-700">No.:</span>{" "}
                {voucherData?.voucherDetails?.instrumentNo}
              </p>
              <p>
                <span className="font-semibold text-cyan-700">Dated:</span>{" "}
                {voucherData?.voucherDetails?.instrumentType === "None"
                  ? ""
                  : voucherData?.voucherDetails?.instrumentDate}
              </p>
              <p>
                <span className="font-semibold text-cyan-700">Drawn on:</span>{" "}
                {voucherData?.voucherDetails?.instrumentDetails}
              </p>
            </div>

            {/* Amount Details (Table) */}
            {voucherData?.deductionDetails?.length > 0 && (
              <div className="w-1/2 print-half stts">
                <table className="w-full border-collapse border border-black-900 text-center">
                  <tbody>
                    {voucherData?.deductionDetails.map((user, index) => (
                      <tr key={index} className="bg-white">
                        <td className="border border-gray-900 px-4 py-2 text-center text-xs">
                          {user.accountDescActual}
                        </td>
                        <td className="border border-gray-900 px-4 py-2 text-center text-xs">
                          Rs. {user.deductionAmount}/-
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="clearfix"></div>
          </div>

          {/* Signatures */}
          <div className="flex justify-between text-black-600 font-semibold text-xs mt-6 gap smallbold">
            <span style={{ float: "left" }}>
              {voucherData?.voucherDetails?.leftSignatory}
            </span>
            <span style={{ float: "right" }}>
              {voucherData?.voucherDetails?.rightSignatory}
            </span>
          </div>
          <div className="clearfix"></div>
          {/* Footer */}
          <div className="mt-1 font-semibold text-xs smallbold">
            <p>
              <span className="font-semibold text-cyan-700">
                Voucher Entered by:
              </span>{" "}
              {voucherData?.voucherDetails?.entryBy}
            </p>
            <p>
              <span className="font-semibold text-cyan-700">
                Voucher Verified By:
              </span>{" "}
              {voucherData?.voucherDetails?.verifiedBy}
            </p>
          </div>

          <div className="flex justify-between mt-2 pt-1 font-semibold border-t-2 border-black text-xs smallbold">
            <p>
              <i>
                Received Rs.{voucherData?.voucherDetails?.voucherNetAmount}/- (
                Rs.{voucherData?.voucherDetails?.voucherNetAmountWord}){" "}
              </i>
            </p>
          </div>

          <div className="flex justify-between mt-1 font-semibold text-xs smallbold">
            <p>
              <i>
                Paid by {voucherData?.voucherDetails?.instrumentType} No.
                {voucherData?.voucherDetails?.instrumentNo} Dated{" "}
                {voucherData?.voucherDetails?.instrumentDate} drawn on{" "}
                {voucherData?.voucherDetails?.instrumentDetails}
              </i>
            </p>
            <p>
              <span className="font-semibold text-cyan-700 stts">
                Signature of Payee
              </span>
            </p>
          </div>
        </div>

        <div className="flex justify-center space-x-4 py-1">
          <div className="text-right text-xs mt-4 italic">
            <button
              className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200"
              onClick={onClosePreview}
            >
              Close
            </button>
            &nbsp;
            <button
              className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200"
              onClick={handlePrintDebit}
            >
              Print
            </button>
          </div>
        </div>
      </Modal>

      {/* ✅ JOURNAL VOUCHER MODAL (J) */}
      <Modal
        isOpen={voucherJournalFlag}
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
        <div
          id="voucher-container"
          style={{ fontFamily: "InterVariable, sans-serif" }}
          ref={printRef}
          className="w-full max-w-6xl mx-auto p-4 text-xs info"
        >
          {/* Header */}
          <div
            style={{ margin: "0 0 5px !important", padding: "0 !important" }}
            className="text-center info smallbold"
          >
            <span className="flex-1 text-center font-bold">
              {voucherData?.journalVoucherDetails?.rule}
            </span>
          </div>
          <div
            style={{ margin: "0 0 5px !important", padding: "0 !important" }}
            className="info flex w-full justify-between items-center relative"
          >
            {/* Centered span message */}
            <span className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
              JOURNAL VOUCHER
            </span>

            {/* Right-aligned image */}
            <div className="w-24 h-12 flex items-center justify-end ml-auto logomy">
              <img
                src={LOGO}
                alt="Company Logo"
                className="w-20 h-18 object-contain"
              />
            </div>
          </div>

          <div className="smallbold info text-center font-semibold">
            {voucherData?.journalVoucherDetails?.lgdName}
          </div>
          <div className="smallbold info text-center font-semibold mb-2">
            {voucherData?.journalVoucherDetails?.lgdAddress}
          </div>
          <hr className="border-gray-400 mb-2" />

          {/* Voucher Info */}
          <div className="text-right stts">
            <p>
              <span className="font-bold text-cyan-700">Voucher ID:</span>{" "}
              {voucherData?.journalVoucherDetails?.voucherId}
            </p>
            <p>
              <span className="font-bold text-cyan-700">Voucher No.:</span>{" "}
              {voucherData?.journalVoucherDetails?.voucherNo}
            </p>
            <p>
              <span className="font-bold text-cyan-700">Voucher Date:</span>{" "}
              {voucherData?.journalVoucherDetails?.voucherDate}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 text-xs font-semibold smallbold">
            <div>
              <p>
                <span className="font-bold">
                  {voucherData?.journalVoucherDetails?.accountHead}{" "}
                  {voucherData?.journalVoucherDetails?.voucherNetAmount}
                </span>
              </p>
              {voucherData?.journalDeductionDetails?.map(
                (transfer, index) => (
                  <p key={index}>
                    <span className="font-bold"></span> {transfer.accountHead}{" "}
                    {transfer.voucherAmount}
                  </p>
                )
              )}
            </div>

            <div className="clearfix"></div>
          </div>

          {/* Narration & Party */}
          <div className="grid text-xs font-semibold mt-3 smallbold">
            <p>
              <span className="font-bold text-cyan-700">Narration:</span>{" "}
              {voucherData?.journalVoucherDetails?.voucherNarration}
            </p>
            <p>
              <span className="font-bold text-cyan-700">Party: </span>
              {voucherData?.journalVoucherDetails?.partyType === "C"
                ? "Contractor"
                : voucherData?.journalVoucherDetails?.partyType === "E"
                ? "Employee"
                : voucherData?.journalVoucherDetails?.partyType === "J"
                ? "Job Worker"
                : voucherData?.journalVoucherDetails?.partyType === "D"
                ? "Department"
                : voucherData?.journalVoucherDetails?.partyType === "L"
                ? "LSG"
                : "Beneficiary"}
              - {voucherData?.journalVoucherDetails?.partyCode}
            </p>
          </div>

          {/* Signatures */}
          <div className="flex justify-between text-black-600 font-semibold text-xs mt-6 gap smallbold">
            <span style={{ float: "left" }}>
              {voucherData?.journalVoucherDetails?.leftSignatory}
            </span>
            <span style={{ float: "right" }}>
              {voucherData?.journalVoucherDetails?.rightSignatory}
            </span>
          </div>
          <div className="clearfix"></div>
          {/* Footer */}
          <div className="mt-4 font-semibold text-xs smallbold">
            <i>
              <p>
                <span className="font-semibold text-cyan-700">
                  Voucher Entered By:
                </span>{" "}
                {voucherData?.journalVoucherDetails?.entryBy}{" "}
              </p>
              <p>
                <span className="font-semibold text-cyan-700">
                  Voucher Verified By:
                </span>{" "}
                {voucherData?.journalVoucherDetails?.verifiedBy}
              </p>
            </i>
          </div>
        </div>

        <div className="flex justify-center space-x-4 py-1">
          <div className="text-right text-xs mt-4 italic">
            <button
              className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200"
              onClick={onClosePreview}
            >
              Close
            </button>
            &nbsp;
            <button
              className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200"
              onClick={handlePrintJournal}
            >
              Print
            </button>
          </div>
        </div>
      </Modal>

      <div
        className="bg-white rounded-lg p-2 flex flex-col flex-grow"
        style={{ marginTop: "-40px" }}
      >
        <legend className="text-lg font-semibold text-cyan-700">
          Contractor-Deduction-Register
        </legend>

        <div className=" flex flex-col space-y-2 py-1">
          <div className="flex flex-col w-full mb-4 space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label
                  htmlFor="financial_institute"
                  className="block text-sm font-medium text-gray-700 "
                >
                  Contractor
                </label>
                <select
                  id="financial_institute"
                  name="financial_institute"
                  autoComplete="off"
                  className="text-sm mt-1 p-2 block w-full border border-gray-300 rounded-md h-9"
                  ref={mode}
                >
                  <option value="" selected hidden>
                    Select Contractor
                  </option>
                  {contractorList?.map((e) => (
                    <option key={e.contractorId} value={e.contractorId}>
                      {e.contractorNm}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <label
                  htmlFor="branch_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  From date<span className="text-red-500"> * </span>
                </label>
                <input
                  id="From"
                  name="From"
                  type="Date"
                  ref={fromDate}
                  className="text-sm h-9 mt-1 p-2 block w-full border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex-1">
                <label
                  htmlFor="branch_ifsc"
                  className="block text-sm font-medium text-gray-700"
                >
                  To Date<span className="text-red-500"> * </span>
                </label>
                <input
                  id="To"
                  name="To"
                  type="Date"
                  className="text-sm h-9 mt-1 p-2 block w-full border border-gray-300 rounded-md"
                  ref={toDate}
                />
              </div>

              <div className="flex-1">
                <label
                  htmlFor="financial_institute"
                  className="block text-sm font-medium text-gray-700 "
                >
                  Deduction Head
                </label>
                <select
                  id="financial_institute"
                  name="financial_institute"
                  autoComplete="off"
                  className="text-sm mt-1 p-2 block w-full border border-gray-300 rounded-md h-9"
                  onChange={(e) => setDeductionHeadId(e.target.value)}
                  // ref={deduction}
                >
                  <option value="" selected>
                    Select Deduction Head
                  </option>
                  {finInstitution?.map((e) => (
                    <option key={e.glGroupId} value={e.glGroupId}>
                      {e.glGroupName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label
                  htmlFor="branch_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Head of Accounts
                </label>
                <input
                  type="text"
                  className="text-sm mt-1 p-2 block w-full border border-gray-300 rounded-md h-9"
                  placeholder="Search Head of Accounts"
                  onChange={onAccountHead}
                  value={accountHead}
                  ref={account}
                />
              </div>

              {headShowDropdown && (
                <div className="absolute top-56 left-18 z-10  bg-white border border-gray-300 rounded shadow-md max-h-30 overflow-y-auto ml-4 w-[585px]">
                  {accountHeadAllList.length > 0 ? (
                    accountHeadAllList.map((d, index) => (
                      <div
                        key={index}
                        className="text-xs w-full px-2 py-2 border border-gray-300 hover:bg-gray-200 cursor-pointer"
                        onClick={() => onAccountHeadType(d)}
                      >
                        {d?.groupName}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">
                      No results found
                    </div>
                  )}
                </div>
              )}

              <div className="flex-1">
                <button
                  style={{ marginTop: "22px" }}
                  type="button"
                  className={classNames(
                    "py-1 px-4 border border-transparent rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500",
                    mutationId ? "py-1 px-4" : "py-1 px-4"
                  )}
                  onClick={performMutation}
                >
                  {!mutationId ? "Search" : "Update"}
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
              onClick={() =>
                exportToExcel(data, "Contractor_deduction_register")
              }
            >
              Download Excel
            </button>
          </div>

          <input
            type="text"
            value={filtering}
            placeholder="search..."
            className="h-9 border-2 rounded-lg border-zinc-400"
            onChange={(e) => setFiltering(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-6 pb-8">
          {/* ✅ Scroll wrapper added here */}
          <div className="w-full overflow-x-auto">
            <Table
              className="min-w-full"
              style={{ border: "1px solid #444" }}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <Table.Head key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Table.HeadCell
                      key={header.id}
                      style={{
                        border: "1px solid #444",
                        padding: "4px 8px",
                        lineHeight: "1.2",
                      }}
                      className={classNames(
                        header.column.columnDef.headclass,
                        "bg-cyan-400/90 btn-blue transition-all whitespace-nowrap"
                      )}
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

              <Table.Body
                className="divide-y"
                style={{ border: "1px solid #444" }}
              >
                {table.getRowModel().rows.map((row) => (
                  <Table.Row
                    key={row.id}
                    style={{ border: "1px solid #444" }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Table.Cell
                        key={cell.id}
                        style={{ border: "1px solid #444" }}
                        className="p-1 text-xs whitespace-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell ?? cell.column.columnDef,
                          cell.getContext()
                        )}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>

          <Pagination data={data} table={table} />
        </div>
      </div>
    </>
  );
};

export default ContractorDeductionRegister;
