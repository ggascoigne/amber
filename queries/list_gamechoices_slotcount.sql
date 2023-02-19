select u.id as "user.id", u.full_name, u.email, count(distinct s.id) as "slot_choices"
from membership m
    left join game_choice gc on gc.member_id = m.id
	left join game g on gc.game_id = g.id 
	left join slot s on g.slot_id = s.id 
	left join "user" u on m.user_id = u.id 
where m.year = 2023
group by u.id, u.full_name, u.email
order by full_name
