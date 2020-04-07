import React, { Component } from 'react';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import {
    View,
    Image,
    Dimensions
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';


const screenWidth = Math.round(Dimensions.get('window').width);
class Races extends Component {
    render() {
        return (
            Object.keys(this.props.races).map(igKey => {
                return (
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('RacesInfo', {raceinfo: this.props.races[igKey],id:igKey})}>
                        <Image source={{ uri: this.props.races[igKey].imageURL }} style={{ height: 300, width: screenWidth, marginBottom: 20 }} />
                    </TouchableOpacity>
                )
            })
        )
    }
}


export default Races