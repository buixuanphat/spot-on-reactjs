import axios from "axios";
import cookie from 'react-cookies'

const BASE_URL = "http://localhost:8080/spot-on";

export const endpoints = {
    'getUsers': '/users',
    'logIn': '/auth/log-in',
    'currentUser': '/secure/me',
    'getUser': (id) => `/users/${id}`,
    'updateUser': (id) => `/users/${id}`,
    'organizerRegister': '/organizers/register',
    'getOrganizers' : '/organizers',
    'getOrganizer' : (id) => `/organizers/${id}`,
    'verifyOrganizer' : (id) => `/organizers/verify/${id}`,
    'eventRegister' : '/events/register',
    'getOrganizerByUser' : (userId) => `/users-organizers/${userId}`,
    'getEvents' : '/events'
}


export const authApis = () => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${cookie.load('token')}`
        }
    })
}

export const banksApis = () => {
    return axios.create({
        baseURL: 'https://api.vietqr.io/v2/banks'
    })
}

export default axios.create({
    baseURL: BASE_URL
})