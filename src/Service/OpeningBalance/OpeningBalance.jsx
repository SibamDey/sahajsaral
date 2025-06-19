import webApi from "../../WebApi/WebApi";

export const getNominalAccountForOBList = async (lgd, fin, month) => {
    return await webApi.get(`/NominalAccount/GetNominalAccountForOB?lgdCode=${lgd}&finYear=${fin}&month=${month}`);
}


export const getCheckBalanceRealNominalList = async (lgd, fin, month) => {
    return await webApi.get(`/ReportViewer/RPTCheckBalanceRealNominal?lgdCode=${lgd}&finYear=${fin}&month=${month}`);
}

// ob for liquid cash.
export const getOBLiquidCash = async (lgd, fin, month) => {
    return await webApi.get(`/GlGroup/GetLiqCashForOB?lgdCode=${lgd}&finYear=${fin}&month=${month}`);
}

// ob cash in transit
export const getObCashInTransit = async (lgd, fin, month) => {
    return await webApi.get(`/GlTransit/GetGlTransitForOB?lgdCode=${lgd}&finYear=${fin}&month=${month}`);
}

// ob advance.

export const getOBAdvance = async (lgd, fin, month) => {
    return await webApi.get(`/GlAdvance/GetGlAdvanceForOB?lgdCode=${lgd}&finYear=${fin}&month=${month}`);
}


export const getNationalAccountCodeList = async (lgd, slNo) => {
    return await webApi.get(`/NAC/Get?lgdCode=${lgd}&slNo=${slNo}`);
}

// ob cash in transit

export const addInsertOBTransit = async (lgdCode, finYear, month, userIndex, ArrData, onSuccess, onFailure) => {
    try {


        const res = await webApi.post(
            `/GlTransit/InsertGlTransitOB`,
            {
                "basic": {
                    "lgdCode": lgdCode,
                    "finYear": finYear,
                    "month": month,
                    "userIndex": userIndex
                },
                "amt": ArrData
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

// ob liquid cash

export const addInsertOBLiquidCash = async (lgdCode, finYear, month, userIndex, ArrData, onSuccess, onFailure) => {
    try {


        const res = await webApi.post(
            `/GlGroup/InsertLiqCashOB`,
            {
                "basic": {
                    "lgdCode": lgdCode,
                    "finYear": finYear,
                    "month": month,
                    "userIndex": userIndex
                },
                "amt": ArrData
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

// ob advance

export const addInsertOBAdvance = async (lgdCode, finYear, month, userIndex, ArrData, onSuccess, onFailure) => {
    try {


        const res = await webApi.post(
            `/GlAdvance/InsertGlAdvanceOB`,
            {
                "basic": {
                    "lgdCode": lgdCode,
                    "finYear": finYear,
                    "month": month,
                    "userIndex": userIndex
                },
                "amt": ArrData
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

export const addInsertNominalAccountOB = async (lgdCode, finYear, month, userIndex, ArrData, onSuccess, onFailure) => {
    try {


        const res = await webApi.post(
            `/NominalAccount/InsertNominalAccountOB`,
            {
                "basic": {
                    "lgdCode": lgdCode,
                    "finYear": finYear,
                    "month": month,
                    "userIndex": userIndex
                },
                "amt": ArrData
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


export const addInsertRealAccountOB = async (lgdCode, accountCode, schemeId, finInstId, branchId, accountNo, openingBalance, finYear, month, userIndex, passBookBalance, onSuccess, onFailure) => {
    try {


        const res = await webApi.post(
            `/RealAccount/InsertRealAccountOB`,
            {
                "lgdCode": lgdCode,
                "accountCode": accountCode,
                "schemeId": schemeId ? schemeId : null,
                "finInstId": finInstId ? finInstId : null,
                "branchId": branchId ? branchId : null,
                "accountNo": accountNo ? accountNo : null,
                "openingBalance": openingBalance,
                "passbookBalance": passBookBalance,
                "finYear": finYear,
                "month": month,
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


export const addUncashedSelfCheque = async (lgdCode, selfId, date, partyType, narration, amount, chequeNo, userIndex, onSuccess, onFailure) => {
    try {

        const res = await webApi.post(
            `/GlTransit/InsertUncashSelfChqOB`,
            {
                "lgdCode": lgdCode,
                "voucherId": "0USCP0000" + selfId,
                "voucherDate": date,
                "glGroupId": partyType,
                "voucherNarration": narration,
                "voucherNetAmount": amount,
                "instrumentNo": chequeNo,
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

export const addUnadjustedAdvance = async (lgdCode, selfId, date, partyType, amount, partyCode, onSuccess, onFailure) => {
    try {

        const res = await webApi.post(
            `/GlAdvance/InsertUnadjustedAdvanceOB`,
            {
                "lgdCode": lgdCode,
                "voucherId": "0ADVP000" + selfId,
                "voucherDate": date,
                "glGroupId": partyType,
                "partyCode": partyCode,
                "advanceAmount": amount,
                "adjustAmount": 0

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


export const addChequeNotEncash = async (lgdCode, voucherSlNo, date, bankCode, partyType, narration, amount, payTo, userIndex, statusRP, instType, instDate, instNo, instDetails, onSuccess, onFailure) => {
    try {

        const res = await webApi.post(
            `/IssuedCheque/Insert`,
            {
                "lgdCode": lgdCode,
                "voucherSlNo": voucherSlNo,
                "voucherDate": date,
                "accountCode": bankCode,
                "glGroup": partyType,
                "voucherNarration": narration,
                "voucherNetAmount": amount,
                "payTo": payTo,
                "userIndex": userIndex,
                "voucherMode": statusRP,
                "instrumentDetails": instDetails,
                "instrumentNo": instNo,
                "instrumentDate": instDate,
                "instrumentType": instType,
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


export const InsertTrnPassbokNotCashbook = async (lgdCode, passBookDate, amount, bank, transactionRefId, userIndex, onSuccess, onFailure) => {
    try {

        const res = await webApi.post(
            `/Passbook/InsertTrnPassbokNotCashbook`,
            {
                "lgdCode": lgdCode,
                "tranDate": passBookDate,
                "rcptPmnt": "R",
                "tranAmount": amount,
                "realAccountCode": bank,
                "refNo": transactionRefId ? transactionRefId : "",
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


export const UpdateTrnPassbokNotCashbook = async (lgdCode, trnId, remarks, entryCB, userIndex, onSuccess, onFailure) => {
    try {

        const res = await webApi.post(
            `/Passbook/UpdateTrnPassbokNotCashbook`,
            {
                "notSubCB": [
                    {
                        "lgdCode": lgdCode,
                        "trnId": trnId,
                        "remarks": remarks,
                        "entryCB": entryCB,
                        "userIndex": userIndex
                    }
                ]

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


export const getTrnPassbokNotCashbook = async (lgd) => {
    return await webApi.get(`/Passbook/GetTrnPassbokNotCashbook?lgdCode=${lgd}`,);
}