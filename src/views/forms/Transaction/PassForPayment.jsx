import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Succesxsodal from "../../../components/Succesxsodal";
import Modal from 'react-modal';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetch } from "../../../functions/Fetchfunctions";
import { getDeductionList, deletePassForPayment, getPassForPaymentById, getPassForPaymentDetails, getParabaithakActivityByScheme, getTenderList, getPartyTypeList, getAcCodeDescList, getContractorList, getEmployeeList, getJobWorkerList, getDepartmentList, getLsgList, getDeductedtAcCodeList, addInsertPassForPayment, verifyPassForPayment, getAccountHeadList } from "../../../Service/Transaction/TransactionService";
import { Toast } from "flowbite-react";
import ColorRingCustomLoader from "../../Loader/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";


const PassForPayment = () => {
    const [loader, setLoader] = useState(false)
    const getCurrentDate = () => new Date().toISOString().split("T")[0];
    const [isOpen, setIsOpen] = useState(false);
    const [isthemeOpen, setIsThemeOpen] = useState(false);
    const [isPartyDetailsOpen, setIsPartyDetailsOpen] = useState(false);
    const [scheme, setScheme] = useState("");
    const [activityFromDate, setActivityFromDate] = useState("");
    const [activityToDate, setActivityToDate] = useState("");
    const [themeScheme, setThemeScheme] = useState("");
    const [activity, setActivity] = useState("");
    const [egramswarajCode, setEgramswarajCode] = useState("");
    const [activityDetailsBySchemeList, setActivityDetailsBySchemeList] = useState([]);
    const [tenderAllList, setTenderAllList] = useState([]);
    const [year, setYear] = useState();
    const [activityTheme, setActivityTheme] = useState();
    const [tenderNo, setTenderNo] = useState("");
    const [tenderDesc, setTenderDesc] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [fromDatePassForPayment, setFromDatePassForPayment] = useState(getCurrentDate());
    const [toDatePassForPayment, setToDatePassForPayment] = useState(getCurrentDate());
    const [passForPaymentStatus, setPassForPaymentStatus] = useState("");
    const [tender, setTender] = useState();
    const [partyTypes, setPartyTypes] = useState("");
    const [name, setName] = useState();
    const [deductionValue, setDeductionValue] = useState("");
    const [deductedAcCodeValue, setDeductedAcCodeValue] = useState("");
    const [tableData, setTableData] = useState([]);
    const [hasEditedGross, setHasEditedGross] = useState(false);
    const [partyTypeAllList, setPartyTypeAllList] = useState([]);
    const [acCodeDescAllList, setAcCodeDescAllList] = useState([]);
    const [nameList, setNameList] = useState([]);
    const [partyName, setPartyName] = useState("");

    const jsonString = sessionStorage.getItem("SAHAJ_SARAL_USER");
    const userData = JSON.parse(jsonString);
    const [showDropdown, setShowDropdown] = useState(false);
    const [partyType, setPartyType] = useState("");
    const [grossAmount, onGrossAmount] = useState(0);
    const [schematicType, setSchematicType] = useState("");
    const [expenditureType, setExpenditureType] = useState();
    const [allotementNo, setAllotementNo] = useState();
    const [acCodeDesc, setAcCodeDesc] = useState();
    const [passForPayNarration, setPassForPayNarration] = useState();
    const [workOrder, setWorkOrder] = useState();
    const [billType, setBillType] = useState();
    const [subAllotment, setSubAllotment] = useState("");
    const [documentType, setDocumentType] = useState();
    const [base64String, setBase64String] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedDate, setPaymentDate] = useState("");
    const [financialYear, setFinancialYear] = useState("");
    const [passForPaymentDetailsById, setPassForPaymentDetailsById] = useState([]);
    const [passforPaymentResponse, setPassforPaymentResponse] = useState()

    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10);
    const [pageChange, setPageChange] = useState("Add");
    const [modalPassForPaymentId, setModalPassForPaymentId] = useState(false);
    const [getPassForPaymentDataById, setGetPassForPaymentDataById] = useState();
    const [groupOfContractors, setGroupOfContractors] = useState(false);
    const [groupOfContractorsStartDate, setGroupOfContractorsStartDate] = useState("");
    const [groupOfContractorsEndDate, setGroupOfContractorsEndDate] = useState("");
    const [accountHead, setAccountHead] = useState("")
    const [contractorName, setContractorName] = useState("")
    const [headShowDropdown, setHeadShowDropdown] = useState(false);
    const [accountHeadAllList, setAccountHeadAllList] = useState([]);
    const [groupOfContractorsData, setGroupOfContractorsData] = useState([]);
    const [selectedVouchers, setSelectedVouchers] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedData, setSelectedData] = useState([]); // For full or partial data
    const [selectAll, setSelectAll] = useState(false);
    const [payto, setPayto] = useState("");
    const [payAddress, setPayAddress] = useState("");
    const [activeModal, setActiveModal] = useState(false);
    const [confirmSubmitFlag, setConfirmSubmitFlag] = useState(false);
    const [showPopID, setShowPopID] = useState(false);
    const [billRa, setBillRa] = useState();
    const [verifyFlag, setVerifyFlag] = useState(false);
    const [saveDisable, setSaveDisable] = useState(false);
    const [deleteFlag, setDeleteFlag] = useState(false);
    const [deleteReason, setDeleteReason] = useState("");
    console.log(selectedData[0]?.partyDetails, acCodeDesc, "acCodeDescacCodeDesc")

    console.log(selectedData, "selectedData")
    const totalDeductionAmount = selectedData && Array.isArray(selectedData)
        ? selectedData.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0).toFixed(2)
        : "0.00";

    useEffect(() => {
        setHasEditedGross(false); // Reset edit flag when selection changes
    }, [selectedData]);


    useEffect(() => {
        if (!hasEditedGross) {
            onGrossAmount(totalDeductionAmount);
        }
    }, [totalDeductionAmount, hasEditedGross]);


    const ids = selectedData.map(item => item.id).join(",");

    const firstAccountCode = selectedData.length > 0 ? selectedData[0].accountCode : null;

    // Handle individual checkbox selection
    const handleCheckboxChange = ({ id, amount, accountCode, partyDetails }) => {
        // setPayto(partyDetails); // Set payto from the newly selected item
        if (selectedData.some((item) => item.id === id)) {
            // Remove the object if it's already selected
            setSelectedIds(selectedIds.filter((item) => item !== id));

            setSelectedData(selectedData.filter((item) => item.id !== id));
        } else {
            // Add the new object to the list
            setSelectedIds([...selectedIds, id]);

            setSelectedData([...selectedData, { id, amount, accountCode, partyDetails }]);
        }
    };

    console.log(payto, "payto")


    // Handle select all
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedIds([]);
            setSelectedData([]);
        } else {
            const allData = groupOfContractorsData.map((item) => ({
                id: item.voucherId,
                amount: item.deductionAmount,
                accountCode: item?.accountCode,
                partyDetails: item?.partyDetails

            }));

            setSelectedIds(allData.map((data) => data.id)); // Store all IDs
            setSelectedData(allData); // Store all full data
            console.log(allData, "allData")
            setPayto(allData[0]?.partyDetails || "");
            // Set payto from the first selected item
        }

        setSelectAll(!selectAll); // Toggle "Select All" state
    };

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

    const onSearchContractorName = (e) => {
        setContractorName(e.target.value)
    }

    const onAccountHeadType = (i) => {
        setAccountHead(i?.groupName)
        setHeadShowDropdown(false)
    }


    const onGroupOfContractorsRetrieve = () => {

        if (!accountHead) {
            toast.error("Please select Account Head")
        } else if (!groupOfContractorsStartDate) {
            toast.error("Please select From Date")
        } else if (!groupOfContractorsEndDate) {
            toast.error("Please select To Date")
        } else {
            getDeductionList(userData?.CORE_LGD,
                accountHeadAllList.find(item => item.groupName === accountHead)?.groupId ?? null, partyTypeAllList.find(item => item.groupName === partyType)?.groupId ?? null, groupOfContractorsStartDate, groupOfContractorsEndDate, contractorName ? contractorName : 0
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setGroupOfContractorsData(response);
            })
        }
    }

    const calculateTotalAmount = (array) => {
        return array.reduce((total, item) => {
            console.log(total, item, "tototototo")
            const amount = Number(item.deductionAmount) || 0;
            return total + amount;
        }, 0);
    };
    console.log(getPassForPaymentDataById, "getPassForPaymentDataById")

    const totalAmount = calculateTotalAmount(tableData);
    const netAmount = grossAmount - totalAmount;

    console.log(grossAmount, totalAmount, netAmount, "deductedAcCodeValue")

    const onClose = () => {
        setIsOpen(false)
        setScheme("");
        setYear("");
        setActivity("");
        setEgramswarajCode("");
        setActivityDetailsBySchemeList([])
    }

    const onThemeClose = () => {
        setIsThemeOpen(false)
        setThemeScheme("");
        setTenderNo("");
        setTenderDesc("");
        setFromDate("");
        setToDate("");
        setTenderAllList([])
    }

    const onPartyDetailsClose = () => {
        setIsPartyDetailsOpen(false);
        setName("");
        setNameList([]);
    }

    const queryClient = useQueryClient();

    const { data: schemeList } = useQuery({
        queryKey: ["schemeList"],
        queryFn: async () => {
            const data = await fetch.get("/ParabaithakActivity/GetActivityScheme");
            // console.log(Array.isArray(data.data.result));
            return data?.data;
        },
    });


    const { data: activityDetailsByScheme } = useQuery({
        queryKey: ["activityDetailsByScheme"],
        queryFn: async () => {
            const data = await fetch.get("/ParabaithakActivity/GetActivityListSchemeWise?distLgd=" + (userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? userData?.DIST_LGD : 0) + "&blockLgd=" + (userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? userData?.BLOCK_LGD : 0) + "&gpLgd=" + (userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0) + "&planYear=" + (year ? year : 0) + "&schemeId=" + (scheme ? scheme : 0) + "&activityName=" + (activity ? activity : 0) + "&eGramId=" + (egramswarajCode ? egramswarajCode : 0));
            return data?.data;
        },
    });

    const { data: accDeductList } = useQuery({
        queryKey: ["accDeductList", partyTypes],
        queryFn: async () => {
            const data = await fetch.get("/NominalAccount/GetAccountCodeForDeduction?lgdCode=" + (userData?.USER_LEVEL === "GP" ? userData?.GP_LGD : userData?.USER_LEVEL === "BLOCK" ? userData?.BLOCK_LGD : userData?.DIST_LGD) + "&partyFlag=" + (partyTypes ? partyTypes : 0))
            return data?.data;
        },
    });

    console.log(tableData, "tableData")

    const onRetrieve = () => {
        if (!year && !egramswarajCode) {
            toast.error("Please Select a Plan Year")
        } else if (!scheme && !egramswarajCode) {
            toast.error("Please Select a Scheme")
        } else {
            getParabaithakActivityByScheme(userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? userData?.DIST_LGD : 0,
                userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? userData?.BLOCK_LGD : 0,
                userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
                year ? year : 0, scheme ? scheme : 0, activity ? activity : 0, egramswarajCode ? egramswarajCode : 0,
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setActivityDetailsBySchemeList(response);
            })
            queryClient.fetchQuery({ queryKey: ["activityDetailsByScheme"] });
        }

    }

    const onThemeRetrieve = () => {
        if (!activityTheme?.activityId) {
            toast.error("Please select Activity Code & Name First")
        } else if (!fromDate) {
            toast.error("Please select From Date")

        } else if (!toDate) {
            toast.error("Please select To Date")

        } else {
            getTenderList(userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? userData?.DIST_LGD : 0,
                userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? userData?.BLOCK_LGD : 0,
                userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
                themeScheme ? themeScheme : 0, tenderNo ? tenderNo : 0, tenderDesc ? tenderDesc : 0, fromDate, toDate, activityTheme?.activityId,
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setTenderAllList(response);
            })
            queryClient.fetchQuery({ queryKey: ["tenderList"] });
        }
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

    const onChosse = (d) => {
        setActivityTheme(d)
        setIsOpen(false)
    }

    console.log(selectedData?.partyDetails, acCodeDesc, "sisisisisisisi")

    const onTenderChosse = (d) => {
        setTender(d)
        setIsThemeOpen(false)
    }

    const onPartyTypeChosse = (d) => {
        setActiveModal(true)
        setPartyName(d)
        setIsPartyDetailsOpen(false)
    }

    console.log(partyName, "paratyparty")



    const currentYear = new Date().getFullYear();

    const generateYearRanges = (startYear, rangeCount) => {
        console.log(startYear, rangeCount, "start")
        const ranges = [];
        for (let i = 0; i < rangeCount; i++) {
            const start = startYear - i; // Start from the highest year
            const end = start + 1;
            ranges.push(`${start}-${end}`);
        }
        return ranges;
    };

    const yearRanges = generateYearRanges(currentYear, 9);

    const onActivityDetailils = () => {
        setIsOpen(true)
        setActivityTheme("");
        setTender("");
        setWorkOrder("");
        setBillType("");
        setPartyType("");
        setAcCodeDesc("");
        setPartyTypeAllList([]);
        setAcCodeDescAllList([]);
        setPassForPayNarration("");
        setPartyTypes("");
        setGetPassForPaymentDataById("");
        setPayto("");
        setPayAddress("");
        setName("");
        setNameList([]);
        setPartyName({ contractorId: "", contractorNm: "", empId: "", empName: "", jobWorkerId: "", jobWorkerName: "", deptId: "", deptName: "", lsgCode: "", lsgName: "" });
        setTableData([]);
        onGrossAmount(0);
        setSubAllotment("");
        setDocumentType("");
        setBase64String("");
        setImagePreview(null);
    }
    // for teneder Modal

    const onTenderNo = () => {
        if (!activityTheme?.activityId) {
            toast.error("Please select Activity Code & Name First")
        } else {
            setIsThemeOpen(true)
            getTenderList(userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? userData?.DIST_LGD : 0,
                userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? userData?.BLOCK_LGD : 0,
                userData?.USER_LEVEL == "DIST" || userData?.USER_LEVEL == "BLOCK" || userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
                activityTheme?.activityId,
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setTenderAllList(response);
            })
            queryClient.fetchQuery({ queryKey: ["tenderList"] });
        }

    }

    const onPartyDetails = () => {
        setIsPartyDetailsOpen(true)


    }

    //Part type api integration

    const onPartyType = (e) => {
        const value = e.target.value
        setPartyType(value)
        setShowDropdown(true)
        getPartyTypeList(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : 0 || userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : 0 || userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
            value,
        ).then(function (result) {
            const response = result?.data;
            console.log(response, "report")
            setPartyTypeAllList(response);
        })


    }

    const onSetPartType = (i) => {
        setPartyType(i?.groupName)
        setShowDropdown(false)
        getAcCodeDescList(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : 0 || userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : 0 || userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
            i?.groupId, "P",
        ).then(function (result) {
            const response = result?.data;
            console.log(response, "report")
            setAcCodeDescAllList(response);
        })
    }


    const onPartyTypes = (e) => {
        setActiveModal(false)
        setPartyTypes(e.target.value)
        setName("");
        setNameList([]);
        setPartyName({ contractorId: "", contractorNm: "", empId: "", empName: "", jobWorkerId: "", jobWorkerName: "", deptId: "", deptName: "", lsgCode: "", lsgName: "" });
        setTableData([]);
        onGrossAmount(0);
        setSubAllotment("");
        queryClient.fetchQuery({ queryKey: ["accDeductList"] });

    }
    console.log(tableData, "tableData")

    const onDeductionAdd = () => {
        if (deductedAcCodeValue && deductionValue) {

            const isDuplicate = tableData.some(
                (item) => item.accountCode === deductedAcCodeValue.accountCode
            );

            if (isDuplicate) {
                toast.error("This Deducted A/C Code has already been added.");
                return;
            }

            // Add new data to the table
            setTableData((prev) => [
                ...prev,
                {
                    accountCode: deductedAcCodeValue.accountCode,
                    accountCodeDesc: deductedAcCodeValue.accountCodeDesc,
                    deductionAmount: deductionValue,
                },
            ]);

            // Clear inputs after adding
            setDeductedAcCodeValue("");
            setDeductionValue("");
        } else {
            toast.error("Please select a Deducted A/C Code and enter a deduction amount.");
        }
    };


    const onDeleteTableItem = (indexToRemove) => {
        setTableData((prev) =>
            prev.filter((_, index) => index !== indexToRemove) // Remove the item with the specified index
        );
    };

    const onSchematicType = (e) => {
        setSchematicType(e.target.value)
        setExpenditureType("");
        setAllotementNo("");
        setActivityTheme("");
        setTender("");
        setWorkOrder("");
        setBillType("");
        setPartyType("");
        setAcCodeDesc("");
        setPartyTypeAllList([]);
        setAcCodeDescAllList([]);
        setPassForPayNarration("");
        setPartyTypes("");
        setGetPassForPaymentDataById("");
        setPayto("");
        setPayAddress("");
        setSelectedData([]);

        setName("");
        setNameList([]);
        setPartyName({ contractorId: "", contractorNm: "", empId: "", empName: "", jobWorkerId: "", jobWorkerName: "", deptId: "", deptName: "", lsgCode: "", lsgName: "" });
        setTableData([]);
        onGrossAmount(0);
        setSubAllotment("");
        setDocumentType("");
        setBase64String("");
        setImagePreview(null);
    }

    const onExpenditureType = (e) => {
        setExpenditureType(e.target.value)
    }

    const onPaymentDate = (e) => {
        const selectedDate = new Date(e.target.value); // Get the selected date
        setPaymentDate(e.target.value);

        // Calculate the financial year
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


    const onAllotementNo = (e) => {
        setAllotementNo(e.target.value)
    }

    const onAcCodeDesc = (e) => {
        setAcCodeDesc(e.target.value)
        setPassForPayNarration("");
        setPartyTypes("");
        setGetPassForPaymentDataById("");
        setPayto("");
        setPayAddress("");
        setName("");
        setNameList([]);
        setPartyName({ contractorId: "", contractorNm: "", empId: "", empName: "", jobWorkerId: "", jobWorkerName: "", deptId: "", deptName: "", lsgCode: "", lsgName: "" });
        setTableData([]);
        onGrossAmount(0);
        setSubAllotment("");
        setDocumentType("");
        setBase64String("");
        setImagePreview(null);
    }

    const onPassForPayNarration = (e) => {
        setPassForPayNarration(e.target.value)
    }

    const onWorkOrder = (e) => {
        setWorkOrder(e.target.value)
    }

    const onBillType = (e) => {
        setBillType(e.target.value)
        setBillRa("");
    }


    const onSubAllotment = (e) => {
        setSubAllotment(e.target.checked)
    }

    const onDocumentType = (e) => {
        setDocumentType(e.target.value)
    }

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

    const onSave = () => {
        if (!selectedDate) {
            toast.error("Please Select Payment Date")
        } else if (!schematicType) {
            toast.error("Please Select Schematic Type")
        } else if (!expenditureType) {
            toast.error("Please Select Expenditure Type")
        } else if ((schematicType === "1" || schematicType === "2") && !activityTheme?.activityCode) {
            toast.error("Please Select Activity Code & Name")
        } else if (schematicType === "1" && !workOrder) {
            toast.error("Please Enter Work Order")
        } else if (schematicType === "1" && !billType) {
            toast.error("Please Enter Bill Type")
        } else if (billType === "1" && !billRa) {
            toast.error("Please Enter Bill RA")
        } else if (!acCodeDesc) {
            toast.error("Please Enter A/C Code Description")
        } else if (!passForPayNarration) {
            toast.error("Please Enter Pass for Payment Narration")
        } else if (!partyTypes) {
            toast.error("Please Select Party Type")
        } else if (Number(acCodeDesc) !== 202601005 && !payto) {
            toast.error("Please Enter Pay To")
        } else if (!partyName) {
            toast.error("Please Select Party Name")
        } else if (!(partyTypes === "N" || partyTypes === "O" || partyTypes === "GC") && !activeModal) {
            toast.error("Please Select Party Code")
        } else if (schematicType !== "0" && Number(acCodeDesc) !== 202601005 && !payto) {
            toast.error("Please Enter Pay To")
        }
        else if (grossAmount <= 0) {
            toast.error("Please Enter Gross Amount")
        }
        // else if (!documentType) {
        //     toast.error("Please Select Document Type")
        // } else if (!base64String) {
        //     toast.error("Please Select a File")
        // }
        else if (partyTypes === "GC" && !(netAmount.toFixed(2) === totalDeductionAmount)) {
            toast.error("Voucher Amount and Deduction Amount are not same")
        } else {
            setConfirmSubmitFlag(true);
        }
    }

    const onPageChange = (e) => {
        setPageChange(e.target.value);
        console.log(`Selected option: ${e.target.value}`);

        // Add additional logic here
    };

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

    const onRetrievePassForPayment = () => {
        if (!fromDatePassForPayment) {
            toast.error("Please select From Date")

        } else if (!toDatePassForPayment) {
            toast.error("Please select To Date")

        } else {
            getPassForPaymentDetails(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
                fromDatePassForPayment, toDatePassForPayment, "I", 0,
            ).then(function (result) {
                const response = result?.data;
                console.log(response, "report")
                setPassForPaymentDetailsById(response);
            })
        }


    }

    const onChossePassForPayment = (d) => {
        getPassForPaymentById(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
            d,
        ).then(function (result) {
            const response = result?.data;
            console.log(response, "report")
            setGetPassForPaymentDataById(response);

            setModalPassForPaymentId(false)
            setPassForPaymentDetailsById([])
            setFromDatePassForPayment("");
            setToDatePassForPayment("");
            setPassForPaymentStatus("");
            setPassForPaymentDetailsById([]);
        })


    }


    const onVerifyPop = () => {
        if (!getPassForPaymentDataById?.basic?.pfpId) {
            toast.error("Please Select a Pass for Payment Id")
        } else {
            setVerifyFlag(true);
        }
    }

    const onDeletePop = () => {
        if (!getPassForPaymentDataById?.basic?.pfpId) {
            toast.error("Please Select a Pass for Payment Id")
        }
        else {

            setDeleteFlag(true);

        }
    }

    const onGroupOfContractors = (e) => {
        // setPartyTypes(e.target.value)
        setGroupOfContractors(true)
    }

    const onCloseGroupOfContractors = () => {
        setGroupOfContractors(false)
        setSelectedData([])
        setSelectedIds([])
        setSelectAll(false)
        setGroupOfContractorsData([])
        setAccountHead("")
        setGroupOfContractorsStartDate("")
        setGroupOfContractorsEndDate("")
    }

    const onSaveGroupOfContractors = () => {
        setGroupOfContractors(false)
    }



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

    const onCloseConfirmSubmit = () => {
        setConfirmSubmitFlag(false);
    };

    console.log(selectedIds, selectedData, "tableData")

    const onConfirmSubmit = () => {
        setLoader(true);

        addInsertPassForPayment(
            userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : 0 || userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : 0 || userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
            financialYear, selectedDate, schematicType, expenditureType, activityTheme?.activityCode, activityTheme?.activityDesc, tender,
            activityTheme?.theme1Id, activityTheme?.theme1Name, activityTheme?.theme2Id, activityTheme?.theme2Name, activityTheme?.theme3Id, activityTheme?.theme3Name, activityTheme?.schemeId, workOrder, billType, acCodeDesc, passForPayNarration, partyTypes,
            partyTypes === "C" ? partyName?.contractorId : partyTypes === "E" ? partyName?.empId : partyTypes === "J" ? partyName?.jobWorkerId : partyTypes === "D" ? partyName?.deptId : partyTypes === "L" ? partyName?.lsgCode : "",
            payto ? payto : selectedData[0]?.partyDetails?.substring(13), payAddress,
            netAmount.toFixed(2), totalAmount.toFixed(2), allotementNo, subAllotment == true ? 1 : 0, tableData?.length > 0 ? 1 : 0, documentType, base64String, userData?.USER_INDEX, tableData, firstAccountCode, ids, billRa,
            (r) => {
                console.log(r, "dd");
                if (r.status == 0) {
                    // setOpenModal(true);
                    setLoader(false);
                    setPassforPaymentResponse(r)
                    toast.success(r.message);
                    setConfirmSubmitFlag(false);
                    setShowPopID(true);

                } else if (r.status == 1) {
                    setLoader(false);
                    toast.error(r.message);
                }
            }
        );
    }

    const onClosePopId = () => {
        setShowPopID(false)
        setSaveDisable(true);
        // window.location.reload();
    }


    const onBillRa = (e) => {
        console.log(e.target.value, "billRa")
        setBillRa(e.target.value);
    }

    const onVerifyClose = () => {
        setVerifyFlag(false)
    }

    const onSubmitVerify = () => {
        verifyPassForPayment(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
            getPassForPaymentDataById?.basic?.pfpId, userData?.USER_INDEX,
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

    const onSimilarEntry = () => {
        setSaveDisable(false)
        onGrossAmount(0);
        setTableData([]);
        setDeductedAcCodeValue("");
        setDeductionValue("");
        setSelectedData([]);
        setAccountHead("");
        setGroupOfContractorsStartDate("");
        setGroupOfContractorsEndDate("");
        setGroupOfContractorsData([]);
        setSelectedIds([]);
        setSelectedData([]);

    }

    const onReset = () => {
        window.location.reload();
    }

    const onSubmitDelete = () => {
        if (!deleteReason) {
            toast.error("Please Enter Reason for Deletion")
        } else {
            deletePassForPayment(userData?.USER_LEVEL == "DIST" ? userData?.DIST_LGD : userData?.USER_LEVEL == "BLOCK" ? userData?.BLOCK_LGD : userData?.USER_LEVEL == "GP" ? userData?.GP_LGD : 0,
                getPassForPaymentDataById?.basic?.pfpId, deleteReason, userData?.USER_INDEX,
                (r) => {
                    console.log(r, "dd");
                    if (r.status == 0) {
                        // setOpenModal(true);
                        // setPassforPaymentResponse(r)
                        toast.success(r.message);
                        setGetPassForPaymentDataById("")
                        setDeleteReason("");
                        setDeleteFlag(false)
                        window.location.reload();


                    } else if (r.status == 1) {
                        toast.error(r.message);
                    }
                }
            );
        }
    }


    const onDeleteClose = () => {
        setDeleteFlag(false)
    }
    return (
        <>
            <ToastContainer />

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
                    Pass for Payment ID : {getPassForPaymentDataById?.basic?.voucherId}</h3>
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
            {/* verify pfp */}
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
                    Are you sure you want to verify this Pass for Payment?</h3>
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

            <Modal
                isOpen={showPopID}
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
                <h1 className="text-center text-blue-700 text-2xl font-bold mb-1">
                    Pass for Payment ID : {passforPaymentResponse?.paymentId}<br></br>
                    <span>Pass for Payment Status : {passforPaymentResponse?.sttsVerify}</span>
                </h1>



                {/* Close Button */}
                <div className="mt-8 text-center">


                    <button
                        type="button"
                        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={onClosePopId}
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

            {/* for group of contractors */}

            <Modal
                isOpen={groupOfContractors}
                onRequestClose={() => setIsThemeOpen(false)}
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
                    {partyType}
                </h1>

                {/* Form Row */}
                <div className="flex items-center gap-4 mb-1">


                    {/* Scheme Dropdown */}

                    <div className="flex-2">
                        <label htmlFor="scheme" className="block font-semibold mb-1 text-xs">
                            Head of Accounts:<span className="text-red-500 "> * </span>
                        </label>
                        <input
                            type="text"
                            className="flex-grow text-xs px-3 h-7 outline-none rounded bg-white"
                            placeholder="Account Head"
                            onChange={onAccountHead}
                            value={accountHead}
                        />

                    </div>

                    <div>


                    </div>
                    {headShowDropdown && (
                        <div className="top-28 absolute z-10 bg-white border border-gray-300 rounded shadow-md max-h-30 overflow-y-auto w-[300px]">
                            {accountHeadAllList.length > 0 ? (
                                accountHeadAllList.map((d, index) => (
                                    <div
                                        key={index}
                                        className="text-xs w-full px-2 py-2 border border-gray-300 hover:bg-gray-200 cursor-pointer"
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

                    <div className="flex-2">
                        <label htmlFor="scheme" className="block font-semibold mb-1 text-xs">
                            Search by Contractor name:
                        </label>
                        <input
                            type="text"
                            className="flex-grow text-xs px-3 h-7 outline-none rounded bg-white"
                            placeholder="Search Name"
                            onChange={onSearchContractorName}
                            value={contractorName}
                        />

                    </div>
                    <div className="flex-3">
                        <label htmlFor="activity" className="block font-semibold mb-1 text-xs">
                            From Date:<span className="text-red-500 "> * </span>
                        </label>
                        <input
                            style={{ fontSize: ".75rem" }} type="date"
                            id="activity"
                            onChange={(e) => setGroupOfContractorsStartDate(e.target.value)}
                            value={groupOfContractorsStartDate}
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
                            onChange={(e) => setGroupOfContractorsEndDate(e.target.value)}
                            value={groupOfContractorsEndDate}
                            placeholder="dd/mm/yyyy"
                            className="text-xs w-full px-3 py-1 border border-gray-300 rounded-md"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={onGroupOfContractorsRetrieve}
                        className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                        style={{ marginTop: "24px" }}
                    >
                        RETRIEVE
                    </button>
                </div>
                {selectedData.length > 0 ?
                    <div>
                        <label htmlFor="scheme" className="block font-semibold mb-1 text-xs">
                            Total Deduction Amount: {totalDeductionAmount}
                        </label>
                        <label htmlFor="scheme" className="block font-semibold mb-1 text-xs">
                            Reference Voucher IDs: {ids}
                        </label>
                    </div> : ""}


                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 rounded-md text-xs text-gray-600">
                        <thead className="bg-yellow-100 text-gray-700 font-semibold">
                            <tr>
                                <th className="border px-4 py-2">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="border px-4 py-2">Account Code </th>
                                <th className="border px-4 py-2">Voucher Reference ID</th>
                                <th className="border px-4 py-2">Voucher Date</th>
                                <th className="border px-4 py-2">Amount Deducted</th>
                                <th className="border px-4 py-2">Party Details</th>


                            </tr>
                        </thead>
                        <tbody>
                            {/* Example Row */}
                            {groupOfContractorsData && groupOfContractorsData?.map((d, index) => (
                                <tr key={index}>
                                    <td className="border px-2 py-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(d.voucherId)}
                                            onChange={() => handleCheckboxChange({ id: d?.voucherId, amount: d?.deductionAmount, accountCode: d?.accountCode, partyDetails: d?.partyDetails })}
                                        />
                                    </td>
                                    <td
                                        className="border px-2 py-2 text-center cursor-pointer"
                                    >

                                        {d?.accountCode}
                                    </td>
                                    <td className="border px-2 py-2 text-center cursor-pointer"
                                    >
                                        {d?.voucherId}
                                    </td>
                                    <td className="border px-2 py-2 text-center cursor-pointer"
                                    >

                                        {d?.voucherDate}
                                    </td>
                                    <td className="border px-2 py-2 text-center cursor-pointer"
                                    >

                                        {d?.deductionAmount}
                                    </td>
                                    <td className="border px-2 py-2 text-center cursor-pointer"
                                    >

                                        {d?.partyDetails}
                                    </td>


                                </tr>
                            ))}

                        </tbody>
                    </table>
                    {groupOfContractorsData?.length === 0 ? <div className="flex items-center justify-center bg-gray-200" style={{ marginTop: "10px" }}>
                        <div className="text-center">
                            <h1 className="text-xl font-semibold text-black-800">No Data Found</h1>

                        </div>
                    </div> : ""}
                </div>
                {/* Close Button */}

                <div className="mt-8 text-center">
                    <button
                        type="button"
                        className="px-2 py-1 bg-green-500 text-white rounded-md hover:bg-yellow-600"
                        onClick={onSaveGroupOfContractors}
                    >
                        SAVE
                    </button>
                    &nbsp;
                    <button
                        type="button"
                        className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={onCloseGroupOfContractors}
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
                        List of Pass for Payment details
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
                                    <th className="border px-4 py-2">Account Head</th>
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
                                            {d?.glGroup}
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

            {/* for activity modal */}
            <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
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
                        List of Approved Activities
                    </h1>

                    {/* Form Row */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1">
                            <label htmlFor="activity" className="block font-semibold mb-1 text-xs">
                                E Gramswaraj Code:
                            </label>
                            <input
                                type="text"
                                id="activity"
                                value={egramswarajCode}
                                onChange={(e) => setEgramswarajCode(e.target.value)}
                                placeholder="E Gramswaraj Code..."
                                className="text-xs w-full px-3 py-1 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="text-center text-sm font-semibold text-gray-500 mt-5">OR</div>

                        {/* Year Dropdown */}
                        <div className="flex-2">
                            <label htmlFor="year" className="block font-semibold mb-1 text-xs">
                                Plan Year:
                                <span className="text-red-500 "> * </span>
                            </label>
                            <select
                                id="year"
                                value={year}
                                className="text-xs w-full px-3 py-1 border border-gray-300 rounded-md"
                                onChange={(e) => setYear(e.target.value)}
                            >
                                <option value="" selected>--SELECT YEAR--</option>
                                {yearRanges.map((range, idx) => (
                                    <option key={idx} value={range}>
                                        {range}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-2">
                            <label htmlFor="scheme" className="block font-semibold mb-1 text-xs">
                                Scheme:
                                <span className="text-red-500 "> * </span>
                            </label>
                            <select
                                id="scheme"
                                value={scheme}
                                onChange={(e) => setScheme(e.target.value)}
                                className="text-xs w-full px-3 py-1 border border-gray-300 rounded-md"
                            >
                                <option value="0" selected>--SELECT SCHEME--</option>
                                {schemeList?.map((d) => (

                                    <option value={d?.schemeId}>{d?.schemeName}</option>
                                ))}

                            </select>
                        </div>

                        {/* Activity Input */}
                        <div className="flex-1">
                            <label htmlFor="activity" className="block font-semibold mb-1 text-xs">
                                Activity Name:
                            </label>
                            <input
                                type="text"
                                id="activity"
                                value={activity}
                                onChange={(e) => setActivity(e.target.value)}
                                placeholder="Activity Code or Name..."
                                className="text-xs w-full px-3 py-1 border border-gray-300 rounded-md"
                            />
                        </div>



                        {/* Retrieve Button */}
                        <button
                            type="button"
                            onClick={onRetrieve}
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
                                    <th className="border px-4 py-2">Plan Year</th>
                                    <th className="border px-4 py-2">Scheme & Component</th>
                                    <th className="border px-4 py-2">Activity No</th>
                                    <th className="border px-4 py-2">E Gramswaraj Code</th>
                                    <th className="border px-4 py-2">Activity Name & Description</th>
                                    <th className="border px-4 py-2">Estimated Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Example Row */}
                                {activityDetailsBySchemeList?.map((d, index) => (


                                    <tr>
                                        <td
                                            className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChosse(d)}>

                                            {d?.planYear}
                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChosse(d)}>
                                            {d?.schemeComponent}
                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChosse(d)}>

                                            {d?.activityCode}
                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChosse(d)}>

                                            {d?.eGramId}
                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChosse(d)}>

                                            {d?.activityDesc}
                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onChosse(d)}>

                                            {d?.estimatedCost}
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                        {activityDetailsByScheme?.length === 0 ? <div className="flex items-center justify-center bg-gray-200" style={{ marginTop: "10px" }}>
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
                            onClick={onClose}
                        >
                            CLOSE
                        </button>
                    </div>
                </motion.div>
            </Modal>

            {/* /for tender modal */}
            <Modal
                isOpen={isthemeOpen}
                onRequestClose={() => setIsThemeOpen(false)}
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
                        List of Tenders
                    </h1>
                    <h2 className="text-center text-blue-800 text-sm font-bold mb-1">
                        Activity No and Name :{activityTheme?.activityCode}-{activityTheme?.activityDesc} {activityTheme?.eGramId ? "-" : ""}{activityTheme?.eGramId}
                    </h2>



                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 rounded-md text-xs text-gray-600">
                            <thead className="bg-yellow-100 text-gray-700 font-semibold">
                                <tr>
                                    <th className="border px-4 py-2">Tender ID</th>
                                    <th className="border px-4 py-2">Tender No</th>
                                    <th className="border px-4 py-2">Submission Last Date</th>
                                    <th className="border px-4 py-2">Tender Subject</th>

                                </tr>
                            </thead>
                            <tbody>
                                {/* Example Row */}
                                {tenderAllList?.map((d, index) => (


                                    <tr>
                                        <td
                                            className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onTenderChosse(d?.tenderId)}>

                                            {d?.tenderId}
                                        </td>
                                        <td
                                            className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onTenderChosse(d?.tenderId)}>

                                            {d?.tenderNo}
                                        </td>

                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onTenderChosse(d?.tenderId)}>

                                            {d?.lastDate}
                                        </td>
                                        <td className="border px-2 py-2 text-center cursor-pointer"
                                            onClick={() => onTenderChosse(d?.tenderId)}>

                                            {d?.tenderSubject}
                                        </td>

                                    </tr>
                                ))}

                            </tbody>
                        </table>
                        {tenderAllList?.length === 0 ? <div className="flex items-center justify-center bg-gray-200" style={{ marginTop: "10px" }}>
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
                            onClick={onThemeClose}
                        >
                            CLOSE
                        </button>
                    </div>
                </motion.div>
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

            <div className="flex-grow"
                style={{ marginTop: "-45px" }}
            >
                <div className="mx-auto">
                    <div className="bg-white rounded-lg p-2">

                        <div className="flex w-full items-center justify-between">
                            {/* Left Section */}
                            <legend className="text-lg font-semibold text-gray-700">&nbsp;Pass for Payment</legend>

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
                                {userData?.ROLE === "1" || userData?.ROLE === "2" ?
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
                                        </div></> : ""}
                            </div>
                        </div>

                        {/* </fieldset> */}
                        {pageChange === "Add" ?
                            <div>
                                <div className="flex w-full space-x-4">
                                </div>
                                <fieldset className="border border-gray-300 rounded-lg mb-1">
                                    {/* <legend className="text-lg font-semibold text-gray-700 px-2"></legend> */}
                                    <div className="flex w-full space-x-4 mt-1">
                                        <div className="px-3 w-1/4 flex flex-col mb-1" >
                                            <div class="flex items-center border bg-gray-200 rounded h-8">
                                                <span class="px-2 bg-gray-200 text-xs">Date <span className="text-red-500 ">* </span></span>
                                                <input
                                                    type="date"
                                                    id="activity"
                                                    placeholder="dd/MM/yyyy"
                                                    max={new Date().toISOString().split("T")[0]} // Set max date to today
                                                    className="text-xs w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    onChange={onPaymentDate}
                                                />

                                            </div>
                                        </div>


                                        <div className=" w-1/3 flex" >
                                            <div class="flex items-center border bg-gray-200  rounded h-8">
                                                <span class="px-1 bg-gray-200 text-xs">Schematic Type <span className="text-red-500 ">* </span></span>
                                                <select id="DISTRICT" class="flex-grow text-xs px-2 py-1 h-8 outline-none rounded" onChange={onSchematicType}>
                                                    <option value="" selected>--Select Schematic Type--</option>
                                                    <option value="1">Work</option>
                                                    <option value="2">Non-work</option>
                                                    <option value="0">None</option>

                                                </select>
                                            </div>
                                        </div>

                                        <div className=" w-1/3 flex flex-col" >
                                            <div class="flex items-center border bg-gray-200 rounded h-8">
                                                <span class="px-2 bg-gray-200 text-xs">Exp Type<span className="text-red-500 "> * </span></span>

                                                {schematicType === "0" ?
                                                    <select value={expenditureType} id="DISTRICT" class="flex-grow text-xs px-2 py-1 h-8 outline-none rounded" onChange={onExpenditureType}>
                                                        <option value="" selected>--Select Expenditure Type--</option>
                                                        <option value="0">Others</option>
                                                    </select> :
                                                    <select value={expenditureType} id="DISTRICT" class="flex-grow text-xs px-2 py-1 h-8 outline-none rounded" onChange={onExpenditureType}>
                                                        <option value="" selected>--Select Expenditure Type--</option>
                                                        <option value="1">Compact</option>
                                                        <option value="2">Material</option>
                                                        <option value="3">Wage</option>
                                                        <option value="4">Contigency</option>
                                                        <option value="0">Others</option>
                                                    </select>}
                                            </div>
                                        </div>

                                        <div className="px-3 w-1/3 flex flex-col" >
                                            <div class="flex items-center border bg-gray-200 rounded h-8">
                                                <span class="px-2 bg-gray-200 text-xs">Allotment No</span>
                                                <input
                                                    type="input"
                                                    id="activity"
                                                    placeholder="Allotment No"
                                                    className="text-xs w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    onChange={onAllotementNo}
                                                    maxLength={200}
                                                    value={allotementNo}
                                                />
                                            </div>
                                        </div>


                                    </div>

                                    {schematicType === "1" || schematicType === "2" ?
                                        <>

                                            <div className="flex w-full space-x-4 mt-1">
                                                <div className="px-3 w-full flex flex-col">
                                                    <div className="flex items-center border bg-gray-200 rounded h-8">
                                                        <span className="px-2 bg-gray-200 text-xs">Activity Code & Name<span className="text-red-500 "> * </span></span>
                                                        <div className="w-1/6 flex items-center border bg-gray-200 rounded h-8">
                                                            <input
                                                                type="url"
                                                                className="flex-grow text-xs px-3 py-2 h-8 outline-none rounded"
                                                                placeholder="Activity Code"
                                                                value={activityTheme?.activityCode}
                                                                disabled
                                                            />
                                                        </div>

                                                        <input
                                                            type="url"
                                                            className="flex-grow text-xs px-3 py-2 h-8 outline-none rounded"
                                                            placeholder="Activity Name"
                                                            value={activityTheme?.activityDesc}
                                                            disabled
                                                        />
                                                        <button className="px-2 h-8 flex items-center justify-center bg-blue-500 text-white rounded-r" onClick={onActivityDetailils}>
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
                                                    <div class="flex items-center border bg-gray-200 rounded h-8">
                                                        <span class="px-2 bg-gray-200 text-xs">Scheme</span>
                                                        <input type="url" class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded" disabled placeholder="Scheme" value={activityTheme?.schemeName} />
                                                    </div>
                                                </div>

                                                <div className="px-3 w-full flex flex-col">
                                                    <div class="flex items-center border bg-gray-200 rounded h-8">
                                                        <span class="px-2 bg-gray-200 text-xs">Theme</span>
                                                        <input type="url" class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded" disabled placeholder="Theme" value={activityTheme?.themeConcat} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex w-full mt-1">
                                                <div className="px-2 w-1/3 flex flex-col ml-1">

                                                    <div class="flex items-center border bg-gray-200 rounded h-8">
                                                        <span class="px-2 bg-gray-200 text-xs">Tender ID</span>
                                                        <input type="url" class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded" placeholder="Tender ID" value={tender} disabled />
                                                        <button className="px-2 h-8 flex items-center justify-center bg-blue-500 text-white rounded-r" onClick={onTenderNo}>
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
                                                <div className="px-5 w-1/3 flex flex-col">

                                                    <div class="flex items-center border bg-gray-200 rounded h-8">
                                                        <span class="px-2 bg-gray-200 text-xs">Work order no<span className="text-red-500 "> * </span></span>
                                                        <input type="url" class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded" placeholder="Work order No" value={workOrder} onChange={onWorkOrder} />

                                                    </div>
                                                </div>

                                                <div className="px-3 w-1/3 flex flex-col" >
                                                    <div class="flex items-center border bg-gray-200 rounded h-8 mr-1">
                                                        <span class="px-2 bg-gray-200 text-xs">Bill Type<span className="text-red-500 "> * </span></span>
                                                        <select id="DISTRICT" class="flex-grow text-xs py-1 h-8 outline-none rounded" onChange={onBillType} value={billType}>
                                                            <option value="">--Select Bill Type--</option>
                                                            <option value="1">RA</option>
                                                            <option value="2">Restricted </option>
                                                            <option value="3">Final</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                {billType === "1" ?
                                                    <div className="px-4 w-1/4 flex flex-col">

                                                        <div class="flex items-center border bg-gray-200 rounded h-8">
                                                            <span class="px-2 bg-gray-200 text-xs">RA No<span className="text-red-500 "> * </span></span>
                                                            <input type="number" class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded" placeholder="Type RA No" value={billRa} onChange={onBillRa} />

                                                        </div>
                                                    </div> : ""}
                                            </div>
                                        </> : ""}







                                </fieldset>

                                <fieldset className="border border-gray-300 rounded-lg mb-1">
                                    <div className="flex w-full space-x-4 mt-1" >


                                        <div className="px-3 w-1/2 flex flex-col relative">
                                            <div className="flex items-center border bg-gray-200 rounded h-8">
                                                <span className="px-2 bg-gray-200 text-xs">GL Group<span className="text-red-500 "> * </span></span>
                                                <input
                                                    type="url"
                                                    className="flex-grow text-xs px-3 py-2 h-8 outline-none rounded"
                                                    placeholder="Search GL Group Name..."
                                                    onChange={onPartyType}
                                                    value={partyType}// Call the function when input changes

                                                />
                                            </div>

                                            {showDropdown && (
                                                <div className="absolute top-full left-20 z-10  bg-white border border-gray-300 rounded shadow-md max-h-30 overflow-y-auto ml-4 w-[285px]">
                                                    {partyTypeAllList.length > 0 ? (
                                                        partyTypeAllList.map((d, index) => (
                                                            <div
                                                                key={index}
                                                                className="text-xs w-full px-2 py-2 border border-gray-300 hover:bg-gray-200 cursor-pointer"
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

                                        <div className="w-full flex flex-col mb-1 px-3">
                                            <div class="flex items-center bg-gray-200 rounded h-8">
                                                <span class="px-2 bg-gray-200 text-xs">A/C Code Desc<span className="text-red-500 "> * </span></span>
                                                <select value={acCodeDesc} id="DISTRICT" class="flex-grow text-xs px-2 py-1 h-8 outline-none rounded" onChange={onAcCodeDesc}>
                                                    <option value="">--Select A/C Code Desc--</option>
                                                    {acCodeDescAllList.map((d, i) => (
                                                        <option value={d?.accountCode}>{d?.accountCode}-{d?.accountCodeDesc}</option>
                                                    ))}


                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex w-full space-x-4">
                                        <div className="px-3 w-full flex flex-col mb-1">
                                            <div class="flex items-center border bg-gray-200 rounded h-8">
                                                <span class="px-2 bg-gray-200 text-xs">Pass for Payment Narration<span className="text-red-500 "> * </span></span>
                                                <input type="url" class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded" placeholder="Pass for payment narration" onChange={onPassForPayNarration} value={passForPayNarration} />
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>

                                <fieldset className="border border-gray-300 rounded-lg ">
                                    <div className="flex w-full space-x-4 mt-1">
                                        <div className="px-3 w-1/2 flex flex-col" >
                                            <div class="flex items-center border bg-gray-200 rounded h-8">
                                                <span class="px-2 bg-gray-200 text-xs">Party Type<span className="text-red-500 "> * </span></span>
                                                {acCodeDesc?.length >= 5 && acCodeDesc[3] === "6" && acCodeDesc[4] === "0" && acCodeDesc[5] === "1" ?
                                                    <select id="DISTRICT"
                                                        className="flex-grow text-xs px-2 py-1 h-7 outline-none rounded"
                                                        onChange={onPartyTypes}
                                                        value={partyTypes}
                                                    >
                                                        <option value="">--Select Party Type--</option>
                                                        <option value="GC">Group of Contractor</option>

                                                    </select> :

                                                    <select id="DISTRICT"
                                                        className="flex-grow text-xs px-2 py-1 h-7 outline-none rounded"
                                                        onChange={onPartyTypes}
                                                        value={partyTypes}

                                                    >
                                                        <option value="">--Select Party Type--</option>
                                                        <option value="O">Others</option>
                                                        <option value="E">Employee</option>
                                                        <option value="C">Contractor</option>
                                                        <option value="J">Job Worker</option>
                                                        <option value="D">Department</option>
                                                        <option value="L">LSG</option>
                                                        <option value="B">Benificiary</option>
                                                    </select>
                                                }
                                            </div>
                                        </div>


                                        <div className="px-3 w-full flex flex-col" style={{ paddingRight: "12px" }}>
                                            <div className="flex items-center border bg-gray-200 rounded h-8">
                                                <span className="px-2 bg-gray-200 text-xs">Party Details<span className="text-red-500 "> * </span></span>
                                                <div className="w-1/6 flex items-center border bg-gray-200 rounded h-8">
                                                    <input
                                                        type="url"
                                                        className="flex-grow text-xs px-3 py-2 h-8 outline-none rounded"
                                                        placeholder="Party Code"
                                                        value={partyTypes === "C" ? partyName?.contractorId : partyTypes === "E" ? partyName?.empId : partyTypes === "J" ? partyName?.jobWorkerId : partyTypes === "D" ? partyName?.deptId : partyTypes === "L" ? partyName?.lsgCode : ""}
                                                        disabled
                                                    />
                                                </div>

                                                <input
                                                    type="url"
                                                    className="flex-grow text-xs px-3 py-2 h-8 outline-none rounded"
                                                    placeholder="Party Details"
                                                    value={partyTypes === "C" ? partyName?.contractorNm : partyTypes === "E" ? partyName?.empName : partyTypes === "J" ? partyName?.jobWorkerName : partyTypes === "D" ? partyName?.deptName : partyTypes === "L" ? partyName?.lsgName : ""}

                                                    disabled
                                                />
                                                {partyTypes === "GC" ?
                                                    <button className="px-2 h-8 flex items-center justify-center bg-blue-500 text-white rounded-r" onClick={onGroupOfContractors}>
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
                                                    </button> :

                                                    <button className="px-2 h-8 flex items-center justify-center bg-blue-500 text-white rounded-r" disabled={!partyTypes || partyTypes === "N" || partyTypes === "O"} onClick={onPartyDetails}>
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
                                                    </button>}
                                            </div>
                                        </div>

                                    </div>

                                    <div className="flex w-full space-x-4 mt-1">
                                        <div className="px-3 w-1/2 flex flex-col mb-1">

                                            <div class="flex items-center border bg-gray-200 rounded h-8">
                                                <input type="url"
                                                    class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded"
                                                    placeholder="Pay to"
                                                    value={Number(acCodeDesc) === 202601005 ? selectedData[0]?.partyDetails?.substring(13) : payto}
                                                    onChange={onPayTo}
                                                />
                                            </div>
                                        </div>

                                        <div className="px-3 w-full flex flex-col">
                                            <div className="flex items-center border bg-gray-200 rounded h-8">
                                                <span className="px-2 bg-gray-200 text-xs">Party Address</span>
                                                <input
                                                    type="url"
                                                    className="flex-grow text-xs px-3 py-2 h-8 outline-none rounded"
                                                    placeholder="Party Address"
                                                    value={payAddress}
                                                    onChange={onPayAddress}
                                                />
                                                {partyTypes === "L" || partyTypes === "D" ?
                                                    <>
                                                        <span class="px-2 bg-gray-200 text-xs">Sub-Allotment</span>
                                                        <input
                                                            type="checkbox"
                                                            className="rounded"
                                                            onChange={onSubAllotment}
                                                            checked={subAllotment}

                                                        // You can add logic for checkbox state here, e.g. checked={isChecked}
                                                        /></> : ""}
                                            </div>
                                        </div>

                                    </div>
                                </fieldset>
                                {selectedData.length > 0 ?
                                    <div>
                                        <label htmlFor="scheme" className="block font-semibold mb-1 text-xs">
                                            Total Deduction Amount: {totalDeductionAmount} and Reference Voucher IDs: {ids}
                                        </label>
                                    </div> : ""}
                                <div className="flex w-full space-x-4 mt-1" style={{ marginLeft: "5px" }}>
                                    <div className="px-2 w-1/3 flex flex-col mb-1">

                                        <div class="flex items-center border bg-gray-200 rounded h-8">
                                            <span class="px-2 bg-gray-200 text-xs">Gross Amount<span className="text-red-500 "> * </span></span>
                                            <input type="number"
                                                class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded"
                                                placeholder="Gross Amount (Rs.)"
                                                onChange={(e) => {
                                                    setHasEditedGross(true);            // User has edited
                                                    onGrossAmount(e.target.value);
                                                }}
                                                value={grossAmount}

                                            />

                                        </div>
                                    </div>

                                    <div className="px-3 w-1/3 flex flex-col mb-1">

                                        <div class="flex items-center border bg-gray-200 rounded h-8" style={{ marginLeft: "4px" }}>
                                            <span class="px-2 bg-gray-200 text-xs">Deduction(Rs.)</span>
                                            <input type="text" class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded" placeholder="Deduction (Rs.)" value={totalAmount} disabled />

                                        </div>
                                    </div>

                                    <div className="px-4 w-1/3 flex flex-col">

                                        <div class="flex items-center border bg-gray-200 rounded h-8">
                                            <span class="px-2 bg-gray-200 text-xs">Net Amount (Rs.)</span>
                                            <input type="url" class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded" placeholder="Net Amount (Rs.)" disabled value={netAmount.toFixed(2)} />

                                        </div>
                                    </div>



                                </div>

                                {partyTypes === "C" || partyTypes === "E" ?
                                    <>
                                        <div className="flex w-full space-x-4 mt-1" >

                                            <div className="px-3 w-full flex flex-col mb-1" style={{ marginRight: "5px" }}>
                                                <div className="flex items-center bg-gray-200 rounded h-8" >
                                                    <span className="px-2 bg-gray-200 text-xs">Deducted A/C Code</span>
                                                    <select
                                                        id="DISTRICT"
                                                        className="flex-grow text-xs px-2 py-1 h-full outline-none rounded"
                                                        onChange={(e) => setDeductedAcCodeValue(JSON.parse(e.target.value))}
                                                    // value={deductedAcCodeValue}
                                                    >

                                                        <option value="0">--Select Deducted A/C Code--</option>

                                                        {accDeductList?.map((d) => (

                                                            <option value={JSON.stringify(d)}>{d?.accountCodeDesc}</option>
                                                        ))}
                                                    </select>

                                                </div>
                                            </div>

                                            <div className="px-3 w-1/3 flex flex-col relative">
                                                <div className="flex items-center border bg-gray-200 rounded h-8">
                                                    <span className="px-2 bg-gray-200 text-xs">Deduction</span>
                                                    <input
                                                        type="url"
                                                        className="flex-grow text-xs px-3 py-2 h-8 outline-none rounded"
                                                        placeholder="Deduction Amount (RS.)"
                                                        onChange={(e) => setDeductionValue(e.target.value)}
                                                        value={deductionValue}

                                                    />
                                                    <button
                                                        className="px-3 h-full bg-blue-500 text-white text-xs rounded-r flex items-center justify-center hover:bg-blue-600"
                                                        onClick={onDeductionAdd}
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full">
                                            <label className="text-xs font-semibold">Deduction Details:</label>
                                            <div className="overflow-y-auto h-28 border border-gray-300 rounded"> {/* Scrollable container */}
                                                <table className="table-auto w-full border-collapse">
                                                    <thead className="bg-gray-200">
                                                        <tr>
                                                            <th className="border border-gray-300 px-4 py-1 text-xs text-gray-700 sticky top-0 bg-gray-200">Sl. No.</th>
                                                            <th className="border border-gray-300 px-4 py-1 text-xs text-gray-700 sticky top-0 bg-gray-200">Deduction A/c Code</th>
                                                            <th className="border border-gray-300 px-4 py-1 text-xs text-gray-700 sticky top-0 bg-gray-200">Account Code Desc</th>
                                                            <th className="border border-gray-300 px-4 py-1 text-xs text-gray-700 sticky top-0 bg-gray-200">Deducted Amount</th>
                                                            <th className="border border-gray-300 px-4 py-1 text-xs text-gray-700 sticky top-0 bg-gray-200">Delete</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {/* Blank Row Example */}

                                                        {tableData.length > 0 ? (
                                                            tableData.map((row, index) => (
                                                                <tr>
                                                                    <td className="border border-gray-300 px-4 py-1 text-xs text-center ">{index + 1}</td>
                                                                    <td className="border border-gray-300 px-4 py-1 text-xs text-center">{row.accountCode}</td>
                                                                    <td className="border border-gray-300 px-4 py-1 text-xs text-center">{row.accountCodeDesc}</td>
                                                                    <td className="border border-gray-300 px-4 py-1 text-xs text-center">{row.deductionAmount}</td>
                                                                    <td className="border border-gray-300 px-4 py-1 text-xs text-center">
                                                                        <button
                                                                            className="text-red-500 hover:underline"
                                                                            onClick={() => onDeleteTableItem(index)}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="5" className="border border-gray-300 px-4 py-2 text-center">
                                                                    No data available
                                                                </td>
                                                            </tr>
                                                        )}

                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </> : ""}



                                <div className="flex items-center">
                                    {/* Document Type Label and Input */}
                                    <div class="ml-3 w-1/2 flex items-center border bg-gray-200 rounded h-8">
                                        <span class="px-2 bg-gray-200 text-xs">Document Type</span>
                                        <input type="text"
                                            class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded"
                                            placeholder="Enter Document Type..."
                                            onChange={onDocumentType}
                                            value={documentType}

                                        />

                                    </div>

                                    {/* Upload Button */}
                                    <div className="flex items-center px-3">
                                        <input
                                            type="File"
                                            id="pdfUpload"
                                            accept="application/pdf"
                                            onChange={onFile}
                                            className="rounded text-xs"
                                        />

                                    </div>
                                </div>
                            </div> : ""}



                        {/* /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
                        // page for query verify and delete*/}

                        {pageChange === "Query" || pageChange === "Verify" || pageChange === "Delete" ?
                            <div>
                                <div className="flex w-full space-x-4">
                                    <div className="px-3 w-1/2 flex flex-col mb-1">

                                        <div class="flex items-center border bg-gray-200 rounded h-8">
                                            <span class="px-2 bg-gray-200 text-xs">Pass for Payment ID</span>
                                            <input type="url" class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded" placeholder="Pass for Payment ID" disabled value={getPassForPaymentDataById?.basic?.pfpId} />

                                            <button className="px-2 h-8 flex items-center justify-center bg-blue-500 text-white rounded-r" onClick={onPassForPaymentId}>
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

                                    <div className="px-3 w-1/2 flex flex-col">

                                        <div class="flex items-center border bg-gray-200 rounded h-8">
                                            <span class="px-2 bg-gray-200 text-xs">Pass for Payment Status</span>
                                            <input type="url" class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded" placeholder="Pass for Payment Status" disabled value={getPassForPaymentDataById?.basic?.pfpStts} />

                                        </div>
                                    </div>



                                </div>
                                <fieldset className="border border-gray-300 rounded-lg mb-1">
                                    {/* <legend className="text-lg font-semibold text-gray-700 px-2"></legend> */}
                                    <div className="flex w-full space-x-4 mt-1">
                                        <div className="px-3 w-1/4 flex flex-col mb-1" >
                                            <div class="flex items-center border bg-gray-200 rounded h-8">
                                                <span class="px-2 bg-gray-200 text-xs">Date<span className="text-red-500 "> * </span></span>
                                                <input
                                                    type="text"
                                                    id="activity"
                                                    placeholder="dd/MM/yyyy"
                                                    className="text-xs w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    disabled
                                                    value={getPassForPaymentDataById?.basic?.paymentDate}
                                                />
                                            </div>
                                        </div>


                                        <div className=" w-1/3 flex" >
                                            <div class="flex items-center border bg-gray-200  rounded h-8">
                                                <span class="px-1 bg-gray-200 text-xs">Schematic Type<span className="text-red-500 "> * </span></span>
                                                <input
                                                    type="text"
                                                    id="activity"
                                                    placeholder="Schematic Type"
                                                    className="text-xs w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    disabled
                                                    value={getPassForPaymentDataById?.basic?.schemeType == 1 ? "Work" : getPassForPaymentDataById?.basic?.schemeType == 2 ? "Non-Work" : getPassForPaymentDataById?.basic?.schemeType == 0 ? "None" : ""}
                                                />
                                            </div>
                                        </div>

                                        <div className=" w-1/3 flex flex-col" >
                                            <div class="flex items-center border bg-gray-200 rounded h-8">
                                                <span class="px-2 bg-gray-200 text-xs">Exp Type<span className="text-red-500 "> * </span></span>
                                                <input
                                                    type="text"
                                                    id="activity"
                                                    placeholder="Exp Type"
                                                    className="text-xs w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    disabled
                                                    value={getPassForPaymentDataById?.basic?.expType == 1 ? "Compact" : getPassForPaymentDataById?.basic?.expType == 2 ? "Material" : getPassForPaymentDataById?.basic?.expType == 3 ? "Wage" : getPassForPaymentDataById?.basic?.expType == 4 ? "Contigency" : getPassForPaymentDataById?.basic?.expType == 0 ? "Others" : ""}
                                                />
                                            </div>
                                        </div>

                                        <div className="px-3 w-1/3 flex flex-col" >
                                            <div class="flex items-center border bg-gray-200 rounded h-8">
                                                <span class="px-2 bg-gray-200 text-xs">Allot No</span>
                                                <input
                                                    type="text"
                                                    id="activity"
                                                    placeholder="Allotment No"
                                                    className="text-xs w-full px-3 py-2 border border-gray-300 rounded-md"
                                                    disabled
                                                    value={getPassForPaymentDataById?.basic?.allotmentNo}
                                                />
                                            </div>
                                        </div>


                                    </div>


                                    <>

                                        <div className="flex w-full space-x-4 mt-1">
                                            <div className="px-3 w-full flex flex-col">
                                                <div className="flex items-center border bg-gray-200 rounded h-8">
                                                    <span className="px-2 bg-gray-200 text-xs">Activity Code & Name<span className="text-red-500 "> * </span></span>
                                                    <div className="w-1/6 flex items-center border bg-gray-200 rounded h-8">
                                                        <input
                                                            type="text"
                                                            className="flex-grow text-xs px-3 py-2 h-8 outline-none rounded"
                                                            placeholder="Activity Code"
                                                            disabled
                                                            value={getPassForPaymentDataById?.basic?.accountCode}
                                                        />
                                                    </div>

                                                    <input
                                                        type="text"
                                                        className="flex-grow text-xs px-3 py-2 h-8 outline-none rounded"
                                                        placeholder="Activity Name"
                                                        disabled
                                                        value={getPassForPaymentDataById?.basic?.accountCodeDesc}
                                                    />

                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex w-full space-x-4 mt-1">
                                            <div className="px-3 w-1/2 flex flex-col">
                                                <div class="flex items-center border bg-gray-200 rounded h-8">
                                                    <span class="px-2 bg-gray-200 text-xs">Scheme</span>
                                                    <input type="url" class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded" disabled placeholder="Scheme" value={getPassForPaymentDataById?.basic?.schemeName} />
                                                </div>
                                            </div>


                                            <div className="px-3 w-1/2 flex flex-col">
                                                <div class="flex items-center border bg-gray-200 rounded h-8">
                                                    <span class="px-2 bg-gray-200 text-xs">Theme</span>
                                                    <input type="url" class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded" disabled placeholder="Theme" value={getPassForPaymentDataById?.basic?.theme1Name + getPassForPaymentDataById?.basic?.theme2Name + getPassForPaymentDataById?.basic?.theme3Name} />
                                                </div>
                                            </div>





                                        </div>

                                        <div className="flex w-full space-x-4 mt-1">
                                            <div className="px-2 w-1/3 flex flex-col ml-1">

                                                <div class="flex items-center border bg-gray-200 rounded h-8">
                                                    <span class="px-2 bg-gray-200 text-xs">Tender No</span>
                                                    <input type="url" class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded" placeholder="Tender No" disabled value={getPassForPaymentDataById?.basic?.tenderNo} />

                                                </div>
                                            </div>
                                            <div className="px-4 w-1/3 flex flex-col">

                                                <div class="flex items-center border bg-gray-200 rounded h-8">
                                                    <span class="px-2 bg-gray-200 text-xs">Work order no<span className="text-red-500 "> * </span></span>
                                                    <input type="url" class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded" placeholder="Work order No" disabled value={getPassForPaymentDataById?.basic?.woNo} />

                                                </div>
                                            </div>

                                            <div className=" w-1/3 flex flex-col" >
                                                <div class="flex items-center border bg-gray-200 rounded h-8 mr-3">
                                                    <span class="px-2 bg-gray-200 text-xs">Bill Type<span className="text-red-500 "> * </span></span>
                                                    <input
                                                        type="text"
                                                        id="activity"
                                                        placeholder="Bill Type"
                                                        className="text-xs w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        disabled
                                                        value={getPassForPaymentDataById?.basic?.billType == 1 ? "RA-1" : getPassForPaymentDataById?.basic?.billType == 2 ? "RA-2" : "Final"}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>







                                </fieldset>

                                <fieldset className="border border-gray-300 rounded-lg mb-1">
                                    <div className="flex w-full space-x-4 mt-1" >


                                        <div className="px-3 w-1/2 flex flex-col relative">
                                            <div className="flex items-center border bg-gray-200 rounded h-8">
                                                <span className="px-2 bg-gray-200 text-xs">GL Group<span className="text-red-500 "> * </span></span>
                                                <input
                                                    type="url"
                                                    className="flex-grow text-xs px-3 py-2 h-8 outline-none rounded"
                                                    placeholder="GL Group"
                                                    disabled
                                                    value={getPassForPaymentDataById?.basic?.glGroupName}
                                                />
                                            </div>

                                        </div>

                                        <div className="w-full flex flex-col mb-1 px-3">
                                            <div class="flex items-center bg-gray-200 rounded h-8">
                                                <span class="px-2 bg-gray-200 text-xs">A/C Code Desc<span className="text-red-500 "> * </span></span>
                                                <input
                                                    type="url"
                                                    className="flex-grow text-xs px-3 py-2 h-8 outline-none rounded"
                                                    placeholder="A/C Code Desc"
                                                    disabled
                                                    value={getPassForPaymentDataById?.basic?.accountCodeDesc}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex w-full space-x-4">
                                        <div className="px-3 w-full flex flex-col mb-1">
                                            <div class="flex items-center border bg-gray-200 rounded h-8">
                                                <span class="px-2 bg-gray-200 text-xs">Pass for Payment Narration<span className="text-red-500 "> * </span></span>
                                                <input type="url" class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded" placeholder="Pass for payment narration" disabled value={getPassForPaymentDataById?.basic?.paymentDesc} />
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>

                                <fieldset className="border border-gray-300 rounded-lg ">
                                    <div className="flex w-full space-x-4 mt-1">
                                        <div className="px-3 w-1/2 flex flex-col" >
                                            <div class="flex items-center border bg-gray-200 rounded h-8">
                                                <span class="px-2 bg-gray-200 text-xs">Party Type<span className="text-red-500 "> * </span></span>
                                                <input type="url" class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded" placeholder="Party Type" disabled
                                                    value={getPassForPaymentDataById?.basic?.partyType === "N" ? "None" : getPassForPaymentDataById?.basic?.partyType === "C" ? "Contractor" : getPassForPaymentDataById?.basic?.partyType === "E" ? "Employee" : getPassForPaymentDataById?.basic?.partyType === "J" ? "Job Worker" : getPassForPaymentDataById?.basic?.partyType === "D" ? "Department" : getPassForPaymentDataById?.basic?.partyType === "L" ? "LSG" : getPassForPaymentDataById?.basic?.partyType === "B" ? "Benificiary" : getPassForPaymentDataById?.basic?.partyType === "O" ? "Others" : ""}
                                                />


                                            </div>
                                        </div>


                                        <div className="px-3 w-full flex flex-col" style={{ paddingRight: "12px" }}>
                                            <div className="flex items-center border bg-gray-200 rounded h-8">
                                                <span className="px-2 bg-gray-200 text-xs">Party Details<span className="text-red-500 "> * </span></span>
                                                <div className="w-1/6 flex items-center border bg-gray-200 rounded h-8">
                                                    <input
                                                        type="url"
                                                        className="flex-grow text-xs px-3 py-2 h-8 outline-none rounded"
                                                        placeholder="Party Code"
                                                        disabled
                                                        value={getPassForPaymentDataById?.basic?.partyCode}
                                                    />
                                                </div>

                                                <input
                                                    type="url"
                                                    className="flex-grow text-xs px-3 py-2 h-8 outline-none rounded"
                                                    placeholder="Party Details"
                                                    disabled
                                                    value={getPassForPaymentDataById?.basic?.partyName}
                                                />
                                            </div>
                                        </div>

                                    </div>

                                    <div className="flex w-full space-x-4 mt-1">
                                        <div className="px-3 w-1/2 flex flex-col mb-1">

                                            <div class="flex items-center border bg-gray-200 rounded h-8">
                                                <span class="px-2 bg-gray-200 text-xs">Pay to</span>
                                                <input type="url"
                                                    class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded"
                                                    placeholder="Pay to"
                                                    disabled
                                                    value={getPassForPaymentDataById?.basic?.payTo}
                                                />

                                            </div>
                                        </div>

                                        <div className="px-3 w-full flex flex-col">
                                            <div className="flex items-center border bg-gray-200 rounded h-8">
                                                <span className="px-2 bg-gray-200 text-xs">Party Address</span>
                                                <input
                                                    type="url"
                                                    className="flex-grow text-xs px-3 py-2 h-8 outline-none rounded"
                                                    placeholder="Party Address"
                                                    disabled
                                                    value={getPassForPaymentDataById?.basic?.payAddress}
                                                />

                                                <>
                                                    <span class="px-2 bg-gray-200 text-xs">Sub-Allotment</span>
                                                    <input
                                                        type="checkbox"
                                                        className="rounded"
                                                        onChange={onSubAllotment}
                                                        checked={getPassForPaymentDataById?.basic?.subAllot === "1" ? true : false}

                                                    // You can add logic for checkbox state here, e.g. checked={isChecked}
                                                    /></>
                                            </div>
                                        </div>

                                    </div>
                                </fieldset>

                                <div className="flex w-full space-x-4 mt-1" style={{ marginLeft: "5px" }}>
                                    <div className="px-2 w-1/3 flex flex-col mb-1">

                                        <div class="flex items-center border bg-gray-200 rounded h-8">
                                            <span class="px-2 bg-gray-200 text-xs">Gross Amount<span className="text-red-500 "> * </span></span>
                                            <input type="number"
                                                class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded"
                                                placeholder="Gross Amount (Rs.)"
                                                disabled
                                                value={Number(getPassForPaymentDataById?.basic?.deductAmount) + Number(getPassForPaymentDataById?.basic?.netAmount)}

                                            />

                                        </div>
                                    </div>

                                    <div className="px-3 w-1/3 flex flex-col mb-1">

                                        <div class="flex items-center border bg-gray-200 rounded h-8" style={{ marginLeft: "4px" }}>
                                            <span class="px-2 bg-gray-200 text-xs">Deduction(Rs.)</span>
                                            <input type="text" class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded" placeholder="Deduction (Rs.)" disabled
                                                value={getPassForPaymentDataById?.basic?.deductAmount}
                                            />

                                        </div>
                                    </div>

                                    <div className="px-4 w-1/3 flex flex-col">

                                        <div class="flex items-center border bg-gray-200 rounded h-8">
                                            <span class="px-2 bg-gray-200 text-xs">Net Amount (Rs.)</span>
                                            <input type="url" class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded" placeholder="Net Amount (Rs.)" disabled value={getPassForPaymentDataById?.basic?.netAmount} />

                                        </div>
                                    </div>



                                </div>

                                <>


                                    <div className="w-full">
                                        <label className="text-xs font-semibold">Deduction Details:</label>
                                        <div className="overflow-y-auto h-28 border border-gray-300 rounded"> {/* Scrollable container */}
                                            <table className="table-auto w-full border-collapse">
                                                <thead className="bg-gray-200">
                                                    <tr>
                                                        <th className="border border-gray-300 px-4 py-1 text-xs text-gray-700 sticky top-0 bg-gray-200">Sl. No.</th>
                                                        <th className="border border-gray-300 px-4 py-1 text-xs text-gray-700 sticky top-0 bg-gray-200">Deduction A/c Code</th>
                                                        <th className="border border-gray-300 px-4 py-1 text-xs text-gray-700 sticky top-0 bg-gray-200">Account Code Desc</th>
                                                        <th className="border border-gray-300 px-4 py-1 text-xs text-gray-700 sticky top-0 bg-gray-200">Deducted Amount</th>
                                                        {/* <th className="border border-gray-300 px-4 py-1 text-xs text-gray-700 sticky top-0 bg-gray-200">Delete</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* Blank Row Example */}

                                                    {getPassForPaymentDataById?.deduct?.length > 0 ? (
                                                        getPassForPaymentDataById?.deduct?.map((row, index) => (
                                                            <tr>
                                                                <td className="border border-gray-300 px-4 py-1 text-xs text-center ">{index + 1}</td>
                                                                <td className="border border-gray-300 px-4 py-1 text-xs text-center">{row.accountCode}</td>
                                                                <td className="border border-gray-300 px-4 py-1 text-xs text-center">{row.accountDesc}</td>
                                                                <td className="border border-gray-300 px-4 py-1 text-xs text-center">{row.deductionAmount}</td>

                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="5" className="border border-gray-300 px-4 py-2 text-center">
                                                                No data available
                                                            </td>
                                                        </tr>
                                                    )}

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>



                                <div className="flex items-center">
                                    {/* Document Type Label and Input */}
                                    <div class="ml-3 w-1/2 flex items-center border bg-gray-200 rounded h-8">
                                        <span class="px-2 bg-gray-200 text-xs">Document Type</span>
                                        <input type="text"
                                            class="flex-grow text-xs px-3 py-2 h-8 outline-none rounded"
                                            placeholder="Enter Document Type..."
                                            disabled
                                            value={getPassForPaymentDataById?.basic?.docType}

                                        />

                                    </div>

                                    {/* Upload Button */}
                                    <button
                                        onClick={() => window.open("https://javaapi.wbpms.in/" + getPassForPaymentDataById?.basic?.docFile)}
                                        className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                                        title="View PDF"
                                        disabled={!getPassForPaymentDataById?.basic?.docFile}
                                    >

                                        <FontAwesomeIcon icon={faEye} title="View File" />

                                    </button>
                                </div>

                            </div> : ""}

                        <div className="flex justify-center space-x-4 py-1">
                            {pageChange === "Add" ?
                                <button className="bg-green-500 text-white px-4 py-1 text-xs rounded hover:bg-green-600 transition duration-200" disabled={saveDisable ? true : false} onClick={onSave}>
                                    Save
                                </button> : ""}
                            {pageChange === "Add" ?
                                <button className="bg-orange-500 text-white px-4 py-1 text-xs rounded hover:bg-orange-700 transition duration-200" disabled={saveDisable ? false : true} onClick={onSimilarEntry}>
                                    Similar Entry
                                </button> : ""}
                            {/* {pageChange === "Query" ?

                                < button className="bg-blue-500 text-white px-4 py-1 text-xs rounded hover:bg-blue-600 transition duration-200">
                                    Query
                                </button> : ""} */}
                            {pageChange === "Verify" ?

                                <button className="bg-yellow-500 text-white px-4 py-1 text-xs rounded hover:bg-yellow-600 transition duration-200" onClick={onVerifyPop}>
                                    Verify
                                </button> : ""}

                            {pageChange === "Delete" ?

                                <button className="bg-red-500 text-white px-4 py-1 text-xs rounded hover:bg-red-600 transition duration-200" onClick={onDeletePop}>
                                    Delete
                                </button> : ""}


                            <button className="bg-indigo-500 text-white px-4 py-1 text-xs rounded hover:bg-indigo-600 transition duration-200" onClick={onReset}>
                                Reset
                            </button>
                        </div>



                    </div>

                </div>
            </div >
        </>
    );
};

export default PassForPayment;
