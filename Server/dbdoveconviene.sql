-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Mag 17, 2022 alle 12:48
-- Versione del server: 10.4.21-MariaDB
-- Versione PHP: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbdoveconviene`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `prodotti`
--

CREATE TABLE if not exists `prodotti` (
  `id` varchar(20) NOT NULL COMMENT 'codice a barre',
  `keywords` varchar(500) DEFAULT NULL COMMENT 'chiavi di ricerca',
  `categories` varchar(500) DEFAULT NULL COMMENT 'categorie',
  `creator` varchar(100) NOT NULL COMMENT 'creatore del record',
  `created_t` bigint(20) NOT NULL COMMENT 'data di creazione del record',
  `generic_name` varchar(100) NOT NULL COMMENT 'nome prodotto',
  `image_front_url` varchar(200) NULL COMMENT 'immagine del prodotto',
  `ingredients_text` varchar(500) NOT NULL COMMENT 'ingredienti',
  `nutriments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'nutrienti',
  `last_editor` varchar(100) DEFAULT NULL COMMENT 'ultimo aoutore modifica',
  `last_edited_t` bigint(20) DEFAULT NULL COMMENT 'data ultima modifica'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `prodotti_supermercati`
--

CREATE TABLE if not exists `prodotti_supermercati` (
  `id` int(11) NOT NULL,
  `codice_a_barre` varchar(20) NOT NULL,
  `codice_supermercato` varchar(500) NOT NULL,
  `prezzo` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `prodotti`
--
ALTER TABLE `prodotti`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `prodotti_supermercati`
--
ALTER TABLE `prodotti_supermercati`
  ADD PRIMARY KEY (`id`),
  ADD KEY `codice_a_barre` (`codice_a_barre`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `prodotti_supermercati`
--
ALTER TABLE `prodotti_supermercati`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `prodotti_supermercati`
--
ALTER TABLE `prodotti_supermercati`
  ADD CONSTRAINT `prodotti_supermercati_ibfk_1` FOREIGN KEY (`codice_a_barre`) REFERENCES `prodotti` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
