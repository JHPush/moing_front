import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import userReducer from './userSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),  // logger 추가
});

export default store;
