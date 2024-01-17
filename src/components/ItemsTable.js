import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Table, Button } from 'react-bootstrap';

const ItemsTable = ({ items, isOwner, updateItems, collection, collectionId }) => {
    const handleDelete = async (itemId) => {
        try {
          const response = await fetch(`/api/collection/${collectionId}/items/${itemId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            updateItems((prevItems) =>
            prevItems.filter((i) => i.id !== itemId)
          );
            console.log('Item deleted successfully');
          } else {
            console.error('Failed to delete item');
          }
        } catch (error) {
          console.error('Error deleting item:', error);
        }
    };
  return (
    <Row className="mt-4">
      <Col>
        <h3>Items</h3>
        {items.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                {isOwner && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  {isOwner && (
                    <td>
                      <Link to={`/collection/${collectionId}/edit/${item.id}`} state={{collection}} className="btn btn-secondary">
                        Edit
                      </Link>
                      <Button variant="danger" onClick={() => handleDelete(item.id)} className="btn ml-2">
                        Delete
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>Пока здесь ничего нет</p>
        )}
        {isOwner && (
          <Link to={`/collection/${collectionId}/item`} state={{collection}}  className="btn mt-2">
            Add New Item
          </Link>
        )}
      </Col>
    </Row>
  );
};

export default ItemsTable;
