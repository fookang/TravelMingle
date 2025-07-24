import { createContext, useState, useContext } from "react";
import api from "../services/api";
import { useRouter } from "expo-router";

const ItineraryContext = createContext();

export const ItineraryProvider = ({ children }) => {
  const [itinerary, setItinerary] = useState();
  const router = useRouter();

  const fetchItinerary = async (id) => {
    try {
      const response = await api.get(`/itinerary/${id}/`);
      console.log(response.data);
      setItinerary({
        id: response.data["id"],
        title: response.data["title"],
        start_date: response.data["start_date"],
        end_date: response.data["end_date"],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateItinerary = async (id, update) => {
    try {
      const response = await api.patch(`/itinerary/${id}/`, update);
      console.log(response.data);
      setItinerary({
        id: response.data["id"],
        title: response.data["title"],
        start_date: response.data["start_date"],
        end_date: response.data["end_date"],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteItinerary = async (id) => {
    try {
      const response = await api.delete(`/itinerary/${id}/`);
      console.log(response.data);
      setItinerary(undefined);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ItineraryContext.Provider
      value={{
        itinerary,
        setItinerary,
        fetchItinerary,
        updateItinerary,
        deleteItinerary,
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
};

export const useItinerary = () => useContext(ItineraryContext);
