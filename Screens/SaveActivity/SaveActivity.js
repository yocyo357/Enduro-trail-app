import React, { Component } from 'react';
import { Container, Header, Content, Button, Text, Icon, Left, Right, Body, Item, Input, Picker, Grid, Col, Textarea, Form } from 'native-base';
import SaveActivityHeader from '../../Headers/SaveActivityHeader'
import { StyleSheet, View, Image, ScrollView, Dimensions, PermissionsAndroid,ToastAndroid } from 'react-native';
import Slider from '@react-native-community/slider';
import { TouchableOpacity, FlatList, TapGestureHandler } from 'react-native-gesture-handler';
import { Circle } from 'react-native-maps';
import ImagePicker from 'react-native-image-picker';
import * as firebase from 'firebase'
import 'firebase/storage';
import { config } from '../../Firebase/index'
import Spinner from 'react-native-loading-spinner-overlay';
const screenWidth = Math.round(Dimensions.get('window').width);



if (!firebase.apps.length) {
    firebase.initializeApp(config())
}
const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };
var imagesURLS = []
var imageNames = []
var storage = firebase.storage();
var localMapImage = ""

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
            difficulty: 'Easy',
            description: '',
            imagesUrls: '',
            status: 'pending',
            address: '',
            isdone: false,
            isLoading: false
        };
    }

    async componentDidMount() {
        imagesURLS.length=0
    }
    onActivitychange(value) {
        this.setState({
            activity: value,
        });

    }
    onTypechange(value) {
        this.setState({
            type: value,
        });
    }
    onDifficultychange(value) {
        var difficulty = (value == 0) ? 'Easy' : (value == 2) ? 'Medium' : 'Hard'
        this.setState({ difficulty: difficulty })
    }
    generateUniqueId() {
        return '-' + Math.random().toString(36).substr(2, 9) + '-' + Math.random().toString(36).substr(2, 9)
    }
    imagePickerHandler = async () => {

        ImagePicker.showImagePicker((response) => {
            // console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                //const source = { uri: response.uri };

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                var joined = this.state.images.concat(response.uri);
                imageNames.push("IMAGE" + this.generateUniqueId())

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
        imageNames.splice(index, 1)
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

    async putImage(image, index) {
        // the return value will be a Promise
        const response = await fetch(image)
        const blob = await response.blob()
        var ref = storage.ref().child("images/" + imageNames[index])

        return ref.put(blob)
            .then(async (snapshot) => {
                let url = await ref.getDownloadURL();
                imagesURLS.push(url)
                console.log(imagesURLS)
            }).catch((error) => {
                //console.log('One failed:',image, error.message)
            });
    }

    findMapIndex(images, type) {
        for (let i = 0; i < images.length; i++) {
            var str = images[i]
            var n = str.search("MAP");
            if (n > 0) {

                if (type == "map") {
                    return i
                } else {
                    imagesURLS.splice(i, 1);
                    return imagesURLS
                }

            }
        }
    }


    async Save() {
        if (this.state.trailTitle == "") {
            showToast("Please add title")
        } else {

            this.setState({isLoading:true})
            var allImages = [...this.state.images]
            // allImages.push(this.props.route.params.snapshoturi)
            // imageNames.push("MAP"+this.generateUniqueId())
            // console.log(allImages)
            // console.log(imageNames)
            var ref = storage.ref().child("images/" + "MAP" + this.generateUniqueId())
            const response = await fetch(this.props.route.params.snapshoturi)
            const blob = await response.blob()

            ref.put(blob).then(async () => {
                let url = await ref.getDownloadURL();
                localMapImage = url

                Promise.all(
                    allImages.map((image, index) => this.putImage(image, index, imageNames))
                )
                    .then((url) => {
                        console.log(imagesURLS)
                        var trailData = {
                            mapImage: localMapImage,
                            userId: globalUserID,
                            trailTitle: this.state.trailTitle,
                            activity: this.state.activity,
                            type: this.state.type,
                            difficulty: this.state.difficulty,
                            description: this.state.description,
                            status: this.state.status,
                            Images: [...imagesURLS],
                            distance: this.props.route.params.distance,
                            trailAddress: this.props.route.params.address,
                            routeCoordinates: this.props.route.params.routeCoordinates,
                            address: this.props.route.params.address,
                            likes: 0,
                            firstname: globalUserData.firstname,
                            lastname: globalUserData.lastname,
                            userimageuri: globalUserData.imageuri,
                            timestamp: Date.now()
                        }

                        var datas = firebase.database().ref('/Trails')
                        datas.push(trailData).then(() => {
                            this.setState({isLoading:false})
                            showToast('Successfully Saved')
                            this.props.navigation.goBack()
                        }).catch(error =>{
                            this.setState({isLoading:false})
                            showToast(error)
                        });
                        
                    })
                    .catch(error => {
                        this.setState({isLoading:false})
                        showToast(error)
                    })
            })
        }
    }

    uploadImage = async () => {

        const allImages = [...this.state.images]
        // allImages.push(this.props.route.params.snapshoturi)
        imageNames.push(globalUserID + "-" + Date.now())






        const prom = allImages.map(async (image, index) => {
            const response = await fetch(image)
            const blob = await response.blob()

            var storage = firebase.storage();

            var ref = storage.ref().child("images/" + imageNames[index])
            ref.put(blob)

            // .then(async () => {
            //     const url = await ref.getDownloadURL();
            //     imagesURLS.push(url)
            //     console.log(url)
            // })
            //Promise.all(prom2).then(res => { this.setState({isdone:true}) })
            // const ref = storage.ref('images/1585290674985');

            // storage.ref('images').child(imageNames[index]+".jpg").getDownloadURL().then(url =>{
            //     console.log(url)
            // })
        })

        Promise.all(prom).then(res => { return })
        //     const prom2 =allImages.map(async (image, index)=>{

        //         var ref = storage.ref().child("images/" + imageNames[index])
        //         const url = await ref.getDownloadURL();
        //         imagesURLS.push(url)
        //     })

        //     Promise.all(prom2).then(res =>{
        //         alert(imagesURLS.length)
        //         var trailData = {
        //             userId: globalUserID,
        //             trailTitle: this.state.trailTitle,
        //             activity: this.state.activity,
        //             type: this.state.type,
        //             difficulty: this.state.difficulty,
        //             description: this.state.description,
        //             status: this.state.status,
        //             Images: [...imagesURLS],
        //             distance: this.props.route.params.distance,
        //             trailAddress: this.props.route.params.address,
        //             routeCoordinates: this.props.route.params.routeCoordinates,
        //             address: this.props.route.params.address
        //         }

        //         var datas = firebase.database().ref('/Trails')
        //         //datas.push(trailData);
        //         //alert('Successfully Saved')
        //     })

        // });
        // const uploadTask = storage.ref(`images/${'test'}`).put(blob)
        // uploadTask.once('state_changed',
        //     (error) => {
        //         console.log(error)
        //     },
        //     () => {
        //         var storage = firebase.storage();
        //         storage.ref('images/').child('test').getDownloadURL().then(url => {
        //             console.log(url)

        //             imagesURLS.push(url)
        //         })
        //     })

    }
   
    render() {
        var activities = ["Walk", "Run", "Swim", "Hike", "Ride", "Alpine Ski", "Backcountry Ski", "Ice Skate", "Snowboard", "Snowshoe", "Nordic Ski", "Canoe", "Kayaking", "KiteSurf", "Rowing", "Surfing", "Rock Climb", "E Bike", "Hand Cycle", "Wheel Chair"]
        var types = ["None", "Long Run", "Workout", "Race"]
        activities.sort()

        // if (this.state.isLoading) {
        //     return (
        //         <Container>
        //             <Header style={{ backgroundColor: 'white' }}>
        //                 <Left>
        //                     <TouchableOpacity
        //                         onPress={() => this.props.navigation.goBack()}>
        //                         <Icon name='arrow-back' style={{ fontSize: 30, color: 'black' }} />
        //                     </TouchableOpacity>
        //                 </Left>
        //                 <Body>

        //                 </Body>
        //                 <Right>
        //                     <TouchableOpacity onPress={() => this.onSaveHandler()}>
        //                         <Text>Save</Text>
        //                     </TouchableOpacity>
        //                 </Right>
        //             </Header>
        //         </Container>
        //     )
        // }

        return (
            <Container>
                <Header style={{ backgroundColor: 'white' }}>
                    <Left>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' style={{ fontSize: 30, color: 'black' }} />
                        </TouchableOpacity>
                    </Left>
                    <Body>

                    </Body>
                    <Right>
                        <TouchableOpacity onPress={() => this.Save()}>
                            <Text>Save</Text>
                        </TouchableOpacity>
                    </Right>
                </Header>

                <ScrollView>
                    <Image
                        style={{ width: screenWidth, height: 300 }}
                        source={{ uri: this.props.route.params.snapshoturi }} />
                    <Content style={styles.container}>
                        <Item>
                            <Input
                                placeholder="Trail title"
                                value={this.state.trailTitle}
                                onChangeText={value => this.setState({ trailTitle: value })} />
                        </Item>
                        <Text style={styles.text}>
                            Select Activity
                            </Text>
                        <Item picker>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ width: undefined }}
                                selectedValue={this.state.activity}
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
                                onChangeText={value => this.setState({ description: value })} />
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
                        <View style={styles.container}>
                            <Spinner
                                visible={this.state.isLoading}
                                textContent={'Loading...'}
                                textStyle={styles.spinnerTextStyle}
                            />
                        </View>
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
    spinner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
})