const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commemtRepository ,threadRepository }) {
    this.commemtRepository = commemtRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId, ownerId, useCasePayload) {
    const newComment = new AddComment(useCasePayload);
    await this._threadRepository.checkThread(threadId);
  
    return  this._commentRepository.addComment(threadId, ownerId, newComment);
  }
}

module.exports = AddCommentUseCase;