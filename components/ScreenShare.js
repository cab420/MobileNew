import SocketIOClient from 'socket.io-client'; // import socket io
import { SOCKET_URL, PEER_URL } from '../config/config';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput } from 'react-native'
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
//get context so we can access the user information to send screen share to the correct room/team
import { AuthContextProvider, AuthContext } from "../context/AuthContext";
import React, {useState, useRef, useContext, useEffect} from 'react'

export default function ScreenShare({ navigation }) {
  // grab user info from context
  /*
  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const socketRef = useRef();
  const otherUser = useRef();
  const userStream = useRef();
  */
  const { userInfo } = useContext(AuthContext);
  const [userVideo, setUserVideo] = useState(null);
  const [userStream, setUserStream] = useState();
  const [peerRef, setPeerRef] = useState();
  const [socketRef, setSocketRef] = useState(SocketIOClient(SOCKET_URL, {
    transports: ['websocket'],
    query: {
      userInfo      
    },
  }));
  const [otherUser, setOtherUser] = useState();

  roomID = userInfo.team;

  useEffect(() => {
      mediaDevices.getDisplayMedia({ audio: true, video: true }).then(stream => {
          setUserVideo(stream);            
          setUserStream(stream);
          console.log('setuserstream!')

          setSocketRef(SocketIOClient(SOCKET_URL, {
            transports: ['websocket'],
            query: {
              userInfo      
            },
          }))
          
          console.log(roomID);
          socketRef.emit("join room", roomID);

          socketRef.on('other user', userID => {
              console.log('other users ' + userID)
              callUser(userID);
              setOtherUser(userID);
          });

          socketRef.on("user joined", userID => {
              setOtherUser(userID);
          });

          socketRef.on("offer", handleRecieveCall);

          socketRef.on("answer", handleAnswer);

          socketRef.on("ice-candidate", handleNewICECandidateMsg);
      });

  }, []);

  function callUser(userID) {
      setPeerRef(createPeer(userID));
      console.log('calleduser')
      userStream.getTracks().forEach(track => peerRef.addTrack(track, userStream));
      console.log('promise error above')
  }

  function createPeer(userID) {
      const peer = new RTCPeerConnection({
          iceServers: []
      });

      peer.onicecandidate = handleICECandidateEvent;
      peer.ontrack = handleTrackEvent;
      peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

      return peer;
  }

  function handleNegotiationNeededEvent(userID) {
      peerRef.createOffer().then(offer => {
          return peerRef.setLocalDescription(offer);
      }).then(() => {
          const payload = {
              target: userID,
              caller: socketRef.id,
              sdp: peerRef.localDescription
          };
          socketRef.emit("offer", payload);
      }).catch(e => console.log(e));
  }

  function handleRecieveCall(incoming) {
      setPeerRef(createPeer());
      const desc = new RTCSessionDescription(incoming.sdp);
      peerRef.setRemoteDescription(desc).then(() => {
          userStream.getTracks().forEach(track => peerRef.addTrack(track, userStream));
      }).then(() => {
          return peerRef.createAnswer();
      }).then(answer => {
          return peerRef.setLocalDescription(answer);
      }).then(() => {
          const payload = {
              target: incoming.caller,
              caller: socketRef.id,
              sdp: peerRef.localDescription
          }
          socketRef.emit("answer", payload);
      })
  }

  function handleAnswer(message) {
      const desc = new RTCSessionDescription(message.sdp);
      peerRef.setRemoteDescription(desc).catch(e => console.log(e));
  }

  function handleICECandidateEvent(e) {
      if (e.candidate) {
          const payload = {
              target: otherUser,
              candidate: e.candidate,
          }
          socketRef.emit("ice-candidate", payload);
      }
  }

  function handleNewICECandidateMsg(incoming) {
      const candidate = new RTCIceCandidate(incoming);

      peerRef.addIceCandidate(candidate)
          .catch(e => console.log(e));
  }

  function handleTrackEvent(e) {
      partnerVideo.srcObject = e.streams[0];
  };

  return (
    
    <Button 
      onPress={() => {
        
        //startRecording();
      }}
      title= "End Share" 
    />        

)
}