import React, {Component,Fragment} from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal'


export default class CartCheckout extends Component{

    constructor(props){

        super(props);

        this.state={
            products:[],
            net_amount:0
        }

    }

    
    componentDidMount() {


        axios.get('http://localhost:5000/cart/')
          .then(response => {
            console.log(response.data)
            this.setState({ products: response.data})
            console.log(this.state.products)
            let net_amount=0;
            for(let i=0;i<this.state.products.length;i++){
              net_amount+=this.state.products[i].price*this.state.products[i].available_quantity
              this.setState({
                net_amount:net_amount
              })
            }
            
            console.log(this.state)
          })
          .catch((error) => {
            console.log(error);
          })

          

      }

      
    render(){
        return(
           <div className="row">
                <ul className="products">
                <div className="col-md-3">
                <div className="card" style={{width:'18rem','margin-top':'20px'}}>
                {this.state.products.map((u)=>(
                <Fragment>
                        <img className="card-img-top" src="..." alt="Card image cap" />
                            <div className="card-body">
                                <div style={{'display':'flex'}}> 
                                    <h5 className="card-title">{u.name}</h5>
                                </div>
                                <p className="card-text">Price: {u.price}</p>
                                <p className="card-text">Quantity Ordered: {u.available_quantity}kg</p>
                                <div>Total product price: {u.price*u.available_quantity}</div>
                               
                            </div>
                </Fragment>
             
                ))}
                <div style={{'textAlign':"center"}}>Net Total:{this.state.net_amount}</div>
                <button>
                   <Link to={{pathname:"/cart/checkout/details", data:{ products:this.state.products, net_amount : this.state.net_amount}}}>Fill Details</Link> 
                </button>
                </div>
                </div>
                
                </ul> 
                
            </div>
           
           
        );
    }

}