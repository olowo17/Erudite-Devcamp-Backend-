const advancedResults = (model,populate)=>async (req,res,next)=>{
    let query;

  // copy te request query
  const reqQuery = { ...req.query };

  // removing contradictory fields
  const removeFields = ["select", "sort", "limit", "page"];

  // loop over remove fields and delete from the reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  console.log(reqQuery);

  //create query string
  let queryString = JSON.stringify(reqQuery);

  query = model.find(JSON.parse(queryString));

  //select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    console.log(fields);
    query = query.select(fields);
  }

  //sort fields
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    console.log(sortBy);
    query = query.sort(sortBy);
    console.log(query);
  } else {
    query = query.sort("-createdAt");
  }

  // pagintion: limit and page
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if(populate){
    query = query.populate(populate)
  }

  //Executing the query
  const results = await query;

  //  pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      pageNo: page + 1,
      count: limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      pageNo: page - 1,
      count: limit,
    };
  }

  res.advancedResults ={
    success:true,
    count: results.length,
    pagination,
    data:results
  }
  next( )

}

module.exports = advancedResults;