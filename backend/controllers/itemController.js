const pool = require('../utils/db');

exports.getItems = async (req, res) => {
  try {
    const collectionId = req.params.collectionId;
    const query = `SELECT * FROM items where collection_id = $1`;
    const result = await pool.query(query, [collectionId]);
    const items = result.rows;
    res.status(200).json({items});
  } catch (error) {
    console.error('Error getting items:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


exports.getItemById = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    let result = await pool.query(`SELECT * FROM items where id = $1`, [itemId]);
    const item = result.rows[0];
    result = await pool.query(`SELECT * FROM items_custom_fields where item_id = $1`, [itemId]);
    const fields = result.rows;
    res.status(200).json({item, fields});
  } catch (error) {
    console.error('Error getting item:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


exports.editItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { name, fieldValues, tags } = req.body;
    const updateItemQuery = `
      UPDATE items
      SET name = $1
      WHERE id = $2;
    `;
    await pool.query(updateItemQuery, [name, itemId]);

    const customFieldsQuery = `
      INSERT INTO items_custom_fields (item_id, field_type, field_name, field_value)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (item_id, field_name) DO UPDATE
      SET field_type = EXCLUDED.field_type, field_value = EXCLUDED.field_value;
    `;
    const customFieldsPromises = Object.entries(fieldValues).map(([fieldName, fieldInfo]) => {
      const { type, name, value } = fieldInfo;
      return pool.query(customFieldsQuery, [itemId, type, name, value]);
    });
    await Promise.all(customFieldsPromises);

    res.status(200).json({ success: true, message: 'Item updated successfully' });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


exports.deleteItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const query = `DELETE FROM items WHERE id = $1`;
    const result = await pool.query(query, [itemId]);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting items:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.createItem = async (req, res) => {
  try {
    const collectionId = req.params.collectionId;
    const {name, fieldValues, tags} = req.body;

    const itemQuery = `
    INSERT INTO items (name, collection_id)
    VALUES ($1, $2)
    RETURNING id;
  `;
  const itemResult = await pool.query(itemQuery, [name, collectionId]);
  const itemId = itemResult.rows[0].id;
  const customFieldsQuery = `
  INSERT INTO items_custom_fields (item_id, field_type, field_name, field_value)
  VALUES ($1, $2, $3, $4);
  `;
  const customFieldsPromises = Object.entries(fieldValues).map(([fieldName, fieldInfo]) => {
  const { type, name, value } = fieldInfo;
  return pool.query(customFieldsQuery, [itemId, type, name, value]);
  });
await Promise.all(customFieldsPromises);
res.status(200).json({ success: true, message: 'Item created successfully' });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
