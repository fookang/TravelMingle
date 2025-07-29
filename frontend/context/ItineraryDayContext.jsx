import { createContext, useState, useContext, Alert } from "react";
import api from "../services/api";

const ItineraryDayContext = createContext();

export const ItineraryDayProvider = ({ children }) => {
  const [itineraryDay, setItineraryDay] = useState();

  const fetchItineraryDayDetail = async () => {
    try {
      const response = await api.get(
        `/itinerary/${itineraryDay.id}/day/${itineraryDay.day_id}/activities/`
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateItineraryDay = async ({ title, date }) => {
    try {
      const response = await api.patch(
        `itinerary/${itineraryDay.id}/days/${itineraryDay.day_id}/`,
        {
          title,
          date: date.toISOString().split("T")[0],
        }
      );
    } catch (error) {
      Alert.alert("Error", "An error occured. Please try again");
      console.log(error);
    }
  };

  return (
    <ItineraryDayContext.Provider value={{}}>
      {children}
    </ItineraryDayContext.Provider>
  );
};

export const useItineraryDay = () => useContext(ItineraryDayContext);
