import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import {
    getDistrictListforEvent,
    getBlockList,
    getGpList,
} from "../../../Service/Project/ActivityDetailsService";

const ClosingBalance2425 = () => {
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);

    const [district, setDistrict] = useState("0");
    const [block, setBlock] = useState("0");
    const [gp, setGp] = useState("0");

    const [getDistrictDataList, setDistrictDataList] = useState([]);
    const [getBlockDataList, setBlockDataList] = useState([]);
    const [getGpDataList, setGpDataList] = useState([]);

    useEffect(() => {
        const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
        const data = JSON.parse(jsonString);

        const distDefault =
            data?.USER_LEVEL === "DIST" || data?.USER_LEVEL === "BLOCK" || data?.USER_LEVEL === "GP"
                ? String(data?.DIST_LGD || "0")
                : "0";

        const blockDefault =
            data?.USER_LEVEL === "BLOCK" || data?.USER_LEVEL === "GP"
                ? String(data?.BLOCK_LGD || "0")
                : "0";

        const gpDefault =
            data?.USER_LEVEL === "GP"
                ? String(data?.GP_LGD || "0")
                : "0";

        getDistrictListforEvent(distDefault === "0" ? 0 : distDefault).then((result) => {
            setDistrictDataList(result?.data || []);
            setDistrict(distDefault);
        });

        getBlockList(distDefault === "0" ? 0 : distDefault, blockDefault === "0" ? 0 : blockDefault).then((result) => {
            setBlockDataList(result?.data || []);
            setBlock(blockDefault);
        });

        getGpList(
            distDefault === "0" ? 0 : distDefault,
            blockDefault === "0" ? 0 : blockDefault,
            gpDefault === "0" ? 0 : gpDefault
        ).then((result) => {
            setGpDataList(result?.data || []);
            setGp(gpDefault);
        });
    }, []);

    const onDistrict = (e) => {
        const dist = e.target.value;
        setDistrict(dist);
        setBlock("0");
        setGp("0");

        getBlockList(dist, 0).then((result) => setBlockDataList(result?.data || []));
        setGpDataList([]);
    };

    const onBlock = (e) => {
        const bl = e.target.value;
        setBlock(bl);
        setGp("0");

        getGpList(district && district !== "0" ? district : userData?.DIST_LGD, bl, 0).then((result) =>
            setGpDataList(result?.data || [])
        );
    };

    const onGp = (e) => {
        setGp(e.target.value);
    };

    // ✅ last selected LGD (priority: GP > Block > District)
    const selectedLgd = gp && gp !== "0" ? gp : block && block !== "0" ? block : district && district !== "0" ? district : "";

    const openPrevYearPdf = () => {
        if (!selectedLgd) {
            toast.error("Please select District / Block / Gram Panchayat first.");
            return;
        }

        const url = `https://javaapi.wbpms.in/PrevYrDocs/${selectedLgd}.pdf`;

        // Open in new tab
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <>
            <ToastContainer />
            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Closing Balance 2024-2025</legend>

                <div className="flex flex-col space-y-2 py-3">
                    <div className="flex items-center space-x-4">
                        {/* District */}
                        <div className="w-1/3">
                            <label className="block text-sm font-medium text-gray-700">District</label>
                            <select
                                className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
                                value={district}
                                onChange={onDistrict}
                            >
                                {!(userData?.USER_LEVEL === "DIST" || userData?.USER_LEVEL === "BLOCK" || userData?.USER_LEVEL === "GP") && (
                                    <option value="0">Select District</option>
                                )}
                                {getDistrictDataList.map((distRow) => (
                                    <option key={distRow.DistLgd} value={distRow.DistLgd}>
                                        {distRow.DistName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Block */}
                        <div className="w-1/3">
                            <label className="block text-sm font-medium text-gray-700">Block</label>
                            <select
                                className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
                                onChange={onBlock}
                                value={block}
                            >
                                {!(userData?.USER_LEVEL === "BLOCK" || userData?.USER_LEVEL === "GP") && (
                                    <option value="0">Select Block</option>
                                )}
                                {getBlockDataList.map((blRow) => (
                                    <option key={blRow.BlockLgd} value={blRow.BlockLgd}>
                                        {blRow.BlockName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* GP */}
                        <div className="w-1/3">
                            <label className="block text-sm font-medium text-gray-700 ">Gram Panchayat</label>
                            <select
                                className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
                                onChange={onGp}
                                value={gp}
                            >
                                {userData?.USER_LEVEL !== "GP" && <option value="0">Select Gram Panchayat</option>}
                                {getGpDataList.map((gpRow) => (
                                    <option key={gpRow.GPLgd} value={gpRow.GPLgd}>
                                        {gpRow.GPName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-1/3 mt-4">
                            <button
                                type="button"
                                onClick={openPrevYearPdf}
                                className="px-4 py-2 rounded-md bg-cyan-700 text-white text-sm font-semibold hover:bg-cyan-800"
                            >
                                View Previous Year PDF
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </>
    );
};

export default ClosingBalance2425;
