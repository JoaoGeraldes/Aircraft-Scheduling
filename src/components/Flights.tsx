import React, { useEffect, useState, useMemo } from "react";

export interface Flight {
  ident: string;
  departuretime: number;
  arrivaltime: number;
  readable_departure: string;
  readable_arrival: string;
  origin: string;
  destination: string;
}

export type FlightsList = Flight[];

export function Flights({ setRotation }) {
  const [flights, setFlights] = useState<FlightsList>(null);

  useEffect(() => {
    fetch("json/flights.json")
      .then((response) => response.json())
      .then((json) => {
        setFlights(json);
      });
  }, []);

  const memoizedSortedFlights = useMemo(() => sortedFlights, [flights]);
  function sortedFlights() {
    function compareDeparture(a: Flight, b: Flight) {
      return a.arrivaltime - b.arrivaltime;
    }
    return flights.sort(compareDeparture);
  }

  return (
    <div className="flights">
      {flights &&
        memoizedSortedFlights().map((flight) => {
          const {
            arrivaltime,
            destination,
            ident,
            departuretime,
            origin,
            readable_departure,
            readable_arrival,
          } = flight;
          return (
            <article key={ident} onClick={() => setRotation(flight)}>
              <div className="ident">{ident}</div>
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
