import { useState, useEffect } from 'react'
import './LocBox.css'
import useReverseGeocoding from 'use-reverse-geocoding'

function Geolocation() {
  const [locationInfo, setLocationInfo] = useState(null)
  const [address, setAddress] = useState(null)
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocationInfo({ latitude, longitude })
          console.log({locationInfo})
        }, 
        (error) => {
          console.error('Error fetching location data:', error)
        }
      )
    }
    else {
      console.error('Gelocation not supported')
    }
  }


  return (
    
    <>
    <div className='pos'>
    <button className='butt' onClick={getLocation}>Get User Location</button>
    {locationInfo && (
    <div>
     <p className='text'> Longitude: {locationInfo.longitude} </p>
     <p className='text'> Latitude: {locationInfo.latitude} </p>
    </div>
    )}
    </div>
    </>
  
  )
}

export default Geolocation
