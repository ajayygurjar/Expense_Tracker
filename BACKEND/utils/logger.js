
// ACTION: CREATE NEW FILE


const fs = require("fs");
const path = require("path");
const morgan = require("morgan");


// CREATE LOGS DIRECTORY

// This creates the logs folder if it doesn't exist
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}


// CREATE FILE STREAMS FOR LOGGING

// Create a write stream for access logs (all HTTP requests)
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, "access.log"),
  { flags: "a" } // 'a' means append mode (doesn't overwrite existing logs)
);

// Create a write stream for error logs
const errorLogStream = fs.createWriteStream(
  path.join(logsDir, "error.log"),
  { flags: "a" }
);

// CUSTOM TOKENS FOR MORGAN

// Custom token to log the user ID from JWT token
morgan.token("user-id", (req) => {
  return req.user ? req.user.userId : "guest";
});

// Custom token for ISO timestamp
morgan.token("timestamp", () => {
  return new Date().toISOString();
});

// DEFINE LOG FORMATS
const accessLogFormat = ':timestamp :method :url :status :response-time ms - :user-id - :remote-addr';

// CREATE MORGAN MIDDLEWARE

// Morgan middleware for access logs (writes to file)
const accessLogger = morgan(accessLogFormat, {
  stream: accessLogStream,
});

const consoleLogger = morgan('dev');


// ERROR LOGGING FUNCTION

// Function to log errors to error.log file
const logError = (err, req, res) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    userId: req.user ? req.user.userId : "guest",
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get("user-agent"),
    error: {
      message: err.message,
      stack: err.stack,
    },
  };

  // Write to error log file
  errorLogStream.write(JSON.stringify(errorLog) + "\n");

  // Also log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("ERROR:", errorLog);
  }
};

// ERROR LOGGER MIDDLEWARE

// Middleware to automatically log errors
const errorLogger = (err, req, res, next) => {
  logError(err, req, res);
  next(err);
};

// EXPORT ALL FUNCTIONS

module.exports = {
  accessLogger, 
  consoleLogger,
  errorLogger,
  logError,
};