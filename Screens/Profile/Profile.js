
import React, { Component } from 'react';
import {
    View,
    Text,
} from 'react-native';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userdata: []
        };
    }
    componentDidMount() {
        console.log(globalUserData)
        this.setState({ userdata:  globalUserData  })
    }
    render() {
        let {userdata} = this.state
        return (
            <View>
                <Text>{globalUserID}</Text>
                <Text>{userdata.firstname}</Text>
                <Text>{userdata.lastname}</Text>
                <Text>{userdata.username}</Text>
                <Text>{userdata.password}</Text>
                <Text>{userdata.imageuri}</Text>
                <Text>{userdata.age}</Text>
            </View>
        )
    }
}

export default Profile