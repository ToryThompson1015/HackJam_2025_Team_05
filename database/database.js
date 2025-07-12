// import { config } from 'dotenv'; config(); //dont import the entire env package, only import the config function from the .env package and then immediately invoke it so we can have access to the mongo_uri environment variable
// import mongoose from 'mongoose'; //import mongoos so we can use mongoose to esatblish the connection to mongoDB (our db)

// mongoose.connect(process.env.MONGO_URI); //here is our environment variable that is holding our connection  //here we establish the connection to mongoDB. This creates the connection

// //here is how we track the connection that we created. Once the connection is open i.e. the connection is successful then we execute the callback function stating that we are connected
// mongoose.connection.once('open', () => {
//     console.log(`MongoDB Connected to: ${mongoose.connection.name}`); //mongoose.connection.name list out the database we are connected to
// });

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    console.error('Server will continue running without database');
    // DON'T crash the server - just log the error
    // process.exit(1); // Remove this line!
    throw error; // Still throw so the catch block in server.js handles it
  }
};

export default connectDB;
