import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useEffect, useState} from 'react';
import {setApiURL} from '../config/config';

export const AuthContext = createContext();

export const AuthContextProvider = ({children}) => {
    const [userInfo, setUserInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [splashLoading, setSplashLoading] = useState(false);
    const [err, setErr] = useState(null);
    const API_URL = setApiURL();
     
    
    //logs in user, sends user details to defined API route, stores user info in local storage ("userInfo")
    const login = async (email, password) => {
        
        setIsLoading(true);
        setErr("")
        
        await axios
            .post(`${API_URL}/api/auth/login`, {
                email,
                password,
                withCredentials: true,
            })
            .then(res => {                
                let userInfo = res.data;
                setUserInfo(userInfo);
                AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
                setErr(null);
                setIsLoading(false);                
            }).catch(e => {// error handling to be changed here
                setErr(`login error ${e} using ${API_URL}`);
                console.log(`login error ${e}`);                               
                setIsLoading(false);
        });  
    };

    //mfaVerify function, gets userinfo and sends it via defined API route with the mfa token as parameter
    const mfaVerify = async (token) => {
        let userInfo = await AsyncStorage.getItem('userInfo');
        userInfo = JSON.parse(userInfo);
        axios
            .post(
                `${API_URL}/api/auth/mfa`,                
                {

                    mfaToken: token,
                    email: userInfo.email,
                    withCredentials: true,
                })
            .then(res => {
                let userInfo = res.data;
                setErr(null);
                setUserInfo(userInfo);
                AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
                setIsLoading(false);
            }).catch(e => {// error handling to be changed here
                console.log(`login error ${e}`);
                console.log(e)
                setErr(`login error ${e}`);
                setIsLoading(false);
        }); 
    };

    //logs uuser out, uses currently logged in users access token as verification
    const logout = () => {
            
        setIsLoading(true);

        axios
            .post(
                `${API_URL}/api/auth/logout`,
                {},
                {
                    headers: {authorization: `Bearer ${userInfo.accessToken}`},
                },
            )
            .then(res => {
                AsyncStorage.removeItem('userInfo');
                setUserInfo({});
                setIsLoading(false);
            })
            .catch( e => {// error handling to be changed here
                console.log(`logout error ${e}`);
                setIsLoading(false);
            });
    };
    
    //keep track of logged in user
    const isLoggedIn = async () => {
        try {
                let userInfo = await AsyncStorage.getItem('userInfo');
                userInfo = JSON.parse(userInfo);
                axios
                .post(`${API_URL}/api/auth/isLoggedIn`,
                        {},
                        {
                            headers: {authorization: `Bearer ${userInfo.accessToken}`},
                        },
                ).catch(function (error) {
                    console.log(error)
                    logout();
                })
            } catch (e) {
            console.log(e);
        };

        try {
            setSplashLoading(true);

            let userInfo = await AsyncStorage.getItem('userInfo');
            userInfo = JSON.parse(userInfo);

            if(userInfo) {
                setUserInfo(userInfo);
            }
            setSplashLoading(false);
        } catch(e) {
            setSplashLoading(false);
            console.log(`logged in error ${e}`);
        }
    };
    
    useEffect(() => {
        isLoggedIn();
    }, []); // [] is used here to ensure single render
      

    return (
        <AuthContext.Provider
            value={{
                isLoading,
                userInfo,
                splashLoading,
                login,
                logout,
                err,
                mfaVerify
            }}>{children}
        </AuthContext.Provider>
    );
};

