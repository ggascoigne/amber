-- @param {Int} $1:year
SELECT
  m.id,
  m.arrival_date AS "arrivalDate",
  m.attendance,
  m.attending,
  m.departure_date AS "departureDate",
  m.hotel_room_id AS "hotelRoomId",
  m.interest_level AS "interestLevel",
  m.message,
  m.room_preference_and_notes AS "roomPreferenceAndNotes",
  m.rooming_preferences AS "roomingPreferences",
  m.rooming_with AS "roomingWith",
  m.user_id AS "userId",
  m.volunteer,
  m.year,
  m.offer_subsidy AS "offerSubsidy",
  m.request_old_price AS "requestOldPrice",
  m.slots_attending AS "slotsAttending",
  m.cost,
  u.id user_id,
  u.email user_email,
  u.full_name user_full_name,
  u.first_name user_first_name,
  u.last_name user_last_name,
  u.display_name user_display_name,
  u.balance user_balance,
  hr.id hotel_room_id,
  hr.description hotel_room_description,
  hr.gaming_room hotel_room_gaming_room,
  hr.occupancy hotel_room_occupancy,
  hr.quantity hotel_room_quantity,
  hr.rate hotel_room_rate,
  hr.bathroom_type hotel_room_bathroom_type,
  hr.type hotel_room_type,
  p.id profile_id,
  p.user_id profile_user_id,
  p.snail_mail_address profile_snail_mail_address,
  p.phone_number profile_phone_number,
  p.room_accessibility_preference profile_room_accessibility_preference
FROM membership m
JOIN "user" u
  ON u.id = m.user_id
JOIN hotel_room hr
  ON hr.id = m.hotel_room_id
LEFT JOIN profile p
  ON p.user_id = u.id
WHERE
  m.year = $1
ORDER BY
  m.id,
  p.id
