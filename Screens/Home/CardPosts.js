import React, { Component } from 'react'
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import {
    View,
    Image
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
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
class CardPosts extends Component {

    render() {

        return (
            Object.keys(this.props.trails).map((igKey, index) => {
                return (
                    <Card>
                        <CardItem>
                            <Left>
                                <Thumbnail style={{ width: 40, height: 40 }} source={{ uri: this.props.trails[igKey].userimageuri }} />
                                <Body>
                                    <Text>{this.props.trails[igKey].firstname + " " + this.props.trails[igKey].lastname}</Text>
                                    <Text note>{this.props.trails[igKey].address}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem cardBody button onPress={() => this.props.navigation.navigate('TrailInfo', { trails: this.props.trails[igKey] })}>
                            <Image source={{ uri: this.props.trails[igKey].mapImage }} style={{ height: 200, width: null, flex: 1 }} />
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Button transparent>
                                    <TouchableOpacity onPress={()=> this.props.onLikeClick(igKey)}>
                                        <Icon style={{ color: this.props.likes[igKey] }} name="thumbs-up" />
                                    </TouchableOpacity>
                                    <Text>{this.props.trails[igKey].likes} Likes</Text>
                                </Button>
                            </Left>
                            <Body>
                                {/* <Button transparent>
                      <Icon active name="chatbubbles" />
                      <Text>4 Comments</Text>
                    </Button>    */}
                            </Body>
                            <Right>
                                <Text>{timeDifference(Date.now(), this.props.trails[igKey].timestamp)}</Text>
                            </Right>
                        </CardItem>
                    </Card>
                )
            })
        )
    }
}

export default CardPosts