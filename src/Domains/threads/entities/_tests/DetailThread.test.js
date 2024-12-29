const DetailThread = require('../DetailThread');

describe('an DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'judul misal abc',
      body: 'Body of threads example.',
      date: '2024-12-12T12:11:04.346Z',
      username: 'user-456',
    };
 
    // Action and Assert
    expect(() => new DetailThread(payload)).toThrow('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'judul misal abc',
      body: 'Body of threads example.',
      date: '2024-12-12T12:11:04.346Z',
      username: 'user-456',
      comments: 'Nice article!',
    };

    // Action and assert
    expect(() => new DetailThread(payload)).toThrow('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create ThreadDetail object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'judul misal abc',
      body: 'Body of threads example.',
      date: '2024-12-12T12:11:04.346Z',
      username: 'user-456',
      comments: []
    };

    // Action
    const { 
      id, title, body, date, username, comments
    } = new DetailThread(
      payload,
    );

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual(payload.comments);
  });
});