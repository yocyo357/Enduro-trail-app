
import React, { Component } from 'react';
import {
    View,
    StatusBar
  } from 'react-native';
  import HomeHeader from '../../Headers/HomeHeader'
  import { Container, Header, Content, Button, Text, Icon, Left, Right, Body, Item, Input } from 'native-base';
  import firebase, { storage } from 'firebase'
  import { config } from '../../Firebase/index'
  
  if (!firebase.apps.length) {
      firebase.initializeApp(config())
  }

class Home extends Component{    
    constructor(props) {
        super(props);
        this.state = {
            races:[
                {id:1, race_title: "", race_type: "", race_category_open:"",race_address:"",race_no_of_stage:"",race_info:"",race_no_of_rider_limit:""}
            ]
        };
    }
    read(){
        
    }


    readUserData() {
        firebase.database().ref('post_races/').on('value', function (snapshot) {
            console.log(snapshot.val())
        });
    }
    componentDidMount(){

        //this.readUserData()
    }
    render(){
        return(
            <Container>
                <HomeHeader navigation={this.props.navigation}/>
 
                <Content>
                    <Button onPress={()=> this.props.navigation.navigate('Notifications')}><Text>Samp</Text></Button>
                </Content>
            </Container>
        )
    }
}

export default Home