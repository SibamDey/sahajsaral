import React from "react";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { addMonthlyAccClosing, getLastMonthCLose } from "../../../Service/Utility/UtilityService";
import Modal from 'react-modal';
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';

const MonthlyAccountingClosing = () => {
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);

    const [lastMonthData, setLastMonthData] = useState([]);
    const [currentFinancialYear, setCurrentFinancialYear] = useState("");
    const [financialYears, setFinancialYears] = useState([]);
    const [submitFlag, setSubmitFlag] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [loadingFy, setLoadingFy] = useState(false);

    const months = [
        { value: "4", label: "April" },
        { value: "5", label: "May" },
        { value: "6", label: "June" },
        { value: "7", label: "July" },
        { value: "8", label: "August" },
        { value: "9", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
        { value: "1", label: "January" },
        { value: "2", label: "February" },
        { value: "3", label: "March" },
    ];

    // =========================
    // Fetch Last Month Closed
    // =========================
    useEffect(() => {
        if (!userData?.CORE_LGD) return;

        getLastMonthCLose(userData?.CORE_LGD).then((response) => {
            if (response.status === 200) {
                setLastMonthData(response?.data);
            }
        });
    }, [userData?.CORE_LGD]);

    // =========================
    // Fetch Financial Years
    // =========================
    useEffect(() => {
        const fetchFinancialYears = async () => {
            if (!userData?.CORE_LGD) return;

            try {
                setLoadingFy(true);

                const response = await axios.get(
                    `https://javaapi.wbpms.in/api/MonthClose/FinYear?lgdCode=${userData?.CORE_LGD}`
                );

                if (response?.data?.finYears && Array.isArray(response.data.finYears)) {
                    setFinancialYears(response.data.finYears);

                    // Default select first financial year
                    if (response.data.finYears.length > 0) {
                        setCurrentFinancialYear(response.data.finYears[0].finYear);
                    }
                }
            } catch (error) {
                console.error("Error fetching financial years:", error);
                toast.error("Failed to load financial years");
            } finally {
                setLoadingFy(false);
            }
        };

        fetchFinancialYears();
    }, [userData?.CORE_LGD]);

    const onMonth = (e) => {
        setSelectedMonth(e.target.value);
    };

    const onFinancialYearChange = (e) => {
        setCurrentFinancialYear(e.target.value);
    };

    const onSubmit = () => {
        if (!currentFinancialYear) {
            toast.error("Please select financial year");
        } else if (!selectedMonth) {
            toast.error("Please select month");
        } else {
            setSubmitFlag(true);
        }
    };

    const onMonthSubmit = () => {
        addMonthlyAccClosing(
            userData?.CORE_LGD,
            currentFinancialYear,
            selectedMonth,
            userData?.USER_INDEX,
            (r) => {
                console.log(r, "Monthly Close Response");

                if (r.status === 0) {
                    toast.success(r.message);
                    setSubmitFlag(false);
                } else if (r.status === 1) {
                    toast.error(r.message);
                } else {
                    toast.error("Something went wrong");
                }
            }
        );
    };

    const onMonthClose = () => {
        setSubmitFlag(false);
    };

    return (
        <>
            <ToastContainer />

            <Modal
                isOpen={submitFlag}
                onRequestClose={() => setSubmitFlag(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "40%",
                        height: "30%",
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
                <h3 className="text-center text-gray-800 text-xl font-bold mb-1">
                    Are you sure you want to close the month of{" "}
                    {months.find((m) => m.value === selectedMonth)?.label} ?
                </h3>

                <div className="mt-4 text-center">
                    <button
                        type="button"
                        className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                        onClick={onMonthSubmit}
                    >
                        Yes
                    </button>
                    &nbsp;&nbsp;
                    <button
                        type="button"
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                        onClick={onMonthClose}
                    >
                        No
                    </button>
                </div>
            </Modal>

            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">
                    Monthly Accounting Closing
                </legend>

                <div className="flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full space-y-2">
                        <div className="flex items-center gap-4">

                            {/* Financial Year Dropdown */}
                            <div className="w-1/5">
                                <label
                                    htmlFor="financialYear"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Financial Year <span className="text-red-500">*</span>
                                </label>

                                <select
                                    id="financialYear"
                                    value={currentFinancialYear}
                                    onChange={onFinancialYearChange}
                                    className="text-sm block w-full p-1 h-9 border border-gray-300"
                                >
                                    <option value="">
                                        {loadingFy ? "Loading..." : "--Select Financial Year--"}
                                    </option>

                                    {financialYears.map((item, index) => (
                                        <option key={index} value={item.finYear}>
                                            {item.finYear}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Month Dropdown */}
                            <div className="w-1/5 px-2">
                                <label
                                    htmlFor="month"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Month <span className="text-red-500">*</span>
                                </label>

                                <select
                                    id="month"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300"
                                    onChange={onMonth}
                                    value={selectedMonth}
                                >
                                    <option value="">--Select Month--</option>
                                    {months.map((month) => (
                                        <option key={month.value} value={month.value}>
                                            {month.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Submit Button */}
                            <div className="w-1/2">
                                <button
                                    type="button"
                                    className="btn-submit h-10 py-2 px-6 mt-5 shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={onSubmit}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>

                        <h3 className="text-sm font-semibold text-gray-700">
                            Last Month Closed: {lastMonthData?.message}
                        </h3>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MonthlyAccountingClosing;