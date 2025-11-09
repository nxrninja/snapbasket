// import express
import express, { urlencoded } from "express";


// import security-realted middleware 
import helmet from "helmet";
import hpp from "hpp";
import cookieParser from "cookie-parser";



// import dotenv
import { configDotenv } from "dotenv";



// use dotenv
configDotenv();



// import database path
import { dbConnect} from './src/Configs/DbConnect.js'


// Connection with database - handle errors gracefully for serverless
try {
    await dbConnect();
} catch (error) {
    console.error("Failed to connect to database on startup:", error.message);
    // Don't exit - allow the app to start and retry on first request
}

// import other 
import cors from "cors";
import { corsOptions } from "./src/Utils/CorsUtils.js";


// create express app
const app = express();


// use security-related middleware
app.use(helmet());
app.use(hpp());


//  other middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors(corsOptions));
app.use(cookieParser())





export default app;







