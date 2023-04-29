
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
  const { userInfo, splashLoading } = useContext(AuthContext);

// Stream of local user
const [localStream, setlocalStream] = useState(null);

/* When a call is connected, the video stream from the receiver is appended to this state in the stream*/
const [remoteStream, setRemoteStream] = useState(null);

const [type, setType] = useState('JOIN');

const [localMicOn, setlocalMicOn] = useState(true);

const [localWebcamOn, setlocalWebcamOn] = useState(true);

const [callerId] = useState(
  Math.floor(100000 + Math.random() * 900000).toString(),
);

const otherUserId = useRef(null)

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
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
        {
          urls: 'stun:stun1.l.google.com:19302',
        },
        {
          urls: 'stun:stun2.l.google.com:19302',
        },
      ],
    }),
  );

    let remoteRTCMessage = useRef(null);

    useEffect(() => {
    socket.on('newCall', data => {
     /* This event occurs whenever any peer wishes to establish a call with you. */
    remoteRTCMessage.current = data.rtcMessage;
    otherUserId.current = data.callerId;
    setType('INCOMING_CALL');
    });

    socket.on('callAnswered', data => {
      /* This event occurs whenever remote peer accept the call. */
      remoteRTCMessage.current = data.rtcMessage;
      peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(remoteRTCMessage.current),
      );

    });

    socket.on('ICEcandidate', data => {
      /* This event is for exchangin Candidates. */
      let message = data.rtcMessage;

      if (peerConnection.current) {
        peerConnection?.current
          .addIceCandidate(
            new RTCIceCandidate({
              candidate: message.candidate,
              sdpMid: message.id,
              sdpMLineIndex: message.label,
            }),
          )
          .then(data => {
            console.log('SUCCESS');
          })
          .catch(err => {
            console.log('Error', err);
          });
      }

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
      if (event.candidate) {
        sendICEcandidate({
          calleeId: otherUserId.current,
          rtcMessage: {
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
          },
        });
      } else {
        console.log('End of candidates.');
      }
    };

    return () => {
      socket.off('newCall');
      socket.off('callAnswered');
      socket.off('ICEcandidate');
    };
  }, []);

  // useEffect(() => {
  //   InCallManager.start();
  //   InCallManager.setKeepScreenOn(true);
  //   InCallManager.setForceSpeakerphoneOn(true);

  //   return () => {
  //     InCallManager.stop();
  //   };
  // }, []);

  function sendICEcandidate(data) {
    socket.emit('ICEcandidate', data);
  }

  //need to update callee id to use the team name instead, this should ensure connection
  //to the team room created via the desktop client
  async function processCall() {
    const sessionDescription = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(sessionDescription);
    sendCall({
      calleeId: userInfo.team,
      rtcMessage: sessionDescription,
    });
  }

  async function processAccept() {
    peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(remoteRTCMessage.current),
    );
    const sessionDescription = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(sessionDescription);
    answerCall({
      callerId: otherUserId.current,
      rtcMessage: sessionDescription,
    });
  }

  function answerCall(data) {
    socket.emit('answerCall', data);
  }

  function sendCall(data) {
    socket.emit('call', data);
  }
  
  function switchCamera() {
    localStream.getVideoTracks().forEach(track => {
      track._switchCamera();
    });
  }

  function toggleCamera() {
    localWebcamOn ? setlocalWebcamOn(false) : setlocalWebcamOn(true);
    localStream.getVideoTracks().forEach(track => {
      localWebcamOn ? (track.enabled = false) : (track.enabled = true);
    });
  }

  function toggleMic() {
    localMicOn ? setlocalMicOn(false) : setlocalMicOn(true);
    localStream.getAudioTracks().forEach(track => {
      localMicOn ? (track.enabled = false) : (track.enabled = true);
    });
  }

  function leave() {
    peerConnection.current.close();
    setlocalStream(null);
    setType('JOIN');
  }

  const StreamScreen = () => {
  
    const localImage = require('../assets/greyscaleQPSlogo.png'); // for background image
    const otherUserId = useRef(null);
  
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ImageBackground source={localImage} style={styles.image}>
  
  
          <Text style = {styles.msg}>SHARE TEST</Text>
          <Text></Text>
          <Text></Text>
          <TextInputContainer
                  placeholder={'Enter Caller ID'}
                  value={otherUserId.current}
                  setValue={text => {
                    otherUserId.current = text;
                    console.log('TEST', otherUserId.current);
                  }}
                  keyboardType={'number-pad'}
                />
            <Button 
              onPress={() => {
                processCall();
              }}
              containerStyle={styles.button} title= "Begin Share" 
            />
          <Button onPress={() => navigation.navigate("Home")} 
            containerStyle={styles.button} title="Return Home" />
          
        </ImageBackground>
      </KeyboardAvoidingView>
    )
  }

  //style sheet for different things on record history screen
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
    },
    inputContainer: {
      width: 300,
      //flex: null,
    },
    button: {
      //width: 300,
      marginBottom: 20,
    },
    //input: {
      //height: 40,
      //margin: 12,
      //borderWidth: 1,
      //padding: 10,
    //},
    msg: {
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      //height: 100,
    },
  
    image: { // the background image
      //flex: 1,
      justifyContent: 'center',
      resizeMode: 'contain',
      height: 300,
      height: 300,
      width: 250,
    }
  
  });

  switch (type) {
    case 'JOIN':
      return StreamScreen();
    case 'INCOMING_CALL':
      return IncomingCallScreen();
    case 'OUTGOING_CALL':
      return OutgoingCallScreen();
    case 'WEBRTC_ROOM':
      return WebrtcRoomScreen();
    default:
      return null;
  }
}