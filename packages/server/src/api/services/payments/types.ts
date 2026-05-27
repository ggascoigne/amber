export type UserPaymentDetails = {
  userId: number
  memberId: number | null
  total: number
  membership: number
  donation: number
  donationSource?: 'payment' | 'membership' | 'none'
}

export type PaymentIntentRecord = {
  amount: number
  clientSecret: string | null
  currency: string
  id: string
  status: string
}
