import webApi from "../../WebApi/WebApi";

export const getUnadjustedOb = async (lgd) => {
    return await webApi.get(`/GlAdvance/GetUnadjustedAdvanceOB?lgdCode=${lgd}`,);
}