
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
import { withNavigation } from 'react-navigation';
import firebase, { storage } from 'firebase'
import { config } from '../../Firebase/index'
import CardPosts from './CardPosts';

if (!firebase.apps.length) {
    firebase.initializeApp(config())
}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + ' seconds ago';
    }

    else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    }

    else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    }

    else if (elapsed < msPerMonth) {
        return 'approximately ' + Math.round(elapsed / msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months ago';
    }

    else {
        return 'approximately ' + Math.round(elapsed / msPerYear) + ' years ago';
    }
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trails: [],
            trailImages: []
        };
    }
    read() {

    }


    readUserData() {


    }

    async componentDidMount() {

        var userID = await AsyncStorage.getItem('userID')
        if (userID != null) {
            console.log(userID)
        }

        firebase.database().ref('Trails/').on('value', snapshot => {  
            //console.log(snapshot.val())

            let datas = { ...snapshot.val() }
            // var storage = firebase.storage();
            //var revdatas = test.reverse()
            // Object.keys(datas).map(async (igKey, index) => {
            //     var ref = storage.ref().child("images/" + datas[igKey].mapImage)
            //     const url = await ref.getDownloadURL();
            //     var joined = this.state.trailImages.concat(url);
            //     this.setState({ trailImages: joined })
            // })
            console.log(this.reverseObject(datas))
            this.setState({ trails: this.reverseObject(datas) })
        })
    }
    reverseObject(object) {
        var newObject = {};
        var keys = [];

        for (var key in object) {
            keys.push(key);
        }

        for (var i = keys.length - 1; i >= 0; i--) {
          var value = object[keys[i]];
          newObject[keys[i]]= value;
        }       

        return newObject;
      }

    render() {
        const trailCards = Object.keys(this.state.trails)
            .map((igKey, index) => {
                return (
                    <Card>
                        <CardItem>
                            <Left>
                                <Thumbnail style={{ width: 40, height: 40 }} source={{ uri: this.state.trails[igKey].userimageuri }} />
                                <Body>
                                    <Text>{this.state.trails[igKey].firstname+" "+this.state.trails[igKey].lastname}</Text>
                                    <Text note>{this.state.trails[igKey].address}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem cardBody>
                            <Image source={{ uri: this.state.trails[igKey].mapImage}} style={{ height: 200, width: null, flex: 1 }} />
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Button transparent>
                                    <Icon name="thumbs-up" />
                                    <Text>{this.state.trails[igKey].likes} Likes</Text>
                                </Button>
                            </Left>
                            <Body>
                                {/* <Button transparent>
                      <Icon active name="chatbubbles" />
                      <Text>4 Comments</Text>
                    </Button>    */}
                            </Body>
                            <Right>
                                <Text>{timeDifference(Date.now(), this.state.trails[igKey].timestamp)}</Text>
                            </Right>
                        </CardItem>
                    </Card>
                )
            })
        return (
            <Container style={styles.container}>
                <HomeHeader navigation={this.props.navigation} />
                <Content >
                    {/* <CardPosts trails={this.state.trails} /> */}
                    {trailCards}

                </Content>
            </Container>
        )
    }
}



export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#E9EBEE'
    },
    box: {
        width: 50,
        height: 50,
        backgroundColor: 'blue',
        shadowColor: "#000",



        elevation: 24,
    }
})