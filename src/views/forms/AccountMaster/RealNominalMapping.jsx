import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getRealNominalMapping, addRealNominalMapping, getGlGroup } from "../../../Service/Budget/BudgetService";
import {getRealAccList} from "../../../Service/Transaction/TransactionService";

const RealNominalMapping = () => {
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const [mappingPri, setMappingPri] = useState("");
    const [year, setYear] = useState();
    const [budgetDate, setBudgetDate] = useState("");
    const [glGroup, setGlGroup] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState({});


    useEffect(() => {
        getRealNominalMapping(userData?.CORE_LGD,0).then((response) => {
            console.log(response, "response")
            if (response.status === 200) {
                setMappingPri(response?.data);
            } else {
                toast.error("Failed to fetch data");
            }
        });

        getRealAccList(userData?.CORE_LGD,).then((response) => {
            console.log(response, "response")
            if (response.status === 200) {
                setGlGroup(response?.data);
            } else {
                toast.error("Failed to fetch data");
            }
        });
    }, []);


    const [data, setData] = useState([]);

    const safeMappingPri = Array.isArray(mappingPri) ? mappingPri : [];

    useEffect(() => {
        const initialSelection = {};
        safeMappingPri.forEach((row, index) => {
            initialSelection[index] = row.realAccountCode ? row.realAccountCode.split(",") : [null];
        });
        setSelectedGroups(initialSelection);
    }, [mappingPri]);

    const handleInputChange = (index, selectedValues) => {
        setSelectedGroups((prev) => ({
            ...prev,
            [index]: selectedValues, // Store selected values per row index
        }));
    };

    const formattedData = safeMappingPri.map((row, index) => ({
        lgdCode: userData?.CORE_LGD,
        accountCode: row.accountCode,
        realAccountCode: selectedGroups[index]?.length > 0 ? selectedGroups[index].join(",") : null // Convert array to string or default to "0000"
    }));

console.log(formattedData,"formattedData")

    const onSave = () => {

        addRealNominalMapping(formattedData,
            (r) => {
                console.log(r, "dd");
                if (r.status == 0) {
                    setMappingPri([]);
                    toast.success(r.message);
                    getRealNominalMapping(userData?.CORE_LGD,0).then((response) => {
                        console.log(response, "response")
                        if (response.status === 200) {
                            setMappingPri(response?.data);
                        } else {
                            toast.error("Failed to fetch data");
                        }
                    });
                } else if (r.status == 1) {
                    toast.error(r.message);
                }
            }
        )
    };

    return (
        <>
            <ToastContainer />
            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Mapping Nominal A/C with Bank/Try</legend>




                {mappingPri?.length > 0 ? <>
                    <table className="text-sm min-w-full border-collapse border border-gray-300 text-center">
                        <thead>
                            <tr className="bg-cyan-400">
                                <th className="border border-gray-300 p-1">A/C Code</th>
                                <th className="border border-gray-300 p-1">A/C Code Description</th>
                                <th className="border border-gray-300 p-1">GL Group</th>
                                <th className="border border-gray-300 p-1">Receipt/Payment </th>
                                <th className="border border-gray-300 p-1">Linked Bank/Treasury</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mappingPri?.map((row, index) => (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                >
                                    <td className="border border-gray-300 text-sm p-1">{row?.accountCode}</td>
                                    <td className="border border-gray-300 text-sm p-1">{row?.accountCodeDesc}</td>
                                    <td className="border border-gray-300 text-sm p-1">{row?.glGroup}</td>
                                    <td className="border border-gray-300 text-sm p-1">{row?.rcptpmntFlag}</td>
                                    <td className="border border-gray-300 text-sm p-1">
                                        <select
                                            className="border p-1 w-full text-sm"
                                            value={selectedGroups[index]?.[0] || ""}
                                            onChange={(e) => {
                                                handleInputChange(index, [e.target.value]);
                                            }}
                                        >
                                            <option value="">Select Linked Bank/Treasury</option>
                                            {glGroup?.map((item) => (
                                                <option key={item.accountCode} value={item.accountCode}>
                                                    {item.accountCodeDesc}
                                                </option>
                                            ))}
                                        </select>
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

export default RealNominalMapping;
