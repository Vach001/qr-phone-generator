import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setPhoneNumber,
  setCountryCode,
  setQRCode,
  setLoading,
  setError,
} from "../store";
import phoneService from "../services/phoneService";
import qrService from "../services/qrService";
import "../styles/PhoneForm.css";

const PhoneForm = () => {
  const { phoneNumber, countryCode, loading, error } = useSelector(
    (state) => state.qr
  );
  const dispatch = useDispatch();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      const countryList = await phoneService.getCountryCodes();
      setCountries(countryList);
    } catch (error) {
      console.error("Failed to load countries:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phoneNumber.trim()) {
      dispatch(setError("Please enter a phone number"));
      return;
    }

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const validation = await phoneService.validatePhoneNumber(
        phoneNumber,
        countryCode
      );

      if (!validation.isValid) {
        dispatch(setError("Invalid phone number format"));
        return;
      }

      const qrCode = await qrService.generateQRCode(
        validation.internationalFormat
      );
      dispatch(setQRCode(qrCode));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const selectedCountry = countries.find(
    (country) => country.code === countryCode
  );

  return (
    <div className="phone-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <select
            id="country"
            value={countryCode}
            onChange={(e) => dispatch(setCountryCode(e.target.value))}
            className="country-select"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                <img
                  src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                  alt={country.name}
                  style={{ width: "20px", marginRight: "8px" }}
                />
                {country.name} ({country.dialCode})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <div className="input-group">
            <span className="dial-code">
              {selectedCountry?.dialCode || "+1"}
            </span>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => dispatch(setPhoneNumber(e.target.value))}
              placeholder="Enter your phone number"
              className="phone-input"
              disabled={loading}
            />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading} className="generate-btn">
          {loading ? (
            <>
              <span className="spinner"></span>
              Generating...
            </>
          ) : (
            "Generate QR Code"
          )}
        </button>
      </form>
    </div>
  );
};

export default PhoneForm;
