/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');
 
const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', thread = 'thread-123', content = 'ini content secret', date = new Date().toISOString(), owner = 'user-123', isDelete = false,
  }) {
    const query = {
      text: 'INSERT INTO Comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, thread, content, date, owner, isDelete],
    };
 
    await pool.query(query);
  },
 
  async findCommentsById(id) {
    const query = {
      text: 'SELECT * FROM Comments WHERE id = $1',
      values: [id],
    };
 
    const result = await pool.query(query);
    return result.rows;
  },
 
  async cleanTable() {
    await pool.query('DELETE FROM Comments WHERE 1=1');
  },
};
 
module.exports = CommentsTableTestHelper;