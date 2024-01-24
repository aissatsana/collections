import React from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const SortDropdown = ({ onSelect, sortMethod }) => {
  const { t } = useTranslation();
  return (
    <DropdownButton className="me-4" id="sort-collection" title={`${t('Sort by')} ${t(sortMethod)}`} onSelect={onSelect}>
      <Dropdown.Item key="name" eventKey="name">
        {t('By name')}
      </Dropdown.Item>
      <Dropdown.Item key="create-date" eventKey="create-date">
        {t('By created date')}
      </Dropdown.Item>
      <Dropdown.Item key="update-date" eventKey="update-date">
        {t('By updated date')}
      </Dropdown.Item>
    </DropdownButton>
  );
};

export default SortDropdown;
