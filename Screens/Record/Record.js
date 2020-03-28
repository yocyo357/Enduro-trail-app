
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    PermissionsAndroid,
    Platform,
    Image
} from 'react-native';
import { Container, Header, Content, Button, Text, Icon, Left, Right, Body, Item, Input } from 'native-base';
import MapView, { Marker, Polyline, AnimatedRegion, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import haversine from "haversine";
import { ScrollView } from 'react-native-gesture-handler';
import Geocoder from 'react-native-geocoding';

const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
Geocoder.init("AIzaSyANqV6leq3SUf6UTIlNQiPEoNAMPU5yAgA")
class Record extends Component {
    constructor(props) {
        super(props);
        this.state = {
            latitude: LATITUDE,
            longitude: LONGITUDE,
            routeCoordinates: [],
            distanceTravelled: 0,
            prevLatLng: {},
            coordinate: new AnimatedRegion({
                latitude: LATITUDE,
                longitude: LONGITUDE
            }),
            recording: false,
            recordText: 'RECORD',
            address: '',
        };
    }

    async componentDidMount() {


            Geolocation.watchPosition(position => {
                
        
                const { routeCoordinates, distanceTravelled } = this.state;
                const { latitude, longitude } = position.coords
                const newCoordinate = {
                    latitude,
                    longitude
                }
                this.setState({
                    latitude,
                    longitude,
                    distanceTravelled:
                        distanceTravelled + this.calcDistance(newCoordinate),
                    prevLatLng: newCoordinate
                })
                this.isRecording(routeCoordinates, newCoordinate)
            },
                error => console.log(error),
                {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 1000,
                    distanceFilter: 10
                });


    }
    // componentWillUnmount() {
    //     Geolocation.clearWatch(this.watchID)
    // }


    takeSnapshot() {
        // 'takeSnapshot' takes a config object with the
        // following options

        const snapshot = this.map.takeSnapshot({
            // width: 300,      // optional, when omitted the view-width is used
            // height: 300,     // optional, when omitted the view-height is used
            // region: {
            //     latitude: this.state.latitude,
            //     longitude: this.state.longitude,
            //     latitudeDelta: 0.0922,
            //     longitudeDelta: 0.0421,
            // },    // iOS only, optional region to render
            format: 'jpg',   // image formats: 'png', 'jpg' (default: 'png')
            quality: 0.8,    // image quality: 0..1 (only relevant for jpg, default: 1)
            result: 'file'   // result types: 'file', 'base64' (default: 'file')
        });
        snapshot.then((uri) => {
            this.setState({ mapSnapshot: uri });
        });
    }

    calcDistance = newLatLng => {
        const { prevLatLng } = this.state;
        console.log( (this.state.distanceTravelled)+ haversine(newLatLng,prevLatLng,{unit: 'mile'}) || 0)
        return haversine(prevLatLng, newLatLng) || 0;
    };

    isRecording = (routeCoordinates, newCoordinate) => {
        if (this.state.recording) {
            this.setState({ routeCoordinates: routeCoordinates.concat([newCoordinate]) })
        }
    }

    async geoCode() {
        try {
            Geocoder.from(this.state.routeCoordinates[0].latitude, this.state.routeCoordinates[0].longitude)
                .then(json => {
                    var addressComponent = json.results[0].address_components[0];
                    console.log(addressComponent)
                    this.setState({ address: addressComponent.long_name })
                    return

                })
        } catch (err) {
            alert(err); // TypeError: failed to fetch
        }

    }

    btnOnpress = () => {

        var text = (this.state.recordText == 'RECORD') ? 'STOP' : 'RECORD'
        if (text == 'RECORD') {
            const snapshot = this.map.takeSnapshot({
                // width: 300,      // optional, when omitted the view-width is used
                // height: 300,     // optional, when omitted the view-height is used
                // region: {
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                // },    // iOS only, optional region to render
                format: 'jpg',   // image formats: 'png', 'jpg' (default: 'png')
                quality: 0.8,    // image quality: 0..1 (only relevant for jpg, default: 1)
                result: 'file'   // result types: 'file', 'base64' (default: 'file')
            });
            snapshot.then((uri) => {
                this.setState({ mapSnapshot: uri });


                Geocoder.from(this.state.routeCoordinates[0].latitude, this.state.routeCoordinates[0].longitude)
                .then(json => {
                    var addressComponent = json.results[0].formatted_address;
                    console.log(addressComponent)
                   this.props.navigation.navigate('SaveActivity', { snapshoturi: uri, routeCoordinates: this.state.routeCoordinates, distance: this.state.distanceTravelled, address: addressComponent })
                })

            });


        }
        this.setState({ recordText: text, recording: !this.state.recording })

    }

    render() {
        return (

            <View style={styles.container}>
                <MapView
                    provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.map}
                    showsUserLocation
                    followsUserLocation
                    loadingEnabled
                    ref={map => { this.map = map }}
                    region={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: 0.009,
                        longitudeDelta: 0.009,
                    }}
                >
                    <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />
                </MapView>
                <Button
                    onPress={() => this.btnOnpress()}
                    style={styles.button}><Text>{this.state.recordText}</Text></Button>
                {/* <Button
                    onPress={() => this.geoCode()}
                    style={{position:"absolute",bottom:0}}><Text>{this.state.recordText}</Text></Button> */}
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
    button: {
        position: 'absolute',
        bottom: 500
    }
});
export default Record