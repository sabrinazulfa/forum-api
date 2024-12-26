const DetailedThread = require('../DetailedThread');

describe('an DetailedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'judul misal abc',
      body: 'Body of threads example.',
      date: '2024-12-12T12:11:04.346Z',
      username: 'user-789',
    };
 
    // Action and Assert
    expect(() => new DetailedThread(payload)).toThrowError('DETAILED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'judul misal abc',
      body: 'Body of threads example.',
      date: '2024-12-12T12:11:04.346Z',
      username: 'user-789',
      comments: 'good job',
    };

    // Action and assert
    expect(() => new DetailedThread(payload)).toThrowError('DETAILED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'judul misal abc',
      body: 'Body of threads example.',
      date: '2024-12-12T12:11:04.346Z',
      username: 'user-789',
      comments: []
    };

    // Action
    const detailedThread = new DetailedThread(payload);

    // Assert
    expect(detailedThread.id).toEqual(payload.id);
    expect(detailedThread.title).toEqual(payload.title);
    expect(detailedThread.body).toEqual(payload.body);
    expect(detailedThread.date).toEqual(payload.date);
    expect(detailedThread.username).toEqual(payload.username);
    expect(detailedThread.comments).toEqual(payload.comments);
  });
});