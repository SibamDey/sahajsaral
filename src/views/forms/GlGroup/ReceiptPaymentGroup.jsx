import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getReceiptPayGrpList, getHeadClassificationList } from "../../../Service/GlGroup/GlGroup";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ReceiptPaymentGroup = () => {
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);

    const [currentFinancialYear, setCurrentFinancialYear] = useState("");

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

    const [receiptPaymentGroup, setReceiptPaymentGroup] = useState("");


    const [data, setData] = useState([]);

    const handleInputChange = (index, value) => {
        const updatedData = [...data];
        updatedData[index].openingBalance = value;
        setData(updatedData);
    };

    const onReceiptPaymentGroup = (e) => {
        setReceiptPaymentGroup(e.target.value);
    }


    const onSearch = () => {
        if (!receiptPaymentGroup) {
            toast.error("Please select a Type");

        } else {
            if (receiptPaymentGroup === "R") {
                getReceiptPayGrpList().then((response) => {
                    if (response.status === 200) {
                        setData(response.data);
                    } else {
                        toast.error("Failed to fetch data");
                    }
                });
            } else {
                getHeadClassificationList().then((response) => {
                    if (response.status === 200) {
                        setData(response.data);
                    } else {
                        toast.error("Failed to fetch data");
                    }
                });
            }

        }
    }
    console.log(data, "data")



    const dataArray = [
        { value: 1, label: "PRI ACCOUNT HEAD WITH NATIONAL ACCOUNT CODE" },
        { value: 2, label: "STATE ACCOUNT HEAD WITH NATIONAL ACCOUNT CODE" },
        { value: 3, label: "List of Major Head" },
        { value: 4, label: "List of Minor Head – Receipt" },
        { value: 5, label: "List of Minor Head – Payment" },
        { value: 6, label: "Scheme Wise Object Head" },
        { value: 7, label: "Equipment with Sub Equipment" },
        { value: 8, label: "Own Fund - Object Head" },
        { value: 9, label: "Major Head with Sub Head" },
        { value: 10, label: "Scheme wise Major - Minor – Object" },
        { value: 11, label: "Own Fund Object Exp Head" }
    ];

    const tableHeaders1 = data.length > 0 ? Object.keys(data[0]) : [];

    const exportToExcel = (tableData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(tableData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };

    return (
        <>
            <ToastContainer />

            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Receipt Payment Group</legend>

                <div className=" flex flex-col space-y-1 py-1">
                    <div className="flex flex-col w-full mb-2 space-y-2">
                        <div className="flex items-center ">


                            <div className="w-1/2">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Receipt Payment Group / Head Classification <span className="text-red-500 "> * </span>

                                </label>
                                <select id="DISTRICT" className="text-sm block w-full p-1 h-9 border border-gray-300 " onChange={onReceiptPaymentGroup} value={receiptPaymentGroup}>
                                    <option value="" selected>--Select Receipt Payment Group / Head Classification--</option>
                                    <option value="R" selected>Receipt Payment Group</option>
                                    <option value="H" selected>Head Classification</option>

                                </select>

                            </div>
                            <div className="w-1/2 px-2">
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
                                onClick={() => exportToExcel(data, "receipt_payment_group")}
                                className="bg-green-500 text-white px-2 py-2 rounded mr-2 text-sm"
                            >
                                Download Excel
                            </button>
                        </div>

                        {/* Table Container with Scrollable Body */}
                        <div className="border border-gray-300 min-w-[300px] max-h-[500px] overflow-y-auto">
                            <table className="w-full border-collapse border border-gray-300 text-left">
                                {/* Fixed Header */}
                                <thead className="sticky top-0 bg-gray-200">
                                    <tr>
                                        {tableHeaders1.map((header) => (
                                            <th key={header} className="border border-gray-400 px-4 py-2 text-sm">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                {/* Scrollable Table Body */}
                                <tbody className="overflow-y-auto">
                                    {data.map((row, rowIndex) => (
                                        <tr key={rowIndex} className="text-left">
                                            {tableHeaders1.map((header) => (
                                                <td key={header} className="border border-gray-400 px-4 py-1 text-xs">
                                                    {row[header] || "-"}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : ""}



            </div>
        </>
    );
};

export default ReceiptPaymentGroup;
