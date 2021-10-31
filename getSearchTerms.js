const axios = require('axios');

const getSearchTerms = async (apiRoot) => {
  const { data } = await axios.get(`${apiRoot}/queries`);

  return data.map((item) => item.term);
};

module.exports = getSearchTerms;
