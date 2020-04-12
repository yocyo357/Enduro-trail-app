
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    ToastAndroid
} from 'react-native';


var message = ""
import { Container, Header, Content, Button, Text, Icon, Left, Right, Body, Item, Input, Picker } from 'native-base';
import firebase, { storage } from 'firebase'
import { config } from '../../../Firebase/index'
import Spinner from 'react-native-loading-spinner-overlay'
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
                gender: '',
                age: '',
                password: '',
                confirmPassword: '',
            },
            isLoading: false
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
        this.setState({ isLoading: true })
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
                this.setState({ isLoading: false })
            } else {
                if (values.indexOf('') >= 0) {
                    // alert(values.indexOf(''))
                    if (values[5] == values[6]) {
                        showToast("Please fill up all the fields")
                        this.setState({ isLoading: false })
                    }
                }
                else if (this.state.text.password != this.state.text.confirmPassword) {
                    showToast('Password not the same')
                    this.setState({ isLoading: false })
                }
                else {
                    var datas = firebase.database().ref('/Users')
                    var vals = { ...this.state.text, imageuri: 'https://firebasestorage.googleapis.com/v0/b/endurotrail-d806b.appspot.com/o/images%2Fuserdefault.jpg?alt=media&token=aba1930e-0679-4c02-b4e0-7b2fce2cddd3',datecreated:Date.now() }
                    datas.push(vals).then(() => {
                        this.props.navigation.navigate('Login', { username: this.state.text.username })
                        this.setState({ isLoading: false })
                        showToast('Successfully registered')
                    }).catch(error => {
                        this.setState({ isLoading: false })
                        showToast(error.message)
                    });
                }

            }


        });



    }

    onValueChange2(value) {
        var text = { ...this.state.text }
        text['gender'] = value
        this.setState({ text: text })

    }
    // checkIfUsernameExists(){
    //     var users = 
    // }
    render() {
        const placeholder = ['Username', 'Firstname', 'Lastname', 'Gender', 'Age', 'Password', 'Confirm Password']
        const TextInputs = Object.keys(this.state.text)
            .map((igKey, index) => {
                let secure = (igKey == 'password' || igKey == 'confirmPassword') ? true : false
                let num = (igKey == 'age') ? "numeric" : ''
                if (igKey == 'gender') {
                    return (
                        <Item rounded picker style={styles.item}>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ width: undefined }}
                                placeholder="Select your SIM"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.text.gender}
                                onValueChange={value => {
                                    if (value != 'key0') {
                                        this.onValueChange2(value)
                                    }
                                }}>
                                <Picker.Item label="Gender" color="gray" value="key0" />
                                <Picker.Item label="Male" value="Male" />
                                <Picker.Item label="Female" value="Female" />
                            </Picker>
                        </Item>
                    )
                }
                return (
                    <Item style={styles.item}>
                        <Input style={styles.input} placeholder={placeholder[index]}
                            value={this.state.text.igKey}
                            secureTextEntry={secure}
                            keyboardType={num}
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
                    <Spinner
                        visible={this.state.isLoading}
                        textContent={'Loading...'}
                        textStyle={styles.spinnerTextStyle}
                    />
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
    },spinnerTextStyle:{
        color: '#FFF'
    },
})
