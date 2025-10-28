import fs from 'fs';
import path from 'path';

/**
 * Sistema de logging avanzado con diferentes niveles y persistencia
 */
class Logger {
  constructor() {
    this.logDir = 'logs';
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` | Data: ${JSON.stringify(data)}` : '';
    return `[${level}] ${timestamp} - ${message}${dataStr}`;
  }

  writeToFile(level, message, data = null) {
    const logFile = path.join(this.logDir, `${level.toLowerCase()}.log`);
    const formattedMessage = this.formatMessage(level, message, data) + '\n';
    
    fs.appendFileSync(logFile, formattedMessage, 'utf8');
  }

  info(message, data = null) {
    const formattedMessage = this.formatMessage('INFO', message, data);
    console.log(formattedMessage);
    this.writeToFile('INFO', message, data);
  }

  error(message, error = null) {
    const errorData = error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : null;
    
    const formattedMessage = this.formatMessage('ERROR', message, errorData);
    console.error(formattedMessage);
    this.writeToFile('ERROR', message, errorData);
  }

  warn(message, data = null) {
    const formattedMessage = this.formatMessage('WARN', message, data);
    console.warn(formattedMessage);
    this.writeToFile('WARN', message, data);
  }

  debug(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage('DEBUG', message, data);
      console.log(formattedMessage);
      this.writeToFile('DEBUG', message, data);
    }
  }

  http(req, res, responseTime) {
    const logData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress
    };

    const message = `${req.method} ${req.url} ${res.statusCode} - ${responseTime}ms`;
    
    if (res.statusCode >= 400) {
      this.error(message, logData);
    } else {
      this.info(message, logData);
    }
  }

  security(event, details = null) {
    const message = `Security Event: ${event}`;
    this.warn(message, details);
    this.writeToFile('SECURITY', message, details);
  }

  audit(action, userId, details = null) {
    const auditData = {
      action,
      userId,
      timestamp: new Date().toISOString(),
      details
    };

    const message = `Audit: ${action} by user ${userId}`;
    this.info(message, auditData);
    this.writeToFile('AUDIT', message, auditData);
  }
}

export const logger = new Logger();
