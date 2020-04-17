
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `async_mail_attachment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `async_mail_attachment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `attachment_name` varchar(255) NOT NULL,
  `content` longblob NOT NULL,
  `inline` bit(1) NOT NULL,
  `message_id` bigint(20) NOT NULL,
  `mime_type` varchar(255) NOT NULL,
  `attachments_idx` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1CACA0E817082B9` (`message_id`),
  CONSTRAINT `FK1CACA0E817082B9` FOREIGN KEY (`message_id`) REFERENCES `async_mail_mess` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `async_mail_bcc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `async_mail_bcc` (
  `message_id` bigint(20) NOT NULL,
  `bcc_string` varchar(320) DEFAULT NULL,
  `bcc_idx` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `async_mail_cc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `async_mail_cc` (
  `message_id` bigint(20) NOT NULL,
  `cc_string` varchar(320) DEFAULT NULL,
  `cc_idx` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `async_mail_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `async_mail_header` (
  `message_id` bigint(20) NOT NULL,
  `header_name` varchar(255) DEFAULT NULL,
  `header_value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `async_mail_mess`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `async_mail_mess` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `attempt_interval` bigint(20) NOT NULL,
  `attempts_count` int(11) NOT NULL,
  `begin_date` datetime NOT NULL,
  `create_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `from_column` varchar(320) DEFAULT NULL,
  `html` bit(1) NOT NULL,
  `last_attempt_date` datetime DEFAULT NULL,
  `mark_delete` bit(1) NOT NULL,
  `max_attempts_count` int(11) NOT NULL,
  `priority` int(11) NOT NULL,
  `reply_to` varchar(320) DEFAULT NULL,
  `sent_date` datetime DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `subject` varchar(988) NOT NULL,
  `text` longtext NOT NULL,
  `envelope_from` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7561 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `async_mail_to`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `async_mail_to` (
  `message_id` bigint(20) NOT NULL,
  `to_string` varchar(320) DEFAULT NULL,
  `to_idx` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `databasechangelog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `databasechangelog` (
  `ID` varchar(63) NOT NULL,
  `AUTHOR` varchar(63) NOT NULL,
  `FILENAME` varchar(200) NOT NULL,
  `DATEEXECUTED` datetime NOT NULL,
  `ORDEREXECUTED` int(11) NOT NULL,
  `EXECTYPE` varchar(10) NOT NULL,
  `MD5SUM` varchar(35) DEFAULT NULL,
  `DESCRIPTION` varchar(255) DEFAULT NULL,
  `COMMENTS` varchar(255) DEFAULT NULL,
  `TAG` varchar(255) DEFAULT NULL,
  `LIQUIBASE` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID`,`AUTHOR`,`FILENAME`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `databasechangeloglock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `databasechangeloglock` (
  `ID` int(11) NOT NULL,
  `LOCKED` tinyint(1) NOT NULL,
  `LOCKGRANTED` datetime DEFAULT NULL,
  `LOCKEDBY` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `email_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `email_code` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date_created` datetime NOT NULL,
  `email` varchar(64) NOT NULL,
  `token` varchar(255) NOT NULL,
  `unverified_email` varchar(64) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `unverified_email` (`unverified_email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `date_created` datetime NOT NULL,
  `description` longtext NOT NULL,
  `last_updated` datetime NOT NULL,
  `late_finish` bit(1) DEFAULT NULL,
  `late_start` varchar(50) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `player_max` int(11) NOT NULL,
  `player_min` int(11) NOT NULL,
  `room_id` bigint(20) DEFAULT NULL,
  `short_name` varchar(60) DEFAULT NULL,
  `slot_id` bigint(20) DEFAULT NULL,
  `char_instructions` longtext NOT NULL,
  `estimated_length` varchar(3) NOT NULL,
  `game_contact_email` varchar(64) NOT NULL,
  `genre` varchar(19) NOT NULL,
  `gm_names` varchar(255) DEFAULT NULL,
  `message` longtext NOT NULL,
  `player_preference` varchar(8) NOT NULL,
  `players_contact_gm` bit(1) NOT NULL,
  `returning_players` longtext NOT NULL,
  `setting` longtext NOT NULL,
  `slot_conflicts` longtext NOT NULL,
  `slot_preference` int(11) NOT NULL,
  `teen_friendly` bit(1) NOT NULL,
  `type` varchar(18) NOT NULL,
  `year` int(11) NOT NULL,
  `author_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK304BF2DAAAB80A` (`room_id`),
  KEY `FK304BF2A76012A` (`slot_id`),
  KEY `FK304BF252025E2D` (`author_id`),
  CONSTRAINT `FK304BF252025E2D` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FK304BF2A76012A` FOREIGN KEY (`slot_id`) REFERENCES `slot` (`id`),
  CONSTRAINT `FK304BF2DAAAB80A` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=903 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_assignment` (
  `member_id` bigint(20) NOT NULL,
  `game_id` bigint(20) NOT NULL,
  `date_created` datetime NOT NULL,
  `gm` int(11) NOT NULL,
  `last_updated` datetime NOT NULL,
  `year` int(11) NOT NULL,
  PRIMARY KEY (`member_id`,`game_id`,`gm`),
  KEY `FKD13B053A325504E6` (`member_id`),
  KEY `FKD13B053A7CBD4CAA` (`game_id`),
  CONSTRAINT `FKD13B053A325504E6` FOREIGN KEY (`member_id`) REFERENCES `membership` (`id`),
  CONSTRAINT `FKD13B053A7CBD4CAA` FOREIGN KEY (`game_id`) REFERENCES `game` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_choice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_choice` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `game_id` bigint(20) DEFAULT NULL,
  `member_id` bigint(20) NOT NULL,
  `rank` int(11) NOT NULL,
  `slot_id` bigint(20) NOT NULL,
  `year` int(11) NOT NULL,
  `returning_player` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKE51F1A8E7CBD4CAA` (`game_id`),
  KEY `FKE51F1A8E325504E6` (`member_id`),
  KEY `FKE51F1A8EA76012A` (`slot_id`),
  CONSTRAINT `FKE51F1A8E325504E6` FOREIGN KEY (`member_id`) REFERENCES `membership` (`id`),
  CONSTRAINT `FKE51F1A8E7CBD4CAA` FOREIGN KEY (`game_id`) REFERENCES `game` (`id`),
  CONSTRAINT `FKE51F1A8EA76012A` FOREIGN KEY (`slot_id`) REFERENCES `slot` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29926 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `game_submission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_submission` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `date_created` datetime NOT NULL,
  `member_id` bigint(20) NOT NULL,
  `message` varchar(1024) NOT NULL,
  `year` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1845B9B9325504E6` (`member_id`),
  CONSTRAINT `FK1845B9B9325504E6` FOREIGN KEY (`member_id`) REFERENCES `membership` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=846 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `hotel_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hotel_room` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `description` varchar(150) NOT NULL,
  `gaming_room` bit(1) NOT NULL,
  `occupancy` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `rate` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `login_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `login_record` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `date_created` datetime DEFAULT NULL,
  `last_updated` datetime DEFAULT NULL,
  `owner_id` bigint(20) NOT NULL,
  `remote_addr` varchar(255) NOT NULL,
  `remote_host` varchar(255) NOT NULL,
  `user_agent` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKF43101E75D301C05` (`owner_id`),
  CONSTRAINT `FKF43101E75D301C05` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22444 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `lookup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lookup` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `code_maximum` varchar(255) DEFAULT NULL,
  `code_minimum` varchar(255) DEFAULT NULL,
  `code_scale` int(11) DEFAULT NULL,
  `code_type` varchar(7) NOT NULL,
  `date_created` datetime NOT NULL,
  `internationalize` bit(1) NOT NULL,
  `last_updated` datetime NOT NULL,
  `ordering` varchar(9) NOT NULL,
  `realm` varchar(100) NOT NULL,
  `value_maximum` varchar(255) DEFAULT NULL,
  `value_minimum` varchar(255) DEFAULT NULL,
  `value_scale` int(11) DEFAULT NULL,
  `value_type` varchar(7) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `realm_uniq_1428789680126` (`realm`),
  KEY `lookup_realm_idx` (`realm`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `lookup_value`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lookup_value` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `code` varchar(255) NOT NULL,
  `date_created` datetime NOT NULL,
  `last_updated` datetime NOT NULL,
  `lookup_id` bigint(20) NOT NULL,
  `numeric_sequencer` decimal(19,2) NOT NULL,
  `sequencer` int(11) NOT NULL,
  `string_sequencer` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `lookup_id` (`lookup_id`,`code`),
  KEY `FKF9FA1A6CAEB338C7` (`lookup_id`),
  KEY `lv_code_idx` (`code`),
  CONSTRAINT `FKF9FA1A6CAEB338C7` FOREIGN KEY (`lookup_id`) REFERENCES `lookup` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `membership`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `membership` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `arrival_date` datetime NOT NULL,
  `attendance` varchar(255) NOT NULL,
  `attending` bit(1) NOT NULL,
  `date_created` datetime NOT NULL,
  `departure_date` datetime NOT NULL,
  `hotel_room_id` bigint(20) NOT NULL,
  `interest_level` varchar(255) NOT NULL,
  `last_updated` datetime NOT NULL,
  `message` varchar(1024) NOT NULL,
  `room_preference_and_notes` varchar(1024) NOT NULL,
  `rooming_preferences` varchar(255) NOT NULL,
  `rooming_with` varchar(250) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `volunteer` bit(1) NOT NULL,
  `year` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKB01D87D6F4495F3` (`hotel_room_id`),
  KEY `FKB01D87D6F1496BED` (`user_id`),
  CONSTRAINT `FKB01D87D6F1496BED` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKB01D87D6F4495F3` FOREIGN KEY (`hotel_room_id`) REFERENCES `hotel_room` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=894 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `profile`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profile` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `date_created` datetime NOT NULL,
  `email` varchar(64) NOT NULL,
  `email_hash` varchar(255) DEFAULT NULL,
  `full_name` varchar(64) NOT NULL,
  `last_updated` datetime NOT NULL,
  `phone_number` varchar(32) DEFAULT NULL,
  `snail_mail_address` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2678 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `registration_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `registration_code` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date_created` datetime NOT NULL,
  `token` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2904 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `authority` varchar(40) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `authority` (`authority`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `room` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `description` varchar(50) NOT NULL,
  `size` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `updated` bit(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setting` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `code` varchar(100) NOT NULL,
  `date_created` datetime NOT NULL,
  `last_updated` datetime NOT NULL,
  `type` varchar(7) NOT NULL,
  `value` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `setting_code_idx` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `shirt_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shirt_order` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `delivery_method` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `year` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKD3AA87C5F1496BED` (`user_id`),
  CONSTRAINT `FKD3AA87C5F1496BED` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=282 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `shirt_order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shirt_order_item` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `size` varchar(255) NOT NULL,
  `style` varchar(255) NOT NULL,
  `items_idx` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9A68BF4D68F646D4` (`order_id`),
  CONSTRAINT `FK9A68BF4D68F646D4` FOREIGN KEY (`order_id`) REFERENCES `shirt_order` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=384 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `slot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `slot` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `slot` int(11) NOT NULL,
  `day` varchar(20) NOT NULL,
  `formatted_date` varchar(30) NOT NULL,
  `length` varchar(20) NOT NULL,
  `time` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `version` bigint(20) NOT NULL,
  `account_expired` bit(1) NOT NULL,
  `account_locked` bit(1) NOT NULL,
  `action_hash` varchar(64) DEFAULT NULL,
  `date_created` datetime NOT NULL,
  `enabled` bit(1) NOT NULL,
  `last_updated` datetime NOT NULL,
  `password` varchar(64) NOT NULL,
  `password_expired` bit(1) NOT NULL,
  `profile_id` bigint(20) NOT NULL,
  `username` varchar(32) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `FK36EBCB11057627` (`profile_id`),
  CONSTRAINT `FK36EBCB11057627` FOREIGN KEY (`profile_id`) REFERENCES `profile` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2621 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `user_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_role` (
  `role_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`role_id`,`user_id`),
  KEY `FK143BF46A4C1EA80D` (`role_id`),
  KEY `FK143BF46AF1496BED` (`user_id`),
  CONSTRAINT `FK143BF46A4C1EA80D` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`),
  CONSTRAINT `FK143BF46AF1496BED` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

