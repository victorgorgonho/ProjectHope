const jwt = require('jsonwebtoken');
const authConfig = require ('../../config/auth.json');

//This middleware won't allow any request that use him if token is invalid, token will be checked before every request made

module.exports = (req, res, next) => {
    //Get Header from reques
    const authHeader = req.headers.authorization;

    //If there's none, there's no token provided
    if(!authHeader)
        return res.status(401).send({ error: 'Token não encontrado' });

    //Split header due to "Bearer " that comes before the actual token
    const parts = authHeader.split(' ');

    //If there's less than 2 parts, token isn't correctly formatted
    if(!parts.split === 2)
        return res.status(401).send({ error: 'Token mal formatado'});

    const [scheme, token] = parts;

    //Check if Bearer is correctly formatted
    if(!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: 'Header mal formatado'});

    //Compares both tokens, if equal, allow the request to keep going
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if(err)
            return res.status(401).send({ error: 'Invalid Token' });

        req.userId = decoded.id;
        return next();
    })
};