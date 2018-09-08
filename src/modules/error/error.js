import express from 'express';

export default (error, req, res, next) => {
  return res.status(error.output.statusCode)
    .json(error.output.payload);
};