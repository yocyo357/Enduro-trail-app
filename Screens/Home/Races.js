import React, { Component } from 'react';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right,H1 } from 'native-base';
import {
    View,
    Image,
    Dimensions,
    StyleSheet
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';


const screenWidth = Math.round(Dimensions.get('window').width);
class Races extends Component {
    render() {
        return (
            <View>
                <H1 style={styles.h1}>Ongoing</H1>
            {Object.keys(this.props.races).map(igKey => {   
                if(this.props.races[igKey].raceStatus == 'Ongoing'){
                return (
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('RacesInfo', {raceinfo: this.props.races[igKey],id:igKey})}>
                        <Image source={{ uri: this.props.races[igKey].imageURL }} style={{ height: 300, width: screenWidth, marginBottom: 20 }} />
                    </TouchableOpacity>
                )
                }
            })}
            <H1 style={styles.h1}>Completed</H1>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    h1:{
        alignSelf:'center',
        margin:10,
        color:'grey'
    }
})

export default Races