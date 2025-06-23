// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const verifyAdmin = async (req, res, next) => {
//     try {
//         const token = req.header("Authorization");
//         if (!token) return res.status(401).json({ message: "Access Denied!" });

//         const verified = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(verified.id);
//         if (!user || !user.isAdmin) return res.status(403).json({ message: "Not authorized!" });

//         req.user = user;
//         next();
//     } catch (error) {
//         res.status(400).json({ message: "Invalid Token", error });
//     }
// };

// module.exports = { verifyAdmin };


const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyUser = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) return res.status(401).json({ message: "Access Denied!" });

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verified.id);
        if (!user) return res.status(403).json({ message: "User not found" });

        req.user = user;
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid Token", error });
    }
};

module.exports = { verifyUser };
