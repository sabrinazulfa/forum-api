const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'Repuclic State National implementation in Indonesia',
      body: 'Recently Indonesia is in stage that defined by criticus on warning literation.',
    };

    const mockUser = {
      id: 'user-123',
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-456',
      title: useCasePayload.title,
      owner: mockUser.id,
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.checkAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addedThread = await addThreadUseCase.execute(
      mockUser.id,
      useCasePayload,
    );

    expect(addedThread).toStrictEqual(
      new AddedThread({
        id: 'thread-456',
        owner: mockUser.id,
        title: useCasePayload.title,
      }),
    );

    expect(mockThreadRepository.addThread).toBeCalledWith(
      mockUser.id,
      new AddThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
      }),
    );
  });
});
