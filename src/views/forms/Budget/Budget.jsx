import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getBudgetList, addInsertBudget, getMaxBudgetDate } from "../../../Service/Budget/BudgetService";


const Budget = () => {
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const [maxBudgetDate, setMaxBudgetDate] = useState("");
    const [currentFinancialYear, setCurrentFinancialYear] = useState("");
    const [year, setYear] = useState();
    const [budgetDate, setBudgetDate] = useState("");
    console.log(maxBudgetDate, "maxBudgetDate")
    const currentYear = new Date().getFullYear();

    const generateFinancialYearRanges = (rangeCount) => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth(); // 0 = Jan, 3 = April

        // Financial year starts in April
        const currentFYStart = month >= 3 ? year : year - 1;

        const ranges = [];
        for (let i = 0; i < rangeCount; i++) {
            const start = currentFYStart - i;
            const end = start + 1;
            ranges.push(`${start}-${end}`);
        }

        return ranges;
    };

    // usage
    const yearRanges = generateFinancialYearRanges(1);


    const onYear = (e) => {
        console.log(e.target.value)
        setYear(e.target.value)
    }
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


    const [data, setData] = useState([]);

    const handleInputChange = (index, value) => {
        const updatedData = [...data];
        updatedData[index].budgetAmount = value;
        setData(updatedData);
    };



    const onBudgetDate = (e) => {
        setBudgetDate(e.target.value)
    }



    const onSearch = () => {
        if (!year) {
            toast.error("Please select Year");

        } else {
            getBudgetList(userData?.CORE_LGD, year).then((response) => {
                if (response.status === 200) {
                    setData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });

            getMaxBudgetDate(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,).then((response) => {
                console.log(response, "response")
                if (response.status === 200) {
                    setMaxBudgetDate(response?.data?.message);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        }
    }
    console.log(data, "data")

    const onSave = () => {
        const isAnyFieldEmpty = data.some(
            (row) => String(row.budgetAmount).trim() === ""
        );

        if (isAnyFieldEmpty) {
            toast.error("All opening balance fields must be filled!")
        } else if (!budgetDate) {
            toast.error("Please select Budget Date");
        } else {

            addInsertBudget(userData?.CORE_LGD, year, userData?.USER_INDEX, data, budgetDate,
                (r) => {
                    console.log(r, "dd");
                    if (r.status == 0) {
                        setData([]);
                        toast.success(r.message);
                        setYear("");
                        setBudgetDate("")

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
                <legend className="text-lg font-semibold text-cyan-700">Annual Budget</legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full space-y-2">
                        <div className="flex items-center gap-4 ">

                            <div className="w-1/4 px-2">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Budget For Financial Year
                                    <span className="text-red-500"> *</span>
                                </label>

                                <select
                                    id="scheme_name"
                                    name="scheme_name"
                                    autoComplete="off"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300 "
                                    onChange={onYear}
                                    value={year}
                                >
                                    <option value="" selected hidden>
                                        Select Plan Year
                                    </option>
                                    {yearRanges.map((range, idx) => (
                                        <option key={idx} value={range}>
                                            {range}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-1/5 px-2">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Budget Date
                                    <span className="text-red-500"> *</span>
                                </label>

                                <input
                                    id="scheme_name"
                                    name="scheme_name"
                                    autoComplete="off"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300 "
                                    onChange={onBudgetDate}
                                    value={budgetDate}
                                    type="date"
                                />


                            </div>
                            <div className="w-1/2">
                                <button
                                    type="button"
                                    className="btn-submit h-10 py-2 px-6 mt-5 shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={onSearch}
                                >
                                    Generate
                                </button>
                            </div>


                        </div>

                    </div>
                </div>
                <div>
                    <label><b>{maxBudgetDate}</b></label>
                </div>

                {data?.length > 0 ? <>
                    <table className="min-w-full border-collapse border border-gray-300 text-left">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-1">GL-Group Name</th>
                                <th className="border border-gray-300 p-1">Account Code</th>
                                <th className="border border-gray-300 p-1">Account Code Description</th>
                                <th className="border border-gray-300 p-1">Receipt/Payment </th>
                                <th className="border border-gray-300 p-1">Budget Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                >
                                    <td className="border border-gray-300 text-sm p-1">{row.glGroupName}</td>
                                    <td className="border border-gray-300 text-sm p-1">{row.accountCode}</td>
                                    <td className="border border-gray-300 text-sm p-1">{row.accountCodeDesc}</td>
                                    <td className="border border-gray-300 text-sm p-1">{row.rcptPmntFlag}</td>
                                    <td className="border border-gray-300 text-sm p-1">
                                        <input
                                            type="number"
                                            value={row.budgetAmount}
                                            className="border p-1 w-full text-sm"
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

export default Budget;
