class DeleteCommentUseCase {
  constructor({
    commentRepository,
  }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { refreshToken } = useCasePayload;
    await this._commentRepository.checkAvailableComment(commentId);
    await this._commentRepository.verifyCommentOwner(commentId, ownerId);
    return this._commentRepository.deleteCommentById(threadId, commentId);
  }
}

module.exports = DeleteCommentUseCase;