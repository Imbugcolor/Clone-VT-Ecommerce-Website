import React, {useContext, useState, useEffect} from 'react'
import {useParams, Link} from 'react-router-dom'
import {GlobalState} from '../../../GlobalState'
import ProductItem from '../utils/productItem/ProductItem'
import moment from 'moment'
import Rating from '../utils/Rating/Rating'
import axios from 'axios'


function DetailProduct() {
    const params = useParams()
    const state = useContext(GlobalState)
    const [products] = state.productsAPI.products
    const addCart = state.userAPI.addCart
    const [detailProduct, setDetailProduct] = useState([])
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [isLogged] = state.userAPI.isLogged
    const [token] = state.token
    const [callback, setCallback] = state.productsAPI.callback
    useEffect(() => {
        if (params.id) {

            products.forEach(product => {
                if (product._id === params.id) setDetailProduct(product)
            })
        }
    }, [params.id, products])

    const submitReviewHandler = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`/api/products/${params.id}/review`, {rating, comment},{
                headers: {Authorization: token}
            })
            setCallback(!callback)
            alert(res.data.msg)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }
    
    if (detailProduct.length === 0) return null
    return (
        <>
            <div className="detail">
                <div className='product-images'>
                    <img src={detailProduct.images[0].url} alt="" />
                    <div className='other-images'>
                        {
                            detailProduct.images.map(image => {
                                return <img src={image.url} alt="" key={image.public_id} />
                            })
                        }
                    </div>
                </div>
                <div className="box-detail">
                    <div className="row">
                        <h2>{detailProduct.title}</h2>
                        <h6>#id: {detailProduct.product_id}</h6>
                    </div>
                    <Rating value={detailProduct.rating}/>
                    <span>$ {detailProduct.price}</span>
                    <p>{detailProduct.description}</p>
                    <p>{detailProduct.content}</p>
                    <p>Sold: {detailProduct.sold}</p>
                    <Link to="/cart" className="cart" onClick={() => addCart(detailProduct)}>
                        Buy Now
                    </Link>
                </div>
            </div>
            <div className='Reviews'>
                <h6>REVIEWS</h6>
                {
                   detailProduct.reviews.length === 0 && (
                        <p>No Reviews</p>
                   )
                }
                {
                    detailProduct.reviews.map(review => (
                        <div className='review' key={review._id}> 
                            <strong>{review.name}</strong>
                            <Rating value={review.rating}/>
                            <span>{moment(review.createdAt).calendar()}</span>
                            <p>{review.comment}</p>
                        </div>
                    ) )
                }
            </div>
                {isLogged ? (
                    <form className="form" onSubmit={submitReviewHandler}>
                    <div>
                    <h2>Write a customer review</h2>
                    </div>
                    <div>
                    <label htmlFor="rating">Rating</label>
                    <select id="rating" value={rating}
                    onChange={(e) => setRating(e.target.value)}>
                        <option value="">Select</option>
                        <option value="1">1- Bad</option>
                        <option value="2">2- Fair</option>
                        <option value="3">3- Good</option>
                        <option value="4">4- Very good</option>
                        <option value="5">5- Excelent</option>

                    </select>
                    </div>
                    <div>
                    <label htmlFor="comment">Comment</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    </div>
                
                    <div>
                    <label />
                    <button className="primary" type="submit">
                        Submit
                    </button>
                    </div>
                    
                </form>
                    
            ) : (<h4>Please <Link to='/login'
            >sign in</Link>to write a review</h4>)}           
            <div>
                <h2>Related products</h2>
                <div className="products">
                    {
                        products.map((product) => {
                            return product.category === detailProduct.category && product._id !== params.id
                                ? <ProductItem key={product._id} product={product} /> : null
                        })
                    }
                </div>
            </div>
        </>
        
    )
}

export default DetailProduct