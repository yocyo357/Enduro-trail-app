import React, { Component } from "react";
import '../styles/login.css'
import * as firebase from 'firebase';
import Fire from '../config/fire';

var db = firebase.database();
var ref = db.ref('Users/');

class landingPage extends Component {
    constructor(props) {
        super(props);

        this.handleLogin = this.handleLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state ={
            email: '',
            password: '',
           
        }
    }

    handleLogin(e) {
        e.preventDefault();
        Fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
        }).catch((error) => {
            console.log(error);
            alert(error)
        });
    }

    // handleSignUp(e) {
    //     e.preventDefault();
    //     Fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
    //     }).catch((error) => {
    //         console.log(error);
    //     })


    // }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return(
            <div>
                <h1 style={{color: '#618930', fontFamily: 'Poppins', fontSize: '34px', fontWeight: 'bold', marginTop: '2%', marginLeft: '2%'}}>ENDURO-MTB-PH</h1>
                <div class="wrapper fadeInDown">
                    
                    <div id="formContent">
                        <div class="fadeIn first">
                            
                        </div>

                        <form>
                            <div className="form-group">
                                <input type="email" value={this.state.email} onChange={this.handleChange} className="form-control" name='email' id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Your Email" />
                            </div>

                            <div className="form-group">
                                <input type="password" className="form-control" onChange={this.handleChange} name='password' id="exampleInputPassword1" placeholder="Password" />
                            </div>

                            <button type="submit" onClick={this.handleLogin} className="btn button-login">Login</button>&nbsp;
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default landingPage;