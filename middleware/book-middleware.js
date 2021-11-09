const yup = require('yup');


const validateBook = async (req, res, next) => {
  try {
    const schema = yup.object({
      body: yup.object({
        title: yup.string().min(3).max(128).required(),
        content: yup.string().optional(),
      }),
      //   params: yup.object({
      //     id: yup.number().required(),
      //   }),
    });

    await schema.validate({
      body: req.body,
      // query: req.query,
      // params: req.params,
    });

    const castedBody = schema.cast({ body: req.body });
    req.body = castedBody.body;

    return next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

module.exports = {
  validateBook,
};
