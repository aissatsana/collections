import React from "react";
import { Button } from "react-bootstrap";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const LikesComponent = ({ likes, isLiked, handleLike }) => {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  return (
    <div className="d-flex align-items-center">
      <Button 
        onClick={isAuthenticated ? handleLike : null} 
        className={`btn-secondary bg-transparent me-1 ${!isAuthenticated && 'cursor-not-allowed'}`}
        disabled={!isAuthenticated}
      >
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
