
import React, { Component } from 'react';
import {
    View,
    StatusBar,
    AsyncStorage,
    StyleSheet,
    Image,
    BackHandler
} from 'react-native';
import HomeHeader from '../../Headers/HomeHeader'
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, Tabs, Tab, TabHeading } from 'native-base';
import { withNavigation } from 'react-navigation';
import firebase, { storage } from 'firebase'
import { config } from '../../Firebase/index'
import CardPosts from './CardPosts';
import Races from './Races'
if (!firebase.apps.length) {
    firebase.initializeApp(config())
}

function toTimestamp(datetime) {
    var dateString = datetime,
        dateTimeParts = dateString.split(' '),
        timeParts = dateTimeParts[1].split(':'),
        dateParts = dateTimeParts[0].split('-'),
        date;
    // console.log(timeParts)
    date = new Date(dateParts[0], parseInt(dateParts[1], 10) - 1, dateParts[2], timeParts[0], timeParts[1]);
    // console.log(date.getTime())
    var d = date.getTime()
    return d
}

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trails: [],
            trailImages: [],
            likes: [],
            races: [],
            notif: 0
        };
    }
    read() {

    }


    readUserData() {


    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressed);
        if (globalReloadData == "true") {
            var userID = await AsyncStorage.getItem('userID')
            if (userID != null) {

                globalUserID = userID
                firebase.database().ref('Users/' + userID).once('value', async snapshot => {
                    globalUserData = { ...snapshot.val() }

                })
            }

        }
        console.log(globalUserID)
        console.log(globalUserData)

        firebase.database().ref('Trails/').on('value', snapshot => {
            //console.log(snapshot.val())

            let datas = { ...snapshot.val() }

            //getLikes
            var likes = {}
            Object.keys(datas).map(igKey => {
                let userLiked = datas[igKey].userLiked
                if (userLiked != undefined) {
                    // alert(userLiked[igKey1] +" "+ igKey)
                    Object.keys(userLiked).some(igKey1 => {
                        if (userLiked[igKey1] == globalUserID) {
                            likes[igKey] = '#007AFF'
                            return true
                        } else {
                            likes[igKey] = 'grey'
                        }

                    })
                } else {
                    likes[igKey] = 'grey'
                }
            })
            this.setState({ likes: likes })

            


            // console.log(this.reverseObject(datas))
            this.setState({ trails: this.reverseObject(datas) })
        })

        firebase.database().ref('post_races/').on('value', snapshot => {
            let datas = { ...snapshot.val() }

            //get Notifications
            let notif = 0
            Object.keys(datas).map(igKey => {
                let notifseen = datas[igKey].seen
                // alert(globalUserData.datecreated > toTimestamp(datas[igKey].datePosted))
                // alert(toTimestamp(datas[igKey].datePosted))
               if(globalUserData.datecreated< datas[igKey].datePosted){
                if (notifseen != undefined) {
                    notif++ 
                    Object.keys(notifseen).some(igKey1 => {
                        if (igKey1 == globalUserID) {
                            notif--
                            return true
                        }
                    })
                } else {
                    notif++
                }
            }
            })
            this.setState({ races: this.reverseObject(datas), notif: notif })
        })

    }
    componentWillUnmount() {
        firebase.database().ref('Trails/').off()
        BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressed);
    }

    onBackButtonPressed() {
        return true;
    }
    onLikeClick(id) {
        var exist = false
        var key = ""

        firebase.database().ref('Trails/' + id).once('value', snapshot => {
            let datas = { ...snapshot.val() }
            let userLiked = datas.userLiked
            if (userLiked != undefined) {
                Object.keys(userLiked).map(igKey => {
                    if (userLiked[igKey] == globalUserID) {
                        exist = true
                        key = igKey
                    }
                })

            }
            if (exist) {
                firebase.database().ref('Trails/' + id + '/likes').set((datas.likes) - 1)
                firebase.database().ref('Trails/' + id + '/userLiked/' + key).remove();
            } else {
                firebase.database().ref('Trails/' + id + '/likes').set((datas.likes) + (1))
                var refLiked = firebase.database().ref('Trails/' + id + '/userLiked/')
                refLiked.push(globalUserID)
            }


        }).catch(error => {
            alert(error)
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
            newObject[keys[i]] = value;
        }

        return newObject;
    }

    render() {

        return (
            <Container style={styles.container}>
                <HomeHeader navigation={this.props.navigation} title='FEED' notif={this.state.notif} />

                <Tabs tabContainerStyle={{ borderTopWidth: 0 }} tabBarUnderlineStyle={{ backgroundColor: '#6F952C' }}>
                    <Tab heading={<TabHeading style={{ backgroundColor: '#343A40' }} ><Text>Trails</Text></TabHeading>}>
                        <Content>
                            <CardPosts trails={this.state.trails} navigation={this.props.navigation} onLikeClick={this.onLikeClick} likes={this.state.likes} />
                        </Content>
                    </Tab>
                    <Tab heading={<TabHeading style={{ backgroundColor: '#343A40' }}><Text>Races</Text></TabHeading>}>
                        <Content>
                            <Races races={this.state.races} navigation={this.props.navigation} />
                        </Content>
                    </Tab>
                </Tabs>
                {/* <Content>
                    <CardPosts trails={this.state.trails} />
                </Content> */}
            </Container>
        )
    }
}



export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E9EBEE'
    },
    box: {
        width: 50,
        height: 50,
        backgroundColor: 'blue',
        shadowColor: "#000",



        elevation: 24,
    }
})