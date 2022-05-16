import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { Combobox, ComboboxInput } from "@reach/combobox";
import "@reach/combobox/styles.css";
import { Fragment, useEffect, useState } from "react";
import usePagination from "./pagination";

export default function Places({ setLocation, updateMark, passDateTime }) {
  const {
    ready,
    value,
    setValue,
    // suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const [addressList, setAddressList] = useState([]);

  // const loc = "35.731252, 139.730291";
  const targetDate = new Date();
  const timestamp =
    targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60;
  const apikey = "AIzaSyBy1jPBbEQBFqXCHm9npDSyZ4mDogMQUaw";

  const { next, prev, jump, currentData, currentPage, maxPage } = usePagination(
    addressList,
    10
  );

  const handleKeypress = async (e) => {
    if (e.keyCode == 13) {
      await handleClick(value);
    }
  };

  const handleClick = (val) => {
    setValue(val, false);
    clearSuggestions();
    const parameter = { address: val };

    getGeocode({ address: val }).then((results) => {
      try {
        const { lat, lng } = getLatLng(results[0]);
        console.log("📍 Coordinates: ", { lat, lng });
        setLocation({ lat, lng, label: val, check: false });

        setAddressList((prevState) => {
          const inputLocation = { lat, lng, label: val, check: false };
          return [...prevState, inputLocation];
        });

        fetchTime(lat, lng);
      } catch (error) {
        console.log("😱 Error: ", error);
      }
    });

    setValue("");
  };

  const fetchTime = async (lat, lng) => {
    const loc = `${lat}, ${lng}`;
    let apicall =
      "https://maps.googleapis.com/maps/api/timezone/json?location=" +
      loc +
      "&timestamp=" +
      timestamp +
      "&key=" +
      apikey;

    await fetch(apicall)
      .then((response) => response.json())
      .then((data) => {
        try {
          if (data && data.status == "OK") {
            console.log(data);
            let offsets = data.dstOffset * 1000 + data.rawOffset * 1000;
            // let secondsOfHour = Math.abs(offsets) / (60 * 60);
            let localdate = new Date(timestamp * 1000 + offsets);
            console.log(localdate);
            let local = String(localdate);
            let date = localdate.toLocaleString();
            let timezone = data.timeZoneName;
            const time = { date, timezone, local };
            passDateTime(time);
          }
        } catch {
          alert("Request failed.  Returned status of " + data.status);
        }
      });
  };

  const handleChange = (e) => {
    setAddressList((prevState) =>
      prevState.map((add) =>
        add.label === e.target.value ? { ...add, check: !add.check } : add
      )
    );
    // setAddressList((prevState) => {
    //   const list = prevState.map((add) =>
    //     add.label === e.target.value ? { ...add, value: !add.value } : add
    //   );
    //   console.log(list)
    // });
    // setAddressDelete((prevState) => [...prevState, e.target.value]);
  };

  const deleteAddress = (e) => {
    e.preventDefault();
    setAddressList((prevState) => {
      return prevState.filter((add) => add.check == false);
    });

    updateMark(addressList);
  };

  return (
    <Fragment>
      <Combobox>
        <ComboboxInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          className="combobox-input"
          placeholder="Search location address"
          onKeyDown={handleKeypress}
        />
        <button
          className="search-button"
          type="submit"
          onClick={() => {
            handleClick(value);
          }}
        >
          Search
        </button>
        {/* <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ place_id, description }) => (
                <ComboboxOption key={place_id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover> */}
      </Combobox>

      <form onSubmit={deleteAddress}>
        <button className="delete-button" type="submit">
          Delete selected item
        </button>
        {currentData().map((adr) => (
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              checked={adr.check}
              value={adr.label}
              onChange={(e) => handleChange(e)}
            />
            <label class="form-check-label" for="flexCheckDefault">
              {adr.label}
            </label>
          </div>
        ))}
      </form>

      <div className="pagination">
        <p className="text">
          {`Current Page:${currentPage}`}
          {/* /{`Maximun Page:${maxPage}`} */}
        </p>
        <button
          onClick={prev}
          className={`page ${currentPage === 1 && "disabled"}`}
        >
          &larr;
        </button>
        {[...Array(maxPage).keys()].map((el) => (
          <button
            onClick={() => jump(el + 1)}
            key={el}
            className={`page ${currentPage === el + 1 ? "active" : ""}`}
          >
            {el + 1}
          </button>
        ))}
        <button
          onClick={next}
          className={`page ${currentPage === maxPage && "disabled"}`}
        >
          &rarr;
        </button>
      </div>
    </Fragment>
  );
}
