import React, { useEffect, useState } from "react";

interface Aircraft {
  ident: string;
  type: string;
  economySeats: number;
  base: string;
}

interface AircraftsProps {
  usagePercentage: string;
}

type AircraftsType = Aircraft[];
interface Data {
  data: AircraftsType;
  pagination: { offset: string; limit: number; total: string };
}

export function Aircrafts({ usagePercentage }: AircraftsProps) {
  const [aircraft, setAircraft] = useState<AircraftsType>(null);

  useEffect(() => {
    fetch(process.env.REACT_APP_AIRCRAFTS_URI)
      .then((response) => response.json())
      .then((json: Data) => {
        setAircraft(json.data);
      });
  }, []);

  return (
    <div className="aircrafts">
      <h3>Aircrafts</h3>
      {aircraft &&
        aircraft.map(({ ident, type }) => {
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
