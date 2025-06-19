import { useState, useEffect, useRef, useMemo } from "react";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Table } from "flowbite-react";
// import { devApi } from "../../WebApi/WebApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { fetch } from "../../../functions/Fetchfunctions";
import SuccessModal from "../../../components/SuccessModal";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Pagination } from "../../../components/Pagination";
import classNames from "classnames";
import { SortIcon } from "../../../components/SortIcon";
import { ToastContainer, toast } from "react-toastify";
import { getDistrictListforEvent, getBlockList, getGpList, getParabaithakActivity } from "../../../Service/Project/ActivityDetailsService";
import * as XLSX from "xlsx";


const ActivityDetails = () => {
    const [mutationId, setMutationId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const receiptPayment = useRef(null);
    const department = useRef(null);
    const scheme = useRef(null);
    const accountCodeDesc = useRef(null);
    const receiptPaymentNature = useRef(null);
    const fundType = useRef(null);
    const glGroup = useRef(null);
    const receiptPaymentGroup = useRef(null);
    const receiptPaymentGp = useRef(null);
    const majorCode = useRef(null);
    const minorCode = useRef(null);
    const subGroup = useRef(null);
    const objCode = useRef(null);
    const schemeUid = useRef(null);
    const schemeChildUid = useRef(null);
    const queryClient = useQueryClient();

    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);

    //districtblockgp
    const [getDistrictDataList, setDistrictDataList] = useState([]);
    const [getBlockDataList, setBlockDataList] = useState([]);
    const [getGpDataList, setGpDataList] = useState([]);
    const [activityDetailsList, setActivityDetailsList] = useState([]);



    const [district, setDistrict] = useState();
    const [block, setBlock] = useState();
    const [gp, setGp] = useState();
    const [year, setYear] = useState();

    const currentYear = new Date().getFullYear();

    const generateYearRanges = (startYear, rangeCount) => {
        console.log(startYear, rangeCount, "start")
        const ranges = [];
        for (let i = 0; i < rangeCount; i++) {
            const start = startYear - i; // Start from the highest year
            const end = start + 1;
            ranges.push(`${start}-${end}`);
        }
        return ranges;
    };

    const yearRanges = generateYearRanges(currentYear + 1, 5);

    const onYear = (e) => {
        console.log(e.target.value)
        setYear(e.target.value)
    }



    const { data: nominalAccList } = useQuery({
        queryKey: ["nominalAccList"],
        queryFn: async () => {
            const data = await fetch.get("/ParabaithakActivity/GetAllActivityList?distLgd=" + (district ? district : userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? userData?.DIST_LGD : 0) + "&blockLgd=" + (block ? block : userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? userData?.BLOCK_LGD : 0) + "&gpLgd=" + (gp ? gp : userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0) + "&planYear=" + (year ? year : 0));
            return data?.data;
        },
    });


    const onShow = () => {
        if (!year) {
            toast.error("Please Select a Financial Year")
        } else {
            getParabaithakActivity(district ? district : userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? userData?.DIST_LGD : 0,
                block ? block : userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? userData?.BLOCK_LGD : 0,
                gp ? gp : userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
                year
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setActivityDetailsList(response);
            })
            queryClient.fetchQuery({ queryKey: ["nominalAccList"] });
        }

    }

    const { mutate: addPed, isPending: addPending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(newTodo, "/StateAccountCode/Insert");
        },
        onSuccess: () => {
            queryClient.invalidateQueries("nominalAccList");
            receiptPayment.current.value = "";
            department.current.value = "";
            scheme.current.value = "";
            accountCodeDesc.current.value = "";
            receiptPaymentNature.current.value = "";
            fundType.current.value = "";
            glGroup.current.value = "";
            receiptPaymentGroup.current.value = "";
            receiptPaymentGp.current.value = "";
            majorCode.current.value = "";
            minorCode.current.value = "";
            subGroup.current.value = "";
            objCode.current.value = "";
            schemeUid.current.value = "";
            schemeChildUid.current.value = "";
        },
        mutationKey: ["adddesignation"],
    });
    console.log(mutationId, "mutationId")
    const { mutate: updatePed, isPending: updatePending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(
                newTodo,
                "/contractor/update/" + mutationId
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries("nominalAccList");
            receiptPayment.current.value = "";
            department.current.value = "";
            scheme.current.value = "";
            accountCodeDesc.current.value = "";
            receiptPaymentNature.current.value = "";
            fundType.current.value = "";
            glGroup.current.value = "";
            receiptPaymentGroup.current.value = "";
            receiptPaymentGp.current.value = "";
            majorCode.current.value = "";
            minorCode.current.value = "";
            subGroup.current.value = "";
            objCode.current.value = "";
            schemeUid.current.value = "";
            schemeChildUid.current.value = "";
            setMutationId(null);
        },
        mutationKey: ["updatedesignation"],
    });


    useEffect(() => {
        const preventScroll = () => {
            document.body.style.overflow = "hidden";
        };

        const allowScroll = () => {
            document.body.style.overflow = "auto";
        };

        if (addPending || updatePending) {
            preventScroll();
        } else {
            allowScroll();
        }

        return () => {
            allowScroll();
        };
    }, [addPending, updatePending]);

    const ListOptions = [10, 20, 50, "all"];
    const [items, setItems] = useState(ListOptions[0]);

    const data = useMemo(() => {
        const sortedList = [...(nominalAccList ?? [])];
        sortedList.sort((a, b) => b.designationId - a.designationId);
        return sortedList;
    }, [nominalAccList]);

    const list = [
        {
            header: "Plan Year",
            accessorKey: "planYear",
            className: "text-left cursor-pointer px-2",

        },

        {
            header: "Scheme & Component",
            accessorKey: "schemeComponent",
            className: "text-left cursor-pointer px-2",

        },

        {
            header: "Activity Code",
            accessorKey: "activityCode",
            className: "text-left cursor-pointer px-2",
        },
        {
            header: "Activity Name & Description",
            accessorKey: "activityDesc",
            className: "text-left cursor-pointer px-2",
        },
        {
            header: "Estimated Cost",
            accessorKey: "estimatedCost",
            className: "text-left cursor-pointer px-2",
        },
        {
            header: "Convergence With",
            accessorKey: "convergenceWith",
            className: "text-left cursor-pointer px-2",
        },
        {
            header: "Activity Output",
            accessorKey: "activityOutputStatus",
            className: "text-left cursor-pointer px-2",
        },
        {
            header: "Start Time",
            accessorKey: "startTime",
            className: "text-left cursor-pointer px-2",
        },
        {
            header: "Focus Area",
            accessorKey: "focusArea",
            className: "text-left cursor-pointer px-2",
        },
        {
            header: "Whether Verified",
            accessorFn: (row) => (row.activityVerify ? "Verified" : "Not Verified"),
            className: "text-left cursor-pointer px-2",
        },

    ];

    const [sorting, setSorting] = useState([]);
    const [filtering, setFiltering] = useState("");

    const table = useReactTable({
        data,
        columns: list,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting: sorting,
            globalFilter: filtering,
        },
        initialState: {
            pagination: {
                pageSize: parseInt(items),
            },
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setFiltering,
    });

    useEffect(() => {
        if (items == "all") table.setPageSize(9999);
        else table.setPageSize(parseInt(items));
    }, [items]);

    //department list
    const { data: departmentList } = useQuery({
        queryKey: ["departmentList"],
        queryFn: async () => {
            const data = await fetch.get("/Department/Get");
            return data?.data;
        },
    });


    const { data: schemeList } = useQuery({
        queryKey: ["schemeList"],
        queryFn: async () => {
            const data = await fetch.get("/scheme/Get");
            return data?.data;
        },
    });


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



    let DistrictListDropDown = <option>Loading...</option>;
    if (getDistrictDataList && getDistrictDataList.length > 0) {
        DistrictListDropDown = getDistrictDataList.map((distRow, index) => (
            <option value={distRow.DistLgd}>{distRow.DistName}</option>
        ));
    }

    console.log(DistrictListDropDown, "DistrictListDropDown")


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


    const onYearRanDrop = (e) => {
        console.log(e.target.value, "year")

    }

    const exportToExcel = (tableData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(tableData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, `${fileName}.xlsx`);
    };
    return (
        <>
            <SuccessModal
                openModal={openModal}
                setOpenModal={setOpenModal}
                message={"Contractor Created Successfully"}
                to="contractor-master"
                // resetData={resetData}
                isSuccess={true}
            />
            <ToastContainer />

            <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
                <legend className="text-lg font-semibold text-cyan-700">Activity Details</legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full space-y-2">
                        <div className="flex items-center gap-4 ">

                            <div className="w-1/3">
                                <label
                                    htmlFor="receipt_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    District
                                </label>
                                <select
                                    id="receipt_name"
                                    name="receipt_name"
                                    autoComplete="off"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300 "
                                    ref={receiptPayment}
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
                                    className=" text-sm block w-full p-1 h-9 border border-gray-300 "
                                    ref={department}
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
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Gram Panchayat
                                </label>
                                <select
                                    id="scheme_name"
                                    name="scheme_name"
                                    autoComplete="off"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300 "
                                    ref={scheme}
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
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Plan Year
                                    <span className="text-red-500"> *</span>
                                </label>

                                <select
                                    id="scheme_name"
                                    name="scheme_name"
                                    autoComplete="off"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300 "
                                    ref={scheme}
                                    onChange={onYear}
                                >
                                    <option value="" selected hidden>
                                        Select Plan Year
                                    </option>
                                    {yearRanges.map((range, idx) => (
                                        <option key={idx} value={range}>
                                            {range}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">


                            <div className="w-full">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Report
                                    <span className="text-red-500"> *</span>
                                </label>
                                <select
                                    id="scheme_name"
                                    name="scheme_name"
                                    autoComplete="off"
                                    className="text-sm block w-full p-1 h-9 border border-gray-300 "
                                    ref={scheme}
                                >
                                    <option value="" selected hidden>
                                        Select Report
                                    </option>
                                    <option value="1">
                                        Scheme Wise Activity
                                    </option>

                                </select>
                            </div>

                            <div className="col-span-2 flex justify-center items-center mt-4 gap-4 w-1/3" style={{ marginLeft: "10px" }}>


                                <button
                                    type="button"
                                    className={classNames(
                                        "bg-yellow-500 hover:bg-orange-400 text-white font-bold py-1 px-2 rounded",
                                        mutationId
                                            ? "bg-orange-300 hover:bg-orange-400 text-white font-bold py-1 px-2 rounded"
                                            : "bg-orange-300 hover:bg-orange-400 text-white font-bold py-1 px-2 rounded"
                                    )}
                                // onClick={performMutation}
                                >
                                    Reset
                                </button>
                                <button
                                    type="button"
                                    className="bg-orange-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                                    onClick={onShow}
                                >
                                    Show
                                </button>
                                <button
                                    type="button"
                                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-1 px-2 rounded"
                                >
                                    Export
                                </button>
                            </div>
                        </div>




                    </div>
                </div>

                <div className=" flex justify-between items-center h-12">
                    <div className="flex items-center space-x-0">
                        <select
                            className="rounded-lg "
                            name=""
                            id=""
                            value={items}
                            onChange={(e) => setItems(e.target.value)}
                        >
                            {ListOptions.map((e) => (
                                <option key={e} value={e}>
                                    {e}
                                </option>
                            ))}
                        </select>
                        &nbsp;

                        <button
                            className="bg-cyan-700 text-white px-2 py-2 rounded text-sm "
                            onClick={() => exportToExcel(data, "Activity_Details")}

                        >
                            Download Excel
                        </button>
                    </div>


                    <input
                        type="text"
                        value={filtering}
                        placeholder="search..."
                        className="border-2 rounded-lg border-zinc-400"
                        onChange={(e) => setFiltering(e.target.value)}
                    />

                </div>
                <div className="px-2 flex flex-col ">
                    <Table style={{ border: "1px solid #444 " }}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Table.Head key={headerGroup.id}>

                                {headerGroup.headers.map((header) => (
                                    <Table.HeadCell
                                        key={header.id}
                                        className="p-2 bg-cyan-400/100 btn-blue text-xs"
                                        style={{ border: "1px solid #444" }} // Keep borders
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div className="flex items-center space-x-2 justify-between">
                                                <span className="normal-case">
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                </span>
                                                <SortIcon sort={header.column.getIsSorted()} />
                                            </div>
                                        )}
                                    </Table.HeadCell>
                                ))}

                            </Table.Head>
                        ))}


                        <Table.Body className="divide-y" style={{ border: "1px solid #444 " }}>
                            {table.getRowModel().rows.map((row) => (
                                <Table.Row key={row.id} style={{ border: "1px solid #444 " }}>
                                    {row.getVisibleCells().map((cell) => (
                                        <Table.Cell
                                            style={{ border: "1px solid #444 " }}
                                            key={cell.id}
                                            className="p-1 text-xs"

                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </Table.Cell>
                                    ))}

                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    {nominalAccList?.length === 0 ? <div className="flex items-center justify-center bg-gray-200" style={{ marginTop: "10px" }}>
                        <div className="text-center">
                            <h1 className="text-xl font-semibold text-black-800">No Data Found</h1>

                        </div>
                    </div> : ""}
                    <Pagination data={data} table={table} />
                </div>
            </div>
        </>
    );
};

export default ActivityDetails;
