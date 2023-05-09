
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
  
  //const [myPeer, setMyPeer] = useState(new Peer());
  //const [call, setCall] = useState();
  let remoteRTCMessage = useRef(null);
  const { userInfo } = useContext(AuthContext);
  const callerId = userInfo.name;


  const [localStream, setlocalStream] = useState(null);
  const [type, setType] = useState('JOIN');
/* When a call is connected, the video stream from the receiver is appended to this state in the stream*/
  const [remoteStream, setRemoteStream] = useState(null);
  const otherUserId = useRef(null);

// This establishes your WebSocket connection
const socket = SocketIOClient(SOCKET_URL, {
    transports: ['websocket'],
    query: {
        callerId, 
    /* We have generated this `callerId` in `JoinScreen` implementation */
    },
  });

 /* This creates an WebRTC Peer Connection, which will be used to set local/remote descriptions and offers. */
 const peerConnection = useRef(
    new RTCPeerConnection({
      iceServers: []
    }),
  );

    useEffect(() => {
      socket.emit('join room', userInfo.team, userInfo.name);
    socket.on('newCall', data => {
     /* This event occurs whenever any peer wishes to establish a call with you. */
    });

    socket.on('callAnswered', data => {
      /* This event occurs whenever remote peer accept the call. */
    });

    socket.on('ICEcandidate', data => {
      /* This event is for exchangin Candidates. */

    });

    let isFront = false;

/*The MediaDevices interface allows you to access connected media inputs such as cameras and microphones. We ask the user for permission to access those media inputs by invoking the mediaDevices.getUserMedia() method. */
    mediaDevices.enumerateDevices().then(sourceInfos => {
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'user' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }


      mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            mandatory: {
              minWidth: 500, // Provide your own width, height and frame rate here
              minHeight: 300,
              minFrameRate: 30,
            },
            facingMode: isFront ? 'user' : 'environment',
            optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
          },
        })
        .then(stream => {
          // Get local stream!
          setlocalStream(stream);

          // setup stream listening
          peerConnection.current.addStream(stream);
        })
        .catch(error => {
          // Log error
        });
    });

    peerConnection.current.onaddstream = event => {
      setRemoteStream(event.stream);
    };

    // Setup ice handling
    peerConnection.current.onicecandidate = event => {

    };

    return () => {
      socket.off('newCall');
      socket.off('callAnswered');
      socket.off('ICEcandidate');
    };
  }, []);

  useEffect(() => {
    socket.on("newCall", (data) => {
      remoteRTCMessage.current = data.rtcMessage;
      otherUserId.current = data.callerId;
      setType("INCOMING_CALL");
    });
  
    socket.on("callAnswered", (data) => {
      // 7. When Alice gets Bob's session description, she sets that as the remote description with `setRemoteDescription` method.
  
      remoteRTCMessage.current = data.rtcMessage;
      peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(remoteRTCMessage.current)
      );
      setType("WEBRTC_ROOM");
    });
  
    socket.on("ICEcandidate", (data) => {
      let message = data.rtcMessage;
  
      // When Bob gets a candidate message from Alice, he calls `addIceCandidate` to add the candidate to the remote peer description.
  
      if (peerConnection.current) {
        peerConnection?.current
          .addIceCandidate(new RTCIceCandidate(message.candidate))
          .then((data) => {
            console.log("SUCCESS");
          })
          .catch((err) => {
            console.log("Error", err);
          });
      }
    });
  
    // Alice creates an RTCPeerConnection object with an `onicecandidate` handler, which runs when network candidates become available.
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        // Alice sends serialized candidate data to Bob using Socket
        sendICEcandidate({
          calleeId: otherUserId.current,
          rtcMessage: {
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
          },
        });
      } else {
        console.log("End of candidates.");
      }
    };
  }, []);
  
  async function processCall() {
    // 1. Alice runs the `createOffer` method for getting SDP.
    const sessionDescription = await peerConnection.current.createOffer();
  
    // 2. Alice sets the local description using `setLocalDescription`.
    await peerConnection.current.setLocalDescription(sessionDescription);
  
    // 3. Send this session description to Bob uisng socket
    sendCall({
      calleeId: otherUserId.current,
      rtcMessage: sessionDescription,
    });
  }
  
  async function processAccept() {
    // 4. Bob sets the description, Alice sent him as the remote description using `setRemoteDescription()`
    peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(remoteRTCMessage.current)
    );
  
    // 5. Bob runs the `createAnswer` method
    const sessionDescription = await peerConnection.current.createAnswer();
  
    // 6. Bob sets that as the local description and sends it to Alice
    await peerConnection.current.setLocalDescription(sessionDescription);
    answerCall({
      callerId: otherUserId.current,
      rtcMessage: sessionDescription,
    });
  }
  
  function answerCall(data) {
    socket.emit("answerCall", data);
  }
  
  function sendCall(data) {
    socket.emit("call", data);
  }
  
  
  return (
    
    <Button 
      onPress={() => {
        //disconnectFromUser();
        //startRecording();
      }}
      title= "End Share" 
    />        

)
  
  

  }