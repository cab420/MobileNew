
//https://github.com/videosdk-live/webrtc/blob/main/react-native-webrtc-app/client/App.js uses this as resource

import SocketIOClient from 'socket.io-client'; // import socket io
import { SOCKET_URL, PEER_URL } from '../config/config';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput } from 'react-native'
import { Button, Input, Image } from "react-native-elements";     
import {ImageBackground} from 'react-native'; // for background image
import TextInputContainer from '../components/TextInputContainer';
import InCallManager from 'react-native-incall-manager'; //may not need this

import Peer from 'react-native-peerjs';


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

  const myPeer = new Peer(userInfo.name, {
    host: PEER_URL,
    port: '3001'
  })

  const socket = SocketIOClient(SOCKET_URL, {
    transports: ['websocket'],
    query: {
      userInfo      
    },
  });
  //create video grid element
  //const videoGrid = document.getElementById('videoGrid');

  //create own video element
  //const myVideo = document.createElement('video');

  mediaDevices.getDisplayMedia({
    video: {
      mandatory: {
        minWidth: 500, // Provide your own width, height and frame rate here
        minHeight: 300,
        minFrameRate: 30,
      }
    }
  }).then(stream => {

    }    
  )
   
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