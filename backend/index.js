const express = require("express");
const cors = require('cors');
require('./db/config');
const User= require('./db/Users');
const Product = require('./db/Product');

const jwt=require('jsonwebtoken');
const jwtkey='cool-dude-69';

const app = express();

app.use(express.json());
app.use(cors());

app.get("/",(req , res)=>{
    res.send("HYY bro");
});

app.post("/register", async (req, res) => {
  try {
   
    let user=new User(req.body);
    let result= await user.save();
    result =result.toObject();
    delete result.password;
    jwt.sign({result},jwtkey,{expiresIn:"2h"},(err,token)=>{
          if(err){
            res.send({result:"something went wrong,Please try after sometime"})
          }
          res.send({result,auth:token}) 
        })

  }  
  catch (error) {
    
    console.error(error);
    res.status(500).send({ error: "An error occurred while processing your request." });
  }
});


app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      let user = await User.findOne({ email, password }).select("-password");
      if (user) {
        jwt.sign({user},jwtkey,{expiresIn:"2h"},(err,token)=>{
          if(err){
            res.send({result:"something went wrong,Please try after sometime"})
          }
          res.send({user,auth:token}) 
        })
                  
      } else {
          res.status(401).send({ result: 'No user found' });
         }

    } else {
      res.status(400).send({ result: 'Email and password are required' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "fuck you An error occurred while processing your request." });
  }
});
  
app.post("/add-product",verifyToken, async (req, res) => {
    try {
        let product = new Product(req.body);
        let result = await product.save();
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "An error occurred while adding the product." });
    }
});


app.get('/products',verifyToken,  async (req, res) => {
    try {
        let products = await Product.find();
        if (products.length > 0) {
            res.send(products);
        } else {
            res.send({ result: 'No Product found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "An error occurred while fetching the products." });
    }
});


app.delete('/product/:id',verifyToken, async (req, res) => {
    try {
        const result = await Product.deleteOne({ _id: req.params.id });
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "An error occurred while deleting the product." });
    }
});


app.get('/product/:id',verifyToken,async (req, res) => {
  try {
    let result = await Product.findOne({_id: req.params.id});
    if (result) {
      res.send(result);
    } else {
      res.send({result: "No record found."});
    }
  } catch (error) {
    res.status(500).send({error: "An error occurred while fetching the product details."});
  }
});


app.put('/product/:id',verifyToken, async (req, res) => {
    try {
        let result = await Product.updateOne(
            { _id: req.params.id },
            {
                $set: req.body
            }
        );
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "An error occurred while updating the product." });
    }
});




app.get("/search/:key",verifyToken, async (req, res) => {
    try {
        let result = await Product.find({
            "$or": [
                { name: { $regex: req.params.key, $options: "i" } },
                { company: { $regex: req.params.key, $options: "i" } },
                { category: { $regex: req.params.key, $options: "i" } }
            ]
        });
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "An error occurred while searching for products." });
    }
});

function verifyToken(req,res,next){
  let token=req.headers['authorization']
  if(token){ 
    token=token.split(' ')[1]  
    jwt.verify(token,jwtkey,(err,valid)=>{
      if(err){
        res.status(401).send({result:"please provide valid Token"})
      }else{
        next();
      }
    })
  }else{
     res.status(403).send({result:"Please add token with header"})
  }
}

const PORT = process.env.PORT || 3000; // Change 3000 to any other available port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});