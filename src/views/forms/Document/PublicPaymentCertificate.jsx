import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import QRCode from "qrcode";
import { ToastContainer, toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import logo from "../../../Img/logo.png";

/* Certificate document for public view */
const PaymentCertificateDocument = React.forwardRef(
  ({ cert, qrSrc }, ref) => {
    if (!cert) return null;

    return (
      <div
        ref={ref}
        className="w-[900px] mx-auto bg-white p-8 text-xs text-black"
      >
        {/* Top row: Logo + QR */}
        <div className="flex justify-between items-start mb-2">
          <div>
            <img
              src={logo}
              alt="Office Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
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
            Office of The Jhargram Panchayat Samiti
          </div>
          <div className="text-[11px]">Ghardhara :: Jhargram</div>
          <div className="text-[11px]">
            email- bdojhargram@gmail.com, Phone- 03221-255071, Pin- 721507
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

        <div className="mt-4 text-[10px] text-gray-500 text-center">
          This certificate is viewed via QR verification from Sahaj Saral.
        </div>
      </div>
    );
  }
);

const PublicPaymentCertificate = () => {
  const [searchParams] = useSearchParams();
  const [certificate, setCertificate] = useState(null);
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(true);

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

        const certObj = arr[0];
        setCertificate(certObj);

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

  if (loading) {
    return (
      <>
        <ToastContainer />
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading certificate...</p>
        </div>
      </>
    );
  }

  if (!certificate) {
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
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-sm">Payment Certificate</h2>
            <button
              onClick={handlePrint}
              className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
            >
              Download / Print PDF
            </button>
          </div>

          <PaymentCertificateDocument
            ref={printRef}
            cert={certificate}
            qrSrc={qrImage}
          />
        </div>
      </div>
    </>
  );
};

export default PublicPaymentCertificate;
