# On-line Payments Design

## Requirements

To securely and safely accept a wide range of on-line payments for charges, between the different cons: hotel rooms, memberships, t-shirts, gift cards, ...

## Constraints

We want to:

1. Not store payment instruments ever.
2. Not handle payment on our site(s).
3. Separate how the charges are generated from how they are paid, to allow for admin updates, credits, other flexible situations.
4. Have full auditing on changes.
5. Not use PayPal (Edwin).
6. Accept at least credit cards, debit cards, bank transfers, possibly more, from the United States of America, Canada, the United Kingdom, European Union countries.
7. Take payment through a provider that makes it easy to get money out into the convention's corporate account(s).
8. Make it easy to provide (partial or whole) refunds.
9. Easily provide balance and transactions on a user / convention basis.

## General Approach

We are looking to use Stripe Invoices, generated against (part of) the balance on the account.

This allows us to manage transaction amounts and update the total balance.

At any point the customer can choose to pay (part of) the balance. We use the Stripe API to generate an invoice. It is emailed to the customer's email on their account, as well as gets us a link we show on the balance page.

The customer pays (or lets the invoice expire), and we take the Stripe actions through a webhook, update invoice statuses, add transactions, and update the balance.

## Technical Approach

### Database Changes

1. In table membership could remove amount paid.
1. Create a table of transactions: user id, member id, year, datetimestamp, amount (positive or negative), origin of the change (user id or "Stripe Webhook", or can create a "system user" for Stripe Webhook and just use user id), notes. Optionally (a) foreign key(s) into activities or data related to the transaction (e.g. an invoice, payment).
    1. Create a trigger to sum the amount of all transactions by user/year and update the balance in the membership table.
    Alternative is to create a compound foreign key by member id / year, and sum as needed, but I think changes are relatively rare so I prefer not to take that hit. It also makes adding the field to the User table easy.
1. Create a table of Stripe invoices: user id, member id, year, datetimestamp, invoice id, amount, payment link, notes, status (additional fields per Stripe API spec, can store JSON blob out of the webhook).
   1. Create a trigger to generate a transaction when the status changes to paid, with the amount paid.
1. Create a table of Stripe invoice updates, with data from the Stripe Webhook calls, so we can have full auditing of state transitions, to show to the user.
    1. Create a trigger to:
       1. Update the status from the Webhook in the Stripe invoice table.

### UX Changes

We want to implement this in phases, so:

1. Membership Summary:
   1. Add Balance
   1. Add any open invoices, with payment links, date, amount, and an option to resent the invoice email.
1. Registration, Payment tab:
   1. Generate the Invoice on Stripe.
   1. Enter the invoice in the table.
   1. Show the payment link on that tab for immediate payment.
1. Add table for transactions.
1. Add table for invoices.
1. Add table for Stripe Webhook data (needs a more user-friendly name).
