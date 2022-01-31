import React from "react";
import { FlightsList } from "./Flights";
import { AircraftLanding } from "./Icons/AircraftLanding";
import { AircraftTakeOff } from "./Icons/AircraftTakeOff";
import { RightArrow } from "./Icons/RightArrow";

interface RotationProps {
  selectedFlights: FlightsList;
  removeFlight: (flights: FlightsList, index: number) => void;
}
export function Rotation({ selectedFlights, removeFlight }: RotationProps) {
  return (
    <div className="rotation">
      <h3>Rotation</h3>
      {selectedFlights &&
        selectedFlights.map(
          (
            { destination, id, origin, readable_departure, readable_arrival },
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
