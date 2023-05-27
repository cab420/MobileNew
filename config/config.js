//Update the URL variable to match that of the local IP address of the server
const URL = "http://192.168.10.159"
//Leave below ports as as API = ":3002" and SOCKET = ":8000"
const API_PORT = ":3002";
const SOCKET_PORT = ":8000"

//export const API_URL = URL + API_PORT;
export const SOCKET_URL =  URL + SOCKET_PORT

export function API() {
    const http = "http://"
    const API_PORT = ":3002";
    const fsShite = ''
    const API_URL = http+fsShite+API_PORT
    return API_URL;
}
