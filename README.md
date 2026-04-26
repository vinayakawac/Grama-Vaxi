# Grama-Vaxi

Grama-Vaxi is a comprehensive livestock management and vaccination tracking ecosystem designed to bridge the gap between farmers and veterinary officers. The project consists of a mobile application for farmers and a centralized administrative dashboard for healthcare monitoring and alert broadcasting.

---

## Project Components

### 1. Farmer Mobile Application
An Android-based platform that allows farmers to maintain digital records of their livestock, receive timely vaccination reminders, and report disease outbreaks directly to authorities.

### 2. Admin Dashboard
A web-based command center for veterinary officers to monitor regional livestock health, analyze disease reports, and broadcast vaccination camp alerts to specific villages via push notifications.

---

## Technical Ecosystem

The entire system is powered by a shared Firebase backend, ensuring real-time data synchronization between the field and the administrative office.

*   **Database**: Google Firestore (NoSQL)
*   **Authentication**: Firebase Auth
*   **Messaging**: Firebase Cloud Messaging (FCM)
*   **Storage**: Firebase Cloud Storage

---

## Documentation

Detailed documentation for each component can be found in their respective directories:

*   [Farmer App Documentation](./grama-vaxi-app/README.md)
*   [Admin Dashboard Documentation](./grama-vaxi-admin/README.md)

---

## License

This project is developed for regional veterinary healthcare optimization.
