import React, { useState, createContext, useMemo } from "react";
import "./App.css";
import { Aircrafts } from "./components/Aircrafts";
import { Flight, Flights, FlightsList } from "./components/Flights";
import { Rotation } from "./components/Rotation";
import { UsageBar } from "./components/UsageBar";
import {
  DEFAULT_BASE,
  FULL_DAY_IN_MINUTES,
  TURNAROUND_IN_MINUTES,
} from "./constants";

declare global {
  // to access the global type Number
  interface Number {
    inMinutes(): number;
  }
}
// @ts-ignore
Number.prototype.inMinutes = function() {
  return this / 60;
};

interface AppContext {
  flights?: FlightsList | [];
  rotation?: FlightsList | [];
  airplanes?: [];
}

const contextDefaultValue: AppContext = {
  flights: [],
  rotation: [],
  airplanes: [],
};

// const FULL_DAY_IN_MINUTES = 1440;
// const TURNAROUND_IN_MINUTES = 20;
// const DEFAULT_BASE = "EGKK";

export type AircraftStatus = "turnaround" | "service" | "idle";

export const AppContext = createContext<AppContext | null>(null);

// https://gist.github.com/nickbnf/77dcd76a26c57fa0d005187b6808799e

function App() {
  const [flightsInRotation, setFlightsInRotation] = useState<FlightsList>([]);
  // const [rotation, setRotation] = useState([]);
  const [aircraftUsage, setAircraftUsage] = useState<AircraftStatus[]>(
    Array(1440).fill("idle")
  );

  function isAirplaneBusy(
    _departuretime: number,
    _arrivaltime: number,
    _aircraftUsage: AircraftStatus[]
  ) {
    // console.log({ _aircraftUsage, _departuretime, _arrivaltime });
    if (_departuretime <= _arrivaltime) {
      // console.log("here", _aircraftUsage[_departuretime]);
      if (_aircraftUsage[_departuretime] !== "idle") return true;
      else
        return isAirplaneBusy(_departuretime + 1, _arrivaltime, _aircraftUsage);
    }
    return false;
  }

  function handleAddFlight(_flight: Flight) {
    const { departuretime, arrivaltime } = _flight;

    // Our default base for our aircraft is "EGKK"
    if (_flight.origin !== DEFAULT_BASE && flightsInRotation.length < 1) {
      console.log(`Our airplane is at ${DEFAULT_BASE}`);
      return;
    }

    /*
     * The previous selected flight
     * must have its destination
     * the same as the origin of
     * the next flight.
     */
    // if (flightsInRotation.length > 1) {
    //   const currentFlightOrigin = _flight.origin;
    //   const previousFlightDestination =
    //     flightsInRotation[flightsInRotation.length - 1].destination;
    //   console.log("Stoped here!");
    //   if (currentFlightOrigin !== previousFlightDestination) {
    //     console.log("Oops, can't teleport!");
    //     return;
    //   }
    // }

    // If Airplane is busy, do nothing.
    if (
      isAirplaneBusy(
        departuretime.inMinutes(),
        arrivaltime.inMinutes() + TURNAROUND_IN_MINUTES,
        aircraftUsage
      )
    ) {
      console.log("Aircraft is busy");
      return;
    }

    let incompatibleFlightID = null;
    // Sort the flights in rotation by departure time - ascending (top to bottom)
    function compareDeparture(a: Flight, b: Flight) {
      if (a.origin !== b.destination) {
        console.log("Conflict ID:", a.id);
        incompatibleFlightID = a.id;
      }
      return a.arrivaltime - b.arrivaltime;
    }

    const sortedFlightsInRotation = [...flightsInRotation, _flight]
      .sort(compareDeparture)
      .filter(
        (flightInRotation) => flightInRotation.id !== incompatibleFlightID
      );

    // If a incompatible ID is found, returns, and doesn't add the flight.
    if (incompatibleFlightID !== null) return;

    // If the first flight on the list, after sorted, is different than aircraft base returns.
    if (sortedFlightsInRotation[0].origin !== DEFAULT_BASE) {
      console.log("First flight must start on the aircraft base.");
      return;
    }

    const clonedAircraftUsage = [...aircraftUsage];

    for (
      let i = departuretime.inMinutes();
      i <= arrivaltime.inMinutes() + TURNAROUND_IN_MINUTES;
      i++
    ) {
      if (i > arrivaltime.inMinutes()) clonedAircraftUsage[i] = "turnaround";
      else clonedAircraftUsage[i] = "service";
    }

    console.log("I got to set state!");
    console.log("conflicted", incompatibleFlightID);
    setAircraftUsage(clonedAircraftUsage);

    setFlightsInRotation(sortedFlightsInRotation);
  }

  function handleRemoveFlight(_flights: Flight[], index: number) {
    const clonedFlights = [..._flights];
    clonedFlights.splice(index, 1);

    const clonedAircraftUsage = [...aircraftUsage];

    const selectedFlight = _flights[index];
    for (
      let i = selectedFlight.departuretime.inMinutes();
      i <= selectedFlight.arrivaltime.inMinutes() + TURNAROUND_IN_MINUTES;
      i++
    ) {
      if (i > selectedFlight.arrivaltime.inMinutes())
        clonedAircraftUsage[i] = "idle";
      else clonedAircraftUsage[i] = "idle";
    }

    setAircraftUsage(clonedAircraftUsage);
    setFlightsInRotation(clonedFlights);
  }

  function getAircraftUsageInPercentage() {
    let onServiceInMinutes = 0;
    aircraftUsage.forEach((status) => {
      if (status === "service") {
        onServiceInMinutes += 1;
      }
    });

    return ((onServiceInMinutes / FULL_DAY_IN_MINUTES) * 100).toFixed(2);
  }

  const memoizedFlightsComponent = useMemo(
    () => <Flights setRotation={handleAddFlight} />,
    [handleAddFlight, flightsInRotation]
  );

  console.log("Flights", flightsInRotation);
  return (
    <div className="content">
      <AppContext.Provider
        value={{ ...contextDefaultValue, rotation: flightsInRotation }}
      >
        <Aircrafts usagePercentage={getAircraftUsageInPercentage()} />
        <Rotation
          selectedFlights={flightsInRotation}
          removeFlight={handleRemoveFlight}
        />
        <Flights setRotation={handleAddFlight} />
        {/* {memoizedFlightsComponent} */}
      </AppContext.Provider>
      <footer>
        {aircraftUsage && <UsageBar aircraftUsage={aircraftUsage} />}
        {/* <div className="usage">
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
        </div> */}
      </footer>
    </div>
  );
}

export default App;
