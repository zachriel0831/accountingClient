import fetch from 'cross-fetch'
import utils from '../common/utils/utils'

export function fetchUser(data) {

    return {

        type: 'FETCH_USER',
        payload:
            fetch('https://zachriel-accountting.herokuapp.com/getUserDetailByName', {
            // fetch('http://localhost:3000/getUserDetailByName', {

                method: "POST",
                headers: { "Content-Type": "application/json" },
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                mode: 'cors',
            }).then(response => response.json())
                .then((respData) => {
                    console.log(respData);
                    if (respData.data.length === 0) {
                        logoutUser();
                    } else {
                        return respData.data[0]

                    }

                }
                ).catch((error) => {
                    console.log(error);
                })

    }
}


export function fetchUserComplete(type, payload) {
    return {
        type: 'FETCH_USER_FULFILLED',
        payload: payload
    }

}

export function submitLogin(type, payload) {
    let completeFlag = false;
    return {
        type: type,
        payload:
            fetch(`https://zachriel-accountting.herokuapp.com/user/login`, {
            // fetch(`http://localhost:3000/user/login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                mode: 'cors'
            }).then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            }).then((respData) => {
                if (respData.data.userData.user_id) {
                    let userInfo = {};
                    userInfo.name = respData.data.userData.name;
                    userInfo.email = respData.data.userData.email;
                    userInfo.id = respData.data.userData.user_id;

                    utils.setCookie('userInfo', JSON.stringify(userInfo), 1)
                }

                localStorage.setItem('user_id',  respData.data.userData.user_id);
                localStorage.setItem('username', respData.data.userData.name);
                localStorage.setItem('token', respData.data.tokenID);

                console.log(respData);
                completeFlag = true;
                return respData.data;

            }).catch((e) => console.log(e))
                .finally(() => {

                    if (completeFlag) {
                        window.location.hash = '/Home'
                    }
                }),
    }
}

export function subscribeUser(type, payload) {
    let completeFlag = false;
    return {
        type: type,
        payload:
            fetch('https://zachriel-accountting.herokuapp.com/user/registering', {
            // fetch('http://localhost:3000/user/registering', {

                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                mode: 'cors'
            }).then(response => response.json())
                .then((respData) => {
                    localStorage.setItem('username', respData.data.userData.name);
                    localStorage.setItem('token', respData.data.tokenID);
                    console.log(respData);
                    completeFlag = true;
                    return respData.data.userData;
                }
                ).catch((error) => {
                    console.log(error);
                    alert(error)
                    return {
                        type: 'USER_SUBSCRIBE_REJECTED',
                        user_id: ''
                    }
                }).finally(() => {
                    if (completeFlag) {
                        window.location.hash = '/Home'
                    }
                })
    }
}


export function subscribeReject(type, payload) {
    return {
        type: 'USER_SUBSCRIBE_REJECTED',
        user_id: ''
    }

}

export function changeView(type, payload, status) {
    return {
        type: type,
        payload: payload,
        filter: status
    }
}

export function logoutUser() {

    localStorage.removeItem('username');
    localStorage.removeItem('token');

    return {
        type: 'USER_LOGOUT',
        payload: {}
    }
}


export function deleteUser() {

    return {
        type: 'DELETE_USER',
        payload: {
            user_id: '',
        }
    }
}