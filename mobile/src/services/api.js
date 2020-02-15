import { create } from 'apisauce';

const api = create({ 
    baseURL: 'http://192.168.15.62:3000',
});

if(api.ok) console.log ('Ok!');

api.addResponseTransform(response => {
    if(!response.ok) throw response;
});

export default api;