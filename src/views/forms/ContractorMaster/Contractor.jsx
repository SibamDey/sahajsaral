import { useState, useEffect, useRef, useMemo } from "react";

import { Icon } from "@iconify/react/dist/iconify.js";
import { Table } from "flowbite-react";
// import { exportToCSV, exportToExcel } from "../../functions/exportData";
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
import * as XLSX from "xlsx";

import { addCreateContractor } from "../../../Service/Contractor/ContractorService";
const Contractor = () => {
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
  const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
  const userData = JSON.parse(jsonString);
  const [openModal, setOpenModal] = useState(false);


  const { data: contractorList } = useQuery({
    queryKey: ["contractorList"],
    queryFn: async () => {
      const data = await fetch.get("/Contractor/Get?lgdCode=" + (userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD) + "&contractorName=" + 0);
      // console.log(Array.isArray(data.data.result));
      return data?.data;
    },
  });


  console.log(mutationId, "mutationId")
  const designation = useRef(null);
  const contractorNm = useRef(null);
  const contractorDob = useRef(null);
  const contractorGstin = useRef(null);
  const contractorPan = useRef(null);
  const contractorMob = useRef(null);
  const contractorAddress = useRef(null);
  const queryClient = useQueryClient();

  const { mutate: addPed, isPending: addPending } = useMutation({
    mutationFn: (newTodo) => {
      return fetch.post(newTodo, "/Contractor/Insert");
    },
    onSuccess: () => {
      queryClient.invalidateQueries("contractorList");
      // designation.current.value = "";
      contractorNm.current.value = "";
      contractorDob.current.value = "";
      contractorGstin.current.value = "";
      contractorPan.current.value = "";
      contractorMob.current.value = "";
      contractorAddress.current.value = "";
      setCurrentDate("");
    },
    mutationKey: ["adddesignation"],
  });
  console.log(mutationId, "mutationId")
  const { mutate: updatePed, isPending: updatePending } = useMutation({
    mutationFn: (newTodo) => {
      return fetch.post(
        newTodo,
        "/contractor/update"
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries("contractorList");
      // designation.current.value = "";
      contractorNm.current.value = "";
      contractorDob.current.value = "";
      contractorGstin.current.value = "";
      contractorPan.current.value = "";
      contractorMob.current.value = "";
      contractorAddress.current.value = "";
      setCurrentDate("")
      setMutationId(null);
    },
    mutationKey: ["updatedesignation"],
  });

  function performMutation() {
    if (contractorNm.current.value === "") {
      toast.error("Please Type Contractor name")
    } else {
      if (mutationId === null)
        addPed({
          "lgdCode": userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD,
          "contractorNm": contractorNm.current.value,
          "contractorPan": contractorPan.current.value,
          "contractorAdd": contractorAddress.current.value,
          "contractorPh": contractorMob.current.value,
          "contractorGstin": contractorGstin.current.value,
          "contractorDob": currentDate === "" ? null : currentDate,
          "lgdType": userData?.USER_LEVEL === "GP" ? "3" : userData?.USER_LEVEL === "BLOCK" ? "2" : "1",
        });
      else
        updatePed({
          "lgdCode": userData?.CORE_LGD,
          "contractorId": mutationId,
          "contractorNm": contractorNm.current.value,
          "contractorPan": contractorPan.current.value,
          "contractorAdd": contractorAddress.current.value,
          "contractorPh": contractorMob.current.value,
          "contractorGstin": contractorGstin.current.value,
          "contractorDob": currentDate ? currentDate : null,
          "lgdType": userData?.USER_LEVEL === "GP" ? "3" : userData?.USER_LEVEL === "BLOCK" ? "2" : "1",
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
    const sortedList = [...(contractorList ?? [])];
    sortedList.sort((a, b) => b.designationId - a.designationId);
    return sortedList;
  }, [contractorList]);

  const list = [
    {
      header: "ID",
      accessorKey: "contractorId",
      className: "text-left cursor-pointer",
      // cell: ({ row }) => row.index + 1,
      headclass: "cursor-pointer w-32",
    },
    {
      header: "Contractor Name",
      accessorKey: "contractorNm",
      headclass: "cursor-pointer",
    },
    {
      header: "Contractor GSTIN",
      accessorKey: "contractorGstin",
      headclass: "cursor-pointer",
    },

    {
      header: "Contractor PAN",
      accessorKey: "contractorPan",
      headclass: "cursor-pointer",
    },

    {
      header: "Contractor Mobile Number",
      accessorKey: "contractorPh",
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

  // function rowToArray() {
  //   let array = [];
  //   table.getFilteredRowModel().rows.forEach((row) => {
  //     const cells = row.getVisibleCells();
  //     const values = cells.map((cell) => cell.getValue());
  //     array.push(values);
  //   });

  //   return array;
  // }

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
    setContractorName(e.target.value);

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

  // Function to extract PAN from GST number
  function extractPANFromGST(gstNumber) {
    if (gstNumber.length === 15) {
      return gstNumber.substring(2, 12);
    }
    return '';
  }


  const onGstIn = (event) => {
    const value = event.target.value.toUpperCase();
    // Regular expression to match GSTIN format
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    if (regex.test(value) || value === '') {
      setGSTIN(value);
      setIsValid(true);
    } else {
      setIsValid(false);
    }

    if (value.length === 15) {
      const extractedPan = extractPANFromGST(value);
      contractorPan.current.value = extractedPan;
      setPanNumber(extractedPan);
    } else {
      setPanNumber('');
    }
  };


  const onDate = (e) => {
    console.log(e, "eeeee")
    // contractorDob.current.value = e;
    // console.log(new Date(e).toLocaleDateString("en-IN"))
    setCurrentDate(e.target.value)
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
    contractorPan.current.value = e.target.value.toUpperCase()

    setPanNumber(value);

  }

  const onSubmit = () => {
    console.log("CLICKED")

    if (contractorName === '') {
      toast.error("Please Type Contractor name")
    }
    // else if (currentDate === "") {
    //   toast.error("Please add Contractor DOB")
    // } else if (mobileNumber === "") {
    //   toast.error("Please Type Contractor Mobile number")
    // }
    else {
      addCreateContractor(
        contractorName, gstin, panNumber, mobileNumber, address, currentDate, userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD, userData?.USER_LEVEL === "GP" ? "3" : userData?.USER_LEVEL === "BLOCK" ? "2" : "1",
        (r) => {
          console.log(r, "GPMSSIBAM");
          if (r.statusCode === "0") {
            setOpenModal(true);

          } else {
            toast.error(r.msg);
          }
        }
      );
    }
  }

  console.log(contractorPan?.current?.value, "contractorPan")
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
        <legend className="text-lg font-semibold text-cyan-700">Contractor Master</legend>
        <div className=" flex flex-col space-y-1 py-1">
          <div className="flex flex-col w-full mb-4 space-y-1">
            <div className="flex items-center gap-1">
              {/* Contractor Name */}
              <div className="flex-1">
                <label
                  htmlFor="contractor_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contractor Name <span className="text-red-500"> * </span>
                </label>
                <input
                  id="contractor_name"
                  name="contractor_name"
                  type="text"
                  autoComplete="off"
                  placeholder="Contractor Name"
                  className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                  onChange={onContractorName}
                  // onKeyDown={handleKeyDown}
                  ref={contractorNm}
                  maxLength={100}
                />
                {/* {!isValidContractorName && (
                  <div style={{ color: "red" }}>Please enter a valid Contractor Name</div>
                )} */}
              </div>

              {/* Contractor Date of Birth */}
              <div className="flex-1">
                <label
                  htmlFor="contractor_dob"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contractor Date of Birth
                </label>
                <input
                  type="date"
                  onChange={onDate}
                  portalId="root-portal"
                  className="mt-1 p-1 block w-full border border-gray-300 rounded-md cursor-pointer"
                  value={currentDate}
                />
              </div>

              {/* Contractor GSTIN */}
              <div className="flex-1">
                <label
                  htmlFor="contractor_gstin"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contractor GSTIN
                </label>
                <input
                  ref={contractorGstin}
                  id="contractor_gstin"
                  name="contractor_gstin"
                  type="text"
                  autoComplete="off"
                  placeholder="Contractor GSTIN"
                  className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                  onChange={onGstIn}
                  maxLength={15}
                />
                {!isValid && <div style={{ color: "red" }}>Please enter a valid GSTIN</div>}
              </div>

              {/* Contractor PAN */}
              <div className="flex-1">
                <label
                  htmlFor="contractor_pan"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contractor PAN
                </label>
                <input
                  ref={contractorPan}
                  id="contractor_pan"
                  name="contractor_pan"
                  type="text"
                  autoComplete="off"
                  placeholder="Contractor PAN"
                  className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                  required
                  onChange={onPanCard}
                  maxLength={10}
                />
                {!isValidPan && (
                  <div style={{ color: "red" }}>Please enter a valid PAN Number</div>
                )}
              </div>
              {/* Contractor Mobile */}
              <div className="flex-1">
                <label
                  htmlFor="contractor_mobile"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contractor Mobile
                </label>
                <input
                  ref={contractorMob}
                  id="contractor_mobile"
                  name="contractor_mobile"
                  type="text"
                  autoComplete="off"
                  placeholder="Contractor Mobile"
                  className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                  required
                  onChange={onMobile}
                  maxLength={10}
                />
                {!isValidMobile && (
                  <div style={{ color: "red" }}>Please enter a valid Mobile Number</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6">


              {/* Contractor Address */}
              <div className="w-1/4">
                <label
                  htmlFor="contractor_address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contractor Address
                </label>
                <input
                  ref={contractorAddress}
                  id="contractor_address"
                  name="contractor_address"
                  type="text"
                  autoComplete="off"
                  placeholder="Contractor Address"
                  className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                  onChange={onAddress}
                />

              </div>

              {/* Submit Button */}
              {userData?.ROLE === "9" ? "" :

                <div className="flex-none">
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
                </div>}
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
              onClick={() => exportToExcel(data, "CONTRACTOR_LIST")}
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
          {/* <button
              className="border px-4 h-[42px] bg-green-600/90 text-white rounded"
              onClick={() =>
                exportToExcel(rowToArray(), table, "contractorList")
              }
              // onClick={rowToArray}
            >
              XLSX
            </button> */}
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
                <Table.HeadCell className="normal-case bg-cyan-400/90 btn-blue">
                  Edit
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
                      className="p-1 text-xs"

                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </Table.Cell>
                  ))}

                  <Table.Cell className="border-gray-600 flex items-center justify-center space-x-4 p-1">
                    <button
                      onClick={() => {
                        // designation.current.value = row.original.designation;
                        contractorNm.current.value = row.original.contractorNm;
                        // contractorDob.current.value = row.original.contractorDob;
                        contractorGstin.current.value = row.original.contractorGstin;
                        contractorPan.current.value = row.original.contractorPan;
                        contractorAddress.current.value = row.original.contractorAdd;
                        contractorMob.current.value = row.original.contractorPh;
                        setCurrentDate(row?.original?.contractorDob);
                        setMutationId(row?.original?.contractorId);
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

export default Contractor;
