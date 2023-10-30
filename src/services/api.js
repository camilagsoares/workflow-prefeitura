import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

const tokenInStorage = localStorage.getItem('token');



const axiosApi = axios.create({
  baseURL: `https://177.200.96.132:8066/api`,
  headers: {
    Authorization: `Bearer ${tokenInStorage}`,
    'Content-Type': 'application/json',
  },
});

const configHeaders = () => ({
  Authorization: `Bearer ${tokenInStorage}`,
  'Content-Type': 'application/json',
});

const useApiLogin = () => {
  const [loginData, setLoginData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // const login = async (payload) => {
  //   setError(null);
  //   setLoading(true);
  //   try {
  //     const response = await axios.post(`http://177.200.96.132:5477/api/auth/login`, payload, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });

  //     setLoginData(response.data);
  //     toast('Login efetuado com sucesso!', {
  //       type: 'success',
  //     });
  //   } catch (error) {
  //     toast(error.response.message, {
  //       type: 'error',
  //     });
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const login = async (payload) => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post(`https://177.200.96.132:8066/api/auth/login`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response && response.data) {
        // Defina o token e a sessão aqui após o login bem-sucedido
        localStorage.setItem('token', response.data.content.token); // Armazene o token
        localStorage.setItem('session', JSON.stringify(response.data.content.session)); // Armazene a sessão como JSON
        
        setLoginData(response.data);
        toast('Login efetuado com sucesso!', {
          type: 'success',
        });
      } else {
        throw new Error('Resposta da API não contém dados válidos');
      }
    } catch (error) {
      console.error('Erro durante o login:', error);
  
      toast('Ocorreu um erro durante o login', {
        type: 'error',
      });
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { loginData, error, loading, handlerSubmitLogin: (payload) => login(payload) };
};

const useApiRequestGet = (path, payload) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://177.200.96.132:8066/api${path}`, {
          data: payload,
          headers: configHeaders(),
        });
        // console.log('data =>> ', response.data.content);
        setData(response.data.content);
      } catch (error) {
        toast(error.response.data.message, {
          type: 'error',
        });
        setError(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  return { data, error, loading };
};

const useApiRequestSubmit = (method = 'post' | 'delete' | 'put', path) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (payload) => {
    try {
      setLoading(true);
      const response = await axios({
        method,
        url: `https://177.200.96.132:8066/api${path}`,
        data: payload,
        headers: configHeaders(),
      });

      setData(response.data);
    } catch (error) {
      toast(error.response.data.message, {
        type: 'error',
      });
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, handleSubmitData: (payload) => submit(payload) };
};

export { useApiLogin, useApiRequestGet, useApiRequestSubmit, axiosApi };
