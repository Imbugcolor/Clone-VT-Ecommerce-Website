import React from 'react'
import BtnRender from './BtnRender'
import Rating from '../Rating/Rating'

function ProductItem({ product, isAdmin }) {
  return (
    <div className="product_card">
        {
          isAdmin && <input type="checkbox" defaultChecked={product.checked}/>
        }
        <img src={product.images[0].url} alt="" />

        <div className="product_box">
            <h2 title={product.title}>{product.title}</h2>
            <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
            />
            <span>${product.price}</span>
            <p>{product.description}</p>
        </div>

        <BtnRender product={product} />
    </div>
  )
}

export default ProductItem