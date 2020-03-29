import React, { Component } from 'react'
import * as firebase from 'firebase';
import { FaPlus } from 'react-icons/fa';
import { config } from '../Firebase/index';
import PostBox from './postraces';
import '../styles/home.css';

if (!firebase.apps.length) {
    firebase.initializeApp(config())
}

var db = firebase.database().ref('post_races/');
var postDatas= [];
var urlHolder= [];

class home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            myimage: '',
            url: ''
        }

    }

    getImage(image_name) {
        var that = this
        const storage = firebase.storage()
        firebase.storage().ref('images').child('/1').getDownloadURL().then(url => {
            console.log("URL: "+url)

            that.setState({ myimage: url })
             .push(url)
            
        })

// relax

        
    }

    componentDidMount() {
        db.on('value', gotData, this.errData);

        function gotData(data) {
            // console.log(data.val())
            postDatas.length = 0;
            var posts = data.val()
            if(posts != null){
                var keys = Object.keys(posts)

                for (var i = 0; i < keys.length; i++) {
                    var k = keys[i]
    
                    var postTitle = posts[k].raceTitle
                    var raceDescription = posts[k].raceInfo
                    var status = posts[k].status
                    var newDifficulty = posts[k].difficulty
                    var newUrl =  posts[k].imageURL
                    var data = { 
                        id: k, 
                        raceTitle: postTitle, 
                        raceDescription: raceDescription,
                        url: newUrl
                    }
                    postDatas.push(data)
                }
            }

        }
        // alert("URL "+     this.state.url)
    }

    render(){
        return (
           
            <div style={{paddingTop: '4%', paddingBottom: '4%'}}>
                <div style={{alignItems: 'center'}}>
                    {postDatas.map(post => {
                        return(
                            <div className="card" style={{width: '50%', marginLeft: '24%', marginRight: '25%', marginTop: '1.5%', marginBottom: '1.5%'}}>
                                <img src={post.url} className="card-img-top" alt="..." style={{width: '100%'}}/>
                                <div className="card-body">
                                    <h5 className="card-title">{post.raceTitle}</h5>
                                    <p className="card-text">{post.raceDescription}</p>
                                    <a href="#" class="btn btn-primary">Go somewhere</a>
                                    {/* {alert(post.newUrl)} */}
                                    
                                </div>
                            </div>
                        )
                        
                    })}
                    
                    
                    <a href="#" className="float float-tooltip" data-toggle="modal" data-target="#exampleModalScrollable">
                        <FaPlus className="fa fa-plus my-float " style={{width: '40px'}}/>
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