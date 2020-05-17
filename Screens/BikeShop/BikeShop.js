
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Linking
} from 'react-native';
import MapView, { Marker, Polyline, AnimatedRegion, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Fab } from 'native-base';
import firebase from 'firebase'
const origin = { latitude: 37.3318456, longitude: -122.0296002 };
const destination = { latitude: 37.771707, longitude: -122.4053769 };
const GOOGLE_MAPS_APIKEY = 'AIzaSyANqV6leq3SUf6UTIlNQiPEoNAMPU5yAgA';
import haversine from "haversine";
Geocoder.init("AIzaSyANqV6leq3SUf6UTIlNQiPEoNAMPU5yAgA")

if (!firebase.apps.length) {
    firebase.initializeApp(config())
}
class BikeShop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude: null,
            longitude: null,
            deslongitude: null,
            deslatitude: null,
            bikeshops: [],
            active: false,
            showDirection: false,
            duration:'',
            distance:'',
            fblink:''
        };
    }
    // watchID: ?number = null;
    componentDidMount() {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
            .then(data => {
                // The user has accepted to enable the location services
                // data can be :
                //  - "already-enabled" if the location services has been already enabled
                //  - "enabled" if user has clicked on OK button in the popup
            }).catch(err => {
                // The user has not accepted to enable the location services or something went wrong during the process
                // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
                // codes : 
                //  - ERR00 : The user has clicked on Cancel button in the popup
                //  - ERR01 : If the Settings change are unavailable
                //  - ERR02 : If the popup has failed to open
                alert(err)
            });
        firebase.database().ref('BikeShops/-M4bMelCLPF-2lfm_jmT').once('value', snapshot => {
            this.setState({ bikeshops: snapshot.val() })
            // console.log(snapshot.val().length)
        })

        Geolocation.getCurrentPosition(
            position => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            error => Alert.alert('Error', JSON.stringify(error)),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );
        Geolocation.watchPosition(position => {
            this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
        },error => console.log(error),
        {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000,
            distanceFilter: 10
        });
    }
    onMarkerPress(marker) {
        // alert(marker.longitude+" "+marker.latitude)
        this.setState({
            deslongitude: marker.longitude,
            deslatitude: marker.latitude,
            showDirection: true,
            fblink: marker.fblink
        })
    }
    calcDistance(marker) {
        const end ={
            latitude:marker.latitude,
            longitude:marker.longitude
        }
        const start = {
            latitude:this.state.latitude,
            longitude:this.state.longitude
        }
        // console.log((this.state.distanceTravelled) + haversine(newLatLng, prevLatLng, { unit: 'mile' }) || 0)
        return haversine(start, end).toFixed(2)+" miles";
    };
    openLink() {
        Linking.canOpenURL(this.state.fblink).then(supported => {
          if (supported) {
            Linking.openURL(this.state.fblink);
          } else {
            console.log("Don't know how to open URI: " + this.props.url);
          }
        });
      };
    render() {
        return (
            <View style={styles.container}>
                {this.state.latitude != null && this.state.longitude != null &&
                    <MapView
                        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                        style={styles.map}
                        showsUserLocation
                        followsUserLocation
                        loadingEnabled
                        initialRegion={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}>
                        {this.state.showDirection &&
                            <MapViewDirections
                                origin={{
                                    latitude: this.state.latitude,
                                    longitude: this.state.longitude
                                }}
                                destination={{
                                    latitude: this.state.deslatitude,
                                    longitude: this.state.deslongitude
                                }}
                                optimizeWaypoints={true}
                                apikey={GOOGLE_MAPS_APIKEY}
                                strokeWidth={3}
                                strokeColor="hotpink"
                            />
                        }
                        {this.state.bikeshops.map(marker => {
                            return (
                                <Marker onPress={() => this.onMarkerPress(marker)}
                                    coordinate={{
                                        latitude: marker.latitude,
                                        longitude: marker.longitude,
                                    }}
                                    title={marker.storename}
                                    description={this.calcDistance(marker)}
                                />
                            )
                        })}
                    </MapView>
                }
                {this.state.showDirection &&
                    <Fab
                        active={this.state.active}
                        direction="up"
                        style={{ backgroundColor: '#3B5998' }}
                        position="bottomRight"
                        onPress={() => this.openLink()}>
                        <Icon name="logo-facebook" />
                    </Fab>
                }
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
})
export default BikeShop