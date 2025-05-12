
# RuralConnect - Village Administration Platform

A comprehensive platform designed to bridge the gap between rural communities and authorities, empowering villages with digital tools for better governance and communication.

## Features

- **Issue Reporting**: Users can report local issues with images and track their resolution status
- **Community Events**: Calendar of upcoming village events and gatherings
- **Budget Transparency**: View allocation and utilization of public funds
- **Resources Repository**: Access government scheme information and documents
- **Village History**: Explore cultural heritage and historical information
- **Gallery**: View images showcasing rural life, traditions, and landscapes

## Technical Details

This project is built using:
- HTML5
- CSS3
- Vanilla JavaScript 

## Project Structure

- `index.html`: Home page
- `login.html`: Public user login
- `authority-login.html`: Authority login (Sarpanch, Ward Member, etc.)
- `report-issue.html`: Issue reporting form
- `events.html`: Community events calendar
- `budget.html`: Budget transparency information
- `history.html`: Village history and heritage
- `resources.html`: Resources and documents repository
- `gallery.html`: Image gallery of rural life
- `authority-dashboard.html`: Dashboard for village authorities

## Local Storage Data Structure

The project uses browser localStorage for data persistence:

- `isLoggedIn`: Boolean indicating if a user is logged in
- `userType`: Type of logged in user ('public' or 'authority')
- `authorityRole`: Role of authority user ('sarpanch', 'wise-sarpanch', or 'ward-member')
- `userIssues`: Array of issues reported by the current user
- `pendingIssues`: Issues waiting for authority approval
- `inProgressIssues`: Issues currently being addressed
- `resolvedIssues`: Issues that have been resolved
- `budgetItems`: Budget allocations and expenditures
- `eventItems`: Upcoming and past events
- `galleryItems`: Gallery images with metadata

## User Flows

**Public User Flow**:
1. View public information (events, budget, etc.)
2. Login to report issues
3. Submit and track reported issues

**Authority User Flow**:
1. Login with role-specific credentials
2. Manage reported issues according to hierarchy (Ward Member → Wise Sarpanch → Sarpanch)
3. Update content (budget, events, resources, gallery)
4. Manage profile settings

## Setup and Installation

1. Clone the repository
2. Open index.html in a web browser

No build process or server is required as this is a client-side only application.

## Demo Accounts

**Public User**:
- Phone: Any phone number
- Password: any password (for demo purposes)

**Authority**:
- Sarpanch: Email: sarpanch@gmail.com, Password: sarpanch
- Wise Sarpanch: Email: wisesarpanch@gmail.com, Password: wisesarpanch
- Ward Member: Email: wardmember@gmail.com, Password: wardmember
