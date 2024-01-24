import React, { useState } from 'react';
import { Form, Container } from 'react-bootstrap';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useTheme } from '../contexts/ThemeContext';  

const ChangeUserInfo = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
 
  const handleChangePassword = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const response = await axios.put('/api/user/change-password', {
        oldPassword,
        newPassword,
      }, {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setSuccessMessage('Password changed successfully');
        setErrorMessage('');
      } else {
        setSuccessMessage('');
        setErrorMessage(response.data.message || 'Something went wrong. Please contact the site administrator.');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setSuccessMessage('');
      setErrorMessage('Something went wrong. Please contact the site administrator.');
    }
  };

  return (
    <Container className="mt-5">
      <Form>
        {successMessage && <p>{successMessage}</p>}
        {errorMessage && <p>{errorMessage}</p>}
        <Form.Group controlId="oldPassword" className="mb-4">
          <TextField
            id="oldPassword"
            label={t('Old password')}
            type="password"
            autoComplete="current-password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            sx={{
              backgroundColor: theme === 'dark' ? '#343a40' : 'transparent',
              color: theme === 'dark' ? 'white' : 'black',
              '& .MuiInputLabel-root': {
                color: theme === 'dark' ? '#ced4da' : 'rgba(0, 0, 0, 0.54)', 
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme === 'dark' ? '#343a40' : 'rgba(0, 0, 0, 0.23)',
                },
              },
            }}
          />
        </Form.Group>
        <Form.Group controlId="newPassword" className="mb-4">
          <TextField
            id="newPassword"
            label={t('New password')}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{
              backgroundColor: theme === 'dark' ? '#343a40' : 'transparent',
              color: theme === 'dark' ? 'white' : 'black',
              '& .MuiInputLabel-root': {
                color: theme === 'dark' ? '#ced4da' : 'rgba(0, 0, 0, 0.54)', 
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme === 'dark' ? '#343a40' : 'rgba(0, 0, 0, 0.23)',
                },
              },
            }}
          />
        </Form.Group>
        <Button 
          variant="outlined" 
          onClick={handleChangePassword} 
          sx={{
            color: theme === 'dark' ? 'white' : 'black',
            borderColor: theme === 'dark' ? 'white' : 'rgba(0, 0, 0, 0.23)',
          }}
        >          
          {t('Change password')}
        </Button>
      </Form>
    </Container>
  );
};

export default ChangeUserInfo;
