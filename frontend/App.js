import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  ScrollView,
  Text,
  View,
  FlatList,
  InteractionManager,
  PermissionsAndroid,
} from 'react-native';

import AudioRecorderPlayer from 'react-native-audio-recorder-player';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      recordSecs: 0,
      recordTime: '00:00:00',
      currentPositionSec: 0,
      currentDurationSec: 0,
      playTime: '00:00:00',
      duration: '00:00:00',
    };

    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
  }

  onStatusPress = (e: any) => {
    const touchX = e.nativeEvent.locationX;
    console.log(`touchX: ${touchX}`);
    const playWidth = (this.state.currentPositionSec / this.state.currentDurationSec);
    console.log(`currentPlayWidth: ${playWidth}`);

    const currentPosition = Math.round(this.state.currentPositionSec);
    console.log(`currentPosition: ${currentPosition}`);

    if (playWidth && playWidth < touchX) {
      const addSecs = Math.round((currentPosition + 3000));
      this.audioRecorderPlayer.seekToPlayer(addSecs);
      console.log(`addSecs: ${addSecs}`);
    } else {
      const subSecs = Math.round((currentPosition - 3000));
      this.audioRecorderPlayer.seekToPlayer(subSecs);
      console.log(`subSecs: ${subSecs}`);
    }
  }

  onStartRecord = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permissions for write access',
            message: 'Give permission to your storage to write a file',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
        } else {
          console.log('permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Permissions for write access',
            message: 'Give permission to your storage to write a file',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the camera');
        } else {
          console.log('permission denied');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
    const path = Platform.select({
      ios: 'hello.m4a',
      android: 'sdcard/hello.mp4',
    });
    const uri = await this.audioRecorderPlayer.startRecorder();
    this.audioRecorderPlayer.addRecordBackListener((e) => {
      this.setState({
        recordSecs: e.current_position,
        recordTime: this.audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
      });
      return;
    });
    console.log(`uri: ${uri}`);
  }

  onStopRecord = async () => {
    const result = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
    });
    console.log(result);
  }

  onStartPlay = async () => {
    console.log('onStartPlay');
    const path = Platform.select({
      ios: 'hello.m4a',
      android: 'sdcard/hello.mp4',
    });
    const msg = await this.audioRecorderPlayer.startPlayer();
    this.audioRecorderPlayer.setVolume(1.0);
    console.log(msg);
    this.audioRecorderPlayer.addPlayBackListener((e) => {
      if (e.current_position === e.duration) {
        console.log('finished');
        this.audioRecorderPlayer.stopPlayer();
      }
      this.setState({
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: this.audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
        duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
      return;
    });
  }

  onPausePlay = async () => {
    await this.audioRecorderPlayer.pausePlayer();
  }

  onStopPlay = async () => {
    console.log('onStopPlay');
    this.audioRecorderPlayer.stopPlayer();
    this.audioRecorderPlayer.removePlayBackListener();
  }

  render(){
    const playWidth = (this.state.currentPositionSec / this.state.currentDurationSec);
    return (
    <View style={styles.container}>
      <Text style={styles.titleTxt}>Audio Record Player</Text>
      <Text style={styles.txtRecordCounter}>{this.state.recordTime}</Text>
      <View style={styles.viewRecorder}>
        <View style={styles.recordBtnWrapper}>
          <TouchableOpacity onPress={this.onStartRecord}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Record</Text>
          </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.onStopRecord}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Stop</Text>
          </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.viewPlayer}>
        <TouchableOpacity
          style={styles.viewBarWrapper}
          onPress={this.onStatusPress}
        >
          <View style={styles.viewBar}>
            <View style={[
              styles.viewBarPlay,
              { width: playWidth },
            ]}/>
          </View>
        </TouchableOpacity>
        <Text style={styles.txtCounter}>{this.state.playTime} / {this.state.duration}</Text>
        <View style={styles.playBtnWrapper}>
          <TouchableOpacity onPress={this.onStartPlay}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Play</Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onPausePlay}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Pause</Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onStopPlay}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Stop</Text>
          </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  }
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
},
titleTxt: {
  marginTop: 100 ,
  color: 'black',
  fontSize: 28 ,
},
viewRecorder: {
  marginTop: 40 ,
  width: '100%',
  alignItems: 'center',
},
recordBtnWrapper: {
  flexDirection: 'row',
},
viewPlayer: {
  marginTop: 60 ,
  alignSelf: 'stretch',
  alignItems: 'center',
},
viewBarWrapper: {
  marginTop: 28 ,
  marginHorizontal: 28 ,
  alignSelf: 'stretch',
},
viewBar: {
  backgroundColor: '#ccc',
  height: 4 ,
  alignSelf: 'stretch',
},
viewBarPlay: {
  backgroundColor: 'black',
  height: 4 ,
  width: 0,
},
playStatusTxt: {
  marginTop: 8 ,
  color: '#ccc',
},
playBtnWrapper: {
  flexDirection: 'row',
  marginTop: 40 ,
},
btn: {
  borderColor: 'black',
  borderWidth: 1 ,
},
txt: {
  color: 'black',
  fontSize: 14 ,
  marginHorizontal: 8 ,
  marginVertical: 4 ,
},
txtRecordCounter: {
  marginTop: 32 ,
  color: 'black',
  fontSize: 20 ,
  textAlignVertical: 'center',
  fontWeight: '200',

  letterSpacing: 3,
},
txtCounter: {
  marginTop: 12 ,
  color: 'black',
  fontSize: 20 ,
  textAlignVertical: 'center',
  fontWeight: '200',
  
  letterSpacing: 3,
},
button:{
  height: 50,
  marginTop: 20,
  marginLeft: 10,
  width: 100,
  backgroundColor: 'tomato',
  justifyContent: 'center',
  alignSelf: 'center',
  alignItems: 'center',
},
buttonText:{
  color: 'white',
  fontSize: 20
}
});
