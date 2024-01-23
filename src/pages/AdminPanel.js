import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Form } from 'react-bootstrap';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const AdminPanel = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUserIds((prevSelectedUserIds) => {
      if (prevSelectedUserIds.includes(userId)) {
        return prevSelectedUserIds.filter((id) => id !== userId);
      } 
      return [...prevSelectedUserIds, userId];
    });
  };
  
  const handleUserStatusChange = async (status) => {
    const dictionary = {
        'block': 'blocked',
    'unblock': 'active',
};
    try {
      const response = await axios.post(`/api/admin/${status}`, { userIds: selectedUserIds });
      if (response.status === 200) {
        const updatedUsers = users.map((user) => ({
          ...user,
          status: selectedUserIds.includes(user.id) ? dictionary[status] : user.status,
        }));
        setUsers(updatedUsers);
        setSelectedUserIds([]);
      }
    } catch (error) {
      console.error(`Error ${status}ing user:`, error);
    }
  };

  const handleUserRoleChange = async (role) => {
    const dictionary = {
        'make-admin': 'admin',
    'revoke-admin': 'user',
};
    try {
      const response = await axios.post(`/api/admin/${role}`, { data: { userIds: selectedUserIds } });
      if (response.status === 200) {
        const updatedUsers = users.map((user) => ({
          ...user,
          role: selectedUserIds.includes(user.id) ? dictionary[role] : user.role,
        }));
        setUsers(updatedUsers);
        setSelectedUserIds([]);
      }
    } catch (error) {
      console.error(`Error ${role}ing user:`, error);
    }
  };
  
  
  const handleDeleteUser = async () => {
    try {
      const response = await axios.delete(`/api/admin/delete`, {userIds: selectedUserIds});
      if (response.status === 200) {
        const updatedUsers = users.filter((user) => !selectedUserIds.includes(user.id));
        setUsers(updatedUsers);
        setSelectedUserIds([]);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };


  return (
    <Container className="mt-4">
      <h3>{t('Admin panel')}</h3>
      <div className='d-flex mb-2'>
          <Button variant="light" className="me-2" onClick={() => handleDeleteUser()}>
            {t('Delete')}
          </Button>
          <Button variant="light" className="me-2" onClick={() => handleUserStatusChange('block')}>
            {t('Block')}
          </Button>
          <Button variant="light" className="me-2" onClick={() => handleUserStatusChange('unblock')}>
            {t('Unblock')}
          </Button>
          <Button variant="light" className="me-2" onClick={() => handleUserRoleChange('make-admin')}>
            {t('Make admin')}
          </Button>
          <Button variant="light" className="me-2" onClick={() => handleUserRoleChange('revoke-admin')}>
            {t('Revoke admin')}
          </Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th></th>
            <th>{t('ID')}</th>
            <th>{t('Name')}</th>
            <th>{t('E-mail')}</th>
            <th>{t('Admin')}</th>
            <th>{t('Status')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Form.Check
                  type="checkbox"
                  id={`checkbox-${user.id}`}
                  label=""
                  checked={selectedUserIds.includes(user.id)}
                  onChange={() => handleCheckboxChange(user.id)}
                />
              </td>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? t('Yes') : t('No')}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminPanel;
