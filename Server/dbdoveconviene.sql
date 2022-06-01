-- phpMyAdmin SQL Dump
-- version 4.1.7
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Giu 01, 2022 alle 08:21
-- Versione del server: 8.0.26
-- PHP Version: 5.6.40

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `my_claudioconte`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `images`
--

CREATE TABLE IF NOT EXISTS `images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image_name` varchar(200) NOT NULL,
  `image_ext` varchar(10) NOT NULL,
  `image_data` longblob NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Struttura della tabella `prodotti`
--

CREATE TABLE IF NOT EXISTS `prodotti` (
  `id` varchar(20) NOT NULL COMMENT 'codice a barre',
  `keywords` varchar(500) DEFAULT NULL COMMENT 'chiavi di ricerca',
  `categories` varchar(500) DEFAULT NULL COMMENT 'categorie',
  `creator` varchar(100) NOT NULL COMMENT 'creatore del record',
  `created_t` bigint NOT NULL COMMENT 'data di creazione del record',
  `generic_name` varchar(100) NOT NULL COMMENT 'nome prodotto',
  `image_front_url` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'immagine del prodotto',
  `ingredients_text` varchar(500) NOT NULL COMMENT 'ingredienti',
  `nutriments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin COMMENT 'nutrienti',
  `last_editor` varchar(100) DEFAULT NULL COMMENT 'ultimo aoutore modifica',
  `last_edited_t` bigint DEFAULT NULL COMMENT 'data ultima modifica',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `prodotti_supermercati`
--

CREATE TABLE IF NOT EXISTS `prodotti_supermercati` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codice_a_barre` varchar(20) NOT NULL,
  `codice_supermercato` varchar(500) NOT NULL,
  `prezzo` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `codice_a_barre` (`codice_a_barre`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci AUTO_INCREMENT=8 ;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `prodotti_supermercati`
--
ALTER TABLE `prodotti_supermercati`
  ADD CONSTRAINT `prodotti_supermercati_ibfk_1` FOREIGN KEY (`codice_a_barre`) REFERENCES `prodotti` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
