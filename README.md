# School Database REST API

This is a REST API project that allows users to administer a school database containing information about courses. The project is built using Node.js, Express, and Sequelize ORM.

## Installation

1. Clone the repository.
2. Navigate to the project directory.
3. Install the dependencies by running the following command:

   ```
   npm install
   ```

4. Configure the database connection settings in the project's configuration file.
5. Start the server by running the following command:

   ```
   npm start
   ```

   The server will start running on `http://localhost:3000` by default.

## API Endpoints

### Users

#### Get Authenticated User

- **URL:** `/users`
- **Method:** `GET`
- **Authentication Required:** Yes
- **Response Body:**
  - `firstName` (string): The first name of the authenticated user.
  - `lastName` (string): The last name of the authenticated user.
  - `emailAddress` (string): The email address of the authenticated user.

#### Create User

- **URL:** `/users`
- **Method:** `POST`
- **Authentication Required:** No
- **Request Body:**
  - `firstName` (string): The first name of the user.
  - `lastName` (string): The last name of the user.
  - `emailAddress` (string): The email address of the user.
  - `password` (string): The password of the user.
- **Response:**
  - `201 Created`: The user is created successfully.
  - `400 Bad Request`: If there are validation errors in the request body.

### Courses

#### Get All Courses

- **URL:** `/courses`
- **Method:** `GET`
- **Authentication Required:** No
- **Response Body:** An array of course objects containing the following properties:
  - `id` (number): The ID of the course.
  - `userId` (number): The ID of the user who created the course.
  - `title` (string): The title of the course.
  - `description` (string): The description of the course.
  - `estimatedTime` (string): The estimated time required to complete the course.
  - `materialsNeeded` (string): The materials needed for the course.
  - `user` (object): The user object associated with the course, containing the following properties:
    - `firstName` (string): The first name of the user.
    - `lastName` (string): The last name of the user.
    - `emailAddress` (string): The email address of the user.

#### Get Course

- **URL:** `/courses/:id`
- **Method:** `GET`
- **Authentication Required:** No
- **URL Parameters:**
  - `id` (number): The ID of the course.
- **Response Body:** A course object containing the following properties:
  - `id` (number): The ID of the course.
  - `userId` (number): The ID of the user who created the course.
  - `title` (string): The title of the course.
  - `description` (string): The description of the course.
  - `estimatedTime` (string): The estimated time required to complete the course.
  - `materialsNeeded` (string): The materials needed for the course.
  - `user` (object): The user object associated with the course, containing the following properties:
    - `firstName` (string): The first name of the user.
    - `lastName` (string): The last name of the user.
    - `emailAddress` (string): The email address of the

 user.

#### Create Course

- **URL:** `/courses`
- **Method:** `POST`
- **Authentication Required:** Yes
- **Request Body:**
  - `title` (string): The title of the course.
  - `description` (string): The description of the course.
  - `estimatedTime` (string): The estimated time required to complete the course.
  - `materialsNeeded` (string): The materials needed for the course.
- **Response:**
  - `201 Created`: The course is created successfully.
  - `400 Bad Request`: If there are validation errors in the request body.

#### Update Course

- **URL:** `/courses/:id`
- **Method:** `PUT`
- **Authentication Required:** Yes
- **URL Parameters:**
  - `id` (number): The ID of the course.
- **Request Body:**
  - `title` (string): The updated title of the course.
  - `description` (string): The updated description of the course.
  - `estimatedTime` (string): The updated estimated time required to complete the course.
  - `materialsNeeded` (string): The updated materials needed for the course.
- **Response:**
  - `204 No Content`: The course is updated successfully.
  - `400 Bad Request`: If there are validation errors in the request body.

#### Delete Course

- **URL:** `/courses/:id`
- **Method:** `DELETE`
- **Authentication Required:** Yes
- **URL Parameters:**
  - `id` (number): The ID of the course.
- **Response:**
  - `204 No Content`: The course is deleted successfully.

## Validation

The API endpoints that accept user input apply validation using the express-validator library. The validation rules for each endpoint are as follows:

### User Validation

- `firstName`: Required and cannot be null or empty.
- `lastName`: Required and cannot be null or empty.
- `emailAddress`: Required, cannot be null or empty, must be a valid email format, and must not already be in use by another user.
- `password`: Required and cannot be null or empty.

### Course Validation

- `title`: Required and cannot be null or empty.
- `description`: Required and cannot be null or empty.

If there are validation errors in the request body, a `400 Bad Request` response is returned with an array of error messages indicating the validation failures.

## Authentication and Authorization

Authentication is required for certain endpoints to ensure that only authorized users can perform certain actions. The authentication is performed using an authentication middleware (`authenticateUser`) that checks for a valid user session or token.

Authorization is enforced to ensure that users can only modify or delete their own courses. The authorization is performed using another middleware (`authCourseOwner`) that checks if the authenticated user is the owner of the course being modified or deleted.

## Dependencies

The project uses the following dependencies:

- express
- sequelize
- bcryptjs
- express-validator

These dependencies can be found in the `package.json` file.
