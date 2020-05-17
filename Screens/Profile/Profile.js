import React, { Component } from 'react';
import {
  StyleSheet, View, Image, TouchableOpacity, ScrollView, FlatList, TextInput, Picker

} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right, H1, Item, Input } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase, { storage } from 'firebase'
import { config } from '../../Firebase/index'
import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modal';


if (!firebase.apps.length) {
  firebase.initializeApp(config())
}

var now = new Date();

function uploadImage(uri, mime = 'image/png') {

  return new Promise((resolve, reject) => {

    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
    const sessionId = new Date().getTime()
    let uploadBlob = null

    const imageRef = firebase.storage().ref().child('images/' + dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT"))

    fs.readFile(uploadUri, 'base64')
      .then((data) => {
        return Blob.build(data, { type: `${mime};BASE64` })
      })
      .then((blob) => {
        uploadBlob = blob

        return imageRef.put(blob, { contentType: mime })
      })
      .then(() => {
        uploadBlob.close()
        return imageRef.getDownloadURL()
      })
      .then((url) => {

        resolve(url)
        // alert("uploaded reported")
        storeReference(url)


      })
      .catch((error) => {
        reject(error)
        alert(error + "UPLOAD")
      })
  })

  
}
 
const storeReference = (downloadUrl) => {
  const { userfirstname, userlastname, uri, userteam, usergender, userUsername, userPassword, userkey } = this.state;
  firebase.database().ref('Users/' + userkey).update({
   firstname: userfirstname,
   lastname: userlastname,
   team: userteam,
   gender: usergender,
   username: userUsername,
   password: userPassword,
   confirmPassword: userPassword,
   imageuri: downloadUrl,
 });
 alert('Updated Successfully')
 this.setState({ isModalVisible2: false })
}

export default class Profile extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isModalVisible: false,
      isModalVisible2: false,
      uri: '',

      userfirstname: "",
      userlastname: "",
      imageuri: "",
      userteam: "",
      userage: "",
      usergender: "",
      userUsername: "",
      userPassword: "",
      userConfirmPassword: "",
      userkey: "",



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
    console.log(key + '  true  ' + globalUserID);
    // alert(">>>"+firstname +"<<<"+lastname)
  }


  showModal2 = () => {

    this.setState({
      isModalVisible2: true,
 
    })
 
  }

  imagePickerHandler =  () => {

    ImagePicker.showImagePicker((response) => {
        // console.log('Response = ', response);

        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else {
            const source = { uri: response.uri };

            this.setState({
              uri: source
            })
          
        }
    });
}
  

  async componentDidMount() {
    var that = this
    firebase.database().ref('Trails/').on('value', function (snapshot) {
      var returnArray = [];
      snapshot.forEach(function (snap) {
        var item = snap.val();
        if (globalUserID.includes(item.userId)) {
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
        if (globalUserID.includes(snap.key)) {

          that.setState({
            userfirstname: item2.firstname,
            userlastname: item2.lastname,
            imageuri: item2.imageuri,
            userteam: item2.team,
            userage: item2.age,
            usergender: item2.gender,
            userUsername: item2.username,
            userPassword: item2.password,
            userConfirmPassword: item2.confirmpassword,
            userkey: snap.key
          })

        }
      });
      // that.setState({ userdata: returnArray })
    });

  }
  UpdateUserProfile() {
    const { userfirstname, userlastname, uri, userteam, usergender, userUsername, userPassword, userkey } = this.state;


    uploadImage(uri).then(url => this.setState({ 
      // showme: true,
      // showme2: true,
      // Description: '',
      // Contact: '',
      // PickerSumbong: 'ye'

    }))


    storeReference(url)

    // firebase.database().ref('Users/' + userkey).update({
    //   firstname: userfirstname,
    //   lastname: userlastname,
    //   team: userteam,
    //   gender: usergender,
    //   username: userUsername,
    //   password: userPassword,
    //   confirmPassword: userPassword,
    //   imageuri: downloadUrl,
    // });
    // alert('Updated Successfully')
    // this.setState({ isModalVisible2: false })

  }

  



  UpdateProfile() {
    const { firstname, lastname, activity, description, trailAddress, difficulty, trailTitle, type, key } = this.state;

    console.log(firstname + '    ' + key);
    firebase.database().ref('Trails/' + key).update({
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

          <View style={styles.avatarCont}>
            <View style={styles.imgExtraLargeContainer}>
              <Image style={styles.profileimage} source={{ uri: this.state.imageuri }} />
            </View>
            <TouchableOpacity style={styles.editButton2} onPress={() => this.showModal2()}>
              <MaterialCommunityIcons name="pencil" size={12} style={styles.socialIcon} />
            </TouchableOpacity>

          </View>
          <View style={styles.body}>
            <View style={styles.bodyContent}>
              <Text style={styles.name}>{this.state.userfirstname + ' ' + this.state.userlastname} </Text>
              <Text style={styles.info}>{this.state.userteam}  </Text>
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
                        <Thumbnail source={{ uri: item.userimageuri }} style={{ height: 40, width: 40, borderRadius: 40 / 2 }} />
                        <Body>
                          <Text style={styles.textMedium}>{item.firstname} {item.lastname}</Text>
                          <Text style={styles.textSmall}>{date = new Date(item.timestamp).toLocaleDateString("en-US")}</Text>
                        </Body>
                      </Left>
                      <Right style={{ width: 20, marginTop: -20, marginRight: -15 }}>
                        <Button transparent textStyle={{ color: '#87838B' }}>
                          {/* <Icon name="logo-github" /> */}
                          <TouchableOpacity onPress={() => this.showModal(item.firstname, item.lastname, item.timestamp, item.userimageuri, item.activity, item.trailAddress, item.description, item.difficulty, item.trailTitle, item.type, item.key)} ><Text>Edit</Text></TouchableOpacity>
                        </Button>
                      </Right>
                    </CardItem>

                    <CardItem cardBody>
                      <Image source={{ uri: item.mapImage }} style={{ height: 200, width: null, flex: 1, marginLeft: 8, marginRight: 8 }} />
                    </CardItem>

                    <CardItem >
                      <Left style={{ marginLeft: -10 }} >
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

          <Modal
            testID={'modal'}
            isVisible={this.state.isModalVisible2}
            onSwipeComplete={this.close}
            swipeDirection={['up', 'left', 'right', 'down']}
            style={styles.view}>
            <View style={styles.content}>
              <View style={{ position: "absolute", top: 10, right: 10, zIndex: 50, }}>
                <TouchableOpacity onPress={() => this.setState({ isModalVisible2: false })} >
                  <Icon name="close" />
                </TouchableOpacity>
              </View>
              <Content>

              <TouchableOpacity onPress={() => this.imagePickerHandler()} >
                  <Icon name="close" />
                </TouchableOpacity>

                <CardItem>
                  <Body>
                    <View style={styles.cont}>
                      <View style={styles.avatarCont}>
                        <View style={styles.imgExtraLargeContainer}>
 
                         {this.state.uri == '' ? <Image style={styles.profileimage} source={{ uri: this.state.imageuri }}/> : <Image style={styles.profileimage} source={this.state.uri} />   }
                        {/* <Image style={styles.profileimage} source={this.state.uri} />  showpicker */}
                          {/* <Image style={styles.profileimage} source={{ uri: this.state.userimageuri }} /> from api */}
                        </View>
                      </View>

                    </View>


                    {/* Firstname */}
                    <Text style={styles.textview}> Firstname </Text>
                    <TextInput style={styles.inputBox}
                      underlineColorAndroid='a9a9a9'
                      placeholder="Firstname"
                      placeholderTextColor="#a9a9a9"
                      autoCorrect={false}
                      autoCapitalize="none"
                      ref={'text6'}
                      value={this.state.userfirstname}
                      onChangeText={userfirstname => this.setState({ userfirstname })}
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
                      value={this.state.userlastname}
                      onChangeText={userlastname => this.setState({ userlastname })}
                    />


                    {/* Trail Address */}
                    <Text style={styles.textview}> Age </Text>
                    <TextInput style={styles.inputBox}
                      underlineColorAndroid='a9a9a9'
                      placeholder="Age"
                      placeholderTextColor="#a9a9a9"
                      autoCorrect={false}
                      autoCapitalize="none"
                      ref={'text6'}
                      value={this.state.userage}
                      onChangeText={userage => this.setState({ userage })}
                    />

                    {/* Difficulty */}
                    <Text style={styles.textview}> Username </Text>
                    <TextInput style={styles.inputBox}
                      underlineColorAndroid='a9a9a9'
                      placeholder="Username"
                      placeholderTextColor="#a9a9a9"
                      autoCorrect={false}
                      autoCapitalize="none"
                      ref={'text6'}
                      value={this.state.userUsername}
                      onChangeText={userUsername => this.setState({ userUsername })}
                    />

                    {/* Type */}
                    <Text style={styles.textview}> Password </Text>
                    <TextInput style={styles.inputBox}
                      underlineColorAndroid='a9a9a9'
                      placeholder="Password"
                      placeholderTextColor="#a9a9a9"
                      autoCorrect={false}
                      autoCapitalize="none"
                      ref={'text6'}
                      value={this.state.userPassword}
                      onChangeText={userPassword => this.setState({ userPassword })}
                    />

                    <Text style={styles.textview}>Gender</Text>
                    <Picker
                      // mode='dropdown'
                      selectedValue={this.state.usergender}
                      style={styles.inputBox}
                      itemStyle={{ fontSize: 8 }}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({
                          usergender: itemValue
                        })
                      }>
                      <Picker.Item label="Select Gender" value="n/a" />
                      <Picker.Item label="Female" value="Female" />
                      <Picker.Item label="Male" value="Male" />
                    </Picker>


                  </Body>
                </CardItem>

                <FlatList
                  data={this.state.images}
                  style={{ flex: 1 }}
                  renderItem={this.renderRow}
                  numColumns={5}>

                </FlatList>
              </Content>

              <Button style={styles.button} onPress={() => this.UpdateUserProfile()}><Text> UPDATE </Text></Button>
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
    marginTop: 130,

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

  cont: {
    flex: 1,
    justifyContent: "center"
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
  },
  socialIcon: {
    justifyContent: "center"
  },
  avatarCont: {
    justifyContent: "center",
    marginTop: '3%',
    flexDirection: 'row',
    backgroundColor: 'red'
  },
  imgExtraLargeContainer: {
    height: 130,
    width: 130,
    borderRadius: 90 / 2,
    overflow: 'hidden',
    marginTop: -80,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",

  },
  profileimage: {
    // flex: 1,
    // width: null,
    // height: null
    width: 130,
    height: 130,
    alignSelf: 'center',
    position: 'absolute',
  },
  editButton2: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
    backgroundColor: '#ffffff',
    position: 'absolute',
    left: 220,
    bottom: 0,
    shadowColor: '#000',
    elevation: 1,
  },




});
