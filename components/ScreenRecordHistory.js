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

export default function FileReader() {
  const {isLoading, logout, userInfo} = useContext(AuthContext);
  const [f, setF] = useState('');
  const [response, setResponse] = useState({});
  const [responseMessage, setResponseMessage] = useState('')
 
  const videoPath = "/storage/emulated/0/Android/data/com.mobilenew/files/ReactNativeRecordScreen/"
  
  const [files, setFiles] = useState([])
  //const [fileList, setFileList] = useState([])
  var fileList = [];
  const data = new FormData();
  const getFileContent = async (path) => {
    const reader = await RNFS.readDir(path);
    setFiles(reader);
  };
  useEffect(() => {
    getFileContent(videoPath); //run the function on the first render.
  }, []);
  //this component will render our list item to the UI
  const Item = ({ name, isFile }) => {
    //setFileList(previous => [...previous, name])
    fileList.push(name)
    upload(name);
    //console.log(fileList)
    return (
      <View>
        <Text style={styles.name}>Name: {name}</Text>
        <Text> {isFile ? "It is a file" : "It's a folder"}</Text>
      </View>
    );
  };
  const renderItem = ({ item, index }) => {
    console.log(fileList)
    return (
      <View>
        <Text style={styles.title}>{index}</Text>
        {/* The isFile method indicates whether the scanned content is a file or a folder*/}
        <Item name={item.name} isFile={item.isFile()} />
      </View>
    );
  };
  //console.log(fileList)

  const upload = ((name) => {
       let str = name
      //console.log(name + 'cocks')
      data.append('files', {
        uri: `file://${videoPath}${str}`,
        name: `${str}`,
        type: 'video/mp4',
      });
    
    console.log(data)

})

const handleUpload = async () => {
  await axios.post(`${BASE_URL}/api/files/getfiles`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  .then(resjson => setResponse(resjson))
  .catch(err => {
    console.log(err)
  })
  
  if (response.status == 200) {
    
    setResponseMessage('Successfully uploaded files')
  }
}

//upload();
  return (
    <SafeAreaView>
      <FlatList
        data={files}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
      />
      <Button 
            onPress={
              handleUpload
            }
            containerStyle={styles.uploadbtn} title= "Upload"
          />
          <Text>{responseMessage}</Text>
    </SafeAreaView>
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