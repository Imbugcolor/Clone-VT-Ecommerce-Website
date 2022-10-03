import React, {useContext, useState, useEffect} from 'react'
import {useParams, Link} from 'react-router-dom'
import {GlobalState} from '../../../GlobalState'
import ProductItem from '../utils/productItem/ProductItem'
import moment from 'moment'

function DetailProduct() {
    const params = useParams()
    const state = useContext(GlobalState)
    const [products] = state.productsAPI.products
    const addCart = state.userAPI.addCart
    const [detailProduct, setDetailProduct] = useState([])

    useEffect(() => {
        if (params.id) {

            products.forEach(product => {
                if (product._id === params.id) setDetailProduct(product)
            })
        }
    }, [params.id, products])

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
                            <span>{moment(review.createdAt).calendar()}</span>
                            <p>{review.comment}</p>
                        </div>
                    ) )
                }
            </div>           
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