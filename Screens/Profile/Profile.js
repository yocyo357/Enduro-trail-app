import React, { Component } from 'react';
import {
  StyleSheet,

  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList



} from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';


// Race Title, Date Posted, Race Description (info., location, reace difficulty, race category)
const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
    Description: 'A race is a grouping of humans based on shared physical or social qualities into categories generally viewed as distinct by society',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
    Description: 'A race is a grouping of humans based on shared physical or social qualities into categories generally viewed as distinct by society',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
    Description: 'A race is a grouping of humans based on shared physical or social qualities into categories generally viewed as distinct by society',
  },
];

function Item({ title,Description}) {
  return (
    <View style={{ margin: 25 }}>
      <Content>
        <Card style={{ flex: 0 }}>
          <CardItem>
            <Left>
              <Thumbnail source={{ uri: 'https://reactjs.org/logo-og.png' }} />
              <Body>
                <Text>{title}</Text>
                <Text note>April 15, 2016</Text>
              </Body>
            </Left>
          </CardItem>

          <CardItem>
            <Left>
              <Body>
                
                <Text>{title}</Text>
                <Text note>{Description}</Text>
              </Body>
            </Left>
          </CardItem>

          <CardItem>
            <Left>
              <Body>
                
                <Text>{title}</Text>
                <Text note>{Description}</Text>
              </Body>
            </Left>
          </CardItem>
          
          <CardItem cardBody>
            <Image source={{ uri: 'https://reactjs.org/logo-og.png' }} style={{ height: 200, width: null, flex: 1, marginLeft: 15, marginRight: 15 }} />

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
            <Right>
              <Button transparent textStyle={{ color: '#87838B' }}>
                <Icon name="logo-github" />
                <Text>View</Text>
              </Button>
            </Right>
          </CardItem>
 
        </Card>
      </Content>


    </View>


  );
}
export default class Profile extends Component {


  render() {



    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.header}></View>
          <Image style={styles.avatar} source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }} />
          <View style={styles.body}>
            <View style={styles.bodyContent}>
              <Text style={styles.name}>John Doe</Text>
              <Text style={styles.info}>UX Designer / Mobile developer</Text>
              <Text style={styles.description}>Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum electram expetendis, omittam deseruisse consequuntur ius an,</Text>



            </View>
          </View>

          <View style={styles.bodyContent}>

            <TouchableOpacity style={styles.buttonContainer}>
              <Text>Opcion 1</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={DATA}
            renderItem={({ item }) => <Item title={item.title} Description={item.Description} />}
            keyExtractor={item => item.id}
          />


        </ScrollView>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#00BFFF",
    height: 200,
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
});
