module.exports = {

    sendDataToServer :(fetchConfig) => {
        fetch(fetchConfig.url, {
            method: "POST",
            body: JSON.stringify(fetchConfig.data),
            headers: { "Content-Type": "application/json" },
        }).then(response => response.json())
            .then((resData) => {
                fetchConfig.complete(resData)
                console.log(resData);
            }
            ).catch((error) => {
                console.log(error);
            })
    }
}