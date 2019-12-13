import fetch from 'cross-fetch'
export function fetchInitCall(type, txnId, pageId, data) {
    let completeFlag = false;
    // let url = `http://localhost:3000/${txnId}/${pageId}_initView`;
    let url = `${CONNECTION_CONFIG}/${txnId}/${pageId}_initView`;

    const token = localStorage.getItem('token');
    return {
        type: type,
        payload:
            // fetch('https://zachriel-accountting.herokuapp.com/getUserDetailByName', {
            fetch(url, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
                mode: 'cors',
            }).then(response => response.json())
                .then((respData) => {
                    
                    completeFlag = true;

                    if (respData.data.length === 0) {
                        logoutUser();
                    } else {
                        return respData.data
                    }
                }
                ).catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    
                    if (completeFlag) {
                        console.log('fetching complete')
                    }
                }),
    }
}

export function fetchAction(data, url, type) {
    let completeFlag = false;
    
    const token = localStorage.getItem('token');
    // let fixUrl = `http://localhost:3000${url}`;
    let fixUrl = `${CONNECTION_CONFIG}${url}`;

    let user_id = localStorage.getItem('user_id');
    data.user_id = user_id;

    return {
        type: type,
        payload:
            fetch(fixUrl, {

                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
                mode: 'cors',
            }).then(response => response.json())
                .then((respData) => {
                    completeFlag = true;
                    // callback(respData.data);
                    return respData.data;
                }
                ).catch((error) => {
                    console.log(error);
                }).finally(() => {

                    if (completeFlag) {
                        console.log('ajax complete!')
                    }
                }),
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

