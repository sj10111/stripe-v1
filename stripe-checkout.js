const { json } = require("express");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
const stripe = require("stripe")(process.env.REACT_APP_SECRET_KEY);

app.get("/", async function (req, res) {
  res.send("Hello");
});
app.get("/list", async function (req, res) {
  const products = await stripe.products.list();
  res.send(products);
});
app.post("/payments", async function (req, res) {
 const data = await stripe.subscriptions.create({
    customer:req.body.customerId,
    items:[
       {price:req.body.priceId}
    ]
 }).then(res =>{return res})
const amount = await  data.items.data[0].plan.amount
const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: req.body.priceId,
        quantity: 1,
      },
    ],
    // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
    success_url: `https://www.example.com/`,
    cancel_url: `https://www.example.com/canceled.html`,
    // automatic_tax: { enabled: true }
}).then(res=>{return res})
res.send(session.url)


});

app.listen(8989, () => {
  console.log("listening on 8989");
});
