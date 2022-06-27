const sendErrorResponse = (message) => {
  return {
    success: false,
    message: message || "Internal server error",
  };
};

const sendSuccessResponse = (data, message) => {
  return {
    success: true,
    message: message || "Success",
    data: data || null,
  };
};

module.exports = { sendSuccessResponse, sendErrorResponse };
