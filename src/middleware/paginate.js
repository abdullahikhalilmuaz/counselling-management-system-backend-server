module.exports = function paginate(defaultLimit = 20) {
  return (req, _res, next) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || defaultLimit);
    req.pagination = { page, limit, skip: (page - 1) * limit };
    next();
  };
};
