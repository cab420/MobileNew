import RecordScreen, { RecordingResult } from 'react-native-record-screen'; //importing this for screen RECORDING not sharing
import React, { useState, useMemo, useCallback } from 'react';
import Video from 'react-native-video';
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

export default function ScreenRecord() {
  
  const [uri, setUri] = useState<string>('');
  const [recording, setRecording] = useState<boolean>(false);

  const _handleOnRecording = async () => {
    if (recording) {
      setRecording(false);
      const res = await RecordScreen.stopRecording().catch((error: any) =>
        console.warn(error)
      );
      console.log('res', res);
      if (res?.status === 'success') {
        setUri(res.result.outputURL);
        //console.log(uri);
      }
    } else {
      setUri('');
      setRecording(true);
      const res = await RecordScreen.startRecording({ mic: false, fps: 30, bitrate: 1024000 }).catch((error: any) => {
        console.warn(error);
        setRecording(false);
        setUri('');
      });

      if (res === RecordingResult.PermissionError) {
        Alert.alert(res);
        setRecording(false);
        setUri('');
      }
    }
  }

  // const _handleOnCleanSandbox = useCallback(() => {
  //   RecordScreen.clean();
  //   setUri('');
  // }, []);

  // const btnStyle = useMemo(() => {
  //   return recording ? styles.btnActive : styles.btnDefault;
  // }, [recording]);

  
}

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