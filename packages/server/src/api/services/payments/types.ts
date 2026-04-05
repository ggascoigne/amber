export type UserPaymentDetails = {
  userId: number
  memberId: number | null
  total: number
  membership: number
  donation: number
}

export type PaymentIntentRecord = {
  amount: number
  clientSecret: string | null
  currency: string
  id: string
  status: string
}
