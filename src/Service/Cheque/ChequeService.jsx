import webApi from "../../WebApi/WebApi";


export const getFinInstitute = async (lgd) => {
    return await webApi.get(`/RealAccount/GetRealAccountWithNumber?lgdCode=${lgd}`,);
}


export const getChequeNoDetails = async (lgd, acc, no) => {
    return await webApi.get(`/ChequeBook/getChequeNoDetails?lgdCode=${lgd}&accountCode=${acc}&chequeNo=${no}`,);
}


export const addUpdateCheque = async (lgdCode, chequeBookId, accountCode, chequeBookNo, issueFlag, chequeNo,remarks, onSuccess, onFailure) => {
    try {


        const res = await webApi.post(
            `/ChequeBook/UpdateChequeNoStatus`,
            {
                "lgdCode": lgdCode,
                "chequeBookId": chequeBookId,
                "accountCode": accountCode,
                "chequeBookNo": chequeBookNo,
                "issueFlag": issueFlag,
                "chequeNo": chequeNo,
                "remarks": remarks
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