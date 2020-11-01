import React, {Component,Fragment} from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal'

import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import {
    getFromStorage,
    setInStorage,
  } from '../../utils/storage';

export default class ProductsOffered extends Component{

    constructor(props){

        super(props);
        
        this.state={

            data: [],
            farmer_data : [],
            showForm:false,

        }

    }
   
    componentDidMount() {

            const product = this.props.location.data.name
           

            
            
            axios.get('http://localhost:5000/farmer/option/'+product)
            .then( res => 
                {
                    this.setState(
                        {
                                data : res.data
                        }
                    )
              console.log(this.state.data)
                    
                }
            )
          
            
            axios.get('http://localhost:5000/farmer/farmer-details/'+this.state.data.farmer_id)
            .then(
                res => 
                {
                    this.setState(
                        {
                                farmer_data : res.data
                        }
                    )
                    // data = res.data
                   
                }
            )

            }
            


            // axios.get('http://localhost:5000/farmer/farmer-details/'+farmer_id)
            // .then( res => console.log(res))

            showDetails = (id) => {

                
                console.log(id)
                axios.get('http://localhost:5000/farmer/farmer-details/'+id)
            .then(
                res => 
                {
                    const data = res.data
                    this.setState(
                        {
                                farmer_data :data
                        }
                    )
                  
                   
                    console.log('Farmer Data New-> ',this.state.farmer_data)
                    this.setState({ showForm: true })
                    
                }
            )
            // .then(
             
            //         
               
            // )
            

            }
              
            showform = () => {
                return (
                    <Modal.Dialog>
        
                        <Modal.Header>
                            <Modal.Title>Farmer Details</Modal.Title>
                        </Modal.Header>
        
                        <Modal.Body>
                            <div>Name :{this.state.farmer_data[0].name}</div>
                            <div>Location: {this.state.farmer_data[0].location}</div>
                        </Modal.Body>
        
                        <Modal.Footer>
                            <button variant="secondary" onClick={()=>this.setState({ showForm: false })}>Close</button>
                        </Modal.Footer>
        
                    </Modal.Dialog>
                  );
              }
      

    render(){
        return(
            
            <div className="row" style={{padding:"30px"}}>
                Test
                <ul className="products">
                    { this.state.data.length ?

                        <div>
                            { 
                                this.state.data.map((u)=> (
                                
                                <div className="col-md-3">
                                    <div className="card" style={{width:'18rem','margin-top':'20px'}}>
                                        
                                        <div> Name: {u.name}</div>
                                        <div>Price : {u.price}</div>
                                        <div> Available Quantity: {u.available_quantity}</div>
                                       

                                        
                                        <button onClick={()=>this.showDetails(u.farmer_id)}>
                                            View farmer Details 
                                        </button>
                                        {/* Add to cart comes here connection left */}
                                        <button>
                                            Add to cart
                                        </button>
                                    </div>
                                
                                </div>))
                                 
                            }
                           
                        </div>
                        : 
                        <div>No Sellers available</div>
                    }
                    
                    {this.state.showForm ? this.showform() : null}
                </ul> 
               
            </div>
           
                );
    }

}
