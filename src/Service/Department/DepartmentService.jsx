import webApi, { baseURL } from "../../WebApi/WebApi";

export const getAllDepartmentList = async () => {    
    return await webApi.get(`/Department/Get`,
    );
}