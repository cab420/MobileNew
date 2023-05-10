import RecordScreen, { RecordingResult } from 'react-native-record-screen'; //importing this for screen RECORDING not sharing
import React, { useState, useMemo, useCallback } from 'react';
import Video from 'react-native-video';
//import RNFS from 'react-native-fs';

import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TouchableHighlight,
  Button,
  Alert
} from 'react-native';

// currently trying to print file path to URL and and set the default filepath to documents or photos or whatever

export default function ScreenRecord() {
  
  const [uri, setUri] = useState<string>('');
  const [recording, setRecording] = useState<boolean>(false);
  const [url, setUrl] = useState<string>('');

  const _handlestop = async () => {
    if (recording) {
      setRecording(false);
      const res = await RecordScreen.stopRecording().catch((error: any) =>
        console.warn(error)
      );
      if (res?.status === 'success') {
        console.log("res", res);
        setUri(res.result.outputURL);
        console.log("res result output", res.result.outputURL);
        //console.log(RecordingResult);
        
      }}
    }

    const _handlestart = async () => {
      setRecording(true);
      const res = await RecordScreen.startRecording({ mic: false, fps: 30, bitrate: 236390400 }).catch((error: any) => {
        console.warn(error);
        setRecording(false);
      });

      if (res === RecordingResult.PermissionError) {
        Alert.alert(res);
        setRecording(false);
        setUri('');
      }
    }
    
    const btnStyle = useMemo(() => {
      return recording ? styles.btnActive : styles.btnDefault;
    }, [recording]);

  // const rnfsoutput = (() => {
  //   RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
  //   .then((result2: any) => {
  //     console.log('GOT RESULT', result2);
  
  //     // stat the first file
  //     return Promise.all([RNFS.stat(result2[0].path), result2[0].path]);
  //   })
  //   .then((statResult: any) => {
  //     if (statResult[0].isFile()) {
  //       // if we have a file, read it
  //       return RNFS.readFile(statResult[1], 'utf8');
  //     }
  
  //     return 'no file';
  //   })
  //   .then((contents: any) => {
  //     // log the file contents
  //     console.log(contents);
  //   })
  //   .catch((err: any) => {
  //     console.log(err.message, err.code);
  //   });
  // })

  // const _handleOnCleanSandbox = useCallback(() => {
  //   RecordScreen.clean();
  //   setUri('');
  // }, []);

  // const btnStyle = useMemo(() => {
  //   return recording ? styles.btnActive : styles.btnDefault;
  // }, [recording]);

  return (
    <>
      <StatusBar barStyle="light-content" />
      <View style={styles.navbar}>
        <View />
        {recording ? (
          <View style={styles.recordingMark}>
            <Text style={styles.recordingMarkText}>Recording</Text>
          </View>
        ) : (
          <View>
            
          </View>
        )}
      </View>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.scrollView}>
            <Text style={styles.heading}>Lorem ipsum dolor sit amet</Text>
            
          </View>
        </ScrollView>
      </SafeAreaView>

      <View style={styles.btnContainer}>
        <TouchableHighlight onPress={
          () => {
            _handlestart() 
            //rnfsoutput()
          }
         
          
          }>
          <View style={styles.btnWrapper}>
            <View style={btnStyle} />
          </View>
        </TouchableHighlight>
      </View>

      <View style={styles.btnContainer}>
        <TouchableHighlight onPress={
          () => {
            _handlestop() 
            //rnfsoutput()
          }
         
          
          }>
          <View style={styles.btnWrapper}>
            <View style={btnStyle} />
          </View>
        </TouchableHighlight>
      </View>

      {uri ? (
        <View style={styles.preview}>
          <Video
            source={{
              uri,
            }}
            style={styles.video}
          />
        </View>
      ) : null}
    </>
  )};


const styles = StyleSheet.create({
  navbar: {
    height: 80,
    backgroundColor: '#212121',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  recordingMark: {
    backgroundColor: 'red',
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderRadius: 24,
  },
  recordingMarkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 24,
  },
  heading: {
    fontSize: 24,
    lineHeight: 32,
    paddingBottom: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    paddingBottom: 36,
  },
  btnContainer: {
    height: 100,
    paddingTop: 12,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#212121',
  },
  btnWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  btnDefault: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 4,
    borderStyle: 'solid',
    borderColor: '#212121',
  },
  btnActive: {
    width: 36,
    height: 36,
    backgroundColor: 'red',
    borderRadius: 8,
  },
  preview: {
    position: 'absolute',
    right: 0,
    bottom: 116,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 3 * 2,
    zIndex: 1,
    padding: 8,
    backgroundColor: '#aaa',
  },
  video: {
    flex: 1,
  },
});