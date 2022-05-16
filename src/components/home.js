import { useLoadScript} from "@react-google-maps/api";
import Map from "./map";

export default function Home() {
  const { isLoaded } = useLoadScript({
    // googleMapsApiKey: process.env.GOOGLE_MAPS_API
    googleMapsApiKey: "AIzaSyBy1jPBbEQBFqXCHm9npDSyZ4mDogMQUaw",
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map/>;
}

