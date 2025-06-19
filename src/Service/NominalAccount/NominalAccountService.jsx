import webApi from "../../WebApi/WebApi";


export const addAddedPriAcc = async (lgd, accCode, user, onSuccess, onFailure) => {
    try {
        const res = await webApi.post(
            `/NominalAccount/Insert`,

            {
                "lgdCode": lgd,
                "accountCode": accCode,
                "userIndex": user,
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


export const addDeletePriAcc = async (lgd, accCode, onSuccess, onFailure) => {
    try {
        const res = await webApi.post(
            `/NominalAccount/Delete`,

            {
                "lgdCode": lgd,
                "accountCode": accCode,
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

export const getGlGroupList = async (grpName) => {
    return await webApi.get(`/GlGroup/Get?groupName=${grpName}`,);
}