# Nepal Trek Trails

A web application for booking trekking packages in Nepal.

## Setup Instructions

1. Make sure XAMPP is installed and running
2. Place this project folder in your XAMPP htdocs directory
3. Start Apache in XAMPP Control Panel
4. Access the setup page at: http://localhost/NepalTrekTrails/setup_database.html
5. Click "Run Database Setup" to create the database tables
6. Click "Insert Sample Data" to add sample packages and an admin user
7. Visit the dashboard at: http://localhost/NepalTrekTrails/frontend/dashboard.html

## Database Credentials

The application uses the following database credentials (configured in `Backend/config.php`):
- Host: localhost
- Database: nepal_trek
- Username: root
- Password: (empty)

Make sure MySQL is running in XAMPP.

## Default Admin Account

After inserting sample data, you can log in with:
- Email: admin@nepaltrektrails.com
- Password: admin123

## File Structure

- `frontend/` - Contains all front-end files (HTML, CSS, JavaScript)
- `Backend/` - Contains all back-end files (PHP, SQL)
- `uploads/` - Directory for uploaded images

## Key Features

- Dynamic package loading from database
- User authentication
- Package booking system
- Blog functionality
- Responsive design

## Troubleshooting

If packages don't appear on the dashboard:
1. Make sure the database setup was completed successfully
2. Verify that sample data was inserted
3. Check the browser console for any JavaScript errors
4. Ensure Apache and MySQL are running in XAMPP