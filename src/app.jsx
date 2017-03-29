import * as React from "react";
import * as ReactDOM from "react-dom";
var products = require('./products.json');
var _ = require("lodash-node");
var EventEmitter = require("events").EventEmitter;

var eventer = new EventEmitter();

var product = React.createClass({
    addToCart(){
        eventer.emit("CartItemAdded",null, this.props.product.id);
    },
    render(){
        return(
            <div className="row">
                <div className="small-4 columns">
                    <strong>{this.props.product.productName}</strong> : {"$"+this.props.product.price}
                </div>
                <div className="small-5 columns">
                    <button className="small" onClick={this.addToCart()}>Add To Cart</button>
                </div>
            </div>
        );
    }
});

var ProductList = React.createClass({
    getInitialState(){
        return{
            products:product
        }
    },
    render(){
        var products = this.state.products.map(function renderProduct(p) {
            return <Product key={p.id} product={p} />;
        });

        return(<div>
            <h3>Products</h3>
            {products}
        </div>);
    }
});

function calculateCartItemTotal(price, quantity){
    return price*quantity;
}

var cartItem = React.createClass({
    render(){
        return(
            <div>
                <strong>{this.props.itemName}</strong> x {this.props.quantity}{ String.fromCharCode(8212) } { calculateCartItemTotal(this.props.price, this.props.quantity).toFixed(2) }
            </div>
        );
    }
});

var Cart = React.createClass({
   getInitialState(){
       return {
           cartItems:[]
       }
   },
    componentWillMount(){
        eventer.on("CartItemAdded", function productAddedToCart(e, productId) {
            this.updateCart(productId);
        }.bind(this));
    },
    updateCart(productId){
        var product = _.find(products, function(p) {
            return p.id == productId;
        });
        var cartItems = this.state.cartItems;

        var cartItemQuantity = _.where(cartItems, { 'productId': productId }).length;

        if(cartItemQuantity == 0) {
            cartItems.push({
                productId: product.id,
                name: product.productName,
                price: product.price,
                quantity: 1
            });
        } else {
            var existingCartItem =_.find(cartItems, function findCartItem(cartItem) {
                return cartItem.productId == productId;
            });
            existingCartItem.quantity += 1;
        }

        this.setState({cartItems: cartItems});
    },
    calculateTotal: function() {
        function addLineItemTotal(total, lineItem) {
            return total += calculateCartItemTotal(lineItem.price, lineItem.quantity);
        }
        return _.reduce(this.state.cartItems, addLineItemTotal, 0);
    },
    render: function() {
        var cartItems = this.state.cartItems.map(function renderCartItem(cartItem) {
            return <CartItem key={cartItem.name} itemName={cartItem.name} quantity={cartItem.quantity} price={cartItem.price} />
        });

        return (
            <div>
                <h3>Shopping Cart</h3>
                { cartItems.length == 0 ? "Your cart is empty" : cartItems }
                <hr />
                <div className="right"><strong>Total:</strong> { "$" + this.calculateTotal().toFixed(2) }</div>
            </div>
        );

    }

});
//
// class App extends React.Component{
//
//     render(){ return(<div>
//             <h1>Hello World Using React !</h1>
//         </div>
//     );
//     }
// }


ReactDOM.render(<ProductList />, document.getElementById("product-list"));
ReactDOM.render(<Cart />, document.getElementById("shopping-cart"));