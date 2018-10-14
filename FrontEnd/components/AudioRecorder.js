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
import RNFS from 'react-native-fs';
import TimerMixin from 'react-timer-mixin';

var uri;
var stop;
var count = 0;
var timer;
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
      Feedback:'Let Get Started',
      sec: 0,
      min: 0,
    };

    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.09); // optional. Default is 0.1
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

    timer = setInterval(() => {
      let s = this.state.sec;
      let m = this.state.min;
      if(s == 59){
        this.setState({
          min : ++m,
          sec : 0
        })
      }else{
        this.setState({
          sec: ++s,
        })
      }
    },1000);
    const path = Platform.select({
      ios: '0.m4a',
      android: 'sdcard/0.mp4',
    });
    uri = await this.audioRecorderPlayer.startRecorder(path);
    this.audioRecorderPlayer.addRecordBackListener((e) => {
      this.setState({
        recordSecs: e.current_position,
        recordTime: this.audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
      });
      return;
    });

      stop = setInterval(() => {
          this.audioRecorderPlayer.stopRecorder();
          this.audioRecorderPlayer.removeRecordBackListener();
            console.log('stop');
            ++count;
            const path = Platform.select({
              ios: count + '.m4a',
              android: 'sdcard/'+ count + '.mp4',
            });

            let old_uri = uri;
            this.audioRecorderPlayer.startRecorder(path).then((result) => {uri = result});
            this.audioRecorderPlayer.addRecordBackListener((e) => {
              this.setState({
                recordSecs: e.current_position,
                recordTime: this.audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
              });
              return;
            });
            RNFS.readFile(old_uri,'base64')
            .then((result) => {
                fetch('http://10.27.45.207:8080/live', {
                  method: 'POST',
                  body: result,
                });
                  console.log(result);
                })
                .catch((err) => {
                  console.log(err);
                  console.log(err.message, err.code);
           });
        }, 5000);

        console.log('start');

    console.log(`uri: ${uri}`);
  }

  // restart = () =>

  onStopRecord = async () => {
    clearInterval(stop);
    clearInterval(timer);
    console.log('onStopRecord');
    const res = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
    });
   console.log('bye');
  }

  render(){
    return (
    <View style={styles.container}>
      <Text style={styles.titleTxt}>{this.state.Feedback}</Text>
      <Text style={styles.timer}>{this.state.min} Minute {this.state.sec} Seconds</Text>
        <View style={styles.recordBtnWrapper}>
          <TouchableOpacity onPress={this.onStartRecord}>
          <View style={styles.btn}>
            <Text style={styles.txt}>Record</Text>
          </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onStopRecord}>
          <View style={styles.btn}>
            <Text style={styles.txt}>Stop</Text>
          </View>
          </TouchableOpacity>
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
  fontSize: 32 ,
},
timer:{
  marginTop: 200,
  fontSize: 20,
  color: 'black',
},
viewRecorder: {
  marginTop: 40 ,
  width: '100%',
  alignItems: 'center',
},
recordBtnWrapper: {
  marginTop: 200,
  flexDirection: 'row',
},
btn: {
  borderWidth:1,
  borderColor:'rgba(0,0,0,0.2)',
  alignItems:'center',
  justifyContent:'center',
  width:100,
  height:100,
  backgroundColor:'tomato',
  borderRadius:100,
  marginRight: 20,
  marginLeft: 25
},
txt: {
  color: 'white',
  fontSize: 20,
  marginHorizontal: 8 ,
  marginVertical: 4 ,
},
button:{
  height: 50,
  marginTop: 20,
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
