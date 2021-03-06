import React, {Component,Fragment} from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';

import {
    getFromStorage,
    setInStorage,
  } from '../../utils/storage';

export default class LandingCustomer extends Component{
    constructor(props){
        super(props);
        this.handleChange=this.handleChange.bind(this);

        this.state={
            products:[],
            name:'',
           
        }
    }

    handleChange(product){
        const addedproduct = {
            name:product.name,
            description: product.description,
            price: product.price,
            available_quantity: product.available_quantity,
            date_produced:product.date,
            life: product.life,
        }
        
        axios.post('http://localhost:5000/cart/edit', addedproduct)
        
  
        .then( res => 
            {
                if(res.data)
                {
                    alert("Already in your cart")
                }
                else{
                    alert("Done")
                }
            }
            
            )
        
        
    };

   
    componentDidMount() {

        const userType = getFromStorage("type")
       
        axios.get('http://localhost:5000/stock-product/')
          .then(response => {
            this.setState({ products: response.data })
            console.log(this.state.products)
          })
          .catch((error) => {
            console.log(error);
          })
      }
    render(){
        return(
           
                
            
            <div className="row">
                

                {/* <ul className="products"> */}
                    {this.state.products.map((u)=>(
                        
                    
                    <div className="col-md-3">
                        <div className='customer-landing'>
                          
                            <Link className="customer-link" to={{pathname:'/customer/products-offered',data:{name: u.name,id: u.farmer_id}}}>
                            {u.name}
                            </Link>
                          
                        </div>
                    </div>
                    
                    
                    ))}
     
            </div>
        );
    }

}
