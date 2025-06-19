import webApi2 from "../../WebApi/WebApi2";
import webApi from "../../WebApi/WebApi";

export const getDistrictListforEvent = async (DistLgd) => {
    return await webApi2.get(`/api/EVNT_MGMNT/GetDistrict?DistLgd=${DistLgd}`,);
}
export const getBlockList = async (DistLgd,BlockLgd) => {
    return await webApi2.get(`/api/EVNT_MGMNT/GetBlock?DistLgd=${DistLgd}&BlockLgd=${BlockLgd}`,);
}
export const getGpList = async (DistLgd,BlockLgd,GPLgd) => {
    return await webApi2.get(`/api/EVNT_MGMNT/GetGP?DistLgd=${DistLgd}&BlockLgd=${BlockLgd}&GPLgd=${GPLgd}`,);
}


export const getParabaithakActivity = async (dist,block,gp,year) => {
    return await webApi.get(`/ParabaithakActivity/GetAllActivityList?distLgd=${dist}&blockLgd=${block}&gpLgd=${gp}&planYear=${year}`,);
}