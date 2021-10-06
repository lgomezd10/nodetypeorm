import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import { Request, Response } from "express";
import * as cors from 'cors';
import * as helmet from 'helmet';
import routes from "./routes";
import * as socketIO from 'socket.io';

const PORT = process.env.PORT || 3000;



createConnection().then(async () => {

    // create express app
    const app = express();

    // Middlewares
    app.use(cors());
    app.use(helmet());

    app.use(express.json());    

    //Routes
    app.use('/', routes);

    app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow *** MODIFICAR el * inseguro
        res.setHeader('Access-Control-Allow-Headers', '*');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        // Pass to next layer of middleware
        next();
    });

    // start express server
    let server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    let io = require('socket.io').listen(server);

    // export io to use:
    //const socket = require('../index');
    //socket.emit('updateProducts', products);
    module.exports = io;
    
    io.on('connection', function (socket) {
        // Cada vez que se conecta un cliente mostramos un mensaje en la consola de Node.
        console.log('++++ Nuevo cliente conectado ++++');  
        
        socket.emit('connected', true);
        
        socket.on('disconnect', function () {
            console.log('user disconnected');
        });

    });

    //io.emit('connected', true);

})
    .catch(error => console.log(error));