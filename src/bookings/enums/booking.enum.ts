export enum BookingStatus {
  CONFIRMED = 'CONFIRMED', // when user books the car
  ONGOING = 'ONGOING', // user is using car
  COMPLETED = 'COMPLETED', // user give car and money
  EXPIRED = 'EXPIRED', // when user did not come to take car
}
