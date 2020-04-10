import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
import firebase from 'firebase'
import NotificationHeader from '../../Headers/NotificationHeader'
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
        return Math.round(elapsed / msPerDay) + ' days ago';
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    }

    else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
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
class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            races: [],
            backColor: [],
        };
    }
    componentDidMount() {
        firebase.database().ref('post_races/').once('value', snapshot => {
            let datas = { ...snapshot.val() }
            var backColor = []
            Object.keys(datas).map(igKey => {
                var seen = datas[igKey].seen

                if (seen != undefined) {
                    Object.keys(seen).some(key => {
                        if (key == globalUserID) {
                            backColor.push("white")
                            return true
                        }else{
                            backColor.push('#cde1f9')
                        }
                    })
                } else {
                    backColor.push('#cde1f9')
                }
            })

            this.setState({ races: this.reverseObject(datas), backColor: backColor.reverse() })
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

    wordLimitter(str) {
        if (str.length > 10) str = str.substring(0, 40) + "...";
        return str
    }
    onPressList(igKey,index) {
        var datas = firebase.database().ref('post_races/' + igKey + '/seen/' + globalUserID)
        datas.set('true').then(()=>{
            var bcolor = this.state.backColor
            bcolor[index] = 'white'
            this.setState({backColor:bcolor})
            this.props.navigation.navigate('RacesInfo', {raceinfo: this.state.races[igKey],id:igKey})
        })
    }

    render() {
        return (
            <Container>

                <Content>
                    <NotificationHeader navigation={this.props.navigation}/>
                    <List>
                        {Object.keys(this.state.races).map((igKey,index) => {
                            return (
                                <ListItem noIndent style={{ backgroundColor: this.state.backColor[index] }} onPress={() => this.onPressList(igKey,index)}>
                                    <Body >
                                        <Text>{this.state.races[igKey].raceTitle}</Text>
                                        <Text note>{this.wordLimitter(this.state.races[igKey].raceInfo)}</Text>
                                    </Body>
                                    <Right>
                                        <Text note>{timeDifference(Date.now(), toTimestamp(this.state.races[igKey].datePosted))}</Text>
                                    </Right>
                                </ListItem>
                            )
                        })}
                    </List>
                </Content>
            </Container>
        )
    }
}


export default Notifications