import React from "react";
import { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import * as XLSX from "xlsx";

import { getAllGlGroupList } from "../../../Service/Transaction/TransactionService";

const AdvanceRegister = () => {
  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState(getCurrentDate());

  const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
  const userData = JSON.parse(jsonString);

  const printRef = useRef();

  const [partyTypeAllList, setPartyTypeAllList] = useState([]);
  const [glGroup, setGlGroup] = useState();

  const [partyType, setPartyType] = useState("");
  const [partyList, setPartyList] = useState([]);
  const [partyCode, setPartyCode] = useState("");

  const [advanceRegisterData, setAdvanceRegisterData] = useState([]);
  const [loadingParty, setLoadingParty] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const lgdCode = userData?.CORE_LGD || 319;

  const onFromDate = (e) => {
    setFromDate(e.target.value);
  };

  const onGlGroup = (e) => {
    setGlGroup(e.target.value);
  };

  const onPartyTypeChange = async (e) => {
    const selectedType = e.target.value;

    setPartyType(selectedType);
    setPartyCode("");
    setPartyList([]);
    setAdvanceRegisterData([]);

    if (!selectedType) return;

    try {
      setLoadingParty(true);

      let url = "";

      if (selectedType === "J") {
        url = `https://javaapi.wbpms.in/api/JobWorker/Get?lgdCode=${lgdCode}&jobWorkerName=0`;
      } else if (selectedType === "E") {
        url = `https://javaapi.wbpms.in/api/Employee/Get?lgdCode=${lgdCode}&empName=0`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (Array.isArray(data)) {
        setPartyList(data);
      } else {
        setPartyList([]);
        toast.error("Invalid party response");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch party list");
    } finally {
      setLoadingParty(false);
    }
  };

  const onSearch = async () => {
    if (!glGroup) {
      toast.error("Please select GL Group");
      return;
    }

    if (!fromDate) {
      toast.error("Please select a From Date");
      return;
    }

    if (!toDate) {
      toast.error("Please select a To Date");
      return;
    }

    if (!partyType) {
      toast.error("Please select Party Type");
      return;
    }

    if (!partyCode) {
      toast.error("Please select Party");
      return;
    }

    try {
      setLoadingSearch(true);
      setAdvanceRegisterData([]);

      const url =
        `https://javaapi.wbpms.in/api/Register/AdvanceRegister` +
        `?lgdCode=${lgdCode}` +
        `&frmDate=${fromDate}` +
        `&toDate=${toDate}` +
        `&glGroup=${glGroup}` +
        `&partyCode=${partyCode}`;

      const response = await fetch(url);
      const result = await response.json();

      if (result?.status === 0 && Array.isArray(result?.data)) {
        setAdvanceRegisterData(result.data);
      } else {
        setAdvanceRegisterData([]);
        toast.error(result?.message || "No data found");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch advance register data");
    } finally {
      setLoadingSearch(false);
    }
  };

  const downloadExcel = () => {
    if (!advanceRegisterData || advanceRegisterData.length === 0) {
      toast.error("No data available to download");
      return;
    }

    const excelData = advanceRegisterData.map((item, index) => ({
      "Sl No.": index + 1,
      Type: item?.type || "",
      Date: item?.advAdjDate || "",
      "Voucher ID": item?.voucherId || "",
      Narration: item?.voucherNarration || "",
      Amount: item?.advAdjAmount || "",
      Mode: item?.mode || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Advance Register");
    XLSX.writeFile(workbook, "Advance_Register.xlsx");
  };

  useEffect(() => {
    getAllGlGroupList(userData?.CORE_LGD, 0).then(function (result) {
      const response = result?.data;
      setPartyTypeAllList(response || []);
    });
  }, []);

  return (
    <>
      <ToastContainer />

      <div
        className="bg-white rounded-lg p-2 flex flex-col flex-grow"
        style={{ marginTop: "-40px" }}
      >
        <legend className="text-lg font-semibold text-cyan-700">
          Advance Register
        </legend>

        <div className="flex flex-col space-y-2 py-3">
          <div className="flex flex-col w-full space-y-1">
            <div className="flex items-center space-x-4">
              <div className="w-1/3">
                <label
                  htmlFor="scheme_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  GL Group
                </label>

                <select
                  className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
                  onChange={onGlGroup}
                  value={glGroup}
                >
                  <option value="">--Select GL Group--</option>

                  {partyTypeAllList?.map((item, index) => (
                    <option key={index} value={item?.groupId}>
                      {item?.groupName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-1/5 px-2">
                <label className="block text-sm font-medium text-gray-700">
                  Party Type<span className="text-red-500"> * </span>
                </label>

                <select
                  className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
                  value={partyType}
                  onChange={onPartyTypeChange}
                >
                  <option value="">--Select Type--</option>
                  <option value="J">Job Worker</option>
                  <option value="E">Employee</option>
                </select>
              </div>

              <div className="w-1/5 px-2">
                <label className="block text-sm font-medium text-gray-700">
                  Party<span className="text-red-500"> * </span>
                </label>

                <select
                  className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
                  value={partyCode}
                  onChange={(e) => setPartyCode(e.target.value)}
                  disabled={!partyType || loadingParty}
                >
                  <option value="">
                    {loadingParty ? "Loading..." : "--Select Party--"}
                  </option>

                  {partyList?.map((item, index) => (
                    <option
                      key={index}
                      value={partyType === "J" ? item?.jobWorkerId : item?.empId}
                    >
                      {partyType === "J" ? item?.jobWorkerName : item?.empName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-1/5 px-2">
                <label
                  htmlFor="from_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  From Date<span className="text-red-500"> * </span>
                </label>

                <input
                  type="date"
                  id="from_date"
                  className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
                  value={fromDate}
                  onChange={onFromDate}
                />
              </div>

              <div className="w-1/5 px-2">
                <label
                  htmlFor="to_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  To Date<span className="text-red-500"> * </span>
                </label>

                <input
                  type="date"
                  id="to_date"
                  className="text-sm block w-full p-1 h-9 border border-gray-300 rounded-md"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>

              <div className="w-1/6 flex items-end justify-center gap-2">
                <button
                  type="button"
                  className="btn-submit h-9 px-2 mt-5 shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={onSearch}
                  disabled={loadingSearch}
                >
                  {loadingSearch ? "Searching..." : "Search"}
                </button>

                <button
                  type="button"
                  className="btn-submit h-9 px-2 mt-5 shadow-sm text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={downloadExcel}
                >
                  Excel
                </button>
              </div>
            </div>
          </div>
        </div>

        {advanceRegisterData?.length > 0 && (
          <div className="mt-4 flex justify-center">
            <div className="overflow-x-auto w-full max-w-6xl" ref={printRef}>
              <table className="border border-gray-300 text-sm mx-auto">
                <thead className="bg-cyan-700 text-white">
                  <tr>
                    <th className="border px-2 py-1">Sl No.</th>
                    <th className="border px-2 py-1">Type</th>
                    <th className="border px-2 py-1">Date</th>
                    <th className="border px-2 py-1">Voucher ID</th>
                    <th className="border px-2 py-1">Narration</th>
                    <th className="border px-2 py-1">Amount</th>
                    <th className="border px-2 py-1">Mode</th>
                  </tr>
                </thead>

                <tbody>
                  {advanceRegisterData.map((item, index) => {

                    // 🔴 Skip all Unadjusted Amount except LAST one
                    if (
                      item?.type === "Unadjusted Amount" &&
                      index !== advanceRegisterData.length - 1
                    ) {
                      return null;
                    }

                    // 🔴 Last Unadjusted Amount → show under narration
                    if (item?.type === "Unadjusted Amount") {
                      return (
                        <tr key={index}>
                          <td className="border px-2 py-1 text-center">
                            {index + 1}
                          </td>

                          {/* Type column empty */}
                          <td className="border px-2 py-1"></td>

                          <td className="border px-2 py-1"></td>
                          <td className="border px-2 py-1"></td>

                          {/* Show only here */}
                          <td className="border px-2 py-1 text-left">
                            Unadjusted Amount
                          </td>

                          <td className="border px-2 py-1 text-right">
                            {item?.advAdjAmount}
                          </td>

                          <td className="border px-2 py-1"></td>
                        </tr>
                      );
                    }

                    // 🟢 Normal rows (no change)
                    return (
                      <tr key={index}>
                        <td className="border px-2 py-1 text-center">
                          {index + 1}
                        </td>
                        <td className="border px-2 py-1">{item?.type}</td>
                        <td className="border px-2 py-1">{item?.advAdjDate}</td>
                        <td className="border px-2 py-1">{item?.voucherId}</td>
                        <td className="border px-2 py-1">{item?.voucherNarration}</td>
                        <td className="border px-2 py-1 text-right">
                          {item?.advAdjAmount}
                        </td>
                        <td className="border px-2 py-1">{item?.mode}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdvanceRegister;