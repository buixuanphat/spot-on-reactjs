import axios from "axios";
import cookie from 'react-cookies'

const BASE_URL = "http://localhost:8080/spot-on";

export const endpoints = {
    'getUsers': '/users',
    'createUser': '/users',
    'logIn': '/auth/log-in',
    'currentUser': '/secure/me',
    'getUser': (id) => `/users/${id}`,
    'updateUser': (id) => `/users/${id}`,
    'disableUser': (id) => `/users/disable/${id}`,


    'organizerRegister': '/organizers/register',
    'getOrganizers': '/organizers',
    'getOrganizer': (id) => `/organizers/${id}`,
    'verifyOrganizer': (id) => `/organizers/verify/${id}`,
    'updateOrganizer': (id) => `/organizers/${id}`,


    'eventRegister': '/events/register',
    'getOrganizerByUser': (userId) => `/users-organizers/${userId}`,
    'getEvents': '/events',
    'getEvent': (id) => `/events/${id}`,
    'verifyEvent': (id) => `/events/verify/${id}`,
    'runEvent': (id) => `/events/run/${id}`,
    'uploadImage': '/cloud/image',
    'getTicketInfo': (id) => `/invoices/ticket-info/${id}`,



    'getMerchandises': '/merchandises',
    'createMerchandise': '/merchandises',


    'getSections': '/sections',
    'createSection': '/sections',
    'deleteSection': (id) => `/sections/${id}`,
    'updateSection': (id) => `/sections/${id}`,


    'getVouchersByOrganizer': "/vouchers",
    'createVoucher': "/vouchers",
    'deleteVoucher': (id) => `/vouchers/${id}`,
    'getVouchersByEvent': `/vouchers-events/event`,
    'addVoucherEvent': '/vouchers-events',
    'deleteVoucherEvent': (id) => `/vouchers-events/${id}`,
    'getVoucher': (id) => `/vouchers/${id}`,
    'updateVoucher': (id) => `/vouchers/${id}`,


    'getEventMerchandises': '/event-merchandise',
    'createEventMerchandise': '/event-merchandise',
    'deleteEventMerchandise': (id) => `/event-merchandise/${id}`,
    'getMerchandise': (id) => `/merchandises/${id}`,
    'updateMerchandise': (id) => `/merchandises/${id}`,


    'getGenres': '/genres',


    'getEventPaymentStat': '/events/stats/payment',
    'getEventTicketStat': '/events/stats/ticket',
    'getOrganizerPaymentStat': '/organizer/stats/payment',
    'getOrganizerTicketStat': '/organizer/stats/ticket',


    'getPosts': '/posts',
    'getPost': (id) => `/posts/${id}`,
    'deletePost': (id) => `/posts/${id}`,
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