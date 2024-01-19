import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Row, Col} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import Likes from '../components/Likes';
import Comments from '../components/Comments';

const Item = () => {
    const { t } = useTranslation();
    const { itemId } = useParams();
    const [item, setItem] = useState({});
    const [fields, setFields] = useState([]);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState([]);
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

    // const handleAddComment = async (comment) => {
    //     try {
    //         const token = JSON.parse(localStorage.getItem('token'));
    //         await axios.post(`/api/comments/${itemId}`, { content: comment.content }, {
    //             headers: {
    //                 'Authorization': `${token}`,
    //                 'Content-Type': 'application/json',
    //             },
    //         });
    //         setComments([...comments, { content: comment.content, user_id: comment.user_id , created_at: comment.created_at }]);
    //     } catch(error) {
    //         console.error('Error adding comment:', error);
    //     }
    // }
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

            <Likes likes={likes} isLiked={isLiked} handleLike={handleLike} />
            <Comments comments={comments} setComments={setComments} itemId={itemId} userId={userId}/>

        </Container>
    );
}
export default Item;