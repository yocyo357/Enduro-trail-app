
import React, { Component } from 'react';
import {
    View,
    StatusBar,
    AsyncStorage,
    StyleSheet,
    Image
} from 'react-native';
import HomeHeader from '../../Headers/HomeHeader'
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';

import firebase, { storage } from 'firebase'
import { config } from '../../Firebase/index'
import CardPosts from './CardPosts';

if (!firebase.apps.length) {
    firebase.initializeApp(config())
}

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            url: '',
            races: [
                { id: 1, race_title: "", race_type: "", race_category_open: "", race_address: "", race_no_of_stage: "", race_info: "", race_no_of_rider_limit: "" }
            ]
        };
    }
    read() {

    }


    readUserData() {
        firebase.database().ref('Trails/').once('value', function (snapshot) {
            console.log(snapshot.val())
        });

    }
    async componentDidMount() {
        
        var userID = await AsyncStorage.getItem('userID')
        if (userID != null) {
            console.log(userID)
        }


        // const storage = firebase.storage()
        // const ref = storage.ref('images/image_name');
        // const url = await ref.getDownloadURL();
        // console.log(url)



        //this.readUserData()
    }


    render() {
        return (
            <CardPosts />
        )
    }
}



export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    box: {
        width: 50,
        height: 50,
        backgroundColor: 'blue',
        shadowColor: "#000",



        elevation: 24,
    }
})