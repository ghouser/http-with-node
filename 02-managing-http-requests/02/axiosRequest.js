const axios = require('axios');

axios({
    method: 'post',
    url: 'http://localhost:8080/users',
    data: {
        userName: 'ghouser'
    },
    transformRequest: (data, headers) => {
        const newData ={
            userName: data.userName + '@localhost'
        }
        return JSON.stringify(newData);
    }
})
.then((res) => {
  res.data.pipe(fs.createWriteStream('google.html'))
})
.catch((err) => {
    console.error(err);
})