# time-tracker

Simple web based time tracker with multiple timers. Each timer activation create a log entry. These Entries can be filtered and evaluated for a specific period of time in the admin area.

## Features
 - Web-based realtime application based on Meteor with nodejs backend an mongo db persitence
 - users with admn role are able to manage timers and timer log entires
 - configurable option for autmatic timer stop after a defined time period

## User Interface
The web based user interface use material design elements and contain the following sections

  ### Timer section for public users
 ![alt Timer section for public users](https://raw.github.com/the-duke/time-tracker/master/doc/images/Timers.png)

 ### Timer section for admin users
 ![alt Timer section for admin users](https://raw.github.com/the-duke/time-tracker/master/doc/images/Timers-Admin.png)

 ### Logs section for admin users to manage and view the total time for each timer in a specifiic time priod
 ![alt Logs for admin users](https://raw.github.com/the-duke/time-tracker/master/doc/images/Log-Entries-Admin.png)

 ### Settings section
 ![alt Settings section for admin users](https://raw.github.com/the-duke/time-tracker/master/doc/images/Settings-Admin.png)

 ## Setup
 ### Prerequisite
install nodejs and npm https://nodejs.org/en/
install meteor https://www.meteor.com/install

### Project
```
git clone https://github.com/the-duke/time-tracker.git
cd time-tracker
npm insall
npm run dev
```

open http://localhost:3000 in a web browser

To access the admin sections login with de default admin user
username: admin
password: admin

These default settings can be changed in the settings.json file
```
{ 
    "defaultUsers": [
        {"name":"admin", "email":"admin@example.com", "password": "admin", "roles":["admin"]}
    ],
    "removeAllUsers": true,
    "public":{
        "timerLimitEnable": true,
        "timerLimitTime": {
            "hours": 0,
            "minutes": 10,
            "seconds": 0
       },
       "recordsPerPage": 20
    }
}
```
 ## Run with Docker
install docker https://docs.docker.com/install/
install docker-compose https://docs.docker.com/compose/install/

 ```
cd time-tracker
docker-compose up
```

 ## Deployment with Docker
 A Docker image is published at Docker Hub at
 https://hub.docker.com/r/theduke84/time-tracker/

 ```
docker pull theduke84/time-tracker
docker compose
```