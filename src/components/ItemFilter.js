import React, { useState } from "react";
import { Form, Card, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

function ItemFilter({ onApplyFilter }) {
  const { t } = useTranslation();
  const defaultFilter = {
    hasComments: null,
    countLikes: 0,
  }
  const [filterOptions, setFilterOptions] = useState(defaultFilter);

  const handleCheckboxChange = (filterKey) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      [filterKey]: !prevOptions[filterKey],
    }));
  };

  const handleCountLikesChange = (e) => {
    const countLikes = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      countLikes,
    }));
  };

  const handleApplyFilter = () => {
    onApplyFilter(filterOptions);
  };

  const handleResetFilters = () => {
    setFilterOptions(defaultFilter);
    onApplyFilter(defaultFilter);
  }

  return (
    <Card className="me-2">
      <Card.Body>
        <Form>
          <Form.Group controlId="filters">
            <Form.Label>
              <h3>{t('Filters')}:</h3>
            </Form.Label>
            <Form.Check
              type="checkbox"
              label={t('Has comments')}
              checked={filterOptions.hasComments}
              onChange={() => handleCheckboxChange('hasComments')}
              className="mt-2 mb-2"
              id="hasCommentsCheckbox"
            />
            <Form.Group controlId="countLikes">
              <Form.Label>{t('Count likes')}</Form.Label>
              <Form.Control
                type="number"
                placeholder={t('Enter count')}
                value={filterOptions.countLikes || ''}
                onChange={handleCountLikesChange}
              />
              <Form.Range
                min="1"
                max="10"
                step="1"
                value={filterOptions.countLikes || ''}
                onChange={handleCountLikesChange}
              />
            </Form.Group>

            <Button className="w-100 mb-2" variant="primary" onClick={handleApplyFilter}>
              {t('Apply filter')}
            </Button>
            <Button className="w-100" variant="secondary" onClick={handleResetFilters}>
              {t('Reset')}
            </Button>
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ItemFilter;
