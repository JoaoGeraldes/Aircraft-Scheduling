import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";

interface Aircraft {
  ident: string;
  type: string;
  economySeats: number;
  base: string;
}

type Aircrafts = Aircraft[];

export function Aircrafts() {
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
      {flights &&
        flights.map(({ base, economySeats, ident, type }) => {
          return <div key={ident}>{type}</div>;
        })}
    </div>
  );
}
