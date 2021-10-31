const axios = require('axios');

const createLead = async (apiLoc, leadData) => {
  await axios.post(`${apiLoc}/lead`, leadData);
};

module.exports = createLead;
