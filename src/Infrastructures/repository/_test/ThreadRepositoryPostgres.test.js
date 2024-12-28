const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFounError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');

describe('ThreadRepositoryPostgres', () => {

  const owner = 'user-123';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser( {id: owner });
  })

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });
 
  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });
 
  describe('addUser function', () => {
    it('should persist add thread and return correctly', async () => {
      // Arrange
      const newThread = new AddThread({
        title: 'title of thread',
        body: 'body of thread',
      });
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
 
      // Action
      const addedThread = await threadRepositoryPostgres.addThread(
        'user-123',
        newThread,
      )
 
      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
      expect(addedThread).toStrictEqual(
        new AddedThread({
            id: 'thread-123',
            title: 'title of thread',
            owner: 'user-123',
        }),
      );
    });
  });


  describe('getThreadById function', () => {
    it('should throw NotFoundError id thread is not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
 
      await expect(threadRepositoryPostgres.getThreadbyId('thread-123')).rejects.toThrowError(NotFounError);
    });
 
    it('should not throw NotFoundError and return correct thread', async () => {
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title of thread',
        body: 'body of thread',
        owner: 'user-123',
        date: '2024-12-11T22:15:46.323Z',
      })

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const thread = await threadRepositoryPostgres.getThreadbyId('thread-123');

      expect(thread).toStrictEqual({
        id: 'thread-123',
        title: 'title of thread',
        body: 'body of thread',
        username: 'dicoding',
        date: expect.any(String),
      });
    });
  });

  describe('checkAvailableThread function')
});