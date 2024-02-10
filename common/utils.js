const _ = require('lodash')

function _fakePagination(data, page = 1, limit = 20) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    count: _.get(data, "length", 0),
  };
}

function convertSortToOrder(sort) {
  const order = [];

  for (const [field, direction] of Object.entries(sort)) {
      const sortOrder = direction === -1 ? 'desc' : 'asc';
      order.push([field, sortOrder]);
  }

  return order;
}

module.exports = { _fakePagination, convertSortToOrder };
