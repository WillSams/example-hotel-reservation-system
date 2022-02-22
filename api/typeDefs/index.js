const { gql } = require('apollo-server-hapi');

const typeDefs = gql`
schema {
  query: Query
  mutation: Mutation
}

type Reservation {
  Id: Int
  RoomId: ID!
  CheckinDate: String!
  CheckoutDate: String!
  TotalCharge: Int!
}

type Room {
  Id: ID!
  NumBeds: Int!
  AllowSmoking: Boolean!
  DailyRate: Int!
  CleaningFee: Int!
  TotalCharge: Int
}

input CreateReservationInput {
  roomId: String!
  checkinDate: String!
  checkoutDate: String!
  totalCharge: Int!
}

type Mutation {
  createReservation(input: CreateReservationInput!): Reservation
}

type Query {
  reservation(roomId: String!, checkinDate: String!, checkoutDate: String!): Reservation
  reservations: [Reservation]
  availableRooms(startDate: String!, endDate: String!, numBeds: Int!, allowSmoking: Boolean!): [Room]
}
`;

module.exports = typeDefs;