import webApi from "../../WebApi/WebApi";


export const getPRIName = async (lgd, fin, from, to) => {
    return await webApi.get(`/AdminRectify/PRIName?lgdCode=${lgd}`,);
}


export const getVoucherUnverified = async (
    lgd,
    voucherId,
    onSuccess,
    onFailure) => {
    try {
        const res = await webApi.post(
            `/AdminRectify/VoucherUnverify`,
            {
                "lgdCode": lgd,
                "voucherId": voucherId,
                "securityCode": 9539
            },
        );
        console.log(res, "resresres")
        if (res?.status == 200) {
            const r = res.data;
            console.log(r, "rerere")
            return onSuccess(r);
        } else if (res?.status == 1) {
            const r = res.data;
            console.log(r, "rerere")
            return onSuccess(r);
        } else {
            onFailure("Something Wrong! Please Try again later" + res.data);
        }
    } catch (error) {
        console.log("fdgdf")
    }
};


export const getPfpUnverified = async (
    lgd,
    pfpId,
    onSuccess,
    onFailure) => {
    try {
        const res = await webApi.post(
            `/AdminRectify/PfpUnverify`,
            {
                "lgdCode": lgd,
                "pfpId": pfpId,
                "securityCode": 9539
            },
        );
        console.log(res, "resresres")
        if (res?.status == 200) {
            const r = res.data;
            console.log(r, "rerere")
            return onSuccess(r);
        } else if (res?.status == 1) {
            const r = res.data;
            console.log(r, "rerere")
            return onSuccess(r);
        } else {
            onFailure("Something Wrong! Please Try again later" + res.data);
        }
    } catch (error) {
        console.log("fdgdf")
    }
};


export const getRealAcCode = async (
    lgd,
    accountCode,
    balance,
    onSuccess,
    onFailure) => {
    try {
        const res = await webApi.post(
            `/AdminRectify/UpdateBalance`,
            {
                "lgdCode": lgd,
                "accountCode": accountCode,
                "balance": balance,
                "securityCode": 9539
            },
        );
        console.log(res, "resresres")
        if (res?.status == 200) {
            const r = res.data;
            console.log(r, "rerere")
            return onSuccess(r);
        } else if (res?.status == 1) {
            const r = res.data;
            console.log(r, "rerere")
            return onSuccess(r);
        } else {
            onFailure("Something Wrong! Please Try again later" + res.data);
        }
    } catch (error) {
        console.log("fdgdf")
    }
};


export const getOtp = async (
    mobileNo,
    onSuccess,
    onFailure) => {
    try {
        const res = await webApi.post(
            `/MobileOTP/GetOTP`,
            {
                "mobileNo": mobileNo,
            },
        );
        console.log(res, "resresres")
        if (res?.status == 200) {
            const r = res.data;
            console.log(r, "rerere")
            return onSuccess(r);
        } else if (res?.status == 1) {
            const r = res.data;
            console.log(r, "rerere")
            return onSuccess(r);
        } else {
            onFailure("Something Wrong! Please Try again later" + res.data);
        }
    } catch (error) {
        console.log("fdgdf")
    }
};


export const getOtpVerify = async (
    mobileNo,
    otpValue,
    onSuccess,
    onFailure) => {
    try {
        const res = await webApi.post(
            `/MobileOTP/VerifyOTP`,
            {
                "mobileNo": mobileNo,
                "otpValue": otpValue,
            },
        );
        console.log(res, "resresres")
        if (res?.status == 200) {
            const r = res.data;
            console.log(r, "rerere")
            return onSuccess(r);
        } else if (res?.status == 1) {
            const r = res.data;
            console.log(r, "rerere")
            return onSuccess(r);
        } else {
            onFailure("Something Wrong! Please Try again later" + res.data);
        }
    } catch (error) {
        console.log("fdgdf")
    }
};