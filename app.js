const msal = require('@azure/msal-node');
const express = require("express");

const enviroment = require('./config/enviroment');

const SERVER_PORT = `${enviroment.port}`;
const REDIRECT_URI = `${enviroment.host}:4200/logOn`;


const config = {
    auth: {
        clientId: `${enviroment.idAppAzure}`,
        authority: `${enviroment.authority}`,
        clientSecret: `${enviroment.secret}`
    }
//     ,
//     system: {
//         loggerOptions: {
//             loggerCallback(loglevel, message, containsPii) {
//                 console.log(message);
//             },
//             piiLoggingEnabled: false,
//             logLevel: msal.LogLevel.Verbose,
//         }
//     }
};

const pca = new msal.ConfidentialClientApplication(config);

// Create Express App and Routes
const app = express();

app.get('/', (req, res) => {
    const authCodeUrlParameters = {
        scopes: ["user.read"],
        redirectUri: REDIRECT_URI,
    };

    // get url to sign user in and consent to scopes needed for application
    pca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
        res.send({statuscode: 200, url: response});
        // console.log(response);
        // res.redirect(response);
    }).catch((error) => console.log(JSON.stringify(error)));
});

app.get('/logOn', (req, res) => {
    const tokenRequest = {
        code: req.query.code,
        scopes: ["user.read"],
        redirectUri: REDIRECT_URI,
    };
    // res.send('llego');
    pca.acquireTokenByCode(tokenRequest).then((response) => {
        // console.log("\nResponse: \n:", response);
        res.send({statuscode: 200, data: response});
    }).catch((error) => {
        console.log(error);
        res.status(500).send(error);
    });
});


app.listen(SERVER_PORT, () => console.log(`El servidor se está ejecutando en ${enviroment.host}:${enviroment.port}`))