const Joi = require('joi');


function validateRequest(schema) {
    return (req, res, next) => {
      let hasError = false; // Variable to track error status
      const options = ['body', 'params', 'query'];
      
      options.forEach(option => {
        if (schema[option]) {
          const { error } = schema[option].validate(req[option]);
          
          if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            res.status(400).json({ error: errorMessage });
            hasError = true; // Set error status to true
          }
        }
      });
      
      if (!hasError) {
        next(); // Call next only if no error occurred
      }
    };
  }
  


module.exports = validateRequest;