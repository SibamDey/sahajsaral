import React, { useState, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
// import axios or your http client
import axios from "axios";
import { fetch } from "../../../functions/Fetchfunctions";
import {
    getSearchPaymantCertificate,
} from "../../../Service/Document/DocumentService";

const IssuancePaymentCertificate = () => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [selectedContractorId, setSelectedContractorId] = useState("");
    const [data, setData] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);

    // lgdCode for contractor dropdown
    const lgdCode =
        userData?.USER_LEVEL === "GP"
            ? userData?.GP_LGD
            : userData?.USER_LEVEL === "BLOCK"
                ? userData?.BLOCK_LGD
                : userData?.DIST_LGD;

    // CORE_LGD used in your search API already
    const coreLgd = userData?.CORE_LGD;
    const userIndex = userData?.USER_INDEX; // ⚠️ adjust if key name is different

    const { data: contractorList = [], isLoading, isError } = useQuery({
        queryKey: ["contractorList", lgdCode],
        queryFn: async () => {
            const res = await fetch.get(
                `/Contractor/Get?lgdCode=${lgdCode}&contractorName=0`
            );

            console.log("RAW contractor API response:", res);

            const contractors = Array.isArray(res?.data)
                ? res.data
                : Array.isArray(res)
                    ? res
                    : [];

            return contractors;
        },
        enabled: !!lgdCode,
    });

    const sortedContractors = useMemo(() => {
        if (!Array.isArray(contractorList)) return [];
        return [...contractorList].sort((a, b) =>
            String(a.contractorNm).localeCompare(String(b.contractorNm))
        );
    }, [contractorList]);

    const onSearch = () => {
        if (!fromDate) {
            toast.error("Please select a From Date");
        } else if (!toDate) {
            toast.error("Please select a To Date");
        } else if (!selectedContractorId) {
            toast.error("Please select a Contractor");
        }
        else {
            getSearchPaymantCertificate(
                coreLgd,
                fromDate,
                toDate,
                selectedContractorId
            ).then((response) => {
                if (response.status === 200) {
                    setData(response.data || []);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        }
    };

    // 👉 Submit handler: POST InsertPaymentCertificate and then refresh list
    // 👉 Submit handler: POST InsertPaymentCertificate and then refresh list
    // 👉 Submit handler: POST InsertPaymentCertificate and then reset all
    const onSubmitCertificate = async () => {
        try {
            if (!fromDate || !toDate || !selectedContractorId) {
                toast.error("Please select both From Date and To Date and Contractor");
                return;
            }

            if (!Array.isArray(data) || data.length === 0) {
                toast.error("No records available to submit");
                return;
            }

            // Assuming all rows belong to same party; use first row's partyCode
            const firstRow = data[0];

            const payload = {
                lgdCode: Number(coreLgd || lgdCode),   // from session
                frmdate: fromDate,                    // "YYYY-MM-DD"
                toDate: toDate,                       // "YYYY-MM-DD"
                partyCode: selectedContractorId,      // from dropdown (partyCode)
                userIndex: Number(userIndex),         // from session
            };

            console.log("InsertPaymentCertificate payload:", payload);
            setIsSubmitting(true);

            const res = await axios.post(
                "https://javaapi.wbpms.in/api/PaymentCertificate/InsertPaymentCertificate",
                payload
            );

            if (res?.data?.status == 0) {
                toast.success(res?.data?.message || "Payment Certificate submitted successfully");

                // ✅ RESET EVERYTHING AFTER SUCCESS
                setFromDate("");
                setToDate("");
                setSelectedContractorId("");
                setData([]); // this hides the table

                // ❌ No need to call onSearch() now because we are resetting
                // onSearch();
            } else {
                toast.error(res?.data?.message || "Failed to submit Payment Certificate");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error while submitting Payment Certificate");
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <>
            <ToastContainer />
            <div
                className="bg-white rounded-lg p-2 flex flex-col flex-grow"
                style={{ marginTop: "-40px" }}
            >
                <legend className="text-lg font-semibold text-cyan-700 py-2">
                    Issuance of Payment Certificate
                </legend>

                {/* -------------------- Filters Section -------------------- */}
                <div className="flex flex-col space-y-2 py-2">
                    <div className="flex flex-col w-full mb-4 space-y-2">
                        <div className="flex items-center w-full space-x-4">
                            {/* From Date */}
                            <div className="w-1/4 px-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    From Date<span className="text-red-500"> * </span>
                                </label>
                                <input
                                    type="date"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                            </div>

                            {/* To Date */}
                            <div className="w-1/4 px-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    To Date<span className="text-red-500"> * </span>
                                </label>
                                <input
                                    type="date"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                            </div>

                            {/* Contractor */}
                            <div className="w-1/3 px-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Contractor
                                </label>

                                <select
                                    className="text-sm block w-full p-1 h-9 border border-gray-300"
                                    value={selectedContractorId}
                                    onChange={(e) => setSelectedContractorId(e.target.value)}
                                >
                                    <option value="">--Select Contractor--</option>
                                    {sortedContractors.map((c) => (
                                        <option key={c.contractorId} value={c.contractorId}>
                                            {c.contractorNm}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Search Button */}
                            <div className="w-1/6">
                                <button
                                    type="button"
                                    className="btn-submit h-9 px-2 mt-5 shadow-sm text-white hover:bg-cyan-700"
                                    onClick={onSearch}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* -------------------- RESULT TABLE + SUBMIT -------------------- */}
                {Array.isArray(data) && data.length > 0 && (
                    <>
                        <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full border text-sm">
                                <thead className="bg-cyan-700 text-white">
                                    <tr>
                                        <th className="border px-2 py-1">SL</th>
                                        <th className="border px-2 py-1">Voucher ID</th>
                                        <th className="border px-2 py-1">Voucher Date</th>
                                        <th className="border px-2 py-1">Gross Amount</th>
                                        <th className="border px-2 py-1">Net Amount</th>
                                        <th className="border px-2 py-1">Work Description</th>
                                        <th className="border px-2 py-1">Account Head</th>
                                        <th className="border px-2 py-1">Income Tax</th>
                                        <th className="border px-2 py-1">GST</th>
                                        <th className="border px-2 py-1">Cess</th>
                                        <th className="border px-2 py-1">Security Deposit</th>
                                        <th className="border px-2 py-1">Royalty</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.map((item, index) => (
                                        <tr key={index} className="odd:bg-gray-100">
                                            <td className="border px-2 py-1 text-center">
                                                {index + 1}
                                            </td>
                                            <td className="border px-2 py-1">{item.voucherId}</td>
                                            <td className="border px-2 py-1">{item.voucherDate}</td>
                                            <td className="border px-2 py-1 text-right">
                                                {item.grossAmount}
                                            </td>
                                            <td className="border px-2 py-1 text-right">
                                                {item.netAmount}
                                            </td>
                                            <td className="border px-2 py-1">
                                                {item.workDescription}
                                            </td>
                                            <td className="border px-2 py-1">{item.accountHead}</td>
                                            <td className="border px-2 py-1">{item.incomeTax}</td>
                                            <td className="border px-2 py-1">{item.gst}</td>
                                            <td className="border px-2 py-1">{item.cess}</td>
                                            <td className="border px-2 py-1">
                                                {item.securityDeposit}
                                            </td>
                                            <td className="border px-2 py-1">{item.royalty}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-1 flex justify-center text-center">
                            <button
                                type="button"
                                onClick={onSubmitCertificate}
                                disabled={isSubmitting}
                                className="btn-submit h-9 px-4 shadow-sm text-white hover:bg-cyan-700 disabled:opacity-60"
                            >
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </button>
                        </div>

                    </>
                )}

                {/* No data message */}
                {Array.isArray(data) && data.length === 0 && (
                    <p className="text-center text-gray-500 mt-4">No records found.</p>
                )}
            </div>
        </>
    );
};

export default IssuancePaymentCertificate;
