import React, {useContext, useState, useEffect} from 'react'
import {GlobalState} from '../../../GlobalState'
import {Link} from 'react-router-dom'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from 'axios';

function Cart() {
  const state = useContext(GlobalState)
  const [cart, setCart] = state.userAPI.cart
  const [token] = state.token
  const [callback, setCallback] = state.userAPI.callback
  const [total, setTotal] = useState(0)
  
  useEffect(() => {
    const getTotal = () => {
        const total = cart.reduce((prev, item) => {
          return prev + (item.price * item.quantity)
        }, 0)

        setTotal(total)
    }
    getTotal()
  }, [cart])

  const addToCart = async (cart) => {
    await axios.patch('/user/addcart', {cart}, {
      headers: {Authorization: token}
    })
  }

  const increment = (id) => {
    cart.forEach(item => {
      if(item._id === id) {
        item.quantity += 1
      }
    })
    setCart([...cart])
    addToCart(cart)
  }

  const decrement = (id) => {
    cart.forEach(item => {
      if(item._id === id) {
        item.quantity === 1 ? item.quantity = 1 : item.quantity -= 1
      }
    })
    setCart([...cart])
    addToCart(cart)
  }

  const removeProduct = id => {
    if(window.confirm('Do you want to delete this product?')){
      cart.forEach((item, index) => {
        if(item._id === id){
          item.quantity = 0
          cart.splice(index, 1)
        }
      })
      setCart([...cart])
      addToCart(cart)
      setCallback(!callback)
    }
  }

  if (cart.length === 0) {
    return <h2 style={{textAlign: 'center', fontSize: "5rem"}}>Cart Empty</h2>
  }

  const tranSuccess = async (payment, paymentAddress) => {
    console.log(payment, paymentAddress)
    const paymentID = payment;
    const address = paymentAddress;

    await axios.post('/api/payment', {cart, paymentID, address}, {
      headers: {Authorization: token}
    })

    setCart([])
    addToCart([])
    alert('You have successfully placed an order.')
    setCallback(!callback)
  }

  return (
    <div>
        {
          cart.map(product => (
            <div className="detail cart" key={product._id}>
                <div className='product-images'>
                    <img src={product.images[0].url} alt=""/>
                </div>
                <div className="box-detail">
                    <h2>{product.title}</h2>
                    <h3>$ {product.price * product.quantity}</h3>
                    <p>{product.description}</p>
                    <p>{product.content}</p>

                    <div className="amount">
                      <button onClick={() => decrement(product._id)}>-</button>
                      <span>{product.quantity}</span>
                      <button onClick={() => increment(product._id)}>+</button>
                    </div>

                    <div className="delete" onClick={() => removeProduct(product._id)}>X</div>
                </div>
            </div>
          ))
        }

        <div className="total">
          <h3>Total: $ {total}</h3>
          <PayPalScriptProvider options={{ "client-id": "ATz8xMHfgdxzrY9ko2iXW-0B12F49Of-kwSVcWa4UuJ3VyDUyWOusF0UYfsGDS7LA6qLQXDk4CEWtbtR" }}>
            <PayPalButtons 
            style={{ layout: "horizontal" }}
            createOrder = {(data, actions) => {
              // Set up the transaction
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: cart.reduce((prev, item) => {
                      return prev + (item.price * item.quantity)
                    }, 0)
                  }
                }]
              });
              } 
            }
            
            onApprove = {(data, actions) => {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  tranSuccess(details.id, details.purchase_units[0].shipping)
                });
              } 
            }
            />
          </PayPalScriptProvider>
        </div>
    </div>
  )
}

export default Cart