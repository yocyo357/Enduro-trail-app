import React, { Component } from 'react';
import { Container, Header, Content, Button, Text, Icon, Left, Right, Body, Badge, Item, Input } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';



class HomeHeader extends Component {
    render() {
        return (
            <Header style={{ backgroundColor: 'white' }}>
                <Left>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Login')}>
                        <Icon name='arrow-back' style={{ fontSize: 30,color:'black' }} />
                    </TouchableOpacity>
                </Left>
                <Body>

                </Body>
                <Right>
                    <Button transparent>

                        <Icon style={{ fontSize: 30, color: "gray" }} name='ios-notifications' />
                        <Badge style={{ scaleX: 0.7, scaleY: 0.7, position: 'absolute', right: 0 }}><Text>2</Text></Badge>
                    </Button>
                </Right>
            </Header>
        )
    }
}


export default HomeHeader