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
    'getEvents' : '/events',
    'getEvent' : (id) => `/events/${id}`,
    'verifyEvent': (id) => `/events/verify/${id}`,
    'getMerchandises' : '/merchandises',
    'createMerchandise' : '/merchandises',
    'getSections' : '/sections',
    'createSection' : '/sections',
    'deleteSection' : (id) => `/sections/${id}`,
    'getVouchersByOrganizer' : "/vouchers",
    'createVoucher' : "/vouchers",
    'deleteVoucher' : (id) => `/vouchers/${id}`,
    'getVouchersByEvent' : `/vouchers-events/event`,
    'addVoucherEvent' : '/vouchers-events',
    'deleteVoucherEvent' : (id) => `/vouchers-events/${id}`,
    'getEventMerchandises' : '/event-merchandise' ,
    'createEventMerchandise' : '/event-merchandise',
    'deleteEventMerchandise' : (id) => `/event-merchandise/${id}`,

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

export const provinceApis = () => {
    return axios.create({
        baseURL: 'https://provinces.open-api.vn/api/v1'
    })
}


export default axios.create({
    baseURL: BASE_URL
})