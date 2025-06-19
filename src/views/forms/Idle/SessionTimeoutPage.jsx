import React from "react";
import { useNavigate } from "react-router-dom";

const SessionTimeoutPage = () => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        // Clear session data
        sessionStorage.removeItem("SAHAJ_SARAL_USER");

        // Open external login page in new tab
        window.open("https://wbpms.in/login", "_blank");

        // Optionally close current tab (only works if tab was opened via script)
        setTimeout(() => {
            window.close();
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
                <h1 className="text-3xl font-bold text-red-600 mb-4">⚠ Session Expired</h1>
                <p className="text-gray-700 mb-6">
                    You have been automatically logged out due to inactivity.<br />
                    Please log in again to continue.
                </p>
                <button
                    onClick={handleRedirect}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
};

export default SessionTimeoutPage;
