import React, { Component } from 'react'
import * as firebase from 'firebase';
import { config } from '../Firebase/index';

if (!firebase.apps.length) {
    firebase.initializeApp(config())
}

var db = firebase.database().ref('Trails/');
var urlHolder =''

class home extends Component {

    getImage(image_name) {
        const storage = firebase.storage()
        const ref = storage.ref('image/'+image_name);
        const url = ref.getDownloadURL();

        urlHolder.push(url);
        
    }

    componentDidMount() {
        
    }

    render(){
        
        return (
            <div style={{alignItems: 'center'}}>
                <div class="card" style={{width: '70%', marginLeft: '15%', marginRight: '25%'}}>
                    <img src="..." class="card-img-top" alt="..."/>
                    <div class="card-body">
                        <h5 class="card-title">Card title {urlHolder}</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default home;