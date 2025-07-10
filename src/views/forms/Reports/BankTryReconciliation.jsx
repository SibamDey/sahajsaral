import { useState, useEffect } from "react";
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getRealAccList } from "../../../Service/Transaction/TransactionService";
import { ToastContainer, toast } from "react-toastify";

const BankTryReconciliation = () => {
    const [accountCode, setAccountCode] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [data, setData] = useState(null);
    const [realAccList, setRealAccList] = useState();
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);

    const onSearch = async () => {
        if (!accountCode) {
            toast.error('Please Select a Account Code');
            return;
        } if (!fromDate) {
            toast.error('Please Select a From Date');
            return;
        } if (!toDate) {
            toast.error('Please Select a To Date');
            return;
        }

        try {
            const response = await axios.get(`https://javaapi.wbpms.in/api/Reconciliation/FinalReconciliation`, {
                params: {
                    lgdCode: userData?.CORE_LGD,
                    accountCode,
                    frmDate: fromDate,
                    toDate
                }
            });
            setData(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Failed to fetch data');
        }
    };

    useEffect(() => {
        getRealAccList(
            userData?.USER_LEVEL === "DIST" ? userData?.DIST_LGD :
                userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD :
                    userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : 0
        ).then((result) => {
            setRealAccList(result?.data);
        });
    }, []);

    const downloadPDF = () => {
        const doc = new jsPDF();

        if (data?.acInfo) {
            doc.text(`Account: ${data.acInfo.accountDesc}`, 10, 10);
        }

        const spacing = 10;
        let y = 20;

        const addTable = (title, headers, rows) => {
            doc.text(title, 10, y);
            autoTable(doc, {
                head: [headers],
                body: rows,
                startY: y + 5,
            });
            y = doc.lastAutoTable.finalY + spacing;
        };

        if (data?.partInfo?.length) {
            const rows = data.partInfo.map(item => [item.slNo, item.particulars, item.particularsAmount]);
            addTable('Particulars Info', ['Sl No', 'Particulars', 'Amount'], rows);
        }

        if (data?.pmntInfo?.length) {
            const rows = data.pmntInfo.map(p => [
                p.paymentVoucherDate,
                p.paymentVoucherId,
                p.paymentAmount,
                p.paymentGroupName
            ]);
            addTable('Payment Info', ['Date', 'Voucher ID', 'Amount', 'Group Name'], rows);
        }

        if (data?.rcptInfo?.length) {
            const rows = data.rcptInfo.map(r => [
                r.receiptVoucherDate,
                r.receiptVoucherId,
                r.receiptAmount,
                r.receiptGroupName
            ]);
            addTable('Receipt Info', ['Date', 'Voucher ID', 'Amount', 'Group Name'], rows);
        }

        if (data?.trnInfo?.length) {
            const rows = data.trnInfo.map(t => [
                t.transacVoucherDate,
                t.transacVoucherId,
                t.transacAmount,
                t.transacRef
            ]);
            addTable('Transaction Info', ['Date', 'Voucher ID', 'Amount', 'Reference'], rows);
        }

        doc.save('Reconciliation.pdf');
    };

    const renderTable = (title, headers, dataRows) => (
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-700 mb-2 text-center">{title}</h3>
            <table className="w-full border border-blue-200 rounded shadow-sm text-sm">
                <thead className="bg-blue-100 text-blue-900">
                    <tr>
                        {headers.map((h, idx) => (
                            <th key={idx} className="border p-2 text-left">{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {dataRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-blue-50">
                            {row.map((cell, cidx) => (
                                <td key={cidx} className="border p-2 text-left">{cell}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (

        <div className="bg-white rounded-lg p-2 flex flex-col flex-grow" style={{ marginTop: "-40px" }}>
            <ToastContainer />

            <legend className="text-lg font-semibold text-cyan-700 mb-2">Bank/Treasury Reconciliation</legend>

            {/* Filter Section */}
            <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex flex-col w-60">
                    <label className="text-sm font-medium text-gray-700">Bank Account <span className="text-red-500">*</span></label>
                    <select
                        className="text-sm border h-9 rounded-md p-1"
                        onChange={e => setAccountCode(e.target.value)}
                        value={accountCode}
                    >
                        <option value="" hidden>--Select Bank Account--</option>
                        {realAccList?.map((d, idx) => (
                            <option key={idx} value={d?.accountCode}>{d?.accountCodeDesc}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col w-48">
                    <label className="text-sm font-medium text-gray-700">From Date <span className="text-red-500">*</span></label>
                    <input
                        type="date"
                        className="text-sm border h-9 rounded-md p-1"
                        value={fromDate}
                        onChange={e => setFromDate(e.target.value)}
                    />
                </div>

                <div className="flex flex-col w-48">
                    <label className="text-sm font-medium text-gray-700">To Date <span className="text-red-500">*</span></label>
                    <input
                        type="date"
                        className="text-sm border h-9 rounded-md p-1"
                        value={toDate}
                        onChange={e => setToDate(e.target.value)}
                    />
                </div>

                <div className="flex items-end">
                    <button
                        onClick={onSearch}
                        className="h-9 px-4 bg-cyan-600 text-white rounded hover:bg-cyan-700"
                    >
                        Search
                    </button>
                </div>
            </div>

            {data?.acInfo && (
                <div className="mb-4 bold font-medium text-center text-gray-700">
                    {data.acInfo.accountDesc}
                </div>
            )}

            {data?.partInfo?.length > 0 && renderTable(
                "Particulars Info",
                ['Sl No', 'Particulars', 'Amount'],
                data.partInfo.map(i => [i.slNo, i.particulars, i.particularsAmount.toLocaleString()]),
                true
            )}

            {data?.pmntInfo?.length > 0 && renderTable(
                "Payment Info",
                ['Date', 'Voucher ID', 'Amount', 'Group Name'],
                data.pmntInfo.map(p => [p.paymentVoucherDate, p.paymentVoucherId, p.paymentAmount.toLocaleString(), p.paymentGroupName])
            )}

            {data?.rcptInfo?.length > 0 && renderTable(
                "Receipt Info",
                ['Date', 'Voucher ID', 'Amount', 'Group Name'],
                data.rcptInfo.map(r => [r.receiptVoucherDate, r.receiptVoucherId, r.receiptAmount.toLocaleString(), r.receiptGroupName])
            )}

            {data?.trnInfo?.length > 0 && renderTable(
                "Transaction Info",
                ['Date', 'Voucher ID', 'Amount', 'Reference'],
                data.trnInfo.map(t => [t.transacVoucherDate, t.transacVoucherId, t.transacAmount.toLocaleString(), t.transacRef])
            )}

            {data && (
                <div className="text-center ">
                    <button
                        onClick={downloadPDF}
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        Download as PDF
                    </button>
                </div>
            )}
        </div>
    );
};

export default BankTryReconciliation;
