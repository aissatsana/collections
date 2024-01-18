import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";

const Item = () => {
    const { t } = useTranslation();
    const { itemId } = useParams();
    const [item, setItem] = useState({});
    const [fields, setFields] = useState([]);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { userId } = useAuth();

    useEffect(() => {
        const fetchItem = async () => {
          try {
            const token = JSON.parse(localStorage.getItem('token'));
            const response = await axios.get(`/api/items/${itemId}`, {
              headers: {
                'Authorization': `${token}`,
                'Content-Type': 'application/json',
              },
            });
            setItem(response.data.item);
            setFields(response.data.fields);
            console.log(response.data.likes);
            setLikes(parseInt(response.data.likes.like_count));
            setIsLiked(response.data.likes.user_liked);
            setComments(response.data.comments);
          } catch (error) {
            console.error('Error fetching user collections:', error);
          }
        };
        fetchItem();
    },[itemId]);

    const handleLike = async () => {
        try {
          const token = JSON.parse(localStorage.getItem('token'));
          await axios.post(`/api/likes/${itemId}`, { isLiked }, {
            headers: {
              'Authorization': `${token}`,
              'Content-Type': 'application/json',
            },
          });
          setLikes(likes + (isLiked ? -1 : 1));
          setIsLiked(!isLiked);
        } catch (error) {
          console.error('Error liking item:', error);
        }
    };

    const handleAddComment = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('token'));
            await axios.post(`/api/comments/${itemId}`, { content: newComment }, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setComments([...comments, { content: newComment, user_id: userId , created_at: new Date().toISOString() }]);
            setNewComment('');
        } catch(error) {
            console.error('Error adding comment:', error);
        }
    }
    return (
        <Container>
          <h1>{item.name}</h1>
          <Row>
            {fields.map((field) => (
                <Col key={field.field_name} md={6} className="mb-4">
                <h2 className="mb-2">{field.field_name}</h2>
                <p>{field.field_value}</p>
                </Col>
            ))}
            </Row>
            <div className="d-flex align-items-center">
                <Button onClick={() => handleLike()}>
                    {isLiked ? <i class="bi bi-heart"></i> : <i class="bi bi-heart-fill"></i>}
                </Button>
                <p className="m-0">{t('Likes')}: {likes}</p>
            </div>

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
                    <Form.Group controlId="commentTextarea">
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

        </Container>
    );
}
export default Item;