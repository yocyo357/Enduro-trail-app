import React, { Component } from 'react';
import { Container, Header, Content, Button, Text, Icon, Left, Right, Body, Item, Input, Picker, Grid, Col, Textarea, Form } from 'native-base';
import SaveActivityHeader from '../../Headers/SaveActivityHeader'
import { StyleSheet, View, Image, ScrollView, Dimensions, PermissionsAndroid } from 'react-native';
import Slider from '@react-native-community/slider';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import { Circle } from 'react-native-maps';
import ImagePicker from 'react-native-image-picker';
import * as firebase from 'firebase'
import 'firebase/storage';
import { config } from '../../Firebase/index'

const screenWidth = Math.round(Dimensions.get('window').width);



if (!firebase.apps.length) {
    firebase.initializeApp(config())
}
class SaveActivity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected2: undefined,
            urisnapshot: '',
            images: [],
            numRows: [],
            trailTitle: '',
            activity: '',
            type: '',
            difficulty: '',
            description: '',
        };
    }

    async componentDidMount() {
       
    }
    onActivitychange(value) {
        this.setState({
            activity: value,
        });
    }
    onTypechange(value){
        this.setState({
            type: value,
        });
    }
    onDifficultychange(value){
        var difficulty = (value == 0)? 'Easy' : (value == 2)? 'Medium' : 'Hard'
        this.setState({difficulty:difficulty})
    }

    imagePickerHandler = async () => {

        ImagePicker.showImagePicker((response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                //const source = { uri: response.uri };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.uploadImage(response.uri,'testImage')
                .then(()=>{
                    alert('success')
                }).catch((error)=>{
                    alert(error)
                })
                var joined = this.state.images.concat(response.uri);


                this.setState({
                    images: joined,
                }, function () {
                    let numrows = this.state.images.length
                    let round = Math.round(numrows / 2)
                    var rows = []
                    rows.length = round
                    this.setState({ numRows: [...rows] })
                });

            }
        });
    }

    removeImage = (index) => {
        var images = [...this.state.images]
        images.splice(index, 1);
        this.setState({ images: images })
    }
    renderRow = ({ item, index }) => {


        return (

            <View style={{ flex: 1 / 2, flexDirection: 'column' }}>
                <Image source={{ uri: item }} style={styles.itemImage} />
                <View style={{ position: "absolute", top: 10, right: 5 }}>
                    <TouchableOpacity onPress={() => this.removeImage(index)} >
                        <Icon name="close" />
                    </TouchableOpacity>
                </View>
            </View>

        )
    }
    uploadImage = async (uri, imageName) =>{
        const response = await fetch(uri)
        const blob = await response.blob()

        var ref = firebase.storage.ref().child("images/" + imageName)
        return ref.put(blob)

    }
    onSaveHandler() {

    }
    render() {
        var activities = ["Walk", "Run", "Swim", "Hike", "Ride", "Alpine Ski", "Backcountry Ski", "Ice Skate", "Snowboard", "Snowshoe", "Nordic Ski", "Canoe", "Kayaking", "KiteSurf", "Rowing", "Surfing", "Rock Climb", "E Bike", "Hand Cycle", "Wheel Chair"]
        var types = ["None", "Long Run", "Workout", "Race"]
        activities.sort()
        return (
            <Container>
                <SaveActivityHeader navigation={this.props.navigation} />
                <ScrollView>
                    <Button onPress={()=>this.uploadImage(this.state.images[0],'testimage')}><Text>TESSST</Text></Button>
                    <Image
                        style={{ width: screenWidth, height: 300 }}
                        source={{ uri: this.props.route.params.snapshoturi }} />
                    <Content style={styles.container}>
                        <Item>
                            <Input placeholder="Trail title" />
                        </Item>
                        <Text style={styles.text}
                            value={this.state.trailTitle}
                            onChangeText={value => this.setState(trailTitle, value)}>
                            Select Activity
                            </Text>
                        <Item picker>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ width: undefined }}
                                selectedValue={this.state.difficulty}
                                onValueChange={this.onActivitychange.bind(this)}
                            >
                                {activities.map(activity => {
                                    return <Picker.Item label={activity} value={activity} />
                                })}
                            </Picker>
                        </Item>

                        <Text style={styles.text}>Select Type</Text>
                        <Item picker>
                            <Picker
                                mode="dropdown"
                                placeholder="test"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ width: undefined }}
                                selectedValue={this.state.type}
                                onValueChange={this.onTypechange.bind(this)}
                            >
                                {types.map(type => {
                                    return <Picker.Item label={type} value={type} />
                                })}
                            </Picker>
                        </Item>

                        <Text style={styles.text}>How hard was the trail?</Text>
                        <Slider
                            style={{ width: '100%', height: 30, marginTop: 10 }}
                            step={1, (3 - 1)}
                            minimumValue={0}
                            maximumValue={3}
                            minimumTrackTintColor="tomato"
                            maximumTrackTintColor="gray"
                            onValueChange={this.onDifficultychange.bind(this)}
                        />
                        <View style={{ flexDirection: 'row', flex: 1, alignSelf: 'center', marginBottom: 10 }}>
                            <Grid>
                                <Col style={{ height: 30, alignItems: 'flex-start', marginLeft: 5 }}><Text style={styles.text2}>Easy</Text></Col>
                                <Col style={{ height: 30, alignItems: 'center' }}><Text style={styles.text2}>Medium</Text></Col>
                                <Col style={{ height: 30, alignItems: 'flex-end', marginRight: 5 }}><Text style={styles.text2}>Expert</Text></Col>
                            </Grid>
                        </View>
                        <Form>
                            <Textarea 
                            rowSpan={5} 
                            bordered placeholder="Add Description"
                            value={this.state.description}
                            onChangeText={value => this.setState(description, value)} />
                        </Form>

                        <Button
                            onPress={() => this.imagePickerHandler()}
                            iconRight bordered warning style={{ width: 150, marginTop: 20, marginBottom: 20 }}>
                            <Text>Add Photos</Text>
                            <Icon name='camera' />
                        </Button>
                        <FlatList
                            data={this.state.images}
                            style={{ flex: 1 }}
                            renderItem={this.renderRow}
                            numColumns={2}>

                        </FlatList>

                    </Content>
                </ScrollView>
            </Container>
        )
    }
}


export default SaveActivity


const styles = StyleSheet.create({
    container: {
        margin: 15,
    },
    text: {
        fontSize: 15,
        marginLeft: 5,
        marginTop: 18,
        color: 'gray',
    },
    text2: {
        fontSize: 12,
        color: 'gray',
    },
    itemImage: {
        margin: 5,
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
})