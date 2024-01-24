import React from "react";
import { Button } from "react-bootstrap";
import { useTheme } from "../contexts/ThemeContext";

const LikesComponent = ({ likes, isLiked, handleLike }) => {
  const { theme } = useTheme();
  return (
    <div className="d-flex align-items-center">
      <Button onClick={handleLike} className="btn-secondary bg-transparent me-1">
        {isLiked ? 
          <i className="bi bi-heart-fill" style={{color: theme === 'dark' ? 'white' : "black"}}></i>
        : 
          <i className="bi bi-heart" style={{color: theme === 'dark' ? 'white' : "black"}}></i>
        }
      </Button>
      <p className="m-0">{likes}</p>
    </div>
  );
};

export default LikesComponent;
