import React, { Component } from 'react';
import 'whatwg-fetch';
import axios from 'axios'
import { Link } from 'react-router-dom';
import  { Redirect } from 'react-router-dom'
//http://localhost:5000/api/signup
import {
  getFromStorage,
  setInStorage,
} from '../../utils/storage';

class FarmerSignup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      token: '',
      signUpError: '',
      signUpEmail: '',
      signUpPassword: '',
      signUpFirstName:'',
      signUpLastName:'',
      location:''
    };

    
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
    this.onTextboxChangeSignUpFirstName = this.onTextboxChangeSignUpFirstName.bind(this);
    this.onTextboxChangeSignUpLastName = this.onTextboxChangeSignUpLastName.bind(this);
    this.onTextboxChangeLocation = this.onTextboxChangeLocation.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.logout = this.logout.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
  }

  componentDidMount() {
    
    const obj = getFromStorage('the_main_app');
    console.log("Test",obj)

    const email = getFromStorage('email')
    console.log("Email",email)

    if (obj && obj.token) {
      const { token } = obj;
      // Verify token
      fetch('http://localhost:5000/farmer-signup/api/account/farmerverify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  

  onTextboxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value,
    });
  }

  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value,
    });
  }

  onTextboxChangeSignUpFirstName(event) {
    this.setState({
      signUpFirstName: event.target.value,
    });
  }

  onTextboxChangeSignUpLastName(event) {
    this.setState({
      signUpLastName: event.target.value,
    });
  }

  onTextboxChangeLocation(event) {
    this.setState({
     location: event.target.value,
    });
  }

  onSignUp() {

    // Grab state
    // window.location.reload()
    const {
      signUpEmail,
      signUpPassword,
      signUpFirstName,
      signUpLastName,
      location
    } = this.state;
    // const signup = {
    //     signUpEmail=this.signUpEmail,
    //     signUpPassword=this.signUpPassword,
    //     signUpFirstName=this.signUpFirstName,
    //     signUpLastName=this.signUpLastName,
    // }
     
    this.setState({
      isLoading: true,
    });
    
    // setInStorage("type",this.state.userType)
  
    fetch('http://localhost:5000/farmer-signup/api/account/farmersignup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signUpEmail,
        password: signUpPassword,
        firstName: signUpFirstName,
        lastName: signUpLastName,
        location:location
        
      }),
    })
    .then(res => res.json())
      .then(json => {
        console.log('json', json);
        if (json.success) {
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpEmail: '',
            signUpPassword: '',
            signUpFirstName: '',
            signUpLastName: '',
            location:''
          }); 
          this.props.history.push('/farmer-signin')
        } else {
          this.setState({
            signUpError: json.message,
            isLoading: false,
          });
        }
      });
  }

  onSignIn() {
    // Grab state
    const {
      signInEmail,
      signInPassword,
    } = this.state;

    this.setState({
      isLoading: true,
    });
    
    // Post request to backend
    fetch('http://localhost:5000/farmer-signup/api/account/farmersignin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
      }),
    }).then(res => res.json())
      .then(json => {
        console.log('json', json);
        if (json.success) {
          setInStorage('the_main_app', { token: json.token });
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInPassword: '',
            signInEmail: '',
            token: json.token,
          });
        } else {
          this.setState({
            signInError: json.message,
            isLoading: false,
          });
        }
      });
  }

  logout() {
    this.setState({
      isLoading: true,
    });

    setInStorage("email",{})

    const obj = getFromStorage('the_main_app');

    if (obj && obj.token) {
      const { token } = obj;

      // Verify token
      fetch('http://localhost:5000/farmer-signup/api/account/farmerlogout?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token: '',
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  render() {
    const {
      isLoading,
      token,
      signUpFirstName,
      signUpLastName,
      signUpEmail,
      location,
      signUpPassword,
      signUpError,
    } = this.state;

    if (isLoading) {
      return (<div><p>Loading...</p></div>);
    }

    if (!token) {
      return (
        <div>
          
          <div>
            {
              (signUpError) ? (
                <p>{signUpError}</p>
              ) : (null)
            }
            <h1 style={{textAlign:'center',paddingTop:"10px"}}>Farmer Register</h1>
            <input style={{marginLeft:'25%' ,width: '50%',paddingLeft:"10px",borderRadius:"10px"}}
              type="text"
              placeholder="First Name"
              value={signUpFirstName}
              onChange={this.onTextboxChangeSignUpFirstName}
            />
            <br />
            <input style={{marginLeft:'25%' ,width: '50%',paddingLeft:"10px",borderRadius:"10px"}}
              type="text"
              placeholder="Last Name"
              value={signUpLastName}
              onChange={this.onTextboxChangeSignUpLastName}
            />
            <br />
            <input style={{marginLeft:'25%' ,width: '50%',paddingLeft:"10px",borderRadius:"10px"}}
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={this.onTextboxChangeSignUpEmail}
            /><br />
            <input style={{marginLeft:'25%' ,width: '50%',paddingLeft:"10px",borderRadius:"10px"}}
              type="text"
              placeholder="Location"
              value={location}
              onChange={this.onTextboxChangeLocation}
            /><br />
            <input style={{marginLeft:'25%' ,width: '50%',paddingLeft:"10px",borderRadius:"10px"}}
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={this.onTextboxChangeSignUpPassword}
            /><br />
            <div className="row" style={{display:"flex", justifyContent:"center",paddingLeft:"10px",borderRadius:"10px"}}>
            <div style={{justifyContent:'space-around'}}>
            <Link style={{color:'whitesmoke',textDecoration:'none'}} to="/farmer">
            <button className='card_button-green' onClick={this.onSignUp}>Register</button>
            </Link>
            <h5 style={{textAlign:"center"}}>Already registered ?</h5>
            <button style={{borderRadius:'5px'}} className='card_button-red'>
              <Link style={{color:'whitesmoke',textDecoration:'none'}} to="/farmer-signin">Signin</Link>
            </button></div></div>
          
          </div>

        </div>
      );
    }
    return (
      <Redirect to='/farmer-signin'  />
    );

    
  }
}

export default FarmerSignup;