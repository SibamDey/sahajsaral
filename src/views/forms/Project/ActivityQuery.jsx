import { useState, useEffect, useRef, useMemo } from "react";
import { useReactToPrint } from "react-to-print";
import { getDistrictListforEvent, getBlockList, getGpList, getParabaithakActivity } from "../../../Service/Project/ActivityDetailsService";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";
import { getAllScheme, getPlanYear, getAllComponent, getAllUpaSamity, getAllSector, getFocusAreaMgnrega, getFocusArea, getCategoryMgnrega, getCategory, getSDGCategory, getDetailsReport, getActivitySummaryReport, getActivityListReport } from "../../../Service/Project/ActivityDetailsService";
const ActivityQuery = () => {
    const printRef = useRef(null);
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const [district, setDistrict] = useState();
    const [block, setBlock] = useState();
    const [gp, setGp] = useState();
    const [getDistrictDataList, setDistrictDataList] = useState([]);
    const [getBlockDataList, setBlockDataList] = useState([]);
    const [getGpDataList, setGpDataList] = useState([]);
    const [planYear, setPlanYear] = useState([]);
    const [allScheme, setAllScheme] = useState([]);
    const [schemeName, setSchemeName] = useState("");
    const [allComponent, setAllComponent] = useState([]);
    const [component, setComponent] = useState("");
    const [allUpaSamity, setAllUpaSamity] = useState([]);
    const [upaSamity, setUpaSamity] = useState("");
    const [allSector, setAllSector] = useState([]);
    const [sector, setSector] = useState("");
    const [allFocusArea, setAllFocusArea] = useState([]);
    const [focusArea, setFocusArea] = useState("");
    const [allCategory, setAllCategory] = useState([]);
    const [category, setCategory] = useState("");
    const [sdgCategory, setSDGCategory] = useState([]);
    const [sdgId, setSDGId] = useState("");
    const [convergence, setConvergence] = useState("");
    const [status, setStatus] = useState("");
    const [activityName, setActivityName] = useState("");
    const [activityOutput, setActivityOutput] = useState("");
    const [activityIs, setActivityIs] = useState("");
    const [detailsReportList, setDetailsReportList] = useState([]);
    const [selectedPlanYear, setSelectedPlanYear] = useState("");
    const [activitySummaryReportList, setActivitySummaryReportList] = useState([]);
    const [activityListReport, setActivityListReport] = useState([]);


    console.log(activityListReport, "detailsReportList")
    useEffect(() => {
        const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
        const data = JSON.parse(jsonString);

        getDistrictListforEvent(data?.USER_LEVEL == "DIST" || data?.USER_LEVEL == "BLOCK" || data?.USER_LEVEL == "GP" ? data?.DIST_LGD : 0).then(function (result) {
            const response = result?.data;
            console.log(response, "resresres")
            setDistrictDataList(response);
        });

        getBlockList(data?.USER_LEVEL == "DIST" || data?.USER_LEVEL == "BLOCK" || data?.USER_LEVEL == "GP" ? data?.DIST_LGD : 0, data?.USER_LEVEL == "DIST" || data?.USER_LEVEL == "BLOCK" || data?.USER_LEVEL == "GP" ? data?.BLOCK_LGD : 0).then(function (result) {
            const response = result?.data;
            console.log(response, "resresres")
            setBlockDataList(response);
        });

        getGpList(data?.USER_LEVEL == "DIST" || data?.USER_LEVEL == "BLOCK" || data?.USER_LEVEL == "GP" ? data?.DIST_LGD : 0, data?.USER_LEVEL == "DIST" || data?.USER_LEVEL == "BLOCK" || data?.USER_LEVEL == "GP" ? data?.BLOCK_LGD : 0,
            data?.USER_LEVEL == "DIST" || data?.USER_LEVEL == "BLOCK" || data?.USER_LEVEL == "GP" ? data?.GP_LGD : 0,
        ).then(function (result) {
            const response = result?.data;
            console.log(response, "resresres")
            setGpDataList(response);
        });

    }, []);


    const onDetailsReport = () => {
        setActivitySummaryReportList([]);
        setActivityListReport([]);
        if (!selectedPlanYear) {
            toast.error("Please select Plan Year");
        } else if (!activityOutput) {
            toast.error("Please select Activity Output");
            return;
        } else {
            getDetailsReport(district ? district : userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? userData?.DIST_LGD : 0,
                block ? block : userData?.BLOCK_LGD, gp ? gp : userData?.GP_LGD, selectedPlanYear, activityOutput, schemeName ? schemeName : 0, component ? component : 0, focusArea ? focusArea : 0, upaSamity ? upaSamity : 0, sector ? sector : 0, sdgId ? sdgId : 0
                , status ? status : "N", category ? category : 0, activityIs ? activityIs : "N", convergence ? convergence : 0, activityName ? activityName : "N"
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "resresres")
                setDetailsReportList(response);
            });
        }
    }


    const onActivitySummaryReport = () => {
        setActivityListReport([]);
        setDetailsReportList([]);
        if (!selectedPlanYear) {
            toast.error("Please select Plan Year");
        } else if (!activityOutput) {
            toast.error("Please select Activity Output");
            return;
        } else {
            getActivitySummaryReport(district ? district : userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? userData?.DIST_LGD : 0,
                block ? block : userData?.BLOCK_LGD, gp ? gp : userData?.GP_LGD, selectedPlanYear, activityOutput, schemeName ? schemeName : 0, component ? component : 0, focusArea ? focusArea : 0, upaSamity ? upaSamity : 0, sector ? sector : 0, sdgId ? sdgId : 0
                , status ? status : "N", category ? category : 0, activityIs ? activityIs : "N", convergence ? convergence : 0, activityName ? activityName : "N"
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "resresres")
                setActivitySummaryReportList(response);
            });
        }
    }


    const onShowActivityList = () => {
        setActivitySummaryReportList([]);
        setDetailsReportList([]);
        if (!selectedPlanYear) {
            toast.error("Please select Plan Year");
        } else if (!activityOutput) {
            toast.error("Please select Activity Output");
            return;
        } else {
            getActivityListReport(district ? district : userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? userData?.DIST_LGD : 0,
                block ? block : userData?.BLOCK_LGD, gp ? gp : userData?.GP_LGD, selectedPlanYear, activityOutput, schemeName ? schemeName : 0, component ? component : 0, focusArea ? focusArea : 0, upaSamity ? upaSamity : 0, sector ? sector : 0, sdgId ? sdgId : 0
                , status ? status : "N", category ? category : 0, activityIs ? activityIs : "N", convergence ? convergence : 0, activityName ? activityName : "N"
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "resresres")
                setActivityListReport(response);
            });
        }
    }


    useEffect(() => {
        getPlanYear().then(function (result) {
            const response = result?.data;
            setPlanYear(response);
        });

        getAllScheme().then(function (result) {
            const response = result?.data;
            setAllScheme(response);
        });

        getAllUpaSamity().then(function (result) {
            const response = result?.data;
            setAllUpaSamity(response);
        });

        getAllSector().then(function (result) {
            const response = result?.data;
            setAllSector(response);
        });

        getSDGCategory().then(function (result) {
            const response = result?.data;
            setSDGCategory(response);
        });



    }, []); // empty array to run only once

    const onSchemeName = (e) => {
        const schemeName = e.target.value;
        setSchemeName(schemeName);
        getAllComponent(e.target.value).then(function (result) {
            const response = result?.data;
            setAllComponent(response);
        });
        {
            schemeName === "003" ?
                getFocusAreaMgnrega().then(function (result) {
                    const response = result?.data;
                    setAllFocusArea(response);
                })
                :
                getFocusArea().then(function (result) {
                    const response = result?.data;
                    setAllFocusArea(response);
                })
        }


        {
            schemeName === "003" ?
                getCategoryMgnrega().then(function (result) {
                    const response = result?.data;
                    setAllCategory(response);
                })
                :
                getCategory().then(function (result) {
                    const response = result?.data;
                    setAllCategory(response);
                })
        }
    };

    const onDistrict = (e) => {
        setDistrict(e.target.value)
        setBlock('')
        setGp('')
        getBlockList(e.target.value, 0).then(function (result) {
            const response = result?.data;
            console.log(response, "resresres")
            setBlockDataList(response);
        });
    }
    let BlockListDropDown = <option>Loading...</option>;
    if (getBlockDataList && getBlockDataList.length > 0) {
        BlockListDropDown = getBlockDataList.map((blRow, index) => (
            <option value={blRow.BLOCK_LGD}>{blRow.BLOCK_NAME}</option>
        ));
    }

    const onBlock = (e) => {
        setBlock(e.target.value)
        setGp('')

        getGpList(district ? district : userData?.DIST_LGD, e.target.value, 0).then(function (result) {
            const response = result?.data;
            console.log(response, "resresres")
            setGpDataList(response);
        });
    }
    let GpListDropDown = <option>Loading...</option>;
    if (getGpDataList && getGpDataList.length > 0) {
        GpListDropDown = getGpDataList.map((gpRow, index) => (
            <option value={gpRow.GP_LGD}>{gpRow.GP_NAME}</option>
        ));
    }

    const onGp = (e) => {
        setGp(e.target.value)
    }
    const onActivityOutput = (e) => {
        const activityOutput = e.target.value;
        setActivityOutput(activityOutput)
    }

    const onActivityIs = (e) => {
        const activityIs = e.target.value;
        setActivityIs(activityIs)
    }

    const onComponent = (e) => {
        const componentId = e.target.value;
        setComponent(componentId)
    }

    const onUpaSamity = (e) => {
        const upaSamityId = e.target.value;
        setUpaSamity(upaSamityId)
    }

    const onSector = (e) => {
        const sectorId = e.target.value;
        setSector(sectorId)
    }

    const onfocusArea = (e) => {
        const focusAreaId = e.target.value;
        setFocusArea(focusAreaId)
    }

    const onCategory = (e) => {
        const categoryId = e.target.value;
        setCategory(categoryId)
    }

    const onSDGCategory = (e) => {
        const sdgId = e.target.value;
        setSDGId(sdgId)
    }

    const onConvergence = (e) => {
        const convergenceValue = e.target.value;
        setConvergence(convergenceValue);
    };

    const onStatus = (e) => {
        const statusValue = e.target.value;
        setStatus(statusValue);
    }


    const totals = activitySummaryReportList.reduce(
        (acc, row) => {
            acc.assetActivityNo += Number(row.assetActivityNo || 0);
            acc.assetEstimatedCost += Number(row.assetEstimatedCost || 0);
            acc.serviceActivityNo += Number(row.serviceActivityNo || 0);
            acc.serviceEstimatedCost += Number(row.serviceEstimatedCost || 0);
            acc.traningActivityNo += Number(row.traningActivityNo || 0);
            acc.traningEstimatedCost += Number(row.traningEstimatedCost || 0);
            acc.othersActivityNo += Number(row.othersActivityNo || 0);
            acc.otherEstimatedCost += Number(row.otherEstimatedCost || 0);
            acc.totalActivityNo += Number(row.totalActivityNo || 0);
            acc.totalEstimatedCost += Number(row.totalEstimatedCost || 0);
            return acc;
        },
        {
            assetActivityNo: 0,
            assetEstimatedCost: 0,
            serviceActivityNo: 0,
            serviceEstimatedCost: 0,
            traningActivityNo: 0,
            traningEstimatedCost: 0,
            othersActivityNo: 0,
            otherEstimatedCost: 0,
            totalActivityNo: 0,
            totalEstimatedCost: 0,
        }
    );


    const exportDetailsToExcel = () => {
        const wb = XLSX.utils.book_new();

        const list = Array.isArray(detailsReportList)
            ? detailsReportList
            : [detailsReportList];

        list.forEach((item, idx) => {
            const ws_data = [
                ["DETAILS REPORT OF ACTIVITY LIST"],
                [""],
                ["Sl No", item?.slNo],
                ["Scheme Component", item?.schemeComponent],
                ["Activity No", item?.activityNo],
                ["Activity Name & Description", item?.activitNameDescription],
                ["Estimated Cost", item?.estimatedCost],
                ["Convergence With", item?.convergenceWith],
                ["Activity Output Status", item?.activityOutputStatus],
                ["Starting Time", item?.startingTime],
                ["Focus Area", item?.focusArea],
            ];

            const ws = XLSX.utils.aoa_to_sheet(ws_data);

            // ✅ Merge title row across A1:D1
            ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }];

            // ✅ Set column widths
            ws["!cols"] = [
                { wch: 25 },
                { wch: 50 },
                { wch: 25 },
                { wch: 40 },
            ];

            // ✅ Apply styles (bold headers)
            const makeBold = ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11"];
            makeBold.forEach((cell) => {
                if (ws[cell]) {
                    ws[cell].s = {
                        font: { bold: true },
                        alignment: { horizontal: "left", vertical: "center" },
                    };
                }
            });

            XLSX.utils.book_append_sheet(wb, ws, `Report_${idx + 1}`);
        });

        XLSX.writeFile(wb, "Details_Activity_List.xlsx");
    };


    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: `Activity_Report_${detailsReportList?.planYear}`,
    });


    return (
        <>

            <ToastContainer />

            <div className="bg-white rounded-lg flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Activity Query</legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full space-y-2">
                        <div className="flex items-center gap-4 ">
                            <div className="w-1/3">
                                <label
                                    htmlFor="receipt_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    District
                                    <span className="text-red-500"> *</span>

                                </label>
                                <select
                                    id="receipt_name"
                                    name="receipt_name"
                                    autoComplete="off"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300 "
                                    value={district}
                                    onChange={onDistrict}
                                    disabled={userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? true : false}

                                >
                                    {userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? "" :
                                        <option value="0" selected >
                                            Select District
                                        </option>}

                                    {getDistrictDataList.map((distRow, index) => (
                                        <option value={distRow.DistLgd}>{distRow.DistName}</option>
                                    ))}

                                </select>
                            </div>

                            <div className="w-1/3">
                                <label
                                    htmlFor="department_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Block
                                </label>
                                <select
                                    id="department_name"
                                    name="department_name"
                                    autoComplete="off"
                                    className="block text-sm w-full p-1 h-9 border border-gray-300 "
                                    onChange={onBlock}
                                    value={block}
                                    disabled={userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? true : false}
                                >
                                    {userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? "" :
                                        <option value="0" selected >
                                            Select Block
                                        </option>}
                                    {getBlockDataList.map((blRow, index) => (
                                        <option value={blRow.BlockLgd}>{blRow.BlockName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-1/3">
                                <label

                                    className="block text-sm font-medium text-gray-700"
                                >
                                    GP
                                </label>
                                <select
                                    id="scheme_name"
                                    name="scheme_name"
                                    autoComplete="off"
                                    className="block text-sm w-full p-1 h-9 border border-gray-300 "
                                    onChange={onGp}
                                    value={gp}
                                    disabled={userData?.USER_LEVEL == "GP" ? true : false}
                                >
                                    {userData?.USER_LEVEL == "GP" ? "" :
                                        <option value="0" selected >
                                            Select Gram Panchayat
                                        </option>}
                                    {getGpDataList.map((gpRow, index) => (
                                        <option value={gpRow.GPLgd}>{gpRow.GPName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="w-1/3">
                                <label

                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Plan Year
                                </label>
                                <select
                                    id="scheme_name"
                                    name="scheme_name"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    onChange={(e) => setSelectedPlanYear(e.target.value)}

                                >
                                    <option value="" selected hidden>
                                        Select Plan Year
                                        <span className="text-red-500"> *</span>

                                    </option>
                                    {planYear.map((i) => (
                                        <option key={i?.planYear} value={i?.planYear}>
                                            {i?.planYear}
                                        </option>
                                    ))}

                                </select>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="w-1/3">
                                <label
                                    htmlFor="receipt_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Activity output
                                    <span className="text-red-500"> *</span>

                                </label>
                                <select
                                    id="receipt_name"
                                    name="receipt_name"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    onChange={onActivityOutput}
                                // 
                                >
                                    <option value="" selected hidden>
                                        Select Activity Output
                                    </option>
                                    <option value="A" >
                                        Assets
                                    </option>
                                    <option value="S" >
                                        Service
                                    </option>
                                    <option value="T" >
                                        Training-CB
                                    </option>
                                    <option value="O" >
                                        Others
                                    </option>
                                </select>
                            </div>

                            <div className="w-1/3">
                                <label
                                    htmlFor="department_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Activity Is
                                </label>
                                <select
                                    id="department_name"
                                    name="department_name"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    onChange={onActivityIs}

                                >
                                    <option value="" selected hidden>
                                        Select Activity Is
                                    </option>
                                    <option value="Fresh" >
                                        Fresh
                                    </option>
                                    <option value="Operational">
                                        Operational
                                    </option>
                                    <option value="Maintenance">
                                        Maintenance
                                    </option>
                                    <option value="Upgradation">
                                        Upgradation
                                    </option>
                                    <option value="On Going">
                                        On Going
                                    </option>

                                </select>
                            </div>

                            <div className="w-1/3">
                                <label

                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Scheme Name
                                </label>
                                <select
                                    id="scheme_name"
                                    name="scheme_name"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    onChange={onSchemeName}

                                >
                                    <option value="" selected hidden>
                                        Select Scheme
                                    </option>
                                    {allScheme.map((i) => (
                                        <option className="text-sm" key={i?.schemeId} value={i?.schemeId}>
                                            {i?.schemeName}
                                        </option>
                                    ))}

                                </select>
                            </div>

                            <div className="w-1/3">
                                <label

                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Component
                                </label>
                                <select
                                    id="scheme_name"
                                    name="scheme_name"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    onChange={onComponent}

                                >
                                    <option value="" selected hidden>
                                        Select Component
                                    </option>
                                    {allComponent.map((i) => (
                                        <option className="text-sm" key={i?.componentId} value={i?.componentId}>
                                            {i?.componentName}
                                        </option>
                                    ))}

                                </select>
                            </div>
                        </div>

                        <div className="flex items-center w-full space-x-4">
                            {/* Account Code Desc */}


                            {/* Receipt Payment Nature */}
                            <div className="w-1/2">
                                <label
                                    htmlFor="receipt_payment_nature"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Upa Samiti
                                </label>
                                <select
                                    id="receipt_payment_nature"
                                    name="receipt_payment_nature"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    onChange={onUpaSamity}

                                >
                                    <option value="" selected hidden>
                                        Select Upa Samiti
                                    </option>
                                    {allUpaSamity.map((i) => (
                                        <option className="text-sm" key={i?.upaSamityId} value={i?.upaSamityId}>
                                            {i?.upaSamityName}
                                        </option>
                                    ))}

                                </select>
                            </div>

                            {/* Fund Type */}
                            <div className="w-1/2">
                                <label
                                    htmlFor="fund_type"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Sector
                                </label>
                                <select
                                    id="fund_type"
                                    name="fund_type"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    onChange={onSector}

                                >
                                    <option value="" selected hidden>
                                        Select Sector
                                    </option>
                                    {allSector.map((i) => (
                                        <option className="text-sm" key={i?.sectorId} value={i?.sectorId}>
                                            {i?.sectorName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center w-full space-x-4">
                            {/* Account Code Desc */}


                            {/* Receipt Payment Nature */}
                            <div className="w-1/2">
                                <label
                                    htmlFor="receipt_payment_nature"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Focus Area
                                </label>
                                <select
                                    id="receipt_payment_nature"
                                    name="receipt_payment_nature"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    onChange={onfocusArea}
                                >
                                    <option value="" selected hidden>
                                        Select Focus Area
                                    </option>
                                    {allFocusArea.map((i) => (
                                        <option className="text-sm" key={i?.focusAreaId}
                                            value={i?.focusAreaId}>
                                            {i?.focusAreaName}
                                        </option>
                                    ))}

                                </select>
                            </div>

                            {/* Fund Type */}
                            <div className="w-1/2">
                                <label
                                    htmlFor="fund_type"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Category
                                </label>
                                <select
                                    id="fund_type"
                                    name="fund_type"
                                    autoComplete="off"
                                    className="block w-full p-1 h-9 border border-gray-300 "
                                    onChange={onCategory}

                                >
                                    <option value="" selected hidden>
                                        Select Category
                                    </option>
                                    {allCategory.map((i) => (
                                        <option className="text-sm" key={i?.categoryId} value={i?.categoryId}>
                                            {i?.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>


                        <div className="flex items-center space-x-4">
                            {/* GL Group */}
                            <div className="w-1/3">
                                <label
                                    htmlFor="gl_group"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    SDG
                                </label>
                                <select
                                    id="gl_group"
                                    name="gl_group"
                                    autoComplete="off"
                                    className="block w-full text-sm p-1 h-9 border border-gray-300 "
                                    onChange={onSDGCategory}
                                >
                                    <option value="" selected hidden>
                                        Select SDG Category
                                    </option>
                                    {sdgCategory.map((i) => (
                                        <option className="text-sm" key={i?.sdgId} value={i?.sdgId}>
                                            {i?.sdgName}
                                        </option>
                                    ))}


                                </select>
                            </div>

                            {/* Receipt Payment Group */}
                            <div className="w-1/3">
                                <label
                                    htmlFor="receipt_payment_group"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Convergence
                                </label>
                                <select
                                    id="receipt_payment_group"
                                    name="receipt_payment_group"
                                    autoComplete="off"
                                    className="block text-sm w-full p-1 h-9 border border-gray-300 "
                                    onChange={onConvergence}
                                >
                                    <option value="" selected hidden>
                                        Select Convergence
                                    </option>
                                    <option value="4" >
                                        Yes
                                    </option>
                                    <option value="0" >
                                        No
                                    </option>
                                    <option value="1" >
                                        Yes-With SHG
                                    </option>
                                    <option value="2" >
                                        Yes-With Oth Dept
                                    </option>
                                    <option value="3" >
                                        Yes-With Oth Activity
                                    </option>


                                </select>
                            </div>

                            {/* Head Classification */}
                            <div className="w-1/3">
                                <label
                                    htmlFor="head_classification"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Activity Status
                                </label>
                                <select
                                    id="head_classification"
                                    name="head_classification"
                                    autoComplete="off"
                                    className="block text-sm w-full p-1 h-9 border border-gray-300 "
                                    onChange={onStatus}
                                >
                                    <option value="" selected hidden>
                                        Select Status
                                    </option>
                                    <option value="0" >All</option>
                                    <option value="Y" >VERIFIED</option>
                                    <option value="N" >UNVERIFIED</option>


                                </select>
                            </div>

                            <div className="w-1/3">
                                <label
                                    htmlFor="major_code"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Activity Name

                                </label>
                                <input
                                    id="major_code"
                                    name="major_code"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Activity Name"
                                    className="p-2 block w-full h-9 border border-gray-300 "
                                    onChange={(e) => setActivityName(e.target.value)}
                                    value={activityName}
                                    maxLength={100}
                                // maxLength={4}
                                />
                            </div>
                        </div>


                        <div className="col-span-2 flex justify-center items-center mt-4 px-32 gap-4">

                            <button
                                type="button"
                                className="bg-yellow-500 hover:bg-orange-400 text-white font-bold py-1 px-2 rounded"
                                onClick={onDetailsReport}
                            >
                                Details Report
                            </button>
                            <button
                                type="button"
                                className="bg-orange-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded"
                                onClick={onActivitySummaryReport}
                            >
                                Show Summary
                            </button>
                            <button
                                type="button"
                                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-1 px-2 rounded"
                                onClick={onShowActivityList}
                            >
                                Show Activity List
                            </button>
                        </div>

                    </div>
                </div>

            </div>
            {detailsReportList.length > 0 ?
                <div className="h-[600px] overflow-y-auto border rounded-lg">

                    {detailsReportList.map((item, index) => (
                        <div ref={printRef} className="p-6 bg-white text-sm">
                            {detailsReportList.map((item, index) => (
                                <div
                                    key={index}
                                    className="mb-10 print-page-break"
                                >
                                    {/* Header */}
                                    <div className="text-center border-b border-black pb-2 mb-4">
                                        <h2 className="font-bold">{item?.gpName}</h2>
                                        <h2 className="font-bold">
                                            {item?.distName} {item?.blockName}
                                        </h2>
                                        <h3 className="font-bold underline">
                                            DETAILS REPORT OF ACTIVITY LIST : {item?.planYear}
                                        </h3>
                                    </div>

                                    {/* Entry + Approval */}
                                    <div className="flex justify-between text-xs font-semibold mb-2">
                                        <span>{item?.enteredBy}</span>
                                        <span>{item?.verifiedBy}</span>
                                    </div>

                                    {/* Upa-Samiti */}
                                    <div className="mb-3 font-semibold">{item?.upaSamitiName}</div>

                                    {/* Grid Section */}
                                    <div className="border border-black text-xs">
                                        {/* Row 1 */}
                                        <div className="grid grid-cols-4 border-b border-black">
                                            <div className="p-2 border-r border-black">
                                                Activity Output: {item?.acvitityOutput}
                                            </div>
                                            <div className="p-2 border-r border-black">
                                                Scheme: {item?.schemeName}
                                            </div>
                                            <div className="p-2 border-r border-black">
                                                Component: {item?.componentName}
                                            </div>
                                            <div className="p-2">
                                                Implementing Agency: {item?.implementAgency}
                                            </div>
                                        </div>

                                        {/* Row 2 */}
                                        <div className="grid grid-cols-4 border-b border-black">
                                            <div className="p-2 border-r border-black">
                                                Activity Type: {item?.type}
                                            </div>
                                            <div className="p-2 border-r border-black">
                                                Category: {item?.categoryName}
                                            </div>
                                            <div className="p-2 border-r border-black">Sector: {item?.sector}</div>
                                            <div className="p-2">Subject: {item?.subject}</div>
                                        </div>

                                        {/* Row 3: Highlighted Activity Name */}
                                        <div className="col-span-4 p-2 border-b border-black font-bold bg-gray-100">
                                            Activity Name: {index + 1} - {item?.activityName}
                                        </div>

                                        {/* Row 4: Activity Desc */}
                                        <div className="grid grid-cols-2 border-b border-black">
                                            <div className="p-2 border-r border-black">
                                                Activity Desc: {item?.activityDesc}
                                            </div>
                                            <div className="p-2">Gram Sansad: {item?.sansad}</div>
                                        </div>

                                        {/* Row 5 */}
                                        <div className="grid grid-cols-2 border-b border-black">
                                            <div className="p-2 border-r border-black">
                                                Focus Area: {item?.focusArea}
                                            </div>
                                            <div className="p-2">Mission Antyodaya Gap: {item?.gapMA}</div>
                                        </div>

                                        {/* Row 6 */}
                                        <div className="grid grid-cols-3 border-b border-black">
                                            <div className="p-2 border-r border-black">Caste Group: {item?.caste}</div>
                                            <div className="p-2 border-r border-black">
                                                Activity For: {item?.activityForAll}
                                            </div>
                                            <div className="p-2">PB Sector Gap: {item?.gapPB}</div>
                                        </div>

                                        {/* Row 7 */}
                                        <div className="grid grid-cols-4 border-b border-black">
                                            <div className="p-2 border-r border-black">
                                                Activity Status: {item?.operationType}
                                            </div>
                                            <div className="p-2 border-r border-black">
                                                Whether Costless: {item?.costlessActivity}
                                            </div>
                                            <div className="p-2 border-r border-black">
                                                Estimated Total Cost: {item?.estimatedCost}
                                            </div>
                                            <div className="p-2">
                                                Estimated Man Days: {item?.estimatedMandays}
                                            </div>
                                        </div>

                                        {/* Row 8 */}
                                        <div className="grid grid-cols-4 border-b border-black">
                                            <div className="p-2 border-r border-black">
                                                Starting Time: {item?.startTime}
                                            </div>
                                            <div className="p-2 border-r border-black">
                                                Duration: {item?.duration}
                                            </div>
                                            <div className="p-2 border-r border-black">
                                                SC: {item?.sc} ST: {item?.st}
                                            </div>
                                            <div className="p-2">
                                                Others: {item?.gen} | Total: {item?.total}
                                            </div>
                                        </div>

                                        {/* Row 9 */}
                                        <div className="grid grid-cols-3 border-b border-black">
                                            <div className="p-2 border-r border-black">
                                                Activity Type: {item?.assetActivityName}
                                            </div>
                                            <div className="p-2 border-r border-black">
                                                Asset Category: {item?.assetCategory}
                                            </div>
                                            <div className="p-2">Sub Category: {item?.assetSubCategory}</div>
                                        </div>

                                        {/* Row 10 */}
                                        <div className="grid grid-cols-4 border-b border-black">
                                            <div className="p-2 border-r border-black">
                                                Unit of Measurement: {item?.assetUnitType}
                                            </div>
                                            <div className="p-2 border-r border-black">
                                                Total Unit: {item?.assetTotUnit}
                                            </div>
                                            <div className="p-2 border-r border-black">
                                                Latitude: {item?.latitude}
                                            </div>
                                            <div className="p-2">Longitude: {item?.longitude}</div>
                                        </div>

                                        {/* Row 11 */}
                                        <div className="grid grid-cols-3 border-b border-black">
                                            <div className="p-2 border-r border-black">
                                                Census Village: {item?.vill2}
                                            </div>
                                            <div className="p-2 border-r border-black">
                                                Census Village: {item?.vill3}
                                            </div>
                                            <div className="p-2">Census Village: {item?.vill4}</div>
                                        </div>

                                        {/* Row 12 */}
                                        <div className="grid grid-cols-3 border-b border-black">
                                            <div className="p-2 border-r border-black">
                                                Convergence Type: {item?.convergenceActivity}
                                            </div>
                                            <div className="p-2 border-r border-black">Department: {item?.deptName}</div>
                                            <div className="p-2">Activity: {item?.convergence}</div>
                                        </div>

                                        {/* Row 13 */}
                                        <div className="grid grid-cols-3">
                                            <div className="p-2 border-r border-black">Related SDG: {item?.sdg1}</div>
                                            <div className="p-2 border-r border-black">Related SDG: {item?.sdg2}</div>
                                            <div className="p-2">
                                                Recommended By: {item?.recomend} | Remarks (If Any): {item?.remarks}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    ))}
                </div> : ""}
            {detailsReportList.length > 0 ?
                <div className="flex justify-center mt-4">
                    <button
                        onClick={handlePrint}
                        className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
                    >
                        📥 print
                    </button>
                </div> : ""}

            {activitySummaryReportList.length > 0 ?
                <div className="p-6">
                    <h2 className="text-center font-bold text-blue-700 text-lg mb-4">
                        ACTIVITY SUMMARY
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="border border-gray-400 w-full text-sm text-center">
                            <thead className="text-sm">
                                <tr className="bg-blue-200 text-xs">
                                    <th className="border border-gray-400 p-2">SL NO</th>
                                    <th className="border border-gray-400 p-2">SCHEME & COMPONENT</th>
                                    <th className="border border-gray-400 p-2">ASSET - NO. OF ACTIVITY</th>
                                    <th className="border border-gray-400 p-2">ASSET - ESTIMATED COST</th>
                                    <th className="border border-gray-400 p-2">SERVICE - NO. OF ACTIVITY</th>
                                    <th className="border border-gray-400 p-2">SERVICE - ESTIMATED COST</th>
                                    <th className="border border-gray-400 p-2">TRAINING - NO. OF ACTIVITY</th>
                                    <th className="border border-gray-400 p-2">TRAINING - ESTIMATED COST</th>
                                    <th className="border border-gray-400 p-2">OTHERS - NO. OF ACTIVITY</th>
                                    <th className="border border-gray-400 p-2">OTHERS - ESTIMATED COST</th>
                                    <th className="border border-gray-400 p-2">TOTAL - NO. OF ACTIVITY</th>
                                    <th className="border border-gray-400 p-2">TOTAL - ESTIMATED COST</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activitySummaryReportList.map((row, index) => (
                                    <tr key={index} className="odd:bg-white even:bg-gray-50 text-xs">
                                        <td className="border border-gray-400 p-2">{row.slNo}</td>
                                        <td className="border border-gray-400 p-2">{row.schemeComponent}</td>
                                        <td className="border border-gray-400 p-2">{row.assetActivityNo}</td>
                                        <td className="border border-gray-400 p-2">{row.assetEstimatedCost}</td>
                                        <td className="border border-gray-400 p-2">{row.serviceActivityNo}</td>
                                        <td className="border border-gray-400 p-2">{row.serviceEstimatedCost}</td>
                                        <td className="border border-gray-400 p-2">{row.traningActivityNo}</td>
                                        <td className="border border-gray-400 p-2">{row.traningEstimatedCost}</td>
                                        <td className="border border-gray-400 p-2">{row.othersActivityNo}</td>
                                        <td className="border border-gray-400 p-2">{row.otherEstimatedCost}</td>
                                        <td className="border border-gray-400 p-2">{row.totalActivityNo}</td>
                                        <td className="border border-gray-400 p-2">{row.totalEstimatedCost}</td>
                                    </tr>
                                ))}

                                {/* Total Row */}
                                <tr className="bg-blue-400 font-bold text-xs">
                                    <td className="border border-gray-400 p-2 text-center" colSpan={2}>
                                        TOTAL
                                    </td>
                                    <td className="border border-gray-400 p-2">{totals.assetActivityNo}</td>
                                    <td className="border border-gray-400 p-2">{totals.assetEstimatedCost}</td>
                                    <td className="border border-gray-400 p-2">{totals.serviceActivityNo}</td>
                                    <td className="border border-gray-400 p-2">{totals.serviceEstimatedCost}</td>
                                    <td className="border border-gray-400 p-2">{totals.traningActivityNo}</td>
                                    <td className="border border-gray-400 p-2">{totals.traningEstimatedCost}</td>
                                    <td className="border border-gray-400 p-2">{totals.othersActivityNo}</td>
                                    <td className="border border-gray-400 p-2">{totals.otherEstimatedCost}</td>
                                    <td className="border border-gray-400 p-2">{totals.totalActivityNo}</td>
                                    <td className="border border-gray-400 p-2">{totals.totalEstimatedCost}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div> : ""}

            {activityListReport.length > 0 ?
                <div className="h-[600px] overflow-y-auto border rounded-lg">

                    <div className="p-4">
                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-400 text-sm">
                                <thead className="bg-gray-200 text-xs">
                                    <tr className="bg-gray-100 text-center text-xs font-semibold">
                                        <th className="border border-gray-400 p-2 w-12">SL NO</th>
                                        <th className="border border-gray-400 p-2 w-40">SCHEME & COMPONENT</th>
                                        <th className="border border-gray-400 p-2 w-20">ACTIVITY NO</th>
                                        <th className="border border-gray-400 p-2">ACTIVITY NAME & DESCRIPTION</th>
                                        <th className="border border-gray-400 p-2 w-28">ESTIMATED COST</th>
                                        <th className="border border-gray-400 p-2 w-28">CONVERGENCE WITH</th>
                                        <th className="border border-gray-400 p-2 w-32">ACTIVITY OUTPUT (STATUS)</th>
                                        <th className="border border-gray-400 p-2 w-24">STARTING TIME</th>
                                        <th className="border border-gray-400 p-2 w-40">FOCUS AREA</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs">
                                    {activityListReport.length > 0 ? (
                                        activityListReport.map((item, index) => (
                                            <tr key={index} className="text-center">
                                                <td className="border border-gray-400 p-2">{item.slNo}</td>
                                                <td className="border border-gray-400 p-2">{item.schemeComponent}</td>
                                                <td className="border border-gray-400 p-2">{item.activityNo}</td>
                                                <td className="border border-gray-400 p-2 text-left">
                                                    {item.activitNameDescription}
                                                </td>
                                                <td className="border border-gray-400 p-2">{item.estimatedCost}</td>
                                                <td className="border border-gray-400 p-2">{item.convergenceWith}</td>
                                                <td className="border border-gray-400 p-2">{item.activityOutputStatus}</td>
                                                <td className="border border-gray-400 p-2">{item.startingTime}</td>
                                                <td className="border border-gray-400 p-2">{item.focusArea}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="border border-gray-400 p-2 text-center">
                                                No Data Available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div> : ""}

        </>
    );
};

export default ActivityQuery;
