const pool = require('../../database/postgres/pool');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');

const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 401 when there is missing auth', async () => {
      // Arrange
      const requestPayload = {
        title: 'title of thread',
        body: 'body of thread',
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual('Unauthorization');
      expect(responseJson.message).toEqual('Missing Authentication');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const requestPayload = { 
        title: 'The missing Body',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: { 
            username: loginPayload.username,
            password: loginPayload.password,
            fullname: 'Dicoding Indonesia',
        },
      });

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const authResponse = JSON.parse(auth.payload);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${authResponse.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
      );
    });

    it('should response 400 when request payload has invalid property type', async () => {
     const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };

      const requestPayload = {
        title: 'Body with invalid type',
        body: 123456,
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: { 
            username: loginPayload.username,
            password: loginPayload.password,
            fullname: 'Dicoding Indonesia',
        },
      });

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const authResponse = JSON.parse(auth.payload);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${authResponse.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena ketidaksesuaian tipe data',
      );
    });

    it('should response 201 and persisted thread', async () => {
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };    
      // Arrange
      const requestPayload = {
        title: 'title of thread',
        body: 'body of thread',
      };
      const server = await createServer(container);
      
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: { 
            username: loginPayload.username,
            password: loginPayload.password,
            fullname: 'Dicoding Indonesia',
        },
      });

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const authResponse = JSON.parse(auth.payload);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${authResponse.data.accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.message).toEqual(requestPayload.title);
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('it should response 404 when thread not found', async () => {
        const server = await createServer(container);

        const response = await server.inject({
            method: 'GET',
            url: '/threads/123',
        });
        const responseJson = JSON.parse(response.payload);

        expect(response.statusCode).toEqual(404);
        expect(responseJson.status).toEqual('fail');
        expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('it should return a thread with details', async () => {
      const loginPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const threadPayload = {
        title: 'title of thread',
        body: 'body of thread',
      };
      const commentPayload = {
        content: 'Test comment',
      };
      const replyPayload = {
        content: 'My reply',
      };

      const server = await createServer(container);
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
            username: loginPayload.username,
            password: loginPayload.password,
            fullname: 'Dicoding Indonesia',
        },
      });

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });
      const authResponse = JSON.parse(auth.payload);
      const authToken = authResponse.data.accessToken;

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const threadResponse = JSON.parse(thread.payload);
      const threadId = threadResponse.data.addedThread.id;

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: commentPayload,
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const commentResponse = JSON.parse(comment.payload);
      const commentId = commentResponse.data.addedComment.id;

      await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: replyPayload,
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const response = await server.inject({
        method: 'GET',
        url: `threads/${threadId}`,
      });
      const responseJson = JSON.parse(response.payload);

      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread.title).toEqual(threadPayload.title);
      expect(responseJson.data.thread.body).toEqual(threadPayload.body);
      expect(responseJson.data.thread.username).toEqual(loginPayload.username);
      expect(Array.isArray(responseJson.data.thread.comment)).toBe(true);
    });
  });
});