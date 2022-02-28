const http = require('http');
const app = require('./app');
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// server listening
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// const { status, currency, id, amount, customer } = response.data.data;

// // check if transaction id already exist

// const transactionExist = await Transaction.findOne({ transactionId: id });

// if (transactionExist) {
//   return res.status(409).send("Transaction Already Exist");
// }
// // check if customer exist in our database
// const user = await User.findOne({ email: customer.email });

// // check if user have a wallet, else create wallet
// const wallet = await validateUserWallet(user._id);

// // create wallet transaction
// await createWalletTransaction(user._id, status, currency, amount);

// // create transaction
// await createTransaction(user._id, id, status, currency, amount, customer);

// await updateWallet(user._id, amount);

// return res.status(200).json({
//   response: "wallet funded successfully",
//   data: wallet,
// });
// } catch(err) {
//       console.log(err);
//   }
// });
// // validating user wallet
// // const validateUserWallet = async(userId) => {
// //     try{
// //         // check if user has a wallet, else create one
// //         const userWallet = await Wallet.findOne({userId});
// //         if(!userWallet) {
// //             // create wallet
// //             const wallet = await Wallet.create({
// //                 userId,
// //             });
// //             return wallet;
// //         }
// //         return userWallet;
// //     } catch (err) {
// //         console.log(err);
// //     }
// // };

// // // create  wallet transaction
// // const createWalletTransaction = async(userId,status, currency, amount) => {
// //     try{
// //         // create wallet transaction
// //         const walletTransaction = await WalletTransaction.create({
// //             amount,
// //             userId,
// //             isInflow: true,
// //             currency,
// //             status,
// //         });
// //         return walletTransaction;
// //     } catch (err) {
// //         console.log(err);
// //     }
// // };

// // // create transaction
// // const createTransaction = async (
// //     userId,id,status,currency,amount,customer
// // ) => {
// //     try {
// // // create transaction
// // const transaction = await Transaction.create({
// //     userId,
// //     transactionId: id,
// //     name: customer.name,
// //     email: customer.email,
// //     phone: customer.phone_number,
// //     amount,
// //     currency,
// //     paymentStatus: status,
// //     paymentGateway: "flutterwave",
// //      });
// //      return transaction;
// //   } catch (err){
// //       console.log(err);
// //   }
// // };

// // // update wallet

// // const updateWallet = async (userId, amount) => {
// //     try {
// //         // update wallet
// //         const wallet = await Wallet.findOneAndUpdate(
// //             {userId}, 
// //             {$inc: {balance: amount} },
// //             {new: true}
// //         );
// //         return wallet;
// //     } catch(err) {
// //         console.log(err);
// //     }
// // };

// app.get("/wallet/:userId/balance", async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const wallet = await Wallet.findOne({ userId });
//     // user
//     res.status(200).json(wallet.balance);
//   } catch (err) {
//     console.log(err);
//   }
// });

// const validateUserWallet = async (userId) => {
//   try {
//     // check if user have a wallet, else create wallet
//     const userWallet = await Wallet.findOne({ userId });

//     if (!userWallet) {
//       // create wallet
//       const wallet = await Wallet.create({
//         userId,
//       });
//       return wallet;
//     }
//     return userWallet;
//   } catch (error) {
//     console.log(error);
//   }
// };

// const createWalletTransaction = async (userId, status, currency, amount) => {
//   try {
//     // create wallet transaction
//     const walletTransaction = await WalletTransaction.create({
//       amount,
//       userId,
//       isInflow: true,
//       currency,
//       status,
//     });
//     return walletTransaction;
//   } catch (error) {
//     console.log(error);
//   }
// };

// const createTransaction = async (
//   userId,
//   id,
//   status,
//   currency,
//   amount,
//   customer
// ) => {
//   try {
//     // create transaction
//     const transaction = await Transaction.create({
//       userId,
//       transactionId: id,
//       name: customer.name,
//       email: customer.email,
//       phone: customer.phone_number,
//       amount,
//       currency,
//       paymentStatus: status,
//       paymentGateway: "flutterwave",
//     });
//     return transaction;
//   } catch (error) {
//     console.log(error);
//   }
// };

// const updateWallet = async (userId, amount) => {
//   try {
//     // update wallet
//     const wallet = await Wallet.findOneAndUpdate(
//       { userId },
//       { $inc: { balance: amount } },
//       { new: true }
//     );
//     return wallet;
//   } catch (error) {
//     console.log(error);
//   }