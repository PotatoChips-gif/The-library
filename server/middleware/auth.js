const jwt = require('jsonwebtoken');
const User = require('../api/models/userModel');

const auth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    console.log('Authorization check:', {
      userRole: req.user?.role,
      requiredRoles: roles,
      userId: req.user?.id
    });
    
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role '${req.user?.role}' is not authorized to access this route. Required roles: ${roles.join(', ')}` 
      });
    }
    next();
  };
};

module.exports = { auth, authorize };