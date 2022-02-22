const { gql } = require('@apollo/client/core');

const { mutationRequest } = require('./utils');

exports.createReservation = (variables = { roomId, checkinDate, checkoutDate, totalCharge }) => {
  const mutation = gql`
  mutation CreateReservation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      Id
      RoomId
      CheckinDate
      CheckoutDate
      TotalCharge
    }
  }`;
  return mutationRequest(mutation, { input: variables }).then(data => data);
};
