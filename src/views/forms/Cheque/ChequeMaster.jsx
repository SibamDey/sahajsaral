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
import * as XLSX from "xlsx";


const ChequeMaster = () => {
    const [mutationId, setMutationId] = useState(null);
    console.log(mutationId, "mutationId")
    const [contractorName, setContractorName] = useState('');
    const [gstin, setGSTIN] = useState('');
    const [isValid, setIsValid] = useState(true);
    const [isValidContractorName, setIsValidContractorName] = useState(true);
    const [panNumber, setPanNumber] = useState('');
    const [isValidPan, setIsValidPan] = useState(true);
    const [mobileNumber, setMobileNumber] = useState("");
    const [isValidMobile, setIsValidMobile] = useState(true);
    const [address, setAddress] = useState("");
    const [isValidAddress, setIsValidAddress] = useState(true);
    const [currentDate, setCurrentDate] = useState("");
    const [insertdeptId, setInsertdeptId] = useState("");
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const [openModal, setOpenModal] = useState(false);


    const { data: schemeList } = useQuery({
        queryKey: ["schemeList"],
        queryFn: async () => {
            const data = await fetch.get("/ChequeBook/GetChequeBookDetailsForListing?lgdCode=" + userData?.CORE_LGD);
            // console.log(Array.isArray(data.data.result));
            return data?.data;
        },
    });


    console.log(mutationId, "mutationId")

    const deptId = useRef(null);
    const chqBkNm = useRef(null);
    const deptAbv = useRef(null);
    const NOL = useRef(null);

    const queryClient = useQueryClient();

    const { mutate: addPed, isPending: addPending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(newTodo, "/ChequeBook/Insert");
        },
        onSuccess: () => {
            queryClient.invalidateQueries("schemeList");
            // designation.current.value = "";
            deptId.current.value = "";
            chqBkNm.current.value = "";
            deptAbv.current.value = "";
            NOL.current.value = "";

        },
        mutationKey: ["adddesignation"],
    });
    console.log(mutationId, "mutationId")
    const { mutate: updatePed, isPending: updatePending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(
                newTodo,
                "/scheme/update/" + mutationId
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries("schemeList");
            // designation.current.value = "";
            deptId.current.value = "";
            chqBkNm.current.value = "";
            deptAbv.current.value = "";
            NOL.current.value = "";

            setMutationId(null);
        },
        mutationKey: ["updatedesignation"],
    });

    function performMutation() {
        if (deptId.current.value === "") {
            toast.error("Please select a Bank")
        } else if (chqBkNm.current.value === "") {
            toast.error("Please Type Cheque Book No")
        } else if (deptAbv.current.value === "") {
            toast.error("Please Type First Cheque No")

        } else if (NOL.current.value === "") {
            toast.error("Please Type No of Leaf")
        } else if (NOL.current.value > 100) {
            toast.error("No of Leaf should be less than 100")

        } else {
            if (mutationId === null)
                addPed({
                    "lgdCode": userData?.CORE_LGD,
                    "accountCode": deptId.current.value,
                    "chequeBookNo": chqBkNm.current.value,
                    "startChequeNo": deptAbv.current.value,
                    "totLeaf": NOL.current.value,

                });
            else
                updatePed({
                    "accountCode": deptId.current.value,
                    "chequeBookNo": chqBkNm.current.value,
                    "startChequeNo": deptAbv.current.value,
                    "totLeaf": NOL.current.value,

                });
        }
    }
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
        const sortedList = [...(schemeList ?? [])];
        sortedList.sort((a, b) => b.designationId - a.designationId);
        return sortedList;
    }, [schemeList]);

    const list = [
        {
            header: "Bank Account",
            accessorKey: "accountInfo",
            headclass: "cursor-pointer",
        },
        {
            header: "Cheque Book No",
            accessorKey: "chequeBookNo",
            headclass: "cursor-pointer",
        },
        {
            header: "First Cheque No",
            accessorKey: "firstLeafNO",
            headclass: "cursor-pointer",
        },
        {
            header: "No of Leaf",
            accessorKey: "totalLeaf",
            headclass: "cursor-pointer",
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


    const onDepartmentName = (e) => {
        const value = e.target.value;
        // Regular expression to allow only alphabets and white spaces
        const regex = /^[A-Za-z\s]+$/;
        if (regex.test(value)) {
            setContractorName(value);
            setIsValidContractorName(true)
        } else {
            setIsValidContractorName(false)
            // toast.error("Please use only Alphabet characters")

        }
    }


    const ondeptId = (e) => {
        const value = e.target.value;
        // Regular expression to allow only alphabets and white spaces
        setInsertdeptId(e.target.value)
    }

    const { data: finInstitution } = useQuery({
        queryKey: ["finInstitution"],
        queryFn: async () => {
            const data = await fetch.get(`/RealAccount/GetRealAccountWithNumber?lgdCode=${userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : 0 || userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : 0 || userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0}`);
            return data?.data;
        },
    });

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
                <legend className="text-lg font-semibold text-cyan-700">Cheque Master</legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full space-y-2">
                        <div className="flex items-center gap-2">

                            <div className="px-2">

                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Bank / Treasury Account <span className="text-red-500 "> * </span>

                                </label>

                                <select
                                    id="DISTRICT"
                                    className="text-xs mt-1 p-2 h-8 block border border-gray-300 rounded-md"
                                    ref={deptId}
                                    onChange={ondeptId}
                                >
                                    <option value="">--Select Bank / Treasury Account--</option>
                                    {finInstitution?.map((d) => (
                                        <option value={d?.accountCode}>
                                            {d?.accountCodeDesc}
                                        </option>
                                    ))}
                                </select>

                            </div>
                            <div className="w-1/7">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Cheque Book No <span className="text-red-500 "> * </span>

                                </label>
                                <input
                                    id="contractor_name"
                                    name="contractor_name"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Cheque Book No"
                                    className="mt-1 p-2 block border border-gray-300 rounded-md text-xs h-8"
                                    onChange={onDepartmentName}
                                    // onKeyDown={handleKeyDown}
                                    ref={chqBkNm}

                                />

                            </div>

                            <div className="w-1/5">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    First Cheque No <span className="text-red-500 "> * </span>

                                </label>
                                <input
                                    ref={deptAbv}
                                    id="scheme_name"
                                    name="scheme_name"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="First Cheque No"
                                    className="text-xs h-8 mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                    required
                                    maxLength={6}
                                />

                            </div>
                            <div className="w-1/5">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    No of Leaf <span className="text-red-500 "> * </span>

                                </label>
                                <input
                                    ref={NOL}
                                    id="scheme_name"
                                    name="scheme_name"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="No of Leaf"
                                    className="text-xs h-8 mt-1 p-2 block w-full border border-gray-300 rounded-md"
                                    required
                                    maxLength={3}
                                />

                            </div>
                            <div className="w-1/6">
                                <button
                                    type="button"
                                    className="btn-submit h-8 py-1 px-2 border mt-6 border-transparent rounded-md shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={performMutation}

                                >
                                    {!mutationId ? "Submit" : "Update"}
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
                            onClick={() => exportToExcel(data, "Cheque")}

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
                    <Pagination data={data} table={table} />
                </div>
            </div>
        </>
    );
};

export default ChequeMaster;
