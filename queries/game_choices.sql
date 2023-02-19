
-- who hasn't completed submitting choices
select u.id as "user.id", m.id as "member.id", u.full_name, u.email from membership m 
	left join "user" u on m.user_id = u.id 
where m.id not in (select distinct member_id from game_submission s where s.year = 2023) and m.year = 2023;

-- who has wonky game coice counts - note that 40 is 35 for NW
join ( select c.member_id, count(c.member_id) as total from game_choice c where c.year = 2023 group by c.member_id ) c2 
on (m.id = c2.member_id) where c2.total != 40;

-- game choices
select u.id as "user.id", gc.slot_id as slot, g.id as "game.id", m.id as "member.id", u.full_name, u.email, g.name, g.gm_names, gc.rank, gc.year, gc.returning_player, s.message from game_choice gc 
	join game g on gc.game_id = g.id 
	join membership m on gc.member_id = m.id 
	join "user" u on m.user_id = u.id 
	left join game_submission s on gc.member_id = s.member_id
where gc.year = 2023 
order by u.id, gc.year, gc.slot_id, gc.rank;

