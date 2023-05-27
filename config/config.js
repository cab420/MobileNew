//Update the URL variable to match that of the local IP address of the server
import * as RNFS from 'react-native-fs';
var path = RNFS.ExternalDirectoryPath  + '/ipconfig.txt';
import React, {createContext, useEffect, useState} from 'react';

export function setApiURL() {

const [file, setFile] = useState('')
RNFS.readFile(path).then(result => setFile(result))
//console.log("this", file);

//const URL = "http://192.168.10.159"
//Leave below ports as as API = ":3002" and SOCKET = ":8000"

    const SOCKET_PORT = ":8000"
    const http = "http://"
    const API_PORT = ":3002";
    const API_URL = http+file+API_PORT

    return API_URL;

}

//const SOCKET_PORT = ":8000"
//export const SOCKET_URL =  URL + SOCKET_PORT
