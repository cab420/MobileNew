import RecordScreen, { RecordingResult } from 'react-native-record-screen'; //importing this for screen RECORDING not sharing
import React, { useState, useMemo, useCallback, useContext, useEffect } from 'react';
import {uploadFiles} from 'react-native-fs';
import { API_URL } from '../config/config';
import { AuthContext } from '../context/AuthContext';
//import RNFS from 'react-native-fs';
import axios from 'axios';
import { Button, Input, Image } from "react-native-elements";
import * as RNFS from 'react-native-fs';
import { CreateDate } from './createDate';
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
  const [videoInfo, setVideoInfo] = useState([])
  const [videoList] = useState([])
  const [videoLength, setVideoLength] = useState();
 
  const videoPath = "/storage/emulated/0/Android/data/com.mobilenew/files/ReactNativeRecordScreen/"
  
  const [files, setFiles] = useState([])
  const [show, setShow] = useState(false)
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
        <Text style={styles.name}>VIDEO:   {name}</Text>
        
      </View>
    );
  };
  const renderItem = ({ item, index }) => {
    //console.log(fileList)
    setShow(true);
    return (
      <View>
        <Text style={styles.text}></Text>
        {/* The isFile method indicates whether the scanned content is a file or a folder*/}
        <Item name={item.name} isFile={item.isFile()} />
      </View>
    );
  };
  

  const upload = ((name) => {
       let str = name
      data.append('files', {
        uri: `file://${videoPath}${str}`,
        name: `${str}`,
        type: 'video/mp4',
      });
      videoList.push(str)
      
  })

  //create list of info of all uploaded videos to be stored in db
  const createVideoInfo = ((videoList) => {
       function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}
    
    //create filtered list to remove duplicates
    const uniqueList = videoList.filter(onlyUnique)
    //clear list before each run to avoid duplicates
    setVideoInfo([])
    //itterate over list and add relavent info to videoInfo object
    uniqueList.forEach(element => {
      videoInfo.push({
        name: userInfo.name,
        team: userInfo.team,
        filename: element,
        date: CreateDate()
      })
    });
    
    
  })

const handleUpload = async () => {
  //post video files in form
  await axios.post(`${API_URL}/api/files/getfiles`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  .then(resjson => setResponse(resjson))
  .catch(err => {
    console.log(err)
  })
  createVideoInfo(videoList);
  
  //post video information to be stored in database
  await axios.post(`${API_URL}/api/files/uploadfile`, videoInfo)
  /*
  .then(res => {

    const auditLog = {
      user: userInfo.name,
      team: userInfo.team,
      datetime: CreateDate(),
      detail: `Recorded files were uploaded to the server from a mobile device.`
    }
    console.log(videoInfo)
    if (!videoInfo === []) {
      axios.post(`${BASE_URL}/api/audit/addlog`, auditLog)
    }
    
  })
  */
  
  .catch(err => {
    console.log(err)
  })
  if (response.status == 200) {
  
    setResponseMessage('Successfully uploaded files')
  }
}

const deleteAllFiles = async () => {
  await RNFS.unlink(videoPath);
  RNFS.mkdir(videoPath);
} //not using at the moment, using the logic in the below confirm box

const deleteConfirm = () => {
  return Alert.alert(
    "Are your sure?",
    "Are you sure you want to delete all files?",
    [
      // The "Yes" button
      {
        text: "Yes",
        onPress: async () => {
          deleteAllFiles();
        },
      },
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: "No",
      },
    ]
  );
};

const uploadConfirm = () => {
  return Alert.alert(
    "Are your sure?",
    "Are you sure you want to upload all files?",
    [
      // The "Yes" button
      {
        text: "Yes",
        onPress: () => {
          handleUpload();
        },
      },
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: "No",
      },
    ]
  );
};


//upload();
  return (
    <SafeAreaView>
      <FlatList
        data={files}
        renderItem={renderItem}
        keyEx
        tractor={(item) => item.name}
      />
      {show ? (
        <View>
              <Button 
              onPress={
                uploadConfirm
              }
              containerStyle={styles.uploadbtn} title= "Upload Files"
            />
             <Button 
              onPress={
                deleteConfirm
              }
              containerStyle={styles.uploadbtn} title= "Delete All Files"
            /></View>
              ) : <Text style={styles.text}>NO FILES FOUND</Text>}
          <Text>{responseMessage}</Text>
    </SafeAreaView>
  );
  }
  
const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    color: 'black'
  },
  text: {
    fontSize: 20,
    marginTop: 20,
    color: 'black'
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
    marginTop: 30,
    left: 130,
    //alignItems: 'center',
    //justifyContent: 'center',

  }
});