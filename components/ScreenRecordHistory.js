import RecordScreen, { RecordingResult } from 'react-native-record-screen'; //importing this for screen RECORDING not sharing
import React, { useState, useMemo, useCallback, useContext, useEffect } from 'react';
import {uploadFiles} from 'react-native-fs';
import { BASE_URL } from '../config/config';
import { AuthContext } from '../context/AuthContext';
//import RNFS from 'react-native-fs';
import axios from 'axios';
import { Button, Input, Image } from "react-native-elements";
import * as RNFS from 'react-native-fs';
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
  KeyboardAvoidingView,
  FlatList
} from 'react-native';

// currently trying to print file path to URL and and set the default filepath to documents or photos or whatever

export default function fileReader() {
  const {isLoading, logout, userInfo} = useContext(AuthContext);
  const [f, setF] = useState('');
  //const [vidPath, setvidPath] = useState<string>('');
  //const [recording, setRecording] = useState<boolean>(false);
  //const [url, setUrl] = useState<string>('');
  const videoPath = "/storage/emulated/0/Android/data/com.mobilenew/files/ReactNativeRecordScreen/"
  let regex = new RegExp(/([A-Za-z0-9]+(-[A-Za-z0-9]+)+)\.mp4/i)
  let regex2 = new RegExp(/\/storage\/emulated\/0\/Android\/data\/com\.mobilenew\/files\/ReactNativeRecordScreen\/([A-Za-z0-9]+(-[A-Za-z0-9]+)+)\.mp4/i)

  const [files, setFiles] = useState([])
  const getFileContent = async (path) => {
    const reader = await RNFS.readDir(path);
    setFiles(reader);
  };
  useEffect(() => {
    getFileContent(videoPath); //run the function on the first render.
  }, []);
  //this component will render our list item to the UI
  const Item = ({ name, isFile }) => {
    return (
      <View>
        <Text style={styles.name}>Name: {name}</Text>
        <Text> {isFile ? "It is a file" : "It's a folder"}</Text>
      </View>
    );
  };
  const renderItem = ({ item, index }) => {
    return (
      <View>
        <Text style={styles.title}>{index}</Text>
        {/* The isFile method indicates whether the scanned content is a file or a folder*/}
        <Item name={item.name} isFile={item.isFile()} />
      </View>
    );
  };
  return (
    <SafeAreaView>
      <FlatList
        data={files}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
      />
    </SafeAreaView>
  );
  }

// get a list of files and directories in the main bundle
// RNFS.readDir(RNFS.MainBundlePath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
//   .then((result) => {
//     console.log('GOT RESULT', result);

//     // stat the first file
//     return Promise.all([RNFS.stat(result[0].path), result[0].path]);
//   })
//   .then((statResult) => {
//     if (statResult[0].isFile()) {
//       // if we have a file, read it
//       return RNFS.readFile(statResult[1], 'utf8');
//     }

//     return 'no file';
//   })
//   .then((contents) => {
//     // log the file contents
//   })


//   const upload = (() => {
//     let str = vidPath
//     let pattern = regex
//     let result = str.match(pattern)![0];
//     console.log("2nd",result)
//     console.log("1st", str);

// const data = new FormData();
// data.append('file', {
//   uri: `file://${str}`,
//   name: `${result}`,
//   type: 'video/mp4',
// });
// console.log("3rd",data)
//   axios.post(`${BASE_URL}/api/files/getfiles`, data, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   }).then((response) => {
//     console.log(response);
//   }).catch((error) => {
//     console.log(error);
//   })

//   })
  
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