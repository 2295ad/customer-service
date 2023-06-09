const axios = require('axios');
require('dotenv');

const {CMS_TOKEN} = process.env;

const defaultConfig = {
  baseUrl: 'http://185.210.144.38:1337',
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
};

const configureRequestParams = (config) => {
  const token = `Bearer ${CMS_TOKEN}`;
  config.headers && (config.headers['Authorization'] = token);
  return config;
};

const onFullFilled = (response) => ({
  data: response.data,
  error: undefined,
});

const onRejected = ({ message, response }) => {
  if (response?.status === 401) {
    // unautherised reload to login page
  }
  const errorObject = {
    data: undefined,
    error: {
      messsage: response?.data?.message || message,
      code: response.status,
    },
  };
  return Promise.reject(errorObject);
};

const strapiConfig = axios.create(defaultConfig);

strapiConfig.interceptors.request.use(configureRequestParams);

strapiConfig.interceptors.response.use(onFullFilled, onRejected);

module.exports = { strapiConfig };
