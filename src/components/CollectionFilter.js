import React, { useState } from "react";
import { Form, Card, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import CategorySelector from "./CategorySelector";
import { useTheme } from "../contexts/ThemeContext";

function CollectionsFilter({ onApplyFilter }) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const defaultFilter = {
    selectedCategory: null,
    hasImage: false,
    hasItems: false,
    hasCustomFields: false,
  }
  const [filterOptions, setFilterOptions] = useState(defaultFilter);

  const handleCheckboxChange = (filterKey) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      [filterKey]: !prevOptions[filterKey],
    }));
  };

  const handleApplyFilter = () => {
    onApplyFilter(filterOptions);
  };

  const onSelectCategory = (categoryId) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      selectedCategory: Number(categoryId),
    }));
  };

  const handleResetFilters = () => {
    setFilterOptions(defaultFilter);
    onApplyFilter(defaultFilter);
  }
  return (
    <Card className={`${theme === 'dark' ? 'bg-dark text-white' : ''}`}>
      <Card.Body>
        <Form>
          <Form.Group controlId="filters">
            <Form.Label>
              <h3>{t('Filters')}:</h3>
            </Form.Label>

            <CategorySelector onSelect={onSelectCategory} currentCategory={filterOptions.selectedCategory} />

            <Form.Check
              type="checkbox"
              label={t('Has image')}
              checked={filterOptions.hasImage}
              onChange={() => handleCheckboxChange('hasImage')}
              className="mt-2 mb-2"
              id="hasImageCheckbox"
            />

            <Form.Check
              type="checkbox"
              label={t('Has items')}
              checked={filterOptions.hasItems}
              onChange={() => handleCheckboxChange('hasItems')}
              className="mb-2"
              id="hasItemsCheckbox"
            />

            <Form.Check
              type="checkbox"
              label={t('Has custom fields')}
              checked={filterOptions.hasCustomFields}
              onChange={() => handleCheckboxChange('hasCustomFields')}
              className="mb-2"
              id="hasCustomFieldsCheckbox"
            />

            <Button className="w-100 mb-2" variant="secondary" onClick={handleApplyFilter}>
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

export default CollectionsFilter;
