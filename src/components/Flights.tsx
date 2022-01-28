import { off } from "process";
import React, { useEffect, useState, useMemo } from "react";

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

const LIMIT_PER_PAGE = 25;

// const FLIGHTS_URL = "json/flights.json"
const FLIGHTS_URL = `https://infinite-dawn-93085.herokuapp.com/flights?offset=0&limit=${LIMIT_PER_PAGE}`;

export function Flights({ setRotation }) {
  const [flights, setFlights] = useState<FlightsList>(null);
  const [offset, setOffset] = useState(25);

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
      console.log("FETCH!!");
    }
  }

  const memoizedSortedFlights = useMemo(() => sortedFlights, [flights]);
  function sortedFlights() {
    function compareDeparture(a: Flight, b: Flight) {
      return a.arrivaltime - b.arrivaltime;
    }
    return flights.sort(compareDeparture);
  }

  function getFlights() {
    fetch(FLIGHTS_URL)
      .then((response) => response.json())
      .then((json) => {
        console.log(json.data);
        setFlights(json.data);
      });
  }

  function fetchMore() {
    fetch(
      `https://infinite-dawn-93085.herokuapp.com/flights?offset=${offset}&limit=${LIMIT_PER_PAGE}`
    )
      .then((response) => response.json())
      .then((json) => {
        setFlights([...flights, ...json.data]);
      })
      .finally(() => setOffset(offset + LIMIT_PER_PAGE));
  }
  console.log("gl", flights);
  return (
    <div className="flights" onScroll={handleScroll}>
      {flights &&
        memoizedSortedFlights().map((flight) => {
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
                <span>
                  {readable_departure}-{departuretime}
                </span>
                <span>
                  {readable_arrival}-{arrivaltime}
                </span>
              </div>
            </article>
          );
        })}
    </div>
  );
}
