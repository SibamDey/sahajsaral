import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getPRIName, getVoucherUnverified, getPfpUnverified, getRealAcCode, getOtp, getOtpVerify } from "../../../Service/Administrative/AdministrativeService"; // Adjust the import path as necessary
import { useNavigate } from "react-router-dom";

const UnverifyPassForPayment = () => {
    const [PFPId, setPFPId] = useState("");
    const [PFPData, setPFPData] = useState(null);
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);


    const onPFPUnverified = () => {
        if (!PFPId) {
            toast.error("Please enter the PFP ID");
        } else {
            getPfpUnverified(userData?.CORE_LGD, PFPId,
                (r) => {
                    console.log(r, "dd");
                    if (r.status == 0) {
                        setPFPData(r.message);
                        toast.success(r.message);
                    } else if (r.status == 1) {
                        setPFPData(r.message);
                        toast.error(r.message);
                    }
                }
            )
        }
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
            <ToastContainer />

            <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
                Unverify Pass for Payment - SAHAJ SARAL
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-4">
                <label className="font-medium">PFP to be Unverified:</label>

                {/* New input box */}
                <input
                    type="text"
                    placeholder="LGD CODE"
                    className="border rounded px-2 py-1"
                    value={userData?.CORE_LGD} // Make sure to define setAnotherValue
                />

                {/* PFP ID input */}
                <input
                    type="text"
                    placeholder="PFP ID"
                    className="border rounded px-2 py-1"
                    onChange={(e) => setPFPId(e.target.value)}
                />



                {/* Submit button */}
                <button
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                    onClick={onPFPUnverified}
                >
                    Submit
                </button>

                {/* Status message */}
                {PFPData ? (
                    <div className="md:col-span-4 text-green-700">Status: {PFPData}</div>
                ) : null}
            </div>

        </div>
    );

};

export default UnverifyPassForPayment;
