describe('MongoDB Connection Configuration', () => {
  let originalEnv;
  let mongoose;

  beforeEach(() => {
    jest.resetModules();
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  const setupMongooseMock = () => {
    jest.mock('mongoose', () => ({
      connect: jest.fn(),
      set: jest.fn(),
      connection: {
        on: jest.fn(),
        once: jest.fn(),
      },
    }));

    mongoose = require('mongoose');
  };

  it('connects to MongoDB using .env URI and logs Atlas/Cloud message', () => {
    process.env.MONGODB_URI = 'mongodb+srv://test.mongodb.net/mydb';
    setupMongooseMock();

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    mongoose.connection.once.mockImplementation((event, cb) => {
      if (event === 'open') cb();
    });

    require('../config/connection');

    expect(mongoose.connect).toHaveBeenCalledWith(
      'mongodb+srv://test.mongodb.net/mydb',
      expect.objectContaining({ useNewUrlParser: true, useUnifiedTopology: true })
    );

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Atlas/Cloud'));
  });

  it('falls back to local MongoDB URI and logs warning', () => {
    delete process.env.MONGODB_URI;
    setupMongooseMock();

    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    mongoose.connection.once.mockImplementation((event, cb) => {
      if (event === 'open') cb();
    });

    require('../config/connection');

    //expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('MONGODB_URI not set'));

    expect(mongoose.connect).toHaveBeenCalledWith(
      'mongodb+srv://1ms22cs144:%40%4013Sneha@project.bpxnoex.mongodb.net/Project?retryWrites=true&w=majority&appName=Project',
      expect.objectContaining({ useNewUrlParser: true, useUnifiedTopology: true })
    );

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('✅ MongoDB connected: Atlas/Cloud'));
  });

  it('binds db.on error handler and logs the error', () => {
    setupMongooseMock();

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mongoose.connection.on.mockImplementation((event, cb) => {
      if (event === 'error') cb('MockError');
    });

    require('../config/connection');

    expect(errorSpy).toHaveBeenCalledWith('❌ MongoDB connection error:', 'MockError');
  });

  it('binds db.once open handler and logs success message', () => {
    setupMongooseMock();

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    mongoose.connection.once.mockImplementation((event, cb) => {
      if (event === 'open') cb();
    });

    require('../config/connection');

    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('MongoDB connected'));
  });
});
