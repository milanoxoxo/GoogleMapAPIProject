import React, { useEffect, useState } from "react";
import Geocode from "react-geocode";
Geocode.setLanguage("en");
//AIzaSyComktdWf9tZzU5OP6k1qrtQR_dkvjmJds

const GetLocation = (props) => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState(null);

  const getLocation = () => {
    console.log(navigator);
    if (!navigator.geolocation) {
      setStatus("Geolocation is not supported by your browser");
    } else {
      setStatus("Locating...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setStatus(null);
          setLat(position.coords.latitude);
          setLng(position.coords.longitude);
        },
        () => {
          setStatus("Unable to retrieve your location");
        }
      );
    }
  };

  // useEffect(() => {
  //   // console.log(lat, lng)
  //   props.addLocation(lat, lng)
  // },[lat, lng])

  // Geocode.fromLatLng("48.8583701", "2.2922926").then(
  //   (response) => {
  //     const address = response.results[0].formatted_address;
  //     console.log(address);
  //   },
  //   (error) => {
  //     console.error(error);
  //   }
  // );

  return (
    <div className="getlocation">
      <button onClick={getLocation}>Get Location</button>
      <h4>Coordinates:</h4>
      <div>
        <p>{status}</p>
        {lat && <p>Latitude: {lat}</p>}
        {lng && <p>Longitude: {lng}</p>}
      </div>
    </div>
  );
};

export default GetLocation;
