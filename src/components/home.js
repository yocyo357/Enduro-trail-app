import React, { Component } from 'react'
import * as firebase from 'firebase';
import { FaPlus } from 'react-icons/fa';
import { config } from '../Firebase/index';
import PostBox from './postraces';
import '../styles/home.css';

if (!firebase.apps.length) {
    firebase.initializeApp(config())
}

var db = firebase.database();
var ref = db.ref('post_races/').orderByChild('datePosted');
var postDatas = [];
var urlHolder = [];

class home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            myimage: '',
            url: '',
            trailValues: [],
        }

    }

    componentDidMount() {
        ref.on('value', snapshot => {
            let Datas = { ...snapshot.val() }
            this.setState({ trailValues: Datas })
        })
        // db.on('value', gotData, this.errData);

        // function gotData(data) {
        //     // console.log(data.val())
        //     postDatas.length = 0;
        //     var posts = data.val()
        //     if(posts != null){
        //         var keys = Object.keys(posts)

        //         for (var i = 0; i < keys.length; i++) {
        //             var k = keys[i]

        //             var postTitle = posts[k].raceTitle
        //             var raceDescription = posts[k].raceInfo
        //             var status = posts[k].status
        //             var newDifficulty = posts[k].difficulty
        //             var newUrl =  posts[k].imageURL
        //             var data = { 
        //                 id: k, 
        //                 raceTitle: postTitle, 
        //                 raceDescription: raceDescription,
        //                 url: newUrl
        //             }
        //             postDatas.push(data)
        //         }

        //     }

        // }
        // alert("URL "+     this.state.url)
    }

    render() {
        return (

            <div style={{ paddingTop: '4%', paddingBottom: '4%' }}>
                <h2 style={{ marginLeft: '24%' }}>Event List</h2>
                <div style={{ alignItems: 'center' }}>
                    {Object.keys(this.state.trailValues).map(igKey => {
                        return (
                            <div className="card" style={{ width: '50%', marginLeft: '24%', marginRight: '25%', marginTop: '1.5%', marginBottom: '1.5%' }}>
                                
                                <div className="card-body" style={{backgroundColor: '#343A40', borderRadius: '5px'}}>
                                    <h5 className="card-title" style={{color: 'white'}}>{this.state.trailValues[igKey].raceTitle}</h5>
                                    <p style={{color: '#6F747C', fontFamily: 'Poppins', fontSize: '14px', marginTop: '-2%'}}>Posted on {this.state.trailValues[igKey].datePosted}</p>
                                    <p className="card-text" style={{color: 'white'}}>{this.state.trailValues[igKey].raceInfo}</p>
                                    <img src={this.state.trailValues[igKey].imageURL} className="card-img-top" alt="..." style={{ width: '100%', marginBottom: '1.5%' }} />
                                    <a href="#" className="btn btn-primary" style={{backgroundColor: '#618930', borderColor: '#618930', float: 'right'}}>Add Event Results</a>
                                </div>
                            </div>
                        )
                    })}

                    <a href="#" className="float float-tooltip" data-toggle="modal" data-target="#exampleModalScrollable">
                        <FaPlus className="fa fa-plus my-float " style={{ width: '40px' }} />
                    </a>
                </div>

                {/* Modal Area */}
                <div className="modal fade homeModalContainer" id="exampleModalScrollable" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable" role="document">
                        <div className="modal-content modal-content-home">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalScrollableTitle">New Scream?</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body home-modal-body">
                                <PostBox />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default home;