import React, { useMemo } from "react";
import { AircraftStatus } from "../App";

interface UsageBarProps {
  aircraftUsage: AircraftStatus[];
}

export function UsageBar({ aircraftUsage }: UsageBarProps) {
  function getReadableTimeFromMinutes(min: number): string {
    var num = min;
    var hours = num / 60;
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    console.log("RRRRR");
    return rhours + ":" + rminutes;
  }

  function getAircraftStatusDiv(
    status: AircraftStatus,
    minute: number,
    key: number | string
  ) {
    const DEFAULT_WIDTH = `${Math.round((0.0694444 + Number.EPSILON) * 100) /
      100}%`;

    const STYLE = { width: DEFAULT_WIDTH };

    const memoizedGetReadableTimeFromMinutes = useMemo(
      () => getReadableTimeFromMinutes(minute),
      []
    );

    return (
      <div className={`${status} tooltip`} key={key} style={STYLE}>
        <p className="tooltip--bottom" data-tooltip="Time"></p>
        <span className="tooltiptext">
          {memoizedGetReadableTimeFromMinutes}
        </span>
      </div>
    );
  }

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
        {aircraftUsage.map((status, index) => {
          return getAircraftStatusDiv(status, index + 1, status + index);
        })}
      </div>
    </>
  );
}
