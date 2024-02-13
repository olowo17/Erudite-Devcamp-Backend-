
exports.getBootcamps = (req,res, next) =>{
    res.status(200).json({ success: true, msg: "show all bootcamp" });
}

exports.getBootcampById = (req,res, next) =>{
    res
      .status(200)
      .json({ success: true, msg: `show bootcamp ${req.params.id}` });
}

exports.postBootcamp = (req,res, next) =>{
    res.status(200).json({ success: true, msg: "create new bootcamp" });
}

exports.updateBootcamp =(req,res, next) =>{
    res
      .status(200)
      .json({ success: true, msg: `update bootcamp ${req.params.id}` });
}

exports.deleteBootcamp = (req,res, next) =>{
    res
    .status(200)
    .json({ success: true, msg: `delete bootcamp ${req.params.id}` });
}