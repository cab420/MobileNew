/*This function is currently commented out as it is in a non-functional state. A complete explanation of this can
be seen within the report handed over with this code. */
/*
import SocketIOClient from 'socket.io-client'; // import socket io
import { SOCKET_URL, PEER_URL } from '../config/config';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput } from 'react-native'
import { Button, Input, Image } from "react-native-elements";     
import {ImageBackground} from 'react-native'; // for background image
import TextInputContainer from '../components/TextInputContainer';
import  Peer  from 'react-native-peerjs';
// import WebRTC 
import {
  mediaDevices,
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';
import React, {useState, useRef, useContext, useEffect} from 'react'
import { AuthContextProvider, AuthContext } from "../context/AuthContext";

//screen share function that gets local stream and sends to connected peer server
export default async function ScreenShare(userInfo) {

//create information and set a new peer with this info
  const peer_server = {
    secure: false,
    host: PEER_URL,
    port: '3001',
    path: '/',
    config: {'iceServers': []},
    debug: '3'
  }
    const myPeer = new Peer(userInfo.name, peer_server)
    //create connection to the socket server
    const socket = SocketIOClient(SOCKET_URL, {
      transports: ['websocket'],
      query: {
        userInfo      
      },
    });

  //listen for peer connection
  //once connection occurs join the logged in users teams room
  myPeer.on('open', () => {
      console.log('opens' + userInfo.team + userInfo.name)
      socket.emit('join-team', userInfo.team, userInfo.name);     
  })
  //listen for call from connected users and create local stream
  //in this itteration getUserMedia is used. This function returns the users webcam rather than
  //getDeviceMedia which returns the users screen. This is for testing purposes
  myPeer.on('call', call => {
    mediaDevices.getUserMedia({
      audio: true,
      video: true
    }).then(stream => {      
      call.answer(stream);
      socket.on("user-connected", userName => {
        console.log('user connected ' + userName)
        connectToUser(userName, stream);
      })
    }).catch((err) => {
      console.log(err);
    })     
    call.on('stream', stream => {
      console.log('wanktime')
    })    
  })

 //calls user when they connect. Does not add phonestream as the mobile does not display any video
  async function connectToUser(userName, stream) {    
    const call = myPeer.call(userName, stream);    
    call.on('stream', userVideoStream => {
      //addPhoneStream(video, userVideoStream)
  });    
  }    

  //handles disconnection
    function disconnectFromUser() {     
      myPeer.disconnect(); 
    }
//returns a button to disconnect once connection begins
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
*/