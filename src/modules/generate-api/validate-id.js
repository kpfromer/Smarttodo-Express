export default getId => (req, res, next) => {
  if (!(/^[a-f0-9]{24}$/i).test(getId(req))) {
    return next(boom.badRequest('Id parameter must be a valid mongo id'));
  }
  return next();
};