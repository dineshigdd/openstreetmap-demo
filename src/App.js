import "./styles.css";
import Map from "./Map/Map";
import { useEffect, useState } from "react";
export default function App() {
  const [coords, setCorrds] = useState({
    latitude: 39.7837304,
    longitude: -100.4458825
  });
  const [display_name, setName] = useState("");

  const [address, setAddress] = useState({});

  function error() {
    alert('Sorry, no position available.');
  }
  const options = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000
  };

  function getCurrentCityName( position ){
    setCorrds({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }); 

    // let url = `https://nominatim.openstreetmap.org/reverse?
    // &lat=${coords.latitude}
    // &lon=${coords.longitude}`
   let url="https://nominatim.openstreetmap.org/reverse?format=jsonv2"+
   "&lat="+coords.latitude+"&lon="+coords.longitude;

    fetch(url, {
      method: "GET",   
      mode: 'cors', 
      headers: {
        "Access-Control-Allow-Origin": "https://o2cj2q.csb.app"
      }
    })
      .then((response) => response.json())
      .then((data) => setName( data.display_name));
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      // (position) => {
      // console.log("Lon:" + position.coords.longtitude);
      // setCorrds({
      //   latitude: position.coords.latitude,
      //   longitude: position.coords.longitude
      // });     
      
     
    // },
    getCurrentCityName,
    error,
    options

    );
  }, []);

  
  //separete the entred string
  function update(field) {
    return (e) => {
      const value = e.currentTarget.value;
      setAddress((address) => ({ ...address, [field]: value }));
    };
  }

  function submitHandler(e) {
    
    e.preventDefault();
    console.log(address);

    let url = `https://nominatim.openstreetmap.org/search?
    street=${address.street}
    &city=${address.city}
    &state=${address.state}
    &country=${address.country}
    &postalcode=${address.postalcode}&format=json`;

    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "https://o2cj2q.csb.app"
      }
    })
      .then((response ) => {
        if( response.ok){
          return response.json();
        }
        throw new Error('Something went wrong');
      })
      .then(
        (data) => {
          setName(data[0].display_name);
          setCorrds({
            latitude: data[0].lat,
            longitude: data[0].lon
          });
        }
        // console.log(Object.keys(data[0])

        //   setCorrds(
        //   {
        //   'latitude':data[0].lat,
        //   'longitude': data[0].lon
        // });

        // setInfo({
        //   dispaly_name: data[0].dispaly_name,
        //   icon: data[0].icon
        // })
      ).catch((error) => {
        alert("Error in your input; unable to find the position");
      });;
  }

  return (
    <div className="App">
      <h1>Enter The address</h1>
      <section className="form-container">
        <form>
          <label>street:</label>
          <input
            value={address.street}
            placeholder="1234 abc street"
            onChange={update("street")}
            id="street"
            type="text"
          />
          <label>city:</label>
          <input
            placeholder="1234 abc street"
            type="text"
            value={address.city}
            onChange={update("city")}
            id="city"
          />
          <br />
          <label>State:</label>
          <input
            placeholder="CA"
            type="text"
            value={address.state}
            onChange={update("state")}
            id="state"
          />
          <label>zip code:</label>
          <input
            placeholder="91423"
            type="text"
            value={address.postalcode}
            onChange={update("postalcode")}
            id="postalcode"
          />
          <br />
          <label>Country:</label>
          <input
            placeholder="USA"
            type="text"
            value={address.country}
            onChange={update("country")}
            id="country"
          />
          <br />

          <button onClick={(e) => submitHandler(e)}>Search</button>
        </form>
      </section>
      <Map coords={coords} display_name={display_name} />
    </div>
  );
}
