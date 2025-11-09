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
// Don't await - let it connect in background so server can start immediately
dbConnect().catch((error) => {
    console.error("Failed to connect to database on startup:", error.message);
    console.log("Server will start anyway. Database will retry on first request.");
    // Don't exit - allow the app to start and retry on first request
});

// import other 
import cors from "cors";
import { corsOptions } from "./src/Utils/CorsUtils.js";


// create express app
const app = express();


// use security-related middleware
// Configure helmet to allow manifest files
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // Disable CSP for now to avoid blocking
}));
app.use(hpp());


//  other middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors(corsOptions));
app.use(cookieParser())





export default app;







