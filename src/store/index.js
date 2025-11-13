import { configureStore, createSlice } from '@reduxjs/toolkit'

const qrSlice = createSlice({
  name: 'qr',
  initialState: {
    phoneNumber: '',
    countryCode: 'AM',
    qrCode: null,
    loading: false,
    error: null
  },
  reducers: {
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload
    },
    setCountryCode: (state, action) => {
      state.countryCode = action.payload
    },
    setQRCode: (state, action) => {
      state.qrCode = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { 
  setPhoneNumber, 
  setCountryCode, 
  setQRCode, 
  setLoading, 
  setError 
} = qrSlice.actions

const store = configureStore({
  reducer: {
    qr: qrSlice.reducer
  }
})
export default store;