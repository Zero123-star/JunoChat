import React, { useState, useEffect } from 'react';
import { login, getCurrentUser } from '@/api';
import axios from 'axios';
const debug: React.FC = () => {
    const [formdata, setFormData] = useState({
        username: '',
        password: ''
      });
    const aux = async () => {
        axios.post('http://localhost:8000/api/users/check_credentials/', {
            username: 'ASD',
            password: '123'
          })
          .then(res => console.log('✅ Response:', res))
          .catch(err => {
            console.error('❌ Error:', err);
            if (err.response) {
              console.error('❌ Response Data:', err.response.data);
              console.error('❌ Status:', err.response.status);
            }
          });
    }
    const Modify = async () => {
        try{
        //const data = {username: "ASD", password: "123"};
        console.log(formdata);
        const aux={username: "ASD", password: "1233"}
        setFormData(aux);
        console.log(formdata);
        const response=await login(formdata);
        console.log(response)
    }
    catch(er)
    {
        console.log(er)
    }
    }

    return (
        <div><button onClick={Modify}>debug</button>
        <button onClick={aux}>debug2</button></div>
    );
  };
export default debug  