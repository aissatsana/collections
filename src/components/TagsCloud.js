import React, { useState, useEffect } from "react";
import { TagCloud } from 'react-tagcloud';
import { useTranslation } from "react-i18next";
import { useTheme } from '../contexts/ThemeContext';
// import '../styles/tag-cloud.css';


const TagsCloud = ({tags}) => {
  const { theme } = useTheme();
    const { t } = useTranslation();
    // const [tags, setTags] = useState([]);
    // useEffect(() => {
    //   const formattedTags = tagsData.map(tag => ({ value: tag.name, count: 1 }));
    //   setTags(formattedTags);
    // }, [tagsData])
    return (
      <>
        <h3>{t('Tags')}</h3>
        {tags.length > 0 && (
          <TagCloud
          tags={tags}
          styleOptions={{
            luminosity: {theme},
            fontSizes: [20, 40],
            fontWeight: 'bold',
            colorOptions: { hue: 'blue' },
          }}
          className="tag-cloud d-flex justify-content-between flex-wrap"
        />)}
      </>
    )
}
export default TagsCloud;