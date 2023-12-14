# Invite Code System Requirements and Solutions

## Setup Instructions

### Setting Up Node.js Project

To get the Node.js project up and running, follow these steps:

1. Navigate to the project root directory.
2. Install the project dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```

### Running PostgreSQL with Docker Compose

Ensure you have Docker and Docker Compose installed on your system. Then follow these instructions:

1. To start the PostgreSQL database, use the following command:
   ```bash
   docker-compose up -d
   ```
2. Before proceeding, make sure to run the `t_codes.sql` script to set up the `T_CODES` table structure in your PostgreSQL database.

### Database Table Structure Initialization

Run the `t_codes.sql` script to initialize the `T_CODES` table in your database. This script should be executed against your PostgreSQL instance before the application interacts with the database.



## Requirements and Corresponding Solution Details

### 1. Limit on Invite Code Usage

- **Requirement**: Invite codes must have a limit on usage (once or multiple times).
- **Solution**: Introduced `is_used` boolean column in the `T_CODES` table. The auth service uses this flag to allow or block user registration.

### 2. Invite Code Security and Usability

- **Requirement**: Invite codes should be hard to guess, but not too difficult to type.
- **Solution**:
  - Implemented two endpoints:
    - An endpoint to create randomly generated codes in the format `AAAA-BBBB-CCCC` using the `crypto` library (see `generateInvitationCode` function).
    - An endpoint allowing business users to add specified codes to the whitelist.

### 3. Association of Invite Codes with Email Addresses

- **Requirement**: Each email address can only use one invite code, and codes are tied to specific email addresses.
- **Solution**: Added a `user_email` column to the `T_CODES` table. The auth service uses this column to enforce the association between invite codes and email addresses.

### 4. Invite Code Tracking

- **Requirement**: Invite codes should be trackable, and admins should be able to identify the referrer.
- **Solution**: Added `author_email` and `created_at` columns to the `T_CODES` table for tracking who created the invite code and when.

### 5. System Performance and Concurrency

- **Requirement**: The design must handle high traffic and concurrency effectively.
- **Solution**:
  - **Database Optimization**:
    - **Indices**: Usage of properly indexed tables to expedite read queries. Write operations are slower due to index updates on insertion, updating, or deletion.
  - **Server Performance**:
    - **Hardware**: Ensuring ample memory and CPU resources for the database server.
    - **Connection Pooling**: Implementing connection pools to manage database connections and to decrease the overhead of new connections.

### 6. Security Against Hacking

- **Requirement**: The design should be resilient to hacking attempts.
- **Solution**:
  - Utilization of the Express framework, recognized for its robust security features.
  - Proposed addition of CSRF tokens to headers in all POST methods as an enhanced security measure (to be implemented via `authMiddleware`).

## Additional Notes

- The auth service will need to implement additional logic based on these details to appropriately handle the potential for multiple usage or one-time usage of invite codes.
- It is recommended to consider the implementation of HTTP security headers and other best practices such as HTTPS, data validation, and secure handling of user sessions to further enhance security.