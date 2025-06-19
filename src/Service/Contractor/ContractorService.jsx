import webApi, { baseURL } from "../../WebApi/WebApi";



export const addCreateContractor = async (contractorName, contractorGSTIN, contractorPAN,
    contractorMobile, contractorAddress,contractorDob,gpLgd,userLvl, onSuccess, onFailure) => {
        console.log(gpLgd,"gpgpgpgpgpgp")

    // try {
    //     const res = await webApi.post(
    //         `/contractor/add`,

    //         {
    //             "contractorNm": contractorName,
    //             "contractorPan": contractorPAN,
    //             "contractorAdd": contractorAddress,
    //             "contractorPh": contractorMobile,
    //             "contractorGstin": contractorGSTIN,
    //             "contractorDob": contractorDob,
    //             "lgdType": userLvl,
    //             "lgdCode": gpLgd,
    //           },


    //     );
    //     if (res?.data?.statusCode === '0') {
    //         const r = res.data;
    //         console.log(r, "rerere")

    //         return onSuccess(r);

    //     } else if (res?.data?.statusCode === '1') {
    //         const r = res.data;
    //         console.log(r, "rerere")

    //         return onSuccess(r);
    //     } else {
    //         onFailure("Something Wrong! Please Try again later" + res.data);

    //     }
    // } catch (error) {
    //     console.log("fdgdf")
    // }
};




export const getAllContractorList = async (gpLgdCode) => {
    console.log(gpLgdCode, "gpLgdCode")
    return await webApi.get(`/contractor/allContractor/${gpLgdCode}`,
    );
}