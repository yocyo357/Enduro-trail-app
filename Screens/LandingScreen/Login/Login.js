
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    AsyncStorage
} from 'react-native';

import firebase, { storage } from 'firebase'
import { config } from '../../../Firebase/index'

if (!firebase.apps.length) {
    firebase.initializeApp(config())
}

import { Container, Header, Content, Button, Text, Icon, Left, Right, Body, Item, Input } from 'native-base';
import { TextInput } from 'react-native-gesture-handler';
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: {
                username: 'r',
                password: 'rg'
            }
        };
    }
    
    textChangedHandler = (igKey, value) => {
        var text = { ...this.state.text }
        text[igKey] = value
        this.setState({ text: text })
    }

    checkUser(){
       
        
    }
    
    onSubmitHander=()=>{
        var ids=[]
        var users=[]
        var bool = false
        var userID=''
        firebase.database().ref('Users/').once('value', function (snapshot) {
            users = snapshot.val()
            console.log(users)
            
        }).then(() => {
            Object.keys(users)
            .map((igKey)=>{
                if (this.state.text.username == users[igKey]['username'] && this.state.text.password == users[igKey]['password']) {
                    userID=igKey
                    bool = true
                }
            })
            if (bool == true){
                globalUserID = userID
                AsyncStorage.setItem('userID', userID)
                this.props.navigation.navigate('Tabs')
            }
            else{
                alert("Wrong Username Password")
            }
        })
  
    }

    render() {
        const placeholder = ['Username', 'Password']
        const TextInputs = Object.keys(this.state.text)
            .map((igKey, index) => {
                return (
                    <Item style={styles.item}>
                        <Input style={styles.input} placeholder={placeholder[index]}
                            value={this.state.text.igKey}
                            onChangeText={value => this.textChangedHandler(igKey, value)} />
                    </Item>)
            })
        return (
            <Container style={{ backgroundColor: "#262626" }}>
                <Content>
                    <Button transparent style={{ position: 'absolute', left: 0, right: 0 }}
                        onPress={() => this.props.navigation.goBack()}>
                        <Icon name='arrow-back' style={{ fontSize: 35, color: 'white' }} />
                    </Button>

                    <View style={{ alignItems: 'center', marginTop: 60, marginRight: 30, marginLeft: 30 }}>
                        {TextInputs}

                        <Button
                            success
                            onPress={() => this.onSubmitHander()}
                            style={styles.button} block>
                            <Text>Login</Text>
                        </Button>
                    </View>

                </Content>
            </Container>
        )
    }
}

export default Login

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#262626'
    },
    item: {
        margin: 5,
        backgroundColor: '#ADB8CA',
        borderRadius: 10,
        borderColor: 'transparent'
    }, input: {
        marginLeft: 5
    }, button: {
        borderRadius: 10,
        marginTop: 30
    }
})
