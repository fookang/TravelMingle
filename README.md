# TravelMingle

TravelMingle is a collaborative travel itinerary platform with a Django REST API backend and a React Native (Expo) frontend. Users can create, manage, and share travel itineraries, invite collaborators, and upload essential travel documents.

## Features

- **User Authentication**: Register, login (with username or email), update profile, change password, and delete account.
- **Itinerary Management**: Create, update, delete, and view itineraries with multiple days and activities.
- **Collaboration**: Invite other users as collaborators to itineraries.
- **Document Upload**: Upload and manage travel documents (passport, visa, flight, insurance) per itinerary.
- **Mobile App**: Cross-platform mobile app for managing trips on the go.
- **Media Support**: User avatars and document uploads.
- **JWT Authentication**: Secure API access using JSON Web Tokens.

## Tech Stack

- **Backend**: Django, Django REST Framework
- **Frontend**: React Native (Expo), Axios, React Navigation, Expo Secure Store, Google Maps integration

---

## Backend Setup

1. **Install dependencies**  
	Navigate to the `backend` directory and install requirements:
	```bash
	pip install -r requirements.txt
	```

2. **Run migrations**
	```bash
	python manage.py migrate
	```

3. **Create a superuser (optional)**
	```bash
	python manage.py createsuperuser
	```

4. **Start the server**
	```bash
	python manage.py runserver
	```

5. **API Endpoints**
	- User: `/api/user/`
	- Itinerary: `/api/itinerary/`
	- Auth: `/api/user/token/` (JWT)

	See `backend/itinerary/urls.py` and `backend/user/urls.py` for full endpoint details.

---

## Frontend Setup

1. **Install dependencies**  
	Navigate to the `frontend` directory and run:
	```bash
	npm install
	```

2. **Start the Expo app**
	```bash
	npx expo start
	```

3. **Configure environment variables**  
	- Set `API_URL` and `GOOGLE_MAP_API_KEY` in a `.env` file (see `frontend/app.config.js`).

4. **Development**
	- Edit files in the `frontend/app` directory.
	- Uses file-based routing via Expo Router.

---

## Database Models

- **User**: Custom user model with avatar, email, first/last name.
- **Itinerary**: Title, description, start/end dates, owner.
- **Collaborator**: Many-to-one with Itinerary and User.
- **ItineraryDay**: Linked to Itinerary, has title and date.
- **Activity**: Linked to ItineraryDay, includes time, title, location.
- **Document**: Linked to Itinerary and User, supports file upload.

---

## Running Tests

- Backend:  
  ```bash
  python manage.py test
  ```

---

