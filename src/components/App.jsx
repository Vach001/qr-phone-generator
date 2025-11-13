import PhoneForm from './PhoneForm'
import QRDisplay from './QRDisplay'
import '../styles/App.css'

const App = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>📱 QR Phone Number Generator</h1>
        <p>Create professional QR code for your phone number</p>
      </header>
      
      <main className="app-main">
        <div className="container">
          <PhoneForm />
          <QRDisplay />
        </div>
      </main>
      
      <footer className="app-footer">
        <p>&copy; 2024 QR Phone Generator. Professional QR Code Solution.</p>
      </footer>
    </div>
  )
}

export default App