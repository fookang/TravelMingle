import { createContext, useState, useContext } from "react";
import api from "../services/api";

const ItineraryContext = createContext();

export const ItineraryProvider = ({ children }) => {
  const [itinerary, setItinerary] = useState();
  const [collaborators, setCollaborators] = useState();

  const fetchItineraryDetail = async (id) => {
    try {
      const response = await api.get(`/itinerary/${itinerary.id}/`);
      setItinerary({
        id: response.data["id"],
        title: response.data["title"],
        description: response.data["description"],
        start_date: response.data["start_date"],
        end_date: response.data["end_date"],
        user: response.data["user"],
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCollaborator = async (id) => {
    try {
      const response = await api.get(
        `/itinerary/${itinerary.id}/collaborators/`
      );
      setCollaborators(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const AddCollaborator = async (id, data) => {
    try {
      const response = await api.post(`/itinerary/${id}/collaborators/`, data);
      console.log(response.data);
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
        description: response.data["description"],
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
        collaborators,
        fetchItineraryDetail,
        updateItinerary,
        deleteItinerary,
        fetchCollaborator,
        AddCollaborator,
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
};

export const useItinerary = () => useContext(ItineraryContext);
