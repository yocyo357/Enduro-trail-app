import React, { Component } from 'react';
import {
  StyleSheet, View, Image, TouchableOpacity, ScrollView, FlatList, TextInput

} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, H1, Item, Input } from 'native-base';

import firebase, { storage } from 'firebase'
import { config } from '../../Firebase/index'
import Modal from 'react-native-modal';
import { Col, Row, Grid } from 'react-native-easy-grid';

if (!firebase.apps.length) {
  firebase.initializeApp(config())
}

export default class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,

      userfirstname: "",
      userlastname: "",
      userimageuri: "",
      userteam: "",

      key: "",
      firstname: "",
      lastname: "",
      timestamp: "",
      userimageuri: "",
      activity: "",
      trailAddress: "",
      description: "",
      difficulty: "",
      trailTitle: "",
      type: "",
 

      userdata: [],
    }

  }
 


  showModal = (firstname, lastname, timestamp, userimageuri, activity, trailAddress, description, difficulty, trailTitle, type, key) => {

    var date = new Date(timestamp).toLocaleDateString("en-US")
    // var time = new Date(timestamp).toLocaleTimeString("en-US")

    this.setState({
      isModalVisible: true,
      firstname: firstname,
      lastname: lastname,
      timestamp: date + " " + "",
      userimageuri: userimageuri,
      activity: activity,
      trailAddress: trailAddress,
      description: description,
      difficulty: difficulty,
      trailTitle: trailTitle,
      type: type,
      key: key
 
    })
    console.log(key +'  true  '+ globalUserID );
    // alert(">>>"+firstname +"<<<"+lastname)
  }

  async componentDidMount() {
    var that = this
    firebase.database().ref('Trails/').on('value', function (snapshot) {
      var returnArray = [];
      snapshot.forEach(function (snap) {
        var item = snap.val();
        if(globalUserID.includes(item.userId)){
          item.key = snap.key;
          // console.log(item.userId+ '  true  '+ globalUserID );
          returnArray.push(item);
        }
      });
      that.setState({ userdata: returnArray })
    });

 

    firebase.database().ref('Users/').once('value', function (snapshot) {
      // var returnArray = [];
      snapshot.forEach(function (snap) {
        var item2 = snap.val();
        if(globalUserID.includes(snap.key)){
          console.log(snap.key+ '  true  '+ globalUserID );
          that.setState({
            userfirstname: item2.firstname,
            userlastname: item2.lastname,
            userimageuri: item2.imageuri,
            userteam: item2.team
          })
          
          // returnArray.push(item);
        }
      });
      // that.setState({ userdata: returnArray })
    });

  }

  UpdateProfile() {
    const {firstname, lastname, activity, description, trailAddress, difficulty, trailTitle, type,key } = this.state;

        console.log(firstname + '    '+key);
    firebase.database().ref('Trails/'+key).update({
      firstname: firstname,
      lastname: lastname,
      activity: activity,
      description: description,
      trailAddress: trailAddress,
      difficulty: difficulty,
      trailTitle: trailTitle,
      type: type
  });
  alert('Updated Successfully')
  this.setState({ isModalVisible: false })
    
}


  render() {
 
    // console.log('swe');
    var date;
 
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.header}></View>
          <Image style={styles.avatar} source={{ uri: this.state.userimageuri }} />
          <View style={styles.body}>
            <View style={styles.bodyContent}>
            <Text style={styles.name}>{this.state.userfirstname+' '+this.state.userlastname} </Text>
              <Text style={styles.info}>{this.state.userteam}</Text>
              {/* <Text style={styles.description}>Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum electram expetendis, omittam deseruisse consequuntur ius an,</Text> */}



            </View>
          </View>
 
          <FlatList
            data={this.state.userdata}
            renderItem={({ item }) =>
 
              <View style={{ margin: 25 }}>
                <Content>
                  <Card style={{ flex: 0 }}>
                  <CardItem>
                      <Left>
                        <Thumbnail source={{ uri: item.userimageuri }} style={{height:40, width: 40, borderRadius: 40/2}} />
                        <Body>
                          <Text style={styles.textMedium}>{item.firstname} {item.lastname}</Text>
                          <Text style={styles.textSmall}>{date = new Date(item.timestamp).toLocaleDateString("en-US")}</Text>
                        </Body>
                      </Left>
                      <Right style={{ width: 20, marginTop: -20, marginRight: -15}}>
                        <Button transparent textStyle={{ color: '#87838B' }}>
                          {/* <Icon name="logo-github" /> */}
                          <TouchableOpacity onPress={() => this.showModal(item.firstname, item.lastname, item.timestamp, item.userimageuri, item.activity, item.trailAddress, item.description, item.difficulty, item.trailTitle, item.type, item.key)} ><Text>Edit</Text></TouchableOpacity>
                        </Button>
                      </Right>
                    </CardItem>

                    <CardItem cardBody>
                      <Image source={{ uri: item.mapImage }} style={{ height: 200, width: null, flex: 1, marginLeft: 8, marginRight: 8}} />
                    </CardItem>
                    
                    <CardItem >
                      <Left style={{ marginLeft: -10}} >
                        <Body>
                          <Text style={styles.textMedium}>{item.activity}</Text>
                          <Text style={styles.textSmall} note>{item.description}</Text>
                        </Body>
                      </Left>
                    </CardItem>
                    <CardItem>
                      <Left>
                        {/* <Button transparent>
                  <Icon active name="thumbs-up" />
                  <Text>12 Likes</Text>
                  </Button> */}
                      </Left>
                      <Body>
                        {/* <Button transparent>
                  <Icon active name="chatbubbles" />
                  <Text>4 Comments</Text>
                  </Button> */}
                      </Body>
                      
                    </CardItem>
                  </Card>
                </Content>

              </View>


            }
            keyExtractor={item => item.id}
          />

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
                {/* <CardItem>
                  <Left>
                    <Thumbnail source={{ uri: this.state.userimageuri }} />
                    <Body>
                      <TextInput style={{ borderBottomColor: "black" }}>{this.state.firstname + " " + this.state.lastname}</TextInput>
                      <Text note>{this.state.timestamp}</Text>
                    </Body>
                  </Left>
                </CardItem>
                <CardItem>
                  <Body>
                    <TextInput>{this.state.address}</TextInput>
                  </Body>
                </CardItem> */}
                <CardItem>
                  <Body>

                    {/* Firstname */}
                    <Text style={styles.textview}> First Name </Text>
                    <TextInput style={styles.inputBox}
                      underlineColorAndroid='a9a9a9'
                      placeholder="Firstname"
                      placeholderTextColor="#a9a9a9"
                      autoCorrect={false}
                      autoCapitalize="none"
                      ref={'text6'}
                      value={this.state.firstname}
                      onChangeText={firstname => this.setState({ firstname })}
                    />

                    {/* Lastname */}
                    <Text style={styles.textview}> Lastname </Text>
                    <TextInput style={styles.inputBox}
                      underlineColorAndroid='a9a9a9'
                      placeholder="Lastname"
                      placeholderTextColor="#a9a9a9"
                      autoCorrect={false}
                      autoCapitalize="none"
                      ref={'text6'}
                      value={this.state.lastname}
                      onChangeText={lastname => this.setState({ lastname })}
                    />

                    {/* Activity */}
                    <Text style={styles.textview}> Activity </Text>
                    <TextInput style={styles.inputBox}
                      underlineColorAndroid='a9a9a9'
                      placeholder="Activity"
                      placeholderTextColor="#a9a9a9"
                      autoCorrect={false}
                      autoCapitalize="none"
                      ref={'text6'}
                      value={this.state.activity}
                      onChangeText={activity => this.setState({ activity })}
                    />

                    {/* Description */}
                    <Text style={styles.textview}> Description </Text>
                    <TextInput style={styles.inputBox}
                      underlineColorAndroid='a9a9a9'
                      placeholder="Description"
                      placeholderTextColor="#a9a9a9"
                      autoCorrect={false}
                      autoCapitalize="none"
                      ref={'text6'}
                      value={this.state.description}
                      onChangeText={description => this.setState({ description })}
                    />

                    {/* Trail Title */}
                    <Text style={styles.textview}> Trail Title </Text>
                    <TextInput style={styles.inputBox}
                      underlineColorAndroid='a9a9a9'
                      placeholder="Trail Title"
                      placeholderTextColor="#a9a9a9"
                      autoCorrect={false}
                      autoCapitalize="none"
                      ref={'text6'}
                      value={this.state.trailTitle}
                      onChangeText={trailTitle => this.setState({ trailTitle })}
                    />

                    {/* Trail Address */}
                    <Text style={styles.textview}> Trail Address </Text>
                    <TextInput style={styles.inputBox}
                      underlineColorAndroid='a9a9a9'
                      placeholder="Trail Address"
                      placeholderTextColor="#a9a9a9"
                      autoCorrect={false}
                      autoCapitalize="none"
                      ref={'text6'}
                      value={this.state.trailAddress}
                      onChangeText={trailAddress => this.setState({ trailAddress })}
                    />

                    {/* Difficulty */}
                    <Text style={styles.textview}> Difficulty </Text>
                    <TextInput style={styles.inputBox}
                      underlineColorAndroid='a9a9a9'
                      placeholder="Difficulty"
                      placeholderTextColor="#a9a9a9"
                      autoCorrect={false}
                      autoCapitalize="none"
                      ref={'text6'}
                      value={this.state.difficulty}
                      onChangeText={difficulty => this.setState({ difficulty })}
                    />

                    {/* Type */}
                    <Text style={styles.textview}> Type </Text>
                    <TextInput style={styles.inputBox}
                      underlineColorAndroid='a9a9a9'
                      placeholder="Type"
                      placeholderTextColor="#a9a9a9"
                      autoCorrect={false}
                      autoCapitalize="none"
                      ref={'text6'}
                      value={this.state.type}
                      onChangeText={type => this.setState({ type })}
                    />

                  </Body>
                </CardItem>

                <FlatList
                  data={this.state.images}
                  style={{ flex: 1 }}
                  renderItem={this.renderRow}
                  numColumns={5}>

                </FlatList>
              </Content>

              <Button style={styles.button} onPress={() => this.UpdateProfile()}><Text> UPDATE </Text></Button>
            </View>
            {/* <DefaultModalContent onPress={this.close} /> */}
          </Modal>


        </ScrollView>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#343A40',
    height: 200,
  },
  textview: {
    color: '#a9a9a9',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130
  },
  name: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: '600',
  },
  body: {
    marginTop: 40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  name: {
    fontSize: 28,
    color: "#696969",
    fontWeight: "600"
  },
  info: {
    fontSize: 16,
    color: "#00BFFF",
    marginTop: 10
  },
  description: {
    fontSize: 16,
    color: "#696969",
    marginTop: 10,
    textAlign: 'center'
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: "#00BFFF",
  },

  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
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
  item: {
    margin: 5,
    backgroundColor: '#ADB8CA',
    borderRadius: 10,
    borderColor: 'transparent'
  }, input: {
    marginLeft: 5
  }, button: {
    borderRadius: 10,
    marginTop: 30
  },
  inputBox: {
    width: 280,
    height: 45,
    marginLeft: 20,
    paddingHorizontal: 16, //padding left sa Email
    marginVertical: 5, //margin between email and password
    fontSize: 18,
    color: '#696969'
  },
  textMedium: {
    fontSize: 15,
    width: 200,
  },
  textSmall: {
    fontSize: 14,
    color: '#757575' 
  },
  textLarge: {
    fontSize: 25
  }



});
