import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";

interface Aircraft {
  ident: string;
  type: string;
  economySeats: number;
  base: string;
}

type Aircrafts = Aircraft[];

interface AircraftsProps {
  usagePercentage: string;
}

export function Aircrafts({ usagePercentage }: AircraftsProps) {
  const [flights, setFlights] = useState<Aircrafts>(null);

  useEffect(() => {
    fetch("json/aircrafts.json")
      .then((response) => response.json())
      .then((json) => {
        setFlights(json);
      });
  }, []);

  return (
    <div className="aircrafts">
      <h3>Aircrafts</h3>
      {flights &&
        flights.map(({ base, economySeats, ident, type }) => {
          return (
            <article key={ident}>
              <span>{type}</span>
              <p>{usagePercentage} %</p>
            </article>
          );
        })}
    </div>
  );
}
