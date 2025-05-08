//To verify that the user is and admin but not and user

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
      next();  // User is admin, proceed to the next middleware or route handler
    } else {
      res.status(403).json({ message: 'Access denied. Admins only.' });  // Unauthorized access if not admin
    }
  };
  
  export default isAdmin;
  