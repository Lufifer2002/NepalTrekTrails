-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 23, 2025 at 07:37 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nepal_trek`
--

-- --------------------------------------------------------

--
-- Table structure for table `blogs`
--

CREATE TABLE `blogs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `author_name` varchar(100) NOT NULL,
  `author_email` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `package_id` int(11) NOT NULL,
  `package_name` varchar(150) NOT NULL,
  `customer_name` varchar(120) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(80) DEFAULT NULL,
  `people_count` int(11) NOT NULL,
  `travel_date` date NOT NULL,
  `payment_option` varchar(50) NOT NULL,
  `special_requests` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(50) NOT NULL DEFAULT 'Pending',
  `transaction_id` varchar(100) DEFAULT NULL,
  `paid_amount` decimal(10,2) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `packages`
--

CREATE TABLE `packages` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `difficulty` varchar(50) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `trek_highlights` text DEFAULT NULL,
  `daily_itinerary` text DEFAULT NULL,
  `whats_included` text DEFAULT NULL,
  `gallery_urls` text DEFAULT NULL,
  `map_image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `packages`
--

INSERT INTO `packages` (`id`, `name`, `description`, `duration`, `price`, `difficulty`, `image_url`, `trek_highlights`, `daily_itinerary`, `whats_included`, `gallery_urls`, `map_image_url`, `created_at`) VALUES
(9, 'Everest Base Camp Trek', 'Classic trek to the base of Mount Everest, passing through Sherpa villages and Sagarmatha National Park. Experience the Himalayan culture, monasteries, and incredible mountain views.', 14, 20000.00, 'Moderate', '../uploads/blog_693bdba1790b5_1765530529.jpeg', 'Everest Base Camp (5,364m)\nKala Patthar sunrise viewpoint\nSherpa villages (Namche, Tengboche)\nKhumbu Glacier and Icefall', 'Day 1: Kathmandu – Lukla – Phakding\nDay 2: Phakding – Namche Bazaar\nDay 3: Acclimatization at Namche\nDay 4: Namche – Tengboche\nDay 5: Tengboche – Dingboche\nDay 6: Acclimatization in Dingboche\nDay 7: Dingboche – Lobuche\nDay 8: Lobuche – Gorakshep – EBC – Gorakshep\nDay 9: Gorakshep – Kala Patthar – Pheriche\nDay 10: Pheriche – Namche\nDay 11: Namche – Lukla\nDay 12: Fly to Kathmandu', 'Guide\nPorter\nPermits(SAGARMATHA+TIMS)\nFlight(kathmandu-lukla)\nAccomadation\nBreak/lunch/Dinner', '', '../uploads/blog_693c135993e87_1765544793.webp', '2025-12-10 01:47:52'),
(11, 'Annapurna Base Camp (ABC) Trek', 'A scenic trek into the Annapurna Sanctuary surrounded by 7000–8000m peaks.', 10, 15000.00, 'Moderate', '../uploads/blog_693c18236fc1e_1765546019.jpg', 'Annapurna Sanctuary\nMountain panoramas\nHot springs at Jhinu\nTraditional Gurung villages', 'Day 1: Pokhara – Nayapul – Ghandruk\nDay 2: Ghandruk – Chhomrong\nDay 3: Chhomrong – Bamboo\nDay 4: Bamboo – Deurali\nDay 5: Deurali – ABC\nDay 6: Deurali – ABC\nDay 7: Bamboo – Jhinu (Hot Springs\nDay 8: Jhinu – Nayapul – Pokhara', 'Guide\nPorter\nACAP\nTIMS\nAccommodation\nBreakfast/Lunch/Dinner', '', '../uploads/blog_693c18237ae46_1765546019.png', '2025-12-12 13:26:59'),
(12, 'Annapurna Circuit Trek', 'A classic Himalayan circuit crossing Thorong La Pass and exploring diverse terrain.', 12, 18000.00, 'Moderate', '../uploads/blog_693c1c4252b62_1765547074.jpg', 'Thorong La Pass (5,416m)\nMuktinath Temple\nManang village\nKali Gandaki Valley', 'Day 1: : Kathmandu – Besisahar\nDay 2: Besisahar – Chamje\nDay 3: Chamje – Dharapani\nDay 4: Dharapani – Chame\nDay 5: Chame – Pisang\nDay 6: Pisang – Manang\nDay 7: Acclimatization in Manang\nDay 8: Manang – Yak Kharka\nDay 9: Yak Kharka – Thorong Phedi\nDay 10: Thorong La – Muktinath\nDay 11: Muktinath – Jomsom\nDay 12: Jomsom – Pokhara', 'Guide\nPorter\nPermits\nFood\nAccomodation\nTransport', '', '../uploads/blog_693c1c4259fef_1765547074.png', '2025-12-12 13:44:34'),
(13, 'Lantang Valley Trek', 'A short, beautiful trek featuring Tamang culture and stunning Himalayan valleys.', 7, 12000.00, 'Moderate', '../uploads/blog_693c1d6f3e162_1765547375.jpeg', 'Langtang Valley\nKyanjin Gompa\nKyanjin Ri viewpoint\nRhododendron forests', 'Day 1: Kathmandu – Syabrubesi\nDay 2: Syabrubesi – Lama Hotel\nDay 3: Lama Hotel – Langtang\nDay 4: Langtang – Kyanjin Gompa\nDay 5: Kyanjin Ri Hike\nDay 6: Return to Lama Hotel\nDay 7: Lama Hotel – Syabrubesi – Kathmandu', 'guide\nporter\nlangtang permit\nMeal\nAccomodation', '', '../uploads/blog_693c1d6f4bb99_1765547375.webp', '2025-12-12 13:49:35'),
(15, 'Manaslu Circuit Trek', 'Remote trek circling Mt. Manaslu, featuring Tibetan-style villages, high mountain passes, lush valleys, and diverse landscapes. A culturally rich and less crowded alternative to the Annapurna Circuit.', 14, 15000.00, 'Challenging', '../uploads/blog_693c2f1377a0b_1765551891.webp', 'Larke La Pass\nManaslu Conservation Area\ntraditional Tibetan villages\nHigh-altitude views', 'Day 1: Drive Kathmandu → Soti Khola\nDay 2: Trek Soti Khola → Machha Khola\nDay 3: Trek Machha Khola → Jagat\nDay 4: Trek Jagat → Deng\nDay 5: Trek Deng → Namrung\nDay 6: Trek Namrung → Samagaon\nDay 7: Acclimatization hike in Samagaon\nDay 8: Trek Samagaon → Samdo\nDay 9: Trek Samdo → Larke La Pass → Bimtang\nDay 10: Trek Bimtang → Dharapani\nDay 11: Trek Dharapani → Jagat\nDay 12: Trek Jagat → Soti Khola\nDay 13: Drive Soti Khola → Kathmandu\nDay 14: Rest day in Kathmandu / departure', 'Guide\nPorter\nAccomodation\nManaslu Restricted Permit\nTIMS/ACAP Permit', '', '../uploads/blog_693c2f1380097_1765551891.webp', '2025-12-12 14:51:18'),
(16, 'Upper Mustang Trek', 'Trek through the ancient Tibetan kingdom of Lo, featuring arid desert landscapes, walled villages, monasteries, and unique cave systems. Restricted area permits are required.', 12, 180000.00, 'Moderate', '../uploads/blog_693c31fc2bd39_1765552636.jpeg', 'Desert canyons\nAncient monasteries\nTibetan culture\nTibetan culture', 'Day 1: Fly/Drive Kathmandu → Pokhara/Jomsom → Kagbeni\nDay 2: Trek Kagbeni → Chele\nDay 3: Trek Chele → Tsarang\nDay 4: Trek Tsarang → Lo-Manthang\nDay 5: Explore Lo-Manthang, monasteries &#38;#38;#38; walled city\nDay 6: Lo-Manthang → Ghiling\nDay 7: Ghiling → Chhuksang\nDay 8: Chhuksang → Chele\nDay 9: Chele → Kagbeni\nDay 10: Trek Kagbeni → Jomsom → Fly/Drive Pokhara\nDay 11: Rest in Pokhara\nDay 12: Return to Kathmandu', 'Restricted Mustang trekking permit\nGuide\nAccommodation\nTransport to/from starting point\nMeals', '', '../uploads/blog_693c31fc2e472_1765552636.webp', '2025-12-12 15:10:16'),
(17, 'Ghorepani Poon Hill Trek', 'Short and scenic trek in the Annapurna region, famous for panoramic mountain views and the sunrise at Poon Hill. Ideal for beginners and families seeking a quick Himalayan experience.', 4, 10000.00, 'Easy', '../uploads/blog_693c33f7eb0e1_1765553143.jpeg', 'Poon Hill sunrise,\npanoramic Annapurna Dhaulagiri views,\nGurung villages, rhododendron forests,\nstone steps', 'Day 1: Drive Pokhara → Nayapul → Trek to Ulleri\nDay 2: Trek Ulleri → Ghorepani\nDay 3: Early morning hike to Poon Hill for sunrise → Trek Ghorepani → Tadapani\nDay 4: Trek Tadapani → Nayapul → Drive back to Pokhara', 'Guide,\naccommodation,\nmeals,\nACAP/TIMS permits,\ntransport from/to Pokhara', '', '../uploads/blog_693c33f7eeec5_1765553143.webp', '2025-12-12 15:20:31'),
(18, 'Mardi Himal Trek', 'Scenic trek to the base of Mardi Himal, offering close-up views of Machhapuchare (Fishtail), Annapurna South, and the surrounding peaks. Less crowded than Annapurna Base Camp trek and ideal for nature lovers.', 5, 12000.00, 'Moderate', '../uploads/blog_693c355d81d0b_1765553501.jpeg', 'Machhapuchare (Fishtail) views\nMardi Himal Base Camp\nforest trails, ridge walks\npanoramic Annapurna views', 'Day 1: Drive Pokhara → Kande → Trek to Forest Camp\nDay 2: Trek Forest Camp → Low Camp → High Camp\nDay 3: High Camp → Mardi Himal Base Camp → High Camp\nDay 4: Trek High Camp → Forest Camp\nDay 5: Trek Forest Camp → Kande → Drive back to Pokhara', 'Guide\naccommodation\nmeals\nACAP/TIMS permits\nporter', '', '../uploads/blog_693c355d85bf7_1765553501.jpg', '2025-12-12 15:27:39'),
(19, 'Kanchenjunga Base Camp Trek', 'Remote and challenging trek to the base of the world’s third-highest mountain, Kanchenjunga, passing through pristine wilderness, traditional villages, and high passes. Ideal for experienced trekkers.', 20, 25000.00, 'Extreme', '../uploads/blog_693c368637157_1765553798.webp', 'Kanchenjunga Base Camp\nHigh passes, remote villages\nGlaciers, pristine landscapes\nTibetan culture', 'Day 1: Fly Kathmandu → Taplejung → Suketar\nDay 2: Suketar → Amjilosa\nDay 3: Amjilosa → Ghunsa\nDay 4: Ghunsa → Ghunsa La\nDay 5: Ghunsa La → Lhonak\nDay 6: Explore Lhonak → approach Kanchenjunga Base Camp\nDay 7: Kanchenjunga Base Camp exploration\nDay 8: Trek back to Lhonak\nDay 9: Lhonak → Ghunsa\nDay 10: Ghunsa → Amjilosa\nDay 11: Amjilosa → Suketar → Fly Kathmandu\nDay 12: Day 12-20: Optional acclimatization/exploration and return to Kathmandu', 'Guide\nPorter\nAccommodation\nMeals\nKanchenjunga Restricted Area Permit\nTIMS permits\nFlights to/from Suketar', '', '../uploads/blog_693c36863f238_1765553798.jpg', '2025-12-12 15:34:27'),
(20, 'Helambu Trek', 'Cultural trek near Kathmandu through the Helambu region, featuring Sherpa villages, monasteries, beautiful forests, and scenic landscapes. Ideal for beginners and short treks.', 5, 7000.00, 'Easy', '../uploads/blog_693c3df11ded7_1765555697.jpeg', 'Helambu valley\ntraditional Sherpa villages\nmonasteries\nrhododendron and pine forests\nscenic viewpoints', 'Day 1: Drive Kathmandu → Sundarijal → Trek to Chisapani\nDay 2: Chisapani → Kutumsang\nDay 3: Kutumsang → Thadepati → Sermathang\nDay 4: Sermathang → Melamchi Gaun → Tarke Ghyang\nDay 5: Tarke Ghyang → Drive back to Kathmandu', 'Guide\nAccommodation\nMeals\nTIMS permits\ntransport to/from trek starting point', '', '../uploads/blog_693c3835e6b50_1765554229.jpg', '2025-12-12 15:39:21'),
(21, 'Rara Lake Trek', 'Trek to Rara Lake, Nepal’s largest freshwater lake, located in the remote far-western region. Known for pristine landscapes, crystal-clear waters, and diverse wildlife.', 7, 13000.00, 'Moderate', '../uploads/blog_693c39cd747b2_1765554637.jpeg', 'Rara Lake\npristine forests\nremote far-western villages\nsnow-capped mountains\nwildlife', 'Day 1: Fly Kathmandu → Nepalgunj → Talcha → Trek to Chhayanath\nDay 2: Trek Chhayanath → Uwa\nDay 3: Trek Uwa → Rara Lake\nDay 4: Explore Rara Lake and nearby viewpoints\nDay 5: Trek Rara Lake → Uwa\nDay 6: Trek Uwa → Chhayanath\nDay 7: Trek Chhayanath → Talcha → Fly Nepalgunj → Kathmandu', 'Guide\nAccommodation\nMeals\nRara National Park permit\ntransport domestic flights', '', '../uploads/blog_693c39cd7d07e_1765554637.gif', '2025-12-12 15:47:41'),
(22, 'Upper Dolpo Trek', 'Remote trek through Upper Dolpo region with Tibetan-influenced villages, high passes, and pristine landscapes.', 18, 25000.00, 'Extreme', '../uploads/blog_693c461e1c60c_1765557790.jpg', 'Shey Gompa\nPhoksundo Lake\nTibetan culture\nhigh passes\nremote villages', 'Day 1: Fly Kathmandu → Nepalgunj → Juphal\nDay 2: Trek Juphal → Dunai\nDay 3: Dunai → Tarakot\nDay 4: Tarakot → Saldang\nDay 5: Saldang → Ringmo\nDay 6: Explore Ringmo &#38;#38;#38;#38; Phoksundo Lake\nDay 7: Ringmo → Chharka\nDay 8: Chharka → Luri\nDay 9: Luri → Shey Gompa\nDay 10: Shey Gompa → Lo Monthang\nDay 11: Day 11-17: Exploration of Lo Monthang and surrounding villages\nDay 18: Return trek to Juphal → Fly to Nepalgunj → Kathmandu', 'Guide\nPorter\nAccommodation\nMeals\nUpper Dolpo Restricted Permit\nTIMS\ndomestic flights', '', '../uploads/blog_693e8649af149_1765705289.jpg', '2025-12-12 16:02:30'),
(23, 'Gokyo Lakes Trek', 'Trek to the famous turquoise Gokyo Lakes with stunning Everest-region panoramas and less crowded trails.', 10, 22000.00, 'Moderate', '../uploads/blog_693c45b477718_1765557684.webp', 'Gokyo Lakes\nGokyo Ri viewpoint\nEverest views\nKhumbu glacier\nSherpa villages', 'Day 1: Fly Kathmandu → Lukla → Phakding\nDay 2: Trek Phakding → Namche Bazaar\nDay 3: Acclimatization at Namche\nDay 4: Namche → Dole\nDay 5: Dole → Machhermo\nDay 6: Machhermo → Gokyo\nDay 7: Hike Gokyo Ri → Explore Gokyo Lakes\nDay 8: Gokyo → Thangnak\nDay 9: Thangnak → Namche Bazaar\nDay 10: Trek Namche → Lukla → Fly Kathmandu', 'Guide\nPorter\nAccommodationM\nMeals\nTIMS/ACAP permits\nLukla flights', '', '../uploads/blog_693c45b47d0c2_1765557684.jpg', '2025-12-12 16:02:30'),
(24, 'Makalu Base Camp Trek', 'Challenging trek to the remote Makalu Base Camp with Himalayan peaks and Sherpa culture.', 16, 18000.00, 'Extreme', '../uploads/blog_693c45916b714_1765557649.jpg', 'Makalu Base Camp\nBarun Valley\nhigh passes\nSherpa villages', 'Day 1: Fly Kathmandu → Tumlingtar\nDay 2: Trek Tumlingtar → Chichila\nDay 3: Chichila → Khongma\nDay 4: Khongma → Tashigaon\nDay 5: Tashigaon → Seduwa\nDay 6: Seduwa → Yangma\nDay 7: Yangma → Dobhan\nDay 8: Dobhan → Num\nDay 9: Num → Seduwa\nDay 10: Trek Seduwa → Tashigaon\nDay 11: Tashigaon → Khongma\nDay 12: Khongma → Chichila\nDay 13: Chichila → Tumlingtar → Fly Kathmandu\nDay 14: Day 14-16: Buffer days for acclimatization and exploration', 'Guide\nPorter\nAccommodation\nMeals\nMakalu Barun National Park permit\ndomestic flights', '', '../uploads/blog_693c459177b74_1765557649.jpg', '2025-12-12 16:02:30'),
(25, 'Tsum Valley Trek', 'Sacred Himalayan valley trek known for monasteries, Tibetan culture, and pristine landscapes.', 14, 20000.00, 'Moderate', '../uploads/blog_693c454c54d73_1765557580.jpg', 'Tsum Valley\nMu Gompa\nTibetan culture\ntraditional villages\nhigh-altitude landscapes', 'Day 1: Drive Kathmandu → Arughat → Soti Khola\nDay 2: Trek Soti Khola → Machha Khola\nDay 3: Machha Khola → Jagat\nDay 4: Jagat → Chumling\nDay 5: Chumling → Chhekampar\nDay 6: Chhekampar → Nile\nDay 7: Nile → Chhokang Paro\nDay 8: Chhokang Paro → Mu Gompa\nDay 9: Explore Mu Gompa &#38;#38; Tsum villages\nDay 10: Trek back to Nile\nDay 11: Nile → Chhekampar\nDay 12: Chhekampar → Jagat\nDay 13: Jagat → Soti Khola → Drive Kathmandu\nDay 14: Rest in Kathmandu', 'Guide\nPorter\nAccommodation\nMeals\nTsum Valley Restricted Area Permit\nTIMS permits', '', '../uploads/blog_693c454c5bd7f_1765557580.jpg', '2025-12-12 16:02:30'),
(26, 'Nar Phu Valley Trek', 'Hidden valley trek combining Tibetan culture, remote villages, and high passes like Kang La Pass.', 10, 30000.00, 'Challenging', '../uploads/blog_693c440c9050c_1765557260.jpg', 'Nar &#38; Phu villages\nKang La Pass\nTibetan culture\nRemote high-altitude landscapes', 'Day 1: Drive Kathmandu → Besisahar → Dharapani\nDay 2: Dharapani → Koto\nDay 3: Koto → Chame\nDay 4: Chame → Ngawal\nDay 5: Ngawal → Phu Village\nDay 6: Phu → Kang La Pass → Nar Village\nDay 7: Nar Village → Braga\nDay 8: Braga → Chame\nDay 9: Chame → Dharapani → Drive Kathmandu\nDay 10: Rest/Recovery in Kathmandu', 'Guide\nPorter\nAccommodation\nMeals\nRestricted Area Permit\nTIMS', '', '', '2025-12-12 16:02:30'),
(27, 'Kathmandu Valley Rim Trek', 'Short and easy trek with hilltop views, monasteries, and forests surrounding Kathmandu Valley.', 3, 12000.00, 'Easy', '../uploads/blog_693c42ce8496f_1765556942.jpg', 'Nagarkot sunrise\nforests, hilltop viewpoints\nmonasteries', 'Day 1: Drive Kathmandu → Sundarijal → Trek to Chisapani\nDay 2: Chisapani → Nagarkot → Explore village trails\nDay 3: Trek back to Sundarijal → Drive Kathmandu', 'Guide\nAccommodatio\nMeals\nPermits\nTransport to/from Kathmandu', '', '../uploads/blog_693c42ce935c9_1765556942.jpg', '2025-12-12 16:02:30'),
(28, 'Pikey Peak Trek', 'Short trek offering Everest views and less crowded trails in the Solukhumbu region.', 5, 15000.00, 'Easy', '../uploads/blog_693c42623e63a_1765556834.jpg', 'Pikey Peak summit sunrise\nEverest &#38; Makalu views\nrural villages', 'Day 1: Drive Kathmandu → Junbesi\nDay 2: Trek Junbesi → Sete\nDay 3: Trek Sete → Pikey Peak → Junbesi\nDay 4: Trek Junbesi → Bupsa\nDay 5: Bupsa → Drive to Kathmandu', 'Guide\nAccommodation\nMeals\nTIMS/ACAP permits', '', '../uploads/blog_693c42624a5aa_1765556834.jpeg', '2025-12-12 16:02:30'),
(29, 'Khopra Ridge Trek', 'Peaceful Annapurna-region trek with panoramic ridge views and lakes, less crowded than Poon Hill.', 7, 18000.00, 'Moderate', '../uploads/blog_693c4134ddb91_1765556532.jpg', 'Khopra Ridge\nKhayer Lake\npanoramic Annapurna &#38;#38; Dhaulagiri views\ntraditional Gurung villages', 'Day 1: Drive Pokhara → Nayapul → Tikhedhunga\nDay 2: Trek Tikhedhunga → Ghorepani\nDay 3: Ghorepani → Tadapani\nDay 4: Tadapani → Chitre → Khopra Base\nDay 5: Khopra Base → Khopra Ridge → Khopra\nDay 6: Khopra → Banthanti\nDay 7: Banthanti → Nayapul → Drive Pokhara', 'Guide\nAccommodation\nMeals\nPermits', '', '../uploads/blog_693c4134e99aa_1765556532.jpg', '2025-12-12 16:02:30'),
(30, 'Dhaulagiri Circuit Trek', 'Challenging trek around Mt. Dhaulagiri, crossing high passes and remote valleys with spectacular Himalayan scenery.', 16, 18000.00, 'Challenging', '../uploads/blog_693c40109102a_1765556240.jpeg', 'High passes\nGlaciers\nDhaulagiri views\nRemote villages\nKali Gandaki valley', 'Day 1: Drive Beni → Dunai\nDay 2: Dunai → Chainpur\nDay 3: Chainpur → Phoksundo Lake\nDay 4: Phoksundo → Lete\nDay 5: Lete → Mukot\nDay 6: Mukot → Darbang\nDay 7: Darbang → Bagarchhap\nDay 8: Bagarchhap → Chame\nDay 9: Chame → Manang\nDay 10: Manang → Thorong Phedi\nDay 11: Thorong La Pass → Muktinath\nDay 12: Muktinath → Jomsom\nDay 13: Fly Jomsom → Pokhara\nDay 14: Day 14-16: Buffer/Rest days or extended exploration', 'Guide\nPorter\nAccommodation\nMeals\nACAP/TIMS permits\nLukla flights', '', '../uploads/blog_693c40109b58c_1765556240.webp', '2025-12-12 16:02:30');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `created_at`) VALUES
(1, 'Rashel', 'thapa.rashelll@gmail.com', '$2y$10$WB2SkYf7am3Lw7XN9flYzOil.UbZxINlyKgOzGXN6sNAv1H.Nahii', '2025-11-25 09:50:01'),
(2, 'Rashel', 'thapa.rrashel@gmail.com', '$2y$10$HOvtWBVCoLcE6TUhw8i99uVJisvqQp1HxOBJf8DOE3rRLFct2H33a', '2025-11-26 00:44:46'),
(3, 'Rashel', 'thapa.rrrashel@gmail.com', '$2y$10$OnuHy0n2FIY2q5N3vbmsaO0bkHsjytx8y55qE9FmXILgKzmsHUjz6', '2025-11-26 01:04:11'),
(4, 'umesh', 'umesh123@gmail.com', '$2y$10$V7y7NQtatXv0wS4hxzo90.Wxp9Ot7Eq4HgoRTolfy4peox0sbOm4G', '2025-11-26 01:11:50'),
(5, 'Rashel', 'thapa.rasheel@gmail.com', '$2y$10$EbzozUAcsr0y/3jprP8lyOCNzMGoL7GqfTN9E0I7i1At9Pr1NP.e2', '2025-11-27 07:16:25'),
(6, 'rashel', 'thapa.rasheeel@gmail.com', '$2y$10$6nyCPzGFNdiXtIPIlR8DEulR4v31piOE1LqSDhuhELQ05r.3YQ3VK', '2025-12-04 10:31:47'),
(7, 'Rashel', 'tthapa.rashel@gmail.com', '$2y$10$sC6LeeHggrMihynS0FFYC.MvLrMlZ/FJpse30xmggzCXgv3p/oloa', '2025-12-06 06:40:29'),
(8, 'Admin User', 'admin@nepaltrektrails.com', '$2y$10$vwtIgw4BdzCdAWp3qx.QS.1kzTW3bOx/S50/BdTRz/RtU5hkAhB3G', '2025-12-06 07:31:36'),
(11, 'test', 'test@yopmail.com', '$2y$10$1HyQ4juFKes5nDKeYQ7cBeQ./AAQ6F1H48R.DMWW.rZo1/b58.6i6', '2025-12-17 01:45:36'),
(12, 'Aman', 'aman@gmail.com', '$2y$10$dMiNTD8k..1XMtSD3.EYIOewXf2TckVhNawntD7ilBkTrY0RyxhEO', '2025-12-18 06:07:36'),
(14, 'ram', 'ram@gmail.com', '$2y$10$9XgOa1xJEh45Z1sQwSGRae9BINOUOWDMI9T9k96mY7tIPasw6SO5m', '2025-12-20 08:52:13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blogs`
--
ALTER TABLE `blogs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_bookings_user` (`user_id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_package_id` (`package_id`);

--
-- Indexes for table `packages`
--
ALTER TABLE `packages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blogs`
--
ALTER TABLE `blogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `packages`
--
ALTER TABLE `packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blogs`
--
ALTER TABLE `blogs`
  ADD CONSTRAINT `blogs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`package_id`) REFERENCES `packages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_bookings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
