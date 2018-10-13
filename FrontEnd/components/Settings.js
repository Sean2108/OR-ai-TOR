import React, {Component} from 'react';
import {Platform, StyleSheet, View, Text} from 'react-native';
import { Container, Header, Content, Button, Icon, Title, List, ListItem, Thumbnail, Left, Body, Right, Switch} from 'native-base';
import { settings } from "./Variables.js";

export default class History extends Component {
  render() {

    var listData = [];
    var varList = settings;

    // For every recording, create a list item
    Object.keys(varList).map(function (keyName) {
      listData.push(
        <ListItem icon>
          <Left>
            <Button style={{ backgroundColor: "#FF9501" }}>
              <Icon active name={varList[keyName].icon}  />
            </Button>
          </Left>
          <Body>
            <Text>{keyName}</Text>
          </Body>
          <Right>
            <Button transparent>
              <Switch value={varList[keyName].status} />
            </Button>
          </Right>
        </ListItem>
      );
    })

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('HomePage')}>
              <Icon name='ios-home'/>
            </Button>
          </Left>
          <Body>
            <Title>Settings</Title>
          </Body>
        </Header>
        <Content>
          <List>
            {listData}
          </List>
        </Content>
      </Container>

    );
  }
}