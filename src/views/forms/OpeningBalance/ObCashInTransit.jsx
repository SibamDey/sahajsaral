import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getObCashInTransit, addInsertOBTransit } from "../../../Service/OpeningBalance/OpeningBalance";


const ObCashInTransit = () => {
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

    // useEffect(() => {
    //     const currentDate = new Date();
    //     const currentYear = currentDate.getFullYear();
    //     const currentMonth = currentDate.getMonth(); // 0-indexed (Jan = 0, Feb = 1, ..., Dec = 11)
    
    //     // Determine the start and end years of the previous financial year
    //     const startYear = currentMonth >= 3 ? currentYear - 1 : currentYear - 2; // Shift back by one FY
    //     const endYear = startYear + 1;
    
    //     setCurrentFinancialYear(`${startYear}-${endYear}`);
    // }, []);

    const [selectedMonth, setSelectedMonth] = useState("");

    const months = [
        // { value: "1", label: "January" },
        // { value: "2", label: "February" },
        // { value: "3", label: "March" },
        { value: "4", label: "April" },
        // { value: "5", label: "May" },
        // { value: "6", label: "June" },
        // { value: "7", label: "July" },
        // { value: "8", label: "August" },
        // { value: "9", label: "September" },
        // { value: "10", label: "October" },
        // { value: "11", label: "November" },
        // { value: "12", label: "December" },
    ];

    const [data, setData] = useState([]);

    const handleInputChange = (index, value) => {
        const updatedData = [...data];
        updatedData[index].balance = value;
        setData(updatedData);
    };

    const onMonth = (e) => {
        setSelectedMonth(e.target.value);
    }


    const onSearch = () => {
        if (!selectedMonth) {
            toast.error("Please select month");

        } else {
            getObCashInTransit(userData?.CORE_LGD, currentFinancialYear, selectedMonth).then((response) => {
                if (response.status === 200) {
                    setData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        }
    }
    console.log(data, "data")

    const onSave = () => {
        const isAnyFieldEmpty = data.some(
            (row) => String(row.balance).trim() === ""
        );

        if (isAnyFieldEmpty) {
            toast.error("All opening balance fields must be filled!")
        } else {

            addInsertOBTransit(userData?.CORE_LGD, currentFinancialYear, selectedMonth, userData?.USER_INDEX, data,
                (r) => {
                    console.log(r, "dd");
                    if (r.status == 0) {
                        setData([]);
                        setSelectedMonth("");
                        toast.success(r.message);

                    } else if (r.status == 1) {
                        toast.error(r.message);
                    }
                }
            )
        }
    };

    return (
        <>
            <ToastContainer />

            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">OB – Cash-in-Transit
                </legend>

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
                                    onClick={onSearch}
                                >
                                    Search
                                </button>
                            </div>


                        </div>

                    </div>
                </div>

                {data?.length > 0 ? <>
                    <table className="min-w-full border-collapse border border-gray-300 text-left">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-1">Gl Group ID</th>
                                <th className="border border-gray-300 p-1">Gl Group Name</th>
                                <th className="border border-gray-300 p-1">Opening Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                >
                                    <td className="border border-gray-300 text-sm p-1">{row.glGroupId}</td>
                                    <td className="border border-gray-300 text-sm p-1">{row.glGroupName}</td>
                                    <td className="border border-gray-300 text-sm p-1">
                                        <input
                                            type="number"
                                            value={row.balance}
                                            className="border p-1 w-full text-sm text-right"
                                            onChange={(e) =>
                                                handleInputChange(index, e.target.value)
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                    <div className="w-1/2 flex justify-end">
                        <button
                            type="button"
                            className="btn-submit h-10 py-2 px-6 mt-5 shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={onSave}
                        >
                            Save
                        </button>
                    </div>
                </> : ""}

            </div>
        </>
    );
};

export default ObCashInTransit;
