import webApi2 from "../../WebApi/WebApi2";
import webApi from "../../WebApi/WebApi";

export const getDistrictListforEvent = async (DistLgd) => {
    return await webApi2.get(`/api/EVNT_MGMNT/GetDistrict?DistLgd=${DistLgd}`,);
}
export const getBlockList = async (DistLgd, BlockLgd) => {
    return await webApi2.get(`/api/EVNT_MGMNT/GetBlock?DistLgd=${DistLgd}&BlockLgd=${BlockLgd}`,);
}
export const getGpList = async (DistLgd, BlockLgd, GPLgd) => {
    return await webApi2.get(`/api/EVNT_MGMNT/GetGP?DistLgd=${DistLgd}&BlockLgd=${BlockLgd}&GPLgd=${GPLgd}`,);
}


export const getParabaithakActivity = async (dist, block, gp, year) => {
    return await webApi.get(`/ParabaithakActivity/GetAllActivityList?distLgd=${dist}&blockLgd=${block}&gpLgd=${gp}&planYear=${year}`,);
}


export const getPlanYear = async () => {
    return await webApi.get(`/ParabaithakActivity/GetPlanYear`,);
}


export const getAllScheme = async () => {
    return await webApi.get(`/ParabaithakActivity/GetParabaithakScheme`,);
}

export const getAllComponent = async (id) => {
    return await webApi.get(`/ParabaithakActivity/GetComponent?schemeId=${id}`,);
}

export const getAllUpaSamity = async () => {
    return await webApi.get(`/ParabaithakActivity/GetUpaSamity`,);
}


export const getAllSector = async () => {
    return await webApi.get(`/ParabaithakActivity/GetSector`,);
}

export const getFocusArea = async () => {
    return await webApi.get(`/ParabaithakActivity/GetFocusArea`,);
}

export const getFocusAreaMgnrega = async () => {
    return await webApi.get(`/ParabaithakActivity/GetFocusAreaMGNREGA`,);
}

export const getCategory = async () => {
    return await webApi.get(`/ParabaithakActivity/GetCategorySBGM`,);
}

export const getCategoryMgnrega = async () => {
    return await webApi.get(`/ParabaithakActivity/GetCategoryMGNREGA`,);
}

export const getSDGCategory = async () => {
    return await webApi.get(`/ParabaithakActivity/GetSDG`,);
}

export const getDetailsReport = async (dist, block, gp, year, formType, schemeId, comId, focusArea, upaSamId, SecId, sdgId, verify, catId, operation, convengence, activityName) => {
    return await webApi.get(`/ParabaithakActivity/RPTActivityDetailsHTML?distLgd=${dist}&blockLgd=${block}&gpLgd=${gp}&planYear=${year}&formType=${formType}&schemeId=${schemeId}&componentId=${comId}&focusArea=${focusArea}&upaSmaityId=${upaSamId}&sectorId=${SecId}&sdgId=${sdgId}&verify=${verify}&categoryId=${catId}&operationType=${operation}&convergence=${convengence}&activityName=${activityName}`,);
}


export const getActivitySummaryReport = async (dist, block, gp, year, formType, schemeId, comId, focusArea, upaSamId, SecId, sdgId, verify, catId, operation, convengence, activityName) => {
    return await webApi.get(`/ParabaithakActivity/RPTActivitySummary?distLgd=${dist}&blockLgd=${block}&gpLgd=${gp}&planYear=${year}&formType=${formType}&schemeId=${schemeId}&componentId=${comId}&focusArea=${focusArea}&upaSmaityId=${upaSamId}&sectorId=${SecId}&sdgId=${sdgId}&verify=${verify}&categoryId=${catId}&operationType=${operation}&convergence=${convengence}&activityName=${activityName}`,);
}


export const getActivityListReport = async (dist, block, gp, year, formType, schemeId, comId, focusArea, upaSamId, SecId, sdgId, verify, catId, operation, convengence, activityName) => {
    return await webApi.get(`/ParabaithakActivity/RPTActivityList?distLgd=${dist}&blockLgd=${block}&gpLgd=${gp}&planYear=${year}&formType=${formType}&schemeId=${schemeId}&componentId=${comId}&focusArea=${focusArea}&upaSmaityId=${upaSamId}&sectorId=${SecId}&sdgId=${sdgId}&verify=${verify}&categoryId=${catId}&operationType=${operation}&convergence=${convengence}&activityName=${activityName}`,);
}

