const Products = require('../models/productsModel')

//Filter, sorting and paginating

class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){
        const queryObj = {...this.queryString} //queryString = req.query
        // console.log({before: queryObj}) // before delete params

        const excludedFields = ['page', 'sort', 'limit']
        excludedFields.forEach(el => delete(queryObj[el]))

        // console.log({after: queryObj}) //after delete params

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)
        // lte, gte = less/greater than or equal
        // lt, gt = less/greater than
        // regex = compare ~ string 
        // console.log({queryStr})

        this.query.find(JSON.parse(queryStr))

        return this;
    }
    sorting(){

        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join('')
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        
        return this;
    }
    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const productsCtrl = {
    getProducts: async (req, res) => {
        try {
            const features = new APIfeatures(Products.find(), req.query).filtering().sorting().paginating()
            const products = await features.query

            res.json({
                status: 'success',
                result: products.length,
                products: products
            })
           
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createProduct: async (req, res) => {
        try {
            const {product_id, title, description, content, price, images, category, countInStock} = req.body;
            if(!images) 
                return res.status(400).json({msg: 'No Image uploaded'})
            const product = await Products.findOne({product_id})
            if(product) 
                return res.status(400).json({msg: 'ID product already exists.'})
            
            const newProduct = await Products({
                product_id, title: title.toLowerCase(), description, content, price, images, category, countInStock
            })
            await newProduct.save()
            res.json('Created a product')
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteProduct: async (req, res) => {
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.json('Deleted a product')
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateProduct: async (req, res) => {
        try {
            const {title, description, content, price, images, category, countInStock} = req.body;
            if(!images)
                return res.status(400).json({msg: 'No Image uploaded'})

            await Products.findOneAndUpdate({_id: req.params.id},{
                title: title.toLowerCase(), description, content, price, images, category, countInStock
            })

            res.json('Updated a product')
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    createReview: async (req, res) => {
        try {
            const {rating, comment} = req.body;
            const product = await Products.findById(req.params.id);
    
            if(product) {
                const alreadyReviewed = product.reviews.find(
                    (r) => r.user?.toString() === req.user.id.toString()
                )
                if(alreadyReviewed){
                    return res.status(400).json({msg: 'The product already reviewed.'})
                }
                const review = {
                    name: req.user.name,
                    rating: Number(rating),
                    comment,
                    user: req.user.id
                }
                product.reviews.push(review)
                product.numReviews = product.reviews.length
                product.rating = 
                product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

                await product.save()
                res.status(201).json({msg: 'Reviewed Added'})
            } else {
                return res.status(400).json({msg: 'Product not found'})
            }
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = productsCtrl;