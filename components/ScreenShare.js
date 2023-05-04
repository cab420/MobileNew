
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

export default function ScreenShare({ navigation }) {
  const { userInfo } = useContext(AuthContext);

  const peer_server = {
    secure: false,
    host: PEER_URL,
    port: '3001',
    path: '/'
  }

  const myPeer = new Peer(userInfo.name, peer_server)
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

  mediaDevices.getDisplayMedia({
    video: {
      mandatory: {
        minWidth: 500, // Provide your own width, height and frame rate here
        minHeight: 300,
        minFrameRate: 30,
      }
    }
  }).then(stream => {
    myPeer.on('call', call => {
      //sends stream
      call.answer(stream);     
      
      //allow users to connect to video
      socket.on("user-connected", userName => {
        console.log('user connected ' + userName)
        connectToUser(userName, stream);
    })
      
  })
    }    
  )

  function connectToUser(userId, stream) {
    const call = myPeer.call(userId, stream);
    //const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        //addPhoneStream(userVideoStream)
    });   

}
   
  /*
    myPeer.on('open', () => {
      console.log('opens' + roomId + userName)
      socket.emit('join-team', roomId, userName);
      console.log('emits')
  })   
  */
    socket.on('user connected', userId => {
        console.log('User connected: ' + userId);
    })


  }