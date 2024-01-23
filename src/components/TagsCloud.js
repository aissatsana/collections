import React, { useState, useEffect } from "react";
import { TagCloud } from 'react-tagcloud';
import { useTranslation } from "react-i18next";


const TagsCloud = ({tagsData}) => {
    const { t } = useTranslation();
    const [tags, setTags] = useState([]);
    useEffect(() => {
      const formattedTags = tagsData.map(tag => ({ value: tag.name, count: 1 }));
      setTags(formattedTags);
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