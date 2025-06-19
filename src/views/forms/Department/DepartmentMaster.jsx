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


const DepartmentMaster = () => {
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
    const jsonString = localStorage.getItem("IEC_DETAILS_USER");
    const userData = JSON.parse(jsonString);
    const [openModal, setOpenModal] = useState(false);


    const { data: schemeList } = useQuery({
        queryKey: ["schemeList"],
        queryFn: async () => {
            const data = await fetch.get("/Department/Get?deptName="+0);
            // console.log(Array.isArray(data.data.result));
            return data?.data;
        },
    });


    console.log(mutationId, "mutationId")

    const deptId = useRef(null);
    const deptNm = useRef(null);
    const deptAbv = useRef(null);

    const queryClient = useQueryClient();

    const { mutate: addPed, isPending: addPending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(newTodo, "/Department/Insert");
        },
        onSuccess: () => {
            queryClient.invalidateQueries("schemeList");
            // designation.current.value = "";
            deptId.current.value = "";
            deptNm.current.value = "";
            deptAbv.current.value = "";
           
        },
        mutationKey: ["adddesignation"],
    });
    console.log(mutationId, "mutationId")
    const { mutate: updatePed, isPending: updatePending } = useMutation({
        mutationFn: (newTodo) => {
            return fetch.post(
                newTodo,
                "/Department/update"
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries("schemeList");
            // designation.current.value = "";
            deptId.current.value = "";
            deptNm.current.value = "";
            deptAbv.current.value = "";
          
            setMutationId(null);
        },
        mutationKey: ["updatedesignation"],
    });

    function performMutation() {
        if (deptNm.current.value === "") {
            toast.error("Please Type Scheme name")
        }  else {
            if (mutationId === null)
                addPed({
                    "deptId": deptId.current.value,
                    "deptName": deptNm.current.value,
                    "deptAbv": deptAbv.current.value,
                   
                });
            else
                updatePed({
                    "deptId": deptId.current.value,
                    "deptName": deptNm.current.value,
                    "deptAbv": deptAbv.current.value,
                    
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
            header: "Department Id",
            accessorKey: "deptId",
            headclass: "cursor-pointer",
        },
        {
            header: "Department Name",
            accessorKey: "deptName",
            headclass: "cursor-pointer",
        },
        {
            header: "Department Abbreviation",
            accessorKey: "deptAbv",
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
        deptAbv.current.value = e.target.value.toUpperCase()

        setPanNumber(value);

    }

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

            <div className="bg-white rounded-lg p-1 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
            <legend className="text-lg font-semibold text-cyan-700">Department Master</legend>

                <div className=" flex flex-col space-y-2 py-1">
                    <div className="flex flex-col w-full mb-4 space-y-2">
                        <div className="flex items-center ">

                            <div className="px-2">

                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Department Id <span className="text-red-500 "> * </span>

                                </label>
                                <input
                                    id="scheme_id"
                                    name="scheme_id"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Department Id"
                                    className="mt-1 p-1 block border border-gray-300 rounded-md"
                                    onChange={ondeptId}
                                    // onKeyDown={handleKeyDown}
                                    ref={deptId}
                                    maxLength={2}

                                />

                            </div>
                            <div className="">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Department Name <span className="text-red-500 "> * </span>

                                </label>
                                <input
                                    id="contractor_name"
                                    name="contractor_name"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Department Name"
                                    className="mt-1 p-1 block border border-gray-300 rounded-md"
                                    onChange={onDepartmentName}
                                    // onKeyDown={handleKeyDown}
                                    ref={deptNm}

                                />
                             
                            </div>

                            <div className="w-1/4 px-2">
                                <label
                                    htmlFor="scheme_name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Department Abv

                                </label>
                                <input
                                    ref={deptAbv}
                                    id="scheme_name"
                                    name="scheme_name"
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Department Abbreviation"
                                    className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                                    required
                                />

                            </div>
                            <div className="w-1/6">
                            <button
                                type="button"
                                className={classNames(
                                    "btn-submit  py-1 px-10 border mt-6 border-transparent rounded-md shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                                    mutationId
                                        ? "btn-submit  py-1 px-10 border mt-6 border-transparent rounded-md shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        : "btn-submit  py-1 px-10 border mt-6 border-transparent rounded-md shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                )}
                                onClick={performMutation}
                                
                            >
                                {!mutationId ? "Submit" : "Update"}
                            </button>
                        </div>
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
                <div className=" flex flex-col space-y-6 pb-8">
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
                                                deptId.current.value = row.original.deptId;
                                                deptNm.current.value = row.original.deptName;
                                                deptAbv.current.value = row.original.deptAbv;
                                               
                                                setMutationId(row.original?.deptId);
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

export default DepartmentMaster;
