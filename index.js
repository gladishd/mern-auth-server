const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");


dotenv.config();

//set up server

const app = express();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    // origin: ["*"],
    credentials: true,
}));

const whitelist = ['https://localhost:3000', 'http://localhost:3000', 'https://mangrove-research.vercel.app/', 'https://mangrove-research.vercel.app']

app.use(function (req, res, next) {
    let currentOrigin = req.headers.origin;
    if (whitelist.indexOf(currentOrigin) > -1) {
        origin = currentOrigin;
    } else {
        origin = 'https://mangrove-research.vercel.app';
    }
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', "GET, POST, OPTIONS, PUT, DELETE");
    res.header('Access-Control-Allow-Credentials', true)
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    )
    if (req.method == 'OPTIONS' &&
        req.rawHeaders.includes('Origin') &&
        req.rawHeaders.includes('Access-Control-Request-Method')) {
        res.status(204).end();
        return;
    }
    next()
})

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedDomains.indexOf(origin) === -1) {
                var msg = `The CORS policy for this site ${origin} does not allow access from the specified Origin.`;
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        }
    })
)

//remove the warning
mongoose.set('strictQuery', true)

//connect to mongoDB
mongoose.connect(process.env.MDB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (err) return console.error(err);
    console.log("Connected to MongoDB");
});

// set up routes
app.use("/auth", require("./routers/userRouter"));
app.use("/politician", require("./routers/politicianRouter"));
