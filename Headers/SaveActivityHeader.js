import React, { Component } from 'react';
import { Container, Header, Content, Button, Text, Icon, Left, Right, Body, Badge, Item, Input } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';



class SaveActivityHeader extends Component {
    render() {
        return (
            <Header style={{ backgroundColor: 'white' }}>
                <Left>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}>
                        <Icon name='arrow-back' style={{ fontSize: 30, color: 'black' }} />
                    </TouchableOpacity>
                </Left>
                <Body>

                </Body>
                <Right>
                    <TouchableOpacity onPress={()=>this.props.onSave(this.props.trailTitle)}>
                        <Text>Save</Text>
                    </TouchableOpacity>
                </Right>
            </Header>
        )
    }
}


export default SaveActivityHeader