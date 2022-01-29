import { off } from "process";
import React, { useEffect, useState, useMemo, useRef, useContext } from "react";
import { AppContext } from "../App";
import { DEFAULT_BASE, LIMIT_PER_PAGE } from "../constants";

export type FlightsList = Flight[];

export interface Data {
  data: FlightsList;
  pagination: { offset: string; limit: number; total: string };
}

export interface Flight {
  id: string;
  departuretime: number;
  arrivaltime: number;
  readable_departure: string;
  readable_arrival: string;
  origin: string;
  destination: string;
}

// const FLIGHTS_URL = "json/flights.json"
const FLIGHTS_URL = `https://infinite-dawn-93085.herokuapp.com/flights?offset=1323&limit=${LIMIT_PER_PAGE}`;

export function Flights({ setRotation }) {
  const [flights, setFlights] = useState<Data>(null);
  const [offset, setOffset] = useState(1323);
  // const [offset, setOffset] = useState(73);
  const [sortByOrigin, setSortByOrigin] = useState(null);
  const Context = useContext(AppContext);

  let lastSelectedFlightDestination = DEFAULT_BASE;
  if (Context.rotation.length > 0) {
    lastSelectedFlightDestination =
      Context.rotation[Context.rotation.length - 1].destination || null;
  }

  useEffect(() => {
    // document.querySelector(".flights").addEventListener("scroll", () => {
    //   const divFlights = document.querySelector(".flights") as HTMLElement;
    //   if (
    //     divFlights.scrollHeight - divFlights.scrollTop <=
    //     divFlights.offsetHeight
    //   ) {
    //     fetchMore();
    //     console.log("FETCH!!");
    //   }
    // });
    getFlights();
  }, []);

  function handleScroll() {
    const divFlights = document.querySelector(".flights") as HTMLElement;
    if (
      divFlights.scrollHeight - divFlights.scrollTop <=
      divFlights.offsetHeight
    ) {
      fetchMore();
    }
  }

  // const memoizedSortedFlights = useMemo(() => {
  //   console.log("sorting");
  //   return sortedFlightsByOrigin();
  // }, [flights]);

  function sortedFlightsByOrigin(_origin?: string) {
    // function compareDeparture(a: Flight, b: Flight) {
    //   return a.arrivaltime - b.arrivaltime;
    // }
    // return flights.sort(compareDeparture);
    // sort by name
    flights.data.sort(function(a, b) {
      var nameA = a.origin.toUpperCase(); // ignore upper and lowercase
      var nameB = b.origin.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        // 2 < 1 false
        return -1;
      }
      if (nameA > nameB) {
        // 2 > 1 true ---> 1, 2
        return 1;
      }

      // names must be equal
      return 0;
    });

    const priorityFlights = flights.data.filter(
      (_flight) => _flight.origin === _origin
    );

    return { ...flights, data: priorityFlights };
  }

  function getFlights() {
    fetch(FLIGHTS_URL)
      .then((response) => response.json())
      .then((json) => {
        setFlights(json);
        Context.flights = json;
      });
  }

  function handleSearchSubmit() {
    sortedFlightsByOrigin(
      Context.rotation[Context.rotation.length - 1].destination
    );
    // console.dir(searchInput.current.value);
  }

  function fetchMore() {
    if (offset - LIMIT_PER_PAGE < 0) return;
    fetch(
      `https://infinite-dawn-93085.herokuapp.com/flights?offset=${offset -
        LIMIT_PER_PAGE}&limit=${LIMIT_PER_PAGE}`
    )
      .then((response) => response.json())
      .then((json: Data) => {
        Context.flights = [...flights.data, ...json.data];
        setFlights({
          pagination: json.pagination,
          data: [...flights.data, ...json.data],
        });
      })
      .finally(() => setOffset(offset - LIMIT_PER_PAGE));
  }
  const searchInput = useRef(null);

  return (
    <div className="flights" onScroll={handleScroll}>
      <h3>Flights</h3>
      <button className="load-more-btn" onClick={fetchMore}>
        Load more...
      </button>
      {flights &&
        sortedFlightsByOrigin(lastSelectedFlightDestination).data.map(
          (flight) => {
            const {
              arrivaltime,
              destination,
              id,
              departuretime,
              origin,
              readable_departure,
              readable_arrival,
            } = flight;
            return (
              <article
                key={id + Math.random()}
                onClick={() => setRotation(flight)}
              >
                <div className="ident">{id}</div>
                <div className="base">
                  <span>{origin}</span>
                  <span>{destination}</span>
                </div>
                <div className="times">
                  <span>{readable_departure}</span>
                  <span>{readable_arrival}</span>
                </div>
              </article>
            );
          }
        )}
    </div>
  );
}
