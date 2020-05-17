import React, { Component } from 'react';
import { Container, Header, Content, Button, Text, Icon, Left, Right, Body, Badge, Item, Input, Title } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';



class TrailHeader extends Component {
    // showRating(){
    //     this.setState({this.props.isRatingVisible: true})
    // }

    render() {
        return (
            <Header style={{ backgroundColor: '#343A40' }}>
                <Left style={{ flex: 1 }}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}>
                        <Icon name='arrow-back' style={{ fontSize: 30, color: 'white' }} />
                    </TouchableOpacity>
                </Left>
                <Body>
                    <Body style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Title style={{ color: 'white' }}>{this.props.title.toUpperCase()}</Title>
                    </Body>
                </Body>
                <Right>
                    <Button transparent onPress={() => this.props.showRating()} style={{ flexDirection: 'row'}}>
                        <Text style={{fontSize:20,marginTop:5}}>{this.props.totalRating}</Text>
                        <Icon name="star" style={{ fontSize: 30, color: 'yellow' }} />
                    </Button>
                </Right>
            </Header>
        )
    }
}


export default TrailHeader