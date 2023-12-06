const jwt = require('jsonwebtoken');

//decode token
module.exports = function (req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.jwt_secret);
       req.body.userId = decoded.userId;
        //req.user = { userId: decoded.userId };
       // req.user = { _id: decoded.userId };
       //req.user = { userId: decoded.userId };
        console.log('User object in authMiddleware:', req.body.userId);


        next();
    } catch (error) {
        res.status(401).json({
            message: "Unauthorized",
            success: false,
        });
    }
};





