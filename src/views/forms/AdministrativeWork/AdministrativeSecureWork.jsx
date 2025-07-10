import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { getPRIName, getVoucherUnverified, getPfpUnverified, getRealAcCode, getOtp, getOtpVerify, getMonthOpen } from "../../../Service/Administrative/AdministrativeService"; // Adjust the import path as necessary
import { useNavigate } from "react-router-dom";

const AdministrativeSecureWork = () => {
    const [lgd, setLgd] = useState("");
    const [month, setMonth] = useState("");
    const [monthData, setMonthData] = useState(null);
    const [lgdData, setLGDData] = useState(null);
    const [voucherId, setVoucherId] = useState("");
    const [voucherData, setVoucherData] = useState(null);
    const [PFPId, setPFPId] = useState("");
    const [PFPData, setPFPData] = useState(null);
    const [acCode, setAcCode] = useState("");
    const [currentBalance, setCurrentBalance] = useState(null);
    const [realAcData, setRealAcData] = useState(null);
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const onLgdSubmit = () => {
        if (!lgd) {
            toast.error("Please enter the LGD code");
        } else {
            getPRIName(lgd).then((response) => {
                if (response.status === 200) {
                    setLGDData(response.data);
                    toast.success("LGD code verified successfully");
                } else {
                    toast.error("Failed to verify LGD code");
                }
            })
        }
    }

    const onUnverifiedVoucher = () => {
        if (!lgd) {
            toast.error("Please enter the LGD code");
        } else if (!voucherId) {
            toast.error("Please enter the voucher ID");
        } else {
            getVoucherUnverified(lgd, voucherId,
                (r) => {
                    console.log(r, "dd");
                    if (r.status == 0) {
                        setVoucherData(r.message);
                        toast.success(r.message);
                    } else if (r.status == 1) {
                        setVoucherData(r.message);
                        toast.error(r.message);
                    }
                }
            )
        }
    }

    const onPFPUnverified = () => {
        if (!lgd) {
            toast.error("Please enter the LGD code");
        } else if (!PFPId) {
            toast.error("Please enter the PFP ID");
        } else {
            getPfpUnverified(lgd, PFPId,
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

    const onMonthOpen = () => {
        if (!lgd) {
            toast.error("Please enter the LGD code");
        } else if (!month) {
            toast.error("Please select the month");
        } else {
            getMonthOpen(lgd, month,
                (r) => {
                    console.log(r, "dd");
                    if (r.status == 0) {
                        setMonthData(r.message);
                        toast.success(r.message);
                    } else if (r.status == 1) {
                        setMonthData(r.message);
                        toast.error(r.message);
                    }
                }
            )
        }
    }


const onRealAc = () => {
    if (!lgd) {
        toast.error("Please enter the LGD code");
    } else if (!acCode) {
        toast.error("Please enter the Real A/C code");
    } else if (!currentBalance) {
        toast.error("Please enter the current balance");
    } else {
        getRealAcCode(lgd, acCode, currentBalance,
            (r) => {
                console.log(r, "dd");
                if (r.status == 0) {
                    setRealAcData(r.message);
                    toast.success(r.message);
                } else if (r.status == 1) {
                    setRealAcData(r.message);
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
            SYSTEM ADMINISTRATOR - SAHAJ SARAL
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4">
            <label className="font-medium">LGD Code:</label>
            <input type="number" placeholder="LGD" className="border rounded px-2 py-1 col-span-1" onChange={(e) => setLgd(e.target.value)} />
            <button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600" onClick={onLgdSubmit}>Submit</button>
            {lgdData ? <div className="md:col-span-3 text-blue-800">Status: {lgdData?.priName}</div> : ""}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4">
            <label className="font-medium">Voucher to be Unverified:</label>
            <input type="text" placeholder="Voucher ID" className="border rounded px-2 py-1 col-span-1" onChange={(e) => setVoucherId(e.target.value)} />
            <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600" onClick={onUnverifiedVoucher}>Submit</button>
            {voucherData ? <div className="md:col-span-3 text-blue-700">Status: {voucherData}</div> : ""}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4">
            <label className="font-medium">PFP to be Unverified:</label>
            <input type="text" placeholder="PFP ID" className="border rounded px-2 py-1 col-span-1" onChange={(e) => setPFPId(e.target.value)} />
            <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600" onClick={onPFPUnverified}>Submit</button>
            {PFPData ? <div className="md:col-span-3 text-green-700">Status: {PFPData}</div> : ""}
        </div>
        {/* month open */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4">
            <label className="font-medium">Month Open:</label>
            <select className="border rounded px-2 py-1 col-span-1" onChange={(e) => setMonth(e.target.value)}>
                <option value="">Select Month</option>
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
            </select>

            <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600" onClick={onMonthOpen}>Submit</button>
            {monthData ? <div className="md:col-span-3 text-green-700">Status: {monthData}</div> : ""}
        </div>

        {/* {userData?.USER_INDEX === 20546 ? <> */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <label className="font-medium">Current Balance to updated:</label>
            <input type="text" placeholder="Real A/C Code" className="border rounded px-2 py-1" onChange={(e) => setAcCode(e.target.value)} />
            <input type="text" placeholder="Amount" className="border rounded px-2 py-1" onChange={(e) => setCurrentBalance(e.target.value)} />
            <button className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600" onClick={onRealAc}>Submit</button>
            {realAcData ? <div className="md:col-span-4 text-yellow-700">Status: {realAcData}</div> : ""}
        </div>
        {/* </> : ""} */}
    </div>
);

};

export default AdministrativeSecureWork;
