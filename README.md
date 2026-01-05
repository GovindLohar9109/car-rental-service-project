# Car Rental Service — Backend Service

This repository contains the **Backend API** for the Car Rental Service System.  
It provides secure authentication, role-based access control, cars management, user management etc.

---

# Project Overview

The **Car Rental Service** is an application that allows users to rent cars for a specific period of time.  
The system provides an easy and convenient way for users to find, check availability, and book rental cars online.

---
# Core Functionalities 

This document describes the core functional use cases of the **Car Rental Service System**, covering **Admin**, **User**, and **Car Owner** roles.

---

## 1. Admin Functionality

### Admin Registration and Login
- Admins can register and log in to the system.
- Admins can manage users, including **Car Owners** and **Users**.

### Car and Booking Management
- Admins can manage all cars available in the system.
- Admins can deactivate or remove cars .
- Admins can view all bookings made by users .

### Monthly Booking Overview
- Admins can check the total number of bookings for each month.
- Admins can view detailed booking records for all months.
- The system provides monthly booking reports showing:
    - Total bookings
    - Associated revenues



## 2. User Functionality

### User Registration and Login
- Users can register and log in to the system.

### View and Search Cars
- Users can view available cars.
- Users can apply filters such as:
    - Location
    - Availability

### Booking a Car
- Users select a car and booking dates.
- The system calculates the price based on:
    - Booking duration
    - Estimated distance


### Pickup and Drop
- Users pick up the car according to the booking schedule.
- After trip completion, users drop the car.

### Email Notifications
- Users receive email notifications for:
    - Booking confirmation
    - Pickup confirmation
    - Drop-off confirmation

---

## 3. Car Owner Functionality

### Car Owner Registration and Login
- Car owners can register and log in to the system.

### Car Listing and Management
- Car owners can add new cars.
- Car owners can update or remove their cars.
- Car owners can view the list of their cars.

### Booking Monitoring
- Car owners receive email notifications when their car is booked.
- Car owners can view:
    - Upcoming bookings
    - Ongoing bookings

## Summary
This document outlines the core use cases of the **Car Rental Service System**, clearly defining the responsibilities and interactions of Admins, Users, and Car Owners.


