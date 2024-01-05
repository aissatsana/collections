import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const StringField = ({ label, value, onChange }) => {
  const { t } = useTranslation();

  return (
    <Form.Group controlId={label}>
      <Form.Label>{t(label)}:</Form.Label>
      <Form.Control type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    </Form.Group>
  );
};

const IntegerField = ({ label, value, onChange }) => {
  const { t } = useTranslation();

  return (
    <Form.Group controlId={label}>
      <Form.Label>{t(label)}:</Form.Label>
      <Form.Control type="number" value={value} onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)} />
    </Form.Group>
  );
};

const DateField = ({ label, value, onChange }) => {
    const { t } = useTranslation();
  
    return (
      <Form.Group controlId={label}>
        <Form.Label>{t(label)}:</Form.Label>
        <Form.Control type="date" value={value} onChange={(e) => onChange(e.target.value)} />
      </Form.Group>
    );
  };

export { StringField, IntegerField,  DateField};
