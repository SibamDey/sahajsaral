import webApi from "../../WebApi/WebApi";

export const getReceiptPayGrpList = async () => {
    return await webApi.get(`/ReceiptGroup/Get`);
}


export const getHeadClassificationList = async () => {
    return await webApi.get(`/ReceiptGroupGP/Get`);
}
