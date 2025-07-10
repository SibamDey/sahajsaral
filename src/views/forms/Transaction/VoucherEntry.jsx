import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    getVoucherDetails, getVoucherById, getAcCodeDescList, getPassForPaymentDetails, getPassForPaymentById, getNominalAccList, getRealAccList,
    getRealAccWithbalance, getPartyTypeList, getChequeNoForVoucher, getContractorList
    , getEmployeeList, getJobWorkerList, getDepartmentList, getLsgList, deleteVoucher,
    addVoucherEntry, getAccountHeadList, getReferenceOfDetails, getNextPassForPaymentId, getReferenceOfAdvanceAdj, getRealAccAllList, verifyVoucher
} from "../../../Service/Transaction/TransactionService";
import Modal from 'react-modal';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Toast } from "flowbite-react";
import LOGO from "../../../Img/logo.png"
import {
    getDebitVoucher, getContraVoucher, getReceiptVoucher, getJournalVoucher,
    getCashierReceiptVoucher
} from "../../../Service/Document/DocumentService";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import ColorRingCustomLoader from "../../Loader/Loader";


const VoucherEntry = () => {
    const getCurrentDate = () => new Date().toISOString().split("T")[0];
    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const navigate = useNavigate();
    const [voucherModeData, setVoucherModeData] = useState("");
    const [voucherTypeData, setVoucherTypeData] = useState("");
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [pageChange, setPageChange] = useState("Add");
    const [nominalAccListForPayment, setNominalAccListForPayment] = useState([]);
    const [nominalAccListForReceipt, setNominalAccListForReceipt] = useState([]);
    const [realAccWithbalance, setRealAccWithbalance] = useState([]);
    const [modalPassForPaymentId, setModalPassForPaymentId] = useState(false);
    const [modalVoucherId, setModalVoucherId] = useState(false);
    const [modalReferenceOf, setModalReferenceOf] = useState(false);
    const [fromDatePassForPayment, setFromDatePassForPayment] = useState(getCurrentDate());
    const [fromDateVoucher, setFromDateVoucher] = useState(getCurrentDate());
    const [toDatePassForPayment, setToDatePassForPayment] = useState(getCurrentDate());
    const [toDateVoucher, setToDateVoucher] = useState(getCurrentDate());
    const [passForPaymentStatus, setPassForPaymentStatus] = useState("");
    const [voucherStatus, setvoucherStatus] = useState(0);
    const [voucherModalNarration, setVoucherModalNarration] = useState("");
    const [voucherModalType, setvoucherModalType] = useState("");
    const [passForPaymentDetailsById, setPassForPaymentDetailsById] = useState([]);
    const [voucherDetailsById, setVoucherDetailsById] = useState([]);
    const [referenceOfDetailsById, setReferenceOfDetailsById] = useState([]);
    const [referenceOfDetailsByAdvanceAdj, setReferenceOfDetailsByAdvanceAdj] = useState([]);
    const [getPassForPaymentDataById, setGetPassForPaymentDataById] = useState();
    const [voucherDataById, setGetVoucherDataById] = useState();
    const [activityTheme, setActivityTheme] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDropdownSearchTerm, setShowDropdownSearchTerm] = useState(false);
    const [showDropdownSearchTerm2, setShowDropdownSearchTerm2] = useState(false);
    const [partyType, setPartyType] = useState("");
    const [partyTypeAllList, setPartyTypeAllList] = useState([]);
    const [nameList, setNameList] = useState([]);
    const [partyName, setPartyName] = useState("");
    const [acCodeDescAllList, setAcCodeDescAllList] = useState([]);
    const [partyTypes, setPartyTypes] = useState();
    const [name, setName] = useState();
    const [bankTreasury, setBankTreasury] = useState();
    const [instType, setInstType] = useState();
    const [instTypeAllList, setInstTypeAllList] = useState({
        bankName: "",
        chequeNo: "",
    });
    const [base64String, setBase64String] = useState('');
    const [imagePreview, setImagePreview] = useState(null);

    const [voucherPaymentFlag, setVoucherPaymentFlag] = useState(false);
    const [voucherContraFlag, setVoucherContraFlag] = useState(false);
    const [voucherCreditFlag, setVoucherCreditFlag] = useState(false);
    const [voucherJournalFlag, setVoucherJournalFlag] = useState(false);

    const [voucherQueryPaymentFlag, setVoucherQueryPaymentFlag] = useState(false);
    const [voucherQueryContraFlag, setVoucherQueryContraFlag] = useState(false);
    const [voucherQueryCreditFlag, setVoucherQueryCreditFlag] = useState(false);
    const [voucherQueryJournalFlag, setVoucherQueryJournalFlag] = useState(false);


    const [voucherCashierReceiptFlag, setVoucherCashierReceiptFlag] = useState(false);
    const [voucherData, setVoucherData] = useState(null);
    const [voucherDataCashierReceipt, setVoucherDataCashierReceipt] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTerm2, setSearchTerm2] = useState("");
    const [selectedValue, setSelectedValue] = useState("");
    const [selectedValue2, setSelectedValue2] = useState("");
    const [grossAmount, setGrossAmount] = useState();
    const [netAmount, setNetAmount] = useState();
    const [deductedAmount, setDeductedAmount] = useState(0);
    const queryClient = useQueryClient();
    const [isPartyDetailsOpen, setIsPartyDetailsOpen] = useState(false);
    const [paymentDesc, setPaymentDesc] = useState();
    const [updatedData, setUpdatedData] = useState({});
    const [accCode, setAccCode] = useState("");
    const [matches901, setMatches901] = useState(false);
    const [matches801, setMatches801] = useState(false);
    const [matches601, setMatches601] = useState(false);
    const [matches000, setMatches000] = useState(false);
    const [voucherDate, setVoucherDate] = useState();
    const [receiptPaymentDate, setReceiptPaymentDate] = useState();
    const [financialYear, setFinancialYear] = useState("");
    const [voucherNo, setVoucherNo] = useState("");
    const [payto, setPayto] = useState("");
    const [payAddress, setPayAddress] = useState("");
    const [allotmentNo, setAllotmentNo] = useState("");
    const [allotmentDate, setAllomentDate] = useState("");
    const [voucherFlag, setVoucherFlag] = useState(false);
    const [challanNo, setChallanNo] = useState("");
    const [challanByWhom, setChallanByWhom] = useState("");
    const [challanWhoseBehalf, setChallanWhoseBehalf] = useState("");
    const [accountHead, setAccountHead] = useState("")
    const [headShowDropdown, setHeadShowDropdown] = useState(false);
    const [accountHeadAllList, setAccountHeadAllList] = useState([]);
    const [accountHeadType, setAccountHeadType] = useState("");
    const [referenceOfDataById, setReferenceOfDataById] = useState();
    const [referenceOfDataByAmount, setReferenceOfDataByAmount] = useState();
    const [referenceOfDataByNarration, setReferenceOfDataByNarration] = useState();
    const [flagPartyType, setFlagPartyType] = useState(false);
    const [confirmSubmitFlag, setConfirmSubmitFlag] = useState(false);
    const [showVoucherID, setShowVoucherID] = useState(false);
    const [VoucherResponse, setVoucherResponse] = useState("");
    const [deleteFlag, setDeleteFlag] = useState(false);
    const [verifyFlag, setVerifyFlag] = useState(false);
    const [deleteReason, setDeleteReason] = useState("");
    const [loader, setLoader] = useState(false)
    const [saveDisabled, setSaveDisabled] = useState(false);
    const [nextPfp, setNextPfp] = useState(false)
    const [nextPfpData, setNextPfpData] = useState(false)
    const printRef = useRef();

    const voucherMode = [
        { id: "P", label: "Payment" },
        { id: "R", label: "Receipt" },
        { id: "N", label: "Transfer" }
    ];

    const voucherType = [
        { id: "C", label: "Cash" },
        { id: "B", label: "Bank" },
        { id: "T", label: "Treasury" },
        { id: "J", label: "Journal" },
        { id: "N", label: "Contra" }
    ];

    const instrumentType = [
        { value: "None", label: "None" },
        { value: "Cheque", label: "Cheque" },
        { value: "Challan", label: "Challan" },
        { value: "DD", label: "DD" },
        { value: "Advice", label: "Advice" },
        { value: "By Transfer", label: "By Transfer" },
        { value: "Token", label: "Token" },
        { value: "Penal Interest", label: "Penal Interest" },
        { value: "Bank Interest", label: "Bank Interest" },
        { value: "Bank Charges", label: "Bank Charges" },
        { value: "Fund Transfer", label: "Fund Transfer" },
        { value: "Certificate", label: "Certificate" },
        { value: "Online", label: "Online" },
        { value: "ECS", label: "ECS" },
        { value: "PFMS", label: "PFMS" },
        { value: "Bill", label: "Bill" },
        { value: "UPI Trn ID", label: "UPI Trn ID" },
        { value: "Direct Deposit", label: "Direct Deposit" }
    ];

    console.log(partyName, "partyName")
    const filterInstrumentType = (voucherTypeData, voucherType) => {

        return instrumentType.filter(item => {
            if (voucherTypeData === "R" && ["Token", "Bank Charges", "Bill", "PFMS"].includes(item.value)) {
                return false; // Exclude these for "R"
            }
            if (voucherTypeData === "N" && ["Online", "PFMS"].includes(item.value)) {
                return false; // Exclude these for "N"
            }
            if (voucherTypeData === "R" && voucherType === "B" && ["None", "Token", "Bank Charges", "Bill", "PFMS"].includes(item.value)) {
                return false; // Exclude these for "R" and "Bank"
            }

            if (voucherTypeData === "P" && ["Bank Interest", "Direct Deposit", "Online"].includes(item.value)) {
                return false; // Exclude these for "R"
            }

            if (voucherTypeData === "P" && voucherType === "T" && ["None", "Online"].includes(item.value)) {
                return false; // Exclude these for "R"
            }

            if (voucherTypeData === "R" && voucherType === "T" && ["None", "PFMS"].includes(item.value)) {
                return false; // Exclude these for "R"
            }

            if (voucherTypeData === "P" && voucherType === "B" && ["None", "Online"].includes(item.value)) {
                return false; // Exclude these for "R"
            }

            if (voucherTypeData === "P" && voucherType === "C" && ["Bank Interest", "Fund Transfer", "UPI Trn ID", "Online"].includes(item.value)) {
                return false; // Exclude these for "R"
            }

            if (voucherTypeData === "R" && voucherType === "C" && ["Bank Interest", "Fund Transfer", "UPI Trn ID", "PFMS"].includes(item.value)) {
                return false; // Exclude these for "R"
            }
            return true; // Keep the rest
        });
    };

    const filteredInstTypeOptions = filterInstrumentType(voucherModeData, voucherTypeData);



    console.log(instType, "instType")

    const onPageChange = (e) => {
        setPageChange(e.target.value);
        console.log(`Selected option: ${e.target.value}`);

    };

    const onVoucherMode = (event) => {
        const selectedValue = event.target.value;
        setVoucherTypeData("");
        setVoucherModeData(selectedValue);
        setGetPassForPaymentDataById([]);
        setPaymentDesc("");

        if (selectedValue === "P" || selectedValue === "R") {
            // Show "Cash", "Bank", "Treasury"
            setFilteredTransactions(
                voucherType.filter((type) =>
                    ["Cash", "Bank", "Treasury"].includes(type.label)
                )
            );
        } else if (selectedValue === "N") {
            // Show "Journal", "Contra"
            setFilteredTransactions(
                voucherType.filter((type) =>
                    ["Journal", "Contra"].includes(type.label)
                )
            );
        } else {
            setFilteredTransactions([]);
        }
    };

    const onVoucherType = (e) => {
        setRealAccWithbalance([]);
        setSearchTerm("");
        setSearchTerm2("");
        if (e.target.value === "C") {
            setBankTreasury("900000601")
        } else if (e.target.value === "T") {
            setBankTreasury("900000001")
        } else {
            setBankTreasury("")
        }

        console.log(e.target.value, "typr")
        setVoucherTypeData(e.target.value);
        if (e.target.value === "J") {


            getNominalAccList(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
                "P",
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setNominalAccListForPayment(response);
                setRealAccWithbalance([]);


            })

            getNominalAccList(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
                "R",
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setNominalAccListForReceipt(response);

            })
        } else if (e.target.value === "C") {
            setInstType("")
            setInstTypeAllList({})
            getRealAccWithbalance(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
                "C",
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setRealAccWithbalance(response);
                setNominalAccListForPayment([]);


            })
        } else if (e.target.value === "B") {
            setInstType("")
            setInstTypeAllList({})
            getRealAccWithbalance(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
                "B",
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setRealAccWithbalance(response);
                setNominalAccListForPayment([]);


            })
        } else if (e.target.value === "T") {
            setInstType("")

            setInstTypeAllList({})
            getRealAccWithbalance(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
                "T",
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "tre")
                setRealAccWithbalance(response);
                setNominalAccListForPayment([]);


            })
        }
        else {
            getRealAccAllList(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,

            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setNominalAccListForPayment(response);
                setRealAccWithbalance([]);

            })

            getRealAccAllList(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,

            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setNominalAccListForReceipt(response);

            })

        }
    }

    const onPassForPaymentId = () => {
        setModalPassForPaymentId(true)
    }

    const onClosePassForPayment = () => {
        setModalPassForPaymentId(false)
        setToDatePassForPayment("");
        setFromDatePassForPayment("");
        setPassForPaymentStatus("");
        setPassForPaymentDetailsById([]);

    }

    const onCloseVoucher = () => {
        setModalVoucherId(false)
        setvoucherStatus("");
        setvoucherModalType("");
        setVoucherModalNarration("");
        setVoucherDetailsById([]);
    }

    const onCloseReferenceOf = () => {
        setModalReferenceOf(false)
    }

    const onChossePassForPayment = (d) => {
        getPassForPaymentById(userData?.CORE_LGD, d,
        ).then(function (result) {
            const response = result?.data;
            console.log(response, "report")
            setGetPassForPaymentDataById(response);
            setPaymentDesc(response?.basic?.paymentDesc);
            setModalPassForPaymentId(false)
            setPassForPaymentDetailsById([])
            setFromDatePassForPayment("");
            setToDatePassForPayment("");
            setPassForPaymentStatus("");
            setPassForPaymentDetailsById([]);
        })
    }

    const onChosseVoucher = (d) => {
        getVoucherById(userData?.CORE_LGD, d,
        ).then(function (result) {
            const response = result?.data;
            console.log(response, "report")
            setGetVoucherDataById(response);
            setModalVoucherId(false)
            // setPaymentDesc(response?.basic?.paymentDesc);
            // setPassForPaymentDetailsById([])
            setvoucherStatus("");
            setvoucherModalType("");
            setVoucherModalNarration("");
            setVoucherDetailsById([]);
        })
    }
    const onRetrievePassForPayment = () => {
        if (!fromDatePassForPayment) {
            toast.error("Please select From Date")

        } else if (!toDatePassForPayment) {
            toast.error("Please select To Date")

        } else {
            getPassForPaymentDetails(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
                fromDatePassForPayment, toDatePassForPayment, "V", 1
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setPassForPaymentDetailsById(response);
            })
        }


    }

    const onRetrieveVoucher = () => {
        if (!fromDateVoucher) {
            toast.error("Please select From Date")

        } else if (!toDateVoucher) {
            toast.error("Please select To Date")

        } else if (!voucherModalType) {
            toast.error("Please select a voucher type")

        } else {
            getVoucherDetails(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
                fromDateVoucher, toDateVoucher, voucherModalType, pageChange === "Query" ? voucherStatus : pageChange === "Verify" ? "I" : pageChange === "Delete" ? "I" : 0, voucherModalNarration ? voucherModalNarration : 0
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setVoucherDetailsById(response);
            })
        }


    }

    const onChosse = (d) => {
        setActivityTheme(d)
        setIsOpen(false)
    }

    const onSetPartType = (i) => {
        setPartyType(i?.groupName)
        setShowDropdown(false)
        getAcCodeDescList(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : 0 || userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : 0 || userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
            i?.groupId, voucherModeData,
        ).then(function (result) {
            const response = result?.data;
            console.log(response, "report")
            setAcCodeDescAllList(response);
        })
    }

    const onAccountHeadType = (i) => {
        setAccountHead(i?.groupName)
        setHeadShowDropdown(false)
    }


    const onPartyTypes = (e) => {
        setPartyTypes(e.target.value)
        setName("");
        setNameList([]);
        setPartyName({ contractorId: "", contractorNm: "", empId: "", empName: "", jobWorkerId: "", jobWorkerName: "", deptId: "", deptName: "", lsgCode: "", lsgName: "" });
        // getDeductedtAcCodeList(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : 0 || userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : 0 || userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
        //     (partyTypes === "C" ? "010" : partyTypes === "E" ? "005" : "0"), e.target.value,
        // ).then(function (result) {
        //     const response = result?.data;
        //     console.log(response, "report")

        // })
        queryClient.fetchQuery({ queryKey: ["accDeductList"] });

    }

    const onPartyType = (e) => {
        const value = e.target.value
        setPartyType(value)

        setShowDropdown(true)
        getPartyTypeList(userData?.CORE_LGD, value,
        ).then(function (result) {
            const response = result?.data;
            console.log(response, "report")
            setPartyTypeAllList(response);
        })
    }


    const onBankTreasury = (e) => {
        console.log(e.target.value, "bank")
        setBankTreasury(e.target.value)
        setInstType("")
        setInstTypeAllList({
            bankName: "",
            chequeNo: "",
        })
    }

    console.log(realAccWithbalance[0]?.accountCode, "suva")

    const onInstType = (e) => {
        if (voucherModeData !== "R" && e.target.value === "Cheque" && realAccWithbalance[0]?.accountCode === "900000001") {
            setInstTypeAllList({})


            setInstType(e.target.value)
            getChequeNoForVoucher(userData?.CORE_LGD,
                realAccWithbalance[0]?.accountCode,
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setInstTypeAllList(response);
            })

        } else if (voucherModeData !== "R" && e.target.value === "Cheque" && bankTreasury) {
            setInstTypeAllList({})

            setInstType(e.target.value)
            getChequeNoForVoucher(userData?.CORE_LGD,
                bankTreasury,
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setInstTypeAllList(response);
            })

        } else if (e.target.value === "Cheque" && selectedValue && voucherTypeData === "N") {
            setInstTypeAllList({})

            setInstType(e.target.value)
            getChequeNoForVoucher(userData?.CORE_LGD,
                selectedValue,
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setInstTypeAllList(response);
            })

        } else {
            setInstType(e.target.value)
            setInstTypeAllList({})
        }
    }

    const onBankName = (e) => {
        setInstTypeAllList({ ...instTypeAllList, bankName: e.target.value });
    };


    const onChequeNo = (e) => {
        setInstTypeAllList({ ...instTypeAllList, chequeNo: e.target.value });
    };

    console.log(instTypeAllList?.chequeNo, instTypeAllList?.bankName, "sibamsbam")

    const filteredOptions = nominalAccListForPayment?.filter((option) =>
        option.accountCodeDesc.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredOptions2 = nominalAccListForReceipt?.filter((option) =>
        option.accountCodeDesc.toLowerCase().includes(searchTerm2.toLowerCase())
    );


    const onSearchTerm = (e) => {
        setSearchTerm(e.target.value)
        setShowDropdownSearchTerm(true)
        setInstType("")
        setInstTypeAllList({
            bankName: "",
            chequeNo: "",
        })
    }

    const onSearchTerm2 = (e) => {
        setSearchTerm2(e.target.value)
        setShowDropdownSearchTerm2(true)
    }

    console.log(selectedValue, selectedValue2, "selectedValue")

    const onGrossAmount = (e) => {
        console.log(e.target.value)
        setGrossAmount(e.target.value)
        setNetAmount(e.target.value)

    }


    const onDeductAmount = (e) => {
        console.log(e.target.value)
        setDeductedAmount(e.target.value)
    }


    const onPartyDetails = () => {
        setIsPartyDetailsOpen(true)


    }

    const onPartyTypesRetrieve = () => {
        if (partyTypes === "C") {
            getContractorList(userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD, name ? name : 0,
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setNameList(response);
            })
            // queryClient.fetchQuery({ queryKey: ["tenderList"] });
        } else if (partyTypes === "E") {
            getEmployeeList(userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD, name ? name : 0,
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setNameList(response);
            })
        } else if (partyTypes === "J") {
            getJobWorkerList(userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD, name ? name : 0,
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setNameList(response);
            })
        } else if (partyTypes === "D") {
            getDepartmentList(name ? name : 0,
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setNameList(response);
            })
        }
        else if (partyTypes === "L") {
            getLsgList(name ? name : 0,
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setNameList(response);
            })
        } else {
            Toast.error("Benificiary Under Process")
        }

    }

    const onPartyTypeChosse = (d) => {
        setPartyName(d)
        setFlagPartyType(true)
        setIsPartyDetailsOpen(false)
    }

    const onPartyDetailsClose = () => {
        setIsPartyDetailsOpen(false);
        setName("");
        setNameList([]);
    }

    useEffect(() => {
        if (getPassForPaymentDataById?.basic?.paymentDesc) {
            setPaymentDesc(getPassForPaymentDataById?.basic?.paymentDesc);
        }
    }, [getPassForPaymentDataById]);

    const onVoucherNarration = (e) => {
        setPaymentDesc(e.target.value);
    }

    const onAcCode = (e) => {
        setAccCode(e.target.value)
        if (e.target.value.length >= 5 && e.target.value[3] === "9" && e.target.value[4] === "0" && e.target.value[5] === "1") {
            setMatches901(true);
        } else if (e.target.value.length >= 5 && e.target.value[3] === "8" && e.target.value[4] === "0" && e.target.value[5] === "1") {
            setMatches801(true);
        } else if (e.target.value.length >= 5 && e.target.value[3] === "6" && e.target.value[4] === "0" && e.target.value[5] === "1") {
            setMatches601(true);
        } else if (e.target.value.length >= 5 && e.target.value[3] === "6" && e.target.value[4] === "0" && e.target.value[5] === "2") {
            setMatches601(true);

        }
        else {
            setMatches901(false);
            setMatches801(false);
            setMatches601(false);
        }
    }


    useEffect(() => {
        if (selectedValue.length >= 5 && selectedValue[3] === "9" && selectedValue[4] === "0" && selectedValue[5] === "1") {
            setMatches901(true);
        } else if (selectedValue.length >= 5 && selectedValue[3] === "8" && selectedValue[4] === "0" && selectedValue[5] === "1") {
            setMatches801(true);
        } else if (selectedValue.length >= 5 && selectedValue[3] === "6" && selectedValue[4] === "0" && selectedValue[5] === "1") {
            setMatches601(true);
        } else if (selectedValue.length >= 5 && selectedValue[3] === "6" && selectedValue[4] === "0" && selectedValue[5] === "2") {
            setMatches601(true);
        } else if (selectedValue === "900000601") {
            setMatches000(true)
        }
        else {
            setMatches901(false);
            setMatches801(false);
            setMatches601(false);
            setMatches000(false);

        }
    }, [selectedValue]);


    useEffect(() => {
        if (selectedValue2.length >= 5 && selectedValue2[3] === "9" && selectedValue2[4] === "0" && selectedValue2[5] === "1") {
            setMatches901(true);
        } else if (selectedValue2.length >= 5 && selectedValue2[3] === "8" && selectedValue2[4] === "0" && selectedValue2[5] === "1") {
            setMatches801(true);
        } else if (selectedValue2.length >= 5 && selectedValue2[3] === "6" && selectedValue2[4] === "0" && selectedValue2[5] === "1") {
            setMatches601(true);
        } else if (selectedValue2.length >= 5 && selectedValue2[3] === "6" && selectedValue2[4] === "0" && selectedValue2[5] === "2") {
            setMatches601(true);
        } else if (selectedValue2 === "900000601") {
            setMatches000(true)
        }
        else {
            setMatches901(false);
            setMatches801(false);
            setMatches601(false);
            setMatches000(false);
        }
    }, [selectedValue2]);


    useEffect(() => {
        console.log(getPassForPaymentDataById?.basic?.accountCode, "yeah")
        if (getPassForPaymentDataById?.basic?.accountCode.length >= 5 && getPassForPaymentDataById?.basic?.accountCode[3] === "9" && getPassForPaymentDataById?.basic?.accountCode[4] === "0" && getPassForPaymentDataById?.basic?.accountCode[5] === "1") {
            setMatches901(true);
        } else if (getPassForPaymentDataById?.basic?.accountCode.length >= 5 && getPassForPaymentDataById?.basic?.accountCode[3] === "8" && getPassForPaymentDataById?.basic?.accountCode[4] === "0" && getPassForPaymentDataById?.basic?.accountCode[5] === "1") {
            setMatches801(true);
        } else if (getPassForPaymentDataById?.basic?.accountCode.length >= 5 && getPassForPaymentDataById?.basic?.accountCode[3] === "6" && getPassForPaymentDataById?.basic?.accountCode[4] === "0" && getPassForPaymentDataById?.basic?.accountCode[5] === "1") {
            setMatches601(true);
        } else if (getPassForPaymentDataById?.basic?.accountCode.length >= 5 && getPassForPaymentDataById?.basic?.accountCode[3] === "6" && getPassForPaymentDataById?.basic?.accountCode[4] === "0" && getPassForPaymentDataById?.basic?.accountCode[5] === "2") {
            setMatches601(true);
        } else if (getPassForPaymentDataById?.basic?.accountCode === "900000601") {
            setMatches000(true)
        }
        else {
            setMatches901(false);
            setMatches801(false);
            setMatches601(false);
            setMatches000(false);
        }
    }, [getPassForPaymentDataById?.basic?.accountCode]);


    const onVoucherDate = (e) => {
        const selectedDate = new Date(e.target.value);
        setVoucherDate(e.target.value)
        setReceiptPaymentDate(e.target.value);

        if (receiptPaymentDate) {
            setReceiptPaymentDate(e.target.value);
        }

        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth(); // January = 0, February = 1, ..., December = 11

        if (month >= 3) {
            // If the month is April (3) or later
            setFinancialYear(`${year}-${year + 1}`);
        } else {
            // If the month is January, February, or March
            setFinancialYear(`${year - 1}-${year}`);
        }
    }

    const onVoucherNo = (e) => {
        setVoucherNo(e.target.value);
    };

    const getPaytoValue = () => {
        return partyTypes === "C" ? partyName?.contractorNm
            : partyTypes === "E" ? partyName?.empName
                : partyTypes === "J" ? partyName?.jobWorkerName
                    : partyTypes === "D" ? partyName?.deptName
                        : partyTypes === "L" ? partyName?.lsgName
                            : "";
    };

    useEffect(() => {
        setPayto(getPaytoValue()); // Update state whenever dependencies change
    }, [partyTypes, partyName]); // Listen for changes in partyTypes AND partyName

    const onPayTo = (e) => {
        setPayto(e.target.value);
    };

    console.log(nameList, "nameList")
    const getPayAddress = () => {
        return partyTypes === "C"
            ? partyName?.contractorAdd
            : partyTypes === "E"
                ? partyName?.empAddress
                : partyTypes === "J"
                    ? partyName?.jobWorkerAddress
                    : partyTypes === "D"
                        ? partyName?.deptAbv
                        : partyTypes === "L"
                            ? (partyName?.lgdAdd1 ?? "") + " " + (partyName?.lgdAdd2 ?? "")
                            : "";
    };

    useEffect(() => {
        setPayAddress(getPayAddress()); // Update state whenever dependencies change
    }, [partyTypes, partyName]);

    const onPayAddress = (e) => {
        setPayAddress(e.target.value)
    }

    const onAllotmentNo = (e) => {
        setAllotmentNo(e.target.value)
    }

    const onAllotmentDate = (e) => {
        setAllomentDate(e.target.value)
    }


    const paymentDateStr = getPassForPaymentDataById?.basic?.paymentDate;
    const voucherDateStr = voucherDate; // Assuming voucherDate is always valid
    const receiptDateStr = receiptPaymentDate;
    // Ensure paymentDateStr is valid before processing
    const paymentDate = paymentDateStr
        ? new Date(paymentDateStr.split('.').reverse().join('-'))
        : null;
    const compareDate = voucherDateStr
        ? new Date(voucherDateStr.split('.').reverse().join('-'))
        : null;

    const receiptDate = receiptPaymentDate
        ? new Date(receiptPaymentDate.split('.').reverse().join('-'))
        : null;

    // const compareDate = new Date(voucherDateStr.split('.').reverse().join('-'));

    const onSave = () => {

        if (!voucherModeData) {
            toast.error("Please select Voucher Mode")
        } else if (voucherModeData === "P" && !getPassForPaymentDataById?.basic?.pfpId) {
            toast.error("Please select Pass for Payment ID")
        } else if (paymentDate > compareDate) {
            toast.error("Voucher Date Should be Greater than Payment Date")
        } else if (!voucherDate) {
            toast.error("Please select Voucher Date")
        } else if (!voucherTypeData) {
            toast.error("Please select Voucher Type")
        } else if (voucherTypeData === "B" && !bankTreasury) {
            toast.error("Please select Bank Treasury")
        } else if ((voucherModeData === "P" || voucherModeData === "R") && realAccWithbalance.length < 1) {
            toast.error("OB not found in selected account code");
        } else if (voucherModeData === "R" && !partyType) {
            toast.error("Please select GL Group")
        } else if (voucherModeData === "R" && !accCode) {
            toast.error("Please select Account Code Desc")
        } else if (voucherModeData === "R" && !instType) {
            toast.error("Please Select Instrument Type")
        } else if (voucherModeData === "P" && voucherTypeData !== "C" && !instType) {
            toast.error("Please Select Instrument Type")

        } else if (voucherModeData === "R" && instType !== "None" && !instTypeAllList?.bankName && !instTypeAllList?.chequeNo) {
            toast.error("Please Type Bank/Treasury Name and Cheque No")

        } else if (voucherModeData === "P" && voucherTypeData !== "C" && !instTypeAllList?.bankName && !instTypeAllList?.chequeNo) {
            toast.error("Please Type Bank/Treasury Name and Cheque No")

        } else if (paymentDate > receiptDate) {
            toast.error("Receipt Date Should be Greater than Payment Date")

        } else if (voucherModeData === "R" && !grossAmount) {
            toast.error("Please Enter Gross Amount")
        } else if (voucherModeData === "R" && !partyTypes) {
            toast.error("Please Select Party Type")
        } else if (voucherModeData === "R" && !payto) {
            toast.error("Please Enter Pay To")
        } else if (voucherModeData === "R" && !(partyTypes === "N" || partyTypes === "O") && !(flagPartyType && payto)) {
            toast.error("Please Select Party Details");
        } else if (voucherModeData === "N" && voucherTypeData === "J" && !searchTerm) {
            toast.error("Please Select Transfer from");
        } else if (voucherModeData === "N" && voucherTypeData === "J" && !searchTerm2) {
            toast.error("Please Select Transfer to");
        } else if (voucherModeData === "N" && voucherTypeData === "N" && !searchTerm) {
            toast.error("Please Select Transfer From");
        } else if (voucherModeData === "N" && voucherTypeData === "N" && !searchTerm2) {
            toast.error("Please Select Deposited to");
        } else if (voucherTypeData === "N" && !instType) {
            toast.error("Please Select Instrument Type")
        } else if (!paymentDesc) {
            toast.error("Please Enter Voucher Narration")
        } else if (voucherModeData === "N" && voucherTypeData === "J" && !grossAmount) {
            toast.error("Please Type Gross Amount");
        } else if (matches901 && voucherModeData === "R" && Number(grossAmount) !== Number(referenceOfDataByAmount)) {
            toast.error("Gross Amount Should be equal to Reference Amount")
        } else if (matches801 && (voucherModeData === "R" || voucherModeData === "N") && Number(grossAmount) > Number(referenceOfDataByAmount)) {
            toast.error("Gross Amount should not be greater than Reference Amount");
        }
        else {
            setConfirmSubmitFlag(true);
        }
    }




    const onPreview = () => {
        if (!voucherModeData) {
            toast.error("Please select Voucher Mode")
        } else if (voucherModeData === "P" && !getPassForPaymentDataById?.basic?.pfpId) {
            toast.error("Please select Pass for Payment ID")
        } else if (paymentDate > compareDate) {
            toast.error("Voucher Date Should be Greater than Payment Date")
        } else if (!voucherDate) {
            toast.error("Please select Voucher Date")
        } else if (!voucherTypeData) {
            toast.error("Please select Voucher Type")
        } else if (voucherTypeData === "B" && !bankTreasury) {
            toast.error("Please select Bank Treasury")
        } else if (voucherModeData === "R" && !partyType) {
            toast.error("Please select GL Group")
        } else if (voucherModeData === "R" && !accCode) {
            toast.error("Please select Account Code Desc")
        } else if (voucherModeData === "R" && !instType) {
            toast.error("Please Select Instrument Type")
        } else if (voucherModeData === "P" && voucherTypeData !== "C" && !instType) {
            toast.error("Please Select Instrument Type")

        } else if (voucherModeData === "R" && instType !== "None" && !instTypeAllList?.bankName && !instTypeAllList?.chequeNo) {
            toast.error("Please Type Bank/Treasury Name and Cheque No")

        } else if (voucherModeData === "P" && voucherTypeData !== "C" && !instTypeAllList?.bankName && !instTypeAllList?.chequeNo) {
            toast.error("Please Type Bank/Treasury Name and Cheque No")

        } else if (paymentDate > receiptDate) {
            toast.error("Receipt Date Should be Greater than Payment Date")

        } else if (voucherModeData === "R" && !grossAmount) {
            toast.error("Please Enter Gross Amount")
        }

        else if (voucherModeData === "R" && !partyTypes) {
            toast.error("Please Select Party Type")
        }
        else if (voucherModeData === "R" && !(partyTypes === "N" || partyTypes === "O") && !(flagPartyType && payto && payAddress)) {
            toast.error("Please Select Party Details");
        } else if (voucherModeData === "N" && voucherTypeData === "J" && !searchTerm) {
            toast.error("Please Select Transfer from");
        } else if (voucherModeData === "N" && voucherTypeData === "J" && !searchTerm2) {
            toast.error("Please Select Transfer to");
        }
        else if (voucherModeData === "N" && voucherTypeData === "N" && !searchTerm) {
            toast.error("Please Select Encash from");
        } else if (voucherModeData === "N" && voucherTypeData === "N" && !searchTerm2) {
            toast.error("Please Select Deposited to");
        } else if (voucherTypeData === "N" && !instType) {
            toast.error("Please Select Instrument Type")
        } else if (!paymentDesc) {
            toast.error("Please Enter Voucher Narration")
        } else if (voucherModeData === "N" && voucherTypeData === "J" && !grossAmount) {
            toast.error("Please Type Gross Amount");
        } else {
            setVoucherFlag(true)

        }
    }

    const onSimilarEntry = () => {
        setSaveDisabled(false)
        setPartyName({
            "contractorId": "",
            "contractorNm": "",
            "contractorPan": "",
            "contractorGstin": "",
            "contractorDob": "",
            "contractorAdd": "",
            "contractorPh": ""
        });
        setPayto("");
        setPayAddress("");
        setVoucherResponse({
            message: "",
            status: "",
            voucherAmount: "",
            voucherId: "",
            voucherStatus: ""
        });
        setGrossAmount("");
        setDeductedAmount("");
        setNetAmount("");


    }


    const onConfirmSubmit = () => {
        setLoader(true)
        addVoucherEntry(
            userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : 0 || userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : 0 || userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
            financialYear,
            voucherModeData,
            voucherTypeData,
            voucherDate,
            voucherNo,
            getPassForPaymentDataById?.basic?.pfpId,
            voucherModeData === "N" ? selectedValue : bankTreasury ? bankTreasury : realAccWithbalance[0]?.accountCode,
            voucherModeData === "N" ? selectedValue2 : getPassForPaymentDataById?.basic?.accountCode || accCode,
            voucherModeData === "P" ? (getPassForPaymentDataById?.basic?.deductAmount) + (getPassForPaymentDataById?.basic?.netAmount) : grossAmount,
            voucherModeData === "P" ? getPassForPaymentDataById?.basic?.deductAmount : deductedAmount,
            voucherModeData === "P" ? getPassForPaymentDataById?.basic?.netAmount : netAmount,
            paymentDesc,
            voucherModeData === "P" ? getPassForPaymentDataById?.basic?.partyType : partyTypes,
            voucherModeData === "P" ? getPassForPaymentDataById?.basic?.partyCode : partyTypes === "C" ? partyName?.contractorId : partyTypes === "E" ? partyName?.empId : partyTypes === "J" ? partyName?.jobWorkerId : partyTypes === "D" ? partyName?.deptId : partyTypes === "L" ? partyName?.lsgCode : "",
            voucherModeData === "P" ? getPassForPaymentDataById?.basic?.payAddress : payAddress,
            voucherModeData === "P" ? getPassForPaymentDataById?.basic?.payTo : payto,
            userData?.USER_INDEX,
            instType,
            instTypeAllList?.bankName,
            instTypeAllList?.chequeNo,
            receiptPaymentDate,
            getPassForPaymentDataById?.basic?.subAllot === "1" ? 1 : 0,
            selectedValue === "900000601" || selectedValue2 === "900000601" || matches000 || voucherTypeData === "C" ? 1 : 0,
            matches801 ? 1 : 0,
            matches901 ? 1 : 0,
            matches601 ? 1 : 0,
            accountHeadAllList.find(item => item.groupName === accountHead)?.groupId ?? null,
            referenceOfDataById,
            null,
            voucherModeData === "P" ? getPassForPaymentDataById?.basic?.allotmentNo : allotmentNo,
            allotmentDate,
            challanNo,
            challanByWhom,
            challanWhoseBehalf,
            base64String,
            (r) => {
                console.log(r, "dd");
                if (r.status == 0) {
                    setVoucherResponse(r);
                    toast.success(r.message);
                    setConfirmSubmitFlag(false);
                    setShowVoucherID(true);
                    setLoader(false);


                    if (voucherModeData === "P") {
                        // setVoucherPaymentFlag(true);
                        getDebitVoucher(userData?.CORE_LGD, r?.voucherId).then((response) => {
                            if (response.status === 200) {
                                setVoucherData(response.data);
                            } else {
                                toast.error("Failed to fetch data");
                            }
                        });
                    } else if (voucherModeData === "N" && voucherTypeData === "N") {
                        // setVoucherContraFlag(true)
                        getContraVoucher(userData?.CORE_LGD, r?.voucherId).then((response) => {
                            if (response.status === 200) {
                                setVoucherData(response.data);
                            } else {
                                toast.error("Failed to fetch data");
                            }
                        });
                    } else if (voucherModeData === "R") {
                        // setVoucherCreditFlag(true)
                        getReceiptVoucher(userData?.CORE_LGD, r?.voucherId).then((response) => {
                            if (response.status === 200) {
                                setVoucherData(response.data);
                                if (voucherModeData === "R" && voucherTypeData === "C") {
                                    // setVoucherCashierReceiptFlag(true)
                                    getCashierReceiptVoucher(userData?.CORE_LGD, r?.voucherId).then((response) => {
                                        if (response.status === 200) {
                                            setVoucherDataCashierReceipt(response.data);
                                        } else {
                                            toast.error("Failed to fetch data");
                                        }
                                    });
                                }
                            } else {
                                toast.error("Failed to fetch data");
                            }
                        });
                    }
                    else if (voucherModeData === "N" && voucherTypeData === "J") {
                        // setVoucherJournalFlag(true)
                        getJournalVoucher(userData?.CORE_LGD, r?.voucherId).then((response) => {
                            if (response.status === 200) {
                                setVoucherData(response.data);
                            } else {
                                toast.error("Failed to fetch data");
                            }
                        });
                    }


                } else if (r.status == 1) {
                    setLoader(false);
                    toast.error(r.message);
                }
            }
        );
    }

    const onSubmitDelete = () => {
        if (!deleteReason) {
            toast.error("Please Enter Reason for Deletion")
        } else {
            deleteVoucher(userData?.CORE_LGD, voucherDataById?.basic?.voucherId, deleteReason, userData?.USER_INDEX,
                (r) => {
                    console.log(r, "dd");
                    if (r.status == 0) {
                        // setOpenModal(true);
                        // setPassforPaymentResponse(r)
                        toast.success(r.message);
                        setDeleteReason("");
                        setGetVoucherDataById("")
                        setDeleteFlag(false)
                        window.location.reload();


                    } else if (r.status == 1) {
                        toast.error(r.message);
                    }
                }
            );
        }
    }


    const onSubmitVerify = () => {

        verifyVoucher(userData?.CORE_LGD, voucherDataById?.basic?.voucherId, userData?.USER_INDEX,
            (r) => {
                console.log(r, "dd");
                if (r.status == 0) {
                    toast.success(r.message);
                    setVerifyFlag(false)
                    window.location.reload();


                } else if (r.status == 1) {
                    toast.error(r.message);
                }
            }
        );

    }

    const onCloseConfirmSubmit = () => {
        setConfirmSubmitFlag(false);
    };

    const onDeleteClose = () => {
        setDeleteFlag(false)
    }


    const onVerifyClose = () => {
        setVerifyFlag(false)
    }

    const onClosePreview = () => {
        setVoucherFlag(false)
    }


    const onChallanNo = (e) => {
        setChallanNo(e.target.value)
    }

    const onChallanByWhom = (e) => {
        setChallanByWhom(e.target.value)

    }

    const onChallanWhoseBehalf = (e) => {
        setChallanWhoseBehalf(e.target.value)

    }


    const onAccountHead = (e) => {
        const value = e.target.value

        setAccountHead(value)

        setHeadShowDropdown(true)
        getAccountHeadList(userData?.CORE_LGD, value,
        ).then(function (result) {
            const response = result?.data;
            console.log(response, "report")
            setAccountHeadAllList(response);
        })
    }

    const onReferenceOf = () => {
        setModalReferenceOf(true)
    }

    const onRetrieveReferenceOf = () => {
        getReferenceOfDetails(userData?.CORE_LGD, accountHeadAllList.find(item => item.groupName === accountHead)?.groupId ?? null,
        ).then(function (result) {
            const response = result?.data;
            console.log(response, "report")
            setReferenceOfDetailsById(response);
        })
    }

    const onRetrieveReferenceOfAdvance = () => {
        getReferenceOfAdvanceAdj(userData?.CORE_LGD, accountHeadAllList.find(item => item.groupName === accountHead)?.groupId ?? null,
            partyTypes === "C" ? partyName?.contractorId : partyTypes === "E" ? partyName?.empId : partyTypes === "J" ? partyName?.jobWorkerId : partyTypes === "D" ? partyName?.deptId : partyTypes === "L" ? partyName?.lsgCode : getPassForPaymentDataById?.basic?.partyCode,
        ).then(function (result) {
            const response = result?.data;
            console.log(response, "report")
            setReferenceOfDetailsByAdvanceAdj(response);
        })
    }

    const onChosseReferenceOf = (id, amount, narration) => {
        setReferenceOfDataById(id)
        setReferenceOfDataByAmount(amount)
        setReferenceOfDataByNarration(narration)

        setModalReferenceOf(false)
    }

    const onCloseVoucherId = () => {
        setShowVoucherID(false)
        setSaveDisabled(true)
    }


    const onNextPfp = (e) => {
        setShowVoucherID(false)
        setNextPfp(true)
        getNextPassForPaymentId(userData?.CORE_LGD, e).then((response) => {
            if (response.status === 200) {
                setNextPfpData(response.data);
            } else {
                toast.error("Failed to fetch data");
            }
        });

    }
    const onNextPfpProceed = () => {
        setNextPfp(false)
        getPassForPaymentById(userData?.CORE_LGD, nextPfpData?.nextPfpId,
        ).then(function (result) {
            const response = result?.data;
            console.log(response, "report")
            setGetPassForPaymentDataById(response);
            setPaymentDesc(response?.basic?.paymentDesc);
            setModalPassForPaymentId(false)
            setPassForPaymentDetailsById([])
            setFromDatePassForPayment("");
            setToDatePassForPayment("");
            setPassForPaymentStatus("");
            setPassForPaymentDetailsById([]);
            setVoucherDate("");
            setVoucherTypeData("");
            setBankTreasury("");
            setInstType("");
            setInstTypeAllList({
                bankName: "",
                chequeNo: "",
            });
            setVoucherResponse({
                message: "",
                status: "",
                voucherAmount: "",
                voucherId: "",
                voucherStatus: ""
            });
        })
        if (voucherModeData !== "R" && instType === "Cheque" && realAccWithbalance[0]?.accountCode === "900000001") {
            setInstTypeAllList({})
            setInstType(instType)
            getChequeNoForVoucher(userData?.CORE_LGD,
                realAccWithbalance[0]?.accountCode,
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setInstTypeAllList(response);
            })

        } else if (voucherModeData !== "R" && instType === "Cheque" && bankTreasury) {
            setInstTypeAllList({})
            setInstType(instType)
            getChequeNoForVoucher(userData?.CORE_LGD,
                bankTreasury,
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setInstTypeAllList(response);
            })

        } else if (instType === "Cheque" && selectedValue && voucherTypeData === "N") {
            setInstTypeAllList({})
            setInstType(instType)
            getChequeNoForVoucher(userData?.CORE_LGD,
                selectedValue,
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setInstTypeAllList(response);
            })

        } else {
            setInstType(instType)
            setInstTypeAllList({})
        }

    }

    const onNextPfpClose = () => {
        window.location.reload();
        setNextPfp(false)
    }

    const onNextPfpProceedwithPreviousVoucherType = () => {
        setNextPfp(false)
        getPassForPaymentById(userData?.CORE_LGD, nextPfpData?.nextPfpId,
        ).then(function (result) {
            const response = result?.data;
            console.log(response, "report")
            setGetPassForPaymentDataById(response);
            setPaymentDesc(response?.basic?.paymentDesc);
            setModalPassForPaymentId(false)
            setPassForPaymentDetailsById([])
            setFromDatePassForPayment("");
            setToDatePassForPayment("");
            setPassForPaymentStatus("");
            setPassForPaymentDetailsById([]);

            setVoucherResponse({
                message: "",
                status: "",
                voucherAmount: "",
                voucherId: "",
                voucherStatus: ""
            });
        })
        if (voucherModeData !== "R" && instType === "Cheque" && realAccWithbalance[0]?.accountCode === "900000001") {
            setInstTypeAllList({})
            setInstType(instType)
            getChequeNoForVoucher(userData?.CORE_LGD,
                realAccWithbalance[0]?.accountCode,
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setInstTypeAllList(response);
            })

        } else if (voucherModeData !== "R" && instType === "Cheque" && bankTreasury) {
            setInstTypeAllList({})
            setInstType(instType)
            getChequeNoForVoucher(userData?.CORE_LGD,
                bankTreasury,
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setInstTypeAllList(response);
            })

        } else if (instType === "Cheque" && selectedValue && voucherTypeData === "N") {
            setInstTypeAllList({})
            setInstType(instType)
            getChequeNoForVoucher(userData?.CORE_LGD,
                selectedValue,
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setInstTypeAllList(response);
            })

        } else {
            setInstType(instType)
            setInstTypeAllList({})
        }

    }




    console.log(VoucherResponse, "sisisisisi")

    const onReset = () => {
        window.location.reload();
    }

    const onVoucherPrint = () => {
        if (voucherModeData === "P") {
            setVoucherPaymentFlag(true);
        } else if (voucherModeData === "N" && voucherTypeData === "N") {
            setVoucherContraFlag(true)
        } else if (voucherModeData === "R") {
            setVoucherCreditFlag(true)
        } else if (voucherModeData === "N" && voucherTypeData === "J") {
            setVoucherJournalFlag(true)
        }
    }


    const onQueryVoucherPrint = () => {
        // if (voucherDataById?.basic?.voucherMode === "P") {

        if (voucherDataById?.basic?.voucherMode === "P") {
            setVoucherQueryPaymentFlag(true);
            getDebitVoucher(userData?.CORE_LGD, voucherDataById?.basic?.voucherId).then((response) => {
                if (response.status === 200) {
                    setVoucherData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        } else if (voucherDataById?.basic?.voucherMode === "N" && voucherDataById?.basic?.voucherType === "N") {
            setVoucherQueryContraFlag(true)
            getContraVoucher(userData?.CORE_LGD, voucherDataById?.basic?.voucherId).then((response) => {
                if (response.status === 200) {
                    setVoucherData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        } else if (voucherDataById?.basic?.voucherMode === "R") {
            setVoucherQueryCreditFlag(true)
            getReceiptVoucher(userData?.CORE_LGD, voucherDataById?.basic?.voucherId).then((response) => {
                if (response.status === 200) {
                    setVoucherData(response.data);
                    if (voucherDataById?.basic?.voucherMode === "R" && voucherDataById?.basic?.voucherType === "C") {
                        // setVoucherCashierReceiptFlag(true)
                        getCashierReceiptVoucher(userData?.CORE_LGD, voucherDataById?.basic?.voucherId).then((response) => {
                            if (response.status === 200) {
                                setVoucherData(response.data);
                            } else {
                                toast.error("Failed to fetch data");
                            }
                        });
                    }
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        } else if (voucherDataById?.basic?.voucherMode === "N" && voucherDataById?.basic?.voucherType === "J") {
            setVoucherQueryJournalFlag(true)
            getJournalVoucher(userData?.CORE_LGD, voucherDataById?.basic?.voucherId).then((response) => {
                if (response.status === 200) {
                    setVoucherData(response.data);
                } else {
                    toast.error("Failed to fetch data");
                }
            });
        }
    }



    const onCashierReceiptPrint = () => {
        setVoucherCashierReceiptFlag(true)
    }

    const handleDownload = () => {
        const input = document.getElementById("voucher-container"); // Select the container

        if (!input) {
            console.error("Element #voucher-container not found.");
            return;
        }

        html2canvas(input, {
            scale: 2, // Ensure better resolution
            useCORS: true, // Fixes font and image loading issues
        }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

            pdf.addImage(imgData, "PNG", 0, 4, imgWidth, imgHeight);
            pdf.save("voucher.pdf"); // Trigger download
        }).catch((error) => {
            console.error("Error generating PDF:", error);
        });
    };

    const handlePrint = () => {
        const printContent = printRef.current.innerHTML;
        const myWindow = window.open("", "prnt_area", "height=800,width=700");
        myWindow.document.write(`
              <html>
              <head>
                <title>Cash Analysis</title>
                <style>
                .mm p{position:absolute;top:150px;right:20px !important;}
                .col-span-12{text-align:center;}
                p {line-height:.5 !important;}
                .clearfix{clear:both;}

                .prd{float:left; font-weight:bold;text-align:left;margin:10px !important;padding:0 !important;}
                .stts{float:right; font-weight:bold;text-align:right;margin:10px !important;padding:0 !important;}
                .logo{float:left;}
                .info h2{text-align:center}
                .info{text-align:center !important}
                    .info p{text-align:center !important}
                    .info span{text-align:center}
                    .xx{position:relative;}

                  @media print {
.hh {
  border-width: 0 !important; /* Removes border but keeps color settings */
}   
                  .info h2{text-align:center}
                .prn-dt{text-align:right !important;}
                .info{text-align:center !important;margin:0 !important;padding:0 !important}
                    .info p{text-align:center !important;margin:0 !important;padding:0 !important}
                    .info span{text-align:center;margin:0 !important;padding:0 !important}
                    .mylogo img{width:500px; position:absolute; right:0;}
                    .mylogo{position:relative;}
                    .logomy img{width:100px;}
                    .logomy{text-align:right !important;position:absolute;top:0px;right:0px !important;}
.redclr {color:red}
.tbsize {font-size:12px}
.gap {margin-top:50px !important;}
.smallbold {font-size:12px;font-weight:bold;}
.rightall {text-align:right;}
.bigbold {font-size:20px;font-weight:bold;}
.vv p>span{line-height:1;margin-bottom:5px;}
.vv {margin-top:25px;border-top:1px solid #ccc;}
                    thead { display: table-header-group; }
                    tfoot { display: table-footer-group; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid black; padding: 8px;}
                    .vert div {
                    writing-mode: vertical-rl; 
                    transform: rotate(180deg); 
                    white-space: nowrap;
                    text-align: center;
                    height: 8rem;
                    width: 2.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    }

      /* Target both regular and header cells in .parti containers */
.parti {
  width:300px !important;       /* Fixed width */
  max-width: 300px !important;   /* Ensures width doesn't exceed */
  min-width: 300px !important;   /* Prevents shrinking */
  white-space: normal !important; /* Allows text wrapping */
  word-wrap: break-word !important; /* Breaks long words */
  overflow-wrap: break-word !important; /* Modern alternative */
}

.openClr {
  background-color: #cce5ff !important; /* Light blue background */
  }

  .whiteclr {
  color: #fff !important; /* Black text color */
  }

  .blueclr {
  color: #cce5ff !important; /* Blue text color */
  }

.foot {
text-align: center !important;font-style: italic; margin:30px !important;padding:0 !important;}
                </style>
              </head>
              <body>
                ${printContent}
              </body>
              </html>
            `);
        myWindow.document.close();
        myWindow.focus();
        myWindow.print();
        myWindow.close();
    };

    const onCloseModal = () => {

        if (voucherModeData === "P") {
            setVoucherPaymentFlag(false);
        } else if (voucherModeData === "N" && voucherTypeData === "N") {
            setVoucherContraFlag(false)
        } else if (voucherModeData === "R") {
            setVoucherCreditFlag(false)
        } else if (voucherModeData === "N" && voucherTypeData === "J") {
            setVoucherJournalFlag(false)
        }

    }

    const onCloseQueryModal = () => {
        if (voucherDataById?.basic?.voucherMode === "P") {
            setVoucherQueryPaymentFlag(false);
        } else if (voucherDataById?.basic?.voucherMode === "N" && voucherDataById?.basic?.voucherType === "N") {
            setVoucherQueryContraFlag(false)
        } else if (voucherDataById?.basic?.voucherMode === "R") {
            setVoucherQueryCreditFlag(false)
        } else if (voucherDataById?.basic?.voucherMode === "N" && voucherDataById?.basic?.voucherType === "J") {
            setVoucherQueryJournalFlag(false)
        }

    }

    const onCloseModalCashierReceipt = () => {
        setVoucherCashierReceiptFlag(false)
    }

    const onVocuherDetails = () => {
        setModalVoucherId(true)
    }

    const dataArray = [
        { value: "R", label: "Credit Voucher (Receipt)" },
        { value: "P", label: "Debit Voucher (Payment)" },
        { value: "C", label: "Contra Voucher (Bank/Treasury/Cash Transfer)" },
        { value: "J", label: "Journal Voucher (Ledger Transfer)" },
        // { value: "CR", label: "Cashier Receipt" },
        // { value: "CH", label: "Treasury  Challan" },
        // { value: "AK", label: "Adjustment Acknowledgement" },
        // { value: "PO", label: "Payment Order" },

    ];


    const onFile = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result;
                setBase64String(base64);
                setImagePreview(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const onDeletePop = () => {
        if (!voucherDataById?.basic?.voucherId) {
            toast.error("Please select Voucher ID")
        } else {
            setDeleteFlag(true);
        }
    }


    const onVerifyPop = () => {
        if (!voucherDataById?.basic?.voucherId) {
            toast.error("Please select Voucher ID")
        } else {
            setVerifyFlag(true);
        }
    }

    const handlePrintDebit = () => {
        const printContent = printRef.current.innerHTML;
        const myWindow = window.open("", "prnt_area", "height=800,width=700");
        myWindow.document.write(`
              <html>
              <head>
                <title>Debit Voucher</title>
                <style>
                .mm p{position:absolute;top:150px;right:20px !important;}
                .col-span-12{text-align:center;}
                p {line-height:.5 !important;}
                .clearfix{clear:both;}

                .prd{float:left; font-weight:bold;text-align:left;}
                .stts{float:right; font-weight:bold;text-align:right;}
                .logo{float:left;}
                .info h2{text-align:center}
                .info{text-align:center !important}
                    .info p{text-align:center !important}
                    .info span{text-align:center}
                    .xx{position:relative;}

                  @media print {
.hh {
  border-width: 0 !important; /* Removes border but keeps color settings */
}   
                  .info h2{text-align:center}
                .prn-dt{text-align:right !important;}
                .info{text-align:center !important;margin:0 !important;padding:0 !important}
                    .info p{text-align:center !important;margin:0 !important;padding:0 !important}
                    .info span{text-align:center;margin:0 !important;padding:0 !important}
                    .mylogo img{width:500px; position:absolute; right:0;}
                    .mylogo{position:relative;}
                    .logomy img{width:100px;}
                    .logomy{text-align:right !important;position:absolute;top:0px;right:0px !important;}
.redclr {color:red}
.lhght{line-height:1.5 !important;}
.half{width:300px !important;float:left !important;}
.tbsize {font-size:12px}
.gap {margin-top:50px !important;}
.smallbold {font-size:12px;font-weight:bold;}
.rightall {text-align:right;}
.bigbold {font-size:20px;font-weight:bold;}
.vv p>span{line-height:1;margin-bottom:5px;}
.vv {margin-top:25px;border-top:1px solid #ccc;}
                    thead { display: table-header-group; }
                    tfoot { display: table-footer-group; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid black; padding: 8px;}
                    .vert div {
                    writing-mode: vertical-rl; 
                    transform: rotate(180deg); 
                    white-space: nowrap;
                    text-align: center;
                    height: 8rem;
                    width: 2.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    }

      /* Target both regular and header cells in .parti containers */
.parti {
  width:300px !important;       /* Fixed width */
  max-width: 300px !important;   /* Ensures width doesn't exceed */
  min-width: 300px !important;   /* Prevents shrinking */
  white-space: normal !important; /* Allows text wrapping */
  word-wrap: break-word !important; /* Breaks long words */
  overflow-wrap: break-word !important; /* Modern alternative */
}

.openClr {
  background-color: #cce5ff !important; /* Light blue background */
  }

  .whiteclr {
  color: #fff !important; /* Black text color */
  }

  .blueclr {
  color: #cce5ff !important; /* Blue text color */
  }

.foot {
text-align: center !important;font-style: italic; margin:30px !important;padding:0 !important;}
                </style>
              </head>
              <body>
                ${printContent}
              </body>
              </html>
            `);
        myWindow.document.close();
        myWindow.focus();
        myWindow.print();
        myWindow.close();
    };


    const handlePrintCredit = () => {
        const printContent = printRef.current.innerHTML;
        const myWindow = window.open("", "prnt_area", "height=800,width=700");
        myWindow.document.write(`
              <html>
              <head>
                <title>CREDIT Voucher</title>
                <style>
                .mm p{position:absolute;top:150px;right:20px !important;}
                .col-span-12{text-align:center;}
                p {line-height:.5 !important;}
                .clearfix{clear:both;}

                .prd{float:left; font-weight:bold;text-align:left;}
                .stts{float:right; font-weight:bold;text-align:right;}
                .logo{float:left;}
                .info h2{text-align:center}
                .info{text-align:center !important}
                    .info p{text-align:center !important}
                    .info span{text-align:center}
                    .xx{position:relative;}

                  @media print {
.hh {
  border-width: 0 !important; /* Removes border but keeps color settings */
}   
                  .info h2{text-align:center}
                .prn-dt{text-align:right !important;}
                .info{text-align:center !important;margin:0 !important;padding:0 !important}
                    .info p{text-align:center !important;margin:0 !important;padding:0 !important}
                    .info span{text-align:center;margin:0 !important;padding:0 !important}
                    .mylogo img{width:500px; position:absolute; right:0;}
                    .mylogo{position:relative;}
                    .logomy img{width:100px;}
                    .logomy{text-align:right !important;position:absolute;top:0px;right:0px !important;}
.redclr {color:red}
.lhght{line-height:1.5 !important;}
.half{width:300px !important;float:left !important;}
.tbsize {font-size:12px}
.gap {margin-top:50px !important;}
.smallbold {font-size:12px;font-weight:bold;}
.rightall {text-align:right;}
.bigbold {font-size:20px;font-weight:bold;}
.vv p>span{line-height:1;margin-bottom:5px;}
.vv {margin-top:25px;border-top:1px solid #ccc;}
                    thead { display: table-header-group; }
                    tfoot { display: table-footer-group; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid black; padding: 8px;}
                    .vert div {
                    writing-mode: vertical-rl; 
                    transform: rotate(180deg); 
                    white-space: nowrap;
                    text-align: center;
                    height: 8rem;
                    width: 2.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    }

      /* Target both regular and header cells in .parti containers */
.parti {
  width:300px !important;       /* Fixed width */
  max-width: 300px !important;   /* Ensures width doesn't exceed */
  min-width: 300px !important;   /* Prevents shrinking */
  white-space: normal !important; /* Allows text wrapping */
  word-wrap: break-word !important; /* Breaks long words */
  overflow-wrap: break-word !important; /* Modern alternative */
}

.openClr {
  background-color: #cce5ff !important; /* Light blue background */
  }

  .whiteclr {
  color: #fff !important; /* Black text color */
  }

  .blueclr {
  color: #cce5ff !important; /* Blue text color */
  }

.foot {
text-align: center !important;font-style: italic; margin:30px !important;padding:0 !important;}
                </style>
              </head>
              <body>
                ${printContent}
              </body>
              </html>
            `);
        myWindow.document.close();
        myWindow.focus();
        myWindow.print();
        myWindow.close();
    };


    return (
        <>
            <ToastContainer />

            <Modal isOpen={voucherPaymentFlag}
                // onRequestClose={() => setIsPartyDetailsOpen(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "50%",
                        height: "90%",
                        margin: "auto",
                        padding: "18px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                <motion.div
                    initial={{ x: "100vw", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100vw", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div id="voucher-container" style={{ fontFamily: "InterVariable, sans-serif" }} ref={printRef} className="w-full max-w-6xl mx-auto p-4 text-xs info">
                        {/* Header */}
                        <div style={{ margin: "0 0 5px !important", padding: "0 !important" }} className="text-center info smallbold">
                            <span className="flex-1 text-center font-bold">{voucherData?.voucherDetails?.rule}</span>
                        </div>
                        <div style={{ margin: "0 0 5px !important", padding: "0 !important" }} className="info flex w-full justify-between items-center relative">
                            {/* Centered span message */}
                            <span style={{ top: "10px !important" }} className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
                                DEBIT VOUCHER
                            </span>

                            {/* Right-aligned image */}
                            <div className="w-24 h-12 flex items-center justify-end ml-auto logomy">
                                <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                            </div>
                        </div>


                        <div className="smallbold info text-center font-semibold">{voucherData?.voucherDetails?.lgdName}</div>
                        <div className="smallbold info text-center font-semibold mb-4">{voucherData?.voucherDetails?.lgdAddress}</div>

                        {/* Account Details */}
                        <div className="flex justify-between border-b pb-2 smallbold print:flex">
                            <div className="w-1/2 pr-4 left prd">
                                <p><span className="font-semibold text-cyan-700">Head of Account: </span>{voucherData?.voucherDetails?.accountHead}</p>
                                <p><span className="font-semibold text-cyan-700">Account Code: </span>{voucherData?.voucherDetails?.accountCode}</p>
                                <p><span className="font-semibold text-cyan-700">Account Code Desc: </span>{voucherData?.voucherDetails?.accountDesc}</p>
                                <p><span className="font-semibold text-cyan-700">National A/C Code: </span>{voucherData?.voucherDetails?.nationalCode}</p>
                            </div>

                            <div className="w-1/2 text-right pl-4 stts" >
                                <p><span className="font-semibold text-cyan-700">Voucher Date: </span>{voucherData?.voucherDetails?.voucherDate}</p>
                                <p><span className="font-semibold text-cyan-700">Voucher ID: </span>{voucherData?.voucherDetails?.voucherId}</p>
                                <p><span className="font-semibold text-cyan-700">Voucher No.: </span>{voucherData?.voucherDetails?.voucherNo}</p>
                                <p><span className="font-semibold text-cyan-700">Pass for Payment ID: </span>{voucherData?.voucherDetails?.pfpId}</p>
                            </div>
                            <div className="clearfix"></div>
                        </div>



                        {/* Payee Details & Table Side by Side */}
                        <div className="mt-1 flex justify-between gap-4 print:flex print-row smallbold">
                            {/* Payee Details */}
                            <div className="w-1/2 print-half half">
                                <p><span className="font-semibold text-cyan-700">Pay to:</span> {voucherData?.voucherDetails?.payTo}</p>
                                <p><span className="font-semibold text-cyan-700">of:</span> {voucherData?.voucherDetails?.partyAddress}</p>
                                <p><span className="font-semibold text-cyan-700" style={{ lineHeight: "1.8" }}>Description:</span> {voucherData?.voucherDetails?.voucherNarration}</p>
                                <p><span className="font-semibold text-cyan-700 lhght" style={{ lineHeight: "1.5" }}>Rs.:</span> {voucherData?.voucherDetails?.voucherNetAmount}/- (Rs.{voucherData?.voucherDetails?.voucherNetAmountWord})</p>
                                <p><span className="font-semibold text-cyan-700">Paid by:</span> {voucherData?.voucherDetails?.instrumentType}</p>
                                <p><span className="font-semibold text-cyan-700">No.:</span> {voucherData?.voucherDetails?.instrumentNo}</p>
                                <p><span className="font-semibold text-cyan-700">Dated:</span> {voucherData?.voucherDetails?.instrumentType === "None" ? "" : voucherData?.voucherDetails?.instrumentDate}</p>
                                <p><span className="font-semibold text-cyan-700">Drawn on:</span> {voucherData?.voucherDetails?.instrumentDetails}</p>
                            </div>

                            {/* Amount Details (Table) */}
                            {voucherData?.deductionDetails?.length > 0 && (
                                <div className="w-1/2 print-half stts">
                                    <table className="w-full border-collapse border border-black-900 text-center">
                                        {/* <thead>
                                        <tr className="bg-yellow-300">
                                            <th className="border border-gray-400 px-2 py-2 w-1/2 text-center">Deduction Account Head</th>
                                            <th className="border border-gray-400 px-2 py-2 w-1/2 text-center">Amount</th>
                                        </tr>
                                    </thead> */}
                                        <tbody>
                                            {voucherData?.deductionDetails.map((user, index) => (
                                                <tr key={index} className="bg-white">
                                                    <td className="border border-gray-900 px-4 py-2 text-center text-xs">{user.accountDescActual}</td>
                                                    <td className="border border-gray-900 px-4 py-2 text-center text-xs">Rs. {user.deductionAmount}/-</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                </div>

                            )}
                            <div className="clearfix"></div>
                        </div>

                        {/* Signatures */}
                        <div className="flex justify-between text-black-600 font-semibold text-xs mt-6 gap smallbold">
                            <span style={{ float: "left" }}>{voucherData?.voucherDetails?.leftSignatory}</span>
                            <span style={{ float: "right" }}>{voucherData?.voucherDetails?.rightSignatory}</span>

                        </div>
                        <div className="clearfix"></div>
                        {/* Footer */}
                        <div className="mt-1 font-semibold text-xs smallbold">

                            <p><span className="font-semibold text-cyan-700">Voucher Entered by:</span> {voucherData?.voucherDetails?.entryBy}</p>
                            <p><span className="font-semibold text-cyan-700">Voucher Verified By:</span> {voucherData?.voucherDetails?.verifiedBy}</p>

                        </div>

                        <div className="flex justify-between mt-2 pt-1 font-semibold border-t-2 border-black text-xs smallbold">
                            <p><i>Received Rs.{voucherData?.voucherDetails?.voucherNetAmount}/- (Rs.{voucherData?.voucherDetails?.voucherNetAmountWord}) </i></p>
                        </div>

                        <div className="flex justify-between mt-1 font-semibold text-xs smallbold">
                            <p><i>Paid by {voucherData?.voucherDetails?.instrumentType} No.{voucherData?.voucherDetails?.instrumentNo} Dated {voucherData?.voucherDetails?.instrumentDate} drawn on {voucherData?.voucherDetails?.instrumentDetails}</i></p>
                            <p><span className="font-semibold text-cyan-700 stts">Signature of Payee</span></p>
                        </div>
                    </div>

                    <div className="flex justify-center space-x-4 py-1">
                        <div className="text-right text-xs mt-4 italic">
                            <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onCloseModal}>
                                Close
                            </button>&nbsp;
                            <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handlePrintDebit}>
                                Print
                            </button>
                        </div>
                    </div>
                </motion.div>
            </Modal>

            {/* query debit payment */}
            <Modal isOpen={voucherQueryPaymentFlag}
                // onRequestClose={() => setIsPartyDetailsOpen(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "50%",
                        height: "90%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                <motion.div
                    initial={{ x: "100vw", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100vw", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div id="voucher-container" className="max-w-5xl mx-auto border p-2 bg-white shadow-lg text-xs">
                        {/* Header */}
                        <div className="text-center">
                            <span className="flex-1 text-center font-bold">{voucherData?.voucherDetails?.rule}</span>
                        </div>
                        <div className="flex w-full justify-between items-center relative">
                            {/* Centered span message */}
                            <span className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
                                DEBIT VOUCHER
                            </span>

                            {/* Right-aligned image */}
                            <div className="w-24 h-12 flex items-center justify-end ml-auto">
                                <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                            </div>
                        </div>


                        <div className="text-center font-semibold">{voucherData?.voucherDetails?.lgdName}</div>
                        <div className="text-center font-semibold mb-4">{voucherData?.voucherDetails?.lgdAddress}</div>

                        {/* Account Details */}
                        <div className="grid grid-cols-2 gap-4 border-b pb-2">
                            <div>
                                <p><span className="font-semibold text-cyan-700">Head of Account: </span>{voucherData?.voucherDetails?.accountHead}</p>
                                <p><span className="font-semibold text-cyan-700">Account Code: </span>{voucherData?.voucherDetails?.accountCode}</p>
                                <p><span className="font-semibold text-cyan-700">Account Code Desc: </span>{voucherData?.voucherDetails?.accountDesc}</p>
                                <p><span className="font-semibold text-cyan-700">National A/C Code: </span>{voucherData?.voucherDetails?.nationalCode}</p>
                            </div>
                            <div className="text-right">
                                <p><span className="font-semibold text-cyan-700">Voucher Date: </span>{voucherData?.voucherDetails?.voucherDate}</p>
                                <p><span className="font-semibold text-cyan-700">Voucher ID: </span>{voucherData?.voucherDetails?.voucherId}</p>
                                <p><span className="font-semibold text-cyan-700">Voucher No.: </span>{voucherData?.voucherDetails?.voucherNo}</p>
                                <p><span className="font-semibold text-cyan-700">Pass for Payment ID: </span>{voucherData?.voucherDetails?.pfpId}</p>
                            </div>
                        </div>

                        {/* Payee Details & Table Side by Side */}
                        <div className="mt-4 flex justify-between gap-4 print:flex print-row">
                            {/* Payee Details */}
                            <div className="w-1/2 print-half">
                                <p><span className="font-semibold text-cyan-700">Pay to:</span> {voucherData?.voucherDetails?.payTo}</p>
                                <p><span className="font-semibold text-cyan-700">of:</span> {voucherData?.voucherDetails?.partyAddress}</p>
                                <p><span className="font-semibold text-cyan-700">Description:</span> {voucherData?.voucherDetails?.voucherNarration}</p>
                                <p><span className="font-semibold text-cyan-700">Rs.:</span> {voucherData?.voucherDetails?.voucherNetAmount}/- (Rs.{voucherData?.voucherDetails?.voucherNetAmountWord})</p>
                                <p><span className="font-semibold text-cyan-700">Paid by:</span> {voucherData?.voucherDetails?.instrumentType}</p>
                                <p><span className="font-semibold text-cyan-700">No.:</span> {voucherData?.voucherDetails?.instrumentNo}</p>
                                <p><span className="font-semibold text-cyan-700">Dated:</span> {voucherData?.voucherDetails?.instrumentType === "None" ? "" : voucherData?.voucherDetails?.instrumentDate}</p>
                                <p><span className="font-semibold text-cyan-700">Drawn on:</span> {voucherData?.voucherDetails?.instrumentDetails}</p>
                            </div>

                            {/* Amount Details (Table) */}
                            {voucherData?.deductionDetails?.length > 0 && (
                                <div className="w-1/2 print-half">
                                    <table className="w-full border-collapse border border-black-900 text-center">
                                        {/* <thead>
                                                    <tr className="bg-yellow-300">
                                                        <th className="border border-gray-400 px-2 py-2 w-1/2 text-center">Deduction Account Head</th>
                                                        <th className="border border-gray-400 px-2 py-2 w-1/2 text-center">Amount</th>
                                                    </tr>
                                                </thead> */}
                                        <tbody>
                                            {voucherData?.deductionDetails.map((user, index) => (
                                                <tr key={index} className="bg-white">
                                                    <td className="border border-gray-900 px-4 py-2 text-center">{user.accountDescActual}</td>
                                                    <td className="border border-gray-900 px-4 py-2 text-center">Rs. {user.deductionAmount}/-</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                </div>

                            )}
                        </div>

                        {/* Signatures */}
                        <div className="flex justify-between mt-4 font-semibold pt-4">
                            <span>{voucherData?.voucherDetails?.leftSignatory}</span>
                            <span>{voucherData?.voucherDetails?.rightSignatory}</span>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 font-semibold text-xs">
                            <i>
                                <p><span className="font-semibold text-cyan-700">Voucher Entered by:</span> {voucherData?.voucherDetails?.entryBy}</p>
                                <p><span className="font-semibold text-cyan-700">Voucher Verified By:</span> {voucherData?.voucherDetails?.verifiedBy}</p>
                            </i>
                        </div>

                        <div className="flex justify-between mt-2 pt-2 font-semibold border-t-2 border-black text-xs">
                            <p><i>Received Rs.{voucherData?.voucherDetails?.voucherNetAmount}/- (Rs.{voucherData?.voucherDetails?.voucherNetAmountWord}) </i></p>
                        </div>

                        <div className="flex justify-between mt-2 font-semibold text-xs">
                            <p><i>Paid by {voucherData?.voucherDetails?.instrumentType} No.{voucherData?.voucherDetails?.instrumentNo} Dated {voucherData?.voucherDetails?.instrumentDate} drawn on {voucherData?.voucherDetails?.instrumentDetails}</i></p>
                            <p><span className="font-semibold text-cyan-700">Signature of Payee</span></p>
                        </div>
                    </div>

                    <div className="flex justify-center space-x-4 py-1">
                        <div className="text-right text-xs mt-4 italic">
                            <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onCloseQueryModal}>
                                Close
                            </button>&nbsp;
                            <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handleDownload}>
                                Print
                            </button>
                        </div>
                    </div>
                </motion.div>
            </Modal>

            {/* voucher contra */}
            <Modal isOpen={voucherContraFlag}
                // onRequestClose={() => setIsPartyDetailsOpen(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "50%",
                        height: "70%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                <motion.div
                    initial={{ x: "100vw", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100vw", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div id="voucher-container" className="w-full max-w-6xl mx-auto border p-2 bg-white shadow-lg text-xs">

                        {/* Header */}
                        <div className="text-center">
                            <span className="flex-1 text-center font-bold">{voucherData?.rule}</span>
                        </div>
                        <div className="flex w-full justify-between items-center relative">
                            {/* Centered span message */}
                            <span className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
                                CONTRA VOUCHER
                            </span>

                            {/* Right-aligned image */}
                            <div className="w-24 h-12 flex items-center justify-end ml-auto">
                                <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                            </div>
                        </div>

                        <div className="text-center font-semibold">{voucherData?.lgdName}</div>
                        <div className="text-center font-semibold mb-4">{voucherData?.lgdAddress}</div>
                        <hr className="border-gray-400 mb-2" />

                        {/* Voucher Info */}
                        <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                            <div>
                                <p><span className="font-bold text-cyan-700">Encashed from:</span> {voucherData?.encahAccountCode} - {voucherData?.encashAccountDesc}</p>
                                <p><span className="font-bold text-cyan-700">Deposited to:</span> {voucherData?.depositAccountCode} - {voucherData?.depositAccountDesc}</p>
                                <p><span className="font-bold text-cyan-700">Narration:</span> {voucherData?.voucherNarration}</p>
                                <p><span className="font-bold text-cyan-700">Rs.:</span> {voucherData?.voucherNetAmount}/- (Rs.{voucherData?.voucherNetAmountWord})</p>
                                {/* <p><span className="font-bold text-cyan-700">Rs. in Words:</span> {voucherData?.voucherNetAmountWord}</p> */}
                            </div>

                            <div className="text-right">
                                <p><span className="font-bold text-cyan-700">Voucher ID:</span> {voucherData?.voucherId}</p>
                                <p><span className="font-bold text-cyan-700">Voucher No.:</span> {voucherData?.voucherNo}</p>
                                <p><span className="font-bold text-cyan-700">Voucher Date:</span> {voucherData?.voucherDate}</p>
                            </div>
                        </div>

                        {/* Transaction Details */}
                        <div className="grid grid-cols-2 gap-4 text-xs font-semibold mt-3">
                            <div>
                                <p><span className="font-bold text-cyan-700">Transaction By:</span> {voucherData?.instrumentType}</p>
                                <p><span className="font-bold text-cyan-700">Drawn on:</span> {voucherData?.instrumentDetails}</p>
                                <p><span className="font-bold text-cyan-700">No.:</span> {voucherData?.instrumentNo}</p>
                                <p><span className="font-bold text-cyan-700">Dated:</span> {voucherData?.instrumentDate}</p>

                            </div>

                        </div>

                        {/* Signatures */}
                        <div className="flex justify-between text-black-600 font-semibold text-xs mt-4">
                            <span>{voucherData?.leftSignatory}</span>
                            <span>{voucherData?.rightSignatory}</span>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 font-semibold text-xs">
                            <i>
                                <p><span className="font-semibold text-cyan-700">Voucher Entered By:</span> {voucherData?.entryBy}</p>
                                <p><span className="font-semibold text-cyan-700">Voucher Verified By:</span> {voucherData?.verifiedBy}</p>
                            </i>
                        </div>
                    </div>



                    <div className="flex justify-center space-x-4 py-1">
                        <div className="text-right text-xs mt-4 italic">
                            <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onCloseModal}>
                                Close
                            </button>&nbsp;
                            <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handleDownload}>
                                Print
                            </button>
                        </div>
                    </div>
                </motion.div>
            </Modal>

            {/* query contra  */}
            <Modal isOpen={voucherQueryContraFlag}
                // onRequestClose={() => setIsPartyDetailsOpen(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "50%",
                        height: "70%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                <motion.div
                    initial={{ x: "100vw", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100vw", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div id="voucher-container" className="w-full max-w-6xl mx-auto border p-2 bg-white shadow-lg text-xs">

                        {/* Header */}
                        <div className="text-center">
                            <span className="flex-1 text-center font-bold">{voucherData?.rule}</span>
                        </div>
                        <div className="flex w-full justify-between items-center relative">
                            {/* Centered span message */}
                            <span className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
                                CONTRA VOUCHER
                            </span>

                            {/* Right-aligned image */}
                            <div className="w-24 h-12 flex items-center justify-end ml-auto">
                                <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                            </div>
                        </div>

                        <div className="text-center font-semibold">{voucherData?.lgdName}</div>
                        <div className="text-center font-semibold mb-4">{voucherData?.lgdAddress}</div>
                        <hr className="border-gray-400 mb-2" />

                        {/* Voucher Info */}
                        <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                            <div>
                                <p><span className="font-bold text-cyan-700">Encashed from:</span> {voucherData?.encahAccountCode} - {voucherData?.encashAccountDesc}</p>
                                <p><span className="font-bold text-cyan-700">Deposited to:</span> {voucherData?.depositAccountCode} - {voucherData?.depositAccountDesc}</p>
                                <p><span className="font-bold text-cyan-700">Narration:</span> {voucherData?.voucherNarration}</p>
                                <p><span className="font-bold text-cyan-700">Rs.:</span> {voucherData?.voucherNetAmount}/- (Rs.{voucherData?.voucherNetAmountWord})</p>
                                {/* <p><span className="font-bold text-cyan-700">Rs. in Words:</span> {voucherData?.voucherNetAmountWord}</p> */}
                            </div>

                            <div className="text-right">
                                <p><span className="font-bold text-cyan-700">Voucher ID:</span> {voucherData?.voucherId}</p>
                                <p><span className="font-bold text-cyan-700">Voucher No.:</span> {voucherData?.voucherNo}</p>
                                <p><span className="font-bold text-cyan-700">Voucher Date:</span> {voucherData?.voucherDate}</p>
                            </div>
                        </div>

                        {/* Transaction Details */}
                        <div className="grid grid-cols-2 gap-4 text-xs font-semibold mt-3">
                            <div>
                                <p><span className="font-bold text-cyan-700">Transaction By:</span> {voucherData?.instrumentType}</p>
                                <p><span className="font-bold text-cyan-700">Drawn on:</span> {voucherData?.instrumentDetails}</p>
                                <p><span className="font-bold text-cyan-700">No.:</span> {voucherData?.instrumentNo}</p>
                                <p><span className="font-bold text-cyan-700">Dated:</span> {voucherData?.instrumentDate}</p>

                            </div>

                        </div>

                        {/* Signatures */}
                        <div className="flex justify-between text-black-600 font-semibold text-xs mt-4">
                            <span>{voucherData?.leftSignatory}</span>
                            <span>{voucherData?.rightSignatory}</span>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 font-semibold text-xs">
                            <i>
                                <p><span className="font-semibold text-cyan-700">Voucher Entered By:</span> {voucherData?.entryBy}</p>
                                <p><span className="font-semibold text-cyan-700">Voucher Verified By:</span> {voucherData?.verifiedBy}</p>
                            </i>
                        </div>
                    </div>



                    <div className="flex justify-center space-x-4 py-1">
                        <div className="text-right text-xs mt-4 italic">
                            <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onCloseQueryModal}>
                                Close
                            </button>&nbsp;
                            <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handleDownload}>
                                Print
                            </button>
                        </div>
                    </div>
                </motion.div>
            </Modal>

            {/* voucher Receipt */}
            <Modal isOpen={voucherCreditFlag}
                // onRequestClose={() => setIsPartyDetailsOpen(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "50%",
                        height: "76%",
                        margin: "auto",
                        padding: "10px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                <motion.div
                    initial={{ x: "100vw", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100vw", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div id="voucher-container" style={{ fontFamily: "InterVariable, sans-serif" }} ref={printRef} className="w-full max-w-6xl mx-auto p-4 text-xs info">
                        {/* Header */}
                        <div style={{ margin: "0 0 5px !important", padding: "0 !important" }} className="text-center info smallbold">
                            <span className="flex-1 text-center font-bold">{voucherData?.rule}</span>
                        </div>
                        <div style={{ margin: "0 0 5px !important", padding: "0 !important" }} className="info flex w-full justify-between items-center relative">
                            {/* Centered span message */}
                            <span className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
                                CREDIT VOUCHER
                            </span>

                            {/* Right-aligned image */}
                            <div className="w-24 h-12 flex items-center justify-end ml-auto logomy">
                                <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                            </div>
                        </div>

                        <div className="smallbold info text-center font-semibold">{voucherData?.lgdName}</div>
                        <div className="smallbold info text-center mb-4 font-semibold">{voucherData?.lgdAddress}</div>

                        {/* Account Details */}
                        <div className="flex justify-between border-b pb-2 smallbold print:flex">
                            <div className="w-1/2 pr-4 left prd">
                                <p><span className="font-semibold text-cyan-700">Head of Account: </span>{voucherData?.accountHead}</p>
                                <p><span className="font-semibold text-cyan-700">Account Codes: </span>{voucherData?.accountCode}</p>
                                <p><span className="font-semibold text-cyan-700">Account Code Desc: </span>{voucherData?.accountDesc}</p>
                                <p><span className="font-semibold text-cyan-700">National A/C Code: </span>{voucherData?.nationalCode}</p>
                            </div>
                            <div className="w-1/2 text-right pl-4 stts" >
                                <p><span className="font-semibold text-cyan-700">Voucher Date: </span>{voucherData?.voucherDate}</p>
                                <p><span className="font-semibold text-cyan-700">Voucher ID: </span>{voucherData?.voucherId}</p>
                                <p><span className="font-semibold text-cyan-700">Voucher No.: </span>{voucherData?.voucherNo}</p>
                                {/* <p><span className="font-semibold">Pass for Payment ID: </span>{voucherData?.pfpId}</p> */}
                            </div>
                            <div className="clearfix"></div>

                        </div>

                        {/* Payee Details & Table Side by Side */}
                        <div className="mt-2 flex justify-between gap-4 print:flex print-row smallbold">
                            {/* Payee Details */}
                            <div className="w-1/2 print-half">
                                <p><span className="font-semibold text-cyan-700">Received from:</span> {voucherData?.payTo}</p>
                                <p><span className="font-semibold text-cyan-700">of:</span> {voucherData?.partyAddress}</p>
                                <p><span className="font-semibold text-cyan-700" style={{ lineHeight: "1.8" }}>Description:</span> {voucherData?.voucherNarration}</p>
                                <p><span className="font-semibold text-cyan-700" style={{ lineHeight: "1.5" }}>Rs.:</span> {voucherData?.voucherNetAmount}/- (Rs.{voucherData?.voucherNetAmountWord})</p>
                                <p><span className="font-semibold text-cyan-700">Received by:</span> {voucherData?.instrumentType}</p>
                                <p><span className="font-semibold text-cyan-700">No.:</span> {voucherData?.instrumentNo}</p>
                                <p><span className="font-semibold text-cyan-700">Dated:</span> {voucherData?.instrumentType === "None" ? "" : voucherData?.instrumentDate}</p>
                                <p><span className="font-semibold text-cyan-700">Drawn on:</span> {voucherData?.instrumentDetails}</p>
                                <p><span className="font-semibold text-cyan-700">Allotment No:</span> {voucherData?.allotmentNo} {voucherData?.allotmentDate}</p>

                            </div>

                        </div>

                        {/* Signatures */}
                        <div className="flex justify-between text-black-600 font-semibold text-xs mt-6 gap smallbold">
                            <span style={{ float: "right" }}>{voucherData?.rightSignatory}</span>
                            <span style={{ float: "left" }}>{voucherData?.leftSignatory}</span>

                        </div>
                        <div className="clearfix"></div>

                        {/* Footer */}
                        <div className="mt-1 font-semibold text-xs smallbold">
                            <i>
                                <p><span className="font-semibold text-cyan-700">Voucher Entered by:</span> {voucherData?.entryBy}</p>
                                <p><span className="font-semibold text-cyan-700">Voucher Verified By:</span> {voucherData?.verifiedBy}</p>
                            </i>
                        </div>
                        {/* <div className="clearfix"></div> */}
                    </div>

                    <div className="flex justify-center space-x-4 py-1">
                        <div className="text-right text-xs mt-4 italic">
                            <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onCloseModal}>
                                Close
                            </button>&nbsp;
                            <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handlePrintCredit}>
                                Print
                            </button>
                        </div>
                    </div>
                </motion.div>
            </Modal>

            {/* query receipt */}
            <Modal isOpen={voucherQueryCreditFlag}
                // onRequestClose={() => setIsPartyDetailsOpen(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "50%",
                        height: "76%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                <motion.div
                    initial={{ x: "100vw", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100vw", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div id="voucher-container" className="max-w-5xl mx-auto border p-6 bg-white shadow-lg text-xs">
                        {/* Header */}
                        <div className="text-center">
                            <span className="flex-1 text-center font-bold">{voucherData?.rule}</span>
                        </div>
                        <div className="flex w-full justify-between items-center relative">
                            {/* Centered span message */}
                            <span className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
                                CREDIT VOUCHER
                            </span>

                            {/* Right-aligned image */}
                            <div className="w-24 h-12 flex items-center justify-end ml-auto">
                                <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                            </div>
                        </div>

                        <div className="text-center font-semibold">{voucherData?.lgdName}</div>
                        <div className="text-center mb-4 font-semibold">{voucherData?.lgdAddress}</div>

                        {/* Account Details */}
                        <div className="grid grid-cols-2 gap-4 border-b pb-2">
                            <div>
                                <p><span className="font-semibold text-cyan-700">Head of Account: </span>{voucherData?.accountHead}</p>
                                <p><span className="font-semibold text-cyan-700">Account Codes: </span>{voucherData?.accountCode}</p>
                                <p><span className="font-semibold text-cyan-700">Account Code Desc: </span>{voucherData?.accountDesc}</p>
                                <p><span className="font-semibold text-cyan-700">National A/C Code: </span>{voucherData?.nationalCode}</p>
                            </div>
                            <div className="text-right">
                                <p><span className="font-semibold text-cyan-700">Voucher Date: </span>{voucherData?.voucherDate}</p>
                                <p><span className="font-semibold text-cyan-700">Voucher ID: </span>{voucherData?.voucherId}</p>
                                <p><span className="font-semibold text-cyan-700">Voucher No.: </span>{voucherData?.voucherNo}</p>
                                {/* <p><span className="font-semibold">Pass for Payment ID: </span>{voucherData?.pfpId}</p> */}
                            </div>
                        </div>

                        {/* Payee Details & Table Side by Side */}
                        <div className="mt-4 flex justify-between gap-4 print:flex print-row">
                            {/* Payee Details */}
                            <div className="w-1/2 print-half">
                                <p><span className="font-semibold text-cyan-700">Received from:</span> {voucherData?.payTo}</p>
                                <p><span className="font-semibold text-cyan-700">of:</span> {voucherData?.partyAddress}</p>
                                <p><span className="font-semibold text-cyan-700">Description:</span> {voucherData?.voucherNarration}</p>
                                <p><span className="font-semibold text-cyan-700">Rs.:</span> {voucherData?.voucherNetAmount}/- (Rs.{voucherData?.voucherNetAmountWord})</p>
                                <p><span className="font-semibold text-cyan-700">Received by:</span> {voucherData?.instrumentType}</p>
                                <p><span className="font-semibold text-cyan-700">No.:</span> {voucherData?.instrumentNo}</p>
                                <p><span className="font-semibold text-cyan-700">Dated:</span> {voucherData?.instrumentType === "None" ? "" : voucherData?.instrumentDate}</p>
                                <p><span className="font-semibold text-cyan-700">Drawn on:</span> {voucherData?.instrumentDetails}</p>
                            </div>

                        </div>

                        {/* Signatures */}
                        <div className="flex justify-between mt-4 font-semibold pt-4">
                            <span>{voucherData?.rightSignatory}</span>
                            <span>{voucherData?.leftSignatory}</span>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 font-semibold text-xs">
                            <i>
                                <p><span className="font-semibold text-cyan-700">Voucher Entered by:</span> {voucherData?.entryBy}</p>
                                <p><span className="font-semibold text-cyan-700">Voucher Verified By:</span> {voucherData?.verifiedBy}</p>
                            </i>
                        </div>


                    </div>

                    <div className="flex justify-center space-x-4 py-1">
                        <div className="text-right text-xs mt-4 italic">
                            <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onCloseQueryModal}>
                                Close
                            </button>&nbsp;
                            <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handleDownload}>
                                Print
                            </button>
                        </div>
                    </div>
                </motion.div>
            </Modal>

            {/* voucher journal */}
            <Modal isOpen={voucherJournalFlag}
                // onRequestClose={() => setIsPartyDetailsOpen(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "50%",
                        height: "80%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                <motion.div
                    initial={{ x: "100vw", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100vw", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div id="voucher-container" className="w-full max-w-5xl mx-auto border p-2 bg-white shadow-lg text-xs">

                        {/* Header */}
                        <div className="text-center">
                            <span className="flex-1 text-center font-bold">{voucherData?.journalVoucherDetails?.rule}</span>
                        </div>
                        <div className="flex w-full justify-between items-center relative">
                            {/* Centered span message */}
                            <span className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
                                JOURNAL VOUCHER
                            </span>

                            {/* Right-aligned image */}
                            <div className="w-24 h-12 flex items-center justify-end ml-auto">
                                <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                            </div>
                        </div>

                        <div className="text-center font-semibold">{voucherData?.journalVoucherDetails?.lgdName}</div>
                        <div className="text-center font-semibold mb-2">{voucherData?.journalVoucherDetails?.lgdAddress}</div>
                        <hr className="border-gray-400 mb-2" />

                        {/* Voucher Info */}
                        <div className="text-right">
                            <p><span className="font-bold text-cyan-700">Voucher ID:</span> {voucherData?.journalVoucherDetails?.voucherId}</p>
                            <p><span className="font-bold text-cyan-700">Voucher No.:</span> {voucherData?.journalVoucherDetails?.voucherNo}</p>
                            <p><span className="font-bold text-cyan-700">Voucher Date:</span> {voucherData?.journalVoucherDetails?.voucherDate}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-6 text-xs font-semibold">
                            <div>
                                <p>
                                    <span className="font-bold">{voucherData?.journalVoucherDetails?.accountHead} {voucherData?.journalVoucherDetails?.voucherNetAmount}</span>
                                </p>
                                {/* <br /> */}
                                {voucherData?.journalDeductionDetails?.map((transfer, index) => (
                                    <p key={index}>
                                        <span className="font-bold"></span> {transfer.accountHead} {transfer.voucherAmount}
                                    </p>
                                ))}
                            </div>


                        </div>

                        {/* Narration & Party */}
                        <div className="grid text-xs font-semibold mt-3">
                            <p><span className="font-bold text-cyan-700">Narration:</span> {voucherData?.journalVoucherDetails?.voucherNarration}</p>
                            <p>
                                <span className="font-bold text-cyan-700">Party: </span>
                                {voucherData?.journalVoucherDetails?.partyType === "C" ? "Contractor" :
                                    voucherData?.journalVoucherDetails?.partyType === "E" ? "Employee" :
                                        voucherData?.journalVoucherDetails?.partyType === "J" ? "Job Worker" :
                                            voucherData?.journalVoucherDetails?.partyType === "D" ? "Department" :
                                                voucherData?.journalVoucherDetails?.partyType === "L" ? "LSG" : "Beneficiary"}
                                - {voucherData?.journalVoucherDetails?.partyCode}
                            </p>
                        </div>

                        {/* Signatures */}
                        <div className="flex justify-between text-black-600 font-semibold text-xs mt-6">
                            <span>{voucherData?.journalVoucherDetails?.leftSignatory}</span>
                            <span>{voucherData?.journalVoucherDetails?.rightSignatory}</span>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 font-semibold text-xs ">
                            <i>
                                <p><span className="font-semibold text-cyan-700">Voucher Entered By:</span> {voucherData?.journalVoucherDetails?.entryBy} </p>
                                <p><span className="font-semibold text-cyan-700">Voucher Verified By:</span> {voucherData?.journalVoucherDetails?.verifiedBy}</p>
                            </i>
                        </div>
                    </div>


                    <div className="flex justify-center space-x-4 py-1">
                        <div className="text-right text-xs mt-4 italic">
                            <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onCloseModal}>
                                Close
                            </button>&nbsp;
                            <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handleDownload}>
                                Print
                            </button>
                        </div>
                    </div>
                </motion.div>
            </Modal>

            {/* query journal */}
            <Modal isOpen={voucherQueryJournalFlag}
                // onRequestClose={() => setIsPartyDetailsOpen(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "50%",
                        height: "80%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                <motion.div
                    initial={{ x: "100vw", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100vw", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div id="voucher-container" className="w-full max-w-5xl mx-auto border p-2 bg-white shadow-lg text-xs">

                        {/* Header */}
                        <div className="text-center">
                            <span className="flex-1 text-center font-bold">{voucherData?.journalVoucherDetails?.rule}</span>
                        </div>
                        <div className="flex w-full justify-between items-center relative">
                            {/* Centered span message */}
                            <span className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
                                JOURNAL VOUCHER
                            </span>

                            {/* Right-aligned image */}
                            <div className="w-24 h-12 flex items-center justify-end ml-auto">
                                <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                            </div>
                        </div>

                        <div className="text-center font-semibold">{voucherData?.journalVoucherDetails?.lgdName}</div>
                        <div className="text-center font-semibold mb-2">{voucherData?.journalVoucherDetails?.lgdAddress}</div>
                        <hr className="border-gray-400 mb-2" />

                        {/* Voucher Info */}
                        <div className="text-right">
                            <p><span className="font-bold text-cyan-700">Voucher ID:</span> {voucherData?.journalVoucherDetails?.voucherId}</p>
                            <p><span className="font-bold text-cyan-700">Voucher No.:</span> {voucherData?.journalVoucherDetails?.voucherNo}</p>
                            <p><span className="font-bold text-cyan-700">Voucher Date:</span> {voucherData?.journalVoucherDetails?.voucherDate}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-6 text-xs font-semibold">
                            <div>
                                <p>
                                    <span className="font-bold">{voucherData?.journalVoucherDetails?.accountHead} {voucherData?.journalVoucherDetails?.voucherNetAmount}</span>
                                </p>
                                {/* <br /> */}
                                {voucherData?.journalDeductionDetails?.map((transfer, index) => (
                                    <p key={index}>
                                        <span className="font-bold"></span> {transfer.accountHead} {transfer.voucherAmount}
                                    </p>
                                ))}
                            </div>


                        </div>

                        {/* Narration & Party */}
                        <div className="grid text-xs font-semibold mt-3">
                            <p><span className="font-bold text-cyan-700">Narration:</span> {voucherData?.journalVoucherDetails?.voucherNarration}</p>
                            <p>
                                <span className="font-bold text-cyan-700">Party: </span>
                                {voucherData?.journalVoucherDetails?.partyType === "C" ? "Contractor" :
                                    voucherData?.journalVoucherDetails?.partyType === "E" ? "Employee" :
                                        voucherData?.journalVoucherDetails?.partyType === "J" ? "Job Worker" :
                                            voucherData?.journalVoucherDetails?.partyType === "D" ? "Department" :
                                                voucherData?.journalVoucherDetails?.partyType === "L" ? "LSG" : "Beneficiary"}
                                - {voucherData?.journalVoucherDetails?.partyCode}
                            </p>
                        </div>

                        {/* Signatures */}
                        <div className="flex justify-between text-black-600 font-semibold text-xs mt-6">
                            <span>{voucherData?.journalVoucherDetails?.leftSignatory}</span>
                            <span>{voucherData?.journalVoucherDetails?.rightSignatory}</span>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 font-semibold text-xs ">
                            <i>
                                <p><span className="font-semibold text-cyan-700">Voucher Entered By:</span> {voucherData?.journalVoucherDetails?.entryBy} </p>
                                <p><span className="font-semibold text-cyan-700">Voucher Verified By:</span> {voucherData?.journalVoucherDetails?.verifiedBy}</p>
                            </i>
                        </div>
                    </div>


                    <div className="flex justify-center space-x-4 py-1">
                        <div className="text-right text-xs mt-4 italic">
                            <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onCloseQueryModal}>
                                Close
                            </button>&nbsp;
                            <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handleDownload}>
                                Print
                            </button>
                        </div>
                    </div>
                </motion.div>
            </Modal>

            {/* Cashier Receipt */}
            <Modal isOpen={voucherCashierReceiptFlag}
                // onRequestClose={() => setIsPartyDetailsOpen(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "50%",
                        height: "70%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                <motion.div
                    initial={{ x: "100vw", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100vw", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div style={{ fontFamily: "InterVariable, sans-serif" }} ref={printRef} className="w-full max-w-6xl mx-auto p-4 text-xs info">
                        {/* Header */}
                        <div className="text-center info smallbold">
                            <span className="flex-1 text-center font-semibold">{voucherDataCashierReceipt?.rule}</span>
                        </div>
                        <div className="info flex w-full justify-between items-center relative">
                            {/* Centered span message */}
                            <h2 style={{ fontFamily: "InterVariable, sans-serif" }} className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
                                {userData?.USER_LEVEL === "BLOCK" || userData?.USER_LEVEL === "DIST" ? "CASHIER'S RECEIPT" : "MISCELLANEOUS RECEIPT"}
                            </h2>

                            {/* Right-aligned image */}
                            <div className="w-24 h-12 flex items-center justify-end ml-auto logomy">
                                <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                            </div>
                        </div>

                        {/* Organization Info */}
                        <div className="smallbold info text-center font-semibold">{voucherDataCashierReceipt?.lgdName}</div>
                        <div className="smallbold info text-center font-semibold mb-2">{voucherDataCashierReceipt?.lgdAddress}</div>
                        <hr className="border-gray-400" />
                        <div className="text-right text-black-600 prn-dt smallbold">
                            <p><span className="font-bold text-cyan-700">Voucher ID:</span> {voucherDataCashierReceipt?.voucherId}</p>
                            <p><span className="font-bold text-cyan-700">Voucher Date:</span> {voucherDataCashierReceipt?.voucherDate}</p>
                        </div>
                        {/* Voucher Info */}
                        <div className="flex justify-between text-xs font-semibold mt-2">
                            <div className="w-1/2 smallbold">
                                <p><span className="font-bold text-cyan-700">CR ID:</span> {voucherDataCashierReceipt?.cashierReceiptId}</p>
                            </div>

                        </div>

                        {/* Received From */}
                        <div className="text-xs font-semibold smallbold">
                            <p><span className="font-bold text-cyan-700">Received from:</span> {voucherDataCashierReceipt?.receiveFrom} of {voucherData?.receieveAddress}</p>
                        </div>

                        {/* Amount Details */}
                        <div className="text-xs font-semibold smallbold">
                            <p><span className="font-bold text-cyan-700">Rs. :</span> {voucherDataCashierReceipt?.voucherNetAmount}/- (Rs.{voucherDataCashierReceipt?.voucherNetAmountWord})</p>
                            {/* <p><span className="font-bold">Rs. in Words:</span> {voucherData?.voucherNetAmountWord}</p> */}
                        </div>

                        {/* Transaction Details */}
                        <div className="grid text-xs font-semibold smallbold">
                            <p><span className="font-bold text-cyan-700">Received By:</span> {voucherDataCashierReceipt?.instrumentType}</p>
                            <p><span className="font-bold text-cyan-700">No.:</span> {voucherDataCashierReceipt?.instrumentNo}</p>
                            <p><span className="font-bold text-cyan-700">Dated:</span> {voucherDataCashierReceipt?.instrumentDate}</p>
                            <p><span className="font-bold text-cyan-700">On Account of:</span> {voucherDataCashierReceipt?.accountHead}</p>
                        </div>

                        {/* Signature Section */}
                        <div className="flex justify-between text-black-600 font-semibold text-xs mt-6 gap smallbold">
                            <span style={{ float: "left" }}>{voucherDataCashierReceipt?.leftSignatory}</span>
                            <span style={{ float: "right" }}>{voucherDataCashierReceipt?.rightSignatory}</span>
                        </div>
                        <div className="clearfix"></div>
                        {/* Footer */}
                        <div className="mt-4 font-semibold text-xs smallbold">
                            <p><span className="font-semibold text-cyan-700">Entered By:</span> {voucherDataCashierReceipt?.entryBy}</p>
                            <p><span className="font-semibold text-cyan-700">Verified By:</span> {voucherDataCashierReceipt?.verifiedBy}</p>
                        </div>
                    </div>



                    <div className="flex justify-center space-x-4 py-1">
                        <div className="text-right text-xs mt-4 italic">
                            <button className="bg-yellow-500 text-white px-2 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onCloseModalCashierReceipt}>
                                Close
                            </button>&nbsp;
                            <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={handlePrint}>
                                Print
                            </button>
                        </div>
                    </div>
                </motion.div>
            </Modal>

            <Modal
                isOpen={nextPfp}
                onRequestClose={() => setModalPassForPaymentId(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "30%",
                        height: "30%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                {/* Title */}
                <h1 className="text-center text-blue-700 text-2xl font-bold mb-1">
                    <span>Next PFP ID : {nextPfpData?.nextPfpId}</span><br></br>

                </h1>
                {/* Close Button */}
                <div className="mt-8 text-center">

                    {nextPfpData?.nextPfpId === "No data found" ?
                        <>
                            <button
                                type="button"
                                className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                onClick={onNextPfpClose}
                            >
                                Close
                            </button>
                        </>
                        : <>

                            <button
                                type="button"
                                className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                                onClick={onNextPfpProceed}
                            >
                                Proceed
                            </button> &nbsp;&nbsp;

                            <button
                                type="button"
                                className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                                onClick={onNextPfpProceedwithPreviousVoucherType}
                            >
                                Proceed with previous voucher type
                            </button>
                        </>}

                </div>
            </Modal>

            <Modal
                isOpen={showVoucherID}
                onRequestClose={() => setModalPassForPaymentId(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "50%",
                        height: "40%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                {/* Title */}
                <h1 className="text-center text-blue-700 text-2xl font-bold mb-1">
                    {VoucherResponse?.message}<br></br>
                    <span>Voucher Amount : {VoucherResponse?.voucherAmount}</span><br></br>
                    <span>Voucher Status : {VoucherResponse?.voucherStatus}</span>
                </h1>



                {/* Close Button */}
                <div className="mt-8 text-center">
                    <button
                        type="button"
                        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={onCloseVoucherId}
                    >
                        Close
                    </button>

                </div>
            </Modal>
            {/* confirmation modal */}.
            <Modal
                isOpen={confirmSubmitFlag}
                onRequestClose={() => setModalPassForPaymentId(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "40%",
                        height: "30%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                {/* Title */}
                {loader ? <div className="flex-grow text-center">
                    <ColorRingCustomLoader isLoader={loader} />
                </div> :
                    <>
                        <h1 className="text-center text-Black-800 text-2xl font-bold mb-1">
                            📋 Review your details before submitting.<br></br>
                            <span> Do you wish to proceed?</span>
                        </h1>



                        {/* Close Button */}
                        <div className="mt-8 text-center">
                            <button
                                type="button"
                                className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                                onClick={onConfirmSubmit}
                            >
                                Submit
                            </button>&nbsp;&nbsp;

                            <button
                                type="button"
                                className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                onClick={onCloseConfirmSubmit}
                            >
                                CLOSE
                            </button>
                        </div></>}
            </Modal>

            {/* confirmation modal for delete */}.
            <Modal
                isOpen={deleteFlag}
                onRequestClose={() => setDeleteFlag(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "40%",
                        height: "30%", // Increased height slightly to accommodate the new field
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >

                <h3 className="text-center text-gray-800 text-xl font-bold mb-1">
                    Voucher ID : {voucherDataById?.basic?.voucherId}</h3>
                {/* Reason Input */}
                <div className="my-4">
                    <label className="block text-sm  font-bold mb-1">
                        Reason for Delete:<span className="text-red-500 "> * </span>
                    </label>
                    <input
                        type="text"
                        value={deleteReason}
                        onChange={(e) => setDeleteReason(e.target.value)}
                        placeholder="Enter reason here..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Buttons */}
                <div className="mt-4 text-center">
                    <button
                        type="button"
                        className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                        onClick={onSubmitDelete}
                    >
                        Submit & Delete
                    </button>
                    &nbsp;&nbsp;
                    <button
                        type="button"
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                        onClick={onDeleteClose}
                    >
                        CLOSE
                    </button>
                </div>
            </Modal>

            {/* confirmation of verify voucher */}
            <Modal
                isOpen={verifyFlag}
                onRequestClose={() => setVerifyFlag(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "40%",
                        height: "30%", // Increased height slightly to accommodate the new field
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >

                <h3 className="text-center text-gray-800 text-xl font-bold mb-1">
                    Are you sure you want to verify this voucher?</h3>
                {/* Reason Input */}


                {/* Buttons */}
                <div className="mt-4 text-center">
                    <button
                        type="button"
                        className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
                        onClick={onSubmitVerify}
                    >
                        Submit & Verify
                    </button>
                    &nbsp;&nbsp;
                    <button
                        type="button"
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                        onClick={onVerifyClose}
                    >
                        CLOSE
                    </button>
                </div>
            </Modal>

            {/* for pass for payment id */}
            <Modal
                isOpen={modalPassForPaymentId}
                onRequestClose={() => setModalPassForPaymentId(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "70%",
                        height: "60%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                <motion.div
                    initial={{ x: "100vw", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100vw", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {/* Title */}
                    <h1 className="text-center text-blue-800 text-2xl font-bold mb-1">
                        List of Verified Pass for Payment
                    </h1>

                    {/* Form Row */}
                    <div className="flex items-center gap-4 mb-6">

                        <div className="flex-3">
                            <label htmlFor="activity" className="block font-semibold mb-1 text-xs">
                                From Date:<span className="text-red-500 "> * </span>
                            </label>
                            <input
                                style={{ fontSize: ".75rem" }} type="date"
                                id="activity"
                                onChange={(e) => setFromDatePassForPayment(e.target.value)}
                                value={fromDatePassForPayment}
                                placeholder=""
                                className="text-xs w-full px-3 py-1 border border-gray-300 rounded-md"
                            />
                        </div>

                        {/* Activity Input */}
                        <div className="flex-3">
                            <label htmlFor="activity" className="block font-semibold mb-1 text-xs">
                                To Date:<span className="text-red-500 "> * </span>
                            </label>
                            <input
                                type="date"
                                id="activity"
                                onChange={(e) => setToDatePassForPayment(e.target.value)}
                                value={toDatePassForPayment}
                                placeholder="dd/mm/yyyy"
                                className="text-xs w-full px-3 py-1 border border-gray-300 rounded-md"
                            />
                        </div>
                        {/* <div className="flex-2">
                            <label htmlFor="year" className="block font-semibold mb-1 text-xs">
                                Pass for Payment Status:
                            </label>
                            <select
                                id="year"
                                value={passForPaymentStatus}
                                className="text-xs w-full px-3 py-1 border border-gray-300 rounded-md"
                                onChange={(e) => setPassForPaymentStatus(e.target.value)}
                            >
                                <option value="" selected>--Select Status--</option>
                                <option value="V" >Verified</option>
                                <option value="I" >Unverified</option>

                            </select>
                        </div> */}
                        {/* Retrieve Button */}
                        <button
                            type="button"
                            onClick={onRetrievePassForPayment}
                            className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                            style={{ marginTop: "24px" }}
                        >
                            RETRIEVE
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 rounded-md text-xs text-gray-600">
                            <thead className="bg-yellow-100 text-gray-700 font-semibold">
                                <tr>
                                    <th className="border px-4 py-2">PFP Id</th>
                                    <th className="border px-4 py-2">Fin Year</th>
                                    <th className="border px-4 py-2">Payment Date</th>
                                    <th className="border px-4 py-2">Acc Code</th>
                                    <th className="border px-4 py-2">Payment Desc</th>
                                    <th className="border px-4 py-2">Net Amount</th>
                                    <th className="border px-4 py-2">Deducted Amount</th>
                                    <th className="border px-4 py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Example Row */}
                                {passForPaymentDetailsById?.map((d, index) => (


                                    <tr>
                                        <td
                                            className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChossePassForPayment(d?.pfpId)}>
                                            {d?.pfpId}
                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChossePassForPayment(d?.pfpId)}>
                                            {d?.finYear}
                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChossePassForPayment(d?.pfpId)}>
                                            {d?.paymentDate}
                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChossePassForPayment(d?.pfpId)}>
                                            {d?.accountCode}
                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChossePassForPayment(d?.pfpId)}>
                                            {d?.paymentDesc}
                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChossePassForPayment(d?.pfpId)}>
                                            {d?.netAmount}
                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChossePassForPayment(d?.pfpId)}>
                                            {d?.deductAmount}
                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChossePassForPayment(d?.pfpId)}>
                                            {d?.pfpStatus}
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                        {passForPaymentDetailsById?.length === 0 ? <div className="flex items-center justify-center bg-gray-200" style={{ marginTop: "10px" }}>
                            <div className="text-center">
                                <h1 className="text-xl font-semibold text-black-800">No Data Found</h1>

                            </div>
                        </div> : ""}
                    </div>

                    {/* Close Button */}
                    <div className="mt-8 text-center">
                        <button
                            type="button"
                            className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                            onClick={onClosePassForPayment}
                        >
                            CLOSE
                        </button>
                    </div>
                </motion.div>
            </Modal>
            {/* Reference of  */}

            <Modal
                isOpen={modalReferenceOf}
                onRequestClose={() => setModalPassForPaymentId(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "70%",
                        height: "60%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                {/* Title */}
                <h1 className="text-center text-blue-800 text-2xl font-bold mb-1">
                    {matches901 ? "Details of Uncashed Self cheque" : matches801 ? "List of Un-Adjused Advance" : ""}
                </h1>

                {/* Form Row */}
                <div className="text-center items-center gap-4 mb-2">
                    <div className="flex-2">
                        <label htmlFor="year" className="block font-semibold mb-1 text-xl">
                            Head of Accounts: {accountHead}
                        </label>

                    </div>
                    {matches801 ?
                        <div className="flex-2">
                            <label htmlFor="year" className="block font-semibold mb-1 text-xl">
                                Party Code: {partyTypes === "C" ? partyName?.contractorId : partyTypes === "E" ? partyName?.empId : partyTypes === "J" ? partyName?.jobWorkerId : partyTypes === "D" ? partyName?.deptId : partyTypes === "L" ? partyName?.lsgCode : getPassForPaymentDataById?.basic?.partyCode}
                            </label>

                        </div> : ""}
                    {/* Retrieve Button */}

                </div>
                <div className="text-center items-center gap-2 mb-4">
                    {matches901 ?
                        <button
                            type="button"
                            onClick={onRetrieveReferenceOf}
                            className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            RETRIEVE
                        </button> : ""}

                    {matches801 ?
                        <button
                            type="button"
                            onClick={onRetrieveReferenceOfAdvance}
                            className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            RETRIEVE
                        </button> : ""}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {matches901 ?
                        <table className="min-w-full border border-gray-300 rounded-md text-xs text-gray-600">
                            <thead className="bg-yellow-200 text-gray-700 font-semibold">
                                <tr>
                                    <th className="border px-4 py-2">Voucher Date</th>
                                    <th className="border px-4 py-2">Voucher ID</th>
                                    <th className="border px-4 py-2">Voucher Amount</th>
                                    <th className="border px-4 py-2">Voucher Narration</th>

                                </tr>
                            </thead>
                            <tbody>

                                {referenceOfDetailsById?.map((d, index) => (
                                    <tr>
                                        <td
                                            className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChosseReferenceOf(d?.voucherId, d?.voucherNetAmount, d?.voucherNarration)}>
                                            {d?.voucherDate}
                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChosseReferenceOf(d?.voucherId, d?.voucherNetAmount, d?.voucherNarration)}>
                                            {d?.voucherId}
                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChosseReferenceOf(d?.voucherId, d?.voucherNetAmount, d?.voucherNarration)}>
                                            {d?.voucherNetAmount}
                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChosseReferenceOf(d?.voucherId, d?.voucherNetAmount, d?.voucherNarration)}>
                                            {d?.voucherNarration}
                                        </td>

                                    </tr>
                                ))}

                            </tbody>
                        </table> : ""}

                    {matches901 && referenceOfDetailsById?.length === 0 ? <div className="flex items-center justify-center bg-gray-200" style={{ marginTop: "10px" }}>
                        <div className="text-center">
                            <h1 className="text-xl font-semibold text-black-800">No Data Found</h1>

                        </div>
                    </div> : ""}

                    {matches801 ?
                        <table className="min-w-full border border-gray-300 rounded-md text-xs text-gray-600">
                            <thead className="bg-yellow-200 text-gray-700 font-semibold">
                                <tr>
                                    <th className="border px-4 py-2">Voucher Date</th>
                                    <th className="border px-4 py-2">Voucher ID</th>
                                    <th className="border px-4 py-2">Advance Paid</th>
                                    <th className="border px-4 py-2">Due Amount</th>
                                    <th className="border px-4 py-2">Voucher Narration</th>

                                </tr>
                            </thead>
                            <tbody>

                                {referenceOfDetailsByAdvanceAdj?.map((d, index) => (
                                    <tr>
                                        <td
                                            className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChosseReferenceOf(d?.voucherId, d?.dueAmount, d?.voucherNarration)}>
                                            {d?.voucherDate}
                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChosseReferenceOf(d?.voucherId, d?.dueAmount, d?.voucherNarration)}>
                                            {d?.voucherId}
                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChosseReferenceOf(d?.voucherId, d?.dueAmount, d?.voucherNarration)}>
                                            {d?.advancePaid}
                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChosseReferenceOf(d?.voucherId, d?.dueAmount, d?.voucherNarration)}>
                                            {d?.dueAmount}
                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChosseReferenceOf(d?.voucherId, d?.dueAmount, d?.voucherNarration)}>
                                            {d?.voucherNarration}
                                        </td>

                                    </tr>
                                ))}

                            </tbody>
                        </table> : ""}




                    {matches801 && referenceOfDetailsByAdvanceAdj?.length === 0 ? <div className="flex items-center justify-center bg-gray-200" style={{ marginTop: "10px" }}>
                        <div className="text-center">
                            <h1 className="text-xl font-semibold text-black-800">No Data Found</h1>

                        </div>
                    </div> : ""}
                </div>

                {/* Close Button */}
                <div className="mt-8 text-center">
                    <button
                        type="button"
                        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={onCloseReferenceOf}
                    >
                        CLOSE
                    </button>
                </div>
            </Modal>

            {/* for party details modal */}
            <Modal
                isOpen={isPartyDetailsOpen}
                onRequestClose={() => setIsPartyDetailsOpen(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "70%",
                        height: "60%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                <motion.div
                    initial={{ x: "100vw", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100vw", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {/* Title */}
                    <h1 className="text-center text-blue-800 text-2xl font-bold mb-1">
                        List of {partyTypes === "C" ? "Contractor" : partyTypes === "E" ? "Employee" : partyTypes === "J" ? "Job Worker" : partyTypes === "D" ? "Department" : partyTypes === "L" ? "LSG" : "Benificiary"} Details
                    </h1>


                    <div className="flex items-center gap-4 mb-6">


                        <div className="flex-1">
                            <label htmlFor="activity" className="block font-semibold mb-1 text-xs">
                                {partyTypes === "C" ? "Contractor" : partyTypes === "E" ? "Employee" : partyTypes === "J" ? "Job Worker" : partyTypes === "D" ? "Department" : partyTypes === "L" ? "LSG" : "Benificiary"} Name
                            </label>
                            <input
                                type="text"
                                id="activity"
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                                placeholder={partyTypes === "C" ? "Contractor" : partyTypes === "E" ? "Employee" : partyTypes === "J" ? "Job Worker" : partyTypes === "D" ? "Department" : partyTypes === "L" ? "LSG" : "Benificiary"}
                                className="text-xs w-full px-3 py-1 border border-gray-300 rounded-md"
                            />
                        </div>



                        {/* Retrieve Button */}
                        <button
                            type="button"
                            onClick={onPartyTypesRetrieve}
                            className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                            style={{ marginTop: "24px" }}
                        >
                            RETRIEVE
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 rounded-md text-xs text-gray-600">
                            <thead className="bg-yellow-100 text-gray-700 font-semibold">
                                <tr>
                                    <th className="border px-4 py-2">{partyTypes === "C" ? "Contractor Id" : partyTypes === "E" ? "Employee Id" : partyTypes === "J" ? "Job Worker Id" : partyTypes === "D" ? "Department Id" : partyTypes === "L" ? "LSG Code" : "Benificiary Id"}</th>
                                    <th className="border px-4 py-2">{partyTypes === "C" ? "Contractor Name" : partyTypes === "E" ? "Employee Name" : partyTypes === "J" ? "Job Worker Name" : partyTypes === "D" ? "Department Name" : partyTypes === "L" ? "LSG Name" : "Benificiary Name"}</th>
                                    <th className="border px-4 py-2">{partyTypes === "C" ? "Contractor PAN" : partyTypes === "E" ? "Employee Designation" : partyTypes === "J" ? "Job Worker Address" : partyTypes === "D" ? "Department ABV" : partyTypes === "L" ? "LSG Address" : "Benificiary Scheme"}</th>



                                </tr>
                            </thead>
                            <tbody>
                                {/* Example Row */}
                                {nameList?.map((d, index) => (


                                    <tr>
                                        <td
                                            className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onPartyTypeChosse(d)}>
                                            {partyTypes === "C" ? d?.contractorId : partyTypes === "E" ? d?.empId : partyTypes === "J" ? d?.jobWorkerId : partyTypes === "D" ? d?.deptId : partyTypes === "L" ? d?.lsgCode : "Benificiary Scheme"}

                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onPartyTypeChosse(d)}>
                                            {partyTypes === "C" ? d?.contractorNm : partyTypes === "E" ? d?.empName : partyTypes === "J" ? d?.jobWorkerName : partyTypes === "D" ? d?.deptName : partyTypes === "L" ? d?.lsgName : "Benificiary Scheme"}
                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onPartyTypeChosse(d)}>
                                            {partyTypes === "C" ? d?.contractorPan : partyTypes === "E" ? d?.empAddress : partyTypes === "J" ? d?.jobWorkerAddress : partyTypes === "D" ? d?.deptAbv : partyTypes === "L" ? d?.lsgAdd1 + d?.lsgAdd2 : "Benificiary Scheme"}


                                        </td>


                                    </tr>
                                ))}

                            </tbody>
                        </table>
                        {nameList?.length === 0 ? <div className="flex items-center justify-center bg-gray-200" style={{ marginTop: "10px" }}>
                            <div className="text-center">
                                <h1 className="text-xl font-semibold text-black-800">No Data Found</h1>

                            </div>
                        </div> : ""}
                    </div>

                    {/* Close Button */}
                    <div className="mt-8 text-center">
                        <button
                            type="button"
                            className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                            onClick={onPartyDetailsClose}
                        >
                            CLOSE
                        </button>
                    </div>
                </motion.div>
            </Modal>

            <Modal isOpen={voucherFlag}
                // onRequestClose={() => setIsPartyDetailsOpen(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "50%",
                        height: "58%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                <motion.div
                    initial={{ x: "100vw", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100vw", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div className="max-w-5xl mx-auto border p-4  shadow-lg text-xs">
                        {/* Header */}
                        <div className="text-center">
                            <span className="flex-1 text-center font-bold">Form No. 7 [Rule 9(3)]</span>
                            <div className="flex w-full justify-between items-center relative">
                                {/* Centered span message */}
                                <span className="absolute left-1/2 transform -translate-x-1/2 font-bold text-lg text-cyan-700">
                                    {voucherModeData === "P" ? "DEBIT VOUCHER" : voucherModeData === "R" ? "CREDIT VOUCHER" : voucherModeData === "N" && voucherTypeData === "J" ? "JOURNAL VOUCHER" : voucherModeData === "N" && voucherTypeData === "N" ? "CONTRA VOUCHER" : ""}
                                </span>

                                {/* Right-aligned image */}
                                <div className="w-24 h-12 flex items-center justify-end ml-auto">
                                    <img src={LOGO} alt="Company Logo" className="w-20 h-18 object-contain" />
                                </div>
                            </div>
                        </div>

                        <div className="text-center font-semibold">{userData?.USER_LEVEL === "GP" ? userData?.GP_NAME : userData?.USER_LEVEL === "BLOCK" ? userData?.BLK_NAME : userData?.USER_LEVEL === "DIST" ? userData?.DIST_NAME : ""}</div>
                        {/* <div className="text-center mb-4">Address of GP/PS/GP</div> */}

                        {/* Account Details */}
                        <div className="grid grid-cols-2 gap-4 border-b pb-2">
                            <div>
                                <p><span className="font-semibold">Head of Accounts: {partyType ? partyType : getPassForPaymentDataById?.basic?.glGroupName}</span></p>
                                <p><span className="font-semibold">Account Codes: {voucherModeData === "N" ? selectedValue2 : getPassForPaymentDataById?.basic?.accountCode || accCode}</span></p>
                                <p><span className="font-semibold">Account Code Desc: {getPassForPaymentDataById?.basic?.accountCodeDesc ? getPassForPaymentDataById?.basic?.accountCodeDesc : acCodeDescAllList.find(
                                    (item) => item.accountCode === accCode
                                )?.accountCodeDesc || ""}</span></p>
                                <p><span className="font-semibold">National A/C Code:</span></p>
                            </div>
                            <div className="text-right">
                                <p><span className="font-semibold">Voucher Date: {voucherDate}</span></p>
                                <p><span className="font-semibold">Voucher ID: ***********</span></p>
                                <p><span className="font-semibold">Voucher No.: {voucherNo ? voucherNo : ""}</span></p>
                                <p><span className="font-semibold">Pass for Payment ID: {getPassForPaymentDataById?.basic?.pfpId}</span></p>
                            </div>
                        </div>

                        {/* Payee Details */}
                        <div className="mt-4">
                            <p><span className="font-semibold">{voucherModeData === "P" ? "Pay to :" : voucherModeData === "R" ? "Received From :" : voucherModeData === "N" ? "Transfer To :" : ""}</span> {
                                voucherModeData === "P" ? getPassForPaymentDataById?.basic?.payTo : payto ? payto : ""}</p>
                            <p><span className="font-semibold">of:</span> {voucherModeData === "P" ? getPassForPaymentDataById?.basic?.payAddress : payAddress ? payAddress : ""}</p>
                            <p><span className="font-semibold">Description:</span> {paymentDesc}</p>
                            <p><span className="font-semibold">Rs.:</span> {voucherModeData === "P" ? getPassForPaymentDataById?.basic?.netAmount : netAmount}/- (Rs. only)</p>
                            <p><span className="font-semibold">Paid by:</span> {instType}</p>
                            <p><span className="font-semibold">No.:</span> {instTypeAllList?.chequeNo}</p>
                            <p><span className="font-semibold">Dated:</span> {receiptPaymentDate}</p>
                            <p><span className="font-semibold">Drawn on:</span> {instTypeAllList?.bankName}</p>
                        </div>

                        {/* Amount Details */}
                        {getPassForPaymentDataById?.deduct?.length > 0 ?
                            <div className="mt-4">
                                <table className="w-full border-collapse border border-gray-400 text-center">
                                    <thead>
                                        <tr className="bg-yellow-300">
                                            <th className="border border-gray-400 px-4 py-1 w-1/2">Deduction Account Head</th>
                                            <th className="border border-gray-400 px-4 py-1 w-1/2">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getPassForPaymentDataById?.deduct?.map((user, index) => (

                                            <tr key={index} className="bg-yellow-300">
                                                <th className="border border-gray-400 px-4 py-1">{user.accountDescActual}</th>
                                                <th className="border border-gray-400 px-4 py-1">{user.deductionAmount}</th>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div> : ""}



                        {/* <div className="text-right text-xs mt-4 italic">Printed on 04.02.2025 11.39 AM</div> */}
                    </div>
                    <div className="flex justify-center space-x-4 py-1">
                        <div className="text-right text-xs mt-4 italic">
                            <button className="bg-yellow-500 text-white px-4 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onClosePreview}>
                                Close
                            </button>
                        </div>
                    </div>
                </motion.div>
            </Modal>

            <Modal
                isOpen={modalVoucherId}
                onRequestClose={() => setModalVoucherId(false)}
                shouldCloseOnOverlayClick={false}
                style={{
                    content: {
                        width: "70%",
                        height: "60%",
                        margin: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                    },
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        backdropFilter: "blur(5px)",
                    },
                }}
            >
                <motion.div
                    initial={{ x: "100vw", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100vw", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {/* Title */}
                    <h1 className="text-center text-blue-800 text-2xl font-bold mb-1">
                        List of {pageChange === "Query" ? "" : "Unverified"} Vouchers
                    </h1>

                    {/* Form Row */}
                    <div className="flex items-center gap-4 mb-6">

                        <div className="flex-3">
                            <label htmlFor="activity" className="block font-semibold mb-1 text-xs">
                                From Date:<span className="text-red-500 "> * </span>
                            </label>
                            <input
                                style={{ fontSize: ".75rem" }} type="date"
                                id="activity"
                                onChange={(e) => setFromDateVoucher(e.target.value)}
                                value={fromDateVoucher}
                                placeholder=""
                                className="text-xs w-full px-3 py-1 border border-gray-300 rounded-md"
                            />
                        </div>

                        {/* Activity Input */}
                        <div className="flex-3">
                            <label htmlFor="activity" className="block font-semibold mb-1 text-xs">
                                To Date:<span className="text-red-500 "> * </span>
                            </label>
                            <input
                                type="date"
                                id="activity"
                                onChange={(e) => setToDateVoucher(e.target.value)}
                                value={toDateVoucher}
                                placeholder="dd/mm/yyyy"
                                className="text-xs w-full px-3 py-1 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="flex-2">
                            <label htmlFor="year" className="block font-semibold mb-1 text-xs">
                                Voucher Type:<span className="text-red-500 "> * </span>
                            </label>
                            <select
                                id="year"
                                value={voucherModalType}
                                className="text-xs w-full px-3 py-1 border border-gray-300 rounded-md"
                                onChange={(e) => setvoucherModalType(e.target.value)}
                            >
                                <option value="" selected>--Select Voucher Type--</option>
                                {dataArray.map((voucherType) => (
                                    <option key={voucherType.value} value={voucherType.value}>
                                        {voucherType.label}
                                    </option>
                                ))}

                            </select>
                        </div>
                        {pageChange === "Query" ?
                            <div className="flex-2">
                                <label htmlFor="year" className="block font-semibold mb-1 text-xs">
                                    Voucher Status:
                                </label>
                                <select
                                    id="year"
                                    value={voucherStatus}
                                    className="text-xs w-full px-3 py-1 border border-gray-300 rounded-md"
                                    onChange={(e) => setvoucherStatus(e.target.value)}
                                >
                                    <option value="" selected>--Select Status--</option>
                                    <option value="V" >Verified</option>
                                    <option value="I" >Unverified</option>

                                </select>
                            </div> : ""}

                        <div className="flex-2">
                            <label htmlFor="year" className="block font-semibold mb-1 text-xs">
                                Narration:
                            </label>
                            <input type="url" class="text-xs w-full px-3 py-1 border border-gray-300 rounded-md" placeholder="Narration" value={voucherModalNarration} onChange={(e) => setVoucherModalNarration(e.target.value)} />

                        </div>
                        {/* Retrieve Button */}
                        <button
                            type="button"
                            onClick={onRetrieveVoucher}
                            className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                            style={{ marginTop: "24px" }}
                        >
                            RETRIEVE
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 rounded-md text-xs text-gray-600">
                            <thead className="bg-yellow-100 text-gray-700 font-semibold">
                                <tr>

                                    <th className="border px-4 py-2">Voucher Date</th>
                                    <th className="border px-4 py-2">Voucher ID</th>
                                    {voucherModalType === "C" || voucherModalType === "J" ?
                                        <th className="border px-4 py-2">Voucher Narration</th>
                                        :
                                        <>
                                            <th className="border px-4 py-2">Account Head</th>
                                            <th className="border px-4 py-2">Voucher Type</th>
                                        </>}
                                    <th className="border px-4 py-2">Voucher Amount</th>
                                    <th className="border px-4 py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Example Row */}
                                {voucherDetailsById?.map((d, index) => (
                                    <tr>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChosseVoucher(d?.voucherId)}>
                                            {d?.voucherDate}
                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChosseVoucher(d?.voucherId)}>
                                            {d?.voucherId}
                                        </td>
                                        {voucherModalType === "C" || voucherModalType === "J" ?
                                            <td className="border px-2 py-2 text-center cursor-pointer"
                                                onClick={() => onChosseVoucher(d?.voucherId)}>
                                                {d?.voucherNarration}
                                            </td> :
                                            <>
                                                <td className="border px-2 py-2 text-center cursor-pointer"
                                                    onClick={() => onChosseVoucher(d?.voucherId)}>
                                                    {d?.accountHead}
                                                </td>
                                                <td className="border px-2 py-2 text-center cursor-pointer"
                                                    onClick={() => onChosseVoucher(d?.voucherId)}>
                                                    {d?.voucherType}
                                                </td></>}

                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChosseVoucher(d?.voucherId)}>
                                            {d?.voucherAmount}
                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChosseVoucher(d?.voucherId)}>
                                            {d?.verifyStts}
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                        {voucherDetailsById?.length === 0 ? <div className="flex items-center justify-center bg-gray-200" style={{ marginTop: "10px" }}>
                            <div className="text-center">
                                <h1 className="text-xl font-semibold text-black-800">No Data Found</h1>

                            </div>
                        </div> : ""}
                    </div>

                    {/* Close Button */}
                    <div className="mt-8 text-center">
                        <button
                            type="button"
                            className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                            onClick={onCloseVoucher}
                        >
                            CLOSE
                        </button>
                    </div>
                </motion.div>
            </Modal>

            <div className="flex-grow"
                style={{ marginTop: "-45px" }}
            >
                <div className="mx-auto">
                    <div className=" rounded-lg p-2">
                        <div className="flex w-full items-center justify-between">

                            <legend className="text-lg font-semibold text-gray-700">Voucher Entry</legend>

                            {/* Right Section */}
                            <div className="flex space-x-4">
                                <div className="flex items-center">
                                    <label className="flex items-center text-xs">
                                        <input
                                            type="radio"
                                            name="action" // Same name for all radio buttons
                                            value="Add"
                                            checked={pageChange === "Add"} // Bind selection state
                                            className="form-radio text-blue-500 mr-2"
                                            onChange={onPageChange}
                                        />
                                        Add
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <label className="flex items-center text-xs">
                                        <input
                                            type="radio"
                                            name="action" // Same name for all radio buttons
                                            value="Query"
                                            checked={pageChange === "Query"} // Bind selection state
                                            className="form-radio text-blue-500 mr-2"
                                            onChange={onPageChange}
                                        />
                                        Query
                                    </label>
                                </div>
                                {userData?.ROLE === "1" || userData?.ROLE === "3" ?
                                    <>
                                        <div className="flex items-center">
                                            <label className="flex items-center text-xs">
                                                <input
                                                    type="radio"
                                                    name="action" // Same name for all radio buttons
                                                    value="Verify"
                                                    checked={pageChange === "Verify"} // Bind selection state
                                                    className="form-radio text-blue-500 mr-2"
                                                    onChange={onPageChange}
                                                />
                                                Verify
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <label className="flex items-center text-xs">
                                                <input
                                                    type="radio"
                                                    name="action" // Same name for all radio buttons
                                                    value="Delete"
                                                    checked={pageChange === "Delete"} // Bind selection state
                                                    className="form-radio text-blue-500 mr-2"
                                                    onChange={onPageChange}
                                                />
                                                Delete
                                            </label>
                                        </div>
                                    </> : ""}

                            </div>
                        </div>
                        {pageChange === "Add" ?
                            <div>
                                <fieldset className="border border-gray-300 rounded-lg mb-1">
                                    {/* <legend className="text-lg font-semibold text-gray-700 px-2"></legend> */}
                                    <div className="flex w-full space-x-4 mt-1">
                                        <div className="px-3 w-1/3 flex flex-col mb-1">

                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Voucher ID</span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Voucher ID" disabled value={VoucherResponse?.voucherId} />

                                            </div>
                                        </div>

                                        <div className="px-3 w-1/3 flex flex-col">

                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Voucher Amount</span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Voucher Amount" disabled value={VoucherResponse?.voucherAmount} />

                                            </div>
                                        </div>

                                        <div className="px-3 w-1/3 flex flex-col">

                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Voucher Status</span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Voucher Status" disabled value={VoucherResponse?.voucherStatus} />

                                            </div>
                                        </div>

                                    </div>

                                    <div className="flex w-full space-x-4">
                                        <div className="px-3 w-1/3 flex flex-col">

                                            <div class="flex items-center border bg-gray-200 rounded h-7 mb-1">
                                                <span class="px-2 bg-gray-200 text-xs">Voucher Mode<span className="text-red-500 "> * </span></span>
                                                <select disabled={VoucherResponse?.voucherStatus ? true : false} id="DISTRICT" class="flex-grow text-xs px-2 py-1 h-7 outline-none rounded" onChange={onVoucherMode} value={voucherModeData}>
                                                    <option value="" selected>--Select Voucher Mode--</option>
                                                    {voucherMode.map((option) => (
                                                        <option key={option.id} value={option.id}>
                                                            {option.label}
                                                        </option>
                                                    ))}

                                                </select>
                                            </div>
                                        </div>

                                        <div className="px-3 w-1/3 flex flex-col">

                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Pass For Payment ID</span>

                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Pass for payment ID"
                                                    disabled value={getPassForPaymentDataById?.basic?.pfpId} />

                                                <button className="px-2 h-7 flex items-center justify-center bg-blue-500 text-white rounded-r"
                                                    disabled={voucherModeData === "R" || voucherModeData === "N" || voucherModeData === "" ? true : false}
                                                    onClick={onPassForPaymentId}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="w-4 h-4"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M21 21l-4.35-4.35M18 10.5a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>

                                        </div>

                                        <div className="px-3 w-1/3 flex flex-col">
                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Date<span className="text-red-500 "> *</span></span>
                                                <input
                                                    type="date"
                                                    id="txt_dob"
                                                    placeholder="Voucher Date"
                                                    className="text-xs border border-gray-300 rounded px-4 py-2 h-7 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                                    onChange={onVoucherDate}
                                                    value={voucherDate}
                                                    max={new Date().toISOString().split("T")[0]} // Set max date to today

                                                />
                                                <span class="px-2 bg-gray-200 text-xs">Sub Allotment</span>
                                                <input
                                                    type="checkbox" className="large-checkbox px-2"
                                                    checked={getPassForPaymentDataById?.basic?.subAllot === "1" ? true : false}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex w-full space-x-4">
                                        {/* Voucher No */}
                                        <div className="px-3 w-1/3 flex flex-col">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Voucher No</span>
                                                <input
                                                    type="text"
                                                    className="flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                    placeholder="Voucher No"
                                                    onChange={onVoucherNo}
                                                    maxLength={20}
                                                />
                                            </div>
                                        </div>

                                        {/* Voucher Type */}
                                        <div className="px-3 w-1/3 flex flex-col">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Voucher Type<span className="text-red-500 "> * </span></span>
                                                <select
                                                    id="DISTRICT"
                                                    className="flex-grow text-xs px-2 py-1 h-7 outline-none rounded"
                                                    onChange={onVoucherType}
                                                    value={voucherTypeData}
                                                >
                                                    <option value="">--Select Voucher Type--</option>
                                                    {filteredTransactions.map((type) => (
                                                        <option key={type.id} value={type.id}>
                                                            {type.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Bank/Treasury */}
                                        <div className="px-3 w-1/3 flex flex-col">
                                            <div className="flex items-center bg-gray-200 rounded h-7 w-full">
                                                <span className="px-2 bg-gray-200 text-xs whitespace-nowrap">
                                                    Bank/Treasury<span className="text-red-500 "> * </span>
                                                </span>
                                                <select
                                                    id="DISTRICT"
                                                    className="flex-grow text-xs px-2 py-1 h-7 outline-none rounded w-[150px] truncate"
                                                    disabled={["C", "T", "J", "N"].includes(voucherTypeData)}
                                                    onChange={onBankTreasury}
                                                    value={bankTreasury}
                                                >
                                                    {!["C", "T"].includes(voucherTypeData) && (
                                                        <option value="">--Select Bank/Treasury--</option>
                                                    )}
                                                    {realAccWithbalance?.map((option) => (
                                                        <option key={option.accountCode} value={option.accountCode}>
                                                            {option.accountCodeDesc}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                        </div>
                                    </div>

                                </fieldset>
                                {voucherModeData === "N" ? "" :

                                    <fieldset className="border border-gray-300 rounded-lg mb-1">
                                        <div className="flex w-full space-x-4 mt-1">
                                            <div className="px-3 w-1/2 flex flex-col relative">
                                                {voucherModeData === "P" ?
                                                    <div className="flex items-center border bg-gray-200 rounded h-7">
                                                        <span className="px-2 bg-gray-200 text-xs">GL Group<span className="text-red-500 "> * </span></span>
                                                        <input
                                                            type="url"
                                                            className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                            placeholder="Search GL Group Name..."
                                                            value={getPassForPaymentDataById?.basic?.glGroupName}// Call the function when input changes
                                                            disabled
                                                        />
                                                    </div> :
                                                    <div className="flex items-center border bg-gray-200 rounded h-7">
                                                        <span className="px-2 bg-gray-200 text-xs">GL Group<span className="text-red-500 "> * </span></span>
                                                        <input
                                                            type="url"
                                                            className="flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                            placeholder="Search GL Group Name..."
                                                            onChange={onPartyType}
                                                            value={partyType}// Call the function when input changes

                                                        />
                                                    </div>}

                                                {showDropdown && (
                                                    <div className="absolute top-full left-20 z-10   border border-gray-300 rounded shadow-md max-h-30 overflow-y-auto ml-4 w-[285px]">
                                                        {partyTypeAllList.length > 0 ? (
                                                            partyTypeAllList.map((d, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="text-xs w-full px-2 py-2 border border-gray-300 hover:bg-gray-200 cursor-pointer bg-white"
                                                                    onClick={() => onSetPartType(d)} // Call the select function
                                                                >
                                                                    {d?.groupName}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="px-4 py-2 text-gray-500">No results found</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="w-full flex flex-col mb-1" style={{ paddingRight: "12px" }}>

                                                {voucherModeData === "P" ? <div class="flex items-center bg-gray-200 rounded h-7">
                                                    <span class="px-2 bg-gray-200 text-xs">A/C Code Desc<span className="text-red-500 "> * </span></span>
                                                    <input
                                                        type="url"
                                                        className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                        placeholder="A/C Code Desc"
                                                        disabled
                                                        value={getPassForPaymentDataById?.basic?.accountCodeDesc}
                                                    />
                                                </div> :
                                                    <div class="flex items-center bg-gray-200 rounded h-7">
                                                        <span class="px-2 bg-gray-200 text-xs">A/C Code Desc<span className="text-red-500 "> * </span></span>
                                                        <select id="DISTRICT" class="flex-grow text-xs px-2 py-1 h-7 outline-none rounded" onChange={onAcCode}>
                                                            <option value="">--Select A/C Code Desc--</option>
                                                            {acCodeDescAllList.map((d, i) => (

                                                                <option value={d?.accountCode}>{d?.accountCode}-{d?.accountCodeDesc}</option>
                                                            ))}
                                                        </select>
                                                    </div>}
                                            </div>
                                        </div>
                                    </fieldset>}
                                {voucherModeData === "N" ?
                                    <fieldset className="border border-gray-300 rounded-lg ">
                                        <div className="flex w-fullspace-x-4 mt-1">
                                            <div className="px-3 w-1/2 flex flex-col relative">
                                                <div class="flex items-center border bg-gray-200 rounded h-7">
                                                    <span class="px-2 bg-gray-200 text-xs">Transfer From (-)</span>
                                                    <input
                                                        type="text"
                                                        placeholder="Search..."
                                                        // className="flex-grow text-xs px-2 py-1 h-7 outline-none rounded w-full border"
                                                        className="flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                        value={searchTerm}
                                                        onChange={onSearchTerm}
                                                    />
                                                    {showDropdownSearchTerm && filteredOptions.length > 0 && (
                                                        <div className="absolute top-full left-20 z-10   border border-gray-300 rounded shadow-md max-h-30 overflow-y-auto ml-4 w-[475px]">
                                                            {filteredOptions.map((option) => (
                                                                <div
                                                                    key={option.accountCode}
                                                                    className="text-xs w-full px-2 py-2 border border-gray-300 hover:bg-gray-200 cursor-pointer bg-white"
                                                                    onClick={() => {
                                                                        setSelectedValue(option.accountCode);
                                                                        setSearchTerm(option.accountCodeDesc);
                                                                        setShowDropdownSearchTerm(false);
                                                                    }}
                                                                >
                                                                    {option.accountCode}-{option.accountCodeDesc}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                </div>
                                            </div>

                                            <div className="px-3 w-1/2 flex flex-col relative">
                                                <div class="flex items-center border bg-gray-200 rounded h-7">
                                                    <span class="px-2 bg-gray-200 text-xs">{voucherTypeData === "J" ? "Transfer To (+)" : "Deposited To (+)"}</span>
                                                    <input
                                                        type="text"
                                                        placeholder="Search..."
                                                        // className="flex-grow text-xs px-2 py-1 h-7 outline-none rounded w-full border"
                                                        className="flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                        value={searchTerm2}
                                                        onChange={onSearchTerm2}
                                                    />
                                                    {showDropdownSearchTerm2 && filteredOptions2.length > 0 && (
                                                        <div className="absolute top-full left-20 z-10   border border-gray-300 rounded shadow-md max-h-30 overflow-y-auto ml-4 w-[475px]">
                                                            {filteredOptions2.map((option) => (
                                                                <div
                                                                    key={option.accountCode}
                                                                    className="text-xs w-full px-2 py-2 border border-gray-300 hover:bg-gray-200 cursor-pointer bg-white"
                                                                    onClick={() => {
                                                                        setSelectedValue2(option.accountCode);
                                                                        setSearchTerm2(option.accountCodeDesc);
                                                                        setShowDropdownSearchTerm2(false) // Set search box text to selected option
                                                                    }}
                                                                >
                                                                    {option.accountCode}-{option.accountCodeDesc}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {/* <select id="DISTRICT" class="flex-grow text-xs px-2 py-1 h-7 outline-none rounded">
                                                        <option value="0">--Select {voucherTypeData === "J" ? "Transfer To" : "Deposited To"}--</option>

                                                        {nominalAccListForReceipt?.map((option) => (
                                                            <option key={option.accountCode} value={option.accountCode}> {option.accountCodeDesc}</option>
                                                        ))}

                                                    </select> */}
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset> : ""}

                                <fieldset className="border border-gray-300 rounded-lg ">
                                    <legend className="text-xs font-semibold text-gray-700 px-2">Receipt/Payment Instrument Details</legend>
                                    <div className="flex w-full space-x-4 mt-1">
                                        <div className="px-3 w-1/2 flex flex-col">
                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Inst Type</span>
                                                <select id="DISTRICT" class="flex-grow text-xs px-2 py-1 h-7 outline-none rounded" onChange={onInstType} value={instType}>
                                                    <option value="">--Select Instrument Type--</option>
                                                    {filteredInstTypeOptions.map((item) => (
                                                        <option key={item.value} value={item.value}>
                                                            {item.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="px-1 w-1/2 flex flex-col mb-2">
                                            <div class="flex items-center bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Bank/Try</span>
                                                <input type="url" class="flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Bank/Try Details" value={instTypeAllList?.bankName || ""} onChange={onBankName} disabled={instType === "None" ? true : false} />

                                            </div>
                                        </div>

                                        <div className="px-1 w-1/4 flex flex-col mb-2">
                                            <div class="flex items-center bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">No</span>
                                                <input type="url" class="flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="No" value={instTypeAllList?.chequeNo || ""} onChange={onChequeNo} disabled={instType === "None" ? true : false} />

                                            </div>
                                        </div>

                                        <div className="px-1 w-1/4 flex flex-col mb-2">
                                            <div class="flex items-center bg-gray-200 rounded h-7 text-xs">
                                                <span class="px-2 bg-gray-200 text-xs">Date</span>
                                                <input
                                                    type="date"
                                                    id="txt_dob"
                                                    placeholder="Voucher Date"
                                                    className="text-xs border border-gray-300 rounded px-4 py-2 h-7 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    onChange={(e) => setReceiptPaymentDate(e.target.value)}
                                                    value={receiptPaymentDate}
                                                    max={new Date().toISOString().split("T")[0]} // Set max date to today

                                                />
                                            </div>
                                        </div>


                                    </div>
                                </fieldset>


                                <div class="grid grid-cols-12 gap-4">
                                    <div class="col-span-8">
                                        <fieldset className="border border-gray-300 rounded-lg mt-1">
                                            <div className="flex w-full space-x-4 mt-1 mb-1">
                                                <div className="px-3 w-1/3 flex flex-col">
                                                    <div className="flex items-center border bg-gray-200 rounded h-7">
                                                        <span className="px-2 bg-gray-200 text-xs">Gross Amount</span>
                                                        <input
                                                            type="number"
                                                            className="flex-grow text-xs px-1 py-1 h-7 outline-none rounded"
                                                            placeholder="Gross Amount"
                                                            disabled={voucherModeData === "P" ? true : false}
                                                            value={voucherModeData === "P" ? (getPassForPaymentDataById?.basic?.deductAmount) + (getPassForPaymentDataById?.basic?.netAmount) : grossAmount}
                                                            onChange={onGrossAmount}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="px-1 w-1/3 flex flex-col">
                                                    <div className="flex items-center border bg-gray-200 rounded h-7">
                                                        <span className="px-2 bg-gray-200 text-xs">Deduct Amount</span>
                                                        <input
                                                            type="number"
                                                            className="bg-orange-100 flex-grow text-xs px-1 py-1 h-7 outline-none rounded"
                                                            placeholder="Deduct Amount"
                                                            disabled
                                                            value={voucherModeData === "P" ? getPassForPaymentDataById?.basic?.deductAmount : deductedAmount}
                                                            onChange={onDeductAmount}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="px-1 w-1/3 flex flex-col">
                                                    <div className="flex items-center border bg-gray-200 rounded h-7">
                                                        <span className="px-2 bg-gray-200 text-xs">Net Amount</span>
                                                        <input
                                                            type="number"
                                                            className="bg-orange-100 flex-grow text-xs px-1 py-1 h-7 outline-none rounded"
                                                            placeholder="Net Amount"
                                                            disabled
                                                            value={voucherModeData === "P" ? getPassForPaymentDataById?.basic?.netAmount : netAmount}
                                                        // onChange={onNetAmount}
                                                        />
                                                    </div>
                                                </div>




                                            </div>

                                        </fieldset>

                                        <fieldset className="border border-gray-300 rounded-lg mt-1">
                                            <div className="flex w-full space-x-4 mt-1 mb-1">
                                                <div className="px-3 w-full flex flex-col ">
                                                    <div class="flex items-center border bg-gray-200 rounded h-7">
                                                        <span class="px-2 bg-gray-200 text-xs">Voucher Narration<span className="text-red-500 "> * </span></span>
                                                        <input type="url" class="flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Voucher Narration"
                                                            value={paymentDesc} onChange={onVoucherNarration} />

                                                    </div>
                                                </div>


                                            </div>
                                        </fieldset>
                                        {/* 18698797 */}
                                        {voucherModeData === "P" ?
                                            <fieldset className="border border-gray-300 rounded-lg">
                                                <legend className="text-xs font-semibold text-gray-700 px-2">Party Details</legend>
                                                <div className="flex w-full space-x-4 ">
                                                    <div className="px-3 w-1/2 flex flex-col">
                                                        <div class="flex items-center border bg-gray-200 rounded h-7">
                                                            <span class="px-2 bg-gray-200 text-xs">Party Type</span>
                                                            <input type="url" class="flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                                placeholder="Party Type"
                                                                disabled={voucherModeData === "P" ? true : false}
                                                                value={getPassForPaymentDataById?.basic?.partyType === "N" ? "None" : getPassForPaymentDataById?.basic?.partyType === "C" ? "Contractor" : getPassForPaymentDataById?.basic?.partyType === "E" ? "Employee" : getPassForPaymentDataById?.basic?.partyType === "J" ? "Job Worker" : getPassForPaymentDataById?.basic?.partyType === "D" ? "Department" : getPassForPaymentDataById?.basic?.partyType === "L" ? "LSG" : getPassForPaymentDataById?.basic?.partyType === "B" ? "Benificiary" : getPassForPaymentDataById?.basic?.partyType === "O" ? "Others" : ""}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="px-1 w-full flex flex-col mb-1">
                                                        <div class="flex items-center bg-gray-200 rounded h-7">
                                                            <span class="px-2 bg-gray-200 text-xs">Party Code & Name</span>
                                                            <input type="url" class="flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                                placeholder="Party Code & Name"
                                                                disabled={voucherModeData === "P" ? true : false}
                                                                value={getPassForPaymentDataById?.basic?.partyCode ? getPassForPaymentDataById?.basic?.partyCode + "-" + getPassForPaymentDataById?.basic?.partyName : ""}

                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex w-full space-x-4 mt-1">
                                                    <div className="px-3 w-1/2 flex flex-col">
                                                        <div class="flex items-center border bg-gray-200 rounded h-7">
                                                            <span class="px-2 bg-gray-200 text-xs">Pay To</span>

                                                            <input type="text" class="flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                                placeholder="Pay to"
                                                                disabled={voucherModeData === "P" ? true : false}
                                                                value={getPassForPaymentDataById?.basic?.payTo}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="px-1 w-full flex flex-col mb-1">
                                                        <div class="flex items-center bg-gray-200 rounded h-7">
                                                            <span class="px-2 bg-gray-200 text-xs">Party Address</span>
                                                            <input type="url" class="flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Party Address"
                                                                disabled={voucherModeData === "P" ? true : false}
                                                                value={getPassForPaymentDataById?.basic?.payAddress}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset> : voucherModeData === "N" && voucherTypeData === "N" && selectedValue2 === "900000001" ?

                                                <fieldset className="border border-gray-300 rounded-lg">
                                                    <legend className="text-xs font-semibold text-gray-700 px-2">Challan Details</legend>
                                                    <div className="flex w-full space-x-4 ">
                                                        <div className="px-3 w-1/2 flex flex-col">
                                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                                <span class="px-2 bg-gray-200 text-xs">Challan No</span>
                                                                <input
                                                                    type="url"
                                                                    className="flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                                    placeholder="Challan No"
                                                                    onChange={onChallanNo}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="w-1/2 flex flex-col" style={{ paddingRight: "10px" }}>
                                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                                <span className="px-1 bg-gray-200 text-xs">Challan By Whom
                                                                    {/* <span className="text-red-500 "> * </span> */}
                                                                </span>


                                                                <input
                                                                    type="url"
                                                                    className="flex-grow text-xs px-2 py-2 h-7 outline-none rounded"
                                                                    placeholder="Challan By Whom"
                                                                    onChange={onChallanByWhom}

                                                                />

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex w-full space-x-4 mt-1">


                                                        <div className="px-3 w-full flex flex-col mb-1">
                                                            <div class="flex items-center bg-gray-200 rounded h-7">
                                                                <span class="px-2 bg-gray-200 text-xs">Challan Whose Behalf</span>
                                                                <input type="url" class="flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Challan Whose Behalf"
                                                                    onChange={onChallanWhoseBehalf}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset> :
                                                <fieldset className="border border-gray-300 rounded-lg">
                                                    <legend className="text-xs font-semibold text-gray-700 px-2">Party Details</legend>
                                                    <div className="flex w-full space-x-4 ">
                                                        <div className="px-3 w-1/2 flex flex-col">
                                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                                <span class="px-2 bg-gray-200 text-xs">Party Type</span>
                                                                <select id="DISTRICT"
                                                                    className="flex-grow text-xs px-2 py-1 h-7 outline-none rounded"
                                                                    onChange={onPartyTypes}
                                                                >
                                                                    <option value="">--Select Party Type--</option>
                                                                    {(voucherModeData !== "P" && voucherModeData !== "R") && (
                                                                        <option value="N">None</option>
                                                                    )}
                                                                    <option value="C">Contractor</option>
                                                                    <option value="E">Employee</option>
                                                                    <option value="J">Job Worker</option>
                                                                    <option value="D">Department</option>
                                                                    <option value="L">LSG</option>
                                                                    <option value="B">Benificiary</option>
                                                                    <option value="O">Others</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="px-2 w-full flex flex-col" style={{ paddingRight: "12px" }}>
                                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                                <span className="px-1 bg-gray-200 text-xs">Party Details<span className="text-red-500 "> * </span></span>
                                                                <div className="w-1/6 flex items-center border bg-gray-200 rounded h-7">
                                                                    <input
                                                                        type="url"
                                                                        className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                                        placeholder="Party Code"
                                                                        value={partyTypes === "C" ? partyName?.contractorId : partyTypes === "E" ? partyName?.empId : partyTypes === "J" ? partyName?.jobWorkerId : partyTypes === "D" ? partyName?.deptId : partyTypes === "L" ? partyName?.lsgCode : ""}
                                                                        disabled
                                                                    />
                                                                </div>

                                                                <input
                                                                    type="url"
                                                                    className="bg-orange-100 flex-grow text-xs px-2 py-2 h-7 outline-none rounded"
                                                                    placeholder="Party Details"
                                                                    value={partyTypes === "C" ? partyName?.contractorNm : partyTypes === "E" ? partyName?.empName : partyTypes === "J" ? partyName?.jobWorkerName : partyTypes === "D" ? partyName?.deptName : partyTypes === "L" ? partyName?.lsgName : ""}
                                                                    disabled
                                                                />
                                                                <button className="px-3 h-7 flex items-center justify-center bg-blue-500 text-white rounded-r" disabled={!partyTypes || partyTypes === "N" || partyTypes === "O"} onClick={onPartyDetails}>
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth="1.5"
                                                                        stroke="currentColor"
                                                                        className="w-4 h-4"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            d="M21 21l-4.35-4.35M18 10.5a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex w-full space-x-4 mt-1">
                                                        <div className="px-3 w-1/2 flex flex-col">
                                                            <div className=" w-full flex flex-col mb-1">
                                                                <div class="flex items-center bg-gray-200 rounded h-7">
                                                                    <span class="px-2 bg-gray-200 text-xs">{voucherModeData === "R" ? "Receipt From" : voucherModeData === "N" ? "Transfer To" : "Pay To"}</span>
                                                                    <input type="url" class="flex-grow text-xs px-4 py-2 h-7 outline-none rounded" placeholder={voucherModeData === "R" ? "Receipt From" : voucherModeData === "N" ? "Transfer To" : "Pay To"}
                                                                        value={payto}
                                                                        onChange={onPayTo}

                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="px-1 w-full flex flex-col mb-1">
                                                            <div class="flex items-center bg-gray-200 rounded h-7">
                                                                <span class="px-2 bg-gray-200 text-xs">Party Address</span>
                                                                <input type="url" class="flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Party Address"
                                                                    value={payAddress}
                                                                    onChange={onPayAddress}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>}
                                    </div>
                                    <div className="col-span-4">
                                        <h2 className="text-red font-bold text-xs text-center">
                                            {getPassForPaymentDataById?.basic?.partyType === "C" ? "CONTRACTOR DETAILS" : getPassForPaymentDataById?.basic?.partyType === "E" ? "EMPLOYEE DETAILS" : "DEDUCTION DETAILS (IF ANY)"}

                                        </h2>
                                        <div className="overflow-y-auto max-h-40 border border-gray-300 rounded-lg">
                                            <table className="w-full  border border-gray-200 rounded-xs">
                                                <thead className="bg-blue-500 text-white text-xs">
                                                    <tr>
                                                        <th className="py-1 px-4 border ">Deduction Account Head</th>
                                                        <th className="py-1 px-4 border">Amount</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getPassForPaymentDataById?.deduct?.map((user, index) => (
                                                        <tr key={index} className="text-center border hover:bg-gray-100 text-xs">
                                                            <td className="py-1 px-4 border">{user.accountDescActual}</td>
                                                            <td className="py-1 px-4 border">{user.deductionAmount}</td>

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>


                                </div>
                                <fieldset className="border border-gray-300 rounded-lg p-1">
                                    <legend className="text-xs font-semibold text-gray-700 px-2">Voucher Reference</legend>

                                    <div className="flex w-full items-center gap-4 px-2">
                                        {/* Radio Buttons Container */}
                                        <div className="flex w-1/2 justify-between">
                                            <label className="flex items-center text-xs w-1/6">
                                                <input
                                                    type="radio"
                                                    value="Add"
                                                    disabled
                                                    className="form-radio text-blue-500 mr-2"
                                                    checked={selectedValue === "900000601" || selectedValue2 === "900000601" || voucherTypeData === "C"}
                                                />
                                                Cash
                                            </label>

                                            <label className="flex items-center text-xs w-1/4">
                                                <input
                                                    type="radio"
                                                    value="Query"
                                                    disabled
                                                    className="form-radio text-blue-500 mr-2"
                                                    checked={matches801}
                                                />
                                                Advance/Adjustment
                                            </label>

                                            <label className="flex items-center text-xs w-1/4">
                                                <input
                                                    type="radio"
                                                    value="Verify"
                                                    disabled
                                                    className="form-radio text-blue-500 mr-2"
                                                    checked={matches901}
                                                />
                                                Cash in Transit
                                            </label>

                                            <label className="flex items-center text-xs w-1/4">
                                                <input
                                                    type="radio"
                                                    value="Delete"
                                                    disabled
                                                    className="form-radio text-blue-500 mr-2"
                                                    checked={matches601}
                                                />
                                                Deduction Deposit
                                            </label>
                                        </div>

                                        {/* Account Head Input */}
                                        <div className="w-1/2">
                                            <div className="flex items-center border bg-gray-200 rounded h-7 ">
                                                <span className="px-2 bg-gray-200 text-xs">Account Head</span>
                                                <input
                                                    type="text"
                                                    className="flex-grow text-xs px-3 h-7 outline-none rounded "
                                                    placeholder="Account Head"
                                                    onChange={onAccountHead}
                                                    value={accountHead}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {headShowDropdown && (
                                        <div className="absolute right-8 z-10  border border-gray-300 rounded shadow-md max-h-30 overflow-y-auto w-[470px]">
                                            {accountHeadAllList.length > 0 ? (
                                                accountHeadAllList.map((d, index) => (
                                                    <div
                                                        key={index}
                                                        className="text-xs w-full px-2 py-2 border border-gray-300 hover:bg-gray-200 cursor-pointer bg-white"
                                                        onClick={() => onAccountHeadType(d)}
                                                    >
                                                        {d?.groupName}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-4 py-2 text-gray-500">No results found</div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex w-full gap-4 mt-2 px-2">
                                        {/* Reference Input */}
                                        <div className="w-1/2">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">
                                                    Ref of {matches801 ? "Advance/Adj" : matches901 ? "Cash in Transit" : matches601 ? "Deduction deposit" : ""}
                                                </span>
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-3 h-7 outline-none rounded "
                                                    disabled
                                                    value={referenceOfDataById}
                                                />

                                            </div>
                                        </div>

                                        <div className="w-1/5">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">

                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-3 h-7 outline-none rounded "
                                                    disabled
                                                    value={referenceOfDataByAmount}
                                                />

                                            </div>
                                        </div>

                                        {/* Search Input */}
                                        <div className="w-2/3">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-3 h-7 outline-none rounded"
                                                    disabled
                                                    value={referenceOfDataByNarration}
                                                />
                                                <button className="px-3 h-7 flex items-center justify-center bg-blue-500 text-white rounded-r" onClick={onReferenceOf}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="w-4 h-4"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M21 21l-4.35-4.35M18 10.5a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>



                                <fieldset className="border border-gray-300 rounded-lg mt-1 p-1">
                                    {/* First Row: 4 Inputs in One Line */}
                                    <div className="flex flex-nowrap gap-x-2 w-full">
                                        {/* Allotment No */}
                                        <div className="w-1/4 flex flex-col">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Allotment No</span>
                                                <input
                                                    type="text"
                                                    className="flex-grow text-xs px-2 h-7 outline-none rounded "
                                                    placeholder="Allotment No"
                                                    value={getPassForPaymentDataById?.basic?.allotmentNo}
                                                    disabled={!(voucherModeData === "R")}
                                                    onChange={onAllotmentNo}
                                                />
                                            </div>
                                        </div>

                                        {/* Conditional Input (Allotment Date or Bill Type) */}
                                        {voucherModeData === "R" || voucherModeData === "N" ? (
                                            <div className="w-1/4 flex flex-col">
                                                <div className="flex items-center bg-gray-200 rounded h-7">
                                                    <span className="px-2 bg-gray-200 text-xs">Allotment Date</span>
                                                    <input type="date" className="flex-grow text-xs px-2 h-7 outline-none rounded " disabled={voucherModeData === "N"} onChange={onAllotmentDate} />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-1/4 flex flex-col">
                                                <div className="flex items-center bg-gray-200 rounded h-7">
                                                    <span className="px-2 bg-gray-200 text-xs">Bill Type</span>
                                                    <input
                                                        type="text"
                                                        className="bg-orange-100 flex-grow text-xs px-2 h-7 outline-none rounded "
                                                        placeholder="Bill Type"
                                                        disabled
                                                        value={
                                                            getPassForPaymentDataById?.basic?.billType == 1
                                                                ? "RA-1"
                                                                : getPassForPaymentDataById?.basic?.billType == 2
                                                                    ? "RA-2"
                                                                    : getPassForPaymentDataById?.basic?.billType == 3
                                                                        ? "Final"
                                                                        : ""
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Schematic Type */}
                                        <div className="w-1/4 flex flex-col">
                                            <div className="flex items-center bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Schematic Type</span>
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-2 h-7 outline-none rounded "
                                                    placeholder="Schematic Type"
                                                    disabled
                                                    value={
                                                        getPassForPaymentDataById?.basic?.schemeType == 1
                                                            ? "Work"
                                                            : getPassForPaymentDataById?.basic?.schemeType == 2
                                                                ? "Non-Work"
                                                                : getPassForPaymentDataById?.basic?.schemeType == 0
                                                                    ? "None"
                                                                    : ""
                                                    }
                                                />
                                            </div>
                                        </div>

                                        {/* Expenditure Type */}
                                        <div className="w-1/4 flex flex-col">
                                            <div className="flex items-center bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Exp Type</span>
                                                <input
                                                    type="text"
                                                    placeholder="Expenditure Type"
                                                    className="bg-orange-100 flex-grow text-xs px-2 h-7 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 "
                                                    disabled
                                                    value={
                                                        getPassForPaymentDataById?.basic?.expType == 1
                                                            ? "Compact"
                                                            : getPassForPaymentDataById?.basic?.expType == 2
                                                                ? "Material"
                                                                : getPassForPaymentDataById?.basic?.expType == 3
                                                                    ? "Wage"
                                                                    : getPassForPaymentDataById?.basic?.expType == 4
                                                                        ? "Contingency"
                                                                        : getPassForPaymentDataById?.basic?.expType == 0
                                                                            ? "Others"
                                                                            : ""
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>


                                    {/* Activity Details in Full Width */}
                                    <div className="flex mt-2 gap-x-2">
                                        {/* First Input Box */}
                                        <div className="w-full flex flex-col">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Activity Details</span>
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-4 h-7 outline-none rounded "
                                                    placeholder="Activity Details"
                                                    disabled
                                                    value={
                                                        getPassForPaymentDataById?.basic?.activityCode
                                                            ? `${getPassForPaymentDataById?.basic?.activityCode} - ${getPassForPaymentDataById?.basic?.activityDesc}`
                                                            : ""
                                                    }
                                                />
                                            </div>
                                        </div>

                                        {/* Second Input Box */}
                                        <div className="w-1/2 flex flex-col">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Allotment/Resolution</span>
                                                <input
                                                    type="file"
                                                    className="flex-grow text-xs outline-none "
                                                    placeholder="Allotment/Resolution"
                                                    onChange={onFile}
                                                    accept="application/pdf"
                                                    style={{ fontSize: "12px", lineHeight: "0.5rem" }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </fieldset>


                            </div>
                            : ""}




                        {/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

                        {pageChange === "Query" ?
                            <div>
                                <fieldset className="border border-gray-300 rounded-lg mb-1">
                                    {/* <legend className="text-lg font-semibold text-gray-700 px-2"></legend> */}
                                    <div className="flex w-full space-x-4 mt-1">
                                        <div className="px-3 w-1/3 flex flex-col mb-1">

                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Voucher ID</span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Voucher ID" disabled value={voucherDataById?.basic?.voucherId} />
                                                <button className="px-3 h-7 flex items-center justify-center bg-blue-500 text-white rounded-r" onClick={onVocuherDetails}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="w-4 h-4"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M21 21l-4.35-4.35M18 10.5a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="px-3 w-1/3 flex flex-col">

                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Voucher Amount</span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Voucher Amount" disabled value={voucherDataById?.basic?.voucherAmount} />

                                            </div>
                                        </div>

                                        <div className="px-3 w-1/3 flex flex-col">

                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Voucher Status</span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Voucher Status" disabled value={voucherDataById?.basic?.voucherVerifyStts} />

                                            </div>
                                        </div>

                                    </div>

                                    <div className="flex w-full space-x-4">
                                        <div className="px-3 w-1/3 flex flex-col">

                                            <div class="flex items-center border bg-gray-200 rounded h-7 mb-1">
                                                <span class="px-2 bg-gray-200 text-xs">Voucher Mode<span className="text-red-500 "> * </span></span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Voucher Mode" disabled value={voucherDataById?.basic?.voucherMode === "R" ? "Receipt" : voucherDataById?.basic?.voucherMode === "P" ? "Payment" : voucherDataById?.basic?.voucherMode === "N" ? "Transfer" : ""} />

                                            </div>
                                        </div>

                                        <div className="px-3 w-1/3 flex flex-col">

                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Pass For Payment ID</span>

                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Pass for payment ID"
                                                    disabled value={voucherDataById?.basic?.pfpId} />


                                            </div>

                                        </div>

                                        <div className="px-3 w-1/3 flex flex-col">
                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Date<span className="text-red-500 "> *</span></span>
                                                <input
                                                    type="text"
                                                    id="txt_dob"
                                                    placeholder="Voucher Date"
                                                    className="bg-orange-100 text-xs border border-gray-300 rounded px-4 py-2 h-7 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                                    disabled
                                                    value={voucherDataById?.basic?.voucherDate}
                                                />
                                                <span class="px-2 bg-gray-200 text-xs">Sub Allotment</span>
                                                <input
                                                    type="checkbox" className="large-checkbox px-2"
                                                    checked={voucherDataById?.basic?.whetherSubAllot === "1" ? true : false}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex w-full space-x-4">
                                        {/* Voucher No */}
                                        <div className="px-3 w-1/3 flex flex-col">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Voucher No</span>
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                    placeholder="Voucher No"
                                                    onChange={onVoucherNo}
                                                    value={voucherDataById?.basic?.voucherNo}

                                                />

                                            </div>
                                        </div>

                                        {/* Voucher Type */}
                                        <div className="px-3 w-1/3 flex flex-col">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Voucher Type<span className="text-red-500 "> * </span></span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Voucher Type" disabled
                                                    value={voucherDataById?.basic?.voucherType === "C" ? "Cash" : voucherDataById?.basic?.voucherType === "B" ? "Bank" : voucherDataById?.basic?.voucherType === "T" ? "Treasury" : voucherDataById?.basic?.voucherType === "J" ? "Journal" : voucherDataById?.basic?.voucherType === "N" ? "Contra" : ""}
                                                />

                                            </div>
                                        </div>

                                        {/* Bank/Treasury */}
                                        <div className="px-3 w-1/3 flex flex-col">
                                            <div className="flex items-center bg-gray-200 rounded h-7 w-full">
                                                <span className="px-2 bg-gray-200 text-xs whitespace-nowrap">
                                                    Bank/Treasury<span className="text-red-500 "> * </span>
                                                </span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Bank/Treasury" disabled
                                                    value={voucherDataById?.basic?.realAccountCodeDesc}
                                                />

                                            </div>

                                        </div>
                                    </div>

                                </fieldset>
                                {voucherDataById?.basic?.voucherMode === "N" ? "" :

                                    <fieldset className="border border-gray-300 rounded-lg mb-1">
                                        <div className="flex w-full space-x-4 mt-1">
                                            <div className="px-3 w-1/2 flex flex-col relative">

                                                <div className="flex items-center border bg-gray-200 rounded h-7">
                                                    <span className="px-2 bg-gray-200 text-xs">GL Group<span className="text-red-500 "> * </span></span>
                                                    <input
                                                        type="url"
                                                        className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                        placeholder="Search GL Group Name..."
                                                        value={voucherDataById?.basic?.glGroupName}
                                                        disabled
                                                    />
                                                </div>


                                            </div>

                                            <div className="w-full flex flex-col mb-1" style={{ paddingRight: "12px" }}>

                                                <div class="flex items-center bg-gray-200 rounded h-7">
                                                    <span class="px-2 bg-gray-200 text-xs">A/C Code Desc<span className="text-red-500 "> * </span></span>
                                                    <input
                                                        type="url"
                                                        className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                        placeholder="A/C Code Desc"
                                                        disabled
                                                        value={voucherDataById?.basic?.nominalAccountCodeDesc}

                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>}

                                <fieldset className="border border-gray-300 rounded-lg ">
                                    <div className="flex w-fullspace-x-4 mt-1">
                                        <div className="px-3 w-1/2 flex flex-col relative">
                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Transfer From (-)</span>
                                                <input
                                                    type="text"
                                                    placeholder="Transfer From (-)"
                                                    // className="flex-grow text-xs px-2 py-1 h-7 outline-none rounded w-full border"
                                                    className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                    disabled
                                                    value={voucherDataById?.basic?.realAccountCodeDesc}

                                                />


                                            </div>
                                        </div>

                                        <div className="px-3 w-1/2 flex flex-col relative">
                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">{voucherDataById?.basic?.voucherType === "J" ? "Transfer To" : "Deposited To (+)"}</span>
                                                <input
                                                    type="text"
                                                    placeholder={voucherTypeData === "J" ? "Transfer To" : "Deposited To (+)"}
                                                    // className="flex-grow text-xs px-2 py-1 h-7 outline-none rounded w-full border"
                                                    className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                    disabled
                                                    value={voucherDataById?.basic?.nominalAccountCodeDesc}

                                                />

                                            </div>
                                        </div>
                                    </div>
                                </fieldset>

                                <fieldset className="border border-gray-300 rounded-lg ">
                                    <legend className="text-xs font-semibold text-gray-700 px-2">Receipt/Payment Instrument Details</legend>
                                    <div className="flex w-full space-x-4 mt-1">
                                        <div className="px-3 w-1/2 flex flex-col">
                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Inst Type</span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Isnt Type" disabled
                                                    value={voucherDataById?.basic?.instrumentType} />

                                            </div>
                                        </div>

                                        <div className="px-1 w-1/2 flex flex-col mb-2">
                                            <div class="flex items-center bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Bank/Try</span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Bank/Try Details" disabled
                                                    value={voucherDataById?.basic?.instrumentDetails} />

                                            </div>
                                        </div>

                                        <div className="px-1 w-1/4 flex flex-col mb-2">
                                            <div class="flex items-center bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">No</span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="No" disabled
                                                    value={voucherDataById?.basic?.instrumentNo} />

                                            </div>
                                        </div>

                                        <div className="px-1 w-1/4 flex flex-col mb-2">
                                            <div class="flex items-center bg-gray-200 rounded h-7 text-xs">
                                                <span class="px-2 bg-gray-200 text-xs">Date</span>
                                                <input
                                                    type="text"
                                                    id="txt_dob"
                                                    placeholder="Instrument Date"
                                                    className="bg-orange-100 text-xs border border-gray-300 rounded px-4 py-2 h-7 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    disabled
                                                    value={voucherDataById?.basic?.instrumentDate}
                                                />
                                            </div>
                                        </div>


                                    </div>
                                </fieldset>


                                <div class="grid grid-cols-12 gap-4">
                                    <div class="col-span-8">
                                        <fieldset className="border border-gray-300 rounded-lg mt-1">
                                            <div className="flex w-full space-x-4 mt-1 mb-1">
                                                <div className="px-3 w-1/3 flex flex-col">
                                                    <div className="flex items-center border bg-gray-200 rounded h-7">
                                                        <span className="px-2 bg-gray-200 text-xs">Gross Amount</span>
                                                        <input
                                                            type="number"
                                                            className="bg-orange-100 flex-grow text-xs px-1 py-1 h-7 outline-none rounded"
                                                            placeholder="Gross Amount"
                                                            disabled
                                                            value={parseFloat(voucherDataById?.basic?.voucherNetAmount) + parseFloat(voucherDataById?.basic?.voucherDeductAmount)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="px-1 w-1/3 flex flex-col">
                                                    <div className="flex items-center border bg-gray-200 rounded h-7">
                                                        <span className="px-2 bg-gray-200 text-xs">Deduct Amount</span>
                                                        <input
                                                            type="number"
                                                            className="bg-orange-100 flex-grow text-xs px-1 py-1 h-7 outline-none rounded"
                                                            placeholder="Deduct Amount"
                                                            disabled
                                                            value={voucherDataById?.basic?.voucherDeductAmount}

                                                        />
                                                    </div>
                                                </div>
                                                <div className="px-1 w-1/3 flex flex-col">
                                                    <div className="flex items-center border bg-gray-200 rounded h-7">
                                                        <span className="px-2 bg-gray-200 text-xs">Net Amount</span>
                                                        <input
                                                            type="number"
                                                            className="bg-orange-100 flex-grow text-xs px-1 py-1 h-7 outline-none rounded"
                                                            placeholder="Net Amount"
                                                            disabled
                                                            value={voucherDataById?.basic?.voucherNetAmount}

                                                        />
                                                    </div>
                                                </div>




                                            </div>

                                        </fieldset>

                                        <fieldset className="border border-gray-300 rounded-lg mt-1">
                                            <div className="flex w-full space-x-4 mt-1 mb-1">
                                                <div className="px-3 w-full flex flex-col ">
                                                    <div class="flex items-center border bg-gray-200 rounded h-7">
                                                        <span class="px-2 bg-gray-200 text-xs">Voucher Narration</span>
                                                        <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Voucher Narration"
                                                            value={voucherDataById?.basic?.voucherNarration}
                                                            disabled />

                                                    </div>
                                                </div>


                                            </div>
                                        </fieldset>
                                        {/* 18698797 */}
                                        {voucherDataById?.basic?.voucherMode === "P" ?
                                            <fieldset className="border border-gray-300 rounded-lg">
                                                <legend className="text-xs font-semibold text-gray-700 px-2">Party Details</legend>
                                                <div className="flex w-full space-x-4 ">
                                                    <div className="px-3 w-1/2 flex flex-col">
                                                        <div class="flex items-center border bg-gray-200 rounded h-7">
                                                            <span class="px-2 bg-gray-200 text-xs">Party Type</span>
                                                            <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                                placeholder="Party Type"
                                                                disabled
                                                                value={voucherDataById?.basic?.partyType === "N" ? "None" : voucherDataById?.basic?.partyType === "C" ? "Contractor" : voucherDataById?.basic?.partyType === "E" ? "Employee" : voucherDataById?.basic?.partyType === "J" ? "Job Worker" : voucherDataById?.basic?.partyType === "D" ? "Department" : voucherDataById?.basic?.partyType === "L" ? "LSG" : voucherDataById?.basic?.partyType === "B" ? "Benificiary" : voucherDataById?.basic?.partyType === "O" ? "Others" : ""}


                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="px-1 w-full flex flex-col mb-1">
                                                        <div class="flex items-center bg-gray-200 rounded h-7">
                                                            <span class="px-2 bg-gray-200 text-xs">Party Code & Name</span>
                                                            <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                                placeholder="Party Code & Name"
                                                                value={voucherDataById?.basic?.partyCode}
                                                                disabled />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex w-full space-x-4 mt-1">
                                                    <div className="px-3 w-1/2 flex flex-col">
                                                        <div class="flex items-center border bg-gray-200 rounded h-7">
                                                            <span class="px-2 bg-gray-200 text-xs">Pay To</span>

                                                            <input type="text" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                                placeholder="Pay to"
                                                                disabled
                                                                value={voucherDataById?.basic?.payTo}

                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="px-1 w-full flex flex-col mb-1">
                                                        <div class="flex items-center bg-gray-200 rounded h-7">
                                                            <span class="px-2 bg-gray-200 text-xs">Party Address</span>
                                                            <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Party Address"
                                                                disabled
                                                                value={voucherDataById?.basic?.partyAddress}

                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset> :

                                            voucherDataById?.basic?.voucherMode === "N" && voucherDataById?.basic?.voucherType === "N" && voucherDataById?.basic?.nominalAccountCode === "900000001" ?


                                                <fieldset className="border border-gray-300 rounded-lg">
                                                    <legend className="text-xs font-semibold text-gray-700 px-2">Challan Details</legend>
                                                    <div className="flex w-full space-x-4 ">
                                                        <div className="px-3 w-1/2 flex flex-col">
                                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                                <span class="px-2 bg-gray-200 text-xs">Challan No</span>
                                                                <input
                                                                    type="url"
                                                                    className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                                    placeholder="Challan No"
                                                                    disabled
                                                                    value={voucherDataById?.basic?.instrumentNo}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="w-1/2 flex flex-col" style={{ paddingRight: "10px" }}>
                                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                                <span className="px-1 bg-gray-200 text-xs">Challan By Whom
                                                                    {/* <span className="text-red-500 "> * </span> */}
                                                                </span>


                                                                <input
                                                                    type="url"
                                                                    className="bg-orange-100 flex-grow text-xs px-2 py-2 h-7 outline-none rounded"
                                                                    placeholder="Challan By Whom"
                                                                    disabled
                                                                    value={voucherDataById?.basic?.byWhom}


                                                                />

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex w-full space-x-4 mt-1">


                                                        <div className="px-3 w-full flex flex-col mb-1">
                                                            <div class="flex items-center bg-gray-200 rounded h-7">
                                                                <span class="px-2 bg-gray-200 text-xs">Challan Whose Behalf</span>
                                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Challan Whose Behalf"
                                                                    disabled
                                                                    value={voucherDataById?.basic?.whoseBehalf}

                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset> :
                                                <fieldset className="border border-gray-300 rounded-lg">
                                                    <legend className="text-xs font-semibold text-gray-700 px-2">Party Details</legend>
                                                    <div className="flex w-full space-x-4 ">
                                                        <div className="px-3 w-1/2 flex flex-col">
                                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                                <span class="px-2 bg-gray-200 text-xs">Party Type</span>
                                                                <input
                                                                    type="url"
                                                                    className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                                    placeholder="Party Type"
                                                                    disabled
                                                                    value={voucherDataById?.basic?.partyType === "N" ? "None" : voucherDataById?.basic?.partyType === "C" ? "Contractor" : voucherDataById?.basic?.partyType === "E" ? "Employee" : voucherDataById?.basic?.partyType === "J" ? "Job Worker" : voucherDataById?.basic?.partyType === "D" ? "Department" : voucherDataById?.basic?.partyType === "L" ? "LSG" : voucherDataById?.basic?.partyType === "B" ? "Benificiary" : voucherDataById?.basic?.partyType === "O" ? "Others" : ""}

                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="px-2 w-full flex flex-col" style={{ paddingRight: "12px" }}>
                                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                                <span className="px-1 bg-gray-200 text-xs">Party Details<span className="text-red-500 "> * </span></span>
                                                                <div className="w-1/6 flex items-center border bg-gray-200 rounded h-7">
                                                                    <input
                                                                        type="url"
                                                                        className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                                        placeholder="Party Code"
                                                                        disabled
                                                                        value={voucherDataById?.basic?.partyCode}

                                                                    />
                                                                </div>

                                                                <input
                                                                    type="url"
                                                                    className="bg-orange-100 flex-grow text-xs px-2 py-2 h-7 outline-none rounded"
                                                                    placeholder="Party Details"
                                                                    disabled
                                                                    value={voucherDataById?.basic?.payTo}

                                                                />

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex w-full space-x-4 mt-1">
                                                        <div className="px-3 w-1/2 flex flex-col">
                                                            <div className=" w-full flex flex-col mb-1">
                                                                <div class="flex items-center bg-gray-200 rounded h-7">
                                                                    <span class="px-2 bg-gray-200 text-xs">{voucherDataById?.basic?.voucherMode === "R" ? "Receipt From" : voucherDataById?.basic?.voucherMode === "N" ? "Transfer To" : "Pay To"}</span>
                                                                    <input type="url" class="bg-orange-100 flex-grow text-xs px-4 py-2 h-7 outline-none rounded" placeholder={voucherDataById?.basic?.voucherMode === "R" ? "Receipt From" : voucherDataById?.basic?.voucherMode === "N" ? "Transfer To" : "Pay To"}
                                                                        disabled value={voucherDataById?.basic?.payTo}

                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="px-1 w-full flex flex-col mb-1">
                                                            <div class="flex items-center bg-gray-200 rounded h-7">
                                                                <span class="px-2 bg-gray-200 text-xs">Party Address</span>
                                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Party Address"
                                                                    disabled value={voucherDataById?.basic?.partyAddress}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>}
                                    </div>
                                    <div className="col-span-4">
                                        <h2 className="text-red font-bold text-xs text-center">
                                            {voucherDataById?.basic?.partyType === "C" ? "CONTRACTOR DETAILS" : voucherDataById?.basic?.partyType === "E" ? "EMPLOYEE DETAILS" : "DEDUCTION DETAILS (IF ANY)"}

                                        </h2>
                                        <div className="overflow-y-auto max-h-40 border border-gray-300 rounded-lg">
                                            <table className="w-full  border border-gray-200 rounded-xs">
                                                <thead className="bg-blue-500 text-white text-xs">
                                                    <tr>
                                                        <th className="py-1 px-4 border ">Deduction Account Head</th>
                                                        <th className="py-1 px-4 border">Amount</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {voucherDataById?.deduct?.map((user, index) => (
                                                        <tr key={index} className="text-center border hover:bg-gray-100 text-xs">
                                                            <td className="py-1 px-4 border">{user.accountDescActual}</td>
                                                            <td className="py-1 px-4 border">{user.deductionAmount}</td>

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>


                                </div>
                                <fieldset className="border border-gray-300 rounded-lg p-1">
                                    <legend className="text-xs font-semibold text-gray-700 px-2">Voucher Reference</legend>

                                    <div className="flex w-full items-center gap-4 px-2">
                                        {/* Radio Buttons Container */}
                                        <div className="flex w-1/2 justify-between">
                                            <label className="flex items-center text-xs w-1/6">
                                                <input
                                                    type="radio"
                                                    value="Add"
                                                    disabled
                                                    className="form-radio text-blue-500 mr-2"
                                                    checked={voucherDataById?.basic?.flagCash === "1"}
                                                />
                                                Cash
                                            </label>

                                            <label className="flex items-center text-xs w-1/4">
                                                <input
                                                    type="radio"
                                                    value="Query"
                                                    disabled
                                                    className="form-radio text-blue-500 mr-2"
                                                    checked={voucherDataById?.basic?.flagAdvance === "1"}
                                                />
                                                Advance/Adjustment
                                            </label>

                                            <label className="flex items-center text-xs w-1/4">
                                                <input
                                                    type="radio"
                                                    value="Verify"
                                                    disabled
                                                    className="form-radio text-blue-500 mr-2"
                                                    checked={voucherDataById?.basic?.flagTransit === "1"}
                                                />
                                                Cash in Transit
                                            </label>

                                            <label className="flex items-center text-xs w-1/4">
                                                <input
                                                    type="radio"
                                                    value="Delete"
                                                    disabled
                                                    className="form-radio text-blue-500 mr-2"
                                                    checked={voucherDataById?.basic?.flagDeduct === "1"}
                                                />
                                                Deduction Deposit
                                            </label>
                                        </div>

                                        {/* Account Head Input */}
                                        <div className="w-1/2">
                                            <div className="flex items-center border bg-gray-200 rounded h-7 ">
                                                <span className="px-2 bg-gray-200 text-xs">Account Head</span>
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-3 h-7 outline-none rounded "
                                                    placeholder="Account Head"
                                                    disabled
                                                    value={voucherDataById?.basic?.glGroupName}
                                                />
                                            </div>
                                        </div>
                                    </div>



                                    <div className="flex w-full gap-4 mt-2 px-2">
                                        {/* Reference Input */}
                                        <div className="w-1/2">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">
                                                    Ref of {voucherDataById?.basic?.flagAdvance === "1" ? "Advance/Adj" : voucherDataById?.basic?.flagTransit === "1" ? "Cash in Transit" : voucherDataById?.basic?.flagDeduct === "1" ? "Deduction deposit" : ""}
                                                </span>
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-3 h-7 outline-none rounded "
                                                    disabled

                                                />

                                            </div>
                                        </div>

                                        <div className="w-1/5">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">

                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-3 h-7 outline-none rounded "
                                                    disabled

                                                />

                                            </div>
                                        </div>

                                        {/* Search Input */}
                                        <div className="w-2/3">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-3 h-7 outline-none rounded"
                                                    disabled

                                                />

                                            </div>
                                        </div>
                                    </div>
                                </fieldset>



                                <fieldset className="border border-gray-300 rounded-lg mt-1 p-1">
                                    {/* First Row: 4 Inputs in One Line */}
                                    <div className="flex flex-nowrap gap-x-2 w-full">
                                        {/* Allotment No */}
                                        <div className="w-1/4 flex flex-col">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Allotment No</span>
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-2 h-7 outline-none rounded "
                                                    placeholder="Allotment No"
                                                    disabled
                                                    value={voucherDataById?.basic?.allotmentNo}
                                                />
                                            </div>
                                        </div>

                                        {/* Conditional Input (Allotment Date or Bill Type) */}
                                        {voucherDataById?.basic?.voucherMode === "R" || voucherDataById?.basic?.voucherMode === "N" ? (
                                            <div className="w-1/4 flex flex-col">
                                                <div className="flex items-center bg-gray-200 rounded h-7">
                                                    <span className="px-2 bg-gray-200 text-xs">Allotment Date</span>
                                                    <input type="date" className="bg-orange-100 flex-grow text-xs px-2 h-7 outline-none rounded " disabled value={voucherDataById?.basic?.allotmentDate} />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-1/4 flex flex-col">
                                                <div className="flex items-center bg-gray-200 rounded h-7">
                                                    <span className="px-2 bg-gray-200 text-xs">Bill Type</span>
                                                    <input
                                                        type="text"
                                                        className="bg-orange-100 flex-grow text-xs px-2 h-7 outline-none rounded "
                                                        placeholder="Bill Type"
                                                        disabled
                                                        value={voucherDataById?.basic?.billType}

                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Schematic Type */}
                                        <div className="w-1/4 flex flex-col">
                                            <div className="flex items-center bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Schematic Type</span>
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-2 h-7 outline-none rounded "
                                                    placeholder="Schematic Type"
                                                    disabled


                                                />
                                            </div>
                                        </div>

                                        {/* Expenditure Type */}
                                        <div className="w-1/4 flex flex-col">
                                            <div className="flex items-center bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Exp Type</span>
                                                <input
                                                    type="text"
                                                    placeholder="Expenditure Type"
                                                    className="bg-orange-100 flex-grow text-xs px-2 h-7 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 "
                                                    disabled

                                                />
                                            </div>
                                        </div>
                                    </div>


                                    {/* Activity Details in Full Width */}
                                    <div className="flex mt-2 gap-x-2">
                                        {/* First Input Box */}
                                        <div className="w-full flex flex-col">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Activity Details</span>
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-4 h-7 outline-none rounded "
                                                    placeholder="Activity Details"
                                                    disabled

                                                />
                                            </div>
                                        </div>

                                        {/* Second Input Box */}
                                        <div className="w-1/2 ">
                                            <button
                                                // onClick={() => window.open("https://javaapi.wbpms.in/" + getPassForPaymentDataById?.basic?.docFile)}
                                                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                                                title="View PDF"
                                                disabled={!getPassForPaymentDataById?.basic?.docFile}
                                            >

                                                <FontAwesomeIcon icon={faEye} title="View File" />

                                            </button>
                                        </div>
                                    </div>

                                </fieldset>


                            </div>

                            : ""}


                        {pageChange === "Delete" ?
                            <div>
                                <fieldset className="border border-gray-300 rounded-lg mb-1">
                                    {/* <legend className="text-lg font-semibold text-gray-700 px-2"></legend> */}
                                    <div className="flex w-full space-x-4 mt-1">
                                        <div className="px-3 w-1/3 flex flex-col mb-1">

                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Voucher ID</span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Voucher ID" disabled value={voucherDataById?.basic?.voucherId} />
                                                <button className="px-3 h-7 flex items-center justify-center bg-blue-500 text-white rounded-r" onClick={onVocuherDetails}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="w-4 h-4"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M21 21l-4.35-4.35M18 10.5a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="px-3 w-1/3 flex flex-col">

                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Voucher Amount</span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Voucher Amount" disabled value={voucherDataById?.basic?.voucherAmount} />

                                            </div>
                                        </div>

                                        <div className="px-3 w-1/3 flex flex-col">

                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Voucher Status</span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Voucher Status" disabled value={voucherDataById?.basic?.voucherVerifyStts} />

                                            </div>
                                        </div>

                                    </div>

                                    <div className="flex w-full space-x-4">
                                        <div className="px-3 w-1/3 flex flex-col">

                                            <div class="flex items-center border bg-gray-200 rounded h-7 mb-1">
                                                <span class="px-2 bg-gray-200 text-xs">Voucher Mode<span className="text-red-500 "> * </span></span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Voucher Mode" disabled value={voucherDataById?.basic?.voucherMode === "R" ? "Receipt" : voucherDataById?.basic?.voucherMode === "P" ? "Payment" : voucherDataById?.basic?.voucherMode === "N" ? "Transfer" : ""} />

                                            </div>
                                        </div>

                                        <div className="px-3 w-1/3 flex flex-col">

                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Pass For Payment ID</span>

                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Pass for payment ID"
                                                    disabled value={voucherDataById?.basic?.pfpId} />


                                            </div>

                                        </div>

                                        <div className="px-3 w-1/3 flex flex-col">
                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Date<span className="text-red-500 "> *</span></span>
                                                <input
                                                    type="text"
                                                    id="txt_dob"
                                                    placeholder="Voucher Date"
                                                    className="bg-orange-100 text-xs border border-gray-300 rounded px-4 py-2 h-7 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                                    disabled
                                                    value={voucherDataById?.basic?.voucherDate}
                                                />
                                                <span class="px-2 bg-gray-200 text-xs">Sub Allotment</span>
                                                <input
                                                    type="checkbox" className="large-checkbox px-2"
                                                    checked={voucherDataById?.basic?.whetherSubAllot === "1" ? true : false}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex w-full space-x-4">
                                        {/* Voucher No */}
                                        <div className="px-3 w-1/3 flex flex-col">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Voucher No</span>
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                    placeholder="Voucher No"
                                                    onChange={onVoucherNo}
                                                    disabled
                                                    value={voucherDataById?.basic?.voucherNo}

                                                />
                                            </div>
                                        </div>

                                        {/* Voucher Type */}
                                        <div className="px-3 w-1/3 flex flex-col">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Voucher Type<span className="text-red-500 "> * </span></span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Voucher Type" disabled
                                                    value={voucherDataById?.basic?.voucherType === "C" ? "Cash" : voucherDataById?.basic?.voucherType === "B" ? "Bank" : voucherDataById?.basic?.voucherType === "T" ? "Treasury" : voucherDataById?.basic?.voucherType === "J" ? "Journal" : voucherDataById?.basic?.voucherType === "N" ? "Contra" : ""}
                                                />

                                            </div>
                                        </div>

                                        {/* Bank/Treasury */}
                                        <div className="px-3 w-1/3 flex flex-col">
                                            <div className="flex items-center bg-gray-200 rounded h-7 w-full">
                                                <span className="px-2 bg-gray-200 text-xs whitespace-nowrap">
                                                    Bank/Treasury<span className="text-red-500 "> * </span>
                                                </span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Bank/Treasury" disabled
                                                    value={voucherDataById?.basic?.realAccountCodeDesc}
                                                />

                                            </div>

                                        </div>
                                    </div>

                                </fieldset>
                                {voucherDataById?.basic?.voucherMode === "N" ? "" :

                                    <fieldset className="border border-gray-300 rounded-lg mb-1">
                                        <div className="flex w-full space-x-4 mt-1">
                                            <div className="px-3 w-1/2 flex flex-col relative">

                                                <div className="flex items-center border bg-gray-200 rounded h-7">
                                                    <span className="px-2 bg-gray-200 text-xs">GL Group<span className="text-red-500 "> * </span></span>
                                                    <input
                                                        type="url"
                                                        className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                        placeholder="Search GL Group Name..."
                                                        value={voucherDataById?.basic?.glGroupName}
                                                        disabled
                                                    />
                                                </div>


                                            </div>

                                            <div className="w-full flex flex-col mb-1" style={{ paddingRight: "12px" }}>

                                                <div class="flex items-center bg-gray-200 rounded h-7">
                                                    <span class="px-2 bg-gray-200 text-xs">A/C Code Desc<span className="text-red-500 "> * </span></span>
                                                    <input
                                                        type="url"
                                                        className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                        placeholder="A/C Code Desc"
                                                        disabled
                                                        value={voucherDataById?.basic?.nominalAccountCodeDesc}

                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>}

                                <fieldset className="border border-gray-300 rounded-lg ">
                                    <div className="flex w-fullspace-x-4 mt-1">
                                        <div className="px-3 w-1/2 flex flex-col relative">
                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Transfer From (-)</span>
                                                <input
                                                    type="text"
                                                    placeholder="Transfer From (-)"
                                                    // className="flex-grow text-xs px-2 py-1 h-7 outline-none rounded w-full border"
                                                    className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                    disabled
                                                    value={voucherDataById?.basic?.realAccountCodeDesc}

                                                />


                                            </div>
                                        </div>

                                        <div className="px-3 w-1/2 flex flex-col relative">
                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">{voucherDataById?.basic?.voucherType === "J" ? "Transfer To" : "Deposited To (+)"}</span>
                                                <input
                                                    type="text"
                                                    placeholder={voucherTypeData === "J" ? "Transfer To" : "Deposited To (+)"}
                                                    // className="flex-grow text-xs px-2 py-1 h-7 outline-none rounded w-full border"
                                                    className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                    disabled
                                                    value={voucherDataById?.basic?.nominalAccountCodeDesc}

                                                />

                                            </div>
                                        </div>
                                    </div>
                                </fieldset>

                                <fieldset className="border border-gray-300 rounded-lg ">
                                    <legend className="text-xs font-semibold text-gray-700 px-2">Receipt/Payment Instrument Details</legend>
                                    <div className="flex w-full space-x-4 mt-1">
                                        <div className="px-3 w-1/2 flex flex-col">
                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Inst Type</span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Isnt Type" disabled
                                                    value={voucherDataById?.basic?.instrumentType} />

                                            </div>
                                        </div>

                                        <div className="px-1 w-1/2 flex flex-col mb-2">
                                            <div class="flex items-center bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Bank/Try</span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Bank/Try Details" disabled
                                                    value={voucherDataById?.basic?.instrumentDetails} />

                                            </div>
                                        </div>

                                        <div className="px-1 w-1/4 flex flex-col mb-2">
                                            <div class="flex items-center bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">No</span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="No" disabled
                                                    value={voucherDataById?.basic?.instrumentNo} />

                                            </div>
                                        </div>

                                        <div className="px-1 w-1/4 flex flex-col mb-2">
                                            <div class="flex items-center bg-gray-200 rounded h-7 text-xs">
                                                <span class="px-2 bg-gray-200 text-xs">Date</span>
                                                <input
                                                    type="text"
                                                    id="txt_dob"
                                                    placeholder="Instrument Date"
                                                    className="bg-orange-100 text-xs border border-gray-300 rounded px-4 py-2 h-7 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    disabled
                                                    value={voucherDataById?.basic?.instrumentDate}
                                                />
                                            </div>
                                        </div>


                                    </div>
                                </fieldset>


                                <div class="grid grid-cols-12 gap-4">
                                    <div class="col-span-8">
                                        <fieldset className="border border-gray-300 rounded-lg mt-1">
                                            <div className="flex w-full space-x-4 mt-1 mb-1">
                                                <div className="px-3 w-1/3 flex flex-col">
                                                    <div className="flex items-center border bg-gray-200 rounded h-7">
                                                        <span className="px-2 bg-gray-200 text-xs">Gross Amount</span>
                                                        <input
                                                            type="number"
                                                            className="bg-orange-100 flex-grow text-xs px-1 py-1 h-7 outline-none rounded"
                                                            placeholder="Gross Amount"
                                                            disabled
                                                            value={parseFloat(voucherDataById?.basic?.voucherNetAmount) + parseFloat(voucherDataById?.basic?.voucherDeductAmount)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="px-1 w-1/3 flex flex-col">
                                                    <div className="flex items-center border bg-gray-200 rounded h-7">
                                                        <span className="px-2 bg-gray-200 text-xs">Deduct Amount</span>
                                                        <input
                                                            type="number"
                                                            className="bg-orange-100 flex-grow text-xs px-1 py-1 h-7 outline-none rounded"
                                                            placeholder="Deduct Amount"
                                                            disabled
                                                            value={voucherDataById?.basic?.voucherDeductAmount}

                                                        />
                                                    </div>
                                                </div>
                                                <div className="px-1 w-1/3 flex flex-col">
                                                    <div className="flex items-center border bg-gray-200 rounded h-7">
                                                        <span className="px-2 bg-gray-200 text-xs">Net Amount</span>
                                                        <input
                                                            type="number"
                                                            className="bg-orange-100 flex-grow text-xs px-1 py-1 h-7 outline-none rounded"
                                                            placeholder="Net Amount"
                                                            disabled
                                                            value={voucherDataById?.basic?.voucherNetAmount}

                                                        />
                                                    </div>
                                                </div>




                                            </div>

                                        </fieldset>

                                        <fieldset className="border border-gray-300 rounded-lg mt-1">
                                            <div className="flex w-full space-x-4 mt-1 mb-1">
                                                <div className="px-3 w-full flex flex-col ">
                                                    <div class="flex items-center border bg-gray-200 rounded h-7">
                                                        <span class="px-2 bg-gray-200 text-xs">Voucher Narration</span>
                                                        <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Voucher Narration"
                                                            value={voucherDataById?.basic?.voucherNarration}
                                                            disabled />

                                                    </div>
                                                </div>


                                            </div>
                                        </fieldset>
                                        {/* 18698797 */}
                                        {voucherDataById?.basic?.voucherMode === "P" ?
                                            <fieldset className="border border-gray-300 rounded-lg">
                                                <legend className="text-xs font-semibold text-gray-700 px-2">Party Details</legend>
                                                <div className="flex w-full space-x-4 ">
                                                    <div className="px-3 w-1/2 flex flex-col">
                                                        <div class="flex items-center border bg-gray-200 rounded h-7">
                                                            <span class="px-2 bg-gray-200 text-xs">Party Type</span>
                                                            <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                                placeholder="Party Type"
                                                                disabled
                                                                value={voucherDataById?.basic?.partyType}

                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="px-1 w-full flex flex-col mb-1">
                                                        <div class="flex items-center bg-gray-200 rounded h-7">
                                                            <span class="px-2 bg-gray-200 text-xs">Party Code & Name</span>
                                                            <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                                placeholder="Party Code & Name"
                                                                value={voucherDataById?.basic?.partyCode}
                                                                disabled />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex w-full space-x-4 mt-1">
                                                    <div className="px-3 w-1/2 flex flex-col">
                                                        <div class="flex items-center border bg-gray-200 rounded h-7">
                                                            <span class="px-2 bg-gray-200 text-xs">Pay To</span>

                                                            <input type="text" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                                placeholder="Pay to"
                                                                disabled
                                                                value={voucherDataById?.basic?.payTo}

                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="px-1 w-full flex flex-col mb-1">
                                                        <div class="flex items-center bg-gray-200 rounded h-7">
                                                            <span class="px-2 bg-gray-200 text-xs">Party Address</span>
                                                            <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Party Address"
                                                                disabled
                                                                value={voucherDataById?.basic?.partyAddress}

                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset> :

                                            voucherDataById?.basic?.voucherMode === "N" && voucherDataById?.basic?.voucherType === "N" && voucherDataById?.basic?.nominalAccountCode === "900000001" ?


                                                <fieldset className="border border-gray-300 rounded-lg">
                                                    <legend className="text-xs font-semibold text-gray-700 px-2">Challan Details</legend>
                                                    <div className="flex w-full space-x-4 ">
                                                        <div className="px-3 w-1/2 flex flex-col">
                                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                                <span class="px-2 bg-gray-200 text-xs">Challan No</span>
                                                                <input
                                                                    type="url"
                                                                    className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                                    placeholder="Challan No"
                                                                    disabled
                                                                    value={voucherDataById?.basic?.instrumentNo}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="w-1/2 flex flex-col" style={{ paddingRight: "10px" }}>
                                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                                <span className="px-1 bg-gray-200 text-xs">Challan By Whom
                                                                    {/* <span className="text-red-500 "> * </span> */}
                                                                </span>


                                                                <input
                                                                    type="url"
                                                                    className="bg-orange-100 flex-grow text-xs px-2 py-2 h-7 outline-none rounded"
                                                                    placeholder="Challan By Whom"
                                                                    disabled
                                                                    value={voucherDataById?.basic?.byWhom}


                                                                />

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex w-full space-x-4 mt-1">


                                                        <div className="px-3 w-full flex flex-col mb-1">
                                                            <div class="flex items-center bg-gray-200 rounded h-7">
                                                                <span class="px-2 bg-gray-200 text-xs">Challan Whose Behalf</span>
                                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Challan Whose Behalf"
                                                                    disabled
                                                                    value={voucherDataById?.basic?.whoseBehalf}

                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset> :
                                                <fieldset className="border border-gray-300 rounded-lg">
                                                    <legend className="text-xs font-semibold text-gray-700 px-2">Party Details</legend>
                                                    <div className="flex w-full space-x-4 ">
                                                        <div className="px-3 w-1/2 flex flex-col">
                                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                                <span class="px-2 bg-gray-200 text-xs">Party Type</span>
                                                                <input
                                                                    type="url"
                                                                    className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                                    placeholder="Party Type"
                                                                    disabled
                                                                    value={voucherDataById?.basic?.partyType}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="px-2 w-full flex flex-col" style={{ paddingRight: "12px" }}>
                                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                                <span className="px-1 bg-gray-200 text-xs">Party Details<span className="text-red-500 "> * </span></span>
                                                                <div className="w-1/6 flex items-center border bg-gray-200 rounded h-7">
                                                                    <input
                                                                        type="url"
                                                                        className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                                        placeholder="Party Code"
                                                                        disabled
                                                                        value={voucherDataById?.basic?.partyCode}

                                                                    />
                                                                </div>

                                                                <input
                                                                    type="url"
                                                                    className="bg-orange-100 flex-grow text-xs px-2 py-2 h-7 outline-none rounded"
                                                                    placeholder="Party Details"
                                                                    disabled
                                                                    value={voucherDataById?.basic?.payTo}

                                                                />

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex w-full space-x-4 mt-1">
                                                        <div className="px-3 w-1/2 flex flex-col">
                                                            <div className=" w-full flex flex-col mb-1">
                                                                <div class="flex items-center bg-gray-200 rounded h-7">
                                                                    <span class="px-2 bg-gray-200 text-xs">{voucherDataById?.basic?.voucherMode === "R" ? "Receipt From" : voucherDataById?.basic?.voucherMode === "N" ? "Transfer To" : "Pay To"}</span>
                                                                    <input type="url" class="bg-orange-100 flex-grow text-xs px-4 py-2 h-7 outline-none rounded" placeholder={voucherDataById?.basic?.voucherMode === "R" ? "Receipt From" : voucherDataById?.basic?.voucherMode === "N" ? "Transfer To" : "Pay To"}
                                                                        disabled value={voucherDataById?.basic?.payTo}

                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="px-1 w-full flex flex-col mb-1">
                                                            <div class="flex items-center bg-gray-200 rounded h-7">
                                                                <span class="px-2 bg-gray-200 text-xs">Party Address</span>
                                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Party Address"
                                                                    disabled value={voucherDataById?.basic?.partyAddress}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>}
                                    </div>
                                    <div className="col-span-4">
                                        <h2 className="text-red font-bold text-xs text-center">
                                            {voucherDataById?.basic?.partyType === "C" ? "CONTRACTOR DETAILS" : voucherDataById?.basic?.partyType === "E" ? "EMPLOYEE DETAILS" : "DEDUCTION DETAILS (IF ANY)"}

                                        </h2>
                                        <div className="overflow-y-auto max-h-40 border border-gray-300 rounded-lg">
                                            <table className="w-full  border border-gray-200 rounded-xs">
                                                <thead className="bg-blue-500 text-white text-xs">
                                                    <tr>
                                                        <th className="py-1 px-4 border ">Deduction Account Head</th>
                                                        <th className="py-1 px-4 border">Amount</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {voucherDataById?.deduct?.map((user, index) => (
                                                        <tr key={index} className="text-center border hover:bg-gray-100 text-xs">
                                                            <td className="py-1 px-4 border">{user.accountDescActual}</td>
                                                            <td className="py-1 px-4 border">{user.deductionAmount}</td>

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>


                                </div>
                                <fieldset className="border border-gray-300 rounded-lg p-1">
                                    <legend className="text-xs font-semibold text-gray-700 px-2">Voucher Reference</legend>

                                    <div className="flex w-full items-center gap-4 px-2">
                                        {/* Radio Buttons Container */}
                                        <div className="flex w-1/2 justify-between">
                                            <label className="flex items-center text-xs w-1/6">
                                                <input
                                                    type="radio"
                                                    value="Add"
                                                    disabled
                                                    className="form-radio text-blue-500 mr-2"
                                                    checked={voucherDataById?.basic?.flagCash === "1"}
                                                />
                                                Cash
                                            </label>

                                            <label className="flex items-center text-xs w-1/4">
                                                <input
                                                    type="radio"
                                                    value="Query"
                                                    disabled
                                                    className="form-radio text-blue-500 mr-2"
                                                    checked={voucherDataById?.basic?.flagAdvance === "1"}
                                                />
                                                Advance/Adjustment
                                            </label>

                                            <label className="flex items-center text-xs w-1/4">
                                                <input
                                                    type="radio"
                                                    value="Verify"
                                                    disabled
                                                    className="form-radio text-blue-500 mr-2"
                                                    checked={voucherDataById?.basic?.flagTransit === "1"}
                                                />
                                                Cash in Transit
                                            </label>

                                            <label className="flex items-center text-xs w-1/4">
                                                <input
                                                    type="radio"
                                                    value="Delete"
                                                    disabled
                                                    className="form-radio text-blue-500 mr-2"
                                                    checked={voucherDataById?.basic?.flagDeduct === "1"}
                                                />
                                                Deduction Deposit
                                            </label>
                                        </div>

                                        {/* Account Head Input */}
                                        <div className="w-1/2">
                                            <div className="flex items-center border bg-gray-200 rounded h-7 ">
                                                <span className="px-2 bg-gray-200 text-xs">Account Head</span>
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-3 h-7 outline-none rounded "
                                                    placeholder="Account Head"
                                                    disabled
                                                    value={voucherDataById?.basic?.glGroupName}
                                                />
                                            </div>
                                        </div>
                                    </div>



                                    <div className="flex w-full gap-4 mt-2 px-2">
                                        {/* Reference Input */}
                                        <div className="w-1/2">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">
                                                    Ref of {voucherDataById?.basic?.flagAdvance === "1" ? "Advance/Adj" : voucherDataById?.basic?.flagTransit === "1" ? "Cash in Transit" : voucherDataById?.basic?.flagDeduct === "1" ? "Deduction deposit" : ""}
                                                </span>
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-3 h-7 outline-none rounded "
                                                    disabled

                                                />

                                            </div>
                                        </div>

                                        <div className="w-1/5">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">

                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-3 h-7 outline-none rounded "
                                                    disabled

                                                />

                                            </div>
                                        </div>

                                        {/* Search Input */}
                                        <div className="w-2/3">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-3 h-7 outline-none rounded"
                                                    disabled

                                                />

                                            </div>
                                        </div>
                                    </div>
                                </fieldset>



                                <fieldset className="border border-gray-300 rounded-lg mt-1 p-1">
                                    {/* First Row: 4 Inputs in One Line */}
                                    <div className="flex flex-nowrap gap-x-2 w-full">
                                        {/* Allotment No */}
                                        <div className="w-1/4 flex flex-col">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Allotment No</span>
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-2 h-7 outline-none rounded "
                                                    placeholder="Allotment No"
                                                    disabled
                                                    value={voucherDataById?.basic?.allotmentNo}
                                                />
                                            </div>
                                        </div>

                                        {/* Conditional Input (Allotment Date or Bill Type) */}
                                        {voucherDataById?.basic?.voucherMode === "R" || voucherDataById?.basic?.voucherMode === "N" ? (
                                            <div className="w-1/4 flex flex-col">
                                                <div className="flex items-center bg-gray-200 rounded h-7">
                                                    <span className="px-2 bg-gray-200 text-xs">Allotment Date</span>
                                                    <input type="date" className="bg-orange-100 flex-grow text-xs px-2 h-7 outline-none rounded " disabled value={voucherDataById?.basic?.allotmentDate} />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-1/4 flex flex-col">
                                                <div className="flex items-center bg-gray-200 rounded h-7">
                                                    <span className="px-2 bg-gray-200 text-xs">Bill Type</span>
                                                    <input
                                                        type="text"
                                                        className="bg-orange-100 flex-grow text-xs px-2 h-7 outline-none rounded "
                                                        placeholder="Bill Type"
                                                        disabled
                                                        value={voucherDataById?.basic?.billType}

                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Schematic Type */}
                                        <div className="w-1/4 flex flex-col">
                                            <div className="flex items-center bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Schematic Type</span>
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-2 h-7 outline-none rounded "
                                                    placeholder="Schematic Type"
                                                    disabled


                                                />
                                            </div>
                                        </div>

                                        {/* Expenditure Type */}
                                        <div className="w-1/4 flex flex-col">
                                            <div className="flex items-center bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Exp Type</span>
                                                <input
                                                    type="text"
                                                    placeholder="Expenditure Type"
                                                    className="bg-orange-100 flex-grow text-xs px-2 h-7 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 "
                                                    disabled

                                                />
                                            </div>
                                        </div>
                                    </div>


                                    {/* Activity Details in Full Width */}
                                    <div className="flex mt-2 gap-x-2">
                                        {/* First Input Box */}
                                        <div className="w-full flex flex-col">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Activity Details</span>
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-4 h-7 outline-none rounded "
                                                    placeholder="Activity Details"
                                                    disabled

                                                />
                                            </div>
                                        </div>

                                        {/* Second Input Box */}
                                        <div className="w-1/2 ">
                                            <button
                                                // onClick={() => window.open("https://javaapi.wbpms.in/" + getPassForPaymentDataById?.basic?.docFile)}
                                                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                                                title="View PDF"
                                                disabled={!getPassForPaymentDataById?.basic?.docFile}
                                            >

                                                <FontAwesomeIcon icon={faEye} title="View File" />

                                            </button>
                                        </div>
                                    </div>

                                </fieldset>


                            </div>

                            : ""}

                        {pageChange === "Verify" ?
                            <div>
                                <fieldset className="border border-gray-300 rounded-lg mb-1">
                                    {/* <legend className="text-lg font-semibold text-gray-700 px-2"></legend> */}
                                    <div className="flex w-full space-x-4 mt-1">
                                        <div className="px-3 w-1/3 flex flex-col mb-1">

                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Voucher ID</span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Voucher ID" disabled value={voucherDataById?.basic?.voucherId} />
                                                <button className="px-3 h-7 flex items-center justify-center bg-blue-500 text-white rounded-r" onClick={onVocuherDetails}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="w-4 h-4"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M21 21l-4.35-4.35M18 10.5a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="px-3 w-1/3 flex flex-col">

                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Voucher Amount</span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Voucher Amount" disabled value={voucherDataById?.basic?.voucherAmount} />

                                            </div>
                                        </div>

                                        <div className="px-3 w-1/3 flex flex-col">

                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Voucher Status</span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Voucher Status" disabled value={voucherDataById?.basic?.voucherVerifyStts} />

                                            </div>
                                        </div>

                                    </div>

                                    <div className="flex w-full space-x-4">
                                        <div className="px-3 w-1/3 flex flex-col">

                                            <div class="flex items-center border bg-gray-200 rounded h-7 mb-1">
                                                <span class="px-2 bg-gray-200 text-xs">Voucher Mode<span className="text-red-500 "> * </span></span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Voucher Mode" disabled value={voucherDataById?.basic?.voucherMode === "R" ? "Receipt" : voucherDataById?.basic?.voucherMode === "P" ? "Payment" : voucherDataById?.basic?.voucherMode === "N" ? "Transfer" : ""} />

                                            </div>
                                        </div>

                                        <div className="px-3 w-1/3 flex flex-col">

                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Pass For Payment ID</span>

                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Pass for payment ID"
                                                    disabled value={voucherDataById?.basic?.pfpId} />


                                            </div>

                                        </div>

                                        <div className="px-3 w-1/3 flex flex-col">
                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Date<span className="text-red-500 "> *</span></span>
                                                <input
                                                    type="text"
                                                    id="txt_dob"
                                                    placeholder="Voucher Date"
                                                    className="bg-orange-100 text-xs border border-gray-300 rounded px-4 py-2 h-7 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                                                    disabled
                                                    value={voucherDataById?.basic?.voucherDate}
                                                />
                                                <span class="px-2 bg-gray-200 text-xs">Sub Allotment</span>
                                                <input
                                                    type="checkbox" className="large-checkbox px-2"
                                                    checked={voucherDataById?.basic?.whetherSubAllot === "1" ? true : false}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex w-full space-x-4">
                                        {/* Voucher No */}
                                        <div className="px-3 w-1/3 flex flex-col">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Voucher No</span>
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                    placeholder="Voucher No"
                                                    onChange={onVoucherNo}
                                                    disabled
                                                    value={voucherDataById?.basic?.voucherNo}

                                                />
                                            </div>
                                        </div>

                                        {/* Voucher Type */}
                                        <div className="px-3 w-1/3 flex flex-col">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Voucher Type<span className="text-red-500 "> * </span></span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Voucher Type" disabled
                                                    value={voucherDataById?.basic?.voucherType === "C" ? "Cash" : voucherDataById?.basic?.voucherType === "B" ? "Bank" : voucherDataById?.basic?.voucherType === "T" ? "Treasury" : voucherDataById?.basic?.voucherType === "J" ? "Journal" : voucherDataById?.basic?.voucherType === "N" ? "Contra" : ""}
                                                />

                                            </div>
                                        </div>

                                        {/* Bank/Treasury */}
                                        <div className="px-3 w-1/3 flex flex-col">
                                            <div className="flex items-center bg-gray-200 rounded h-7 w-full">
                                                <span className="px-2 bg-gray-200 text-xs whitespace-nowrap">
                                                    Bank/Treasury<span className="text-red-500 "> * </span>
                                                </span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Bank/Treasury" disabled
                                                    value={voucherDataById?.basic?.realAccountCodeDesc}
                                                />

                                            </div>

                                        </div>
                                    </div>

                                </fieldset>
                                {voucherDataById?.basic?.voucherMode === "N" ? "" :

                                    <fieldset className="border border-gray-300 rounded-lg mb-1">
                                        <div className="flex w-full space-x-4 mt-1">
                                            <div className="px-3 w-1/2 flex flex-col relative">

                                                <div className="flex items-center border bg-gray-200 rounded h-7">
                                                    <span className="px-2 bg-gray-200 text-xs">GL Group<span className="text-red-500 "> * </span></span>
                                                    <input
                                                        type="url"
                                                        className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                        placeholder="Search GL Group Name..."
                                                        value={voucherDataById?.basic?.glGroupName}
                                                        disabled
                                                    />
                                                </div>


                                            </div>

                                            <div className="w-full flex flex-col mb-1" style={{ paddingRight: "12px" }}>

                                                <div class="flex items-center bg-gray-200 rounded h-7">
                                                    <span class="px-2 bg-gray-200 text-xs">A/C Code Desc<span className="text-red-500 "> * </span></span>
                                                    <input
                                                        type="url"
                                                        className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                        placeholder="A/C Code Desc"
                                                        disabled
                                                        value={voucherDataById?.basic?.nominalAccountCodeDesc}

                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>}

                                <fieldset className="border border-gray-300 rounded-lg ">
                                    <div className="flex w-fullspace-x-4 mt-1">
                                        <div className="px-3 w-1/2 flex flex-col relative">
                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Transfer From (-)</span>
                                                <input
                                                    type="text"
                                                    placeholder="Transfer From (-)"
                                                    // className="flex-grow text-xs px-2 py-1 h-7 outline-none rounded w-full border"
                                                    className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                    disabled
                                                    value={voucherDataById?.basic?.realAccountCodeDesc}

                                                />


                                            </div>
                                        </div>

                                        <div className="px-3 w-1/2 flex flex-col relative">
                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">{voucherDataById?.basic?.voucherType === "J" ? "Transfer To" : "Deposited To (+)"}</span>
                                                <input
                                                    type="text"
                                                    placeholder={voucherTypeData === "J" ? "Transfer To" : "Deposited To (+)"}
                                                    // className="flex-grow text-xs px-2 py-1 h-7 outline-none rounded w-full border"
                                                    className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                    disabled
                                                    value={voucherDataById?.basic?.nominalAccountCodeDesc}

                                                />

                                            </div>
                                        </div>
                                    </div>
                                </fieldset>

                                <fieldset className="border border-gray-300 rounded-lg ">
                                    <legend className="text-xs font-semibold text-gray-700 px-2">Receipt/Payment Instrument Details</legend>
                                    <div className="flex w-full space-x-4 mt-1">
                                        <div className="px-3 w-1/2 flex flex-col">
                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Inst Type</span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Isnt Type" disabled
                                                    value={voucherDataById?.basic?.instrumentType} />

                                            </div>
                                        </div>

                                        <div className="px-1 w-1/2 flex flex-col mb-2">
                                            <div class="flex items-center bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">Bank/Try</span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Bank/Try Details" disabled
                                                    value={voucherDataById?.basic?.instrumentDetails} />

                                            </div>
                                        </div>

                                        <div className="px-1 w-1/4 flex flex-col mb-2">
                                            <div class="flex items-center bg-gray-200 rounded h-7">
                                                <span class="px-2 bg-gray-200 text-xs">No</span>
                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="No" disabled
                                                    value={voucherDataById?.basic?.instrumentNo} />

                                            </div>
                                        </div>

                                        <div className="px-1 w-1/4 flex flex-col mb-2">
                                            <div class="flex items-center bg-gray-200 rounded h-7 text-xs">
                                                <span class="px-2 bg-gray-200 text-xs">Date</span>
                                                <input
                                                    type="text"
                                                    id="txt_dob"
                                                    placeholder="Instrument Date"
                                                    className="bg-orange-100 text-xs border border-gray-300 rounded px-4 py-2 h-7 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    disabled
                                                    value={voucherDataById?.basic?.instrumentDate}
                                                />
                                            </div>
                                        </div>


                                    </div>
                                </fieldset>


                                <div class="grid grid-cols-12 gap-4">
                                    <div class="col-span-8">
                                        <fieldset className="border border-gray-300 rounded-lg mt-1">
                                            <div className="flex w-full space-x-4 mt-1 mb-1">
                                                <div className="px-3 w-1/3 flex flex-col">
                                                    <div className="flex items-center border bg-gray-200 rounded h-7">
                                                        <span className="px-2 bg-gray-200 text-xs">Gross Amount</span>
                                                        <input
                                                            type="number"
                                                            className="bg-orange-100 flex-grow text-xs px-1 py-1 h-7 outline-none rounded"
                                                            placeholder="Gross Amount"
                                                            disabled
                                                            value={parseFloat(voucherDataById?.basic?.voucherNetAmount) + parseFloat(voucherDataById?.basic?.voucherDeductAmount)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="px-1 w-1/3 flex flex-col">
                                                    <div className="flex items-center border bg-gray-200 rounded h-7">
                                                        <span className="px-2 bg-gray-200 text-xs">Deduct Amount</span>
                                                        <input
                                                            type="number"
                                                            className="bg-orange-100 flex-grow text-xs px-1 py-1 h-7 outline-none rounded"
                                                            placeholder="Deduct Amount"
                                                            disabled
                                                            value={voucherDataById?.basic?.voucherDeductAmount}

                                                        />
                                                    </div>
                                                </div>
                                                <div className="px-1 w-1/3 flex flex-col">
                                                    <div className="flex items-center border bg-gray-200 rounded h-7">
                                                        <span className="px-2 bg-gray-200 text-xs">Net Amount</span>
                                                        <input
                                                            type="number"
                                                            className="bg-orange-100 flex-grow text-xs px-1 py-1 h-7 outline-none rounded"
                                                            placeholder="Net Amount"
                                                            disabled
                                                            value={voucherDataById?.basic?.voucherNetAmount}

                                                        />
                                                    </div>
                                                </div>




                                            </div>

                                        </fieldset>

                                        <fieldset className="border border-gray-300 rounded-lg mt-1">
                                            <div className="flex w-full space-x-4 mt-1 mb-1">
                                                <div className="px-3 w-full flex flex-col ">
                                                    <div class="flex items-center border bg-gray-200 rounded h-7">
                                                        <span class="px-2 bg-gray-200 text-xs">Voucher Narration</span>
                                                        <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Voucher Narration"
                                                            value={voucherDataById?.basic?.voucherNarration}
                                                            disabled />

                                                    </div>
                                                </div>


                                            </div>
                                        </fieldset>
                                        {/* 18698797 */}
                                        {voucherDataById?.basic?.voucherMode === "P" ?
                                            <fieldset className="border border-gray-300 rounded-lg">
                                                <legend className="text-xs font-semibold text-gray-700 px-2">Party Details</legend>
                                                <div className="flex w-full space-x-4 ">
                                                    <div className="px-3 w-1/2 flex flex-col">
                                                        <div class="flex items-center border bg-gray-200 rounded h-7">
                                                            <span class="px-2 bg-gray-200 text-xs">Party Type</span>
                                                            <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                                placeholder="Party Type"
                                                                disabled
                                                                value={voucherDataById?.basic?.partyType}

                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="px-1 w-full flex flex-col mb-1">
                                                        <div class="flex items-center bg-gray-200 rounded h-7">
                                                            <span class="px-2 bg-gray-200 text-xs">Party Code & Name</span>
                                                            <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                                placeholder="Party Code & Name"
                                                                value={voucherDataById?.basic?.partyCode}
                                                                disabled />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex w-full space-x-4 mt-1">
                                                    <div className="px-3 w-1/2 flex flex-col">
                                                        <div class="flex items-center border bg-gray-200 rounded h-7">
                                                            <span class="px-2 bg-gray-200 text-xs">Pay To</span>

                                                            <input type="text" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                                placeholder="Pay to"
                                                                disabled
                                                                value={voucherDataById?.basic?.payTo}

                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="px-1 w-full flex flex-col mb-1">
                                                        <div class="flex items-center bg-gray-200 rounded h-7">
                                                            <span class="px-2 bg-gray-200 text-xs">Party Address</span>
                                                            <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Party Address"
                                                                disabled
                                                                value={voucherDataById?.basic?.partyAddress}

                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset> :

                                            voucherDataById?.basic?.voucherMode === "N" && voucherDataById?.basic?.voucherType === "N" && voucherDataById?.basic?.nominalAccountCode === "900000001" ?


                                                <fieldset className="border border-gray-300 rounded-lg">
                                                    <legend className="text-xs font-semibold text-gray-700 px-2">Challan Details</legend>
                                                    <div className="flex w-full space-x-4 ">
                                                        <div className="px-3 w-1/2 flex flex-col">
                                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                                <span class="px-2 bg-gray-200 text-xs">Challan No</span>
                                                                <input
                                                                    type="url"
                                                                    className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                                    placeholder="Challan No"
                                                                    disabled
                                                                    value={voucherDataById?.basic?.instrumentNo}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="w-1/2 flex flex-col" style={{ paddingRight: "10px" }}>
                                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                                <span className="px-1 bg-gray-200 text-xs">Challan By Whom
                                                                    {/* <span className="text-red-500 "> * </span> */}
                                                                </span>


                                                                <input
                                                                    type="url"
                                                                    className="bg-orange-100 flex-grow text-xs px-2 py-2 h-7 outline-none rounded"
                                                                    placeholder="Challan By Whom"
                                                                    disabled
                                                                    value={voucherDataById?.basic?.byWhom}


                                                                />

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex w-full space-x-4 mt-1">


                                                        <div className="px-3 w-full flex flex-col mb-1">
                                                            <div class="flex items-center bg-gray-200 rounded h-7">
                                                                <span class="px-2 bg-gray-200 text-xs">Challan Whose Behalf</span>
                                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Challan Whose Behalf"
                                                                    disabled
                                                                    value={voucherDataById?.basic?.whoseBehalf}

                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset> :
                                                <fieldset className="border border-gray-300 rounded-lg">
                                                    <legend className="text-xs font-semibold text-gray-700 px-2">Party Details</legend>
                                                    <div className="flex w-full space-x-4 ">
                                                        <div className="px-3 w-1/2 flex flex-col">
                                                            <div class="flex items-center border bg-gray-200 rounded h-7">
                                                                <span class="px-2 bg-gray-200 text-xs">Party Type</span>
                                                                <input
                                                                    type="url"
                                                                    className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                                    placeholder="Party Type"
                                                                    disabled
                                                                    value={voucherDataById?.basic?.partyType}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="px-2 w-full flex flex-col" style={{ paddingRight: "12px" }}>
                                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                                <span className="px-1 bg-gray-200 text-xs">Party Details<span className="text-red-500 "> * </span></span>
                                                                <div className="w-1/6 flex items-center border bg-gray-200 rounded h-7">
                                                                    <input
                                                                        type="url"
                                                                        className="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded"
                                                                        placeholder="Party Code"
                                                                        disabled
                                                                        value={voucherDataById?.basic?.partyCode}

                                                                    />
                                                                </div>

                                                                <input
                                                                    type="url"
                                                                    className="bg-orange-100 flex-grow text-xs px-2 py-2 h-7 outline-none rounded"
                                                                    placeholder="Party Details"
                                                                    disabled
                                                                    value={voucherDataById?.basic?.payTo}

                                                                />

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex w-full space-x-4 mt-1">
                                                        <div className="px-3 w-1/2 flex flex-col">
                                                            <div className=" w-full flex flex-col mb-1">
                                                                <div class="flex items-center bg-gray-200 rounded h-7">
                                                                    <span class="px-2 bg-gray-200 text-xs">{voucherDataById?.basic?.voucherMode === "R" ? "Receipt From" : voucherDataById?.basic?.voucherMode === "N" ? "Transfer To" : "Pay To"}</span>
                                                                    <input type="url" class="bg-orange-100 flex-grow text-xs px-4 py-2 h-7 outline-none rounded" placeholder={voucherDataById?.basic?.voucherMode === "R" ? "Receipt From" : voucherDataById?.basic?.voucherMode === "N" ? "Transfer To" : "Pay To"}
                                                                        disabled value={voucherDataById?.basic?.payTo}

                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="px-1 w-full flex flex-col mb-1">
                                                            <div class="flex items-center bg-gray-200 rounded h-7">
                                                                <span class="px-2 bg-gray-200 text-xs">Party Address</span>
                                                                <input type="url" class="bg-orange-100 flex-grow text-xs px-3 py-2 h-7 outline-none rounded" placeholder="Party Address"
                                                                    disabled value={voucherDataById?.basic?.partyAddress}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>}
                                    </div>
                                    <div className="col-span-4">
                                        <h2 className="text-red font-bold text-xs text-center">
                                            {voucherDataById?.basic?.partyType === "C" ? "CONTRACTOR DETAILS" : voucherDataById?.basic?.partyType === "E" ? "EMPLOYEE DETAILS" : "DEDUCTION DETAILS (IF ANY)"}

                                        </h2>
                                        <div className="overflow-y-auto max-h-40 border border-gray-300 rounded-lg">
                                            <table className="w-full  border border-gray-200 rounded-xs">
                                                <thead className="bg-blue-500 text-white text-xs">
                                                    <tr>
                                                        <th className="py-1 px-4 border ">Deduction Account Head</th>
                                                        <th className="py-1 px-4 border">Amount</th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {voucherDataById?.deduct?.map((user, index) => (
                                                        <tr key={index} className="text-center border hover:bg-gray-100 text-xs">
                                                            <td className="py-1 px-4 border">{user.accountDescActual}</td>
                                                            <td className="py-1 px-4 border">{user.deductionAmount}</td>

                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>


                                </div>
                                <fieldset className="border border-gray-300 rounded-lg p-1">
                                    <legend className="text-xs font-semibold text-gray-700 px-2">Voucher Reference</legend>

                                    <div className="flex w-full items-center gap-4 px-2">
                                        {/* Radio Buttons Container */}
                                        <div className="flex w-1/2 justify-between">
                                            <label className="flex items-center text-xs w-1/6">
                                                <input
                                                    type="radio"
                                                    value="Add"
                                                    disabled
                                                    className="form-radio text-blue-500 mr-2"
                                                    checked={voucherDataById?.basic?.flagCash === "1"}
                                                />
                                                Cash
                                            </label>

                                            <label className="flex items-center text-xs w-1/4">
                                                <input
                                                    type="radio"
                                                    value="Query"
                                                    disabled
                                                    className="form-radio text-blue-500 mr-2"
                                                    checked={voucherDataById?.basic?.flagAdvance === "1"}
                                                />
                                                Advance/Adjustment
                                            </label>

                                            <label className="flex items-center text-xs w-1/4">
                                                <input
                                                    type="radio"
                                                    value="Verify"
                                                    disabled
                                                    className="form-radio text-blue-500 mr-2"
                                                    checked={voucherDataById?.basic?.flagTransit === "1"}
                                                />
                                                Cash in Transit
                                            </label>

                                            <label className="flex items-center text-xs w-1/4">
                                                <input
                                                    type="radio"
                                                    value="Delete"
                                                    disabled
                                                    className="form-radio text-blue-500 mr-2"
                                                    checked={voucherDataById?.basic?.flagDeduct === "1"}
                                                />
                                                Deduction Deposit
                                            </label>
                                        </div>

                                        {/* Account Head Input */}
                                        <div className="w-1/2">
                                            <div className="flex items-center border bg-gray-200 rounded h-7 ">
                                                <span className="px-2 bg-gray-200 text-xs">Account Head</span>
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-3 h-7 outline-none rounded "
                                                    placeholder="Account Head"
                                                    disabled
                                                    value={voucherDataById?.basic?.glGroupName}
                                                />
                                            </div>
                                        </div>
                                    </div>



                                    <div className="flex w-full gap-4 mt-2 px-2">
                                        {/* Reference Input */}
                                        <div className="w-1/2">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">
                                                    Ref of {voucherDataById?.basic?.flagAdvance === "1" ? "Advance/Adj" : voucherDataById?.basic?.flagTransit === "1" ? "Cash in Transit" : voucherDataById?.basic?.flagDeduct === "1" ? "Deduction deposit" : ""}
                                                </span>
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-3 h-7 outline-none rounded "
                                                    disabled

                                                />

                                            </div>
                                        </div>

                                        <div className="w-1/5">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">

                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-3 h-7 outline-none rounded "
                                                    disabled

                                                />

                                            </div>
                                        </div>

                                        {/* Search Input */}
                                        <div className="w-2/3">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-3 h-7 outline-none rounded"
                                                    disabled

                                                />

                                            </div>
                                        </div>
                                    </div>
                                </fieldset>



                                <fieldset className="border border-gray-300 rounded-lg mt-1 p-1">
                                    {/* First Row: 4 Inputs in One Line */}
                                    <div className="flex flex-nowrap gap-x-2 w-full">
                                        {/* Allotment No */}
                                        <div className="w-1/4 flex flex-col">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Allotment No</span>
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-2 h-7 outline-none rounded "
                                                    placeholder="Allotment No"
                                                    disabled
                                                    value={voucherDataById?.basic?.allotmentNo}
                                                />
                                            </div>
                                        </div>

                                        {/* Conditional Input (Allotment Date or Bill Type) */}
                                        {voucherDataById?.basic?.voucherMode === "R" || voucherDataById?.basic?.voucherMode === "N" ? (
                                            <div className="w-1/4 flex flex-col">
                                                <div className="flex items-center bg-gray-200 rounded h-7">
                                                    <span className="px-2 bg-gray-200 text-xs">Allotment Date</span>
                                                    <input type="date" className="bg-orange-100 flex-grow text-xs px-2 h-7 outline-none rounded " disabled value={voucherDataById?.basic?.allotmentDate} />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-1/4 flex flex-col">
                                                <div className="flex items-center bg-gray-200 rounded h-7">
                                                    <span className="px-2 bg-gray-200 text-xs">Bill Type</span>
                                                    <input
                                                        type="text"
                                                        className="bg-orange-100 flex-grow text-xs px-2 h-7 outline-none rounded "
                                                        placeholder="Bill Type"
                                                        disabled
                                                        value={voucherDataById?.basic?.billType}

                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Schematic Type */}
                                        <div className="w-1/4 flex flex-col">
                                            <div className="flex items-center bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Schematic Type</span>
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-2 h-7 outline-none rounded "
                                                    placeholder="Schematic Type"
                                                    disabled
                                                    value={voucherDataById?.basic?.schemeType}


                                                />
                                            </div>
                                        </div>

                                        {/* Expenditure Type */}
                                        <div className="w-1/4 flex flex-col">
                                            <div className="flex items-center bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Exp Type</span>
                                                <input
                                                    type="text"
                                                    placeholder="Expenditure Type"
                                                    className="bg-orange-100 flex-grow text-xs px-2 h-7 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 "
                                                    disabled
                                                    value={voucherDataById?.basic?.expType}

                                                />
                                            </div>
                                        </div>
                                    </div>


                                    {/* Activity Details in Full Width */}
                                    <div className="flex mt-2 gap-x-2">
                                        {/* First Input Box */}
                                        <div className="w-full flex flex-col">
                                            <div className="flex items-center border bg-gray-200 rounded h-7">
                                                <span className="px-2 bg-gray-200 text-xs">Activity Details</span>
                                                <input
                                                    type="text"
                                                    className="bg-orange-100 flex-grow text-xs px-4 h-7 outline-none rounded "
                                                    placeholder="Activity Details"
                                                    disabled
                                                    value={voucherDataById?.basic?.activityDetails}

                                                />
                                            </div>
                                        </div>

                                        {/* Second Input Box */}
                                        <div className="w-1/2 ">
                                            <button
                                                onClick={() => window.open("https://javaapi.wbpms.in/" + voucherDataById?.basic?.docFile)}
                                                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                                                title="View PDF"
                                                disabled={!voucherDataById?.basic?.docFile}
                                            >

                                                <FontAwesomeIcon icon={faEye} title="View File" />

                                            </button>
                                        </div>
                                    </div>

                                </fieldset>


                            </div>

                            : ""}
                    </div>


                    <div className="flex justify-center space-x-4 py-1">
                        {pageChange === "Add" ?
                            <button className="bg-yellow-500 text-white px-4 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onPreview}>
                                Preview Voucher
                            </button> : ""}
                        {/* similar entry */}
                        {pageChange === "Add" && voucherModeData === "R" ?
                            <button className="bg-orange-500 text-white px-4 py-1 text-xs rounded hover:bg-orange-700 transition duration-200" disabled={saveDisabled ? false : true} onClick={onSimilarEntry}>
                                Similar Entry
                            </button> : ""}
                        {/* Save Button */}
                        {VoucherResponse?.voucherStatus && voucherModeData === "P" ?

                            <button className="bg-green-600 text-white px-4 py-1 text-xs rounded hover:bg-green-500 transition duration-200"
                                onClick={() => onNextPfp(getPassForPaymentDataById?.basic?.pfpId)}
                            >
                                Next PFP ID
                            </button> : ""}
                        {VoucherResponse?.voucherStatus && pageChange === "Add" ?
                            <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={onReset}>
                                Reset
                            </button> : !VoucherResponse?.voucherStatus && pageChange === "Add" ?
                                <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" onClick={onSave} disabled={VoucherResponse?.voucherStatus ? true : false}>
                                    Save
                                </button> : ""}
                        {pageChange === "Add" && voucherModeData === "P" || voucherModeData === "N" && voucherTypeData || voucherModeData === "R" ?

                            < button className="bg-blue-500 text-white px-4 py-1 text-xs rounded hover:bg-blue-600 transition duration-200" onClick={onVoucherPrint} disabled={VoucherResponse?.voucherStatus ? false : true}>
                                {voucherModeData === "P" ? "Debit Voucher" : voucherModeData === "N" && voucherTypeData === "N" ? "Contra Voucher" : voucherModeData === "N" && voucherTypeData === "J" ? "Journal Voucher" : voucherModeData === "R" ? "Credit Voucher" : ""}
                            </button> : ""}

                        {pageChange !== "Add" && voucherDataById?.basic?.voucherMode === "P" || voucherDataById?.basic?.voucherMode === "N" && voucherDataById?.basic?.voucherType || voucherDataById?.basic?.voucherMode === "R" ?

                            < button className="bg-blue-500 text-white px-4 py-1 text-xs rounded hover:bg-blue-600 transition duration-200" onClick={onQueryVoucherPrint} >
                                {voucherDataById?.basic?.voucherMode === "P" ? "Debit Voucher" : voucherDataById?.basic?.voucherMode === "N" && voucherDataById?.basic?.voucherType === "N" ? "Contra Voucher" : voucherDataById?.basic?.voucherMode === "N" && voucherDataById?.basic?.voucherType === "J" ? "Journal Voucher" : voucherDataById?.basic?.voucherMode === "R" ? "Credit Voucher" : ""}
                            </button> : ""}


                        {pageChange === "Add" && voucherModeData === "R" && voucherTypeData === "C" ?
                            < button className="bg-blue-500 text-white px-4 py-1 text-xs rounded hover:bg-blue-600 transition duration-200" onClick={onCashierReceiptPrint} disabled={VoucherResponse?.voucherStatus ? false : true}>
                                Cashier Receipt
                            </button> : ""}

                        {pageChange === "Query" ?
                            < button className="bg-blue-500 text-white px-4 py-1 text-xs rounded hover:bg-blue-600 transition duration-200">
                                Next Query
                            </button> : ""}

                        {pageChange === "Verify" ?
                            <button className="bg-yellow-500 text-white px-4 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onVerifyPop}>
                                Verify
                            </button> : ""}

                        {pageChange === "Verify" ?
                            < button className="bg-blue-500 text-white px-4 py-1 text-xs rounded hover:bg-blue-600 transition duration-200">
                                Next Verify
                            </button> : ""}

                        {pageChange === "Delete" ?

                            <button className="bg-red-500 text-white px-4 py-1 text-xs rounded hover:bg-red-600 transition duration-200"
                                onClick={onDeletePop}
                            >
                                Delete
                            </button> : ""}

                        {/* {pageChange === "Add" ? "" :

                            <button className="bg-indigo-500 text-white px-4 py-1 text-xs rounded hover:bg-indigo-600 transition duration-200">
                                Cashier Receipt
                            </button>} */}

                        {/* {pageChange === "Add" ? "" :

                            <button className="bg-indigo-500 text-white px-4 py-1 text-xs rounded hover:bg-indigo-600 transition duration-200">
                                Challan
                            </button>} */}
                    </div>
                </div>
            </div >
        </>
    );
};

export default VoucherEntry;
