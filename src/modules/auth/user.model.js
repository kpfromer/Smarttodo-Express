import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { promisify } from 'util';

const schema = new mongoose.Schema({
  username: { required: true, type: String, unique: true },
  password: { required: true, type: String },
  email: { required: true, type: String, unique: true },
  firstName: { required: true, type: String },
  lastName: { required: true, type: String }
});

schema.pre('save', async function (next) {
  const encryptedPassword = await promisify(bcrypt.hash)(this.password, 8);
  this.password = encryptedPassword;
  next();
});

schema.methods.checkPassword = async function(plainTextPassword) {
  return await bcrypt.compare(plainTextPassword, this.password);
}

const model = mongoose.model('User', schema);

export default model;