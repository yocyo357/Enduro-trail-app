import React, { Component } from 'react';
import { Container, Header, Content, Button, Text, Icon, Left, Right, Body, Badge, Item, Input, Title } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';


// if (!firebase.apps.length) {
//     firebase.initializeApp(config())
// }
class HomeHeader extends Component {
    render() {
        return (
            <Header style={{ backgroundColor: '#343A40', borderBottomWidth: 0 }} hasTabs>
                <Left style={{ flex: 1 }}>
                    {/* <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Login')}>
                        <Icon name='arrow-back' style={{ fontSize: 30,color:'white' }} />
                    </TouchableOpacity> */}
                </Left>
                <Body>
                    <Body style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Title style={{ color: 'white' }}>{this.props.title}</Title>
                    </Body>
                </Body>
                <Right>

                    <Button transparent onPress={() => this.props.navigation.navigate('Notifications')}>

                        <Icon style={{ fontSize: 30, color: "white" }} name='ios-notifications' />
                        {this.props.notif != 0 &&
                            <Badge style={{ scaleX: 0.7, scaleY: 0.7, position: 'absolute', right: 0 }}><Text>{this.props.notif}</Text></Badge>
                        }
                    </Button>

                </Right>
            </Header>
        )
    }
}


export default HomeHeader