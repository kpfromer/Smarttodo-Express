export default middleware => (req, res, next) => {
  Promise.resolve(middleware(req, res, next))
    .catch(next);
}