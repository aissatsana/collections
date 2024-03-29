import React from 'react';
import { Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const LastAddedItems = ({items}) => {
  console.log(items);
    const { t } = useTranslation();
    const { theme } = useTheme();
    return (
        <>
        <h3>{t('Recently added items')}</h3>
        {items.length > 0 && (
            <div className='w-100'>
              <Table striped bordered hover responsive variant={theme}>
                <thead>
                  <tr>
                    <th>{t('Name')}</th>
                    <th>{t('Collection')}</th>
                    <th>{t('Username')}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <Link to={`/item/${item.id}`} className='link'>
                          {item.name}
                        </Link>
                      </td>
                      <td>
                        <Link to={`/collection/${item.collections.id}`} className='link'>
                          {item.collections.name}
                        </Link>
                      </td>
                      <td>
                        {item.users.username}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )} 
    </>
    )
}
export default LastAddedItems;