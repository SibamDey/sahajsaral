import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
    getDistrictList,
    getBlockList,
    getGpList,
} from "../../../Service/Project/ActivityDetailsService";

const API_BASE_URL = "https://javaapi.wbpms.in";

const UPLOAD_DOCUMENT_API =
    `${API_BASE_URL}/api/DocsRepository/UploadSupportedDocument`;

const GET_DOCUMENTS_API =
    `${API_BASE_URL}/api/DocsRepository/GetSupportedDocuments`;

const getSessionUser = () => {
    try {
        return JSON.parse(
            sessionStorage.getItem("SAHAJ_SARAL_USER") || "{}"
        );
    } catch (error) {
        console.error("Unable to read SAHAJ_SARAL_USER", error);
        return {};
    }
};

const getUserIndex = (userData) =>
    Number(
        userData?.USER_INDEX ??
        userData?.userIndex ??
        userData?.USERINDEX ??
        userData?.USER_ID ??
        0
    );

/**
 * Returns the complete PDF data URL required by the upload API:
 * data:application/pdf;base64,JVBERi0x...
 */
const fileToPdfDataUrl = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = String(reader.result || "");
            const rawBase64 = result.includes(",")
                ? result.substring(result.indexOf(",") + 1)
                : result;

            resolve(`data:application/pdf;base64,${rawBase64}`);
        };

        reader.onerror = () => {
            reject(new Error("Unable to read the selected PDF file."));
        };

        reader.readAsDataURL(file);
    });

const parseApiResponse = async (response) => {
    const responseText = await response.text();

    if (!responseText) {
        return null;
    }

    try {
        return JSON.parse(responseText);
    } catch {
        return responseText;
    }
};

const getApiMessage = (payload, fallbackMessage) =>
    payload?.statusMsg ||
    payload?.message ||
    payload?.msg ||
    payload?.error ||
    fallbackMessage;

const normalizeDocumentList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.dtls)) return payload.dtls;
    if (Array.isArray(payload?.data?.dtls)) return payload.data.dtls;
    return [];
};

const buildDocumentUrl = (docFileLink) => {
    const fileLink = String(docFileLink || "").trim();

    if (!fileLink) {
        return "";
    }

    if (/^https?:\/\//i.test(fileLink)) {
        return fileLink;
    }

    return `${API_BASE_URL}/${fileLink.replace(/^\/+/, "")}`;
};

const RectificationDocument = () => {
    const fileInputRef = useRef(null);
    const userData = useMemo(() => getSessionUser(), []);

    const [district, setDistrict] = useState("");
    const [block, setBlock] = useState("");
    const [gp, setGp] = useState("");

    const [districtList, setDistrictList] = useState([]);
    const [blockList, setBlockList] = useState([]);
    const [gpList, setGpList] = useState([]);

    const [docSubject, setDocSubject] = useState("");
    const [remarks, setRemarks] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const [documents, setDocuments] = useState([]);

    const [isDistrictLoading, setIsDistrictLoading] = useState(false);
    const [isBlockLoading, setIsBlockLoading] = useState(false);
    const [isGpLoading, setIsGpLoading] = useState(false);
    const [isDocumentLoading, setIsDocumentLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    /*
     * The last selected location is sent during upload:
     * GP -> Block -> District.
     */
    const selectedLgdCode = useMemo(() => {
        if (gp) return Number(gp);
        if (block) return Number(block);
        if (district) return Number(district);
        return 0;
    }, [district, block, gp]);

    const fetchSupportedDocuments = useCallback(async () => {
        setIsDocumentLoading(true);

        try {
            /*
             * The GET API must always receive lgdCode=0.
             * Therefore, no Search button is required.
             */
            const response = await fetch(
                `${GET_DOCUMENTS_API}?lgdCode=0`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            const payload = await parseApiResponse(response);

            if (!response.ok) {
                throw new Error(
                    getApiMessage(
                        payload,
                        "Failed to fetch supported documents."
                    )
                );
            }

            setDocuments(normalizeDocumentList(payload));
        } catch (error) {
            console.error(error);
            setDocuments([]);
            toast.error(
                error?.message || "Failed to fetch supported documents."
            );
        } finally {
            setIsDocumentLoading(false);
        }
    }, []);

    useEffect(() => {
        const loadDistricts = async () => {
            setIsDistrictLoading(true);

            try {
                const result = await getDistrictList();
                setDistrictList(
                    Array.isArray(result?.data) ? result.data : []
                );
            } catch (error) {
                console.error(error);
                toast.error("Failed to load district list.");
            } finally {
                setIsDistrictLoading(false);
            }
        };

        loadDistricts();
        fetchSupportedDocuments();
    }, [fetchSupportedDocuments]);

    const handleDistrictChange = async (event) => {
        const districtLgd = event.target.value;

        setDistrict(districtLgd);
        setBlock("");
        setGp("");
        setBlockList([]);
        setGpList([]);

        if (!districtLgd) {
            return;
        }

        setIsBlockLoading(true);

        try {
            const result = await getBlockList(districtLgd, 0);
            setBlockList(
                Array.isArray(result?.data) ? result.data : []
            );
        } catch (error) {
            console.error(error);
            toast.error("Failed to load block list.");
        } finally {
            setIsBlockLoading(false);
        }
    };

    const handleBlockChange = async (event) => {
        const blockLgd = event.target.value;

        setBlock(blockLgd);
        setGp("");
        setGpList([]);

        if (!blockLgd) {
            return;
        }

        setIsGpLoading(true);

        try {
            const result = await getGpList(district, blockLgd, 0);
            setGpList(
                Array.isArray(result?.data) ? result.data : []
            );
        } catch (error) {
            console.error(error);
            toast.error("Failed to load Gram Panchayat list.");
        } finally {
            setIsGpLoading(false);
        }
    };

    const handleGpChange = (event) => {
        setGp(event.target.value);
    };

    const resetUploadForm = () => {
        setDocSubject("");
        setRemarks("");
        setSelectedFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0] || null;

        if (!file) {
            setSelectedFile(null);
            return;
        }

        const isPdf =
            file.type === "application/pdf" ||
            file.name.toLowerCase().endsWith(".pdf");

        if (!isPdf) {
            toast.error("Please select a PDF file.");
            event.target.value = "";
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
    };

    const handleUpload = async (event) => {
        event.preventDefault();

        if (!selectedLgdCode) {
            toast.error(
                "Please select a district, block, or Gram Panchayat."
            );
            return;
        }

        if (!docSubject.trim()) {
            toast.error("Please enter the document subject.");
            return;
        }

        if (!selectedFile) {
            toast.error("Please choose a PDF file.");
            return;
        }

        setIsUploading(true);

        try {
            const base64File = await fileToPdfDataUrl(selectedFile);

            const requestBody = {
                lgdCode: selectedLgdCode,
                docSubject: docSubject.trim(),
                base64File,
                remarks: remarks.trim(),
                userIndex: getUserIndex(userData),
            };

            const response = await fetch(UPLOAD_DOCUMENT_API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            const payload = await parseApiResponse(response);

            if (!response.ok) {
                throw new Error(
                    getApiMessage(
                        payload,
                        "Failed to upload the document."
                    )
                );
            }

            toast.success(
                getApiMessage(
                    payload,
                    "Document uploaded successfully."
                )
            );

            resetUploadForm();

            /*
             * Refresh the complete list after upload.
             * GET still always uses lgdCode=0.
             */
            await fetchSupportedDocuments();
        } catch (error) {
            console.error(error);
            toast.error(
                error?.message || "Failed to upload the document."
            );
        } finally {
            setIsUploading(false);
        }
    };

    const handleViewDocument = (document) => {
        const documentUrl = buildDocumentUrl(document?.docFileLink);

        if (!documentUrl) {
            toast.error("Document file link is not available.");
            return;
        }

        window.open(
            documentUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };

    return (
        <div>
            <ToastContainer />

            <div
                className="bg-white rounded-lg p-4 flex flex-col flex-grow shadow-sm"
                style={{ marginTop: "-40px" }}
            >
                <legend className="text-lg font-semibold text-cyan-700 mb-4">
                    Rectification Document
                </legend>

                <form onSubmit={handleUpload}>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <div>
                            <label
                                htmlFor="district"
                                className="block text-sm font-medium text-gray-700"
                            >
                                District{" "}
                                <span className="text-red-500">*</span>
                            </label>

                            <select
                                id="district"
                                value={district}
                                onChange={handleDistrictChange}
                                disabled={isDistrictLoading}
                                className="mt-1 text-sm block w-full p-2 h-10 border border-gray-300 rounded-md disabled:bg-gray-100"
                            >
                                <option value="">
                                    {isDistrictLoading
                                        ? "Loading districts..."
                                        : "Select District"}
                                </option>

                                {districtList.map((item) => (
                                    <option
                                        key={item.DIST_LGD}
                                        value={item.DIST_LGD}
                                    >
                                        {item.DIST_NAME}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="block"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Block
                            </label>

                            <select
                                id="block"
                                value={block}
                                onChange={handleBlockChange}
                                disabled={!district || isBlockLoading}
                                className="mt-1 text-sm block w-full p-2 h-10 border border-gray-300 rounded-md disabled:bg-gray-100"
                            >
                                <option value="">
                                    {isBlockLoading
                                        ? "Loading blocks..."
                                        : "Select Block"}
                                </option>

                                {blockList.map((item) => (
                                    <option
                                        key={item.BlockLgd}
                                        value={item.BlockLgd}
                                    >
                                        {item.BlockName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="gp"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Gram Panchayat
                            </label>

                            <select
                                id="gp"
                                value={gp}
                                onChange={handleGpChange}
                                disabled={!block || isGpLoading}
                                className="mt-1 text-sm block w-full p-2 h-10 border border-gray-300 rounded-md disabled:bg-gray-100"
                            >
                                <option value="">
                                    {isGpLoading
                                        ? "Loading Gram Panchayats..."
                                        : "Select Gram Panchayat"}
                                </option>

                                {gpList.map((item) => (
                                    <option
                                        key={item.GpLgd}
                                        value={item.GpLgd}
                                    >
                                        {item.GpName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="docSubject"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Document Subject{" "}
                                <span className="text-red-500">*</span>
                            </label>

                            <input
                                id="docSubject"
                                type="text"
                                value={docSubject}
                                onChange={(event) =>
                                    setDocSubject(event.target.value)
                                }
                                placeholder="Enter document subject"
                                className="mt-1 text-sm block w-full p-2 h-10 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="supportedFile"
                                className="block text-sm font-medium text-gray-700"
                            >
                                File Upload{" "}
                                <span className="text-red-500">*</span>
                            </label>

                            <input
                                ref={fileInputRef}
                                id="supportedFile"
                                type="file"
                                accept=".pdf,application/pdf"
                                onChange={handleFileChange}
                                className="mt-1 text-sm block w-full h-10 border border-gray-300 rounded-md file:h-full file:border-0 file:px-3 file:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="remarks"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Remarks
                            </label>

                            <input
                                id="remarks"
                                type="text"
                                value={remarks}
                                onChange={(event) =>
                                    setRemarks(event.target.value)
                                }
                                placeholder="Enter remarks"
                                className="mt-1 text-sm block w-full p-2 h-10 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                            type="submit"
                            disabled={isUploading}
                            className="btn-submit min-w-28 h-10 px-4 shadow-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isUploading ? "Uploading..." : "Upload"}
                        </button>

                        <button
                            type="button"
                            onClick={resetUploadForm}
                            disabled={isUploading}
                            className="h-10 min-w-24 rounded-md border border-gray-300 bg-white px-4 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                        >
                            Reset
                        </button>
                    </div>
                </form>

                <div className="mt-6 overflow-hidden rounded-md border border-gray-200">
                    <div className="bg-cyan-600 px-4 py-2 text-sm font-semibold text-white">
                        Uploaded Documents
                    </div>

                    <div className="max-h-[500px] overflow-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="sticky top-0 z-10 bg-gray-100 text-gray-700">
                                <tr>
                                    <th className="px-4 py-2 text-left">
                                        SL No.
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        LGD Name
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Document ID
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Document Subject
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Remarks
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Uploaded On
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Uploaded By
                                    </th>
                                    <th className="px-4 py-2 text-center">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 bg-white">
                                {isDocumentLoading ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-4 py-8 text-center text-gray-500"
                                        >
                                            Loading documents...
                                        </td>
                                    </tr>
                                ) : documents.length > 0 ? (
                                    documents.map((document, index) => (
                                        <tr
                                            key={
                                                document?.docId ||
                                                `${document?.lgdCode}-${index}`
                                            }
                                        >
                                            <td className="px-4 py-2">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-2">
                                                {document?.lgdName || "-"}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2">
                                                {document?.docId || "-"}
                                            </td>
                                            <td className="px-4 py-2">
                                                {document?.docSubject || "-"}
                                            </td>
                                            <td className="px-4 py-2">
                                                {document?.remarks || "-"}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-2">
                                                {document?.uploadDate || "-"}
                                            </td>
                                            <td className="px-4 py-2">
                                                {document?.userName || "-"}
                                            </td>
                                            <td className="px-4 py-2 text-center">
                                                {document?.docFileLink ? (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleViewDocument(
                                                                document
                                                            )
                                                        }
                                                        className="rounded bg-cyan-600 px-3 py-1 text-white hover:bg-cyan-700"
                                                    >
                                                        View
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-4 py-8 text-center text-gray-500"
                                        >
                                            No uploaded documents found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RectificationDocument;