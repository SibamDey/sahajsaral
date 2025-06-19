import webApi from "../../WebApi/WebApi";

export const getRealAccSummary = async (lgd, from, to) => {
    return await webApi.get(`/TransactionQuery/RealAccountSummary?lgdCode=${lgd}&frmDate=${from}&toDate=${to}`);
}

export const getRealAccSummaryDetails = async (lgd, acc, from, to) => {
    return await webApi.get(`/TransactionQuery/RealAccountSummaryDetails?lgdCode=${lgd}&accountCode=${acc}&frmDate=${from}&toDate=${to}`);
}

export const getNominalAccSummaryDetails = async (lgd, acc, from, to, rp) => {
    return await webApi.get(`/ReportViewer/NominalAccountTransactionDetails?lgdCode=${lgd}&accountCode=${acc}&frmDate=${from}&toDate=${to}&vouchermode=${rp}`);
}

export const getInstrumentType = async (lgd, from, to, type, no ,bank) => {
    return await webApi.get(`/TransactionQuery/ByInstrumentNo?lgdCode=${lgd}&frmDate=${from}&toDate=${to}&instrumentType=${type}&instrumentNo=${no}&accountCode=${bank}`);
}

export const getPartyType = async (lgd, from, to, type, no) => {
    return await webApi.get(`/TransactionQuery/ByPartyDetails?lgdCode=${lgd}&frmDate=${from}&toDate=${to}&partyType=${type}&partyParam=${no}`);
}
