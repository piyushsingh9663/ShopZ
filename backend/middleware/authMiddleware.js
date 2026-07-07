const jwt = require('jsonwebtoken');
const user = require('../model/user');

const protect = async(req,res,next)=>{
    let Token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            Token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(Token, process.env.JWT_SECRET);
            req.user = await user.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({message:'Not authorized, token failed'});
        }
    }
    if(!Token){
        res.status(401).json({message:'Not authorized, no token'});
    }
};

module.exports = { protect };