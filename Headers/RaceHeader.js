import React, { Component } from 'react';
import { Container, Header, Content, Button, Text, Icon, Left, Right, Body, Badge, Item, Input,Title } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';



class RaceHeader extends Component {
    render() {
        return (
            <Header style={{ backgroundColor: '#343A40'}}>
                <Left style={{flex:1}}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}>
                        <Icon name='arrow-back' style={{ fontSize: 30,color:'white' }} />
                    </TouchableOpacity>
                </Left>
                <Body>
                <Body style={{ flex: 1, alignItems: 'center',justifyContent:'center' }}>
                    {/* <Title style={{color:'white'}}>{this.props.title.toUpperCase()}</Title> */}
                </Body>
                </Body>
                <Right>
                    <Button transparent>

                        
                    </Button>
                </Right>
            </Header>
        )
    }
}


export default RaceHeader