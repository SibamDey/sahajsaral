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
import DatePicker from "react-datepicker";
import { addCreateContractor } from "../../../Service/Contractor/ContractorService";


const SchemeMaster = () => {
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
    const [insertSchemeId, setInsertSchemeId] = useState("");
    const jsonString = localStorage.getItem("IEC_DETAILS_USER");
    const userData = JSON.parse(jsonString);
    const [openModal, setOpenModal] = useState(false);


    const { data: schemeList } = useQuery({
        queryKey: ["schemeList"],
        queryFn: async () => {
            const data = await fetch.get("/scheme/Get");
            // console.log(Array.isArray(data.data.result));
            return data?.data;
        },
    });


    console.log(schemeList, "schemeList")

    const schemeid = useRef(null);
    const schemeNm = useRef(null);
    const schemeAbv = useRef(null);
    const schemeType = useRef(null);
    const schemeDsc = useRef(null);
    const queryClient = useQueryClient();

    const { mutate: addPed, isPending: addPending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(newTodo, "/scheme/Insert");
        },
        onSuccess: () => {
            queryClient.invalidateQueries("schemeList");
            // designation.current.value = "";
            schemeid.current.value = "";
            schemeNm.current.value = "";
            schemeAbv.current.value = "";
            schemeType.current.value = "";
            schemeDsc.current.value = "";
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
            schemeid.current.value = "";
            schemeNm.current.value = "";
            schemeAbv.current.value = "";
            schemeType.current.value = "";
            schemeDsc.current.value = "";
            setMutationId(null);
        },
        mutationKey: ["updatedesignation"],
    });

    function performMutation() {
        if (schemeid.current.value === "") {
            toast.error("Please Type Scheme Id")
        } else if (schemeid.current.value?.length != 3) {
            toast.error("Scheme Id Should be 3 Digit")
        } else if (schemeNm.current.value === "") {
            toast.error("Please Type Scheme Name")
        } else {
            if (mutationId === null)
                addPed({
                    "schemeId": schemeid.current.value,
                    "schemeName": schemeNm.current.value,
                    "schemeAbv": schemeAbv.current.value,
                    "schemeDesc": schemeDsc.current.value,
                    "schemeType": schemeType.current.value,
                });
            else
                updatePed({
                    "schemeId": schemeid.current.value,
                    "schemeName": schemeNm.current.value,
                    "schemeAbv": schemeAbv.current.value,
                    "schemeDesc": schemeDsc.current.value,
                    "schemeType": schemeType.current.value,
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
            header: "Scheme Id",
            accessorKey: "schemeId",
            headclass: "cursor-pointer",
        },
        {
            header: "Scheme Name",
            accessorKey: "schemeName",
            headclass: "cursor-pointer",
        },
        {
            header: "Scheme Abbreviation",
            accessorKey: "schemeAbv",
            headclass: "cursor-pointer",
        },

        {
            header: "Scheme Type",
            accessorKey: "schemeType",
            headclass: "cursor-pointer",
        },

        {
            header: "Scheme Description",
            accessorKey: "schemeDesc",
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

    const onAddress = (event) => {
        const value = event.target.value;
        const regex = /^[a-zA-Z0-9\s,\/]*$/;
        if (regex.test(value) || value === '') {
            setAddress(value);
            setIsValidAddress(true);
        } else {
            setIsValidAddress(false);
        }
    };

    const onContractorName = (e) => {
        const value = e.target.value;
        setContractorName(value);

        // Regular expression to allow only alphabets and white spaces
        // const regex = /^[A-Za-z\s]+$/;
        // if (regex.test(value)) {
        //     setContractorName(value);
        //     setIsValidContractorName(true)
        // } else {
        //     setIsValidContractorName(false)
        //     // toast.error("Please use only Alphabet characters")

        // }
    }


    const onSchemeId = (e) => {
        const value = e.target.value;
        // Regular expression to allow only alphabets and white spaces
        setInsertSchemeId(e.target.value)
    }

    const handleKeyDown = (event) => {
        // Allow only alphabets and white spaces
        if (
            !(
                (event.keyCode >= 65 && event.keyCode <= 90) || // A-Z
                (event.keyCode >= 97 && event.keyCode <= 122) || // a-z
                event.keyCode === 32 || event.key === "Backspace"
            )
        ) {
            event.preventDefault();
        }
    }

    const onMobile = (event) => {
        const value = event.target.value;
        const regex = /^[6-9]{1}[0-9]{9}$/;
        if (regex.test(value) || value === '') {
            setMobileNumber(value);
            setIsValidMobile(true);
        } else {
            setIsValidMobile(false);
        }
    };

    const onPanCard = (e) => {
        const value = e.target.value.toUpperCase()
        schemeAbv.current.value = e.target.value.toUpperCase()

        setPanNumber(value);

    }

    // console.log(schemeNm.current.value,"schemeNm")

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
            <legend className="text-lg font-semibold text-cyan-700">Scheme Master</legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full mb-4 space-y-2">
                        <div className="flex items-center ">

                            <div className="w-1/8 ">

                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Scheme Id <span className="text-red-500 "> * </span>

                                </label>
                                <input
                                    id="scheme_id"
                                    name="scheme_id"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Scheme Id"
                                    className="mt-1 p-1 block border border-gray-300 rounded-md"
                                    onChange={onSchemeId}
                                    // onKeyDown={handleKeyDown}
                                    ref={schemeid}
                                    maxLength={3}

                                />

                            </div>
                            <div className="w-1/8 px-2">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Scheme Name <span className="text-red-500 "> * </span>

                                </label>
                                <input
                                    id="contractor_name"
                                    name="contractor_name"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Scheme Name"
                                    className="mt-1 p-1 block border border-gray-300 rounded-md"
                                    onChange={onContractorName}
                                    // onKeyDown={handleKeyDown}
                                    ref={schemeNm}
                                    maxLength={100}

                                />
                                {!isValidContractorName && (
                                    <div style={{ color: "red" }}>
                                        Please enter a valid Scheme Name
                                    </div>
                                )}
                            </div>

                            <div className="w-1/8 px-2">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Scheme Abv

                                </label>
                                <input
                                    ref={schemeAbv}
                                    id="scheme_name"
                                    name="scheme_name"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Scheme Abbreviation"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                    required
                                />

                            </div>

                            <div className="w-1/8 px-2">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Scheme Type
                                </label>
                                <input
                                    ref={schemeType}
                                    id="scheme_name"
                                    name="scheme_name"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Scheme Type"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                    required
                                // onChange={onMobile}
                                // maxLength={10}
                                />
                                {/* {!isValidMobile && (
                                    <div style={{ color: "red" }}>
                                        Please enter a valid Mobile Number
                                    </div>
                                )} */}
                            </div>

                            <div className="w-1/8 ">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Scheme Description
                                </label>
                                <input
                                    ref={schemeDsc}
                                    id="scheme_name"
                                    name="scheme_name"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Scheme Description"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                    onChange={onAddress}
                                />
                                {!isValidAddress && (
                                    <div style={{ color: "red" }}>Please enter a valid Description</div>
                                )}
                            </div >
                        </div>
                        <div className="w-1/8">
                            <button
                                type="button"
                                className={classNames(
                                    "btn-submit  py-1 px-10 border mt-2 border-transparent rounded-md shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                                    mutationId
                                        ? "btn-submit  py-1 px-10 border mt-2 border-transparent rounded-md shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        : "btn-submit  py-1 px-10 border mt-2 border-transparent rounded-md shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                )}
                                onClick={performMutation}
                                
                            >
                                {!mutationId ? "Submit" : "Update"}
                            </button>
                        </div>
                    </div>
                </div>
                <div className=" flex justify-between  items-center h-12">
                    <select
                        className="rounded-lg"
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
                    <input
                        type="text"
                        value={filtering}
                        placeholder="search..."
                        className="border-2 rounded-lg border-zinc-400"
                        onChange={(e) => setFiltering(e.target.value)}
                    />
                </div>
                <div className=" flex flex-col space-y-4 pb-8">
                    <Table style={{ border: "1px solid #444 " }}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Table.Head key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <Table.HeadCell
                                        style={{ border: "1px solid #444 " }}
                                        key={header.id}
                                        className={classNames(
                                            header.column.columnDef.headclass,
                                            " bg-cyan-400/90 btn-blue transition-all whitespace-nowrap"
                                        )}
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
                                <Table.HeadCell className="normal-case bg-cyan-400/90 btn-blue">
                                    Actions
                                </Table.HeadCell>
                            </Table.Head>
                        ))}
                        
                            <Table.Body className="divide-y" style={{ border: "1px solid #444 " }}>
                                {table.getRowModel().rows.map((row) => (
                                    <Table.Row key={row.id} style={{ border: "1px solid #444 " }}>
                                        {row.getVisibleCells().map((cell) => (
                                            <Table.Cell
                                                style={{ border: "1px solid #444 " }}
                                                key={cell.id}
                                                className={cell.column.columnDef.className}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </Table.Cell>
                                        ))}

                                        <Table.Cell className="flex items-center justify-center space-x-8">
                                            <button
                                                onClick={() => {
                                                    // designation.current.value = row.original.designation;
                                                    schemeid.current.value = row.original.schemeId;
                                                    schemeNm.current.value = row.original.schemeName;
                                                    schemeAbv.current.value = row.original.schemeAbv;
                                                    schemeType.current.value = row.original.schemeType;
                                                    schemeDsc.current.value = row.original.schemeDesc;
                                                    setMutationId(row.original?.schemeid);
                                                    window.scrollTo({
                                                        top: 0,
                                                        behavior: "smooth",
                                                    });
                                                }}
                                            >
                                                <Icon
                                                    icon={"mingcute:edit-line"}
                                                    className="font-medium text-cyan-600 hover:underline text-2xl cursor-pointer"
                                                />
                                            </button>
                                        </Table.Cell>
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

export default SchemeMaster;
