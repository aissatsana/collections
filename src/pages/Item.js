import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Spinner} from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import Likes from '../components/Likes';
import Comments from '../components/Comments';
import TagsCloud from '../components/TagsCloud';

const Item = () => {
    const { itemId } = useParams();
    const [item, setItem] = useState({});
    const [fields, setFields] = useState([]);
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
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
            console.log(response.data.item);
            setFields(response.data.fields);
            setLikes(parseInt(response.data.likes.count));
            setIsLiked(response.data.likes.isUserLiked);
            setComments(response.data.comments);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching user collections:', error);
            setLoading(false);
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
    
    // const handleCommentsChange = () => {

    // }

    // const handleLikesChange = () => {
      
    // }
    return (
      <>
      {loading ? (
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
          <Spinner animation="border" />
        </div>
      ) : (
        <Container>
            <h1>{item.name}</h1>

            {fields.map((field) => (
              <p key={field.field_name} md={6} className="mb-4 d-flex align-items-end gap-1">
                <h2 className="m-0">{field.field_name}:</h2>
                <p className="m-0">{field.field_value}</p>
              </p>
            ))}
          <TagsCloud tags={item.tags.map(tag => ({ value: tag, count: 1 }))} />

          <Likes likes={likes} isLiked={isLiked} handleLike={handleLike} />
          <Comments comments={comments} setComments={setComments} itemId={itemId} userId={userId}/>

        </Container>
      )}
      </>
    );
}
export default Item;