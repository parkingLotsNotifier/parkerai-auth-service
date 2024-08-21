// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = err.message;

  // validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

module.exports = handleErrors;
