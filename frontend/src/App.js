import "./App.css";
import { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";

function App() {
  const [products, setProducts] = useState({});
  const [show, setShow] = useState(false);
  const [redirect, setRedirect] = useState(false)
  const [paymentLink, setPaymentLink] =useState("")
  async function handleOnClick() {
    const productList = await axios
      .get("http://localhost:8989/list")
      .then((res) => {
        return res.data.data;
      });
    setProducts(productList);
    setShow(true);
    console.log(products);
  }

  async function handlePayment(price) {
    var config = {
      method: "post",
      url: "http://localhost:8989/payments",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ price: `${price}` }),
    };

    await axios(config).then((res) =>{ 
      setPaymentLink(res.data)
      console.log(res.data) 
      setRedirect(true)});
  }
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">

      {redirect && window.open(paymentLink)}
      {show && (
        <div className=" grid h-auto grid-flow-row grid-cols-3 justify-items-center w-screen ">
          {products.map((res) => {
            return (
              <div onClick={() => handlePayment(res.default_price)}  className=" mb-10 bg-slate-200 hover:scale-110 active:scale-90 transition-all duration-300 ini flex justify-center items-center w-[150px] h-[180px] shadow-lg rounded-lg ">
                <div >
                  {res.name}
                  
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div>
        <button
          onClick={handleOnClick}
          className="w-20 h-8 rounded-sm shadow-md"
        >
          View 
        </button>
      </div>
    </div>
  );
}

export default App;
