import React, {Component} from 'react';
import {Platform, StyleSheet, View, Text} from 'react-native';
import { Container, Header, Content, Button, Icon, Title, List, ListItem, Thumbnail, Left, Body, Right} from 'native-base';
import { recordings } from "./Variables.js";

export default class History extends Component {
  render() {

    var listData = [];
    var varList = recordings;

    // For every recording, create a list item
    Object.keys(varList).map(function (keyName) {
      listData.push(
        <ListItem icon>
          <Left>
            <Button style={{ backgroundColor: "tomato" }}>
              <Icon active name="md-arrow-dropright-circle"  />
            </Button>
          </Left>
          <Body>
            <Text>{keyName}</Text>
            <Text note numberOfLines={1}>{varList[keyName].Description}</Text>
          </Body>
          <Right>
            <Button transparent>
              <Text>View</Text>
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
            <Title>History</Title>
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