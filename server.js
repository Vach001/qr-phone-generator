import express from 'express';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Երկրների կոդերի բազա
const countryCodes = [
  { code: '374', name: 'Armenia', flag: '🇦🇲', pattern: /^\+374[1-9]\d{7}$/ },
  { code: '7', name: 'Russia', flag: '🇷🇺', pattern: /^\+7[0-9]{10}$/ },
  { code: '1', name: 'USA/Canada', flag: '🇺🇸', pattern: /^\+1[0-9]{10}$/ },
  { code: '44', name: 'UK', flag: '🇬🇧', pattern: /^\+44[0-9]{9,10}$/ },
  { code: '33', name: 'France', flag: '🇫🇷', pattern: /^\+33[0-9]{9}$/ },
  { code: '49', name: 'Germany', flag: '🇩🇪', pattern: /^\+49[0-9]{10,11}$/ },
  { code: '39', name: 'Italy', flag: '🇮🇹', pattern: /^\+39[0-9]{9,10}$/ },
  { code: '34', name: 'Spain', flag: '🇪🇸', pattern: /^\+34[0-9]{9}$/ },
  { code: '86', name: 'China', flag: '🇨🇳', pattern: /^\+86[0-9]{11}$/ },
  { code: '91', name: 'India', flag: '🇮🇳', pattern: /^\+91[0-9]{10}$/ },
  { code: '971', name: 'UAE', flag: '🇦🇪', pattern: /^\+971[0-9]{9}$/ }
];

// Գլխավոր էջ
app.get('/', (req, res) => {
  res.render('index', {
    qrCode: null,
    phoneNumber: '',
    error: null,
    countryCodes,
    selectedCountry: '374'
  });
});

// QR կոդի ստեղծում
app.post('/generate', async (req, res) => {
  try {
    const { phoneNumber, countryCode } = req.body;
    
    if (!phoneNumber) {
      return res.render('index', {
        qrCode: null,
        phoneNumber: '',
        error: 'Please enter phone number',
        countryCodes,
        selectedCountry: countryCode || '374'
      });
    }

    // Մաքրել համարը
    let cleanNumber = phoneNumber.replace(/\s+/g, '').replace(/^-+/, '');
    
    // Ավելացնել երկրի կոդ
    if (!cleanNumber.startsWith('+')) {
      const country = countryCodes.find(c => c.code === countryCode);
      if (country) {
        cleanNumber = `+${countryCode}${cleanNumber}`;
      } else {
        cleanNumber = `+${cleanNumber}`;
      }
    }

    // Վալիդացիա
    const country = countryCodes.find(c => cleanNumber.startsWith(`+${c.code}`));
    if (country && !country.pattern.test(cleanNumber)) {
      return res.render('index', {
        qrCode: null,
        phoneNumber: cleanNumber,
        error: `Invalid phone number format for ${country.name}`,
        countryCodes,
        selectedCountry: countryCode
      });
    }

    // Ստեղծել QR կոդ
    const telUri = `tel:${cleanNumber}`;
    const qrCodeDataURL = await QRCode.toDataURL(telUri, {
      width: 400,
      margin: 3,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#2C3E50',
        light: '#FFFFFF'
      }
    });

    res.render('index', {
      qrCode: qrCodeDataURL,
      phoneNumber: cleanNumber,
      error: null,
      countryCodes,
      selectedCountry: countryCode
    });

  } catch (error) {
    console.error('QR generation error:', error);
    res.render('index', {
      qrCode: null,
      phoneNumber: req.body.phoneNumber || '',
      error: 'Error generating QR code',
      countryCodes,
      selectedCountry: req.body.countryCode || '374'
    });
  }
});

// API endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { phoneNumber, countryCode = '374' } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    let cleanNumber = phoneNumber.replace(/\s+/g, '');
    if (!cleanNumber.startsWith('+')) {
      cleanNumber = `+${countryCode}${cleanNumber}`;
    }

    const qrCodeDataURL = await QRCode.toDataURL(`tel:${cleanNumber}`, {
      width: 400,
      errorCorrectionLevel: 'H'
    });

    res.json({
      success: true,
      phoneNumber: cleanNumber,
      qrCode: qrCodeDataURL,
      telUri: `tel:${cleanNumber}`
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ստատիստիկա
app.get('/stats', (req, res) => {
  res.json({
    version: '1.0.0',
    supportedCountries: countryCodes.length,
    features: ['QR Generation', 'International Support', 'API Access']
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📞 Supported countries: ${countryCodes.length}`);
});