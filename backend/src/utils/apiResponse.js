class ApiResponse {
  static success(res, message, data = null, statusCode = 200) { return res.status(statusCode).json({ success: true, message, data }); }
  static created(res, message, data = null) { return res.status(201).json({ success: true, message, data }); }
  static paginated(res, message, data, pagination) { return res.status(200).json({ success: true, message, data, pagination }); }
  static error(res, message, statusCode = 500, errors = null) { return res.status(statusCode).json({ success: false, message, errors }); }
  static badRequest(res, message, errors = null) { return this.error(res, message, 400, errors); }
  static unauthorized(res, message = 'Unauthorized') { return this.error(res, message, 401); }
  static forbidden(res, message = 'Forbidden') { return this.error(res, message, 403); }
  static notFound(res, message = 'Not found') { return this.error(res, message, 404); }
}
module.exports = ApiResponse;
