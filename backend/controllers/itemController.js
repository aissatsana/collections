const pool = require('../ utils/db');

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

};


exports.editItem = async (req, res) => {

};

exports.deleteItem = async (req, res) => {

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
