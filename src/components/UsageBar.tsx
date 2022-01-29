import * as React from "react";
import { AircraftStatus } from "../App";

interface UsageBarProps {
  aircraftUsage: AircraftStatus[];
}

export function UsageBar({ aircraftUsage }: UsageBarProps) {
  return (
    <>
      <div className="time-split">
        <span>00:00</span>
        <span>06:00</span>
        <span>12:00</span>
        <span>18:00</span>
        <span>24:00</span>
      </div>
      <div className="usage">
        {aircraftUsage.map((minute) => {
          if (minute === "idle")
            return (
              <div
                className="idle"
                key={Math.random()}
                style={{
                  width: `${Math.round((0.0694444 + Number.EPSILON) * 100) /
                    100}%`,
                }}
              ></div>
            );
          if (minute === "service")
            return (
              <div
                className="service"
                key={Math.random()}
                style={{
                  width: `${Math.round((0.0694444 + Number.EPSILON) * 100) /
                    100}%`,
                }}
              ></div>
            );
          if (minute === "turnaround")
            return (
              <div
                className="turnaround"
                key={Math.random()}
                style={{
                  width: `${Math.round((0.0694444 + Number.EPSILON) * 100) /
                    100}%`,
                }}
              ></div>
            );
        })}
      </div>
    </>
  );
}
