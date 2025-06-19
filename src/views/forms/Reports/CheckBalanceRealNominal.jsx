import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getCheckBalanceRealNominalList } from "../../../Service/OpeningBalance/OpeningBalance";


const CheckBalanceRealNominal = () => {
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [currentFinancialYear, setCurrentFinancialYear] = useState("");
    const [data, setData] = useState();

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


    const months = [
        { value: "1", label: "January" },
        { value: "2", label: "February" },
        { value: "3", label: "March" },
        { value: "4", label: "April" },
        { value: "5", label: "May" },
        { value: "6", label: "June" },
        { value: "7", label: "July" },
        { value: "8", label: "August" },
        { value: "9", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
    ];


    const onMonth = (e) => {
        setSelectedMonth(e.target.value);
    }

    console.log(data, "daradara")
    const onSearch = () => {
        if (!selectedMonth) {
            toast.error("Please select month");

        } else {
            getCheckBalanceRealNominalList(userData?.CORE_LGD, currentFinancialYear, selectedMonth).then((response) => {
                if (response.status === 200) {
                    setData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        }
    }




    return (
        <>
            <ToastContainer />

            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Check Balance Real / Nominal A/C
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

                {/* {data?.length > 0 ? <> */}
                {data ? (
                    <table className="min-w-full border-collapse border border-gray-300 text-center">
                        <thead>
                            <tr className="bg-cyan-400">
                                <th className="border border-gray-300 p-1">Dist Name</th>
                                <th className="border border-gray-300 p-1">Block Name</th>
                                <th className="border border-gray-300 p-1">GP Name</th>
                                <th className="border border-gray-300 p-1 text-left">Real A/C Balance</th>
                                <th className="border border-gray-300 p-1 text-left">Nominal A/C Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 text-sm p-1">{data.distName}</td>
                                <td className="border border-gray-300 text-sm p-1">{data.blockName}</td>
                                <td className="border border-gray-300 text-sm p-1">{data.gpName}</td>
                                <td className="border border-gray-300 text-sm p-1 text-left">{data.realBalance}</td>
                                <td className="border border-gray-300 text-sm p-1 text-left">{data.nominalBalance}</td>
                            </tr>
                        </tbody>
                    </table>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                        <h2 className="text-lg font-semibold mb-1">No Data Found</h2>

                    </div>
                )}





            </div>
        </>
    );
};

export default CheckBalanceRealNominal;
