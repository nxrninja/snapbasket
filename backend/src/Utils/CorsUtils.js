const corsLocally = {
    origin: ['http://localhost:5173' , 'http://localhost:3000' , 'http://localhost:5175' , 'http://127.0.0.1:5500'],
    methods: ['POST' , 'PUT' , 'GET' , "DELETE" , "OPTIONS"],
    credentials: true,
}

// CORS origin function to allow specific origins and all Vercel deployments
const corsOriginFunction = (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
        'https://snapbasket.cloudcoderhub.in',
    ];
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
        return callback(null, true);
    }
    
    // Allow all Vercel deployments (*.vercel.app)
    if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
    }
    
    // Reject other origins
    callback(new Error('Not allowed by CORS'));
};

const corsProduction = {
    origin: corsOriginFunction,
    methods: ['POST' , 'PUT' , 'GET' , "DELETE" , "OPTIONS"],
    credentials: true,
}



const corsOptions = process.env.NODE_ENV === 'production' ? corsProduction : corsLocally;

export { corsOptions }