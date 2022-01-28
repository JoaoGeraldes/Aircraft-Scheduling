import React, { useEffect, useState, useMemo } from "react";
import { FlightsList } from "./Flights";

// interface Flight {
//   ident: string;
//   departuretime: number;
//   arrivaltime: number;
//   readable_departure: string;
//   readable_arrival: string;
//   origin: string;
//   destination: string;
// }

// type Flights = Flight[];

interface RotationProps {
  selectedFlights: FlightsList;
  removeFlight: (flights: FlightsList, index: number) => void;
}
export function Rotation({ selectedFlights, removeFlight }: RotationProps) {
  // const [rotation, setRotation] = useState<Flights>(null);

  return (
    <div className="rotation">
      {selectedFlights &&
        selectedFlights.map(
          (
            {
              arrivaltime,
              destination,
              id,
              departuretime,
              origin,
              readable_departure,
              readable_arrival,
            },
            index,
            array
          ) => (
            <article
              key={id + Math.random()}
              onClick={() => removeFlight(array, index)}
            >
              <div className="ident">{id}</div>
              <div className="base">
                <span>{origin}</span>
                <span>{destination}</span>
              </div>
              <div className="times">
                <span>
                  {readable_departure}---{departuretime.inMinutes()}
                </span>
                &nbsp;
                <span>
                  {readable_arrival}---{arrivaltime.inMinutes()}
                </span>
              </div>
            </article>
          )
        )}
    </div>
  );
}
