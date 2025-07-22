import webApi from "../../WebApi/WebApi";


export const getVoucherList = async (lgd, frmDate, toDate, voucherType, voucherStts, voucherNarration) => {
    return await webApi.get(`/Voucher/GetVoucherListingWithJournal?lgdCode=${lgd}&frmDate=${frmDate}&toDate=${toDate}&voucherType=${voucherType}&voucherStts=${voucherStts}&voucherNarration=${voucherNarration ? voucherNarration : 0}`);
}

// debit means payment voucher
export const getDebitVoucher = async (lgd, voucherId) => {
    return await webApi.get(`/Voucher/printDebitVoucher?lgdCode=${lgd}&voucherId=${voucherId}`);
}

//view pfp details
export const getPfpDetails = async (lgd, pfpId) => {
    return await webApi.get(`/PassForPayment/Get?lgdCode=${lgd}&pfpId=${pfpId}`);
}

export const getContraVoucher = async (lgd, voucherId) => {
    return await webApi.get(`/Voucher/printContraVoucher?lgdCode=${lgd}&voucherId=${voucherId}`);
}

// credit means receipt voucher
export const getReceiptVoucher = async (lgd, voucherId) => {
    return await webApi.get(`/Voucher/printCreditVoucher?lgdCode=${lgd}&voucherId=${voucherId}`);
}

export const getJournalVoucher = async (lgd, voucherId) => {
    return await webApi.get(`/Voucher/printJournalVoucher?lgdCode=${lgd}&voucherId=${voucherId}`);
}

export const getCashierReceiptVoucher = async (lgd, voucherId) => {
    return await webApi.get(`/Voucher/printCashierReceiptVoucher?lgdCode=${lgd}&voucherId=${voucherId}`);
}

export const getAckVoucher = async (lgd, voucherId) => {
    return await webApi.get(`/Voucher/printAckVoucher?lgdCode=${lgd}&voucherId=${voucherId}`);
}

export const getChallanVoucher = async (lgd, voucherId) => {
    return await webApi.get(`/Voucher/printChallanVoucher?lgdCode=${lgd}&voucherId=${voucherId}`);
}


export const getChequeIssue = async (lgd, acc, voucher, from, to) => {
    return await webApi.get(`/Register/ReportChequeIssueRegister?lgdCode=${lgd}&accountCode=${acc}&voucherMode=${voucher}&fromDate=${from}&toDate=${to}`);
}


export const getHeadwiseTransit = async (lgd, from, to) => {
    return await webApi.get(`/GlTransit/HeadwiseTransitBalanceRPT?lgdCode=${lgd}&frmDate=${from}&toDate=${to}`);
}

export const getHeadwiseLiquid = async (lgd, from, to) => {
    return await webApi.get(`/GlGroup/HeadwiseLiqCashRPT?lgdCode=${lgd}&frmDate=${from}&toDate=${to}`);
}

export const getHeadwiseBalance = async (lgd, from, to) => {
    return await webApi.get(`/CashAnalysis/CashAnalysisSummaryDtls?lgdCode=${lgd}&frmDate=${from}&toDate=${to}`);
}

export const getHeadwiseAdvance = async (lgd, from, to) => {
    return await webApi.get(`/GlAdvance/HeadwiseAdvanceBalanceRPT?lgdCode=${lgd}&frmDate=${from}&toDate=${to}`);
}

export const getSearchPassForPayment = async (lgd, frmDate, toDate, pfpStts, verify, narration) => {
    return await webApi.get(`/PassForPayment/Listing?lgdCode=${lgd}&frmDate=${frmDate}&toDate=${toDate}&pfpStts=${pfpStts}&voucherGen=${verify}&pfpNarration=${narration}`);
}

