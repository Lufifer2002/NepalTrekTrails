# NepalTrekTrails

A web application for booking trekking packages in Nepal.

## Setup Instructions

1. Clone the repository to your local server directory (e.g., htdocs for XAMPP)
2. Create a MySQL database named `nepal_trek`
3. Execute the SQL script in `Backend/init.sql` to create the required tables
4. Ensure your database configuration in `Backend/config.php` matches your environment
5. Access the application through your web browser

## Database Configuration

The default configuration in `Backend/config.php` is:
- Host: localhost
- Database: nepal_trek
- Username: root
- Password: (empty)

Update these values if your database configuration is different.

## Authentication

The application includes a complete authentication system with:
- User registration
- User login
- Session management using localStorage
- Protected pages that display user information

## Features

- Browse trekking packages
- View package details
- Book trekking packages
- Contact form
- Newsletter subscription
- Responsive design for all devices

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: PHP
- Database: MySQL
- No external frameworks or libraries (vanilla PHP/JS)