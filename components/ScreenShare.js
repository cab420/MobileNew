import SocketIOClient from 'socket.io-client'; // import socket io
import io from 'socket.io-client';
import { SOCKET_URL, PEER_URL } from '../config/config';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, Dimensions } from 'react-native'
import { Button, Input, Image } from "react-native-elements";     
import {ImageBackground} from 'react-native'; // for background image
// import WebRTC 
import {
  mediaDevices,
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';
import { AuthContextProvider, AuthContext } from "../context/AuthContext";
import React, {useState, useRef, useContext, useEffect} from 'react'

//new stuff below//new stuff below//new stuff below//new stuff below//new stuff below https://github.com/Diegocndd/WebRTC-ReactNative-to-Browser/blob/main/react/App.js

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default ScreenShare = _ => {
  let socket, peer;
  let config = {
    iceServers: [
      {urls: 'stun:stun.services.mozilla.com'},
      {urls: 'stun:stun.l.google.com:19302'},
    ],
  };

  const [remoteStream, setRemoteStream] = useState();
  const [localStream, setLocalStream] = useState();
  let clients = {};

  const remote = () => {
    socket = io();
    socket
      .on('connect', _ => socket.emit('watcher'))
      .on('offer', async (id, desc) => {
        peer = new RTCPeerConnection(config);
        peer
          .setRemoteDescription(new RTCSessionDescription(desc))
          .then(_ => peer.createAnswer())
          .then(sdp => peer.setLocalDescription(sdp))
          .then(_ => socket.emit('answer', id, peer.localDescription));
        peer.onicecandidate = e => {
          e.candidate && socket.emit('candidate', id, e.candidate);
        };
        peer.onaddstream = e =>
          e.stream && remoteStream !== e.stream && setRemoteStream(e.stream);
      })
      .on('candidate', (id, candidate) =>
        peer.addIceCandidate(new RTCIceCandidate(candidate)),
      )
      .on('disconnectPeer', _ => {
        peer.close();
        socket.disconnect(true);
      });
  };

  const broadcast = async _ => {
    const stream = await mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    socket = io('http://192.168.1.86:8000');
    socket
      .on('connect', _ => socket.emit('broadcaster'))
      .emit('watcher')
      .on('watcher', id => {
        peer = new RTCPeerConnection(config);
        clients[id] = peer;
        peer.addStream(stream);
        peer
          .createOffer()
          .then(sdp => peer.setLocalDescription(sdp))
          .then(_ => socket.emit('offer', id, peer.localDescription));
        peer.onicecandidate = e =>
          e.candidate && socket.emit('candidate', id, e.candidate);
      })
      .on('answer', (id, desc) =>
        clients[id].setRemoteDescription(new RTCSessionDescription(desc)),
      )
      .on('candidate', (id, candidate) =>
        clients[id].addIceCandidate(new RTCIceCandidate(candidate)),
      )
      .on('disconnectPeer', id => {
        const client = clients[id];

        if (client) {
          clients[id].close();
          delete clients[id];
        }
      });

    setLocalStream(stream);
  };

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1}}>
        {(localStream && (
          <RTCView
            streamURL={localStream.toURL()}
            zIndex={0}
            objectFit={'cover'}
            style={styles.fullScreen}
          />
        )) || <Button title="begintransmission" onPress={_ => broadcast()} />}
      </View>
    </View>
  );
};

//harry stuff below//harry stuff below//harry stuff below//harry stuff below//harry stuff below//harry stuff below//harry stuff below//harry stuff below//harry stuff below//harry stuff below

// export default function ScreenShare({ navigation }) {
//     // grab user info from context
//     /*
//     const userVideo = useRef();
//     const partnerVideo = useRef();
//     const peerRef = useRef();
//     const socketRef = useRef();
//     const otherUser = useRef();
//     const userStream = useRef();
//     */
//     const { userInfo } = useContext(AuthContext);
//     const [userVideo, setUserVideo] = useState(null);
//     const [userStream, setUserStream] = useState();
//     const [peerRef, setPeerRef] = useState();
//     const [socketRef, setSocketRef] = useState(SocketIOClient(SOCKET_URL, {
//       transports: ['websocket'],
//       query: {
//         userInfo      
//       },
//     }));
//     const [otherUser, setOtherUser] = useState();
  
//     roomID = userInfo.team;
  
//     useEffect(() => {
//         mediaDevices.getDisplayMedia({ audio: true, video: true }).then(stream => {
//             setUserVideo(stream);            
//             setUserStream(stream);
//             console.log('setuserstream!')
  
//             setSocketRef(SocketIOClient(SOCKET_URL, {
//               transports: ['websocket'],
//               query: {
//                 userInfo      
//               },
//             }))
            
//             console.log(roomID);
//             socketRef.emit("join room", roomID);
  
//             socketRef.on('other user', userID => {
//                 console.log('other users ' + userID)
//                 callUser(userID);
//                 setOtherUser(userID);
//             });
  
//             socketRef.on("user joined", userID => {
//                 setOtherUser(userID);
//             });
  
//             socketRef.on("offer", handleRecieveCall);
  
//             socketRef.on("answer", handleAnswer);
  
//             socketRef.on("ice-candidate", handleNewICECandidateMsg);
//         });
  
//     }, []);
  
//     function callUser(userID) {
//         setPeerRef(createPeer(userID));
//         console.log('calleduser')
//         userStream.getTracks().forEach(track => peerRef.addTrack(track, userStream));
//         console.log('promise error above')
//     }
  
//     function createPeer(userID) {
//         const peer = new RTCPeerConnection({
//             iceServers: []
//         });
  
//         peer.onicecandidate = handleICECandidateEvent;
//         peer.ontrack = handleTrackEvent;
//         peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);
  
//         return peer;
//     }
  
//     function handleNegotiationNeededEvent(userID) {
//         peerRef.createOffer().then(offer => {
//             return peerRef.setLocalDescription(offer);
//         }).then(() => {
//             const payload = {
//                 target: userID,
//                 caller: socketRef.id,
//                 sdp: peerRef.localDescription
//             };
//             socketRef.emit("offer", payload);
//         }).catch(e => console.log(e));
//     }
  
//     function handleRecieveCall(incoming) {
//         setPeerRef(createPeer());
//         const desc = new RTCSessionDescription(incoming.sdp);
//         peerRef.setRemoteDescription(desc).then(() => {
//             userStream.getTracks().forEach(track => peerRef.addTrack(track, userStream));
//         }).then(() => {
//             return peerRef.createAnswer();
//         }).then(answer => {
//             return peerRef.setLocalDescription(answer);
//         }).then(() => {
//             const payload = {
//                 target: incoming.caller,
//                 caller: socketRef.id,
//                 sdp: peerRef.localDescription
//             }
//             socketRef.emit("answer", payload);
//         })
//     }
  
//     function handleAnswer(message) {
//         const desc = new RTCSessionDescription(message.sdp);
//         peerRef.setRemoteDescription(desc).catch(e => console.log(e));
//     }
  
//     function handleICECandidateEvent(e) {
//         if (e.candidate) {
//             const payload = {
//                 target: otherUser,
//                 candidate: e.candidate,
//             }
//             socketRef.emit("ice-candidate", payload);
//         }
//     }
  
//     function handleNewICECandidateMsg(incoming) {
//         const candidate = new RTCIceCandidate(incoming);
  
//         peerRef.addIceCandidate(candidate)
//             .catch(e => console.log(e));
//     }
  
//     function handleTrackEvent(e) {
//         partnerVideo.srcObject = e.streams[0];
//     };
  
//     return (
      
//       <Button 
//         onPress={() => {
          
//           //startRecording();
//         }}
//         title= "End Share" 
//       />        
  
//   )
//   }

const styles = StyleSheet.create({
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
  },
});