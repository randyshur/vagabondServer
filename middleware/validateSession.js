const jwt = require('jsonwebtoken');
const User = require('../db').import('../models/user');

module.exports = (req, res, next) => {
    if (req.method == 'OPTIONS') {
        next()
    } else {
        var sessionToken = req.headers.authorization;
        console.log(sessionToken)
        if (!sessionToken) return res.status(403).send({ auth: false, message: 'you dont have a token man' });
        else {
            jwt.verify(sessionToken, process.env.JWT_SECRET, (err, decoded) => {
                if (decoded) {
                    User.findOne({ where: { id: decoded.id } }).then(user => {
                        req.user = user;
                        next();
                    },
                        () => res.status(401).send({ error: 'failed to verify user, but we tried' })
                    );
                } else {
                    res.status(400).send({ error: 'not authorization' })
                }
            })
        }
    }
}

// const validateSession = (req, res, next) => {
//     const token = req.headers.authorization
//     jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
//       if (!err && decodedToken) {
//         User.findOne({ where: { id: decodedToken.id }})
//           .then(user => {
//             if (!user) throw 'err'
//             req.user = user
//             return next()
//           })
//           .catch(err => next(err))
//       } else {
//         req.errors = err
//         return next()
//       }
//     })
//   }
//   module.exports = validateSession
