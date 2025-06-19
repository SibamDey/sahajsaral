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
import * as XLSX from "xlsx";
import { addCreateContractor } from "../../../Service/Contractor/ContractorService";
const LsgMaster = () => {
  const [mutationId, setMutationId] = useState(null);
  const [contractorName, setContractorName] = useState('');
  const [gstin, setGSTIN] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [gstinTax, setGSTINTax] = useState('');
  const [isValidTax, setIsValidTax] = useState(true);


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


  const { data: lsgList } = useQuery({
    queryKey: ["lsgList"],
    queryFn: async () => {
      const data = await fetch.get(`/LSG/Get?lgdCode=${userData?.USER_LEVEL === "HQ" ? 0 : userData?.CORE_LGD}`);
      // console.log(Array.isArray(data.data.result));
      return data?.data;
    },
  });

  console.log(lsgList, "lsgList")


  const designation = useRef(null);
  const tanNo = useRef(null);
  const contractorDob = useRef(null);
  const gstNo = useRef(null);
  const panNo = useRef(null);
  const ddoCode = useRef(null);
  const lsgAdd1 = useRef(null);
  const gstNoTax = useRef(null);
  const queryClient = useQueryClient();

  const { mutate: addPed, isPending: addPending } = useMutation({
    mutationFn: (newTodo) => {
      return fetch.post(newTodo, "/contractor/add");
    },
    onSuccess: () => {
      queryClient.invalidateQueries("lsgList");
      tanNo.current.value = "";
      gstNo.current.value = "";
      panNo.current.value = "";
      ddoCode.current.value = "";
      lsgAdd1.current.value = "";
      gstNoTax.current.value = "";
    },
    mutationKey: ["adddesignation"],
  });

  const { mutate: updatePed, isPending: updatePending } = useMutation({
    mutationFn: (newTodo) => {
      return fetch.post(
        newTodo,
        "/lsg/update"
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries("lsgList");
      tanNo.current.value = "";
      gstNo.current.value = "";
      panNo.current.value = "";
      ddoCode.current.value = "";
      gstNoTax.current.value = "";
      lsgAdd1.current.value = "";
      setMutationId(null);
    },
    mutationKey: ["updatedesignation"],
  });

  function performMutation() {

    if (mutationId === null)
      addPed({
        "lgdCode": userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD,
        "tanNo": tanNo.current.value,
        "panNo": panNo.current.value,
        "contractorAdd": lsgAdd1.current.value,
        "contractorPh": ddoCode.current.value,
        "gstNo": gstNo.current.value,
        "gstNoPayer": gstNoTax.current.value,
        "contractorDob": currentDate,
        "lgdType": userData?.USER_LEVEL === "GP" ? "3" : userData?.USER_LEVEL === "BLOCK" ? "2" : "1",
      });
    else
      updatePed({
        "lgdCode": userData?.USER_LEVEL === "HQ" ? 0 : userData?.CORE_LGD,
        "tanNo": tanNo.current.value,
        "panNo": panNo.current.value,
        "lgdAddress1": lsgAdd1.current.value,
        "lgdAddress2": "",
        "gstNo": gstNo.current.value,
        "gstNoPayer": gstNoTax.current.value,
        "ddoCode": ddoCode.current.value,


      });

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
    const sortedList = [...(lsgList ?? [])];
    sortedList.sort((a, b) => b?.designationId - a?.designationId);
    return sortedList;
  }, [lsgList]);



  console.log(data, "data")
  const list = [

    {
      header: "LSG Name",
      accessorKey: "lsgName",
      headclass: "cursor-pointer",

    },


    {
      header: "PAN",
      accessorKey: "panNo",
      headclass: "cursor-pointer",
    },

    {
      header: "TAN",
      accessorKey: "tanNo",
      headclass: "cursor-pointer",
    },
    {
      header: "GSTIN as Tax Deductor",
      accessorKey: "gstNo",
      headclass: "cursor-pointer",

    },
    {
      header: "GSTIN as Tax Payer",
      accessorKey: "gstNoPayer",
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
      panNo.current.value = extractedPan;
      setPanNumber(extractedPan);
    } else {
      setPanNumber('');
    }
  };
  const onGstInTaxPayer = (event) => {
    const value = event.target.value.toUpperCase();
    // Regular expression to match GSTIN format
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    if (regex.test(value) || value === '') {
      setGSTINTax(value);
      setIsValidTax(true);
    } else {
      setIsValidTax(false);
    }

    if (value.length === 15) {
      const extractedPan = extractPANFromGST(value);
      panNo.current.value = extractedPan;
      setPanNumber(extractedPan);
    } else {
      setPanNumber('');
    }
  }





  const onPanCard = (e) => {
    const value = e.target.value.toUpperCase()
    panNo.current.value = e.target.value.toUpperCase()

    setPanNumber(value);

  }

  const onTanNumber = (e) => {
    tanNo.current.value = e.target.value.toUpperCase()
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

      <div className="bg-white rounded-lg p-1 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
        <legend className="text-lg font-semibold text-cyan-700">PRI Master</legend>

        <div className=" flex flex-col space-y-2 py-1">
          <div className="flex flex-col w-full mb-4 space-y-2">
            <div className="flex items-center space-x-4">
              <div className="w-1/3">
                <label
                  htmlFor="pan_number"
                  className="block text-sm font-medium text-gray-700"
                >
                  PAN
                </label>
                <input
                  ref={panNo}
                  id="pan_number"
                  name="pan_number"
                  type="text"
                  autoComplete="off"
                  placeholder="PAN"
                  className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                  required
                  onChange={onPanCard}
                  maxLength={10}
                />
                {!isValidPan && (
                  <div style={{ color: "red" }}>Please enter a valid PAN Number</div>
                )}
              </div>

              <div className="w-1/3">
                <label
                  htmlFor="tan_number"
                  className="block text-sm font-medium text-gray-700"
                >
                  TAN
                </label>
                <input
                  ref={tanNo}
                  id="tan_number"
                  name="tan_number"
                  type="text"
                  autoComplete="off"
                  placeholder="TAN"
                  className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                  required
                  onChange={onTanNumber}
                  maxLength={10}
                />
                {!isValidPan && (
                  <div style={{ color: "red" }}>Please enter a valid TAN Number</div>
                )}
              </div>

              <div className="w-1/3">
                <label
                  htmlFor="gstin_number"
                  className="block text-sm font-medium text-gray-700"
                >
                  GSTIN as Tax Deductor
                </label>
                <input
                  ref={gstNo}
                  id="gstin_number"
                  name="gstin_number"
                  type="text"
                  autoComplete="off"
                  placeholder="GSTIN as Tax Deductor"
                  className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                  onChange={onGstIn}
                  maxLength={15}
                />
                {/* {!isValid && (
                  <div style={{ color: "red" }}>Please enter a valid GSTIN as Tax Deductor</div>
                )} */}
              </div>

              <div className="w-1/3">
                <label
                  htmlFor="gstin_number"
                  className="block text-sm font-medium text-gray-700"
                >
                  GSTIN as Tax Payer
                </label>
                <input
                  ref={gstNoTax}
                  id="gstin_number"
                  name="gstin_number"
                  type="text"
                  autoComplete="off"
                  placeholder="GSTIN as Tax Payer"
                  className="mt-1 p-1 w-full border border-gray-300 rounded-md"
                  onChange={onGstInTaxPayer}
                  maxLength={15}
                />
                {!isValid && (
                  <div style={{ color: "red" }}>Please enter a valid GSTIN as Tax Payer</div>
                )}
              </div>



              <div className="w-1/3">
                <label
                  htmlFor="scheme_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  LSG Address
                </label>
                <input
                  ref={lsgAdd1}
                  id="scheme_name"
                  name="scheme_name"
                  type="text"
                  autoComplete="off"
                  placeholder="LSG Address"
                  className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                  onChange={onAddress}
                />
                {!isValidAddress && (
                  <div style={{ color: "red" }}>Please enter a valid Address</div>
                )}
              </div >



              <div className="w-1/3">
                <label
                  htmlFor="scheme_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  DDO Code (ZP/PS)
                </label>
                <input
                  ref={ddoCode}
                  id="scheme_name"
                  name="scheme_name"
                  type="text"
                  autoComplete="off"
                  placeholder="DDO Code"
                  className="mt-1 p-1 block w-full border border-gray-300 rounded-md"
                  onChange={onAddress}
                />
                {!isValidAddress && (
                  <div style={{ color: "red" }}>Please enter a valid Address</div>
                )}
              </div >
            </div>

            <div className="flex items-center">


              {!mutationId ? "" :
                <div className="w-1/6">
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
                    {"Update"}
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
              onClick={() => exportToExcel(data, "PRI_MASTER")}

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

        <div className="flex flex-col space-y-6 pb-8">
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
                <Table.HeadCell className="p-1 normal-case bg-cyan-400/90 border-black btn-blue text-xs">
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
                        tanNo.current.value = row.original.tanNo;
                        gstNo.current.value = row.original.gstNo;
                        panNo.current.value = row.original.panNo;
                        lsgAdd1.current.value = row.original.lgdAdd1;
                        ddoCode.current.value = row.original.ddoCode;
                        gstNoTax.current.value = row.original.gstNoPayer;
                        setMutationId(row.original.lsgCode);
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
          {lsgList?.length === 0 ? <div className="flex items-center justify-center bg-gray-200" style={{ marginTop: "10px" }}>
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-black-800">No Data Found</h1>
              <p className="text-black-600 mt-1">Please try again later.</p>
            </div>
          </div> : ""}

          <Pagination data={data} table={table} />
        </div>
      </div>
    </>
  );
};

export default LsgMaster;
