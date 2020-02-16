import { create } from 'apisauce';

//Connect to backend
const api = create({ 
    baseURL: 'http://192.168.100.46:3000',
});

if(api.ok) console.log ('Ok!');

api.addResponseTransform(response => {
    if(!response.ok) throw response;
});

export default api;