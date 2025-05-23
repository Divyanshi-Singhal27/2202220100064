Average Calculator HTTP Microservice

Description

A lightweight HTTP microservice built to calculate the average of a set of numbers. Designed for integration into distributed systems or use as a standalone API.


---

Features

Accepts a list of numbers via HTTP request

Returns the average as a JSON response

Lightweight and stateless

Built with [your stack – e.g., Node.js/Express, Flask, etc.]



---

API Usage

Endpoint: POST /average

Request Body (JSON):

{
  "numbers": [10, 20, 30, 40]
}

Response (JSON):

{
  "average": 25.0
}

Errors:

400 Bad Request if numbers is missing or invalid

500 Internal Server Error for unexpected issues
