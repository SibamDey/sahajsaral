import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getFinInstitute, getChequeNoDetails, addUpdateCheque } from "../../../Service/Cheque/ChequeService";

const ChequeStatusUpdate = () => {
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const [bank, setBank] = useState("")
    const [cheque, setCheque] = useState("")
    const [finInstitution, setfinInstitute] = useState([]);


    // Calculate the current financial year dynamically
    useEffect(() => {
        getFinInstitute(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
            "R",
        ).then(function (result) {
            const response = result?.data;
            console.log(response, "report")
            setfinInstitute(response);

        })
    }, []);


    const [data, setData] = useState([]);

    const handleInputChange = (index, value) => {
        const updatedData = [...data];
        updatedData[index].remarks = value;
        console.log(index, value, updatedData, "sisisisi")
        setData(updatedData);
    };



    const onSearch = () => {
        if (!bank) {
            toast.error("Please Select Bank/Treasury");
        } else if (!cheque) {
            toast.error("Please Type Cheque No");
        } else {
            getChequeNoDetails(userData?.CORE_LGD, bank, cheque).then((response) => {
                if (response.status === 200) {
                    setData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        }
    }
    console.log(data, "data")

    const onIssued = () => {
        if (!data[0]?.remarks) {
            toast.error("Please Enter Remarks")
        } else {
            addUpdateCheque(userData?.CORE_LGD, data[0]?.chequeBookId, data[0]?.accountCode,
                data[0]?.chequeBookNo, "I",
                cheque,
                data[0]?.remarks,
                (r) => {
                    console.log(r, "dd");
                    if (r.status == 0) {
                        setData([]);
                        setBank("");
                        setCheque("");

                        toast.success(r.message);

                    } else if (r.status == 1) {
                        toast.error(r.message);
                    }
                }
            )
        }
    };

    const onNotIssued = () => {
        if (!data[0]?.remarks) {
            toast.error("Please Enter Remarks")
        } else {
            addUpdateCheque(userData?.CORE_LGD, data[0]?.chequeBookId, data[0]?.accountCode,
                data[0]?.chequeBookNo, "N",
                cheque,
                data[0]?.remarks,
                (r) => {
                    console.log(r, "dd");
                    if (r.status == 0) {
                        setData([]);
                        setBank("");
                        setCheque("");

                        toast.success(r.message);

                    } else if (r.status == 1) {
                        toast.error(r.message);
                    }
                }
            )
        }
    };

    // const { data: finInstitution } = useQuery({
    //     queryKey: ["finInstitution"],
    //     queryFn: async () => {
    //         const data = await fetch.get(`/RealAccount/GetRealAccountWithNumber?lgdCode=${userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : 0 || userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : 0 || userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0}`);
    //         return data?.data;
    //     },
    // });

    const onBank = (e) => {
        setBank(e.target.value)
    }

    const onChequeNo = (e) => {
        setCheque(e.target.value)
    }

    return (
        <>
            <ToastContainer />


            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Cheque Status Update</legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full space-y-2">
                        <div className="flex items-center gap-4 ">
                            {/* Group ID */}

                            <div className="w-1/7">

                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Bank / Treasury <span className="text-red-500 "> * </span>

                                </label>
                                <select
                                    className="mt-1 p-2 block border border-gray-300 rounded-md"
                                    onChange={onBank}
                                    value={bank}
                                >
                                    <option value="">--Select Bank Account--</option>
                                    {finInstitution?.map((d) => (
                                        <option value={d?.accountCode}>
                                            {d?.accountCodeDesc}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            <div className="w-1/1 px-2">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Enter Cheque No <span className="text-red-500 "> * </span>

                                </label>
                                <input
                                    id="cheque"
                                    name="cheque"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Enter Cheque No"
                                    className="mt-1 p-2 block border border-gray-300 rounded-md"
                                    onChange={onChequeNo}
                                    value={cheque}
                                />



                            </div>
                            <div className="w-1/4">
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
                                <th className="border border-gray-300 p-1">Cheque Book No</th>
                                <th className="border border-gray-300 p-1">Account</th>
                                <th className="border border-gray-300 p-1">Name of Bank/Try</th>
                                <th className="border border-gray-300 p-1">Branch Name</th>
                                <th className="border border-gray-300 p-1">Account No</th>
                                <th className="border border-gray-300 p-1">Issued Status</th>
                                <th className="border border-gray-300 p-1">Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr
                                    key={index}
                                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                                >
                                    <td className="border border-gray-300 text-sm p-1">{row.chequeBookNo}</td>
                                    <td className="border border-gray-300 text-sm p-1">{row.accountCode}</td>
                                    <td className="border border-gray-300 text-sm p-1">{row.bankName}</td>
                                    <td className="border border-gray-300 text-sm p-1">{row.branchName}</td>
                                    <td className="border border-gray-300 text-sm p-1">{row.accountNumber}</td>
                                    <td className="border border-gray-300 text-sm p-1">{row.issuedStatus}</td>
                                    <td className="border border-gray-300 text-sm p-1">
                                        <input
                                            type="text"
                                            value={row.remarks}
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
                    {/* 876901 */}
                    <div className="w-1/2 flex justify-end">
                        {data[0]?.issuedStatus === "Issued" ?
                            <button
                                type="button"
                                className="btn-submit h-10 py-2 px-6 mt-5 shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={onNotIssued}
                            >
                                Not Issued
                            </button> : <button
                                type="button"
                                className="btn-submit h-10 py-2 px-6 mt-5 shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={onIssued}
                            >
                                Issued
                            </button>

                        }
                    </div>


                </> : ""}

            </div>
        </>
    );
};

export default ChequeStatusUpdate;
