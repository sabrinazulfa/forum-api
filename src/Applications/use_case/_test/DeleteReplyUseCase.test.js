const ReplyCommentRepository = require('../../../Domains/reply-comment/ReplyCommentRepository');
const DeleteReplyCommentUseCase = require('../DeleteReplyCommentUseCase');

describe('DeleteReplyCommentUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    const mockReplyCommentReposiotry = new ReplyCommentRepository();

    const mockReply = { id: 'reply-123' };
    const mockComment = { id: 'comment-123' };
    const mockThread = { id: 'thread-123' };
    const mockUser = { ownerId: 'user-123' };

    mockReplyCommentReposiotry.checkAvailableReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyCommentReposiotry.verifyReplyOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyCommentReposiotry.deleteReplyById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyCommentUseCase = new DeleteReplyCommentUseCase({
      replyCommentRepository: mockReplyCommentReposiotry,
    });

    await deleteReplyCommentUseCase.execute(   
      mockThread.id,
      mockComment.id,
      mockReply.id,
      mockUser.id,
    );
    
    expect(mockReplyCommentReposiotry.checkAvailableReply).toBeCalledWith(mockReply.id);
    expect(mockReplyCommentReposiotry.verifyReplyOwner).toBeCalledWith(mockReply.id, mockUser.idd);
    expect(mockReplyCommentReposiotry.deleteReplyById).toBeCalledWith(
      mockThread.id,
      mockComment.id,
      mockReply.id,
    );
  });
});