import authenticatedService from './authenticated';

describe('authenticated', () => {
  let authenticated, req, res, model, getValidatedData, getUserIdFromReq;
  let createMongoObject, mockUserId;
  let exec;
  beforeEach(() => {
    model = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      findOneAndUpdate: jest.fn(),
      deleteOne: jest.fn()
    };
    getValidatedData = jest.fn();
    mockUserId = 'USER-ID';
    getUserIdFromReq = jest.fn().mockReturnValue(mockUserId);

    req = {
      thisIsTheRequest: true
    };
    res = {
      json: jest.fn().mockImplementation(value => value)
    };

    authenticated = authenticatedService(model, getValidatedData, getUserIdFromReq);

    // Helper function
    createMongoObject = values => {
      const { id, ...rest } = values;
      return {
        id,
        toObject: () => rest
      };
    }
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('findAll', () => {
    beforeEach(async () => {
      exec = jest.fn().mockResolvedValue([
        createMongoObject({
          id: '1',
          name: 'jack kennedy'
        }),
        createMongoObject({
          id: '2',
          name: 'barack obama'
        }),
        createMongoObject({
          id: '3',
          name: 'ronald reagan'
        })
      ]);
      model.find.mockReturnValue({ exec });

      await authenticated.findAll()(req, res);
    });
    it('responds with json of all items', async() => {
      expect(res.json.mock.calls[0]).toMatchSnapshot()
    });
    it('calls mongoose model find with userId from request', () => {
      expect(getUserIdFromReq).toHaveBeenCalledWith(req);
      expect(model.find).toHaveBeenCalledWith({ userId: mockUserId });
    })
  });
  describe('getById', () => {
    let itemId, getItemId;
    beforeEach(async () => {
      exec = jest.fn().mockResolvedValue(createMongoObject({
        id: '12152',
        name: 'jack nicholson'
      }));
      model.findOne.mockReturnValue({ exec });
      itemId = 'ITEM-ID';
      getItemId = jest.fn().mockReturnValue(itemId);
      await authenticated.getById(getItemId)(req, res);
    });
    it('responds with json of object', () => {
      expect(res.json.mock.calls[0]).toMatchSnapshot();
    });
    it('calls mongoose model findOne with userId and id from request', () => {
      expect(getUserIdFromReq).toHaveBeenCalledWith(req);
      expect(getItemId).toHaveBeenCalledWith(req);
      expect(model.findOne).toHaveBeenCalledWith({ userId: mockUserId, _id: itemId });
    });
  });
  describe('create', () => {
    beforeEach(async () => {
      model.create.mockResolvedValue(createMongoObject({
        id: '12152',
        name: 'new jacky'
      }));
      getValidatedData.mockReturnValue({
        name: 'new jacky'
      });
      await authenticated.create()(req, res);
    });
    it('responds with json of newly created database object', () => {
      expect(res.json.mock.calls[0]).toMatchSnapshot();
    });
    it('creates an object with validated data and userId', () => {
      expect(getUserIdFromReq).toHaveBeenCalledWith(req);
      expect(getValidatedData).toHaveBeenCalledWith(req);
      expect(model.create).toHaveBeenCalledWith({ name: 'new jacky', userId: mockUserId });
    });
  });
  describe('put', () => {
    let itemId, getItemId;
    beforeEach(async () => {
      exec = jest.fn().mockResolvedValue(createMongoObject({
        id: '666',
        name: 'completely updated person (must had some plastic surgery and went into the witness protection program)'
      }));
      model.findOneAndUpdate.mockReturnValue({ exec });
      itemId = 'ITEM-ID';
      getItemId = jest.fn().mockReturnValue(itemId);
      getValidatedData.mockReturnValue({
        name: 'completed updated person'
      });
      await authenticated.put(getItemId)(req, res);
    });
    it('responds with json of newly updated database object', () => {
      expect(res.json.mock.calls[0]).toMatchSnapshot();
    });
    it('finds with userId and item id and completely updates an object with validated data', () => {
      expect(getUserIdFromReq).toHaveBeenCalledWith(req);
      expect(getValidatedData).toHaveBeenCalledWith(req);
      expect(getItemId).toHaveBeenCalledWith(req);
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        {
          userId: mockUserId,
          _id: itemId
        },
        {
          name: 'completed updated person'
        }
      );
    });
  });
  describe('patch', () => {
    let itemId, getItemId;
    beforeEach(async () => {
      exec = jest.fn().mockResolvedValue(createMongoObject({
        id: '2020',
        name: 'completely updated person (must had partial plastic surgery)'
      }));
      model.findOneAndUpdate.mockReturnValue({ exec });
      itemId = 'ITEM-ID';
      getItemId = jest.fn().mockReturnValue(itemId);
      getValidatedData.mockReturnValue({
        name: 'sort of updated person'
      });
      await authenticated.patch(getItemId)(req, res);
    });
    it('responds with json of newly updated database object', () => {
      expect(res.json.mock.calls[0]).toMatchSnapshot();
    });
    it('finds with userId and item id and partially updates an object with validated data', () => {
      expect(getUserIdFromReq).toHaveBeenCalledWith(req);
      expect(getValidatedData).toHaveBeenCalledWith(req);
      expect(getItemId).toHaveBeenCalledWith(req);
      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        {
          userId: mockUserId,
          _id: itemId
        },
        {
          $set: {
            name: 'sort of updated person'
          }
        }
      );
    });
  });
  describe('remove', () => {
    let userId, getId;
    beforeEach(async () => {
      exec = jest.fn().mockResolvedValue({
        ok: 1,
        nRemoved: 1
      });
      model.deleteOne.mockReturnValue({ exec });
      userId = 'USER-ID';
      getId = jest.fn().mockReturnValue(userId);

      await authenticated.remove(getId)(req, res);
    });
    it('responds with json of all items', async() => {
      expect(res.json.mock.calls[0]).toMatchSnapshot()
    });
    it('calls mongoose model find with userId from request', () => {
      expect(getUserIdFromReq).toHaveBeenCalledWith(req);
      expect(getId).toHaveBeenCalledWith(req);
      expect(model.deleteOne).toHaveBeenCalledWith({ userId: mockUserId, _id: userId });
    })
  });
});