import { useState, useEffect, useRef, useMemo } from "react";
import classNames from "classnames";
import { ToastContainer, toast } from "react-toastify";
import { getPartyType } from "../../../Service/TransactionQuery/TransactionQueryService";

const PartyTypeName = () => {
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [PartyType, setPartyType] = useState("");
    const [partyNo, setPartyNo] = useState("");
    const [data, setData] = useState([]);

    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);


    const onPartyType = (e) => {
        setPartyType(e.target.value);
        setData([]);
    }

    const onPartyNo = (e) => {
        setPartyNo(e.target.value)
    }

    const onSearch = () => {
        if (!fromDate) {
            toast.error("Please select from date");
        } else if (!toDate) {
            toast.error("Please select to date");
        } else {
            getPartyType(userData.CORE_LGD, fromDate, toDate, PartyType ? PartyType : 0, partyNo ? partyNo : 0)
                .then((res) => {
                    setData(res?.data)
                    if (res?.data?.statusCode == 1) {
                        toast.error(res?.data?.statusMsg)
                    }
                })
                .catch((err) => {
                    console.log(err, "err");
                });

        }
    }


    return (
        <>

            <ToastContainer />


            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Party Type & Name</legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full space-y-2">
                        <div className="flex items-center gap-4 ">
                            {/* Group ID */}
                            <div className="flex-1">
                                <label
                                    htmlFor="financial_institute"
                                    className="block text-sm font-medium text-gray-700 "
                                >
                                    Party Type
                                </label>
                                <select
                                    id="financial_institute"
                                    name="financial_institute"
                                    autoComplete="off"
                                    className="text-sm mt-1 p-2 block w-full border border-gray-300 rounded-md h-9"
                                    onChange={onPartyType}
                                    value={PartyType}

                                >
                                    <option value="">--Select Party Type--</option>
                                    <option value="N">None</option>
                                    <option value="C">Contractor</option>
                                    <option value="E">Employee</option>
                                    <option value="J">Job Worker</option>
                                    <option value="D">Department</option>
                                    <option value="L">LSG</option>
                                    <option value="B">Benificiary</option>
                                    <option value="O">Others</option>




                                    {/* {EntityListDropDown} */}
                                </select>
                            </div>
                            <div className="flex-1">
                                <label
                                    htmlFor="financial_institute"
                                    className="block text-sm font-medium text-gray-700 "
                                >
                                    Party Params
                                </label>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Party Params"
                                    className="text-sm mt-1 p-2 block w-full border border-gray-300 rounded-md h-9"
                                    onChange={onPartyNo}
                                />

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
                                    onChange={(e) => { setFromDate(e.target.value) }}
                                    className="text-sm h-9 mt-1 p-2 block w-full border border-gray-300 rounded-md"

                                />
                            </div>

                            {/* Branch IFSC */}
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
                                    onChange={(e) => { setToDate(e.target.value) }}
                                />
                            </div>


                            <div className="flex-1">
                                <button
                                    style={{ marginTop: "22px" }}
                                    type="button"
                                    className={classNames(
                                        "py-2 px-6 border border-transparent rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500",

                                    )}
                                    onClick={onSearch}
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
                {data?.length > 0 ?
                    <div className="p-4">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-cyan-500 text-sm">
                                    <th className="border p-2">Voucher ID</th>
                                    <th className="border p-2">Voucher Date</th>
                                    <th className="border p-2">Voucher Desc</th>
                                    <th className="border p-2">Voucher Amount</th>
                                    <th className="border p-2">Party Code</th>
                                    <th className="border p-2">Party Details</th>
                                    <th className="border p-2">Voucher Narration</th>
                        
                                </tr>
                            </thead>
                            <tbody>
                                {data?.map((entry, index) => (
                                    <tr key={index} className="text-right bg-white-200">
                                        <td className="border p-2 text-center text-sm">{entry?.voucherId}</td>
                                        <td className="border p-2 text-center text-sm">{entry?.voucherDate}</td>
                                        <td className="border p-2 text-center text-sm">{entry?.voucherDesc}</td>
                                        <td className="border p-2 text-right text-sm">{entry?.voucherAmount}</td>
                                        <td className="border p-2 text-center text-sm">{entry?.partyCode}</td>
                                        <td className="border p-2 text-center text-sm">{entry?.partyDetails}</td>
                                        <td className="border p-2 text-center text-sm">{entry?.voucherNarration}</td>
                           
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div> :
                    <div className="flex items-center justify-center h-10 bg-gray-100 rounded-lg shadow-md text-gray-700 text-lg font-semibold">
                        No Data Found
                    </div>
                }


            </div>
        </>
    );
};

export default PartyTypeName;
