# Endpoints

## 1. POST Endpoint for Creating User Data

- **Endpoint**: `POST /data`
- **Description**: This endpoint receives data from the client and saves it to the MongoDB database. The data typically includes information about user submissions, such as username, language, source code, etc.

## 2. GET Endpoint for Retrieving Submissions

- **Endpoint**: `GET /data`
- **Description**: This endpoint retrieves all data (submissions) stored in the MongoDB database. Clients can make GET requests to this endpoint to fetch a list of all submissions.

## 3. DELETE Endpoint for Deleting All Data

- **Endpoint**: `DELETE /data`
- **Description**: This endpoint allows for the deletion of all data stored in the MongoDB database. When a DELETE request is made to this endpoint, all submissions and related data are removed from the database.
