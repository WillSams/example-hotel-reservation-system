const { gql } = require('@apollo/client/core');

const { queryRequest } = require('./utils');

exports.getAvailableRooms = (variables = { startDate, endDate, numBeds, allowSmoking }) => {
  const query = gql`query AvailableRooms($startDate: String!, $numBeds: Int!, $allowSmoking: Boolean!, $endDate: String!) {
    availableRooms(startDate: $startDate, numBeds: $numBeds, allowSmoking: $allowSmoking, endDate: $endDate) {
      Id
      NumBeds
      AllowSmoking
      DailyRate
      CleaningFee
      TotalCharge
    }
  }`;

  return queryRequest(query, variables).then(data => data?.availableRooms || []);
};

exports.getReservations = () => {
  const query = gql`
  query Reservations {
    reservations {
      Id
      RoomId
      CheckinDate
      CheckoutDate
      TotalCharge
    }
  }`;

  return queryRequest(query, {}).then(data => data?.reservations);
};