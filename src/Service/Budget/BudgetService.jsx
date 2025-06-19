import webApi from "../../WebApi/WebApi";

export const getBudgetList = async (lgd, fin, month) => {
    return await webApi.get(`/Budget/Get?lgdCode=${lgd}&finYear=${fin}`);
}


export const getMaxBudgetDate = async (lgd) => {
    return await webApi.get(`/Budget/MaxBudgetDate?lgdCode=${lgd}`);
}


export const getMappingWithGlPri = async (lgd) => {
    return await webApi.get(`/GlGroupPRI/GetaccountCodeMapGlGroupPRI?lgdCode=${lgd}&accountCodeDesc=0`);
}

export const getRealNominalMapping = async (lgd) => {
    return await webApi.get(`/NominalAccount/Get?lgdCode=${lgd}&flag=0`);
}

export const getGlGroup = async (lgd) => {
    return await webApi.get(`/GlGroupPRI/Get?lgdCode=${lgd}&groupName=0`);
}


export const addInsertBudget = async (lgdCode, finYear, userIndex, ArrData,budgetDate, onSuccess, onFailure) => {
    try {


        const res = await webApi.post(
            `/Budget/Insert`,
            {
                "basic": {
                    "lgdCode": lgdCode,
                    "finYear": finYear,
                    "budgetDate": budgetDate,
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


export const addMappingPri = async (data, onSuccess, onFailure) => {
    try {
        const res = await webApi.post(
            `/GlGroupPRI/UpdateaccountCodeMapGlGroupPRI`,
            {
               
                "glPRI": data
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

export const addRealNominalMapping = async (data, onSuccess, onFailure) => {
    try {
        const res = await webApi.post(
            `/NominalAccount/MapWithRealAccount`,
            {
               
                "mapReal": data
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