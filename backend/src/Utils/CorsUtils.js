const corsLocally = {
    origin: ['http://localhost:5173' , 'http://localhost:3000' , 'http://localhost:5175' , 'http://127.0.0.1:5500'],
    methods: ['POST' , 'PUT' , 'GET' , "DELETE" , "OPTIONS"],
    credentials: true,
}

const corsProduction = {
    origin: 'https://snapbasket.cloudcoderhub.in',
    methods: ['POST' , 'PUT' , 'GET' , "DELETE" , "OPTIONS"],
    credentials: true,
}



const corsOptions = process.env.NODE_ENV === 'production' ? corsProduction : corsLocally;

export { corsOptions }