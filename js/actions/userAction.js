import fetch from 'cross-fetch'

export function fetchUser(data) {
    return {
        type: 'FETCH_USER',
        payload:
            fetch('https://zachriel-accountting.herokuapp.com/getUserDetailByName', {
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
    // return  {
    //         type: 'FETCH_USER_FULFILLED',
    //         payload: {
    //             id: '@zachriel31',
    //             name: 'zack',
    //             email: 'tc101fubonzack@gmail.com',
    //         }
    //     }
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

                localStorage.setItem('username', respData.data.userData.name);
                localStorage.setItem('token', respData.data.tokenID);

                console.log(respData);
                completeFlag = true;
                return respData.data.userData;

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