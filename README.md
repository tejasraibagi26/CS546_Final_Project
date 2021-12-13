# CS546 Final Project | Sports Booking

A website to book venues for your favourite sport directly from the comfort of your house!

Created using HTML | CSS | JS | Express | NodeJs | MongoDB

## How to Setup

- Run ```npm install ``` to download all dependencies
- Run ```npm run seed``` to seed database.
- About seeding :
  1. Seeding will create set of random users, owners, venues, reports and comments.
  2. The default password are:
     User: Project@123
     Owner: Owner@123
  3. Admin login details: 
     Email: admin@gmail.com
     Password: Admin@123
  

## Working of the website

- On loading. the user is displayed a landing page that provides the user a searchbox to search for a sport also describes in short what our website has to offer.
- Unauthenticated users can only search and browse the venues.
- Authenticated 'users' are able to book the venue, leave a review and rate the venue.
- Authenticated 'owners' can create a new listing for their venue and set the visibility of the venue.
- Admins have access to entire functionality of the website. 

## Extra features

- Report posts and venues.
- Automatically delete post when the deadline is expired.
- Owners can add a request for their venue to be added in.
