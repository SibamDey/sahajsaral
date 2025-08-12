import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import { addMonthlyAccClosing, getLastMonthCLose } from "../../../Service/Utility/UtilityService";
import Modal from 'react-modal';
import 'react-toastify/dist/ReactToastify.css';

const MonthlyAccountingClosing = () => {
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const [lastMonthData, setLastMonthData] = useState([]);
    const [currentFinancialYear, setCurrentFinancialYear] = useState("");
    const [submitFlag, setSubmitFlag] = useState(false);

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

    useEffect(() => {
        getLastMonthCLose(userData?.CORE_LGD).then((response) => {
            if (response.status === 200) {
                setLastMonthData(response?.data);
            }
        });
    }, []);


    console.log(lastMonthData?.message, "lastMonthData")

    const [selectedMonth, setSelectedMonth] = useState("");

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

    const [data, setData] = useState([]);

    const onMonth = (e) => {
        setSelectedMonth(e.target.value);
    }


    const onSubmit = () => {
        if (!selectedMonth) {
            toast.error("Please select month");
        } else {
            setSubmitFlag(true);
        }
    }
    console.log(data, "data")

    const onMonthSubmit = () => {
        addMonthlyAccClosing(userData?.CORE_LGD, currentFinancialYear, selectedMonth, userData?.USER_INDEX,
            (r) => {
                console.log(r, "asssa")
                if (r.status == 0) {
                    toast.success(r.message);
                    setSubmitFlag(false);
                    // setData(response.data);
                } else if (r.status == 1) {
                    toast.error(r.message);
                } else {
                    toast.error("Something went wrong");
                }
            });


    }

    const onMonthClose = () => {
        setSubmitFlag(false)
    }

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
                        height: "30%", // Increased height slightly to accommodate the new field
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
                    Are you sure you want to close the month of {months.filter(m => m.value === selectedMonth).map(m => m.label)} ?
                </h3>
                {/* Reason Input */}


                {/* Buttons */}
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
                <legend className="text-lg font-semibold text-cyan-700">Monthly Accounting Closing</legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full space-y-2">
                        <div className="flex items-center gap-4 ">

                            <div className="w-1/5 ">

                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Financial Year <span className="text-red-500 "> * </span>

                                </label>
                                <select value={currentFinancialYear}
                                    disabled className="text-sm block w-full p-1 h-9 border border-gray-300 ">
                                    <option value={currentFinancialYear}>{currentFinancialYear}</option>
                                </select>

                            </div>
                            <div className="w-1/5 px-2">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Month <span className="text-red-500 "> * </span>

                                </label>
                                <select id="DISTRICT" className="text-sm block w-full p-1 h-9 border border-gray-300 " onChange={onMonth} value={selectedMonth}>
                                    <option value="" selected>--Select Month--</option>
                                    {months.map((month) => (
                                        <option key={month.value} value={month.value}>
                                            {month.label}
                                        </option>
                                    ))}
                                </select>

                            </div>
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
                        <h3 className="text-sm font-semibold text-gray-700">Last Month Closed: {lastMonthData?.message}</h3>

                    </div>
                </div>



            </div>
        </>
    );
};

export default MonthlyAccountingClosing;
