
//https://github.com/videosdk-live/webrtc/blob/main/react-native-webrtc-app/client/App.js uses this as resource

import SocketIOClient from 'socket.io-client'; // import socket io
import { SOCKET_URL } from '../config/config';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput } from 'react-native'
import { Button, Input, Image } from "react-native-elements";     
import {ImageBackground} from 'react-native'; // for background image
import TextInputContainer from '../components/TextInputContainer';
import InCallManager from 'react-native-incall-manager'; //may not need this


// import WebRTC 
import {
  mediaDevices,
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';

//get context so we can access the user information to send screen share to the correct room/team
import React, {useState, useRef, useContext, useEffect} from 'react'

import { AuthContextProvider, AuthContext } from "../context/AuthContext";

export default function ScreenShare({ navigation }) {
  // grab user info from context
  const userVideo = useRef();
  const partnerVideo = useRef();
  const peerRef = useRef();
  const socketRef = useRef();
  const otherUser = useRef();
  const userStream = useRef();

  const { roomID } = useContext(AuthContext);

  useEffect(() => {
      mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
          userVideo.current.srcObject = stream;            
          userStream.current = stream;

          socketRef.current = io.connect("/");
          
          console.log(roomID);
          socketRef.current.emit("join room", roomID);

          socketRef.current.on('other user', userID => {
              callUser(userID);
              otherUser.current = userID;
          });

          socketRef.current.on("user joined", userID => {
              otherUser.current = userID;
          });

          socketRef.current.on("offer", handleRecieveCall);

          socketRef.current.on("answer", handleAnswer);

          socketRef.current.on("ice-candidate", handleNewICECandidateMsg);
      });

  }, []);

  function callUser(userID) {
      peerRef.current = createPeer(userID);
      userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
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
      peerRef.current.createOffer().then(offer => {
          return peerRef.current.setLocalDescription(offer);
      }).then(() => {
          const payload = {
              target: userID,
              caller: socketRef.current.id,
              sdp: peerRef.current.localDescription
          };
          socketRef.current.emit("offer", payload);
      }).catch(e => console.log(e));
  }

  function handleRecieveCall(incoming) {
      peerRef.current = createPeer();
      const desc = new RTCSessionDescription(incoming.sdp);
      peerRef.current.setRemoteDescription(desc).then(() => {
          userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
      }).then(() => {
          return peerRef.current.createAnswer();
      }).then(answer => {
          return peerRef.current.setLocalDescription(answer);
      }).then(() => {
          const payload = {
              target: incoming.caller,
              caller: socketRef.current.id,
              sdp: peerRef.current.localDescription
          }
          socketRef.current.emit("answer", payload);
      })
  }

  function handleAnswer(message) {
      const desc = new RTCSessionDescription(message.sdp);
      peerRef.current.setRemoteDescription(desc).catch(e => console.log(e));
  }

  function handleICECandidateEvent(e) {
      if (e.candidate) {
          const payload = {
              target: otherUser.current,
              candidate: e.candidate,
          }
          socketRef.current.emit("ice-candidate", payload);
      }
  }

  function handleNewICECandidateMsg(incoming) {
      const candidate = new RTCIceCandidate(incoming);

      peerRef.current.addIceCandidate(candidate)
          .catch(e => console.log(e));
  }

  function handleTrackEvent(e) {
      partnerVideo.current.srcObject = e.streams[0];
  };
}