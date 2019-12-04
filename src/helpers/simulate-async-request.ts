let json = require('../assets/product-data2.json');

export function simulateAsyncRequest() {
    return new Promise((res) =>{
        setTimeout(()=>{
            res(json)
        }, 10);
    })
}