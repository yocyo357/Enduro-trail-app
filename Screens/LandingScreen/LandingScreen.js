
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    PermissionsAndroid,
    Platform,
    AsyncStorage,
    BackHandler,
} from 'react-native';
import firebase from 'firebase'
import { Container, Header, Content, Button, Text,Spinner } from 'native-base';
// import Spinner from 'react-native-loading-spinner-overlay';

if (!firebase.apps.length) {
    firebase.initializeApp(config())
}

class LandingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };
    }

    async componentDidMount() {

       

        var userID = await AsyncStorage.getItem('userID')
        if (userID != null) {
            console.log(userID)
            globalUserID = userID
            firebase.database().ref('Users/' + userID).once('value', async snapshot => {

                globalUserData = { ...snapshot.val() }
                globalReloadData = "false"
                this.setState({isLoading:false})
                // this.props.navigation.navigate('Tabs')
            }).catch(error => {
                alert(error)
            })
        }

        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE

            ])
        } catch (err) {
            console.warn(err)
        }

    }
    
    render() {
        // if (this.state.isLoading) {
        //     return(
        //         <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        //     <Spinner/>
        //     </View>
        //     )
        // }
        return (
            <Container style={{ backgroundColor: "#262626", alignItems: 'center' }}>
                <Content>
                    <Button style={{ marginTop: 100 }} large rounded block
                        onPress={() => this.props.navigation.navigate('Signup')}>
                        <Text>Signup</Text>
                    </Button>
                    <Text style={styles.Text}>-----Already a member?-----</Text>
                    <Button style={{ width: "100%" }} rounded large block success
                        onPress={() => this.props.navigation.navigate('Login',{username:''})}>
                        <Text>Login</Text>
                    </Button>

                </Content>
            </Container>

        )
    }
}

export default LandingScreen

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: '#262626'
    },
    btnContainer: {
        marginTop: 100,
        alignItems: 'center',
        marginRight: 10,
        marginLeft: 10
    },
    Text: {
        marginTop: 100,
        marginBottom: 30,
        color: 'white',
        alignSelf: 'center'
    },
    Text2: {
        fontSize: 20
    },
    Button: {
        borderRadius: 20
    },

})