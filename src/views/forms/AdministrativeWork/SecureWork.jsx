import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getPRIName, getVoucherUnverified, getPfpUnverified, getRealAcCode, getOtp, getOtpVerify } from "../../../Service/Administrative/AdministrativeService"; // Adjust the import path as necessary
import { useNavigate } from "react-router-dom";

const SecureWork = () => {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [phoneNumberFlag, setPhoneNumberFlag] = useState(false);

    const handleSendOtp = () => {
        if (!phoneNumber) {
            toast.error("Please enter your mobile number");
        } else if (phoneNumber.length !== 10) {
            toast.error("Please enter a valid mobile number");
        } else {
            getOtp(phoneNumber,
                (r) => {
                    console.log(r, "dd");
                    if (r.statusCode == 0) {
                        setPhoneNumberFlag(true);
                        toast.success(r.message);
                    } else if (r.statusCode == 1) {
                        toast.error(r.message);
                    }
                }
            )

        }
    }

    const handleVerify = () => {
        // In a real app, add OTP validation here
        if (!phoneNumber) {
            toast.error("Please enter your mobile number");
        } else if (!otp) {
            toast.error("Please enter the OTP");
        } else {
            getOtpVerify(phoneNumber, otp,
                (r) => {
                    console.log(r, "dd");
                    if (r.statusCode == 0) {
                        navigate("/administrative-secure-work");
                        toast.success(r.message);
                    } else if (r.statusCode == 1) {
                        toast.error(r.message);
                    }
                }
            )
        }
    };

    const handleClose = () => {
        navigate("/dashboard")
    }




    return (

        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm">
                <h2 className="text-xl font-semibold mb-4 text-center">OTP Verification</h2>
                <input
                    type="number"
                    placeholder="Enter Mobile Number"
                    className="w-full border rounded px-3 py-2 mb-3"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                {phoneNumberFlag ?
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        className="w-full border rounded px-3 py-2 mb-3"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    /> : ""}
                {phoneNumberFlag ?
                    <button
                        onClick={handleVerify}
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                    >
                        Verify
                    </button>
                    :
                    <button
                        onClick={handleSendOtp}
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                    >
                        Send OTP
                    </button>
                }
                <button
                    onClick={handleClose}
                    className="w-full bg-red-600 text-white py-2 mt-2 rounded hover:bg-red-700"
                >
                    Close
                </button>
            </div>
        </div>

    );

};

export default SecureWork;
