import React, {Component} from 'react';
import {createStackNavigator,} from 'react-navigation';

import HomePage from './HomePage';
import AudioRecorder from './AudioRecorder';
import History from './History';
import Settings from './Settings';
import Feedback from './Feedback';

const Navigator = createStackNavigator({
  HomePage: { screen: HomePage },
  AudioRecorder: { screen: AudioRecorder },
  History: { screen: History },
  Settings: { screen: Settings },
  Feedback: { screen: Feedback },
});

export default Navigator;