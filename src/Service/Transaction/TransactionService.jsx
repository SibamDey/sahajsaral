import webApi from "../../WebApi/WebApi";


export const getParabaithakActivityByScheme = async (dist, block, gp, year, scheme, activity, eGramId) => {
    return await webApi.get(`/ParabaithakActivity/GetActivityListSchemeWise?distLgd=${dist}&blockLgd=${block}&gpLgd=${gp}&planYear=${year}&schemeId=${scheme}&activityName=${activity}&eGramId=${eGramId}`,);
}

export const getPassForPaymentDetails = async (lgd, from, to, status, flag) => {
    return await webApi.get(`/PassForPayment/SearchPfpId?lgdCode=${lgd}&frmDate=${from}&toDate=${to}&pfpStts=${status}&paymentFlag=${flag}`,);
}

export const getPassForPaymentById = async (lgd, pfpId) => {
    return await webApi.get(`/PassForPayment/Get?lgdCode=${lgd}&pfpId=${pfpId}`,);
}


export const getNextPassForPaymentId = async (lgd, pfpId) => {
    return await webApi.get(`/PassForPayment/NextPfpId?lgdCode=${lgd}&pfpId=${pfpId}`,);
}

export const getTenderList = async (dist, block, gp, activityId) => {
    return await webApi.get(`/Tender/Get?distLgd=${dist}&blockLgd=${block}&gpLgd=${gp}&activityId=${activityId}`,);
}


export const getPartyTypeList = async (lgd, grpName, flag) => {
    return await webApi.get(`/GlGroup/GetGLGroupWithAccountCode?lgdCode=${lgd}&groupName=${grpName ? grpName : 0}&rcptpmntFlag=${flag}`,);
}


export const getAcCodeDescList = async (lgd, grpid, flag) => {
    return await webApi.get(`/GlGroup/GetAccountCodeFromGlGroupId?lgdCode=${lgd}&groupId=${grpid}&rcptpmntFlag=${flag}`,);
}

export const getGlGroupBalance = async (lgd, grpid) => {
    return await webApi.get(`/GlGroup/AvailableLedgerBalance?lgdCode=${lgd}&groupId=${grpid}`,);
}


export const getDeductedtAcCodeList = async (lgd, receiptGroup, flag) => {
    return await webApi.get(`/GlGroup/GetAccountCodeFromReceiptGroup?lgdCode=${lgd}&receiptGroup=${receiptGroup}&rcptpmntFlag=${flag}`,);
}



export const getContractorList = async (lgd, contractorName) => {
    return await webApi.get(`/Contractor/Get?lgdCode=${lgd}&contractorName=${contractorName}`,);
}

export const getEmployeeList = async (lgd, empName) => {
    return await webApi.get(`/Employee/Get?lgdCode=${lgd}&empName=${empName}`,);
}

export const getJobWorkerList = async (lgd, jobWorkerName) => {
    return await webApi.get(`/JobWorker/Get?lgdCode=${lgd}&jobWorkerName=${jobWorkerName}`);
}

export const getDepartmentList = async (deptName) => {
    return await webApi.get(`/Department/Get?deptName=${deptName}`);
}

export const getLsgList = async (lsgName) => {
    return await webApi.get(`/lsg/get?lsgName=${lsgName}`);
}


export const getAllGlGroupList = async (lgd, value) => {
    return await webApi.get(`/GlGroup/GetGlgroupByLgd?lgdCode=${lgd}&&groupName=${value}`);
}




export const addInsertPassForPayment = async (lgdCode, finYear, paymentDate, schemeType, expType, activityCode, activityDesc,
    tenderNo, theme1Id, theme1Name, theme2Id, theme2Name, theme3Id, theme3Name, planTenderSchemeId, woNo, billType, accountCode, paymentDesc, partyType, partyCode, payTo, payAddress, netAmount,
    deductAmount, allotmentNo, subAllot, deductFlag, docType, docFile, userIndex, tableData, duductionAccountCode, voucherIds, billRa, onSuccess, onFailure) => {
    try {
        const res = await webApi.post(
            `/PassForPayment/Insert`,
            {
                "basic": {
                    "lgdCode": lgdCode,
                    "finYear": finYear,
                    "paymentDate": paymentDate,
                    "schemeType": schemeType,
                    "expType": expType,
                    "activityCode": activityCode ? activityCode : "",
                    "activityDesc": activityDesc ? activityDesc : "",
                    "tenderNo": tenderNo ? tenderNo : "",
                    "theme1Id": theme1Id ? theme1Id : null,
                    "theme1Name": theme1Name ? theme1Name : "",
                    "theme2Id": theme2Id ? theme2Id : null,
                    "theme2Name": theme2Name ? theme2Name : "",
                    "theme3Id": theme3Id ? theme3Id : null,
                    "theme3Name": theme3Name ? theme3Name : "",
                    "planTenderSchemeId": planTenderSchemeId ? planTenderSchemeId : "",
                    "woNo": woNo ? woNo : "",
                    "billType": billType ? billType : null,
                    "accountCode": accountCode,
                    "paymentDesc": paymentDesc ? paymentDesc : "",
                    "partyType": partyType ? partyType : "",
                    "partyCode": partyCode ? partyCode : "",
                    "payTo": payTo ? payTo : "",
                    "payAddress": payAddress ? payAddress : "",
                    "netAmount": netAmount,
                    "deductAmount": deductAmount,
                    "allotmentNo": allotmentNo ? allotmentNo : "",
                    "subAllot": subAllot,
                    "deductFlag": deductFlag,
                    "docType": docType,
                    "docFile": docFile,
                    "userIndex": userIndex,
                    "duductionAccountCode": duductionAccountCode,
                    "voucherIds": voucherIds,
                    "billTypeDesc": billRa
                },
                "deduct": tableData
            },


        );

        console.log(res, "sibam")
        if (res?.data?.status == 0) {
            const r = res?.data;
            console.log(r, "rerere")

            return onSuccess(r);

        } else if (res?.data?.status == 1) {
            const r = res?.data;
            console.log(r, "rerere")

            return onSuccess(r);
        } else {
            onFailure("Something Wrong! Please Try again later" + res.data);

        }
    } catch (error) {
        console.log("fdgdf")
    }
};


export const verifyPassForPayment = async (lgdCode, pfpId, userIndex, onSuccess, onFailure) => {
    try {
        const res = await webApi.post(
            `/PassForPayment/Verify`,
            {
                "lgdCode": lgdCode,
                "pfpId": pfpId,
                "userIndex": userIndex
            },


        );

        console.log(res, "sibam")
        if (res?.data?.status == 0) {
            const r = res?.data;
            console.log(r, "rerere")

            return onSuccess(r);

        } else if (res?.data?.status == 1) {
            const r = res?.data;
            console.log(r, "rerere")

            return onSuccess(r);
        } else {
            onFailure("Something Wrong! Please Try again later" + res.data);

        }
    } catch (error) {
        console.log("fdgdf")
    }
};


export const verifyVoucher = async (lgdCode, voucherId, userIndex, onSuccess, onFailure) => {
    try {
        const res = await webApi.post(
            `/Voucher/VerifyVoucher`,
            {
                "lgdCode": lgdCode,
                "voucherId": voucherId,
                "userIndex": userIndex
            },
        );

        console.log(res, "sibam")
        if (res?.data?.status == 0) {
            const r = res?.data;
            console.log(r, "rerere")

            return onSuccess(r);

        } else if (res?.data?.status == 1) {
            const r = res?.data;
            console.log(r, "rerere")

            return onSuccess(r);
        } else {
            onFailure("Something Wrong! Please Try again later" + res.data);

        }
    } catch (error) {
        console.log("fdgdf")
    }
};


export const deletePassForPayment = async (lgdCode, pfpId, reason, userIndex, onSuccess, onFailure) => {
    try {
        const res = await webApi.post(
            `/PassForPayment/Delete`,
            {
                "lgdCode": lgdCode,
                "pfpId": pfpId,
                "userIndex": userIndex,
                "deleteReson": reason
            },


        );

        console.log(res, "sibam")
        if (res?.data?.status == 0) {
            const r = res?.data;
            console.log(r, "rerere")

            return onSuccess(r);

        } else if (res?.data?.status == 1) {
            const r = res?.data;
            console.log(r, "rerere")

            return onSuccess(r);
        } else {
            onFailure("Something Wrong! Please Try again later" + res.data);

        }
    } catch (error) {
        console.log("fdgdf")
    }
};



export const deleteVoucher = async (lgdCode, voucherId, reason, userIndex, onSuccess, onFailure) => {
    try {
        const res = await webApi.post(
            `/Voucher/DeleteVoucher`,
            {
                "lgdCode": lgdCode,
                "voucherId": voucherId,
                "userIndex": userIndex,
                "deleteReason": reason
            },


        );

        console.log(res, "sibam")
        if (res?.data?.status == 0) {
            const r = res?.data;
            console.log(r, "rerere")

            return onSuccess(r);

        } else if (res?.data?.status == 1) {
            const r = res?.data;
            console.log(r, "rerere")

            return onSuccess(r);
        } else {
            onFailure("Something Wrong! Please Try again later" + res.data);

        }
    } catch (error) {
        console.log("fdgdf")
    }
};



// this if for the voucher creation 




export const getNominalAccList = async (lgd, flag) => {
    return await webApi.get(`/NominalAccount/Get?lgdCode=${lgd}&flag=${flag}`);
}


export const getRealAccList = async (lgd) => {
    return await webApi.get(`/RealAccount/GetRealAccountWithNumber?lgdCode=${lgd}`);
}

export const getRealAccAllList = async (lgd) => {
    return await webApi.get(`/RealAccount/Get?lgdCode=${lgd}`);
}


export const getRealAccWithbalance = async (lgd, type) => {
    return await webApi.get(`/RealAccount/GetRealAccountWithBalance?lgdCode=${lgd}&acType=${type}`);
}


export const getChequeNoForVoucher = async (lgd, bankCode) => {
    return await webApi.get(`/ChequeBook/GetChequeNoForVoucher?lgdCode=${lgd}&accountCode=${bankCode}`,);
}


export const addVoucherEntry = async (lgdCode, finYear, voucherModeData, voucherType, voucherDate, voucherNo, pfpId,
    minusAccountCode, plusAccountCode, voucherAmount, voucherDeductionAmount, voucherNetAmount, voucherNarration, partyType,
    partyCode, partyAddress, payTo, userIndex, instrumentType, instrumentDetails, instrumentNo,
    instrumentDate, subAllot, flagCash, flagAdvanceAdjust, flagTransit, flagDeduct,
    glGroup, refVoucherId, refvoucherDate, allotmentNo, allotmentDate, challanNo,
    challanByWhom, challanWhoseBehalf, base64String, onSuccess, onFailure) => {
    try {
        const res = await webApi.post(
            `/Voucher/Insert`,
            {
                "lgdCode": lgdCode,
                "finYear": finYear,
                "voucherMode": voucherModeData,
                "voucherType": voucherType,
                "voucherDate": voucherDate,
                "voucherNo": voucherNo,
                "pfpId": pfpId,
                "minusAccountCode": minusAccountCode,
                "plusAccountCode": plusAccountCode,
                "voucherAmount": voucherAmount ? voucherAmount : 0,
                "voucherDeductionAmount": voucherDeductionAmount ? voucherDeductionAmount : 0,
                "voucherNetAmount": voucherNetAmount ? voucherNetAmount : 0,
                "voucherNarration": voucherNarration,
                "partyType": partyType ? partyType : "None",
                "partyCode": partyCode,
                "partyAddress": partyAddress,
                "payTo": payTo,
                "userIndex": userIndex,
                "instrumentType": instrumentType,
                "instrumentDetails": instrumentDetails ? instrumentDetails : null,
                "instrumentNo": instrumentNo ? instrumentNo : null,
                "instrumentDate": instrumentDate,
                "subAllot": subAllot,
                "flagCash": flagCash,
                "flagAdvanceAdjust": flagAdvanceAdjust,
                "flagTransit": flagTransit,
                "flagDeduct": flagDeduct,
                "glGroup": glGroup,
                "refVoucherId": refVoucherId,
                "refvoucherDate": refvoucherDate,
                "allotmentNo": allotmentNo ? allotmentNo : null,
                "allotmentDate": allotmentDate ? allotmentDate : null,
                "challanNo": challanNo ? challanNo : null,
                "challanByWhom": challanByWhom ? challanByWhom : null,
                "challanWhoseBehalf": challanWhoseBehalf ? challanWhoseBehalf : null,
                "docFile": base64String,
            }

        );

        console.log(res, "sibam")
        if (res?.data?.status == 0) {
            const r = res?.data;
            console.log(r, "rerere")

            return onSuccess(r);

        } else if (res?.data?.status == 1) {
            const r = res?.data;
            console.log(r, "rerere")

            return onSuccess(r);
        } else {
            onFailure("Something Wrong! Please Try again later" + res.data);

        }
    } catch (error) {
        console.log("fdgdf")
    }
};


export const getAccountHeadList = async (lgd, grpName) => {
    return await webApi.get(`/GlGroup/GetAccountHeadGlGroup?lgdCode=${lgd}&groupName=${grpName ? grpName : 0}`,);
}

export const getReferenceOfDetails = async (lgd, glGroup) => {
    return await webApi.get(`/Voucher/GetTransitVoucherPopup?lgdCode=${lgd}&glGroup=${glGroup}`,);
}

export const getReferenceOfAdvanceAdj = async (lgd, glGroup, partyCode) => {
    return await webApi.get(`/Voucher/GetAdvanceVoucherPopup?lgdCode=${lgd}&glGroup=${glGroup}&partyCode=${partyCode}`,);
}

export const getDeductionList = async (lgd, gl, mainGlGroup, from, to, contractorName) => {
    return await webApi.get(`/Deduction/DeductionListPFPModal?lgdCode=${lgd}&glGroup=${gl}&mainGlGroup=${mainGlGroup}&frmDate=${from}&toDate=${to}&srchByName=${contractorName}`,);
}

export const getVoucherDetails = async (lgd, from, to, type, status, narration) => {
    return await webApi.get(`/Voucher/GetVoucherListing?lgdCode=${lgd}&frmDate=${from}&toDate=${to}&voucherType=${type}&voucherStts=${status}&voucherNarration=${narration}`,);
}

export const getVoucherById = async (lgd, voucherId) => {
    return await webApi.get(`/Voucher/GetVoucherDetails?lgdCode=${lgd}&voucherId=${voucherId}`,);
}

export const addDeleteChequeId = async (lgdCode, chequeBookId, onSuccess, onFailure) => {
    try {
        const res = await webApi.post(
            `/ChequeBook/Delete`,
            {
                "lgdCode": lgdCode,
                "chequeBookId": chequeBookId,

            },


        );

        console.log(res, "sibam")
        if (res?.data?.status == 0) {
            const r = res?.data;
            console.log(r, "rerere")

            return onSuccess(r);

        } else if (res?.data?.status == 1) {
            const r = res?.data;
            console.log(r, "rerere")

            return onSuccess(r);
        } else {
            onFailure("Something Wrong! Please Try again later" + res.data);

        }
    } catch (error) {
        console.log("fdgdf")
    }
};


export const getNextQuery = async (lgd, voucherId) => {
    return await webApi.get(`/Voucher/QueryNextVoucherId?lgdCode=${lgd}&voucherId=${voucherId}`,);
}


export const getNextVerify = async (lgd, voucherId) => {
    return await webApi.get(`/Voucher/VerifyNextVoucherId?lgdCode=${lgd}&voucherId=${voucherId}`,);
}


export const getNextPFPVerify = async (lgd, voucherId) => {
    return await webApi.get(`/PassForPayment/NextPfpIdQuery?lgdCode=${lgd}&pfpId=${voucherId}`,);
}