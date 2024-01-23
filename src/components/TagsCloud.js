import React, { useState, useEffect } from "react";
import axios from "axios";
import { TagCloud } from 'react-tagcloud';


const TagsCloud = () => {
    const [tags, setTags] = useState([]);
    useEffect(() => {
      const fetchTags = async () => {
        try {
          const response = await axios.get('/api/items/tags');
          const tags = response.data.tags;
          const formattedTags = tags.map(tag => ({ value: tag.name, count: 1 }));
          setTags(formattedTags);
        } catch (error) {
          console.error('Error fetching tags: ', error);
        }
      }
      fetchTags();
    }, [])
    return (
      <>
        {tags.length > 0 ? (
            <TagCloud tags={tags} />
        ) : (
            <div>теги грузятся</div>
        )}
      </>
    )
}
export default TagsCloud;