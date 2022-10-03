import React, {useState, useEffect, useContext} from "react";
import {useParams} from 'react-router-dom'
import {GlobalState} from '../../../GlobalState'

function OrderDetail() {
    const state = useContext(GlobalState)
    const [history] = state.userAPI.history
    const [orderDetail, setOrderDetail] = useState([])

    const params = useParams()

    useEffect(() => {
        if(params.id){
            history.forEach(item => {
                if(item._id === params.id) setOrderDetail(item)
            })
        }
    }, [params.id, history])
    
    if(orderDetail.length === 0) return null;

    return (
        <div className="history-page">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Postal Code</th>
                        <th>Country Code</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{orderDetail.address.name.full_name}</td>
                        <td>{orderDetail.address.address.address_line_1 + " - " + orderDetail.address.address.admin_area_1}</td>
                        <td>{orderDetail.address.address.postal_code}</td>
                        <td>{orderDetail.address.address.country_code}</td>

                    </tr>
                </tbody>
            </table>

            <table style={{margin: "30px 0px"}}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Products</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orderDetail.cart.map(item => (

                            <tr key={item._id}>
                                <td><img src={item.images[0].url} alt=""/></td>
                                <td>{item.title}</td>
                                <td>{item.quantity}</td>
                                <td>$ {item.price * item.quantity}</td>

                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default OrderDetail