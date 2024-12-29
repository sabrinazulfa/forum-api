const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const mockCommentReposiotry = new CommentRepository();

    const mockThread = { id: 'thread-123' };
    const mockComment = { id: 'comment-123' };
    const mockUser = { ownerId: 'user-123' };

    mockCommentReposiotry.checkAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentReposiotry.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentReposiotry.deleteCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentReposiotry,
    });

    await deleteCommentUseCase.execute({      
      commentId: mockComment.id,
      threadId: mockThread.id,
      ownerId: mockUser.ownerId,
    });
    
    expect(mockCommentReposiotry.checkAvailableComment).toBeCalledWith(mockComment.id);
    expect(mockCommentReposiotry.verifyCommentOwner).toBeCalledWith(mockComment.id, mockUser.ownerId);
    expect(mockCommentReposiotry.deleteCommentById).toBeCalledWith(
      mockThread.id,
      mockComment.id,
    );
  });
});