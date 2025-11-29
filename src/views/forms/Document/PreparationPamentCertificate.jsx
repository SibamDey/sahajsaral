import React, { useState, useMemo, useRef } from "react";
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

/* ------------------- CERTIFICATE DOCUMENT ------------------- */

const PaymentCertificateDocument = React.forwardRef(
  ({ cert, officeName, officeAddress, officeContact, qrSrc }, ref) => {
    if (!cert) return null;

    return (
      <div
        ref={ref}
        className="w-[900px] mx-auto bg-white p-8 text-xs text-black"
      >
        {/* Top row: Logo (left) + QR (right) */}
        <div className="flex justify-between items-start mb-2">
          {/* Logo */}
          <div>
            <img
              src={logo}
              alt="Office Logo"
              className="w-20 h-20 object-contain"
            />
          </div>

          {/* QR Code */}
          <div>
            {qrSrc && (
              <img
                src={qrSrc}
                alt="QR Code"
                className="w-20 h-20 object-contain"
              />
            )}
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="font-semibold text-sm">
            {officeName || "Office of the ______ Panchayat Samiti"}
          </div>
          <div className="text-[11px]">
            {officeAddress || "_________ :: District _______"}
          </div>
          <div className="text-[11px]">
            {officeContact ||
              "email: ______@gmail.com, Phone: _________"}
          </div>
          <div className="mt-3 font-semibold underline text-sm">
            Payment Certificate
          </div>
        </div>

        {/* Issued to */}
        <div className="mb-4 text-[11px]">
          <div>
            <span className="font-semibold">Issued to : </span>
            {cert.contractorName}
          </div>
          <div>
            <span className="ml-14">Party Code : </span>
            {cert.partyCode}
          </div>
        </div>

        {/* Paragraph */}
        <p className="mb-4 text-[11px] leading-snug">
          The contractor has worked &amp; has drawn payment under this Panchayat
          Samiti for the below mentioned work during the Financial Year 2025-26.
        </p>

        {/* Table */}
        <table className="w-full border border-black text-[10px] border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black px-1 py-1">Date of Payment</th>
              <th className="border border-black px-1 py-1">
                Name of the Contractor
              </th>
              <th className="border border-black px-1 py-1 w-[220px]">
                Description of works
              </th>
              <th className="border border-black px-1 py-1">Total Amount</th>
              <th className="border border-black px-1 py-1">Income Tax</th>
              <th className="border border-black px-1 py-1">GST</th>
              <th className="border border-black px-1 py-1">CESS</th>
              <th className="border border-black px-1 py-1">
                Security Deposit
              </th>
              <th className="border border-black px-1 py-1">Royalty</th>
              <th className="border border-black px-1 py-1">
                CESS on Royalty
              </th>
              <th className="border border-black px-1 py-1">
                Net amount paid
              </th>
              <th className="border border-black px-1 py-1">Head of A/c</th>
            </tr>
          </thead>
          <tbody>
            {/* main row */}
            <tr>
              <td className="border border-black px-1 py-1 text-center">
                {cert.voucherDate}
              </td>
              <td className="border border-black px-1 py-1">
                {cert.contractorName}
              </td>
              <td className="border border-black px-1 py-1">
                {cert.activityDesc}
              </td>
              <td className="border border-black px-1 py-1 text-right">
                {cert.grossAmount}
              </td>
              <td className="border border-black px-1 py-1 text-right">
                {cert.incomeTax}
              </td>
              <td className="border border-black px-1 py-1 text-right">
                {cert.gstAmount}
              </td>
              <td className="border border-black px-1 py-1 text-right">
                {cert.cessAmount}
              </td>
              <td className="border border-black px-1 py-1 text-right">
                {cert.securityAmount}
              </td>
              <td className="border border-black px-1 py-1 text-right">
                {cert.royaltyAmount}
              </td>
              <td className="border border-black px-1 py-1 text-right">
                0.00
              </td>
              <td className="border border-black px-1 py-1 text-right">
                {cert.netAmount}
              </td>
              <td className="border border-black px-1 py-1">
                {cert.accountHead}
              </td>
            </tr>

            {/* total row (one row only) */}
            <tr>
              <td className="border border-black px-1 py-1 text-right font-semibold">
                Total
              </td>
              <td className="border border-black px-1 py-1"></td>
              <td className="border border-black px-1 py-1"></td>
              <td className="border border-black px-1 py-1 text-right font-semibold">
                {cert.grossAmount}
              </td>
              <td className="border border-black px-1 py-1 text-right font-semibold">
                {cert.incomeTax}
              </td>
              <td className="border border-black px-1 py-1 text-right font-semibold">
                {cert.gstAmount}
              </td>
              <td className="border border-black px-1 py-1 text-right font-semibold">
                {cert.cessAmount}
              </td>
              <td className="border border-black px-1 py-1 text-right font-semibold">
                {cert.securityAmount}
              </td>
              <td className="border border-black px-1 py-1 text-right font-semibold">
                {cert.royaltyAmount}
              </td>
              <td className="border border-black px-1 py-1 text-right font-semibold">
                0.00
              </td>
              <td className="border border-black px-1 py-1 text-right font-semibold">
                {cert.netAmount}
              </td>
              <td className="border border-black px-1 py-1"></td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <div className="mt-6 flex justify-between text-[11px]">
          <div>Date: __________</div>
          <div className="text-right">
            Executive Officer
            <br />
            _______ Panchayat Samiti
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
  const [certificate, setCertificate] = useState(null);
  const [showCert, setShowCert] = useState(false);
  const [qrImage, setQrImage] = useState("");

  const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
  const userData = JSON.parse(jsonString || "{}");

  const lgdCode =
    userData?.USER_LEVEL === "GP"
      ? userData?.GP_LGD
      : userData?.USER_LEVEL === "BLOCK"
      ? userData?.BLOCK_LGD
      : userData?.DIST_LGD;

  const coreLgd = userData?.CORE_LGD;
  const userIndex = userData?.USER_INDEX;

  // --------- BUILD OFFICE HEADER VALUES FROM SESSION ---------
  const officeNameFromSession =
    userData?.DIST_NAME && userData?.USER_LEVEL === "DIST"
      ? `Office of The ${userData.DIST_NAME} Panchayat Samiti`
      : undefined;

  // If you have no address in session, let it fall back to default text
  const officeAddressFromSession = undefined;

  const officeContactFromSession =
    userData?.EMAIL || userData?.MOBILE
      ? `email: ${userData.EMAIL || "________@gmail.com"}, Phone: ${
          userData.MOBILE || "_________"
        }`
      : undefined;

  // LOAD CONTRACTORS
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

      const certObj = arr[0];

      setCertificate(certObj);
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
    documentTitle: `PaymentCertificate_${certificate?.partyCode || ""}_${
      certificate?.voucherId || ""
    }`,
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
                  <th className="border px-2 py-1">SL</th>
                  <th className="border px-2 py-1">Payment ID</th>
                  <th className="border px-2 py-1">Generated Date</th>
                  <th className="border px-2 py-1">Total Voucher</th>
                  <th className="border px-2 py-1">Total Gross</th>
                  <th className="border px-2 py-1">Total Net</th>
                  <th className="border px-2 py-1">Income Tax</th>
                  <th className="border px-2 py-1">GST</th>
                  <th className="border px-2 py-1">Cess</th>
                  <th className="border px-2 py-1">Security Deposit</th>
                  <th className="border px-2 py-1">Royalty</th>
                  <th className="border px-2 py-1">Action</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="odd:bg-gray-100">
                    <td className="border px-2 py-1 text-center">
                      {index + 1}
                    </td>
                    <td className="border px-2 py-1">{item.paymentId}</td>
                    <td className="border px-2 py-1">{item.generateDate}</td>
                    <td className="border px-2 py-1 text-right">
                      {item.totalVoucher}
                    </td>
                    <td className="border px-2 py-1 text-right">
                      {item.totalGross}
                    </td>
                    <td className="border px-2 py-1 text-right">
                      {item.totalNet}
                    </td>
                    <td className="border px-2 py-1">{item.totalIncomeTax}</td>
                    <td className="border px-2 py-1">{item.totalGst}</td>
                    <td className="border px-2 py-1">{item.totalCess}</td>
                    <td className="border px-2 py-1">{item.totalSecurity}</td>
                    <td className="border px-2 py-1">{item.totalRoyalty}</td>
                    <td className="border px-2 py-1 text-center">
                      <button
                        onClick={() => onView(item)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
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
      {showCert && certificate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg max_height-[95vh] max-h-[95vh] overflow-auto p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-sm">Payment Certificate</h2>
              <div className="space-x-2">
                <button
                  onClick={handlePrint}
                  className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                >
                  Download / Print PDF
                </button>
                <button
                  onClick={() => setShowCert(false)}
                  className="bg-gray-500 text-white px-3 py-1 rounded text-xs hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>

            <PaymentCertificateDocument
              ref={printRef}
              cert={certificate}
              officeName={officeNameFromSession}
              officeAddress={officeAddressFromSession}
              officeContact={officeContactFromSession}
              qrSrc={qrImage}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PreparationPaymentCertificate;
