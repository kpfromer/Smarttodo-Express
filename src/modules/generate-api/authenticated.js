import asyncMiddleware from '../../helper/async-middleware';

export default (model, getValidatedData, getUserIdFromReq) => {
  // Helper functions
  const getUserId = req => ({
    userId: getUserIdFromReq(req)
  });

  const findAll = () => async req => {
    const userConditions = {
      ...getUserId(req)
    }
    return await model.find(userConditions).exec();
  };

  // Database calls
  const getById = getId => async req => {
    return await model.findOne({ ...getUserId(req), _id: getId(req) }).exec();
  }

  const create = () => async req => {
    const item = {
      ...getValidatedData(req),
      ...getUserId(req)
    }
    return await model.create(item)
  };

  const put = getId => async req => {
    const conditions = {
      _id: getId(req),
      ...getUserId(req)
    };
    const newValues = getValidatedData(req);

    return await model.findOneAndUpdate(conditions, newValues).exec();
  }

  const patch = getId => async req => {
    const conditions = {
      _id: getId(req),
      ...getUserId(req)
    };
    const newValues = getValidatedData(req);
    return await model.findOneAndUpdate(conditions, {$set: newValues}).exec()
  }

  const remove = getId => async req => {
    const conditions = {
      _id: getId(req),
      ...getUserId(req)
    };
    return await model.deleteOne(conditions).exec()
  };

  // Sanitizes a value (which can be one item or an array of items)
  const sanitize = value => {
    const sanitizeSingleItem = item => {
      // Get rid of _id
      const { id } = item;
      const plainObject = item.toObject();
      delete plainObject._id;
      delete plainObject.userId;
      return {
        ...plainObject,
        id
      };
    }
    if (Array.isArray(value)) {
      return value.map(sanitizeSingleItem);
    }
    return sanitizeSingleItem(value);
  }

  const authenticatedMethods = {
    findAll,
    getById,
    create,
    put,
    patch,
    remove
  };

  const keysNotToSanitize = [ // Database calls that don't return a database object 
    'remove'
  ];

  const covertToMiddleware = (dbCall, doSanitize) => (...paramsForDbCall) => asyncMiddleware(async (req, res) => {
    const dbCallValue = await dbCall(...paramsForDbCall)(req);
    if (doSanitize) {
      return res.json(sanitize(dbCallValue));
    }
    return res.json(dbCallValue);
  });
  
  const sanitizedAuthenticatedMethods = Object.keys(authenticatedMethods).reduce((prev, key) => {
    return {
      ...prev,
      [key]: covertToMiddleware(authenticatedMethods[key], !keysNotToSanitize.includes(key))
    }
  }, {});

  return sanitizedAuthenticatedMethods;
}