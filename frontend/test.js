import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const audioRecorderPlayer = new AudioRecorderPlayer();

export default class Test extends React.Component {

  constructor(){
    super();
    this.state = {
      recordSecs: '',
      recordTime: '',
      currentDurationSec:'',
      currentPositionSec:'',
      playTime:'',
      duration:''
    }
  }

  onStartRecord = async () => {
    const result = await this.audioRecorderPlayer.startRecorder('try.m4a');
    this.audioRecorderPlayer.addRecordBackListener((e) => {
      this.setState({
        recordSecs: e.current_position,
        recordTime: this.audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
      });
      return;
    });
    console.log(result);
  }

  onStopRecord = async () => {
    const result = await this.audioRecorderPlayer.stopRecorder('try.m4a');
    this.audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
    });
    console.log(result);
  }

  onStartPlay = async () => {
    console.log('onStartPlay');
    const msg = await this.audioRecorderPlayer.startPlayer('try.m4a');
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
    await this.audioRecorderPlayer.pausePlayer('try.m4a');
  }

  onStopPlay = async () => {
    console.log('onStopPlay');
    this.audioRecorderPlayer.stopPlayer('try.m4a');
    this.audioRecorderPlayer.removePlayBackListener();
  }

  render() {
    return (
      <View style={styles.container}>
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

        <TouchableOpacity onPress={this.onStartPlay}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Play</Text>
        </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.onStopPlay}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Stop</Text>
        </View>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button:{
    height: 50,
    marginTop: 20,
    width: 50,
    backgroundColor: 'tomato',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  buttonText:{
    color: 'white',
    fontSize: 20
  }
});
