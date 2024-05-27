// keep in sync with packages/amber/views/Payment/PaymentInput.tsx
export type UserPaymentDetails = {
  userId: number
  memberId: number | null
  total: number
  membership: number
  donation: number
}
