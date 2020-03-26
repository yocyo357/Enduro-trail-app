
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    PermissionsAndroid,
    Platform

} from 'react-native';
import { Container, Header, Content, Button, Text } from 'native-base';




class LandingScreen extends Component {


    async componentDidMount(){
        // try {

        //       const userResponse = await PermissionsAndroid.request(
        //         PermissionsAndroid.PERMISSIONS.CAMERA,
        //       //  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        //       );
        //       //console.log(userResponse)

        //   } catch (err) {
        //     Warning(err);
        //   }

    }
    async GetAllPermissions() {
        
      }
    render() {
        return (
            <Container style={{ backgroundColor: "#262626", alignItems: 'center' }}>
                <Content>
                    <Button style={{ marginTop: 100 }} large rounded block
                        onPress={() => this.props.navigation.navigate('Signup')}>
                        <Text>Signup</Text>
                    </Button>
                    <Text style={styles.Text}>-----Already a member?-----</Text>
                    <Button style={{ width: "100%" }} rounded large block success
                        onPress={() => this.props.navigation.navigate('Login')}>
                        <Text>Login</Text>
                    </Button>

                </Content>
            </Container>

            //    <Button
            //         style={styles.Button}
            //         contentStyle={{ height: 80, width: 300 }}
            //         color="#2E75B5" mode="contained"
            //         onPress={() => this.props.navigation.navigate('Signup')}>
            //         <Text style={styles.Text2}>Sign Up</Text>
            //     </Button>
            //     <Text style={styles.Text}>-----Already a member?-----</Text>
            //     <Button
            //         style={styles.Button}
            //         contentStyle={{ height: 80, width: 300 }}
            //         color="#00AF50" mode="contained"
            //         onPress={() => this.props.navigation.navigate('Signup')}>
            //         <Text style={styles.Text2}>Login</Text>
            //     </Button> 

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