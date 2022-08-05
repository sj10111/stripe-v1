const { json } = require('express');
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')


const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cors())
const stripe = require('stripe')(process.env.REACT_APP_SECRET_KEY)

app.get("/", async function (req,res) {
    res.send("Hello")
})
app.get("/list", async function(req,res){
    const products = await stripe.products.list()
    res.send(products)
 
})
app.post("/payments",  async function(req,res){
   
     const paymentLink = await stripe.paymentLinks.create({
   line_items: [{price:`${req.body.price}`,quantity:1}],
       }).then(res=> {return res.url})
      res.send(paymentLink)

})



app.listen(8989,()=>{
    console.log("listening on 8989")
})