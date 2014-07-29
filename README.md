#App Web Off-line with Database

### Frontend: HTML5, CSS3, twbs 3 and AngularJS <3
### Backend: Silex and Doctrine :)

#Install

### Install composer

	curl -s https://getcomposer.org/installer | php

### Execute

	php composer.phar install
	
### Create database

	CREATE DATABASE `offline` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
	USE `offline`;

	CREATE TABLE IF NOT EXISTS `notes` (
	  `id` int(6) NOT NULL AUTO_INCREMENT,
	  `note` text NOT NULL,
	  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	  PRIMARY KEY (`id`)
	) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

### Configure database connection
	Modify database connection parameters in index.php

### Run

	php -S localhost:8888
	php -S localhost:4444 -t web/
