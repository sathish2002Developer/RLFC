const DEFAULT_KISSFLOW_WEBHOOK_URL =
  'https://refexgroup.kissflow.com/integration/2/AcCMptlq60zH/webhook/F51DqkQt8HoYqlSALpUWU8-uPOXxdSINKjZmtzXphM6Ujk-hJLw6lgZBW8NrIyyvXSmmZS9MwwaWdTmahBLNxQ';

function websiteSlugFromName(websiteName) {
  return String(websiteName)
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function randomLowerAlnum8() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  for (let i = 0; i < 8; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
}

function digitsOnly(phone) {
  if (phone == null || phone === '') return '';
  return String(phone).replace(/\D/g, '');
}

function parseBrowser(ua) {
  if (!ua) return 'unknown';
  const u = ua.toLowerCase();
  if (u.includes('edg/')) return 'edge';
  if (u.includes('chrome') && !u.includes('edg')) return 'chrome';
  if (u.includes('firefox')) return 'firefox';
  if (u.includes('safari') && !u.includes('chrome')) return 'safari';
  return 'other';
}

function parseDeviceType(ua) {
  if (!ua) return 'unknown';
  const u = ua.toLowerCase();
  if (/tablet|ipad|playbook|silk/i.test(u)) return 'tablet';
  if (/mobile|iphone|ipod|android.*mobile|blackberry|opera mini|iemobile/i.test(u)) return 'mobile';
  return 'desktop';
}

function localDateParts(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return {
    date: `${y}-${m}-${day}`,
    time: `${hh}:${mm}:${ss}`,
  };
}

/**
 * Build Kissflow webhook JSON body (UTF-8). Does not include recaptcha or raw phone string.
 */
function buildKissflowBody(req, body) {
  const now = new Date();
  const { date, time } = localDateParts(now);
  const referer = req.get('referer') || req.get('referrer') || '';
  const userAgent = req.get('user-agent') || '';

  const ipAddress =
    req.ip ||
    (typeof req.headers['x-forwarded-for'] === 'string'
      ? req.headers['x-forwarded-for'].split(',')[0].trim()
      : '') ||
    req.connection?.remoteAddress ||
    'Unknown';

  const countryCode =
    req.headers['cf-ipcountry'] ||
    req.headers['x-vercel-ip-country'] ||
    req.headers['cloudfront-viewer-country'] ||
    '';

  const fname = body.fname != null ? String(body.fname).trim() : '';
  const nameField = fname || String(body.name || '').trim();
  const org = body.organization != null ? String(body.organization).trim() : '';
  const companyField = org || String(body.company || '').trim() || '';

  const formAndMeta = {
    name: nameField,
    email: String(body.email || '').trim(),
    Phone_Number: digitsOnly(body.phone),
    company: companyField,
    city: String(body.city || '').trim(),
    Product: String(body.product || '').trim(),
    message: String(body.message || '').trim(),
    timestamp: Date.now(),
    dateTime: now.toISOString(),
    date,
    time,
    ipAddress,
    userAgent,
    deviceType: parseDeviceType(userAgent),
    browser: parseBrowser(userAgent),
    countryCode: countryCode || '',
    referer,
    source: referer ? referer : 'direct',
  };

  if (body.companySize != null && String(body.companySize).trim() !== '') {
    formAndMeta.companySize = String(body.companySize).trim();
  }
  if (body.inquiry != null && String(body.inquiry).trim() !== '') {
    formAndMeta.inquiry = String(body.inquiry).trim();
  }

  const websiteName = process.env.WEBSITE_NAME || 'Refex Life Sciences';
  const formName = 'Contact form';
  const slug = websiteSlugFromName(websiteName);
  const submissionId = `${slug}-${Date.now()}-${randomLowerAlnum8()}`;

  return {
    ...formAndMeta,
    submissionId,
    websiteName,
    formName,
    Website_and_form: `${websiteName} - ${formName}`,
  };
}

function getKissflowWebhookUrl() {
  return process.env.KISSFLOW_WEBHOOK_URL || DEFAULT_KISSFLOW_WEBHOOK_URL;
}

/**
 * Schedule POST to Kissflow after random 3000–4000 ms; does not block the caller.
 */
function queueKissflowWebhook(payload) {
  const url = getKissflowWebhookUrl();
  if (!url) {
    console.warn('Kissflow webhook URL missing; skipping queue.');
    return;
  }
  const delayMs = 3000 + Math.floor(Math.random() * 1001);

  setTimeout(() => {
    (async () => {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          console.error('Kissflow webhook non-OK:', res.status, await res.text().catch(() => ''));
        }
      } catch (err) {
        console.error('Kissflow webhook request failed:', err.message);
      }
    })();
  }, delayMs);
}

module.exports = {
  buildKissflowBody,
  queueKissflowWebhook,
  getKissflowWebhookUrl,
};
