import React, { useEffect, useState, useMemo, useContext } from "react";
import { AppContext } from "../App";
import { FlightsList } from "./Flights";
import { AircraftLanding } from "./Icons/AircraftLanding";
import { AircraftTakeOff } from "./Icons/AircraftTakeOff";
import { RightArrow } from "./Icons/RightArrow";

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
  // const Context = useContext(AppContext);
  // Context.rotation = selectedFlights;

  // console.log("Rendered Rotation.tsx");
  return (
    <div className="rotation">
      <h3>Rotation</h3>
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
                <span>
                  <RightArrow />
                </span>
                <span>{destination}</span>
              </div>
              <div className="times">
                <span>
                  {readable_departure}
                  &nbsp; &nbsp;
                  <AircraftTakeOff />
                </span>
                <span>
                  <AircraftLanding />
                  &nbsp; &nbsp;
                  {readable_arrival}
                </span>
              </div>
            </article>
          )
        )}
    </div>
  );
}
