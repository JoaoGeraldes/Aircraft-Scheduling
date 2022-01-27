import React, { useEffect, useState, useMemo } from "react";

interface Flight {
  ident: string;
  departuretime: number;
  arrivaltime: number;
  readable_departure: string;
  readable_arrival: string;
  origin: string;
  destination: string;
}

type Flights = Flight[];

interface RotationProps {
  selectedFlights: Flights;
  removeFlight: (flights: Flights, index: number) => void;
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
              ident,
              departuretime,
              origin,
              readable_departure,
              readable_arrival,
            },
            index,
            array
          ) => (
            <article
              key={ident + Math.random()}
              onClick={() => removeFlight(array, index)}
            >
              <div className="ident">{ident}</div>
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
