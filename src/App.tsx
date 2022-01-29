import React, { useState, createContext, useMemo } from "react";
import "./App.css";
import { Aircrafts } from "./components/Aircrafts";
import { Flight, Flights, FlightsList } from "./components/Flights";
import { Rotation } from "./components/Rotation";
import { DEFAULT_BASE, TURNAROUND_IN_MINUTES } from "./constants";

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

type AircraftStatus = "turnaround" | "service" | "idle";

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
    if (flightsInRotation.length > 0) {
      const currentFlightOrigin = _flight.origin;
      const previousFlightDestination =
        flightsInRotation[flightsInRotation.length - 1].destination;

      if (currentFlightOrigin !== previousFlightDestination) {
        console.log("Oops, can't teleport!");
        return;
      }
    }

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
      if (a.destination !== b.origin) incompatibleFlightID = a.id;
      return a.arrivaltime - b.arrivaltime;
    }
    const sortedFlightsInRotation = [...flightsInRotation, _flight]
      .sort(compareDeparture)
      .filter(
        (flightInRotation) => flightInRotation.id !== incompatibleFlightID
      );

    // sortedFlightsInRotation.filter(
    //   (flightInRotation) => flightInRotation.id !== incompatibleFlightID
    // );
    // console.log("incompID", incompatibleFlightID);
    // console.log("sortedFiltered", sortedFlightsInRotation);

    // Set the aircraft usage array with the default set to idle
    // const clonedAircraftUsage = [...aircraftUsage].fill("idle");
    const clonedAircraftUsage = [...aircraftUsage];

    for (
      let i = departuretime.inMinutes();
      i <= arrivaltime.inMinutes() + TURNAROUND_IN_MINUTES;
      i++
    ) {
      if (i > arrivaltime.inMinutes()) clonedAircraftUsage[i] = "turnaround";
      else clonedAircraftUsage[i] = "service";
    }

    // console.log(clonedAircraftUsage);

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

  const memoizedFlightsComponent = useMemo(
    () => <Flights setRotation={handleAddFlight} />,
    [handleAddFlight, flightsInRotation]
  );
  return (
    <div className="content">
      <AppContext.Provider
        value={{ ...contextDefaultValue, rotation: flightsInRotation }}
      >
        <Aircrafts />
        <Rotation
          selectedFlights={flightsInRotation}
          removeFlight={handleRemoveFlight}
        />
        {/* <Flights setRotation={handleAddFlight} /> */}
        {memoizedFlightsComponent}
      </AppContext.Provider>
      <footer>
        <div>Footer</div>
      </footer>
    </div>
  );
}

export default App;
