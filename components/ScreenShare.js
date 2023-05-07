
//https://github.com/videosdk-live/webrtc/blob/main/react-native-webrtc-app/client/App.js uses this as resource

import SocketIOClient from 'socket.io-client'; // import socket io
import { SOCKET_URL, PEER_URL } from '../config/config';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput } from 'react-native'
import { Button, Input, Image } from "react-native-elements";     
import {ImageBackground} from 'react-native'; // for background image
import TextInputContainer from '../components/TextInputContainer';
import InCallManager from 'react-native-incall-manager'; //may not need this

import  Peer  from 'react-native-peerjs';


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

export default function ScreenShare(userInfo) {
  
  //const [myPeer, setMyPeer] = useState(new Peer());
  //const [call, setCall] = useState();



  const peer_server = {
    secure: false,
    host: PEER_URL,
    port: '3001',
    path: '/',
    config: {'iceServers': []},
    debug: '3'
  }
  const iceConfig = { 'iceServers': []}
  
  
    const myPeer = new Peer(userInfo.name, peer_server)
    //setMyPeer(thePeer)
  
    
  
  
    console.log('shouldve made peer')
  
    const socket = SocketIOClient(SOCKET_URL, {
      transports: ['websocket'],
      query: {
        userInfo      
      },
    });

  
  myPeer.on('open', () => {
      console.log('opens' + userInfo.team + userInfo.name)
      socket.emit('join-team', userInfo.team, userInfo.name);
      console.log('emits')
  })

  myPeer.on('call', call => {
    mediaDevices.getDisplayMedia({
      audio: true,
      video: true
    }).then(stream => {
      call.answer(stream);
    })     
    call.on('stream', stream => {
      console.log('wanktime')
    })    
  })

  socket.on("user-connected", userName => {
    console.log('user connected ' + userName)
    connectToUser(userName, stream);
  })


  /* bad code
  mediaDevices.getDisplayMedia({
    video: true
  }).then(stream => {
    
    socket.emit('mobile-stream', userInfo.name);
    console.log('makes it before call')
    console.log(myPeer)
    
    myPeer.on('call', call => {
      console.log('getscall')
      //sends stream
      call.answer(stream);          
    })
    
    //allow users to connect to video
    
    socket.on("user-connected", userName => {
      console.log('user connected ' + userName)
      connectToUser(userName, stream);
    })
    
    }    
  )
  */
  

  function connectToUser(userName, stream) {    
    console.log('pre calling')
    
      const call = myPeer.call(userName, stream); 
      //setCall(newCall);
    
    
    console.log('calling')
    call.on('stream', userVideoStream => {
      //addPhoneStream(video, userVideoStream)
  });  
  
  }    

    function disconnectFromUser() {
      //myPeer.destroy();
      myPeer.disconnect();      
      console.log('tried to destroy')
    }


  
  return (
    
    <Button 
      onPress={() => {
        disconnectFromUser();
        //startRecording();
      }}
      title= "End Share" 
    />        

)
  
  

  }