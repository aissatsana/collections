import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Form } from "react-bootstrap";
import io from "socket.io-client";
import axios from "axios";

const Comments = ({ comments, setComments, itemId, userId }) => {
  const { t } = useTranslation();
  const [newComment, setNewComment] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_SERVER); 
    setSocket(socket);
    socket.emit('joinItemRoom', itemId);
    return () => {
      socket.disconnect();
    };
  }, [itemId]);

  useEffect(() => {
    if (socket) {
      socket.on("updateComments", (comment) => {
        setComments([...comments, comment]);
      });
    }
  }, [socket, setComments, comments]);

  const handleAddComment = async () => {
    console.log(newComment, itemId, userId);
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      await axios.post(`/api/comments/${itemId}`, { content: newComment }, {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
      });
      const comment = { 
        item_id: itemId,
        content: newComment, 
        user_id: userId, 
        created_at: new Date().toISOString()
      }
      if (socket) {
        socket.emit("newComment", comment);
      }
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <>
      <div className="mt-4">
        <h3>{t('Comments')}</h3>
        {comments.map((comment) => (
            <div key={comment.id} className="mb-3">
            <p>{comment.content}</p>
            <p>{t('Posted by')}: {comment.user_id}</p>
            <p>{t('Created at')}: {comment.created_at}</p>
            </div>
        ))}
      </div>
      <div className="mt-4">
        <Form>
          <Form.Group controlId="commentTextarea" className="mb-2">
            <Form.Control
                as="textarea"
                rows={3}
                placeholder={t('Enter your comment')}             
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}              
            />
          </Form.Group>
          <Button variant="primary" type="button" onClick={handleAddComment}>
            {t('Add Comment')}
          </Button>
        </Form>
      </div>
    </>
  );
};

export default Comments;
