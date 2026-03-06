const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Non autorisé' });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET manquant dans .env');
      return res.status(500).json({ message: 'Configuration JWT manquante' });
    }

    const decoded = jwt.verify(token, secret);
    req.admin = { id: decoded.id, email: decoded.email };
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
}

module.exports = { requireAdmin };

