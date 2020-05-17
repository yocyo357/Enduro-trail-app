import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    Image,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Alert
} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, List, ListItem, Text, Button, Icon, Left, Body, Right, Item, H3, H2, H1 } from 'native-base';
import RaceHeader from '../../Headers/RaceHeader'
import { Col, Row, Grid } from 'react-native-easy-grid';
import firebase, { storage } from 'firebase'
const screenWidth = Math.round(Dimensions.get('window').width);


class RaceInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            raceInfo: [],
            infos: [],
            raceCategory: [],
            btnJoin: [],
            noParticipants: [],
            trails:[]
        }

    }
    componentDidMount() {

        let datas = this.props.route.params.raceinfo
        let info = []
        info.push({ title: 'Race Title:', value: datas.raceTitle })
        info.push({ title: 'Race Type:', valie: datas.raceType })
        info.push({ title: 'Event Date:', value: datas.eventDate })
        info.push({ title: 'No. of Riders:', value: datas.noOfRiders })
        info.push({ title: 'No. of Stages:', value: datas.raceNoOfStages })
        this.setState({ infos: [...info] })
        
        this.getTrail(datas.raceTrails)

        this.setState({ raceInfo: this.props.route.params.raceinfo}, function () {
            // console.log(this.state.raceInfo.raceCategory.length)
        })
        // console.log(this.props.route.params.raceinfo.raceCategory)
        let cat = this.props.route.params.raceinfo.raceCategory
        // console.log(cat)
        this.getData()
    }

    getTrail(trailsid){
        // console.log(trailsid)
        var traildatas = []
        firebase.database().ref('Trails/').once('value', snapshot => {
            var datas= snapshot.val()
            Object.keys(datas).map((igKey,index)=>{
                if(trailsid.some(tid => tid.value === igKey)){
                    datas[igKey].igKey = igKey
                    traildatas.push(datas[igKey])
                    var obj = {'igKey':igKey}
                }
            })
            // alert(traildatas[0].igKey)
            // traildatas[1].igK ='asdsad'
            console.log(traildatas)
            this.setState({trails: traildatas})
        })
    }
    getData() {
        firebase.database().ref('post_races/' + this.props.route.params.id + '/raceCategory').once('value', snapshot => {
            let btnJoin = []
            let noParticipants = []
            let cat = snapshot.val()
            this.setState({ raceCategory: cat })
            cat.map(key => {
                var stat = ''
                var par = 0
                if (key.participants != undefined) {
                    noParticipants.push(Object.keys(key.participants).length)
                    Object.keys(key.participants).some(igKey => {
                        if (key.participants[igKey] == globalUserID) {
                            stat = 'Leave'
                            return true
                        } else {
                            stat = 'Join'
                        }
                    })
                } else {
                    stat = 'Join'
                    noParticipants.push(0)
                }
                btnJoin.push(stat)
            })

            this.setState({ btnJoin: [...btnJoin], noParticipants: [...noParticipants] })
        })
    }
    onViewClicked(id){
        firebase.database().ref('Trails/'+id).once('value', snapshot => {
            console.log(snapshot.val())
        })
    }

    onJoinClick(status, index, cat) {
        var btnJoin = [...this.state.btnJoin]
        Alert.alert(
            "Confirmation",
            "Are you sure you want to " + status + " this event?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => {

                        if (status == 'Join') {
                            firebase.database().ref('post_races/' + this.props.route.params.id + '/raceCategory/' + index + '/participants').once('value', snapshot => {
                                let datas = { ...snapshot.val() }
                                len = Object.keys(datas).length
                                if (len > this.state.noParticipants[index]) {
                                    alert('Unable to join event')
                                } else {
                                    var refLiked = firebase.database().ref('post_races/' + this.props.route.params.id + '/raceCategory/' + index + '/participants')
                                    refLiked.push(globalUserID).then(() => {
                                        // btnJoin[index] = 'Leave'
                                        // this.setState({ btnJoin: btnJoin })
                                        this.getData()
                                    })
                                }

                            })

                        }
                        else {
                            // cat.participants
                            Object.keys(cat).map(key => {
                                if (cat[key] == globalUserID) {
                                    firebase.database().ref('post_races/' + this.props.route.params.id + '/raceCategory/' + index + '/participants/' + key).remove()
                                        .then(() => {
                                            this.getData()
                                        });
                                }
                            })

                        }

                    }
                }
            ],
            { cancelable: false }
        );





    }
    render() {

        return (
            <Container>
                <RaceHeader navigation={this.props.navigation} />
                <Content>
                    <Image source={{ uri: this.state.raceInfo.imageURL }} style={{ height: 300, width: screenWidth, marginBottom: 20 }} />
                    <Grid style={{ marginLeft: 30 }}>
                        {this.state.infos.map(info => {
                            return (
                                <Row style={{ margin: 5 }}>
                                    <Col><Text style={{ color: 'grey' }}>{info.title}</Text></Col>
                                    <Col><Text style={{marginRight:15}}>{info.value}</Text></Col>
                                </Row>
                            )
                        })}

                    </Grid>
                    <View
                        style={{
                            borderBottomColor: 'grey',
                            borderBottomWidth: 1,
                            margin: 15
                        }}
                    />
                    <H2 style={{ marginLeft: 15, color: 'grey' }}>Categories</H2>
                    <List>
                        {this.state.raceCategory.map((cat, index) => {
                            return (
                                <ListItem>
                                    <Left>
                                        <Text>{cat.label}</Text>
                                    </Left>
                                    <Body>
                                        <Text note>{this.state.noParticipants[index]}/{this.state.infos[3].value}</Text>
                                    </Body>
                                    <Right>
                                        <TouchableOpacity onPress={() => this.onJoinClick(this.state.btnJoin[index], index, cat.participants)}>
                                            <Text style={{ color: 'blue' }}>
                                                {this.state.btnJoin[index]}
                                            </Text>
                                        </TouchableOpacity>
                                    </Right>
                                </ListItem>
                            )
                        })}
                        
                    </List>
                    <H2 style={{ marginLeft: 15,marginTop:15, color: 'grey' }}>Trails</H2>
                    <List>
                        {this.state.trails.map(trail =>{
                            return(
                                <ListItem>
                                <Left>
                                    <Text>{trail.trailTitle}</Text>
                                </Left>
                                <Right>
                                    <TouchableOpacity 
                                    onPress={()=>this.props.navigation.navigate('TrailInfo', { trails: trail, id: trail.igKey })}
                                    >
                                        <Text style={{ color: 'blue' }}>
                                           View
                                        </Text>
                                    </TouchableOpacity>
                                </Right>
                            </ListItem>
                            )
                        })}
                    </List>
                </Content>
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
    }
});
export default RaceInfo