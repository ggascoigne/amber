select distinct u.* from "user" u
join membership m on u.id = m.user_id
join game_assignment ga on ga.member_id = m.id
where ga.gm != 0 and ga.year = 2020;
