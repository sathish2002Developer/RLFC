const express = require('express');
const router = express.Router();
const emailService = require('../services/email_service');
const { queueKissflowWebhook, buildKissflowBody } = require('../services/kissflow_webhook');
const { body, validationResult } = require('express-validator');

router.post('/contact-form', [
  body('fname')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('First name must be at most 100 characters'),

  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s\-']+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),

  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),

  body('phone')
    .optional({ values: 'falsy' })
    .custom((value) => {
      if (value == null || value === '') return true;
      const digits = String(value).replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 15) {
        throw new Error('Please provide a valid phone number');
      }
      return true;
    }),

  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('City must be between 1 and 200 characters'),

  body('product')
    .trim()
    .notEmpty()
    .withMessage('Product is required')
    .isIn(['Modepro', 'RLFC', 'Extrovis'])
    .withMessage('Product must be Modepro, RLFC, or Extrovis'),

  body('organization')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Organization must be less than 200 characters'),

  body('company')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Company name must be less than 200 characters'),

  body('companySize')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company size must be at most 100 characters'),

  body('inquiry')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Inquiry must be at most 2000 characters'),

  body('message')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Message must be between 10 and 500 characters'),

  body('recaptchaToken')
    .notEmpty()
    .withMessage('reCAPTCHA verification is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { name, email, phone, city, product, company, message, recaptchaToken } = req.body;

    const ipAddress =
      req.ip ||
      (typeof req.headers['x-forwarded-for'] === 'string'
        ? req.headers['x-forwarded-for'].split(',')[0].trim()
        : '') ||
      req.connection?.remoteAddress ||
      'Unknown';

    const kissflowPayload = buildKissflowBody(req, req.body);
    queueKissflowWebhook(kissflowPayload);

    const formData = {
      name,
      email,
      phone,
      city,
      product,
      company,
      message,
      recaptchaToken,
      ipAddress,
      timestamp: new Date().toISOString(),
    };

    let emailResult = {
      messageId: null,
      skipped: true,
    };
    try {
      emailResult = await emailService.sendContactFormEmail(formData);
    } catch (emailErr) {
      console.error(
        'Contact notification email failed (submission still recorded):',
        emailErr.message
      );
    }

    try {
      await emailService.sendAutoReply(email, name, city, product);
    } catch (autoReplyError) {
      console.warn('Auto-reply failed:', autoReplyError.message);
    }

    console.log(
      `Contact form submitted successfully by ${name} (${email}) [${city}] at ${new Date().toISOString()}`
    );

    return res.status(200).json({
      success: true,
      message: 'Thank you for your message! We will get back to you within 24 hours.',
      data: {
        messageId: emailResult.messageId,
        timestamp: formData.timestamp,
      },
    });
  } catch (error) {
    console.error('Contact form submission error:', error);

    return res.status(500).json({
      success: false,
      message:
        'Sorry, there was an error sending your message. Please try again or contact us directly.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
});

router.get('/test-email', async (req, res) => {
  try {
    const isConnected = await emailService.testConnection();

    if (isConnected) {
      return res.json({
        success: true,
        message: 'Email service is working correctly',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Email service connection failed',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Email service test failed',
      error: error.message,
    });
  }
});

module.exports = router;
