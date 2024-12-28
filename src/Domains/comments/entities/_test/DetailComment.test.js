const DetailedComment = require('../DetailedComment');

describe('an DetailedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'Comment-123',
      date: '2024-12-12T12:11:04.346Z',
      content: 'good job',
    };
 
    // Action and Assert
    expect(() => new DetailedComment(payload)).toThrowError('DETAILED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'Comment-123',
      username: 'user-789',
      date: '2024-12-12T12:11:04.346Z',
      contents: 123,
    };

    // Action and assert
    expect(() => new DetailedComment(payload)).toThrowError('DETAILED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailedComment object correctly when isDeleted false', () => {
    // Arrange
    const payload = {
      id: 'Comment-123',
      username: 'user-456',
      date: '2024-12-12T12:11:04.346Z',
      contents: 'good job',
      isDelete: false,
    };

    const { id, username, date, content } = new DetailedComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });

  it('should create DetailedComment object correctly when isDeleted true', () => {
    // Arrange
    const payload = {
      id: 'Comment-123',
      username: 'user-456',
      date: '2024-12-12T12:11:04.346Z',
      contents: 'good job',
      isDelete: true,
    };

    const { id, username, date, content } = new DetailedComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual('**komentar telah dihapus**');
  });

    it('should create DetailedComment object correctly when isDeleted false', () => {
    // Arrange
    const payload = {
      id: 'Comment-123',
      username: 'user-456',
      date: '2024-12-12T12:11:04.346Z',
      contents: 'good job',
      isDelete: false,
    };

    const { id, username, date, content } = new DetailedComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });

  it('should remap content based isDelete value', () => {
    // Arrange
    const payload = {
      id: 'Comment-123',
      username: 'user-456',
      date: '2024-12-12T12:11:04.346Z',
      contents: 'good job',
      isDelete: false,
    };

    const { id, username, date, content } = new DetailedComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });
});