import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import '../styles/signup.css';



class signup extends Component {
    constructor(props) {
        super(props)

        this.state = {
           fname:''
            
        }
    
    
 
        this.BtnSubmitClicked = (event) => {
            
        }

        this.changeFnameHandler = (event) => {
            console.log(this.setState({fname: event.target.value}));
        }
    }

    render() {
        return (
            <div className="container-fluid signup-MainDiv">
                <div className="row">
                    <div className="col left-col">
                       
                        <h1 className="leftMainTitle">Lorem Ipsum</h1>

                        <h4 className="leftSubWords">
                            <span>Lorem ipsum</span> dolor sit amet, consectetur adipiscing elit. Vivamus pretium ligula in justo malesuada aliquam. Sed a sem non arcu tempus.
                        </h4><br/>

                        <h4 className="leftSubWords">
                            <span>Lorem ipsum</span> dolor sit amet, consectetur adipiscing elit. Vivamus pretium ligula in justo malesuada aliquam. Sed a sem non arcu tempus.
                        </h4>
                    </div>

                    <div className="col right-col">
                        <div className="container-fluid">
                            <h2 className="mainTitle">Create Your New Account</h2>
                            <h4 className="subTitle">In a orci enim. Ut blandit justo in tempor interdum.</h4>
                            <form noValidate autoComplete="off" >
                                <TextField id="txt-SignUpFname" value={this.state.fname} onChange={this.changeFnameHandler}  className="SignUp-inputs" label="First name" />
                                <TextField id="txt-SignUpLname" className="SignUp-inputs" label="Last name" />
                              
                            </form>
                        </div>
                        
                        <div className="container-fluid">
                            <div className="w-100">
                                <TextField id="txt-SignUpUname"  fullWidth className="SignUp-inputs" label="Enter Your Username Here" />
                                <div className="w-100"></div>
                            </div>
                            <form noValidate autoComplete="off" >
                                    <TextField id="txt-SignUpPass"  className="SignUp-inputs" type="password" label="Enter Password" />
                                    <TextField id="txt-SignUpPassConfirm" className="SignUp-inputs" type="password" label="Please Confirm Password" />
                            </form>
                            <div className="w-100"></div>
                            <form noValidate autoComplete="off" >
                                <div className="row SignUpTeamName">
                                    <TextField id="txt-SignUpAge"  className="SignUp-inputs" type="datepicker" label="Birthdate" />  
                                </div>

                                <div className="w-100"></div>

                                <div className="row SignUpAge">
                                    <TextField id="txt-SignUpTeamName"  className="SignUp-inputs" label="Enter Name of Team" />
                                </div>
                            </form>

                            <Button id="btn-submit" fullWidth variant="contained" color="primary" onClick={ (e) => { this.BtnSubmitClicked() }}>
                                Primary
                            </Button><br/>

                            <a href="#" className="link-back">Already have an account?</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}   
    
export default signup;