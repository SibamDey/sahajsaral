import webApi from "../../WebApi/WebApi";

export const getCashAnalysisSummaryOB = async (lgd,fin,from,to) => {
    return await webApi.get(`/CashAnalysis/CashAnalysisSummaryOB?lgdCode=${lgd}&finYear=${fin}&frmDate=${from}&toDate=${to}`,);
}

export const getCashAnalysisDetails = async (lgd,groupId,from,to) => {
    return await webApi.get(`/CashAnalysis/CashAnalysisDetails?lgdCode=${lgd}&glGroup=${groupId}&frmDate=${from}&toDate=${to}`,);
}


export const getCashAnalysisUtilization = async (lgd,from,to) => {
    return await webApi.get(`/CashAnalysis/CashAnalysisUtilization?lgdCode=${lgd}&frmDate=${from}&toDate=${to}`,);
}

export const getCashAnalysisSummaryDtls = async (lgd,from,to) => {
    return await webApi.get(`/CashAnalysis/CashAnalysisSummaryDtls?lgdCode=${lgd}&frmDate=${from}&toDate=${to}`,);
}

export const getListDeletePfp = async (lgd,from,to) => {
    return await webApi.get(`/ReportViewer/DeletedPfpList?lgdCode=${lgd}&frmDate=${from}&toDate=${to}`,);
}

export const getListDeleteVoucher = async (lgd,from,to) => {
    return await webApi.get(`/ReportViewer/DeletedVoucherList?lgdCode=${lgd}&frmDate=${from}&toDate=${to}`,);
}

export const getCashAnalysisReceiptDtls = async (lgd,from,to) => {
    return await webApi.get(`/CashAnalysis/CashAnalysisReceiptGroup?lgdCode=${lgd}&frmDate=${from}&toDate=${to}`,);
}


export const getCashAnalysisPriGlDtls = async (lgd,from,to) => {
    return await webApi.get(`/CashAnalysis/CashAnalysisSummaryGlGroupPRI?lgdCode=${lgd}&frmDate=${from}&toDate=${to}`,);
}

export const getCashAnalysisHeadDtls = async (lgd,from,to) => {
    return await webApi.get(`/CashAnalysis/CashAnalysisHeadClassification?lgdCode=${lgd}&frmDate=${from}&toDate=${to}`,);
}

export const getCashAnalysisSummaryCB = async (lgd,fin,from,to) => {
    return await webApi.get(`/CashAnalysis/CashAnalysisSummaryCB?lgdCode=${lgd}&finYear=${fin}&frmDate=${from}&toDate=${to}`,);
}


export const getSubsidaryCashbook = async (lgd,acc,from,to) => {
    return await webApi.get(`/SubsidaryCashbook/Get?lgdCode=${lgd}&accountCode=${acc}&frmDate=${from}&toDate=${to}`,);
}

export const getCashbook = async (lgd,from,to) => {
    return await webApi.get(`/CashBook/GP?lgdCode=${lgd}&frmDate=${from}&toDate=${to}`,);
}

export const getCashbookZpPs = async (lgd,from,to) => {
    return await webApi.get(`/CashBook/ZPPS?lgdCode=${lgd}&frmDate=${from}&toDate=${to}`,);
}

export const getStatus = async (lgd,from,to) => {
    return await webApi.get(`/Voucher/GetVoucherSttsTag?lgdCode=${lgd}&frmDate=${from}&toDate=${to}`,);
}

export const getGpForm26 = async (lgd,from,to) => {
    return await webApi.get(`/Form26/GP?lgdCode=${lgd}&frmDate=${from}&toDate=${to}`,);
}
