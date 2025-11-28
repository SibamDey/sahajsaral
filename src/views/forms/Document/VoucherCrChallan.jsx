import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
    getVoucherList, getDebitVoucher, getContraVoucher, getReceiptVoucher, getJournalVoucher,
    getCashierReceiptVoucher, getAckVoucher, getChallanVoucher
} from "../../../Service/Document/DocumentService";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from 'react-modal';
import html2canvas from "html2canvas";
import LOGO from "../../../Img/logo.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";


const VoucherCrChallan = () => {
    const getCurrentDate = () => new Date().toISOString().split("T")[0];
    const certificateRef = useRef();

    // State for From Date, To Date, and Input Box
    const [fromDate, setFromDate] = useState(getCurrentDate());
    const [toDate, setToDate] = useState(getCurrentDate());
    const [voucherNarration, setVoucherNarration] = React.useState("");
    const [voucherData, setVoucherData] = useState(null);
    const [voucherPaymentFlag, setVoucherPaymentFlag] = useState(false);
    const [voucherContraFlag, setVoucherContraFlag] = useState(false);
    const [voucherCreditFlag, setVoucherCreditFlag] = useState(false);
    const [voucherJournalFlag, setVoucherJournalFlag] = useState(false);
    const [voucherCashierReceiptFlag, setVoucherCashierReceiptFlag] = useState(false);
    const [voucherAdjustmentAckFlag, setVoucherAdjustmentAckFlag] = useState(false);
    const [voucherChallanFlag, setVoucherChallanFlag] = useState(false);
    const printRef = useRef();


    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);

    const [currentFinancialYear, setCurrentFinancialYear] = useState("");

    const handleRowClick = (row) => {

        if (voucherType === "P") {
            setVoucherPaymentFlag(true);
            getDebitVoucher(userData?.CORE_LGD, row).then((response) => {
                if (response.status === 200) {
                    setVoucherData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        } else if (voucherType === "C") {
            setVoucherContraFlag(true)
            getContraVoucher(userData?.CORE_LGD, row).then((response) => {
                if (response.status === 200) {
                    setVoucherData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        } else if (voucherType === "R") {
            setVoucherCreditFlag(true)
            getReceiptVoucher(userData?.CORE_LGD, row).then((response) => {
                if (response.status === 200) {
                    setVoucherData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        }
        else if (voucherType === "J") {
            setVoucherJournalFlag(true)
            getJournalVoucher(userData?.CORE_LGD, row).then((response) => {
                if (response.status === 200) {
                    setVoucherData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        } else if (voucherType === "CR") {
            setVoucherCashierReceiptFlag(true)
            getCashierReceiptVoucher(userData?.CORE_LGD, row).then((response) => {
                if (response.status === 200) {
                    setVoucherData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        } else if (voucherType === "AK") {
            setVoucherAdjustmentAckFlag(true)
            getAckVoucher(userData?.CORE_LGD, row).then((response) => {
                if (response.status === 200) {
                    setVoucherData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        } else if (voucherType === "CH") {
            setVoucherChallanFlag(true)
            getChallanVoucher(userData?.CORE_LGD, row).then((response) => {
                if (response.status === 200) {
                    setVoucherData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        }

    };

    // Calculate the current financial year dynamically
    useEffect(() => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth(); // 0-indexed, so 3 = April

        // Determine the start and end years of the current financial year
        const startYear = currentMonth >= 3 ? currentYear : currentYear - 1; // April onwards belongs to the next FY
        const endYear = startYear + 1;

        setCurrentFinancialYear(`${startYear}-${endYear}`);
    }, []);

    const [voucherType, setVoucherType] = useState("");


    const [data, setData] = useState([]);

    const handleInputChange = (index, value) => {
        const updatedData = [...data];
        updatedData[index].openingBalance = value;
        setData(updatedData);
    };

    const onVoucherType = (e) => {
        setVoucherType(e.target.value);
        setData([])
    }

    const handleDownload = () => {
        const input = document.getElementById("voucher-container");

        if (!input) {
            console.error("Element #voucher-container not found.");
            return;
        }

        html2canvas(input, {
            scale: 1.25,
            useCORS: true,
        }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 4, imgWidth, imgHeight); // Top gap reduced
            pdf.save("voucher.pdf");
        }).catch((error) => {
            console.error("Error generating PDF:", error);
        });
    };



    const onSearch = () => {
        if (!voucherType) {
            toast.error("Please select a Voucher Type");

        } else if (!fromDate) {
            toast.error("Please select a From Date");
        } else if (!toDate) {
            toast.error("Please select a To Date");
        } else {
            getVoucherList(userData?.CORE_LGD, fromDate, toDate, voucherType, 0, voucherNarration).then((response) => {
                if (response.status === 200) {
                    setData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        }
    }
    console.log(data, "data")
    const onClosePreview = () => {
        if (voucherType === "P") {
            setVoucherPaymentFlag(false)
        } else if (voucherType === "C") {
            setVoucherContraFlag(false)
        } else if (voucherType === "R") {
            setVoucherCreditFlag(false)
        } else if (voucherType === "J") {
            setVoucherJournalFlag(false)
        } else if (voucherType === "CR") {
            setVoucherCashierReceiptFlag(false)
        } else if (voucherType === "AK") {
            setVoucherAdjustmentAckFlag(false)
        } else if (voucherType === "CH") {
            setVoucherChallanFlag(false)
        }

    }


    const dataArray = [
        { value: "R", label: "Credit Voucher (Receipt)" },
        { value: "P", label: "Debit Voucher (Payment)" },
        { value: "C", label: "Contra Voucher (Bank/Treasury/Cash Transfer)" },
        { value: "J", label: "Journal Voucher (Ledger Transfer)" },
        { value: "CR", label: "Cashier Receipt" },
        { value: "CH", label: "Treasury  Challan" },
        { value: "AK", label: "Adjustment Acknowledgement" },
        { value: "PO", label: "Payment Order" },

    ];

    const tableHeaders1 = data.length > 0 ? Object.keys(data[0]) : [];

    const exportToExcel = (tableData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(tableData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };

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

    const handlePrintCredit = () => {
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

    const handlePrintContra = () => {
        const printContent = printRef.current.innerHTML;
        const myWindow = window.open("", "prnt_area", "height=800,width=700");
        myWindow.document.write(`
              <html>
              <head>
                <title>CONTRA Voucher</title>
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


    const handlePrint = () => {
        const printContent = printRef.current.innerHTML;
        const myWindow = window.open("", "prnt_area", "height=800,width=700");
        myWindow.document.write(`
              <html>
              <head>
                <title>Cash Analysis</title>
                <style>
                .mm p{position:absolute;top:150px;right:20px !important;}
                .col-span-12{text-align:center;}
                p {line-height:.5 !important;}
                .clearfix{clear:both;}

                .prd{float:left; font-weight:bold;text-align:left;margin:10px !important;padding:0 !important;}
                .stts{float:right; font-weight:bold;text-align:right;margin:10px !important;padding:0 !important;}
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

    return (
        <>
            <ToastContainer />
            {/* voucher payment */}
            <Modal isOpen={voucherPaymentFlag}
                // onRequestClose={() => setIsPartyDetailsOpen(false)}
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
                <div id="voucher-container" style={{ fontFamily: "InterVariable, sans-serif" }} ref={printRef} className="w-full max-w-6xl mx-auto p-4 text-xs info">
                    {/* Header */}
                    <div style={{ margin: "0 0 5px !important", padding: "0 !important" }} className="text-center info smallbold">
                        <span className="flex-1 text-center font-bold">{voucherData?.voucherDetails?.rule}</span>
                    </div>
                    <div style={{ margin: "0 0 5px !important", padding: "0 !important" }} className="info flex w-full justify-between items-center relative">
                        {/* Centered span message */}
                        <span style={{ top: "10px !important" }} className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
                            DEBIT VOUCHER
                        </span>

                        {/* Right-aligned image */}
                        <div className="w-24 h-12 flex items-center justify-end ml-auto logomy">
                            <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                        </div>
                    </div>


                    <div className="smallbold info text-center font-semibold">{voucherData?.voucherDetails?.lgdName}</div>
                    <div className="smallbold info text-center font-semibold mb-4">{voucherData?.voucherDetails?.lgdAddress}</div>

                    {/* Account Details */}
                    <div className="flex justify-between border-b pb-2 smallbold print:flex">
                        <div className="w-1/2 pr-4 left prd">
                            <p><span className="font-semibold text-cyan-700">Head of Account: </span>{voucherData?.voucherDetails?.accountHead}</p>
                            <p><span className="font-semibold text-cyan-700">Account Code: </span>{voucherData?.voucherDetails?.accountCode}</p>
                            <p><span className="font-semibold text-cyan-700">Account Code Desc: </span>{voucherData?.voucherDetails?.accountDesc}</p>
                            <p><span className="font-semibold text-cyan-700">National A/C Code: </span>{voucherData?.voucherDetails?.nationalCode}</p>
                        </div>

                        <div className="w-1/2 text-right pl-4 stts" >
                            <p><span className="font-semibold text-cyan-700">Voucher Date: </span>{voucherData?.voucherDetails?.voucherDate}</p>
                            <p><span className="font-semibold text-cyan-700">Voucher ID: </span>{voucherData?.voucherDetails?.voucherId}</p>
                            <p><span className="font-semibold text-cyan-700">Voucher No.: </span>{voucherData?.voucherDetails?.voucherNo}</p>
                            <p><span className="font-semibold text-cyan-700">Pass for Payment ID: </span>{voucherData?.voucherDetails?.pfpId}</p>
                        </div>
                        <div className="clearfix"></div>
                    </div>



                    {/* Payee Details & Table Side by Side */}
                    <div className="mt-1 flex justify-between gap-4 print:flex print-row smallbold">
                        {/* Payee Details */}
                        <div className="w-1/2 print-half half">
                            <p><span className="lhght font-semibold text-cyan-700">Pay to:</span> {voucherData?.voucherDetails?.payTo}</p>
                            <p><span className="lhght font-semibold text-cyan-700">of:</span> {voucherData?.voucherDetails?.partyAddress}</p>
                            <p className="lhght"><span className="lhght font-semibold text-cyan-700">Description:</span> {voucherData?.voucherDetails?.voucherNarration}</p>
                            <p><span className="font-semibold text-cyan-700 lhght" style={{ lineHeight: "1.5" }}>Rs.:</span> {voucherData?.voucherDetails?.voucherNetAmount}/- (Rs.{voucherData?.voucherDetails?.voucherNetAmountWord})</p>
                            <p><span className="font-semibold text-cyan-700">Paid by:</span> {voucherData?.voucherDetails?.instrumentType} <span> {voucherData?.voucherDetails?.realAccountDesc === "CASH" ? "" : "("+voucherData?.voucherDetails?.realAccountDesc+")"}</span></p>
                            <p><span className="font-semibold text-cyan-700">No.:</span> {voucherData?.voucherDetails?.instrumentNo}</p>
                            <p><span className="font-semibold text-cyan-700">Dated:</span> {voucherData?.voucherDetails?.instrumentType === "None" ? "" : voucherData?.voucherDetails?.instrumentDate}</p>
                            <p><span className="font-semibold text-cyan-700">Drawn on:</span> {voucherData?.voucherDetails?.instrumentDetails}</p>
                        </div>

                        {/* Amount Details (Table) */}
                        {voucherData?.deductionDetails?.length > 0 && (
                            <div className="w-1/2 print-half stts">
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
                                                <td className="border border-gray-900 px-4 py-2 text-center text-xs">{user.accountDescActual}</td>
                                                <td className="border border-gray-900 px-4 py-2 text-center text-xs">Rs. {user.deductionAmount}/-</td>
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
                        <span style={{ float: "left" }}>{voucherData?.voucherDetails?.leftSignatory}</span>
                        <span style={{ float: "right" }}>{voucherData?.voucherDetails?.rightSignatory}</span>

                    </div>
                    <div className="clearfix"></div>
                    {/* Footer */}
                    <div className="mt-1 font-semibold text-xs smallbold">

                        <p><span className="font-semibold text-cyan-700">Voucher Entered by:</span> {voucherData?.voucherDetails?.entryBy}</p>
                        <p><span className="font-semibold text-cyan-700">Voucher Verified By:</span> {voucherData?.voucherDetails?.verifiedBy}</p>

                    </div>

                    <div className="flex justify-between mt-2 pt-1 font-semibold border-t-2 border-black text-xs smallbold">
                        <p><i>Received Rs.{voucherData?.voucherDetails?.voucherNetAmount}/- (Rs.{voucherData?.voucherDetails?.voucherNetAmountWord}) </i></p>
                    </div>

                    <div className="flex justify-between mt-1 font-semibold text-xs smallbold">
                        <p><i>Paid by {voucherData?.voucherDetails?.instrumentType} No.{voucherData?.voucherDetails?.instrumentNo} Dated {voucherData?.voucherDetails?.instrumentDate} drawn on {voucherData?.voucherDetails?.instrumentDetails}</i></p>
                        <p><span className="font-semibold text-cyan-700 stts">Signature of Payee</span></p>
                    </div>
                </div>

                <div className="flex justify-center space-x-4 py-1">
                    <div className="text-right text-xs mt-4 italic">
                        <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onClosePreview}>
                            Close
                        </button>&nbsp;
                        <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handlePrintDebit}>
                            Print
                        </button>
                    </div>
                </div>

            </Modal >

            {/* voucher contra */}
            < Modal isOpen={voucherContraFlag}
                // onRequestClose={() => setIsPartyDetailsOpen(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "50%",
                        height: "70%",
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
                }
                }
            >
                <div id="voucher-container" style={{ fontFamily: "InterVariable, sans-serif" }} ref={printRef} className="max-w-5xl mx-auto pt-0 pb-6 px-6 bg-white text-xs info">
                    {/* Header */}
                    <div style={{ margin: "0 0 5px !important", padding: "0 !important" }} className="text-center info smallbold">
                        <span className="flex-1 text-center font-bold">{voucherData?.rule}</span>
                    </div>
                    <div style={{ margin: "0 0 5px !important", padding: "0 !important" }} className="info flex w-full justify-between items-center relative">
                        {/* Centered span message */}
                        <span style={{ top: "10px !important" }} className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
                            CONTRA VOUCHER
                        </span>

                        {/* Right-aligned image */}
                        <div className="w-24 h-12 flex items-center justify-end ml-auto logomy">
                            <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                        </div>
                    </div>

                    <div className="smallbold info text-center font-semibold">{voucherData?.lgdName}</div>
                    <div className="smallbold info text-center font-semibold mb-4">{voucherData?.lgdAddress}</div>
                    <hr className="border-gray-400 mb-2" />

                    {/* Voucher Info */}
                    <div className="grid grid-cols-2 gap-1 text-xs font-semibold smallbold">
                        <div className=" pr-2 left prd">
                            <p><span className="font-bold text-cyan-700">Encashed from:</span> {voucherData?.encahAccountCode} - {voucherData?.encashAccountDesc}</p>
                            <p><span className="font-bold text-cyan-700">Deposited to:</span> {voucherData?.depositAccountCode} - {voucherData?.depositAccountDesc}</p>
                            <p><span className="font-bold text-cyan-700">Narration:</span> {voucherData?.voucherNarration}</p>
                            <p><span className="font-bold text-cyan-700">Rs.:</span> {voucherData?.voucherNetAmount}/- (Rs.{voucherData?.voucherNetAmountWord})</p>
                            {/* <p><span className="font-bold text-cyan-700">Rs. in Words:</span> {voucherData?.voucherNetAmountWord}</p> */}
                        </div>

                        <div className=" text-right pl-2 stts" >
                            <p><span className="font-bold text-cyan-700">Voucher ID:</span> {voucherData?.voucherId}</p>
                            <p><span className="font-bold text-cyan-700">Voucher No.:</span> {voucherData?.voucherNo}</p>
                            <p><span className="font-bold text-cyan-700">Voucher Date:</span> {voucherData?.voucherDate}</p>
                        </div>
                        <div className="clearfix"></div>

                    </div>

                    {/* Transaction Details */}
                    <div className="grid grid-cols-2 gap-1 text-xs font-semibold mt-1 smallbold">
                        <div>
                            <p><span className="font-bold text-cyan-700">Transaction By:</span> {voucherData?.instrumentType}</p>
                            <p><span className="font-bold text-cyan-700">Drawn on:</span> {voucherData?.instrumentDetails}</p>
                            <p><span className="font-bold text-cyan-700">No.:</span> {voucherData?.instrumentNo}</p>
                            <p><span className="font-bold text-cyan-700">Dated:</span> {voucherData?.instrumentDate}</p>

                        </div>

                    </div>

                    {/* Signatures */}
                    <div className="flex justify-between text-black-600 font-semibold text-xs mt-6 gap smallbold">
                        <span style={{ float: "left" }}>{voucherData?.leftSignatory}</span>
                        <span style={{ float: "right" }}>{voucherData?.rightSignatory}</span>

                    </div>
                    <div className="clearfix"></div>


                    {/* Footer */}
                    <div className="mt-4 font-semibold text-xs smallbold">
                        <i>
                            <p><span className="font-semibold text-cyan-700">Voucher Entered By:</span> {voucherData?.entryBy}</p>
                            <p><span className="font-semibold text-cyan-700">Voucher Verified By:</span> {voucherData?.verifiedBy}</p>
                        </i>
                    </div>
                </div>



                <div className="flex justify-center space-x-4 py-1">
                    <div className="text-right text-xs mt-4 italic">
                        <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onClosePreview}>
                            Close
                        </button>&nbsp;
                        <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handlePrintContra}>
                            Print
                        </button>
                    </div>
                </div>

            </Modal >

            {/* voucher Receipt */}
            < Modal isOpen={voucherCreditFlag}
                // onRequestClose={() => setIsPartyDetailsOpen(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "50%",
                        height: "76%",
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
                <div id="voucher-container" style={{ fontFamily: "InterVariable, sans-serif" }} ref={printRef} className="w-full max-w-6xl mx-auto p-4 text-xs info">
                    {/* Header */}
                    <div style={{ margin: "0 0 5px !important", padding: "0 !important" }} className="text-center info smallbold">
                        <span className="flex-1 text-center font-bold">{voucherData?.rule}</span>
                    </div>
                    <div style={{ margin: "0 0 5px !important", padding: "0 !important" }} className="info flex w-full justify-between items-center relative">
                        {/* Centered span message */}
                        <span className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
                            CREDIT VOUCHER
                        </span>

                        {/* Right-aligned image */}
                        <div className="w-24 h-12 flex items-center justify-end ml-auto logomy">
                            <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                        </div>
                    </div>

                    <div className="smallbold info text-center font-semibold">{voucherData?.lgdName}</div>
                    <div className="smallbold info text-center mb-4 font-semibold">{voucherData?.lgdAddress}</div>

                    {/* Account Details */}
                    <div className="flex justify-between border-b pb-2 smallbold print:flex">
                        <div className="w-1/2 pr-4 left prd">
                            <p><span className="font-semibold text-cyan-700">Head of Account: </span>{voucherData?.accountHead}</p>
                            <p><span className="font-semibold text-cyan-700">Account Codes: </span>{voucherData?.accountCode}</p>
                            <p><span className="font-semibold text-cyan-700">Account Code Desc: </span>{voucherData?.accountDesc}</p>
                            <p><span className="font-semibold text-cyan-700">National A/C Code: </span>{voucherData?.nationalCode}</p>
                        </div>
                        <div className="w-1/2 text-right pl-4 stts" >
                            <p><span className="font-semibold text-cyan-700">Voucher Date: </span>{voucherData?.voucherDate}</p>
                            <p><span className="font-semibold text-cyan-700">Voucher ID: </span>{voucherData?.voucherId}</p>
                            <p><span className="font-semibold text-cyan-700">Voucher No.: </span>{voucherData?.voucherNo}</p>
                            {/* <p><span className="font-semibold">Pass for Payment ID: </span>{voucherData?.pfpId}</p> */}
                        </div>
                        <div className="clearfix"></div>

                    </div>

                    {/* Payee Details & Table Side by Side */}
                    <div className="mt-2 flex justify-between gap-4 print:flex print-row smallbold">
                        {/* Payee Details */}
                        <div className="w-1/2 print-half">
                            <p><span className="font-semibold text-cyan-700">Received from:</span> {voucherData?.payTo}</p>
                            <p><span className="font-semibold text-cyan-700">of:</span> {voucherData?.partyAddress}</p>
                            <p className="lhght"><span className="font-semibold text-cyan-700" style={{ lineHeight: "1.8" }}>Description:</span> {voucherData?.voucherNarration}</p>
                            <p><span className="font-semibold text-cyan-700" style={{ lineHeight: "1.5" }}>Rs.:</span> {voucherData?.voucherNetAmount}/- (Rs.{voucherData?.voucherNetAmountWord})</p>
                            <p><span className="font-semibold text-cyan-700">Received by:</span> {voucherData?.instrumentType} <span> {voucherData?.realAccountDesc === "CASH" ? "" : "("+voucherData?.realAccountDesc+")"}</span></p>
                            <p><span className="font-semibold text-cyan-700">No.:</span> {voucherData?.instrumentNo}</p>
                            <p><span className="font-semibold text-cyan-700">Dated:</span> {voucherData?.instrumentType === "None" ? "" : voucherData?.instrumentDate}</p>
                            <p><span className="font-semibold text-cyan-700">Drawn on:</span> {voucherData?.instrumentDetails}</p>
                            <p><span className="font-semibold text-cyan-700">Allotment No:</span> {voucherData?.allotmentNo} {voucherData?.allotmentDate}</p>

                        </div>

                    </div>

                    {/* Signatures */}
                    <div className="flex justify-between text-black-600 font-semibold text-xs mt-6 gap smallbold">
                        <span style={{ float: "right" }}>{voucherData?.rightSignatory}</span>
                        <span style={{ float: "left" }}>{voucherData?.leftSignatory}</span>

                    </div>
                    <div className="clearfix"></div>

                    {/* Footer */}
                    <div className="mt-1 font-semibold text-xs smallbold">
                        <i>
                            <p><span className="font-semibold text-cyan-700">Voucher Entered by:</span> {voucherData?.entryBy}</p>
                            <p><span className="font-semibold text-cyan-700">Voucher Verified By:</span> {voucherData?.verifiedBy}</p>
                        </i>
                    </div>
                    {/* <div className="clearfix"></div> */}
                </div>

                <div className="flex justify-center space-x-4 py-1">
                    <div className="text-right text-xs mt-4 italic">
                        <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onClosePreview}>
                            Close
                        </button>&nbsp;
                        <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handlePrintCredit}>
                            Print
                        </button>
                    </div>
                </div>

            </Modal >

            {/* voucher journal */}
            < Modal isOpen={voucherJournalFlag}
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
                <div id="voucher-container" style={{ fontFamily: "InterVariable, sans-serif" }} ref={printRef} className="w-full max-w-6xl mx-auto p-4 text-xs info">
                    {/* Header */}
                    <div style={{ margin: "0 0 5px !important", padding: "0 !important" }} className="text-center info smallbold">

                        <span className="flex-1 text-center font-bold">{voucherData?.journalVoucherDetails?.rule}</span>
                    </div>
                    <div style={{ margin: "0 0 5px !important", padding: "0 !important" }} className="info flex w-full justify-between items-center relative">
                        {/* Centered span message */}
                        <span className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
                            JOURNAL VOUCHER
                        </span>

                        {/* Right-aligned image */}
                        <div className="w-24 h-12 flex items-center justify-end ml-auto logomy">
                            <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                        </div>
                    </div>

                    <div className="smallbold info text-center font-semibold">{voucherData?.journalVoucherDetails?.lgdName}</div>
                    <div className="smallbold info text-center font-semibold mb-2">{voucherData?.journalVoucherDetails?.lgdAddress}</div>
                    <hr className="border-gray-400 mb-2" />

                    {/* Voucher Info */}
                    <div className="text-right stts">
                        <p><span className="font-bold text-cyan-700">Voucher ID:</span> {voucherData?.journalVoucherDetails?.voucherId}</p>
                        <p><span className="font-bold text-cyan-700">Voucher No.:</span> {voucherData?.journalVoucherDetails?.voucherNo}</p>
                        <p><span className="font-bold text-cyan-700">Voucher Date:</span> {voucherData?.journalVoucherDetails?.voucherDate}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 text-xs font-semibold smallbold">
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

                        <div className="clearfix"></div>

                    </div>

                    {/* Narration & Party */}
                    <div className="grid text-xs font-semibold mt-3 smallbold">
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
                    <div className="flex justify-between text-black-600 font-semibold text-xs mt-6 gap smallbold">
                        <span style={{ float: "left" }}>{voucherData?.journalVoucherDetails?.leftSignatory}</span>
                        <span style={{ float: "right" }}>{voucherData?.journalVoucherDetails?.rightSignatory}</span>
                    </div>
                    <div className="clearfix"></div>
                    {/* Footer */}
                    <div className="mt-4 font-semibold text-xs smallbold">
                        <i>
                            <p><span className="font-semibold text-cyan-700">Voucher Entered By:</span> {voucherData?.journalVoucherDetails?.entryBy} </p>
                            <p><span className="font-semibold text-cyan-700">Voucher Verified By:</span> {voucherData?.journalVoucherDetails?.verifiedBy}</p>
                        </i>
                    </div>
                </div>


                <div className="flex justify-center space-x-4 py-1">
                    <div className="text-right text-xs mt-4 italic">
                        <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onClosePreview}>
                            Close
                        </button>&nbsp;
                        <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handlePrintJournal}>
                            Print
                        </button>
                    </div>
                </div>

            </Modal >

            {/* Cashier Receipt */}
            < Modal isOpen={voucherCashierReceiptFlag}
                // onRequestClose={() => setIsPartyDetailsOpen(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "50%",
                        height: "72%",
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
                <div style={{ fontFamily: "InterVariable, sans-serif" }} ref={printRef} className="w-full max-w-6xl mx-auto p-4 text-xs info">
                    {/* Header */}
                    <div className="text-center info smallbold">
                        <span className="flex-1 text-center font-semibold">{voucherData?.rule}</span>
                    </div>
                    <div className="info flex w-full justify-between items-center relative">
                        {/* Centered span message */}
                        <h2 style={{ fontFamily: "InterVariable, sans-serif" }} className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
                            {userData?.USER_LEVEL === "BLOCK" || userData?.USER_LEVEL === "DIST" ? "CASHIER'S RECEIPT" : "MISCELLANEOUS RECEIPT"}
                        </h2>

                        {/* Right-aligned image */}
                        <div className="w-24 h-12 flex items-center justify-end ml-auto logomy">
                            <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                        </div>
                    </div>

                    {/* Organization Info */}
                    <div className="smallbold info text-center font-semibold">{voucherData?.lgdName}</div>
                    <div className="smallbold info text-center font-semibold mb-2">{voucherData?.lgdAddress}</div>
                    <hr className="border-gray-400" />
                    <div className="text-right text-black-600 prn-dt smallbold">
                        <p><span className="font-bold text-cyan-700">Voucher ID:</span> {voucherData?.voucherId}</p>
                        <p><span className="font-bold text-cyan-700">Voucher Date:</span> {voucherData?.voucherDate}</p>
                    </div>
                    {/* Voucher Info */}
                    <div className="flex justify-between text-xs font-semibold mt-2">
                        <div className="w-1/2 smallbold">
                            <p><span className="font-bold text-cyan-700">CR ID:</span> {voucherData?.cashierReceiptId}</p>
                        </div>

                    </div>

                    {/* Received From */}
                    <div className="text-xs font-semibold smallbold">
                        <p><span className="font-bold text-cyan-700">Received from:</span> {voucherData?.receiveFrom} of {voucherData?.receieveAddress}</p>
                    </div>

                    {/* Amount Details */}
                    <div className="text-xs font-semibold smallbold">
                        <p><span className="font-bold text-cyan-700">Rs. :</span> {voucherData?.voucherNetAmount}/- (Rs.{voucherData?.voucherNetAmountWord})</p>
                        {/* <p><span className="font-bold">Rs. in Words:</span> {voucherData?.voucherNetAmountWord}</p> */}
                    </div>

                    {/* Transaction Details */}
                    <div className="grid text-xs font-semibold smallbold">
                        <p><span className="font-bold text-cyan-700">Received By:</span> {voucherData?.instrumentType}</p>
                        <p><span className="font-bold text-cyan-700">No.:</span> {voucherData?.instrumentNo}</p>
                        <p><span className="font-bold text-cyan-700">Dated:</span> {voucherData?.instrumentDate}</p>
                        <p><span className="font-bold text-cyan-700">On Account of:</span> {voucherData?.accountHead}</p>
                    </div>

                    {/* Signature Section */}
                    <div className="flex justify-between text-black-600 font-semibold text-xs mt-6 gap smallbold">
                        <span style={{ float: "left" }}>{voucherData?.leftSignatory}</span>
                        <span style={{ float: "right" }}>{voucherData?.rightSignatory}</span>
                    </div>
                    <div className="clearfix"></div>
                    {/* Footer */}
                    <div className="mt-4 font-semibold text-xs smallbold">
                        <p><span className="font-semibold text-cyan-700">Entered By:</span> {voucherData?.entryBy}</p>
                        <p><span className="font-semibold text-cyan-700">Verified By:</span> {voucherData?.verifiedBy}</p>
                    </div>
                </div>


                <div className="flex justify-center space-x-4 py-1">
                    <div className="text-right text-xs mt-4 italic">
                        <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onClosePreview}>
                            Close
                        </button>&nbsp;
                        <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handlePrint}>
                            Print
                        </button>
                    </div>
                </div>

            </Modal >

            {/* Adjustment ACK */}
            < Modal isOpen={voucherAdjustmentAckFlag}
                // onRequestClose={() => setIsPartyDetailsOpen(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "50%",
                        height: "70%",
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
                <div id="voucher-container" className="max-w-5xl mx-auto pt-0 pb-6 px-6 bg-white text-xs">
                    {/* Header */}
                    <div style={{ margin: "0 0 5px !important", padding: "0 !important" }} className="text-center">
                        <span className="flex-1 text-center font-bold">{voucherData?.rule}</span>
                    </div>
                    <div style={{ margin: "0 0 5px !important", padding: "0 !important" }} className="flex w-full justify-between items-center relative">
                        {/* Centered span message */}
                        <span className="absolute left-1/3 transform -translate-x-1/4 font-bold text-lg text-cyan-700">
                            Acknowledgement for Receipt of Adjustment
                        </span>

                        {/* Right-aligned image */}
                        <div className="w-24 h-12 flex items-center justify-end ml-auto">
                            <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                        </div>
                    </div>

                    {/* Organization Details */}
                    <div className="text-center font-semibold">{voucherData?.lgdName}</div>
                    <div className="text-center font-semibold mb-2">{voucherData?.lgdAddress}</div>
                    <hr className="border-gray-400 my-2" />

                    {/* Voucher Info */}
                    <div className="grid grid-cols-2 text-xs font-semibold mt-1">
                        <div className="text-left">
                            <p><span className="font-bold text-cyan-700">Received from:</span> {voucherData?.payTo} of {voucherData?.partyAddress}</p>
                            <p><span className="font-bold text-cyan-700">Rs. :</span> {voucherData?.voucherNetAmount}</p>
                            <p><span className="font-bold text-cyan-700">Rs. in Words:</span> {voucherData?.voucherNetAmountWord}</p>
                        </div>
                        <div className="text-right">
                            <p><span className="font-bold text-cyan-700">Voucher ID:</span> {voucherData?.voucherId}</p>
                            <p><span className="font-bold text-cyan-700">Voucher Date:</span> {voucherData?.voucherDate}</p>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="grid grid-cols-2 text-xs font-semibold mt-4">
                        <div>
                            <p><span className="font-bold text-cyan-700">Received By:</span> {voucherData?.instrumentType}</p>
                            <p><span className="font-bold text-cyan-700">No.:</span> {voucherData?.instrumentNo}</p>

                            <p><span className="font-bold text-cyan-700">Dated:</span> {voucherData?.instrumentDate}</p>
                            <p><span className="font-bold text-cyan-700">Drawn on:</span> {voucherData?.instrumentDetails}</p>
                            <p><span className="font-bold text-cyan-700">On account of:</span> {voucherData?.accountHead}</p>
                        </div>
                    </div>

                    {/* Signatures */}
                    <div className="flex justify-between mt-6 font-semibold pt-2">
                        <span>{voucherData?.leftSignatory}</span>
                        <span>{voucherData?.rightSignatory}</span>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 text-xs font-semibold">
                        <i>
                            <p><span className="font-semibold text-cyan-700">Voucher Entered by:</span> {voucherData?.entryBy}</p>
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

            </Modal >

            {/* Try Challan */}
            < Modal isOpen={voucherChallanFlag}
                // onRequestClose={() => setIsPartyDetailsOpen(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "60%",
                        height: "70%",
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
                <div id="voucher-container" className="max-w-5xl mx-auto pt-0 pb-6 px-6 bg-white text-xs">
                    {/* Header */}
                    <div style={{ margin: "0 0 5px !important", padding: "0 !important" }} className="text-center">
                        <span className="flex-1 text-center font-bold">{voucherData?.rule}</span>
                    </div>
                    <div style={{ margin: "0 0 5px !important", padding: "0 !important" }} className="flex w-full justify-between items-center relative">
                        {/* Centered span message */}
                        <span className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
                            CHALLAN
                        </span>

                        {/* Right-aligned image */}
                        <div className="w-24 h-12 flex items-center justify-end ml-auto">
                            <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                        </div>
                    </div>
                    <div className="text-center font-bold text-sm ">{voucherData?.lgdName}</div>
                    <div className="text-center font-bold text-sm">{voucherData?.lgdAddress}</div>

                    <div className="text-center font-semibold text-cyan-700">Original / Duplicate / Triplicate</div>
                    <div className="text-center text-xs">
                        <span className="font-semibold text-cyan-700">Challan ID: </span> {voucherData?.challanId} &nbsp;
                        <span className="font-semibold text-cyan-700">Challan No.: </span> {voucherData?.challanNo} &nbsp;
                        <span className="font-semibold text-cyan-700">Voucher ID: </span> {voucherData?.voucherId}
                    </div>
                    <div className="text-center font-semibold text-cyan-700">
                        Challan of Cash into Treasury Treasury LF at <span className="font-bold">State Bank of India</span>
                    </div>

                    {/* Title */}

                    {/* Table */}
                    <div className="border mt-3">
                        <div className="grid grid-cols-5 border-b">
                            <div className="border-r p-2 font-semibold text-cyan-700">By Whom Tendered</div>
                            <div className="border-r p-2 font-semibold text-cyan-700">
                                Name (or designation) & Address of the person on whose behalf money is paid
                            </div>
                            <div className="border-r p-2 font-semibold text-cyan-700">Full Particulars of the remittance</div>
                            <div className="border-r p-2 font-semibold text-cyan-700">Amount</div>
                            <div className="p-2 font-semibold text-cyan-700">Head of Accounts to be credited</div>
                        </div>
                        <div className="grid grid-cols-5">
                            <div className="border-r p-2">{voucherData?.byWhom}</div>
                            <div className="border-r p-2">{voucherData?.whoseBehalf}</div>
                            <div className="border-r p-2">
                                {voucherData?.voucheR_NARRATION}
                            </div>
                            <div className="border-r p-2">{voucherData?.voucherNetAmount}</div>
                            <div className="p-2">{voucherData?.accountHead}</div>
                        </div>
                    </div>

                    {/* Amount in Words */}
                    <div className="mt-2 font-semibold">
                        <span className="text-black-700">Rupees {voucherData?.voucherNetAmountWord}</span>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 flex justify-between text-xs font-semibold">
                        <i>
                            <p>
                                <span className="font-bold text-cyan-700">Entered By:</span> {voucherData?.entryBy}
                            </p>
                        </i>
                        <p className="text-black-700 font-bold text-cyan-700">Signature of Accountant</p>
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

            </Modal >

            <div className="bg-white rounded-lg p-1 flex flex-col flex-grow">
                <div className="shadow-md" style={{ marginBottom: "-1rem" }}>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4" >
                            <nav aria-label="Breadcrumb">
                                <ol className="flex items-center space-x-2 px-2" style={{ marginBottom: "-3rem" }}>
                                    {/* Added padding */}
                                    <svg
                                        viewBox="0 0 1024 1024"
                                        fill="currentColor"
                                        height="1em"
                                        width="1em"
                                    >
                                        <path d="M946.5 505L534.6 93.4a31.93 31.93 0 00-45.2 0L77.5 505c-12 12-18.8 28.3-18.8 45.3 0 35.3 28.7 64 64 64h43.4V908c0 17.7 14.3 32 32 32H448V716h112v224h265.9c17.7 0 32-14.3 32-32V614.3h43.4c17 0 33.3-6.7 45.3-18.8 24.9-25 24.9-65.5-.1-90.5z" />
                                    </svg>
                                    <li>
                                        <a

                                            className="text-indigo-600 hover:text-indigo-800"
                                        >
                                            Home &nbsp;
                                        </a>
                                        /
                                    </li>
                                    <li className="text-gray-500 font-bold" aria-current="page">
                                        Voucher/Cashier Receipt/Challan
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <br />
                </div>
                <div className="flex flex-col space-y-2 py-5">
                    <div className="flex flex-col w-full mb-4 space-y-2">
                        <div className="flex items-center w-full space-x-4">

                            {/* Voucher Type Dropdown */}
                            <div className="w-1/2 px-2">
                                <label htmlFor="voucher_type" className="block text-sm font-medium text-gray-700">
                                    Voucher Type <span className="text-red-500"> * </span>
                                </label>
                                <select
                                    id="voucher_type"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300"
                                    onChange={onVoucherType}
                                    value={voucherType}
                                >
                                    <option value="">--Select Voucher Type--</option>
                                    {dataArray.map((voucherType) => (
                                        <option key={voucherType.value} value={voucherType.value}>
                                            {voucherType.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* From Date */}
                            <div className="w-1/4 px-2">
                                <label htmlFor="from_date" className="block text-sm font-medium text-gray-700">
                                    From Date<span className="text-red-500"> * </span>
                                </label>
                                <input
                                    type="date"
                                    id="from_date"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                            </div>

                            {/* To Date */}
                            <div className="w-1/4 px-2">
                                <label htmlFor="to_date" className="block text-sm font-medium text-gray-700">
                                    To Date<span className="text-red-500"> * </span>
                                </label>
                                <input
                                    type="date"
                                    id="to_date"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                            </div>

                            {/* Input Box */}
                            <div className="w-1/4 px-2">
                                <label htmlFor="input_box" className="block text-sm font-medium text-gray-700">
                                    Voucher Narration
                                </label>
                                <input
                                    type="text"
                                    id="input_box"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300"
                                    value={voucherNarration}
                                    placeholder="Voucher Narration"
                                    onChange={(e) => setVoucherNarration(e.target.value)}
                                    maxLength={200}
                                />
                            </div>

                            {/* Generate Button */}
                            <div className="w-1/6">
                                <button
                                    type="button"
                                    className="btn-submit h-9 px-2 mt-5 shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={onSearch}
                                >
                                    Search
                                </button>
                            </div>

                        </div>
                    </div>
                </div>


                {data?.length > 0 ? (
                    <>
                        <div>
                            <button
                                onClick={() => exportToExcel(data, "National_Account_Code")}
                                className="bg-green-500 text-white px-2 py-2 rounded mr-2 text-sm"
                            >
                                Download Excel
                            </button>
                        </div>

                        {/* Table Container with Scrollable Body */}
                        <div className="border border-gray-300 min-w-[300px] max-h-[600px] overflow-y-auto">
                            <table className="w-full border-collapse border border-gray-300 text-left">
                                {/* Fixed Header */}
                                <thead className="sticky top-0 bg-gray-200">
                                    <tr>
                                        {tableHeaders1.map((header) => (
                                            <th key={header} className="border border-gray-400 px-4 py-2 text-sm">
                                                {header === "verifyStts" ?
                                                    "Status" : header === "uploadFile"
                                                        ? "V_Doc"
                                                        : header === "pfpFile"
                                                            ? "PFP Doc"
                                                            : header}
                                            </th>
                                        ))}



                                    </tr>
                                </thead>

                                {/* Scrollable Table Body */}
                                <tbody className="overflow-y-auto">
                                    {data.map((row, rowIndex) => (
                                        <tr
                                            key={rowIndex}
                                            className="text-left cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleRowClick(row?.voucherId)}
                                        >
                                            {tableHeaders1.map((header) => (
                                                <td key={header} className="border border-gray-400 px-4 py-1 text-xs">
                                                    {header === "uploadFile" && row[header] ? (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // 👈 Prevent the row click
                                                                window.open("https://javaapi.wbpms.in/" + row?.uploadFile, "_blank");
                                                            }}
                                                            className="text-blue-600 hover:text-blue-800"
                                                            title="View File"
                                                        >
                                                            <FontAwesomeIcon size="2x" icon={faEye} title="View File" />
                                                        </button>
                                                    ) : header === "pfpFile" && row[header] ? (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // 👈 Prevent the row click
                                                                window.open("https://javaapi.wbpms.in/" + row?.pfpFile, "_blank");
                                                            }}
                                                            className="text-blue-600 hover:text-blue-800"
                                                            title="View File"
                                                        >
                                                            <FontAwesomeIcon size="2x" icon={faEye} title="View File" />
                                                        </button>
                                                    ) : (
                                                        row[header] || "-"
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>


                            </table>

                            {/* Show Selected Row Data */}

                        </div>
                    </>
                ) : ""}
                {data?.length === 0 ? <div className="flex items-center justify-center bg-gray-200" style={{ marginTop: "10px" }}>
                    <div className="text-center">
                        <h1 className="text-xl font-semibold text-black-800">No Data Found</h1>

                    </div>
                </div> : ""}



            </div>
        </>
    );
};

export default VoucherCrChallan;
