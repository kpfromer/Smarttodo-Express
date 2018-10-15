export class CreateChain {
  constructor(middleware) {
    this.chain = [middleware]
  }
  addMiddleware(middleware) {
    this.chain.push(middleware);
    return this;
  }
  run(initialValues = undefined) {
    return this.chain.reduceRight((value, middleware) => middleware(value), initialValues);
  }
}