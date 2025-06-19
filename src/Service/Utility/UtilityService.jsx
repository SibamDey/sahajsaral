import webApi from "../../WebApi/WebApi";


export const getReconsiliation = async (lgd, acc, voucher, from, to, instru, recon) => {
    return await webApi.get(`/Reconciliation/Get?lgdCode=${lgd}&accountCode=${acc}&voucherMode=${voucher}&frmDate=${from}&toDate=${to}&instrumentNo=${instru}&reconciliationStatus=${recon}`,);
}

export const getBankName = async (lgd) => {
    return await webApi.get(`/RealAccount/GetRealAccountBankTry?lgdCode=${lgd}`,);
}


export const getLastMonthCLose = async (lgd) => {
    return await webApi.get(`/MonthClose/LastMonthClose?lgdCode=${lgd}`,);
}


export const addMonthlyAccClosing = async (lgd, finYear, closeMonth, userIndex, onSuccess, onFailure) => {
    try {
        const res = await webApi.post(
            `/MonthClose/Insert`,
            {
                "lgdCode": lgd,
                "finYear": finYear,
                "closeMonth": closeMonth,
                "userIndex": userIndex
            },
        );
            console.log(res?.data?.status, "aaaaaaaa")

        if (res?.data?.status == 0) {
            const r = res?.data;
            console.log(r, "ssss")
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

export const addReconsilition = async (ArrData, onSuccess, onFailure) => {
    try {


        const res = await webApi.post(
            `/Reconciliation/Update`,
            {

                "recon": ArrData
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
