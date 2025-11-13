import QRCode from 'qrcode'

class QRService {
  async generateQRCode(phoneNumber) {
    try {
      const telUri = `tel:${phoneNumber}`
      
      const qrCode = await QRCode.toDataURL(telUri, {
        width: 400,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#2C3E50',
          light: '#FFFFFF'
        }
      })

      return qrCode
    } catch (error) {
      throw new Error('Failed to generate QR code: ' + error.message)
    }
  }

  downloadQRCode(qrCode, phoneNumber) {
    try {
      const link = document.createElement('a')
      link.href = qrCode
      link.download = `phone-qr-${phoneNumber.replace(/\D/g, '')}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      throw new Error('Failed to download QR code: ' + error.message)
    }
  }
}

export default new QRService()