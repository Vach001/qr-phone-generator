import { useSelector, useDispatch } from 'react-redux'
import { setQRCode } from '../store'
import qrService from '../services/qrService'
import '../styles/QRDisplay.css'

const QRDisplay = () => {
  const { qrCode, phoneNumber } = useSelector(state => state.qr)
  const dispatch = useDispatch()

  const handleDownload = () => {
    if (qrCode) {
      qrService.downloadQRCode(qrCode, phoneNumber)
    }
  }

  const handleShare = async () => {
    if (navigator.share && qrCode) {
      try {
        await navigator.share({
          title: 'Phone QR Code',
          text: `Call me: ${phoneNumber}`,
          files: [await (await fetch(qrCode)).blob()]
        })
      } catch (error) {
        console.log('Share failed:', error)
      }
    } else {
      handleDownload()
    }
  }

  if (!qrCode) {
    return (
      <div className="qr-display empty">
        <div className="placeholder">
          <div className="placeholder-icon">📱</div>
          <h3>Your QR Code Will Appear Here</h3>
          <p>Enter a phone number and click "Generate QR Code"</p>
        </div>
      </div>
    )
  }

  return (
    <div className="qr-display">
      <div className="qr-header">
        <h3>Your QR Code</h3>
        <div className="phone-number">{phoneNumber}</div>
      </div>
      
      <div className="qr-image-container">
        <img src={qrCode} alt="QR Code" className="qr-image" />
      </div>
      
      <div className="qr-actions">
        <button onClick={handleDownload} className="action-btn download-btn">
          Download PNG
        </button>
        <button onClick={handleShare} className="action-btn share-btn">
          Share
        </button>
      </div>
    </div>
  )
}

export default QRDisplay