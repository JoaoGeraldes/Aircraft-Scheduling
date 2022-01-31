import React, { useEffect, useState, useRef, useContext } from "react";
import { AppContext } from "../App";
import { DEFAULT_BASE, LIMIT_PER_PAGE } from "../constants";

export interface Flight {
  id: string;
  departuretime: number;
  arrivaltime: number;
  readable_departure: string;
  readable_arrival: string;
  origin: string;
  destination: string;
}

export type FlightsList = Flight[];
export interface Data {
  data: FlightsList;
  pagination: { offset: string; limit: number; total: string };
}

const FLIGHTS_URL = `${process.env.REACT_APP_FLIGHTS_URI}?offset=1323&limit=${LIMIT_PER_PAGE}`;

export function Flights({ setRotation }) {
  const [flights, setFlights] = useState<Data>(null);
  const [offset, setOffset] = useState(1323);
  const Context = useContext(AppContext);
  const loadMoreButton = useRef(null);
  let lastSelectedFlightDestination = DEFAULT_BASE;
  if (Context.rotation.length > 0) {
    lastSelectedFlightDestination =
      Context.rotation[Context.rotation.length - 1].destination || null;
  }

  useEffect(() => {
    getFlights();
  }, []);

  // function handleScroll() {
  //   const divFlights = document.querySelector(".flights") as HTMLElement;
  //   if (
  //     divFlights.scrollHeight - divFlights.scrollTop <=
  //     divFlights.offsetHeight
  //   ) {
  //     fetchMore();
  //   }
  // }

  // const memoizedSortedFlights = useMemo(() => {
  //   console.log("sorting");
  //   return sortedFlightsByOrigin();
  // }, [flights]);

  function sortedFlightsByOrigin(_origin?: string) {
    // sort by name
    flights.data.sort(function(a, b) {
      var nameA = a.origin.toUpperCase();
      var nameB = b.origin.toUpperCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
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

  function fetchMore() {
    if (offset - LIMIT_PER_PAGE < 0) return;
    loadMoreButton.current.innerText = "Loading...";
    loadMoreButton.current.classList.add("disabled");
    loadMoreButton.current.disabled = true;
    fetch(
      `${process.env.REACT_APP_AIRCRAFTS_URI}?offset=${offset -
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
      .finally(() => {
        loadMoreButton.current.innerText = "Load more";
        loadMoreButton.current.classList.remove("disabled");
        loadMoreButton.current.disabled = false;
        setOffset(offset - LIMIT_PER_PAGE);
      });
  }

  return (
    <div className="flights">
      <h3>Flights</h3>
      <button
        ref={loadMoreButton}
        className="load-more-btn"
        onClick={fetchMore}
      >
        Load more...
      </button>
      {flights &&
        sortedFlightsByOrigin(lastSelectedFlightDestination).data.map(
          (flight) => {
            const {
              destination,
              id,
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
