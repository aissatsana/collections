import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, Form } from "react-bootstrap";
import io from "socket.io-client";
import axios from "axios";
import { formatDate } from './helpers'; 
import { useAuth } from "../contexts/AuthContext";

const Comments = ({ comments, setComments, itemId, userId }) => {
  const { t } = useTranslation();
  const [newComment, setNewComment] = useState('');
  const [socket, setSocket] = useState(null);
  const { username } = useAuth();

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
        username: username,
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
          <Card key={comment.id} className="mb-3" style={{borderRadius: '10px', padding: '15px'}}>
            <div className="d-flex justify-content-between">
              <Card.Title>{comment.username}</Card.Title>
              <Card.Subtitle>{formatDate(comment.created_at)}</Card.Subtitle>
            </div>
            <Card.Text>{comment.content}</Card.Text>
          </Card>
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
          <Button variant="secondary" type="button" onClick={handleAddComment}>
            {t('Add comment')}
          </Button>
        </Form>
      </div>
    </>
  );
};

export default Comments;
