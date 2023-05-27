//Update the URL variable to match that of the local IP address of the server
import * as RNFS from 'react-native-fs';
var path = RNFS.DocumentDirectoryPath  + '/ipconfig.txt';

export const setApiURL = (() => {

const file = RNFS.readFile(path);
console.log("this", file);

//const URL = "http://192.168.10.159"
//Leave below ports as as API = ":3002" and SOCKET = ":8000"

    const SOCKET_PORT = ":8000"
    const http = "http://"
    const API_PORT = ":3002";
    const API_URL = http+file+API_PORT

    return API_URL;

})

//const SOCKET_PORT = ":8000"
//export const SOCKET_URL =  URL + SOCKET_PORT