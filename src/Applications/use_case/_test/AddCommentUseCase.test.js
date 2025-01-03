const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      content: 'Nice article!',
    };

    const mockThread = {
      id: 'thread-123',
    };
    const mockUser = {
      id: 'user-123',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-456',
      content: useCasePayload.content,
      owner: mockUser.id,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentReposiotry = new CommentRepository();

    mockThreadRepository.checkAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentReposiotry.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentReposiotry,
      threadRepository: mockThreadRepository,
    });

    const addedComment = await addCommentUseCase.execute(
      mockThread.id,
      mockUser.id,
      useCasePayload,
    );

    expect(addedComment).toStrictEqual(
      new AddedComment({
        id: 'comment-456',
        content: useCasePayload.content,
        owner: mockUser.id,
      }),
    );

    expect(mockThreadRepository.checkAvailableThread).toBeCalledWith(
      mockThread.id,
    );
    expect(mockCommentReposiotry.addComment).toBeCalledWith(
      mockThread.id,
      mockUser.id,
      new AddComment({
        content: useCasePayload.content,
      }),
    );
  });
});
