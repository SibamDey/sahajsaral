import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const UploadBRS = () => {
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = jsonString ? JSON.parse(jsonString) : null;

    const [financialYears, setFinancialYears] = useState([]);
    const [currentFinancialYear, setCurrentFinancialYear] = useState("");
    const [loadingFy, setLoadingFy] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);
    const [base64Pdf, setBase64Pdf] = useState("");
    const [uploading, setUploading] = useState(false);

    const [brsList, setBrsList] = useState([]);
    const [loadingList, setLoadingList] = useState(false);

    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [updateRowData, setUpdateRowData] = useState(null);

    const getDocumentUrl = (path) => {
        if (!path) return "#";
        if (String(path).startsWith("http")) return path;
        return `https://javaapi.wbpms.in/${path}`;
    };

    const parseUploadDate = (uploadDate) => {
        if (!uploadDate) return null;

        const parts = String(uploadDate).trim().split(" ");
        if (parts.length < 3) return null;

        const [datePart, timePart, amPm] = parts;
        const [day, month, year] = datePart.split(".").map(Number);
        let [hour, minute, second] = timePart.split(":").map(Number);

        if (!day || !month || !year || Number.isNaN(hour)) return null;

        const meridian = String(amPm).toUpperCase();

        if (meridian === "PM" && hour !== 12) hour += 12;
        if (meridian === "AM" && hour === 12) hour = 0;

        return new Date(year, month - 1, day, hour, minute || 0, second || 0);
    };

    const canShowUpdateButton = (uploadDate) => {
        const uploadedTime = parseUploadDate(uploadDate);

        if (!uploadedTime) return false;

        const currentTime = new Date();
        const diffInMs = currentTime.getTime() - uploadedTime.getTime();
        const twelveHoursInMs = 12 * 60 * 60 * 1000;

        return diffInMs >= 0 && diffInMs <= twelveHoursInMs;
    };

    const fetchBRSList = async (finYearValue = "0") => {
        if (!userData?.CORE_LGD) return;

        try {
            setLoadingList(true);

            const response = await axios.get(
                "https://javaapi.wbpms.in/api/AuditFile/GetBRS",
                {
                    params: {
                        lgdCode: userData?.CORE_LGD,
                        finYear: finYearValue || "0",
                    },
                }
            );

            setBrsList(Array.isArray(response?.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching BRS list:", error);
            setBrsList([]);
            toast.error("Failed to load BRS list");
        } finally {
            setLoadingList(false);
        }
    };

    const getCurrentFinancialYear = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;

        const startYear = month >= 4 ? year : year - 1;
        const endYear = startYear + 1;

        return `${startYear}-${endYear}`;
    };


    useEffect(() => {
        const fetchFinancialYears = async () => {
            if (!userData?.CORE_LGD) return;

            try {
                setLoadingFy(true);

                const response = await axios.get(
                    `https://javaapi.wbpms.in/api/MonthClose/FinYear?lgdCode=${userData?.CORE_LGD}`
                );

                if (response?.data?.finYears && Array.isArray(response.data.finYears)) {
                    const currentFy = getCurrentFinancialYear();

                    const filteredFinancialYears = response.data.finYears.filter(
                        (item) => String(item?.finYear) !== String(currentFy)
                    );

                    setFinancialYears(filteredFinancialYears);

                    if (filteredFinancialYears.length > 0) {
                        setCurrentFinancialYear(filteredFinancialYears[0].finYear);
                    } else {
                        setCurrentFinancialYear("");
                    }
                }
            } catch (error) {
                console.error("Error fetching financial years:", error);
                toast.error("Failed to load financial years");
            } finally {
                setLoadingFy(false);
            }
        };

        fetchFinancialYears();
    }, [userData?.CORE_LGD]);

    useEffect(() => {
        if (userData?.CORE_LGD) {
            fetchBRSList("0");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userData?.CORE_LGD]);

    const onFinancialYearChange = (e) => {
        setCurrentFinancialYear(e.target.value);

        if (isUpdateMode) {
            setIsUpdateMode(false);
            setUpdateRowData(null);
            setSelectedFile(null);
            setBase64Pdf("");

            const fileInput = document.getElementById("brsPdf");
            if (fileInput) fileInput.value = "";
        }
    };

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                const result = reader.result;
                const base64Only = result.split(",")[1];
                resolve(base64Only);
            };

            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsDataURL(file);
        });
    };

    const onPdfUpload = async (e) => {
        const file = e.target.files[0];

        setSelectedFile(null);
        setBase64Pdf("");

        if (!file) return;

        if (file.type !== "application/pdf") {
            toast.error("Only PDF file is allowed");
            e.target.value = "";
            return;
        }

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            toast.error("PDF size must be maximum 5 MB");
            e.target.value = "";
            return;
        }

        try {
            const base64 = await convertFileToBase64(file);
            setSelectedFile(file);
            setBase64Pdf(base64);
        } catch (error) {
            console.error("Error converting PDF to base64:", error);
            toast.error("Failed to read PDF file");
            e.target.value = "";
        }
    };

    const resetUploadFields = () => {
        setSelectedFile(null);
        setBase64Pdf("");
        setIsUpdateMode(false);
        setUpdateRowData(null);

        const fileInput = document.getElementById("brsPdf");
        if (fileInput) fileInput.value = "";
    };

    const onUploadBRS = async () => {
        if (!userData?.CORE_LGD) {
            toast.error("LGD code not found in session");
            return;
        }

        if (!currentFinancialYear) {
            toast.error("Please select financial year");
            return;
        }

        if (!base64Pdf) {
            toast.error("Please upload PDF file");
            return;
        }

        const payload = {
            lgdCode: Number(userData?.CORE_LGD),
            finYear: currentFinancialYear,
            base64Pdf: base64Pdf,
        };

        try {
            setUploading(true);

            const response = await axios.post(
                "https://javaapi.wbpms.in/api/AuditFile/UploadBRS",
                payload
            );

            if (response?.data?.statusCode === 1) {
                toast.error(response?.data?.message || "Failed to upload BRS");
                return;
            }

            toast.success(
                response?.data?.message ||
                (isUpdateMode ? "BRS updated successfully" : "BRS uploaded successfully")
            );

            const uploadedFinYear = currentFinancialYear;

            resetUploadFields();
            fetchBRSList(uploadedFinYear);
        } catch (error) {
            console.error("Error uploading BRS:", error);
            toast.error(error?.response?.data?.message || "Failed to upload BRS");
        } finally {
            setUploading(false);
        }
    };

    const onSearchBRSList = () => {
        if (!currentFinancialYear) {
            toast.error("Please select financial year");
            return;
        }

        fetchBRSList(currentFinancialYear);
    };

    const onResetSearch = () => {
        resetUploadFields();
        fetchBRSList("0");
    };

    const brsFormatPdfUrl = `https://wbpms.in/SahajSaral/CombinedBRSFormats.pdf`;

    const onUpdateClick = (item) => {
        if (!canShowUpdateButton(item?.uploadDate)) {
            toast.error("Update time expired. You can update only within 12 hours from upload time.");
            return;
        }

        setIsUpdateMode(true);
        setUpdateRowData(item);

        // Do not reset financial year if item.finYear is missing
        setCurrentFinancialYear(item?.finYear || currentFinancialYear);

        setSelectedFile(null);
        setBase64Pdf("");

        const fileInput = document.getElementById("brsPdf");
        if (fileInput) fileInput.value = "";

        toast.info("Please choose a new PDF file, then click Update.");
    };

    const onCancelUpdate = () => {
        resetUploadFields();
    };

    const getDocumentPath = (item) => {
        return (
            item?.brsDocs ||
            item?.statementDocs ||
            item?.documentPath ||
            item?.docPath ||
            item?.filePath ||
            item?.pdfPath ||
            ""
        );
    };

    return (
        <>
            <ToastContainer />

            <div
                className="bg-white rounded-lg p-2 flex flex-col flex-grow"
                style={{ marginTop: "-40px" }}
            >
                <legend className="text-lg font-semibold text-cyan-700">
                    Combined Bank BRS
                </legend>
                {userData?.ROLE === "9" ? "" : <>
                    <div className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="rounded-md border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-800">
                            <span className="font-semibold">Important:</span> Update option is available only within 12 hours from upload time. After 12 hours, the Update button will hide automatically.
                            <br></br><span className="font-semibold">Important:</span> Uploaded Report must be signed by competent authority.
                        </div>

                        <div className="rounded-md border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                            <span className="font-semibold">Important:</span> User must close the month of March for the current financial year before uploading BRS.
                        </div>
                    </div>

                    {isUpdateMode && (
                        <div className="mb-3 rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800">
                            Update mode enabled for Financial Year:{" "}
                            <span className="font-semibold">{updateRowData?.finYear}</span>.
                            Choose a new PDF and click Update.
                        </div>
                    )}

                    <div className="flex flex-col space-y-2 py-1">
                        <div className="flex flex-col w-full space-y-2">
                            <div className="flex items-end gap-4 bg-white border border-gray-200 rounded-md p-4 shadow-sm">
                                <div className="flex flex-col w-1/5">
                                    <label
                                        htmlFor="financialYear"
                                        className="text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Financial Year <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="financialYear"
                                        value={currentFinancialYear}
                                        onChange={onFinancialYearChange}
                                        disabled={isUpdateMode}
                                        className="text-sm w-full h-10 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:bg-gray-100"
                                    >
                                        <option value="">
                                            {loadingFy ? "Loading..." : "--Select Financial Year--"}
                                        </option>

                                        {financialYears.map((item, index) => (
                                            <option key={index} value={item.finYear}>
                                                {item.finYear}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col w-1/4">
                                    <label
                                        htmlFor="brsPdf"
                                        className="text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Upload PDF (MAX 5 MB) <span className="text-red-500">*</span>
                                    </label>

                                    <div className="relative h-10 border border-gray-300 rounded-md overflow-hidden bg-white flex items-center">
                                        <label
                                            htmlFor="brsPdf"
                                            className="h-full px-4 bg-slate-800 text-white text-sm font-medium flex items-center cursor-pointer hover:bg-slate-700"
                                        >
                                            Choose File
                                        </label>

                                        <span className="px-3 text-sm text-gray-700 truncate flex-1">
                                            {selectedFile ? selectedFile.name : "No file selected"}
                                        </span>

                                        <input
                                            id="brsPdf"
                                            type="file"
                                            accept="application/pdf"
                                            onChange={onPdfUpload}
                                            className="hidden"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-end gap-2">
                                    <button
                                        type="button"
                                        disabled={uploading}
                                        className={`h-10 px-4 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 ${isUpdateMode
                                            ? "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
                                            : "bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500"
                                            }`}
                                        onClick={onUploadBRS}
                                    >
                                        {uploading ? (isUpdateMode ? "Updating..." : "Uploading...") : (isUpdateMode ? "Update" : "Upload")}
                                    </button>

                                    {isUpdateMode && (
                                        <button
                                            type="button"
                                            disabled={uploading}
                                            className="h-10 px-3 rounded-md bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 focus:outline-none disabled:opacity-60"
                                            onClick={onCancelUpdate}
                                        >
                                            Cancel
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        disabled={loadingList || isUpdateMode}
                                        className="h-10 px-3 rounded-md bg-slate-700 text-white font-medium hover:bg-slate-800 focus:outline-none disabled:opacity-60"
                                        onClick={onSearchBRSList}
                                    >
                                        {loadingList ? "Searching..." : "Search"}
                                    </button>

                                    <button
                                        type="button"
                                        disabled={loadingList}
                                        className="h-10 px-3 rounded-md bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 focus:outline-none disabled:opacity-60"
                                        onClick={onResetSearch}
                                    >
                                        Reset
                                    </button>

                                    <a
                                        href={brsFormatPdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-10 px-3 rounded-md bg-emerald-600 text-white font-medium hover:bg-emerald-700 focus:outline-none flex items-center justify-center"
                                    >
                                        Download Template
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                </>}

                <div className="mt-4 bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
                    <div className="flex justify-between items-center px-4 py-2 bg-cyan-50 border-b border-gray-200">
                        <h2 className="text-sm font-semibold text-cyan-800">
                            Uploaded Combined Bank BRS List
                        </h2>
                        {loadingList && (
                            <span className="text-xs text-gray-500">Loading...</span>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left border-collapse">
                            <thead className="bg-cyan-400 text-gray-900">
                                <tr>
                                    <th className="border border-gray-300 px-2 py-2 whitespace-nowrap">
                                        Sl No
                                    </th>
                                    <th className="border border-gray-300 px-2 py-2 whitespace-nowrap">
                                        Financial Year
                                    </th>
                                    <th className="border border-gray-300 px-2 py-2 whitespace-nowrap">
                                        Upload Date
                                    </th>
                                    <th className="border border-gray-300 px-2 py-2 text-center whitespace-nowrap">
                                        Document
                                    </th>
                                    {userData?.ROLE === "9" ? "" :
                                        <th className="border border-gray-300 px-2 py-2 text-center whitespace-nowrap">
                                            Action
                                        </th>
                                    }
                                </tr>
                            </thead>

                            <tbody>
                                {brsList.length > 0 ? (
                                    brsList.map((item, index) => {
                                        const documentPath = getDocumentPath(item);

                                        return (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="border border-gray-300 px-2 py-2">
                                                    {index + 1}
                                                </td>
                                                <td className="border border-gray-300 px-2 py-2">
                                                    {item?.finYear}
                                                </td>
                                                <td className="border border-gray-300 px-2 py-2">
                                                    {item?.uploadDate}
                                                </td>
                                                <td className="border border-gray-300 px-2 py-2 text-center">
                                                    {documentPath ? (
                                                        <a
                                                            href={getDocumentUrl(documentPath)}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-cyan-700 hover:underline font-medium"
                                                        >
                                                            View
                                                        </a>
                                                    ) : (
                                                        "-"
                                                    )}
                                                </td>
                                                {userData?.ROLE === "9" ? "" :
                                                    <td className="border border-gray-300 px-2 py-2 text-center">
                                                        {canShowUpdateButton(item?.uploadDate) ? (
                                                            <button
                                                                type="button"
                                                                className="px-3 py-1 rounded bg-amber-500 text-white text-xs font-medium hover:bg-amber-600"
                                                                onClick={() => onUpdateClick(item)}
                                                            >
                                                                Update
                                                            </button>
                                                        ) : (
                                                            "-"
                                                        )}
                                                    </td>
                                                }
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="border border-gray-300 px-2 py-6 text-center text-gray-500"
                                        >
                                            {loadingList ? "Loading..." : "No Data Found"}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UploadBRS;
