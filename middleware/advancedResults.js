const advancedResults = (model, populate) => async (req, res, next) => {
  let query;

  // Excluded query params values
  const excludedStrings = ['select', 'sort', 'page', 'limit'];

  // Query params copy
  let queryCopy = { ...req.query };

  // Delete excluded params
  excludedStrings.forEach(param => delete queryCopy[param]);

  // Stringify query params
  let queryStr = JSON.stringify(queryCopy);

  // Transform query params
  queryStr = queryStr.replace(/\b(lt|lte|gt|gte|in)\b/g, match => `$${match}`);

  // Parse query params
  query = model.find(JSON.parse(queryStr)).populate(populate);

  // Select actions
  if (req.query.select) {
    const selectFields = req.query.select.split(',').join(' ');

    query.select(selectFields);
  }

  // Sort actions
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');

    query.sort(sortBy);
  } else {
    query.sort('-createdAt');
  }

  // Paginate actions
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query.skip(startIndex).limit(limit);

  const resources = await query;

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.advancedResults = {
    success: true,
    count: resources.length,
    pagination,
    data: resources
  };

  next();
};

module.exports = advancedResults;
