import React, { useState, useEffect } from "react";
import axios from "axios";
import { TagCloud } from 'react-tagcloud';
import { useTranslation } from "react-i18next";


const TagsCloud = () => {
    const { t } = useTranslation();
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
        <h3>{t('Tags')}</h3>
        {tags.length > 0 ? (
          <TagCloud
          tags={tags}
          styleOptions={{
            luminosity: 'light',
            fontSizes: [20, 40],
            fontWeight: 'bold',
            colorOptions: { hue: 'blue' },
          }}
          className="tag-cloud d-flex justify-content-between flex-wrap"
        />
        ) : (
            <div>теги грузятся</div>
        )}
      </>
    )
}
export default TagsCloud;