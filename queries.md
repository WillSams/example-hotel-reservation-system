## query - reservation
{
  "roomId": "e142dd76-df6e-479c-945d-0f8bf9d7b52e",
    "checkinDate": "2021-02-01",
    "checkoutDate": "2021-02-02"
}

## query - availableRooms
{
    "startDate": "2021-02-01",
    "endDate": "2021-02-02",
    "numBeds": 1,
    "allowSmoking": false
}

## mutation - createReservation
{
     "input": {
        "roomId": "e142dd76-df6e-479c-945d-0f8bf9d7b52e",
      "checkinDate": "2021-02-01",
      "checkoutDate": "2021-02-02",
      "totalCharge": 187
    }
}


