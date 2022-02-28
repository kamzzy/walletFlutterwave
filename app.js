
const express = require('express');
const app = express();
require('dotenv').config();
require('./config/database').connect();
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("./model/user");
const Wallet = require("./model/wallet");
const WalletTransaction = require("./model/wallet_transaction");
const Transaction = require("./model/transaction");
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.json());


// register
app.post("/register", async (req, res) => {
    try {
        // get user input
        const { first_name,last_name,email,password } = req.body;

        // validate user input
        if(!(email && password && first_name && last_name)) {
            res.status(400).send("All input is required");
            
        }
        // check if user already exist
        // validate if user exists in our db
        const oldUser = await User.findOne({email});

        if(oldUser) {
            return res.status(409).send("User already exist, please login");
        }
        // Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10)

        // create user in db
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password:encryptedPassword,
        });

        // create token
        const token = jwt.sign(
            {user_id: user._id, email},
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;
        // return new user
        res.status(201).json(user);

    } catch(err) {
        console.log(err);
    }

});
// login
app.post("/login", async (req, res) => {
    try {
        // get user input
        const { email,password } = req.body;
        // validate user input
        if(!(email && password)) {
            res.status(400).send("All input is required");
        }
        // validate if user exists in db
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // create token
            const token = jwt.sign(
                {user_id:user._d, email},
                process.env.TOKEN_KEY,
                {
                    expiresIn:"2h",
                }
            );
            // save user token
            user.token = token;
            // user
            return res.status(200).json(user);
        }
       return res.status(400).send("Invalid credentials");
    }catch(err) {
        console.log(err);
    }

});

app.get("/pay", (req,res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/response", async (req,res) => {
    try{
    const {transaction_id} = req.query;
    // URL with transaction ID of which will be used to confirm transaction status
    const url = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;

    // Network call to confirm transaction status
    const response = await axios({
        url,
        method:"get",
        headers: {
            "Content-Type": "application/json",
            Accept: "application.json",
            Authorization:`${process.env.SECRET_KEY}`,
        },
    });

    const { status,currency,id,amount,customer } = response.data.data;
    
    // check if customer exists in database
    const user = await User.findOne({email: customer.email});
    // check if user has a wallet, else create one
    const wallet = await validateUserWallet(user._id);
    // create wallet transaction
    await createWalletTransaction(user._id, status, currency,amount);
    // create transaction
    await createTransaction(user._id, id, status, currency, amount,customer);
    await updateWallet(user._id, amount);
    return res.status(200).json({
        response: "wallet funded successfully",
        data: wallet,
    });

    } catch(err) {
        console.log(err);
    }
});
// validating user wallet
const validateUserWallet = async(userId) => {
    try{
        // check if user has a wallet, else create one
        const userWallet = await Wallet.findOne({userId});
        if(!userWallet) {
            // create wallet
            const wallet = await Wallet.create({
                userId,
            });
            return wallet;
        }
        return userWallet;
    } catch (err) {
        console.log(err);
    }
};

// create  wallet transaction
const createWalletTransaction = async(userId,status, currency, amount) => {
    try{
        // create wallet transaction
        const walletTransaction = await WalletTransaction.create({
            amount,
            userId,
            isInflow: true,
            currency,
            status,
        });
        return walletTransaction;
    } catch (err) {
        console.log(err);
    }
};

// create transaction
const createTransaction = async (
    userId,id,status,currency,amount,customer
) => {
    try {
// create transaction
const transaction = await Transaction.create({
    userId,
    transactionId: id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone_number,
    amount,
    currency,
    paymentStatus: status,
    paymentGateway: "flutterwave",
     });
     return transaction;
  } catch (err){
      console.log(err);
  }
};

// update wallet

const updateWallet = async (userId, amount) => {
    try {
        // update wallet
        const wallet = await Wallet.findOneAndUpdate(
            {userId}, 
            {$inc: {balance: amount} },
            {new: true}
        );
        return wallet;
    } catch(err) {
        console.log(err);
    }
};

app.get("/wallet/:userId/balance", async (req, res) => {
    try {
      const { userId } = req.params;
  
      const wallet = await Wallet.findOne({ userId });
      // user
      res.status(200).json(wallet.balance);
    } catch (err) {
      console.log(err);
    }
  });

  
module.exports = app;