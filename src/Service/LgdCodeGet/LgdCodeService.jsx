import webApi from "../../WebApi/WebApi";


export const getLgdDetails = async (lgd) => {
    return await webApi.get(`/LSG/Get?lgdCode=${lgd}`);
}