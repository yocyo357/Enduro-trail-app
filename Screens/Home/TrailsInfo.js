import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    Image,
    Dimensions,
    FlatList,
    TouchableOpacity,
    ToastAndroid
} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, Item, H3, H2, H1 } from 'native-base';
import TrailHeader from '../../Headers/TrailsHeader'
import MapView, { Marker, Polyline, AnimatedRegion, PROVIDER_GOOGLE } from 'react-native-maps';
import Modal from 'react-native-modal';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Rating, AirbnbRating } from 'react-native-ratings';
import firebase from 'firebase'
import Spinner from 'react-native-loading-spinner-overlay';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeigth = Math.round(Dimensions.get('window').height);
var userRate = 0

if (!firebase.apps.length) {
    firebase.initializeApp(config())
}
const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
};
class TrailInfo extends Component {
    constructor(props) {
        super(props);
        this.showRating = this.showRating.bind(this);
        this.state = {
            trails: [],
            routeCoordinates: [],
            latitude: 37.78825,
            longitude: -122.4324,
            markers: [],
            isModalVisible: false,
            isRatingVisible: false,
            avatar: '',
            firstname: '',
            lastname: '',
            distance: '',
            difficulty: '',
            description: '',
            address: '',
            activity: '-',
            type: '-',
            title: '',
            timestamp: '',
            dateTime: '',
            images: [],
            rate: 0,
            trailId: '',
            prevRating: '',
            isLoading: false,
            totalRating: 0
        };
    }
    componentDidMount() {
        //alert(this.props.route.params.trails.routeCoordinates[0].latitude)

        // alert(trail.length)
        // this.setState({ trails: this.props.route.params.trails, routeCoordinates: trail }, function () {
        //     console.log(this.state.trails.routeCoordinates[0].longitude)
        //     //alert(this.state.trails.routeCoordinates[0].latitude)
        //     //alert(this.state.routeCoordinates[0].latitude)
        // })


        var infos = this.props.route.params.trails
        var trail = [...this.props.route.params.trails.routeCoordinates]
        var date = new Date(infos.timestamp).toLocaleDateString("en-US")
        var time = new Date(infos.timestamp).toLocaleTimeString("en-US")
        this.setState({ trailId: this.props.route.params.id })


        this.getTotalRating(infos)
        this.getPrevRating(infos)




        this.setState({
            latitude: trail[0].latitude,
            longitude: trail[0].longitude,
            routeCoordinates: trail,
            avatar: infos.userimageuri,
            firstname: infos.firstname,
            lastname: infos.lastname,
            address: infos.address,
            dateTime: date + " " + time,
            distance: infos.distance,
            type: (infos.type == "") ? "-" : infos.type,
            activity: (infos.activity == "") ? "-" : infos.activity,
            difficulty: infos.difficulty,
            description: (infos.description == "") ? "-" : infos.description,
            images: (infos.Images == undefined) ? [] : [...infos.Images],
            title: infos.trailTitle
        })

        var markers = []
        markers.push({ latitude: trail[0].latitude, longitude: trail[0].longitude, title: 'Start' })
        markers.push({ latitude: trail[trail.length - 1].latitude, longitude: trail[trail.length - 1].longitude, title: 'End' })
        // console.log(markers)
        this.setState({ markers: [...markers] })
    }

    getTotalRating(infos) {
        var bot = []
        for (let i = 1; i < 6; i++) {
            var tot = 0
            var rating = infos.Ratings
            if (rating != undefined) {
                Object.keys(rating).map(igKey => {
                    if (i == rating[igKey]) {
                        tot++
                    }
                })
            }
            bot.push(tot)
        }
        // alert(bot)
        var one = bot[0]
        var two = bot[1]
        var three = bot[2]
        var four = bot[3]
        var five = bot[4]
        var result = (5 * five + 4 * four + 3 * three + 2 * two + 1 * one) / (five + four + three + two + one)
        this.setState({ totalRating: result })
    }
    getPrevRating(infos) {
        try {
            var prev = infos.Ratings[globalUserID]
            this.setState({ prevRating: prev })
        } catch (error) {
            // alert(error)
        }

    }
    renderRow = ({ item, index }) => {


        return (

            <View style={{ flex: 1 / 2, flexDirection: 'column' }}>
                <Image source={{ uri: item }} style={styles.itemImage} />
            </View>

        )
    }
    showRating() {
        this.setState({ isRatingVisible: !this.state.isRatingVisible })
    }
    ratingCompleted(rating) {
        userRate = rating
    }

    submitRating() {
        this.setState({ isLoading: true })
        var datas = firebase.database().ref('Trails/' + this.state.trailId + '/Ratings/' + globalUserID)
        datas.set(userRate).then(() => {
            var infos = this.props.route.params.trails
            if (infos.Ratings == undefined) {
                infos['Ratings'] = {}
                infos['Ratings'][globalUserID] = userRate
            } else {
                infos['Ratings'][globalUserID] = userRate
            }

            this.getTotalRating(infos)
            this.setState({ prevRating: userRate, isLoading: false })
            this.showRating()
            showToast('Rating submitted Successfully')

        }).catch(error => {
            alert(error)
            showToast('Rating submitted Unsuccessfull')
            this.setState({ isLoading: false })
        })

    }


    render() {

        return (
            <Container>
                <TrailHeader navigation={this.props.navigation} title={this.state.title} showRating={this.showRating} totalRating={this.state.totalRating}/>
                {/* <Text>{this.state.trails.routeCoordinates.length}}</Text> */}
                <View style={styles.container}>

                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        initialRegion={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            latitudeDelta: 0.009,
                            longitudeDelta: 0.009,
                        }}
                    >
                        {this.state.markers.map(marker => {
                            return (
                                <Marker
                                    coordinate={{
                                        latitude: marker.latitude,
                                        longitude: marker.longitude,
                                    }}
                                    title={marker.title}
                                // description={marker.description}
                                />
                            )
                        })}
                        <Polyline coordinates={this.state.routeCoordinates} strokeWidth={4} strokeColor={'blue'} />

                    </MapView>
                    <Modal isVisible={this.state.isRatingVisible}>
                        <View style={{ alignSelf: 'center', backgroundColor: 'white', width: screenWidth / 1.2, height: screenHeigth / 3, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                            <AirbnbRating
                                count={5}
                                defaultRating={this.state.prevRating}
                                size={20}
                                onFinishRating={this.ratingCompleted}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 20, alignSelf: 'center' }}>
                                <H2 style={{marginTop:5}}>{this.state.totalRating} </H2>
                                <Icon name="star" style={{ fontSize: 30, color: 'grey' }} />
                            </View>
                            <TouchableOpacity style={{ position: 'absolute', bottom: 20, right: 20 }}
                                onPress={() => this.submitRating()}>
                                <Text>Submit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ position: 'absolute', top: 15, right: 20 }}
                                onPress={this.showRating} >
                                <Icon name="close" style={{color:'grey'}}/>
                            </TouchableOpacity>
                        </View>
                    </Modal>


                    <Button style={{ position: 'absolute', bottom: 10 }} onPress={() => this.setState({ isModalVisible: true })}><Text>Show more</Text></Button>
                    <Modal
                        testID={'modal'}
                        isVisible={this.state.isModalVisible}
                        onSwipeComplete={this.close}
                        swipeDirection={['up', 'left', 'right', 'down']}
                        style={styles.view}>
                        <View style={styles.content}>
                            <View style={{ position: "absolute", top: 10, right: 10, zIndex: 50 }}>
                                <TouchableOpacity onPress={() => this.setState({ isModalVisible: false })} >
                                    <Icon name="close" />
                                </TouchableOpacity>
                            </View>
                            <Content>

                                {/* <Thumbnail style={{ width: 40, height: 40 }} source={{ uri: this.state.avatar }} /> */}
                                <CardItem>
                                    <Left>
                                        <Thumbnail source={{ uri: this.state.avatar }} />
                                        <Body>
                                            <Text>{this.state.firstname + " " + this.state.lastname}</Text>
                                            <Text note>{this.state.dateTime}</Text>
                                        </Body>
                                    </Left>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Text>{this.state.address}</Text>
                                    </Body>
                                </CardItem>
                                <CardItem>
                                    <Body>
                                        <Grid>
                                            <Col>
                                                <Row style={styles.row}>
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ color: 'grey' }}>Distance</Text>
                                                        <H1>{(this.state.distance * 1.60934).toFixed(2)} KM</H1>

                                                    </View>
                                                </Row>
                                                <Row style={styles.row}>
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ color: 'grey' }}>Activity</Text>
                                                        <H1>{this.state.activity}</H1>

                                                    </View>
                                                </Row>

                                            </Col>
                                            <Col>
                                                <Row style={styles.row}>
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ color: 'grey' }}>Difficulty</Text>
                                                        <H1>{this.state.difficulty}</H1>
                                                    </View>
                                                </Row>
                                                <Row style={styles.row}>
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={{ color: 'grey' }}>Type</Text>
                                                        <H1>{this.state.type}</H1>
                                                    </View>
                                                </Row>
                                            </Col>

                                        </Grid>

                                        <Text style={{ color: 'grey', alignSelf: 'center' }}>Description</Text>
                                        <Text style={{ alignSelf: 'center' }}>{this.state.description}</Text>
                                    </Body>
                                </CardItem>
                                <View
                                    style={{
                                        borderBottomColor: 'grey',
                                        borderBottomWidth: 1,
                                        marginBottom: 10
                                    }}
                                />
                                <FlatList
                                    data={this.state.images}
                                    style={{ flex: 1 }}
                                    renderItem={this.renderRow}
                                    numColumns={5}>

                                </FlatList>
                            </Content>
                            {/* <Button onPress={() => this.setState({ isModalVisible: false })} ><Text>Close</Text></Button> */}
                        </View>
                        {/* <DefaultModalContent onPress={this.close} /> */}
                    </Modal>
                </View>
                <Spinner
                    visible={this.state.isLoading}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                />
            </Container >
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        marginTop: 1.5,
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        padding: 22,
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    contentTitle: {
        fontSize: 20,
        marginBottom: 12,
    },
    view: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    row: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    itemImage: {
        margin: 5,
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
});
export default TrailInfo