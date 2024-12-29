const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedReplyComment = require('../../../Domains/reply-comment/entities/AddReplyComment');
const AddReplyComment = require('../../../Domains/reply-comment/entities/AddedReplyComment');
const ReplyCommentRepository = require('../../../Domains/reply-comment/ReplyCommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyCommentUseCase = require('../AddReplyCommentUseCase');

describe('AddReplyCommentUseCase', () => {
  it('should orchestrating the add reply comment action correctly', async () => {
    const useCasePayload = {
      content: 'My reply',
    };

    const mockThread = { 
      id: 'thread-123',
    };
    const mockUser = { 
      id: 'user-123',
    };
    const mockComment = { 
      id: 'comment-123',
    };

    const mockAddedReplyComment = new AddedReplyComment({
      id: 'reply-325',
      content: useCasePayload.content,
      owner: mockUser.id,
    });

    const mockReplyCommentRepository = new ReplyCommentRepository();
    const mockCommentReposiotry = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    
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
      replyCommentRepository: mockReplyCommentRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentReposiotry,
    });

    const addedReplyComment = await addReplyCommentUseCase.execute(
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
    expect(mockReplyCommentRepository.addReplyComment).toBeCalledWith(
      mockUser.id,
      mockComment.id,
      new AddReplyComment({
        content: useCasePayload.content,
      }),
    );
  });
});