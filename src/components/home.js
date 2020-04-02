import React, { Component } from 'react'
import * as firebase from 'firebase';
import { FaPlus } from 'react-icons/fa';
import { AiOutlineEnter } from 'react-icons/ai';
import { config } from '../Firebase/index';
import PostBox from './postraces';
import '../styles/home.css';

if (!firebase.apps.length) {
    firebase.initializeApp(config())
}

var db = firebase.database();
var ref = db.ref('post_races/').orderByChild('datePosted');




                        

class home extends Component {

    constructor(props) {
        super(props)
        this.state = {
            myimage: '',
            url: '',
            trailValues: [],
            rankingEventTitle: '',
            rankingEventDatePosted: '',
            rankingMaxSeries: '1',
            trailID: [],
            trailAdd: ''

        }

        // this.setState({trailID: })

    }

    componentDidMount() {
        ref.on('value', snapshot => {
            let Datas = { ...snapshot.val() }
            this.setState({ trailValues: Datas })
        })
       



        // var ID = this.state.trailID
        // var trailRef = trailAdd.ref('Trails').child(ID)

        // trailRef.on('value', gotData, errData)

        function gotData(data) {
            console.log(data.val().trailTitle)
        }

        function errData(err) {
            console.log(err)
        }

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

    handleSpecificEvent(eventTitle, datePosted, numOfSeries, trailIDs) {
        this.setState({
            rankingEventTitle: eventTitle,
            rankingEventDatePosted: datePosted,
            rankingMaxSeries: numOfSeries,
            // trailID: trailIDs
           
        })
        
        var trailRef = db.ref('Trails/').orderByChild(trailIDs);
        trailRef.on('value', snapshot => {
            // let trailData = { snapshot.val() }
   
        })

       

    }

    render() {
        return (

            <div style={{ paddingTop: '4%', paddingBottom: '4%' }}>
                <div className='row' style={{width: '100%', paddingLeft: '2%', paddingRight: '2%'}}>
                    <div className='col col-sm-9' >
                        <h2 style={{ fontFamily: 'Poppins' }}>Event List</h2>
                        <div style={{ alignItems: 'center' }}>
                            {Object.keys(this.state.trailValues).map(igKey => {
                                return (
                                    <div className="card" style={{ width: '100%', marginTop: '1.5%', marginBottom: '1.5%' }}>

                                        <div className="card-body" style={{ backgroundColor: '#343A40', borderRadius: '5px' }}>
                                            <h5 className="card-title" style={{ color: 'white' }}>{this.state.trailValues[igKey].raceTitle}</h5>
                                            <p style={{ color: '#6F747C', fontFamily: 'Poppins', fontSize: '14px', marginTop: '-2%' }}>Posted on {this.state.trailValues[igKey].datePosted}</p>
                                            <p style={{ color: 'white', fontFamily: 'Poppins', fontSize: '14px', marginTop: '-2%' }}>When: <span style={{color: '#6F747C', fontFamily: 'Poppins'}}>{this.state.trailValues[igKey].eventDate}</span></p>
                                            <p style={{ color: 'white', fontFamily: 'Poppins', fontSize: '14px', marginTop: '-2%' }}>Where: <span style={{color: '#6F747C'}}>{this.state.trailAdd}</span></p>
                                            <p className="card-text" style={{ color: 'white' }}>{this.state.trailValues[igKey].raceInfo}</p>
                                            <img src={this.state.trailValues[igKey].imageURL} className="card-img-top" alt="..." style={{ width: '100%', marginBottom: '1.5%' }} />
                                            <a href="#" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalScrollable2" style={{ backgroundColor: '#618930', borderColor: '#618930', float: 'right' }} onClick={() => this.handleSpecificEvent(this.state.trailValues[igKey].raceTitle, this.state.trailValues[igKey].datePosted, this.state.trailValues[igKey].raceNoOfStages, this.state.trailValues[igKey].trailID)}>Add Event Results</a>
                                        </div>
                                    </div>
                                )
                            })}

                            <a href="#" className="float float-tooltip" data-toggle="modal" data-target="#exampleModalScrollable1" style={{zIndex: '1'}}>
                                <FaPlus className="fa fa-plus my-float " style={{ width: '40px' }} />
                            </a>
                        </div>
                    </div>

                    <div className='col col-sm-3' style={{backgroundColor: '#343A40', zIndex: '0', width: '60%'}}>
                            <h3>Appoved Trails</h3>


                    </div>
                </div>

                

                {/* New Scream Modal Area */}
                <div className="modal fade homeModalContainer" id="exampleModalScrollable1" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
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

                {/* New Ranking Modal Area */}
                <div className="modal fade homeModalContainer" style={{ width: '50%', marginLeft: '25%' }} id="exampleModalScrollable2" tabindex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable" role="document">
                        <div className="modal-content modal-content-home">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalScrollableTitle">{this.state.rankingEventTitle}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body home-modal-body">
                                <form style={{paddingLeft: '10.5%', paddingRight: '3%'}}>
                                    <div className="row" style={{width: '100%'}}>
                                    <label>Player Name: </label>
                                        <select className="form-control" id="exampleFormControlSelect1" onChange={this.handleRanking}   >
                                            <option>Under 20</option>
                                            {/* <option>{this.state.rankingMaxSeries}</option> */}
                                        </select>
                                    </div>

                                    <div className="row" style={{marginTop: '4%'}}>
                                        <label>Series: </label>     &nbsp;
                                        <input type='number' min='1' max={this.state.rankingMaxSeries} style={{width: '70%'}}/>
                                    </div>

                                    <div className="row" style={{marginTop: '4%'}}>
                                        <label>Score: </label> &nbsp;
                                        <input type='number' min='10' max='100' style={{width: '70%'}} />
                                    </div>

                                    <div className="row" style={{marginTop: '4%'}}>
                                        <button className='btn button-Enter' style={{backgroundColor: '#618930', color: 'white', width: '90%'}}><span className='buttons'><AiOutlineEnter /> Enter</span></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default home;