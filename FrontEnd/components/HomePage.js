import React, {Component} from 'react';
import {Platform, StyleSheet, View, Text} from 'react-native';
import { Container, Header, Content, Button, Icon } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

export default class HomePage extends Component {
  render() {
    return (
      <Container style={styles.container}>
        <Content >
          <Grid>
            <Row>
              <Text style={styles.titleText}>OR{'{'}ai{'}'}TOR</Text>
            </Row>
            <Row style={{alignItems: 'center', alignSelf: 'center', marginTop: 180}}>
              <Button transparent onPress={() => this.props.navigation.navigate('AudioRecorder')}>
                <Icon name='md-arrow-dropright-circle' style ={{fontSize: 120, color: 'tomato', height: 120 }}/>
              </Button>
            </Row>
            <Row  style={{alignItems: 'center', alignSelf: 'center', marginTop: 200}}>
              <Button transparent onPress={() => this.props.navigation.navigate('History')}>
                <Icon name='ios-archive' style ={{fontSize: 40, color: 'tomato', }}/>
              </Button>
              <Button transparent onPress={() => this.props.navigation.navigate('AllTimeFeedback')}>
                <Icon name='ios-stats' style ={{fontSize: 40, color: 'tomato', }}/>
              </Button>
              <Button transparent onPress={() => this.props.navigation.navigate('Settings')}>
                <Icon name='cog' style ={{fontSize: 40, color: 'tomato', height:40 }}/>
              </Button>
            </Row>
          </Grid>
        </Content>
     </Container>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  titleText: {
    marginTop: 50 ,
    color: 'tomato',
    fontSize: 60 ,
    fontFamily: 'Cochin',
  },
});
