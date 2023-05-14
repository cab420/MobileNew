import RecordScreen, { RecordingResult } from 'react-native-record-screen'; //importing this for screen RECORDING not sharing
import React, { useState, useMemo, useCallback, useContext } from 'react';
import {uploadFiles} from 'react-native-fs';
import { BASE_URL } from '../config/config';
import { AuthContext } from '../context/AuthContext';
//import RNFS from 'react-native-fs';
import axios from 'axios';
import { Button, Input, Image } from "react-native-elements";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TouchableHighlight,
  Alert,
  KeyboardAvoidingView
} from 'react-native';

// currently trying to print file path to URL and and set the default filepath to documents or photos or whatever

export default function ScreenRecord() {
  const {isLoading, logout, userInfo} = useContext(AuthContext);
  const [f, setF] = useState('');
  const [vidPath, setvidPath] = useState<string>('');
  const [recording, setRecording] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');
  const videoPath = "/storage/emulated/0/Android/data/com.mobilenew/files/ReactNativeRecordScreen/"
  let regex = new RegExp(/([A-Za-z0-9]+(-[A-Za-z0-9]+)+)\.mp4/i)
  let regex2 = new RegExp(/\/storage\/emulated\/0\/Android\/data\/com\.mobilenew\/files\/ReactNativeRecordScreen\/([A-Za-z0-9]+(-[A-Za-z0-9]+)+)\.mp4/i)

  const _handleOnRecording = async () => {
    if (recording) {
      setRecording(false);
      const res = await RecordScreen.stopRecording().catch((error: any) =>
        console.warn(error)
      );
      console.log('res', res);
      if (res?.status === 'success') {
        setvidPath(res.result.outputURL);
      }
    } else {
      setvidPath('');
      setRecording(true);
      const res = await RecordScreen.startRecording({ mic: false, fps: 30, bitrate: 1024000 }).catch((error: any) => {
        console.warn(error);
        setRecording(false);
        setvidPath('');
      });

      if (res === RecordingResult.PermissionError) {
        Alert.alert(res);
        setRecording(false);
        setvidPath('');
      }
    }
  };

  

  const upload = (() => {
    let str = vidPath
    let pattern = regex
    let result = str.match(pattern)![0];
    console.log("2nd",result)
    console.log("1st", str);

const data = new FormData();
data.append('file', {
  uri: `file://${str}`,
  name: `${result}`,
  type: 'video/mp4',
});
console.log("3rd",data)
// axios({
//   method: 'post',
//   url: `${BASE_URL}/api/files/getfiles`,
//   data: data,
//   headers: {'Content-Type': 'multipart/form-data' }
//   })
//   .then(function (response) {
//       //handle success
//       console.log(response);
//   })
//   .catch((error) => {
//       //handle error
//       console.log(error);
//   })

  axios.post(`${BASE_URL}/api/files/getfiles`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then((response) => {
    console.log(response);
  }).catch((error) => {
    console.log(error);
  })

  })
  
// axios
//   .post(`${BASE_URL}/api/files/getfiles`, data, {
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   })
//   .then(response => {})
//   .catch(err => {});
    // var files = [
    //   {
    //     name: `${userInfo.name}`,
    //     filename: `${result}`,
    //     filepath: vidPath,
    //     filetype: ""
    //   },
    // ];
    //.post(`${BASE_URL}/api/auth/login`,
    //const formData = new FormData();
    //formData.append('files', )
    // uploadFiles({
    //   toUrl: `${BASE_URL}/api/files/getfiles`,
    //   files: files,
    //   method: "POST",
    //   headers: {
    //     Accept: "application/json",
    //     'Content-Type': 'multipart/form-data'
    //   },
    //   //invoked when the uploading starts.
    //   begin: () => {},
    //   // You can use this callback to show a progress indicator.
    //   progress: ({ totalBytesSent, totalBytesExpectedToSend }) => {},
    // });

// axios
//   .post(`API_URL`, formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data'
//     }
//   })
//   .then(response => {})
//   .catch(err => {});
  

  const btnStyle = useMemo(() => {
    return recording ? styles.button4active : styles.button4;
  }, [recording]);

  const textStyle = useMemo(() => {
    return recording ? styles.button4active : styles.button4;
  }, [recording]);

  return (
    <>
<KeyboardAvoidingView behavior="padding" style={styles.container}>
      <View style={styles.iconRow}>
        <View style={styles.rectStack}>
          <View style={styles.rect}></View>
          <View style={styles.rect6}>
            <TouchableHighlight style={styles.button2}>
              <View style={styles.button3}>
              <View style={btnStyle} />
                </View>
              </TouchableHighlight >
            <Text style={styles.screenRecording}>Screen Recording</Text>
            <View style={styles.rect7}>
            <TouchableHighlight onPress={_handleOnRecording}>
            {recording ? (
              <Text style={styles.startRecording}>Stop Recording</Text>
              ) : <Text style={styles.startRecording}>Start Recording</Text>}
              </TouchableHighlight>
            </View>
            {vidPath ? (
            <Button 
            onPress={
              upload
            }
            containerStyle={styles.uploadbtn} title= "Upload"
          />
        
        ) : null}
          </View>
        </View>
      </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  text: {
    fontSize: 20,
    lineHeight: 24,
    marginTop: 15,
    color: 'white'
  },
  text2: {
    fontSize: 20,
    lineHeight: 24,
    marginTop: 15,
    color: 'white'
  },
  texttest: {
    fontSize: 20,
    lineHeight: 24,
    marginTop: 15,
    color: 'black'
  },
  icon: {
    color: "rgba(128,128,128,1)",
    fontSize: 40,
    marginTop: 73
  },
  rect: {
    top: 0,
    left: 300,
    width: 375,
    height: 741,
    backgroundColor: "rgba(255,255,255,1)"
  },
  rect6: {
    width: 331,
    height: 142,
    position: "absolute",
    backgroundColor: "rgba(88,88,89,1)",
    borderRadius: 20,
    left: 56,
    top: 280
  },
  button2: {
    width: 49,
    height: 46,
    backgroundColor: "#E6E6E6",
    borderRadius: 100,
    marginTop: 6,
    marginLeft: 137
  },
  button3: {
    width: 46,
    height: 42,
    backgroundColor: "rgba(88,88,89,1)",
    borderRadius: 100,
    marginTop: 2,
    marginLeft: 1
  },
  button4: {
    width: 24,
    height: 24,
    backgroundColor: "#E6E6E6",
    borderRadius: 100,
    marginTop: 9,
    marginLeft: 11
  },
  button4active: {
    width: 24,
    height: 24,
    backgroundColor: "red",
    borderRadius: 100,
    marginTop: 9,
    marginLeft: 11
  },
  screenRecording: {
    fontFamily: "roboto-regular",
    color: "rgba(235,230,230,1)",
    fontSize: 18,
    marginTop: 7,
    marginLeft: 96
  },
  rect7: {
    width: 331,
    height: 54,
    backgroundColor: "rgba(54,54,54,1)",
    borderBottomRightRadius: 17,
    borderBottomLeftRadius: 17,
    marginTop: 6
  },
  startRecording: {
    fontFamily: "roboto-700",
    color: "rgba(255,255,255,1)",
    fontSize: 18,
    marginTop: 16,
    marginLeft: 104,
  },
  rectStack: {
    width: 475,
    height: 741,
    marginLeft: 507
  },
  iconRow: {
    height: 741,
    flexDirection: "row",
    flex: 1,
    marginRight: -122,
    marginLeft: -525,
    marginTop: 8
  },
  uploadbtn: {
    width: 150,
    height: 50,
    //alignItems: 'center',
    //justifyContent: 'center',
    left: 90,
    marginTop: 100
  }
});