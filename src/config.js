import convict from 'convict';

// Define a schema
const config = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV"
  },
  port: {
    doc: "The port for express to bind.",
    format: "port",
    default: 3001,
    env: "PORT",
    arg: "port"
  },
  jwt: {
    secret: {
      doc: "The jwt secret used to encode tokens",
      format: String,
      default: "jwt-dev-secret",
      env: "JWT_SECRET"
    },
    expireIn: {
      doc: "The time for the token to expire in",
      format: [String, Number],
      default: "1h",
      env: "JWT_EXPIRE"
    }
  },
  db: {
    url: {
      doc: "The mongo url used for connection.",
      format: "*", // TODO: validate for mongo url
      default: "mongodb://localhost:27017/smarttodo-express",
      env: "MONGO_URL"
    }
  }
});

export default config;