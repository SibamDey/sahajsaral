import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { ToastContainer, toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { fetch } from "../../../functions/Fetchfunctions";
import { useReactToPrint } from "react-to-print";
import QRCode from "qrcode";
import {
  getSearchRptPaymantCertificate,
} from "../../../Service/Document/DocumentService";
import logo from "../../../Img/logo.png";
import { getLgdDetails } from "../../../Service/LgdCodeGet/LgdCodeService";

/* ---------- SESSION USER + SIGNATURE HELPERS ---------- */

const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
const userData = JSON.parse(jsonString || "{}");

const getSignatureText = () => {
  const level = userData?.USER_LEVEL;

  if (level === "BLOCK") return "Executive Officer / Joint Executive Officer";
  if (level === "DIST") return "AEO / FCCAO";
  if (level === "GP") return "Executive Assistant";

  return "Authorized Signatory"; // fallback
};

const getLevelText = () => {
  const level = userData?.USER_LEVEL;

  if (level === "BLOCK") return "Panchayat Samiti";
  if (level === "DIST") return "Zilla Parishad";
  if (level === "GP") return "Gram Panchayat";

  return "Authorized Signatory"; // fallback
};

/* ------------------- COMMON HELPERS ------------------- */

// Derive Indian Financial Year from a date string
const getFinancialYearLabel = (dateStr) => {
  if (!dateStr) return "____-____";

  let normalized = dateStr.trim();

  // Convert DD.MM.YYYY → YYYY-MM-DD
  if (normalized.includes(".")) {
    const parts = normalized.split(".");
    if (parts.length === 3) {
      normalized = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(
        2,
        "0"
      )}`;
    }
  }

  // Convert DD/MM/YYYY or DD-MM-YYYY → YYYY-MM-DD
  if (normalized.includes("/") || normalized.includes("-")) {
    const parts = normalized.split(/[-\/]/);
    if (parts.length === 3 && parts[0].length <= 2) {
      normalized = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(
        2,
        "0"
      )}`;
    }
  }

  const d = new Date(normalized);

  if (isNaN(d)) return "____-____";

  const year = d.getFullYear();
  const month = d.getMonth(); // 0=Jan, 3=Apr

  // Indian Financial Year rule
  const fyStart = month >= 3 ? year : year - 1;
  const fyEnd = (fyStart + 1).toString().slice(-2);

  return `${fyStart}-${fyEnd}`;
};

const getTodayDate = () => {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`; // same format as API
};

// Safely convert to number
const toNum = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};

// Others = (incomeTax + gstAmount + cessAmount + securityAmount + royaltyAmount + netAmount) - grossAmount
const calcOthers = (row) => {
  if (!row) return "0.00";

  const grossAmount = toNum(row.grossAmount);
  const incomeTax = toNum(row.incomeTax);
  const gstAmount = toNum(row.gstAmount);
  const cessAmount = toNum(row.cessAmount);
  const securityAmount = toNum(row.securityAmount);
  const royaltyAmount = toNum(row.royaltyAmount);
  const netAmount = toNum(row.netAmount);

  const result =
    incomeTax +
    gstAmount +
    cessAmount +
    securityAmount +
    royaltyAmount +
    netAmount -
    grossAmount;

  return result.toFixed(2);
};

// Sum of a numeric column across all rows
const sumBy = (rows, key) =>
  rows.reduce((acc, r) => acc + toNum(r[key]), 0);

// Sum of "Others" for all rows
const sumOthers = (rows) =>
  rows.reduce((acc, r) => acc + toNum(calcOthers(r)), 0);

/* ------------------- CERTIFICATE DOCUMENT ------------------- */

const PaymentCertificateDocument = React.forwardRef(
  ({ rows, officeName, officeAddress, qrSrc }, ref) => {
    if (!Array.isArray(rows) || rows.length === 0) return null;

    const first = rows[0]; // use first row for header information
    const financialYear = getFinancialYearLabel(
      first.generateDate || first.voucherDate
    );

    return (
      <div ref={ref} className="certificate-container w-[900px] mx-auto bg-white p-6 text-xs text-black">

        {/* Top row: Logo (left) + Office header (center) + QR (right) */}
        <div className="flex items-start mb-4">
          {/* Logo */}
          <div className="w-1/5 flex justify-start">
            <img
              src={logo}
              alt="Office Logo"
              className="w-20 h-20 object-contain"
            />
          </div>

          {/* Office Header (center) */}
          <div className="flex-1 text-center px-2">
            <div className="font-semibold text-sm">
             Office of The {officeName || "Office of the ______ Panchayat Samiti"}
            </div>
            <div className="text-[11px] font-semibold">
              {officeAddress || "_________ :: District _______"}
            </div>
            <div className="mt-3 font-semibold underline text-sm">
              Payment Certificate
            </div>
          </div>

          {/* QR Code */}
          <div className="w-1/5 flex justify-end">
            {qrSrc && (
              <img
                src={qrSrc}
                alt="QR Code"
                className="w-20 h-20 object-contain"
              />
            )}
          </div>
        </div>

        {/* Issued to */}
        <div className="mb-4 text-[11px]">
          <div>
            <span className="font-semibold">Issued to : </span>
            {first.contractorName}
          </div>
          <div>
            <span className="mb-4 font-semibold">Contractor PAN No : </span>
            {first.contractorPan}
          </div>
          <div>
            <span className="mb-4 font-semibold">Contractor Address : </span>
            {first.contractorAddr}
          </div>
        </div>

        {/* Paragraph */}
        <p className="mb-4 text-[11px] leading-snug font-semibold">
          The contractor has worked &amp; has drawn payment under this Panchayat
          Samiti for the below mentioned work during the Financial Year{" "}
          {financialYear}.
        </p>

        {/* Table */}
        <table className="contractor-table w-full border border-black text-[10px] border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black px-1 ">Date of Payment</th>

              <th className="border border-black px-1  w-[220px]">
                Description of works
              </th>
              <th className="border border-black px-1 ">Total Amount</th>
              <th className="border border-black px-1 ">Income Tax</th>
              <th className="border border-black px-1 ">GST</th>
              <th className="border border-black px-1 ">CESS</th>
              <th className="border border-black px-1 ">
                Security Deposit
              </th>
              <th className="border border-black px-1 ">Royalty</th>
              <th className="border border-black px-1 ">Others</th>
              <th className="border border-black px-1 ">
                Net amount paid
              </th>
              <th className="border border-black px-1 ">Head of A/c</th>
            </tr>
          </thead>

          <tbody>
            {/* All voucher rows */}
            {rows.map((row, idx) => (
              <tr key={row.voucherId || idx}>
                <td className="border border-black px-1 text-center">
                  {row.voucherDate}
                </td>

                <td className="border border-black px-1">
                  {row.activityDesc}
                </td>
                <td className="border border-black px-1 text-right">
                  {row.grossAmount}
                </td>
                <td className="border border-black px-1 text-right">
                  {row.incomeTax}
                </td>
                <td className="border border-black px-1 text-right">
                  {row.gstAmount}
                </td>
                <td className="border border-black px-1 text-right">
                  {row.cessAmount}
                </td>
                <td className="border border-black px-1 text-right">
                  {row.securityAmount}
                </td>
                <td className="border border-black px-1 text-right">
                  {row.royaltyAmount}
                </td>
                <td className="border border-black px-1 text-right">
                  {calcOthers(row)}
                </td>
                <td className="border border-black px-1 text-right">
                  {row.netAmount}
                </td>
                <td className="border border-black px-1">
                  {row.accountHead}
                </td>
              </tr>
            ))}

            {/* Totals row */}
            <tr>
              <td className="border border-black px-1 text-right font-semibold">
                Total
              </td>
              <td className="border border-black px-1"></td>
              <td className="border border-black px-1 text-right font-semibold">
                {sumBy(rows, "grossAmount").toFixed(2)}
              </td>
              <td className="border border-black px-1 text-right font-semibold">
                {sumBy(rows, "incomeTax").toFixed(2)}
              </td>
              <td className="border border-black px-1 text-right font-semibold">
                {sumBy(rows, "gstAmount").toFixed(2)}
              </td>
              <td className="border border-black px-1 text-right font-semibold">
                {sumBy(rows, "cessAmount").toFixed(2)}
              </td>
              <td className="border border-black px-1 text-right font-semibold">
                {sumBy(rows, "securityAmount").toFixed(2)}
              </td>
              <td className="border border-black px-1 text-right font-semibold">
                {sumBy(rows, "royaltyAmount").toFixed(2)}
              </td>
              <td className="border border-black px-1 text-right font-semibold">
                {sumOthers(rows).toFixed(2)}
              </td>
              <td className="border border-black px-1 text-right font-semibold">
                {sumBy(rows, "netAmount").toFixed(2)}
              </td>
              <td className="border border-black px-1"></td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <div className="mt-6 flex justify-between text-[11px] font-semibold">
          <div>
            Issued on: {first.generateDate} <br />
            Printed on: {getTodayDate()}
          </div>
          <div className="text-right">
            {getSignatureText()} <br />
            {officeName}
          </div>
        </div>
      </div>
    );
  }
);

/* ------------------- MAIN COMPONENT ------------------- */

const PreparationPaymentCertificate = () => {
  const [selectedContractorId, setSelectedContractorId] = useState("");
  const [data, setData] = useState([]);
  const [certificateRows, setCertificateRows] = useState([]); // <-- array of rows
  const [showCert, setShowCert] = useState(false);
  const [qrImage, setQrImage] = useState("");

  // LSG / LGD header details
  const [lgd, setLgd] = useState([]);

  const lgdCode =
    userData?.USER_LEVEL === "GP"
      ? userData?.GP_LGD
      : userData?.USER_LEVEL === "BLOCK"
        ? userData?.BLOCK_LGD
        : userData?.DIST_LGD;

  const coreLgd = userData?.CORE_LGD;
  const userIndex = userData?.USER_INDEX; // currently unused, kept for future

  /* ------------ FETCH OFFICE DETAILS FROM LSG API ------------- */
  useEffect(() => {
    if (!coreLgd) return;

    getLgdDetails(coreLgd).then((response) => {
      if (response?.status === 200) {
        setLgd(response.data || []);
      } else {
        toast.error("Failed to fetch office details");
      }
    });
  }, [coreLgd]);

  // Safely pick first record from API
  const lgdInfo = Array.isArray(lgd) && lgd.length > 0 ? lgd[0] : null;

  const officeNameFromApi = lgdInfo?.lsgName
    ? ` ${lgdInfo.lsgName}`
    : undefined;

  const officeAddressFromApi =
    lgdInfo?.lgdAdd1 || lgdInfo?.lgdAdd2
      ? [lgdInfo.lgdAdd1, lgdInfo.lgdAdd2].filter(Boolean).join(", ")
      : undefined;

  // ---------------- LOAD CONTRACTORS ----------------
  const { data: contractorList = [] } = useQuery({
    queryKey: ["contractorList", lgdCode],
    queryFn: async () => {
      const res = await fetch.get(
        `/Contractor/Get?lgdCode=${lgdCode}&contractorName=0`
      );
      const contractors = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
          ? res
          : [];
      return contractors;
    },
    enabled: !!lgdCode,
  });

  const sortedContractors = useMemo(() => {
    if (!Array.isArray(contractorList)) return [];
    return [...contractorList].sort((a, b) =>
      String(a.contractorNm).localeCompare(String(b.contractorNm))
    );
  }, [contractorList]);

  const onSearch = () => {
    if (!selectedContractorId) {
      toast.error("Please select a Contractor");
    } else {
      getSearchRptPaymantCertificate(coreLgd, selectedContractorId).then(
        (response) => {
          if (response.status === 200) {
            setData(response.data || []);
          } else {
            toast.error("Failed to fetch data");
          }
        }
      );
    }
  };

  /* ----------- QR CODE GENERATION (encoded ref) ----------- */
  const generateQR = async ({ lgdCode, partyCode, paymentId }) => {
    try {
      const payloadObj = { lgdCode, partyCode, paymentId };
      const json = JSON.stringify(payloadObj);
      const encoded = window.btoa(json); // base64 encode

      const baseHashUrl = "https://wbpms.in/SahajSaral/#";
      const routePath = "/payment-certificate/view";

      const url = `${baseHashUrl}${routePath}?ref=${encodeURIComponent(
        encoded
      )}`;

      const base64 = await QRCode.toDataURL(url, { width: 200 });
      setQrImage(base64);
    } catch (err) {
      console.error("QR Code generation error:", err);
      setQrImage("");
    }
  };

  /* ----------- VIEW -> CALL CERTIFICATE API ----------- */

  const onView = async (row) => {
    try {
      const lgd = coreLgd || lgdCode; // use what your API expects
      const partyCode = row.partyCode || selectedContractorId;
      const paymentId = row.paymentId;

      const res = await axios.get(
        "https://javaapi.wbpms.in/api/PaymentCertificate/FinalPaymentCertificate",
        {
          params: {
            lgdCode: lgd,
            partyCode,
            paymentId,
          },
        }
      );

      const arr = Array.isArray(res.data) ? res.data : [];
      if (!arr.length) {
        toast.error("No certificate data found");
        return;
      }

      // store full array of voucher rows
      setCertificateRows(arr);

      await generateQR({ lgdCode: lgd, partyCode, paymentId }); // QR with encoded ref
      setShowCert(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load certificate");
    }
  };

  /* ----------- PRINT / DOWNLOAD AS PDF ----------- */

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `PaymentCertificate_${certificateRows[0]?.partyCode || ""
      }_${certificateRows[0]?.voucherId || ""}`,
  });

  return (
    <>
      <ToastContainer />
      <div
        className="bg-white rounded-lg p-2 flex flex-col flex-grow"
        style={{ marginTop: "-40px" }}
      >
        <legend className="text-lg font-semibold text-cyan-700 py-2">
          Preparation of Payment Certificate
        </legend>

        {/* Filters */}
        <div className="flex flex-col space-y-2 py-2">
          <div className="flex flex-col w-full mb-4 space-y-2">
            <div className="flex items-center w-full space-x-4">
              <div className="w-1/3 px-2">
                <label className="block text-sm font-medium text-gray-700">
                  Contractor
                </label>
                <select
                  className="text-sm block w-full p-1 h-9 border border-gray-300"
                  value={selectedContractorId}
                  onChange={(e) => setSelectedContractorId(e.target.value)}
                >
                  <option value="">--Select Contractor--</option>
                  {sortedContractors.map((c) => (
                    <option key={c.contractorId} value={c.contractorId}>
                      {c.contractorNm}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-1/6">
                <button
                  type="button"
                  className="btn-submit h-9 px-2 mt-5 shadow-sm text-white hover:bg-cyan-700"
                  onClick={onSearch}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Result table */}
        {Array.isArray(data) && data.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-cyan-700 text-white">
                <tr>
                  <th className="border px-2 ">SL</th>
                  <th className="border px-2 ">Payment ID</th>
                  <th className="border px-2 ">Generated Date</th>
                  <th className="border px-2 ">Total Voucher</th>
                  <th className="border px-2 ">Total Gross</th>
                  <th className="border px-2 ">Total Net</th>
                  <th className="border px-2 ">Income Tax</th>
                  <th className="border px-2 ">GST</th>
                  <th className="border px-2 ">Cess</th>
                  <th className="border px-2 ">Security Deposit</th>
                  <th className="border px-2 ">Royalty</th>
                  <th className="border px-2 ">Action</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="odd:bg-gray-100">
                    <td className="border px-2  text-center">
                      {index + 1}
                    </td>
                    <td className="border px-2 ">{item.paymentId}</td>
                    <td className="border px-2 ">{item.generateDate}</td>
                    <td className="border px-2  text-right">
                      {item.totalVoucher}
                    </td>
                    <td className="border px-2  text-right">
                      {item.totalGross}
                    </td>
                    <td className="border px-2  text-right">
                      {item.totalNet}
                    </td>
                    <td className="border px-2 ">{item.totalIncomeTax}</td>
                    <td className="border px-2 ">{item.totalGst}</td>
                    <td className="border px-2 ">{item.totalCess}</td>
                    <td className="border px-2 ">{item.totalSecurity}</td>
                    <td className="border px-2 ">{item.totalRoyalty}</td>
                    <td className="border px-2  text-center">
                      <button
                        onClick={() => onView(item)}
                        className="bg-blue-600 text-white px-3  rounded hover:bg-blue-700 text-xs"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {Array.isArray(data) && data.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No records found.</p>
        )}
      </div>

      {/* ------------- MODAL FOR CERTIFICATE + PRINT ------------- */}
      {showCert && certificateRows.length > 0 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg max_height-[95vh] max-h-[95vh] overflow-auto p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-sm">Payment Certificate</h2>
              <div className="space-x-2">
                <button
                  onClick={handlePrint}
                  className="bg-green-600 text-white px-3  py-1 rounded text-xs hover:bg-green-700"
                >
                  Download / Print PDF
                </button>
                <button
                  onClick={() => setShowCert(false)}
                  className="bg-gray-500 text-white px-3  py-1 rounded text-xs hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>

            <PaymentCertificateDocument
              ref={printRef}
              rows={certificateRows}
              officeName={officeNameFromApi}
              officeAddress={officeAddressFromApi}
              qrSrc={qrImage}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PreparationPaymentCertificate;
