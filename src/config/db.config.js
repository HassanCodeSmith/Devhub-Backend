import mongoose from 'mongoose';
import colors from 'colors';
import { DB_Name } from '../constants.js';

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${
        process?.env?.NODE_ENV === 'PRODUCTION'
          ? process?.env?.LIVE_DB_URI
          : process?.env?.LOCAL_DB_URI
      }/${DB_Name}`,
      {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
      }
    );

    console.log(
      `==> 🗄️  DB connected | DB host is ${connectionInstance.connection.host}`
        .brightWhite.bold
    );
  } catch (error) {
    console.error('An error occurred while connecting db'.red.bold, error);
    process.exit(1);
  }
};
