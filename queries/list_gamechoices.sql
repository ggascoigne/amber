select u.id as "user.id", s.id as "slot.id", g.id as "game.id", m.id as "member.id", u.full_name, u.email, s.slot, g.name, g.gm_names, gc.rank, gc.year, gc.returning_player from game_choice gc 
	join game g on gc.game_id = g.id 
	join slot s on g.slot_id = s.id 
	join membership m on gc.member_id = m.id 
	join "user" u on m.user_id = u.id 
where gc.year = 2023
order by u.id, gc.year, s.slot, gc.rank