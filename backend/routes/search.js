// const express = require('express');
// const elasticsearchClient = require('./elasticsearch'); 

// const router = express.Router();

// router.get('/', async (req, res) => {
//   const { query } = req.query;

//   try {
//     const { body } = await elasticsearchClient.search({
//       index: 'your_index_name',
//       body: {
//         query: {
//           multi_match: {
//             query: query,
//             fields: ['collectionName^2', 'itemName', 'comments', 'tags', 'additionalFields'],
//           },
//         },
//       },
//     });

//     const results = body.hits.hits.map(hit => hit._source);
//     res.json(results);
//   } catch (error) {
//     console.error('Error searching with Elasticsearch:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// module.exports = router;
