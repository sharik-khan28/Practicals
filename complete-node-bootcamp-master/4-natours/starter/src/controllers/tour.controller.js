const Tour = require('../models/tour.model');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const featuresQuery = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .selectFields()
      .paginate();
    const tours = await featuresQuery.query;
    res.status(200).json({
      status: 'Success',
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failure',
      message: err.message,
    });
  }
};

exports.getTourById = async (req, res) => {
  // eslint-disable-next-line prettier/prettier
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour)
      return res.status(404).json({
        status: 'Failure',
        message: 'Tour does not exist',
      });
    res.status(200).json({
      status: 'Success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failure',
      message: err.message,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'Success',
      data: {
        newTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failure',
      message: err.message,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      upsert: true,
    });
    res.status(200).json({
      status: 'Updated',
      data: {
        updatedTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failure',
      message: err.message,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      error: 'error',
      message: 'Yet to be implemented',
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failure',
      message: err.message,
    });
  }
};

exports.getToursStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRatings: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: 'price' },
        },
      },
    ]);
    res.status(200).json({
      status: 'Success',
      body: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failure',
      message: err.message,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const monthlyPlan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numToursStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: { _id: 0 },
      },
      {
        $sort: { numToursStarts: -1 },
      },
    ]);
    res.status(200).json({
      status: 'Success',
      body: {
        monthlyPlan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Failure',
      message: err.message,
    });
  }
};
