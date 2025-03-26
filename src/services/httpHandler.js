import axios from 'axios';
import config from "../config/config"
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
    baseURL: config.backendUrl,
});

axiosInstance.interceptors.request.use(
    config => {
        const authToken = JSON.parse(localStorage.getItem("authToken"));
        
        if (authToken) {
            config.headers['Authorization'] = `Bearer ${authToken?.tokens?.access?.token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

const postRawData = async (url, data) => {
    try {

        const res = await axiosInstance.post(url, data);
        return res.data;

    } catch (error) {

        if (error.response.data?.message) {
            toast.error(error.response.data?.message)
        } else {
            toast.error("Something went wrong")
        }
        return null;
    }
};

const postFormData = async (url, data) => {
    try {
        const formData = new FormData();
        for (let key in data) {
            formData.append(key, data[key]);
        }
        const response = await axiosInstance.post(url, formData);
        return response;
    } catch (error) {
        if (error.response.data?.message) {
            toast.error(error.response.data?.message)
        } else {
            toast.error("Something went wrong")
        }
        return null;
    }
};

const putFormData = async (url, data) => {
    try {
        const formData = new FormData();
        for (let key in data) {
            formData.append(key, data[key]);
        }
        const response = await axiosInstance.put(url, formData);
        return response;
    } catch (error) {
        if (error.response.data?.message) {
            toast.error(error.response.data?.message)
        } else {
            toast.error("Something went wrong")
        }
        return null;
    }
};

const getData = async (url) => {
    try {

        const response = await axiosInstance.get(url);
        return response;

    } catch (error) {
        if (error.response.data?.message) {
            toast.error(error.response.data?.message)
        } else {
            toast.error("Something went wrong")
        }
        return null;
    }
};

const deleteData = async (url) => {
    try {

        const response = await axiosInstance.delete(url);
        return response;

    } catch (error) {
        if (error.response.data?.message) {
            toast.error(error.response.data?.message)
        } else {
            toast.error("Something went wrong")
        }
        return null;
    }
};

export { postFormData, putFormData , getData, deleteData, postRawData }