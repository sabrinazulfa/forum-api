/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('reply_comment', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    is_delete: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
    date: {
      type: 'TEXT',
      notNull: true,
    },
  });

  pgm.addConstraint(
    'reply_comment',
    'fk_reply_comment.comment_id_comments.id',
    'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'reply_comment',
    'fk_reply_comment.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('reply_comment', 'fk_reply_comment.comment_id_comments.id');
  pgm.dropConstraint('reply_comment', 'fk_reply_comment.owner_users.id');
  pgm.dropTable('reply_comment');
};
