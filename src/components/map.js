import { useState, useMemo, useCallback, useRef, Fragment } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import Places from "./places";
// import Distance from "./distance";

function Map() {
  const [marks, setMarks] = useState([]);
  const [data, setData] = useState({
    date: "",
    timezone: "",
    localdate: "",
  });
  const mapRef = useRef();
  const center = useMemo(() => ({ lat: 43.65, lng: -79.38 }), []);

  const options = useMemo(
    () => ({
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );
  const onLoad = useCallback((map) => (mapRef.current = map), []);

  const setLocation = (position) => {
    setMarks((prevState) => [...prevState, position]);
    mapRef.current?.panTo(position);
  };

  const updateMark = (list) => {
    let res = marks.filter((mark) =>
      list.some((li) => li.check == false && li.label == mark.label)
    );

    setMarks(res);
  };

  const setDateTime = (time) => {
    const { date, timezone, local } = time;
    // console.log(time);
    setData({
      date: date,
      timezone: timezone,
      localdate: local,
    });
  };

  console.log(data);

  return (
    <Fragment>
      <div className="container">
        <div className="controls">
          {/* <h1>commute?</h1> */}
          <Places
            // setLocation={(position) => {
            //   // setLocation(position);
            //   setMarks((prevState) => [...prevState, position]);
            //   mapRef.current?.panTo(position);
            // }}
            setLocation={(p) => setLocation(p)}
            updateMark={updateMark}
            passDateTime={setDateTime}
          />
        </div>
        <div className="map">
          <GoogleMap
            zoom={10}
            center={center}
            mapContainerClassName="map-container"
            options={options}
            onLoad={onLoad}
          >
            {marks.map((mark, i) => (
              <Marker key={i} position={mark}></Marker>
            ))}
          </GoogleMap>
        </div>
      </div>
      <div className="datetime">
        <span>Latest Search Location:</span>
        <span>Local time: {data.date}</span>
        <span>Time zone: {data.timezone}</span>
        <span>{data.localdate}</span>
      </div>
    </Fragment>
  );
}
export default Map;
