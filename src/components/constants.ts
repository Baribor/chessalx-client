import axios from "axios";
import Pusher from "pusher-js";
import { getFullURL } from "./utils";

export const ENDPOINTS = {
	pusher_auth: '/auth/pusher',
	pusher_user_auth: '/auth/pusher-signin',
	signup: '/auth/signup',
	login: '/auth/login',
	getProfile: '/profile',
	searchUsers: '/profile/search?',
	requestGame: '/game/request',
	acceptGame: '/game/accept',
	resignGame: '/game/resign',
}

export const axiosInstance = axios.create({
	validateStatus: () => true,
})

export const pusher = new Pusher('50ef891595a3116ba20a', {
	cluster: 'eu',
	channelAuthorization: {
		transport: 'ajax',
		endpoint: getFullURL(ENDPOINTS.pusher_auth),
		headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
	},
	userAuthentication: {
		endpoint: getFullURL(ENDPOINTS.pusher_user_auth),
		transport: 'ajax',
		headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
	}
});

export enum MODAL_TYPE {
	startGame,
}
