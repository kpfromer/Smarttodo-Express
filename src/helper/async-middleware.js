export default middleware => (req, res, next) => {
  return Promise.resolve(middleware(req, res, next))
    .catch(next);
}