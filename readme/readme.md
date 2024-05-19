# User Authentication System with Express and MongoDB

This is a simple user authentication system built with Express.js and MongoDB. It provides endpoints for user registration, login, and a placeholder for forgot password functionality.

## Installation

1. Clone the repository:

    ```
    git clone https://github.com/your_username/your_project.git
    ```

2. Install dependencies:

    ```
    cd your_project
    npm install
    ```

3. Set up MongoDB:

    - Make sure MongoDB is installed and running on your system.
    - Update the MongoDB connection URI in `index.js` if needed (`mongodb://localhost:27017/backend` by default).

4. Start the server:

    ```
    npm start
    ```

5. Access the application at `http://localhost:6391` by default.

## Usage

- **User Registration**: Send a POST request to `/api/auth/register` with `email`, `username`, and `password` fields in the request body. Example:

    ```
    POST /api/auth/register
    Content-Type: application/json

    {
        "email": "example@example.com",
        "username": "example_user",
        "password": "password123"
    }
    ```

- **User Login**: Send a POST request to `/api/auth/login` with `username` and `password` fields in the request body. Example:

    ```
    POST /api/auth/login
    Content-Type: application/json

    {
        "username": "example_user",
        "password": "password123"
    }
    ```

- **Forgot Password**: A placeholder route is available at `/api/auth/forgotpassword` for future implementation of the forgot password functionality.

## Dependencies

- express
- body-parser
- mongoose
- bcryptjs

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
