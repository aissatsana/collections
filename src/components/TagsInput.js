import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';

const TagsInput = ({onTagsChange, selectedTags}) => {
  const { t } = useTranslation();
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
    console.log(selectedTags);

  const fetchTags = async () => {
    setLoading(true);
    const response = await axios.get('/api/items/tags'); 
    setTags(response.data.tags);
    setLoading(false);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleTagsChange = (event, newValue) => {
    onTagsChange(newValue);
  };

  return (
    <Autocomplete
    multiple
    id="tags-filled"
    options={tags.map((option) => option.name)}
    loading={loading}
    value={selectedTags}
    onChange={handleTagsChange}
    freeSolo
    renderTags={(value, getTagProps) =>
      value.map((option, index) => (
        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
      ))
    }
    renderInput={(params) => (
      <TextField
        {...params}
        variant="filled"
        label={t('Tags')}
        placeholder={t(`Enter item's tags`)}
      />
    )}
    />
  );
};

export default TagsInput;
