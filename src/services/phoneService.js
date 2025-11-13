import { parsePhoneNumberFromString } from 'libphonenumber-js'
import axios from 'axios'

class PhoneService {
  async validatePhoneNumber(phoneNumber, countryCode) {
    try {
      const phoneNumberObj = parsePhoneNumberFromString(phoneNumber, countryCode)
      
      if (!phoneNumberObj || !phoneNumberObj.isValid()) {
        throw new Error('Invalid phone number format for selected country')
      }

      return {
        isValid: true,
        internationalFormat: phoneNumberObj.formatInternational(),
        nationalFormat: phoneNumberObj.formatNational(),
        country: phoneNumberObj.country,
        carrier: phoneNumberObj.carrier
      }
    } catch (error) {
      return {
        isValid: false,
        error: error.message
      }
    }
  }

  async getCountryCodes() {
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all?fields=cca2,idd,flags,name')
      
      return response.data
        .filter(country => country.idd?.root && country.idd?.suffixes?.[0])
        .map(country => ({
          code: country.cca2,
          name: country.name.common,
          flag: country.flags?.png || '🏳️',
          dialCode: country.idd.root + country.idd.suffixes[0]
        }))
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(0, 50) // Limit to 50 countries for performance
    } catch (error) {
      console.warn('Using fallback countries due to API error:', error)
      return this.getEssentialCountries()
    }
  }

  getEssentialCountries() {
    return [
      { code: 'AM', name: 'Armenia', flag: '🇦🇲', dialCode: '+374' },
      { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
      { code: 'RU', name: 'Russia', flag: '🇷🇺', dialCode: '+7' },
      { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
      { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
      { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
      { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39' },
      { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34' },
      { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86' },
      { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
      { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81' },
      { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
      { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
      { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61' }
    ]
  }
}

export default new PhoneService()