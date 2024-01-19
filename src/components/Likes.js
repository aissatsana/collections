import React from "react";
import { Button } from "react-bootstrap";

const LikesComponent = ({ likes, isLiked, handleLike }) => {
  return (
    <div className="d-flex align-items-center">
      <Button onClick={handleLike}>
        {isLiked ? <i className="bi bi-heart"></i> : <i className="bi bi-heart-fill"></i>}
      </Button>
      <p className="m-0">{likes}</p>
    </div>
  );
};

export default LikesComponent;
