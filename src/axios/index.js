import axios from "axios";

const serverURl = process.env.REACT_APP_API_BASE_URL;

const customAxios = axios.create({
    baseURL: serverURl
});

const requestHandler = (request) => {
    return request;
};

const responseHandler = (response) => {
    return response;
};

const errorHandler = (error) => {
    return error;
};

customAxios.interceptors.request.use(
    (request) => requestHandler(request),
    (error) => errorHandler(error)
);

customAxios.interceptors.response.use(
    (response) => responseHandler(response),
    (error) => errorHandler(error)
);

export default customAxios;