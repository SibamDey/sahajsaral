import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import QRCode from "qrcode";
import { ToastContainer, toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import logo from "../../../Img/logo.png";
import { getLgdDetails } from "../../../Service/LgdCodeGet/LgdCodeService";

/* ---------- Helpers ---------- */

// Derive Indian Financial Year from a date string (supports DD.MM.YYYY)
const getFinancialYearLabel = (dateStr) => {
  if (!dateStr) return "____-____";

  let normalized = dateStr.trim();

  // Convert DD.MM.YYYY → YYYY-MM-DD
  if (normalized.includes(".")) {
    const parts = normalized.split(".");
    if (parts.length === 3) {
      normalized = `${parts[2]}-${parts[1].padStart(
        2,
        "0"
      )}-${parts[0].padStart(2, "0")}`;
    }
  }

  // Convert DD/MM/YYYY or DD-MM-YYYY → YYYY-MM-DD
  if (normalized.includes("/") || normalized.includes("-")) {
    const parts = normalized.split(/[-\/]/);
    if (parts.length === 3 && parts[0].length <= 2) {
      normalized = `${parts[2]}-${parts[1].padStart(
        2,
        "0"
      )}-${parts[0].padStart(2, "0")}`;
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
  return `${day}.${month}.${year}`; // DD.MM.YYYY
};

// Signature text based on LGD type (1 = DIST, 2 = BLOCK, 3 = GP – inferred)
const getSignatureTextFromLgdType = (lgdType) => {
  if (lgdType === "2") return "Executive Officer / Joint Executive Officer"; // Block / PS
  if (lgdType === "1") return "AEO / FCCAO"; // District / ZP
  if (lgdType === "3") return "Executive Assistant"; // GP

  return "Authorized Signatory";
};

const getLevelTextFromLgdType = (lgdType) => {
  if (lgdType === "2") return "Panchayat Samiti";
  if (lgdType === "1") return "Zilla Parishad";
  if (lgdType === "3") return "Gram Panchayat";

  return "Local Self Government";
};

// Safely convert to number
const toNum = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};

// "Others" = (grossAmount - incomeTax + gstAmount + cessAmount + securityAmount + royaltyAmount + netAmount)
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

    (incomeTax +
      gstAmount +
      cessAmount +
      securityAmount +
      royaltyAmount +
      netAmount) - grossAmount;

  return result.toFixed(2);
};

// Sum of a numeric column across all rows
const sumBy = (rows, key) =>
  rows.reduce((acc, r) => acc + toNum(r[key]), 0);

// Sum of "Others" for all rows
const sumOthers = (rows) =>
  rows.reduce((acc, r) => acc + toNum(calcOthers(r)), 0);

/* ---------- Certificate document for public view ---------- */

const PaymentCertificateDocument = React.forwardRef(
  (
    { rows, officeName, officeAddress, signatureText, levelText, qrSrc },
    ref
  ) => {
    if (!Array.isArray(rows) || rows.length === 0) return null;

    const first = rows[0];
    const financialYear = getFinancialYearLabel(
      first.generateDate || first.voucherDate
    );

    return (
      <div
        ref={ref}
        className="w-[900px] mx-auto bg-white p-8 text-xs text-black"
      >
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
            <div className="font-semibold text-sm uppercase">
              Office of The {officeName || "Office of the ______ Panchayat Samiti"}
            </div>
            <div className="text-[11px] font-semibold uppercase">
              {officeAddress || "_________ :: District _______"}
            </div>
            <div className="mt-3 font-semibold underline text-sm uppercase">
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
        <div className="mb-4 text-[11px] uppercase">
          <div>
            <span className="font-semibold uppercase">Issued to : </span>
            {first.contractorName}
          </div>
          <div>
            <span className="mb-4 font-semibold uppercase">PAN : </span>
            {first.contractorPan}
          </div>
          <div>
            <span className="mb-4 font-semibold uppercase">Address : </span>
            {first.contractorAddr}
          </div>
        </div>

        {/* Paragraph */}
        <p className="mb-4 text-[11px] leading-snug font-semibold">
          The Contractor/Supplier has worked &amp; has drawn payment under this{" "}
          {levelText || "Local Self Government"}{" "}
          for the below mentioned work during the Financial Year {financialYear}.
        </p>


        {/* Table */}
        <table className="w-full border border-black text-[10px] border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black px-1 py-1">Date of Payment</th>
              <th className="border border-black px-1 py-1 w-[220px]">
                Transaction ID & Description of works
              </th>
              <th className="border border-black px-1 py-1">Total Amount</th>
              <th className="border border-black px-1 py-1">Income Tax</th>
              <th className="border border-black px-1 py-1">GST</th>
              <th className="border border-black px-1 py-1">CESS</th>
              <th className="border border-black px-1 py-1">
                Security Deposit
              </th>
              <th className="border border-black px-1 py-1">Royalty</th>
              <th className="border border-black px-1 py-1">Other Deduction</th>
              <th className="border border-black px-1 py-1">
                Net amount paid
              </th>
              <th className="border border-black px-1 py-1">Head of A/c</th>
              <th className="border border-black px-1 py-1">Verified By</th>
            </tr>
          </thead>
          <tbody>
            {/* All rows */}
            {rows.map((row, idx) => (
              <tr key={row.voucherId || idx}>
                <td className="border border-black px-1 py-1 text-center">
                  {row.voucherDate}
                </td>

                <td className="border border-black px-1 py-1">
                  {row.activityDesc}
                </td>
                <td className="border border-black px-1 py-1 text-right">
                  {row.grossAmount}
                </td>
                <td className="border border-black px-1 py-1 text-right">
                  {row.incomeTax}
                </td>
                <td className="border border-black px-1 py-1 text-right">
                  {row.gstAmount}
                </td>
                <td className="border border-black px-1 py-1 text-right">
                  {row.cessAmount}
                </td>
                <td className="border border-black px-1 py-1 text-right">
                  {row.securityAmount}
                </td>
                <td className="border border-black px-1 py-1 text-right">
                  {row.royaltyAmount}
                </td>
                <td className="border border-black px-1 py-1 text-right">
                  {calcOthers(row)}
                </td>
                <td className="border border-black px-1 py-1 text-right">
                  {row.netAmount}
                </td>
                <td className="border border-black px-1 py-1">
                  {row.accountHead}
                </td>
                <td className="border border-black px-1 py-1">
                  {row.verifiedBy}
                </td>
              </tr>
            ))}

            {/* total row */}
            <tr>
              <td className="border border-black px-1 py-1 text-right font-semibold">
                Total
              </td>
              <td className="border border-black px-1 py-1"></td>
              <td className="border border-black px-1 py-1 text-right font-semibold">
                {sumBy(rows, "grossAmount").toFixed(2)}
              </td>
              <td className="border border-black px-1 py-1 text-right font-semibold">
                {sumBy(rows, "incomeTax").toFixed(2)}
              </td>
              <td className="border border-black px-1 py-1 text-right font-semibold">
                {sumBy(rows, "gstAmount").toFixed(2)}
              </td>
              <td className="border border-black px-1 py-1 text-right font-semibold">
                {sumBy(rows, "cessAmount").toFixed(2)}
              </td>
              <td className="border border-black px-1 py-1 text-right font-semibold">
                {sumBy(rows, "securityAmount").toFixed(2)}
              </td>
              <td className="border border-black px-1 py-1 text-right font-semibold">
                {sumBy(rows, "royaltyAmount").toFixed(2)}
              </td>
              <td className="border border-black px-1 py-1 text-right font-semibold">
                {sumOthers(rows).toFixed(2)}
              </td>
              <td className="border border-black px-1 py-1 text-right font-semibold">
                {sumBy(rows, "netAmount").toFixed(2)}
              </td>
              <td className="border border-black px-1 py-1"></td>
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
            {signatureText || "Executive Officer"}
            <br />
            {officeName}
          </div>
        </div>

        <div className="mt-4 text-[10px] text-gray-500 text-center flex items-center justify-center gap-1">
          {/* <span className="text-green-600 font-bold">✔</span> */}
          This document is viewed via QR verification from Sahaj-Saral under West Bengal Panchayat Management System.
        </div>
      </div>
    );
  }
);

/* ---------- Public container component ---------- */

const PublicPaymentCertificate = () => {
  const [searchParams] = useSearchParams();
  const [certificateRows, setCertificateRows] = useState([]); // <-- array of vouchers
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [lgd, setLgd] = useState([]); // LSG details

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "PaymentCertificate",
  });

  // Decode ref → lgdCode, partyCode, paymentId
  let decodedParams = { lgdCode: null, partyCode: null, paymentId: null };
  const ref = searchParams.get("ref");

  if (ref) {
    try {
      const json = window.atob(ref); // base64 decode
      const obj = JSON.parse(json);
      decodedParams = {
        lgdCode: obj.lgdCode || null,
        partyCode: obj.partyCode || null,
        paymentId: obj.paymentId || null,
      };
    } catch (e) {
      console.error("Failed to decode ref:", e);
    }
  }

  const { lgdCode, partyCode, paymentId } = decodedParams;

  // Fetch certificate (all voucher rows)
  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        if (!lgdCode || !partyCode || !paymentId) {
          toast.error("Invalid certificate link.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "https://javaapi.wbpms.in/api/PaymentCertificate/FinalPaymentCertificate",
          {
            params: { lgdCode, partyCode, paymentId },
          }
        );

        const arr = Array.isArray(res.data) ? res.data : [];
        if (!arr.length) {
          toast.error("Certificate not found.");
          setLoading(false);
          return;
        }

        setCertificateRows(arr);

        // QR shown on this page = current URL (optional)
        const base64 = await QRCode.toDataURL(window.location.href, {
          width: 200,
        });
        setQrImage(base64);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load certificate.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [lgdCode, partyCode, paymentId]);

  // Fetch LGD / office header info using lgdCode from URL (NOT session)
  useEffect(() => {
    if (!lgdCode) return;

    getLgdDetails(lgdCode)
      .then((response) => {
        if (response?.status === 200) {
          setLgd(response.data || []);
        } else {
          toast.error("Failed to fetch office details");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch office details");
      });
  }, [lgdCode]);

  const lgdInfo = Array.isArray(lgd) && lgd.length > 0 ? lgd[0] : null;

  const officeNameFromApi = lgdInfo?.lsgName
    ? `${lgdInfo.lsgName}`
    : undefined;

  const officeAddressFromApi =
    lgdInfo?.lgdAdd1 || lgdInfo?.lgdAdd2
      ? [lgdInfo.lgdAdd1, lgdInfo.lgdAdd2].filter(Boolean).join(", ")
      : undefined;

  const signatureTextFromApi = getSignatureTextFromLgdType(lgdInfo?.lgdType);
  const levelTextFromApi = getLevelTextFromLgdType(lgdInfo?.lgdType);
  console.log(signatureTextFromApi, levelTextFromApi, "popopo")

  if (loading) {
    return (
      <>
        <ToastContainer />
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading Payment certificate...</p>
        </div>
      </>
    );
  }

  if (!Array.isArray(certificateRows) || certificateRows.length === 0) {
    return (
      <>
        <ToastContainer />
        <div className="flex items-center justify-center min-h-screen">
          <p>Certificate not available.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-100 py-4">
        <div className="max-w-5xl mx-auto bg-white shadow rounded p-4">
          {/* If you want print button, uncomment this */}
          {/* <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-sm">Payment Certificate</h2>
            <button
              onClick={handlePrint}
              className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
            >
              Download / Print PDF
            </button>
          </div> */}

          <PaymentCertificateDocument
            ref={printRef}
            rows={certificateRows}
            officeName={officeNameFromApi}
            officeAddress={officeAddressFromApi}
            signatureText={signatureTextFromApi}
            levelText={levelTextFromApi}
            qrSrc={qrImage}

          />
        </div>
      </div>
    </>
  );
};

export default PublicPaymentCertificate;
