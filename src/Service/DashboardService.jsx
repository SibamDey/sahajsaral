import webApi, { baseURL } from "../WebApi/WebApi";
import webApi2 from "../WebApi/WebApi2";

export const getAllDashboardList = async () => {
    return await webApi.get(`/api/schememaster/dashboard`,
    );
}


export const getDashboardData = async (lgd) => {
    return await webApi.get(`/Dashboard/VoucherDetails?lgdCode=${lgd}`,
    );
}

export const getAvailableFund = async (lgd) => {
    return await webApi.get(`/Dashboard/AvailableFund?lgdCode=${lgd}`,
    );
}

export const getDailyVoucherEntry = async (lgd) => {
    return await webApi.get(`/Dashboard/DailyVoucherEntry?lgdCode=${lgd}`,
    );
}

export const getMonthwisePayment = async (lgd) => {
    return await webApi.get(`/Dashboard/MonthwisePayment?lgdCode=${lgd}`,
    );
}



export const getUserDetails = async (data, onSuccess, onFailure) => {
    try {
        const res = await webApi2.post(
            `/api/profile/UserProf/${data}`);
        if (res) {

            console.log(res.data.Token, "==>>res")

            const r = res.data.Token;
            sessionStorage.setItem("SAHAJ_SARAL_USER", JSON.stringify(r));


            return onSuccess(r);
        } else {
            onFailure("Something Wrong! Please Try again later" + res.data);
        }
    } catch (error) {
        console.log("error")
    }
};