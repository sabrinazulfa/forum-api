const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailedThread = require('../../Domains/threads/entities/DetailedThread');

class GetDetailThreadUseCase {
  constructor({ 
    threadRepository,
    commentRepository,
    }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const getThread = await this._threadRepository.getThreadById(threadId);

    if (getThread.length === 0) {
        throw new NotFoundError('Thread tidak ditemukan')
    }

    const getCommentByThreadId = await this._commentRepository.getCommentByThreadId(threadId);

    const comments = await Promise.all(getCommentByThreadId.map(async (comment) => ({
        id: comment.id,
        username: comment.username,
        date: comment.date,
        content: comment.is_delete ? '**Komentar sudah dihapus**' : comment.content,
    })))

    return new DetailedThread({
        id: getThread[0].id,
        title: getThread[0].title,
        body: getThread[0].body,
        date: getThread[0].date,
        username: getThread[0].username,
        comments,
    });
  }
}

module.exports = GetDetailThreadUseCase;