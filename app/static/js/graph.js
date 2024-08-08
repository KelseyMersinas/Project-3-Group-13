console.log('graph here')
function init() {
    fetch('/api/v1/data')
        .then(response => response.json())
        .then((data) => {
            // hre do stuff
            console.log(data);
        })
        .catch(error => console.error(error));
}

init();