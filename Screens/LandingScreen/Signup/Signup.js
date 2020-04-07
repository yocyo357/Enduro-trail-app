
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    ToastAndroid
} from 'react-native';


var message = ""
import { Container, Header, Content, Button, Text, Icon, Left, Right, Body, Item, Input } from 'native-base';
import firebase, { storage } from 'firebase'
import { config } from '../../../Firebase/index'

if (!firebase.apps.length) {
    firebase.initializeApp(config())
}
const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };
class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: {
                username: '',
                firstname: '',
                lastname: '',
                age: '',
                team: '',
                password: '',
                confirmPassword: '',

            },

        };
    }


    textChangedHandler = (igKey, value) => {
        var text = { ...this.state.text }
        text[igKey] = value
        this.setState({ text: text })
    }
    test() {
        alert(this.state.text.username + " " + this.state.text.firstname + " " + this.state.text.lastname)
    }
    componentDidMount() {

    }
    onSubmitHandler = () => {
        var values = []
        var users = []

        Object.keys(this.state.text)
            .map(igKey => values.push(this.state.text[igKey]))

        var users = []
        firebase.database().ref('Users/').once('value', function (snapshot) {
            users = snapshot.val()

        }).then(() => {

            var userExist = false
            if (users != null) {
                Object.keys(users)
                    .map(igKey => {
                        if (this.state.text.username == users[igKey]['username']) {
                            userExist = true
                            return
                        }
                    })
            }
            if (userExist) {
                showToast('Username already exists')
            } else {
                if (values.indexOf('') >= 0) {
                    if (values[5] == values[6]) {
                        showToast("Please fill up all the fields")
                    }
                }
                else if (this.state.text.password != this.state.text.confirmPassword) {
                    showToast('Password not the same')
                }
                else {
                    var datas = firebase.database().ref('/Users')
                    var vals = { ...this.state.text, imageuri: 'https://firebasestorage.googleapis.com/v0/b/endurotrail-d806b.appspot.com/o/images%2Fuserdefault.jpg?alt=media&token=aba1930e-0679-4c02-b4e0-7b2fce2cddd3' }
                    datas.push(vals);
                }

            }


        });



    }


    // checkIfUsernameExists(){
    //     var users = 
    // }
    render() {
        const placeholder = ['Username', 'Firstname', 'Lastname', 'Age', 'Team', 'Password', 'Confirm Password']
        const TextInputs = Object.keys(this.state.text)
            .map((igKey, index) => {
                let secure = (igKey == 'password' || igKey == 'confirmPassword')? true : false
                return (
                    <Item style={styles.item}>
                        <Input style={styles.input} placeholder={placeholder[index]}
                            value={this.state.text.igKey}
                            secureTextEntry={secure}
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
                            onPress={() => this.onSubmitHandler()}
                            style={styles.button} block>
                            <Text>Login</Text>
                        </Button>
                    </View>

                </Content>
            </Container>
        )
    }
}

export default SignUp

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
