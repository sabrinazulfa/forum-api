const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddReplyComment = require('../../../Domains/reply-comment/entities/AddedReplyComment');
const AddedReplyComment = require('../../../Domains/reply-comment/entities/AddReplyComment');
const ReplyCommentRepository = require('../../../Domains/reply-comment/ReplyCommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyCommentUseCase = require('../AddReplyCommentUseCase');

describe('AddReplyCommentUseCase', () => {
  it('should orchestrating the add reply comment action correctly', async () => {
    const useCasePayload = {
      content: 'My reply',
    };

    const mockThread = { id: 'thread-123' };
    const mockUser = { id: 'user-123' };
    const mockComment = { id: 'comment-123'};

    const mockAddedReplyComment = new AddedReplyComment({
      id: 'reply-325',
      content: useCasePayload.content,
      owner: mockUser.id,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentReposiotry = new CommentRepository();
    const mockReplyCommentRepository = new ReplyCommentRepository();

    mockThreadRepository.checkAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentReposiotry.checkAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyCommentRepository.addReplyComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedReplyComment));

    const addReplyCommentUseCase = new AddReplyCommentUseCase({
      replyCommentRepository: mockAddedReplyComment,
      commentRepository: mockCommentReposiotry,
      threadRepository: mockThreadRepository,
    });

    const addedReplyComment = await AddReplyCommentUseCase.execute(
      mockComment.id,
      mockThread.id,
      mockUser.id,
      useCasePayload,
    );

    expect(addedReplyComment).toStrictEqual(
      new AddedReplyComment({
        id: 'reply-325',
        content: useCasePayload.content,
        owner: mockUser.id,
      }),
    );

    expect(mockThreadRepository.checkAvailableThread).toBeCalledWith(mockThread.id);
    expect(mockCommentReposiotry.checkAvailableComment).toBeCalledWith(mockComment.id);
    expect(mockReplyCommentReposiotry.addReplyComment).toBeCalledWith(
      mockUser.id,
      mockComment.id,
      new AddReplyComment({
        content: useCasePayload.content,
      }),
    );
  });
});