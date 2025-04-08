import axiosBaseUrl from "../Axios/axios"

const getGeoAndIp = async () => {
  try {
    const response = await axiosBaseUrl.get('https://ipapi.co/json/')
    return {
      ip: response.data.ip || null,
      geolocation: {
        latitude: response.data.latitude || null,
        longitude: response.data.longitude || null
      }
    }
  } catch (error) {
    console.warn('IP & Geolocation fetch error:', error.message)
    return {
      ip: null,
      geolocation: { latitude: null, longitude: null }
    }
  }
}

export default getGeoAndIp
