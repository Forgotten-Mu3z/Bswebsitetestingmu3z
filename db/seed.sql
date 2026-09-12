INSERT OR IGNORE INTO categories (id, slug, name_en, name_ar, sort_order, enabled) VALUES
('cat-pc', 'pc-components', 'PC Components', 'مكونات الكمبيوتر', 1, 1),
('cat-builds', 'gaming-pcs', 'Gaming PCs', 'أجهزة كمبيوتر للألعاب', 2, 1),
('cat-gear', 'gaming-gear', 'Gaming Gear', 'معدات الألعاب', 3, 1),
('cat-monitor', 'monitors', 'Monitors', 'شاشات', 4, 1),
('cat-console', 'consoles', 'Consoles', 'أجهزة الألعاب', 5, 1),
('cat-digital', 'digital-cards', 'Digital Cards', 'بطاقات رقمية', 6, 1);

INSERT OR IGNORE INTO brands (id, slug, name, description) VALUES
('brand-blackshark', 'blackshark', 'BLACKSHARK', 'Performance gaming systems and selected hardware.');

-- Component brands used by the GCC/Oman benchmark catalog.
INSERT OR IGNORE INTO brands (id, slug, name, description) VALUES
('brand-intel', 'intel', 'Intel', 'Desktop processors and platform hardware.'),
('brand-amd', 'amd', 'AMD', 'Ryzen processors and Radeon graphics.'),
('brand-msi', 'msi', 'MSI', 'Gaming components and system hardware.'),
('brand-asus', 'asus', 'ASUS', 'PC components and gaming hardware.'),
('brand-zotac', 'zotac', 'ZOTAC', 'Gaming graphics cards.'),
('brand-asrock', 'asrock', 'ASRock', 'Motherboards and graphics cards.'),
('brand-gigabyte', 'gigabyte', 'GIGABYTE', 'Motherboards and PC hardware.'),
('brand-corsair', 'corsair', 'CORSAIR', 'Memory, power, cooling, and cases.'),
('brand-pny', 'pny', 'PNY', 'Memory and graphics hardware.'),
('brand-kingston', 'kingston', 'Kingston', 'Desktop memory and storage.'),
('brand-xpg', 'xpg', 'XPG', 'Performance memory and storage.'),
('brand-lexar', 'lexar', 'Lexar', 'Solid-state storage.'),
('brand-samsung', 'samsung', 'Samsung', 'Solid-state storage.'),
('brand-toshiba', 'toshiba', 'Toshiba', 'Desktop hard drives.'),
('brand-western-digital', 'western-digital', 'Western Digital', 'Hard drives and storage.'),
('brand-nzxt', 'nzxt', 'NZXT', 'Cases, cooling, and power supplies.'),
('brand-thermaltake', 'thermaltake', 'Thermaltake', 'Cases, cooling, power, and accessories.'),
('brand-acegeek', 'acegeek', 'Acegeek', 'PC cases and accessories.'),
('brand-lian-li', 'lian-li', 'Lian Li', 'Cases, fans, and accessories.'),
('brand-deepcool', 'deepcool', 'DeepCool', 'PC cooling hardware.'),
('brand-tp-link', 'tp-link', 'TP-Link', 'Desktop networking hardware.'),
('brand-elgato', 'elgato', 'Elgato', 'Video capture hardware.'),
('brand-noctua', 'noctua', 'Noctua', 'Cooling and thermal products.');

INSERT OR IGNORE INTO products (id, slug, sku, title_en, title_ar, short_description, category_id, brand_id, price_baisa, sale_price_baisa, stock_quantity, low_stock_threshold, status, featured, image_key, created_at, updated_at) VALUES
('prod-5080pc', 'blackshark-rtx-5080-gaming-pc', 'BS-PC-5080', 'BLACKSHARK RTX 5080 Gaming PC', 'كمبيوتر بلاك شارك RTX 5080 للألعاب', 'Flagship 4K gaming performance.', 'cat-builds', 'brand-blackshark', 1499000, 1399000, 4, 2, 'PUBLISHED', 1, '/blackshark-logo.png', unixepoch(), unixepoch()),
('prod-5070pc', 'blackshark-rtx-5070-gaming-pc', 'BS-PC-5070', 'BLACKSHARK RTX 5070 Gaming PC', 'كمبيوتر بلاك شارك RTX 5070 للألعاب', 'High-refresh QHD gaming system.', 'cat-builds', 'brand-blackshark', 999000, 949000, 7, 2, 'PUBLISHED', 1, '/blackshark-logo.png', unixepoch(), unixepoch()),
('prod-monitor', 'blackshark-240hz-gaming-monitor', 'BS-MON-240', 'BLACKSHARK 27-inch 240Hz Monitor', 'شاشة بلاك شارك 27 بوصة 240 هرتز', 'Fast IPS display for competitive play.', 'cat-monitor', 'brand-blackshark', 189000, NULL, 12, 3, 'PUBLISHED', 1, '/blackshark-logo.png', unixepoch(), unixepoch()),
('prod-headset', 'blackshark-pro-gaming-headset', 'BS-AUD-PRO', 'BLACKSHARK Pro Gaming Headset', 'سماعة بلاك شارك الاحترافية', 'Clear positional audio and all-day comfort.', 'cat-gear', 'brand-blackshark', 39000, 34000, 18, 4, 'PUBLISHED', 1, '/blackshark-logo.png', unixepoch(), unixepoch());

-- Comprehensive component launch catalog. Oman-facing GCC retail prices checked 2026-09-11.
-- Product imagery intentionally uses the store placeholder until staff uploads licensed photos.
INSERT OR IGNORE INTO products (id, slug, sku, title_en, title_ar, short_description, category_id, brand_id, price_baisa, sale_price_baisa, stock_quantity, low_stock_threshold, status, featured, image_key, created_at, updated_at) VALUES
-- Processors
('gcc-cpu-ultra7-265k', 'intel-core-ultra-7-265k-tray', 'ULTRA-7-265K-TRAY', 'Intel Core Ultra 7 265K 20-Core Processor - Tray', 'معالج إنتل كور ألترا 7 265K بعدد 20 نواة', 'Processor · 20 cores, up to 5.5GHz, LGA 1851 desktop CPU in tray packaging.', 'cat-pc', 'brand-intel', 120924, NULL, 8, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-cpu-i7-14700f', 'intel-core-i7-14700f-tray', 'I7-14700F-TRAY', 'Intel Core i7-14700F 20-Core Processor - Tray', 'معالج إنتل كور i7-14700F بعدد 20 نواة', 'Processor · 20 cores and 28 threads for high-refresh gaming and demanding productivity.', 'cat-pc', 'brand-intel', 133487, NULL, 7, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-cpu-9700x', 'amd-ryzen-7-9700x-tray', '100-000001404', 'AMD Ryzen 7 9700X 8-Core Processor - Tray', 'معالج AMD رايزن 7 9700X بعدد 8 أنوية', 'Processor · 8 cores, 16 threads, unlocked AM5 desktop CPU for gaming and creation.', 'cat-pc', 'brand-amd', 109931, NULL, 11, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-cpu-ultra5-250kf', 'intel-core-ultra-5-250kf-plus', 'BX80768250KF', 'Intel Core Ultra 5 250KF Plus 18-Core Processor', 'معالج إنتل كور ألترا 5 250KF بلس بعدد 18 نواة', 'Processor · Unlocked 18-core LGA 1851 desktop CPU for gaming builds with discrete graphics.', 'cat-pc', 'brand-intel', 94122, 90039, 9, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-cpu-i5-12400f', 'intel-core-i5-12400f', 'CM8071504650609', 'Intel Core i5-12400F 6-Core Processor', 'معالج إنتل كور i5-12400F بعدد 6 أنوية', 'Processor · 6 cores, 12 threads, up to 4.4GHz on the LGA 1700 platform.', 'cat-pc', 'brand-intel', 62713, 57059, 14, 4, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-cpu-i5-13600k', 'intel-core-i5-13600k', 'BX8071513600K', 'Intel Core i5-13600K 14-Core Processor', 'معالج إنتل كور i5-13600K بعدد 14 نواة', 'Processor · Unlocked 14-core, 20-thread LGA 1700 desktop CPU.', 'cat-pc', 'brand-intel', 153903, 112548, 10, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-cpu-7800x3d', 'amd-ryzen-7-7800x3d', '100-100000910WOF', 'AMD Ryzen 7 7800X3D 8-Core Gaming Processor', 'معالج الألعاب AMD رايزن 7 7800X3D', 'Processor · 8 cores, 16 threads, AM5, and 3D V-Cache for high-performance gaming.', 'cat-pc', 'brand-amd', 157567, 148668, 8, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-cpu-i9-14900k', 'intel-core-i9-14900k', 'BX8071514900K', 'Intel Core i9-14900K 24-Core Processor', 'معالج إنتل كور i9-14900K بعدد 24 نواة', 'Processor · Unlocked 24-core, 32-thread flagship CPU for LGA 1700 systems.', 'cat-pc', 'brand-intel', 235566, 187929, 6, 2, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
-- Graphics cards
('gcc-gpu-5060ti-msi', 'msi-rtx-5060-ti-ventus-3x-oc-8gb', '912-V812-079', 'MSI GeForce RTX 5060 Ti Ventus 3X OC 8GB', 'بطاقة MSI جيفورس RTX 5060 Ti فينتوس 8GB', 'Graphics Card · 8GB GDDR7, triple-fan cooling, factory overclock, and DLSS 4 support.', 'cat-pc', 'brand-msi', 269592, NULL, 7, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-gpu-5080-proart', 'asus-proart-rtx-5080-oc-16gb', '90YV0N30-M0NA00', 'ASUS ProArt GeForce RTX 5080 OC 16GB', 'بطاقة ASUS برو آرت جيفورس RTX 5080 سعة 16GB', 'Graphics Card · 16GB GDDR7 professional-grade RTX graphics with DLSS 4.', 'cat-pc', 'brand-asus', 942264, NULL, 4, 2, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-gpu-5070-asus', 'asus-t1-rtx-5070-oc-12gb', '90YV0M1G-M0NA00', 'ASUS T1 GeForce RTX 5070 OC 12GB', 'بطاقة ASUS T1 جيفورس RTX 5070 سعة 12GB', 'Graphics Card · 12GB GDDR7, compact cooling, factory overclock, and DLSS 4.', 'cat-pc', 'brand-asus', 460662, 400776, 6, 2, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-gpu-5060-msi', 'msi-rtx-5060-ventus-2x-oc-8gb', '912-V550-005', 'MSI GeForce RTX 5060 Ventus 2X OC 8GB', 'بطاقة MSI جيفورس RTX 5060 فينتوس 8GB', 'Graphics Card · 8GB GDDR7 dual-fan GPU for efficient 1080p and 1440p gaming.', 'cat-pc', 'brand-msi', 183218, NULL, 12, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-gpu-rx9070-asus', 'asus-prime-radeon-rx-9070-evo-oc-16gb', '90YV0MQ0-M0NA00', 'ASUS Prime Radeon RX 9070 EVO OC 16GB', 'بطاقة ASUS برايم راديون RX 9070 سعة 16GB', 'Graphics Card · 16GB GDDR6 AMD Radeon graphics for high-refresh QHD and 4K play.', 'cat-pc', 'brand-asus', 387375, NULL, 7, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-gpu-5090-msi', 'msi-rtx-5090-ventus-3x-oc-32gb', '912-V530-091', 'MSI GeForce RTX 5090 Ventus 3X OC 32GB', 'بطاقة MSI جيفورس RTX 5090 فينتوس 32GB', 'Graphics Card · Flagship 32GB GDDR7 triple-fan GPU with DLSS 4.', 'cat-pc', 'brand-msi', 2303312, NULL, 3, 2, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-gpu-5080-zotac', 'zotac-rtx-5080-solid-core-16gb', 'ZT-B50800D2-10P', 'ZOTAC Gaming GeForce RTX 5080 Solid Core 16GB', 'بطاقة زوتاك جيفورس RTX 5080 سوليد كور 16GB', 'Graphics Card · 16GB GDDR7 and robust triple-fan cooling for 4K gaming.', 'cat-pc', 'brand-zotac', 706698, 670997, 5, 2, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-gpu-rx9070xt-asrock', 'asrock-rx-9070-xt-steel-legend-16gb', 'RX9070XT-SL-16G', 'ASRock Radeon RX 9070 XT Steel Legend 16GB', 'بطاقة أسروك راديون RX 9070 XT ستيل ليجند 16GB', 'Graphics Card · 16GB Radeon GPU with Steel Legend triple-fan cooling.', 'cat-pc', 'brand-asrock', 329000, NULL, 6, 2, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
-- Motherboards
('gcc-mb-asus-b850-max', 'asus-b850-max-gaming-wifi', '90MB1PR0-M0EAY0', 'ASUS B850 Max Gaming WiFi AM5 ATX Motherboard', 'لوحة ASUS B850 Max Gaming WiFi بمقبس AM5', 'Motherboard · ATX AM5 board with DDR5, Wi-Fi, and modern expansion connectivity.', 'cat-pc', 'brand-asus', 96844, NULL, 9, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-mb-msi-b850ma', 'msi-pro-b850m-a-wifi', '911-7E66-002', 'MSI PRO B850M-A WiFi AM5 mATX Motherboard', 'لوحة MSI PRO B850M-A WiFi بمقبس AM5', 'Motherboard · Micro-ATX AM5 platform with DDR5 and integrated Wi-Fi.', 'cat-pc', 'brand-msi', 79045, NULL, 10, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-mb-msi-b850mp', 'msi-pro-b850m-p', '911-7E71-005', 'MSI PRO B850M-P AM5 mATX Motherboard', 'لوحة MSI PRO B850M-P بمقبس AM5', 'Motherboard · Compact AM5 DDR5 platform for value-focused Ryzen builds.', 'cat-pc', 'brand-msi', 63865, 56012, 12, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-mb-asus-x870e', 'asus-tuf-gaming-x870e-plus-wifi7', '90MB1M70-M0EAY0', 'ASUS TUF Gaming X870E-Plus WiFi 7 AM5 Motherboard', 'لوحة ASUS TUF Gaming X870E-Plus WiFi 7', 'Motherboard · Premium ATX AM5 board with DDR5, PCIe 5.0, and Wi-Fi 7.', 'cat-pc', 'brand-asus', 177983, 162279, 5, 2, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-mb-gigabyte-b850m', 'gigabyte-b850m-ds3h', 'B850M-DS3H', 'GIGABYTE B850M DS3H AM5 mATX Motherboard', 'لوحة جيجابايت B850M DS3H بمقبس AM5', 'Motherboard · Micro-ATX AM5 DDR5 board with PCIe 5.0 support.', 'cat-pc', 'brand-gigabyte', 63865, 59572, 8, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-mb-asus-z890', 'asus-prime-z890-p-csm', 'PRIME-Z890-P-CSM', 'ASUS Prime Z890-P-CSM LGA 1851 ATX Motherboard', 'لوحة ASUS برايم Z890-P-CSM بمقبس LGA 1851', 'Motherboard · Intel LGA 1851 ATX platform with DDR5 and business-class stability.', 'cat-pc', 'brand-asus', 99357, NULL, 7, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
-- Memory
('gcc-ram-corsair-32-6000', 'corsair-vengeance-rgb-32gb-ddr5-6000', 'CMH32GX5M2D6000Z38', 'CORSAIR Vengeance RGB 32GB DDR5-6000 Kit', 'ذاكرة CORSAIR Vengeance RGB سعة 32GB DDR5-6000', 'Memory · 32GB dual-channel DDR5-6000 RGB kit for modern AMD and Intel platforms.', 'cat-pc', 'brand-corsair', 219862, NULL, 8, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-ram-pny-16-3200', 'pny-performance-16gb-ddr4-3200', 'MD16GSD43200-TB', 'PNY Performance 16GB DDR4-3200 Desktop RAM', 'ذاكرة PNY Performance سعة 16GB DDR4-3200', 'Memory · 16GB DDR4-3200 desktop module for mainstream and upgrade builds.', 'cat-pc', 'brand-pny', 52243, NULL, 16, 4, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-ram-corsair-64-6000', 'corsair-vengeance-rgb-64gb-ddr5-6000', 'CMH64GX5M2B6000Z40', 'CORSAIR Vengeance RGB 64GB DDR5-6000 Kit', 'ذاكرة CORSAIR Vengeance RGB سعة 64GB DDR5-6000', 'Memory · 64GB dual-channel DDR5-6000 RGB kit for heavy creation and workstation use.', 'cat-pc', 'brand-corsair', 439723, NULL, 5, 2, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-ram-xpg-16-6000', 'xpg-lancer-blade-rgb-16gb-ddr5-6000-white', 'AX5U6000C3616G-DTLABRWH', 'XPG Lancer Blade RGB 16GB DDR5-6000 - White', 'ذاكرة XPG Lancer Blade RGB سعة 16GB DDR5-6000 أبيض', 'Memory · 16GB DDR5-6000 RGB module with AMD EXPO and Intel XMP support.', 'cat-pc', 'brand-xpg', 145000, 99900, 11, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
-- Storage
('gcc-ssd-lexar-nq780-1tb', 'lexar-nq780-1tb-gen4-nvme', 'NQ780-1TB', 'Lexar NQ780 1TB PCIe 4.0 NVMe SSD', 'قرص Lexar NQ780 NVMe سعة 1TB', 'Storage · 1TB PCIe 4.0 M.2 NVMe solid-state drive for fast game and app loading.', 'cat-pc', 'brand-lexar', 65958, NULL, 15, 4, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-ssd-msi-m560-1tb', 'msi-spatium-m560-1tb-pcie5-nvme', 'S78-440L0F0-P83', 'MSI Spatium M560 1TB PCIe 5.0 NVMe SSD', 'قرص MSI Spatium M560 NVMe سعة 1TB', 'Storage · 1TB PCIe 5.0 M.2 NVMe drive rated for up to 10,200MB/s reads.', 'cat-pc', 'brand-msi', 115061, NULL, 9, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-ssd-samsung-990pro-2tb', 'samsung-990-pro-2tb-nvme', 'MZ-V9P2T0BW', 'Samsung 990 PRO 2TB PCIe 4.0 NVMe SSD', 'قرص سامسونج 990 PRO NVMe سعة 2TB', 'Storage · High-performance 2TB PCIe 4.0 M.2 NVMe solid-state drive.', 'cat-pc', 'brand-samsung', 162174, NULL, 7, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-hdd-toshiba-p300-4tb', 'toshiba-p300-4tb-desktop-hdd', 'DT02ABA400', 'Toshiba P300 4TB 3.5-inch Desktop Hard Drive', 'قرص توشيبا P300 مكتبي سعة 4TB', 'Storage · 4TB 5400RPM SATA hard drive with 128MB cache for bulk desktop storage.', 'cat-pc', 'brand-toshiba', 78522, NULL, 10, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-hdd-wd-red-8tb', 'western-digital-red-plus-8tb-nas-hdd', 'WD80EFZX', 'Western Digital Red Plus 8TB NAS Hard Drive', 'قرص ويسترن ديجيتال Red Plus NAS سعة 8TB', 'Storage · 8TB 5400RPM SATA NAS hard drive designed for reliable multi-drive storage.', 'cat-pc', 'brand-western-digital', 183218, NULL, 6, 2, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
-- Power supplies
('gcc-psu-corsair-rm750e', 'corsair-rm750e-750w-atx', 'CP-9020295-UK', 'CORSAIR RM750e 750W Fully Modular Power Supply', 'مزود طاقة CORSAIR RM750e بقدرة 750W', 'Power Supply · Fully modular, low-noise 750W ATX unit for modern gaming systems.', 'cat-pc', 'brand-corsair', 50778, NULL, 12, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-psu-nzxt-c750', 'nzxt-c750-gold-core-atx31', 'PA-7G3BB-UK', 'NZXT C750 Gold Core 750W ATX 3.1 Power Supply', 'مزود طاقة NZXT C750 Gold بقدرة 750W', 'Power Supply · Fully modular 750W, 80 Plus Gold, ATX 3.1 unit for current GPUs.', 'cat-pc', 'brand-nzxt', 43868, NULL, 10, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-psu-tt-gf3-850', 'thermaltake-toughpower-gf3-850w', 'PS-TPD-0850FNFAGX-4', 'Thermaltake Toughpower GF3 850W Gold Power Supply', 'مزود طاقة ثيرمالتيك Toughpower GF3 بقدرة 850W', 'Power Supply · Fully modular 850W Gold ATX 3.0 unit with PCIe 5.0 support.', 'cat-pc', 'brand-thermaltake', 80616, 65958, 8, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-psu-corsair-rm1000e', 'corsair-rm1000e-1000w-gold', 'CP-9020250-NA', 'CORSAIR RM1000e 1000W Gold Power Supply', 'مزود طاقة CORSAIR RM1000e بقدرة 1000W', 'Power Supply · Fully modular 1000W Gold ATX unit for high-end graphics builds.', 'cat-pc', 'brand-corsair', 83652, 76952, 6, 2, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
-- Cases
('gcc-case-acegeek-clearion', 'acegeek-clearion-atx-case-black', 'AG-CLEARION-BK', 'Acegeek Clearion Tempered Glass ATX Case - Black', 'صندوق Acegeek Clearion ATX بزجاج مقوى أسود', 'PC Case · ATX gaming chassis with tempered-glass panels and showcase layout.', 'cat-pc', 'brand-acegeek', 38214, NULL, 10, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-case-corsair-4000d', 'corsair-frame-4000d-rs-white', 'CC-9011313-WW', 'CORSAIR Frame 4000D RS Mid-Tower Case - White', 'صندوق CORSAIR Frame 4000D RS أبيض', 'PC Case · Modular mid-tower chassis with airflow-focused design and clean cable routing.', 'cat-pc', 'brand-corsair', 46066, NULL, 8, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-case-lianli-o11visionm', 'lian-li-o11-vision-m-digital-black', 'G99.O11VMDX.00', 'Lian Li O11 Vision-M Digital Dual-Chamber Case - Black', 'صندوق Lian Li O11 Vision-M Digital أسود', 'PC Case · Dual-chamber showcase chassis with glass panels and integrated digital display.', 'cat-pc', 'brand-lian-li', 60200, NULL, 6, 2, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
-- Cooling and fans
('gcc-cool-deepcool-le240', 'deepcool-le240-v2-argb-black', 'R-LE240-BKAMMC-G-2', 'DeepCool LE240 V2 240mm ARGB Liquid Cooler - Black', 'مبرد سائل DeepCool LE240 V2 بحجم 240mm أسود', 'CPU Cooler · 240mm all-in-one liquid cooler with dual ARGB fans.', 'cat-pc', 'brand-deepcool', 31304, 27744, 12, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-cool-asus-lc360', 'asus-prime-lc-360-argb-lcd-black', '90RC00Z1-B0EAY0', 'ASUS Prime LC 360mm ARGB LCD Liquid Cooler', 'مبرد سائل ASUS Prime LC 360mm بشاشة LCD', 'CPU Cooler · 360mm AIO with three ARGB fans, copper plate, and 2.3-inch LCD.', 'cat-pc', 'brand-asus', 68052, 65958, 7, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-fan-corsair-rs140', 'corsair-rs140-argb-dual-pack-white', 'CO-9050187-WW', 'CORSAIR RS140 ARGB 140mm PWM Fan 2-Pack - White', 'مراوح CORSAIR RS140 ARGB 140mm عبوتان أبيض', 'Case Fan · Two 140mm PWM fans with addressable RGB lighting.', 'cat-pc', 'brand-corsair', 16751, NULL, 18, 4, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-fan-lianli-slinf', 'lian-li-uni-sl-infinity-120mm-triple-white', 'G9F.12RSLIN1F3W.00', 'Lian Li UNI SL-Infinity 120mm Reverse ARGB Fan 3-Pack', 'مراوح Lian Li UNI SL-Infinity 120mm ثلاثية', 'Case Fan · Three reverse-blade 120mm ARGB fans for showcase cooling layouts.', 'cat-pc', 'brand-lian-li', 39261, NULL, 10, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
-- Expansion and maintenance
('gcc-net-tplink-t9e', 'tp-link-archer-t9e-ac1900-pcie-wifi', 'ARCHER-T9E', 'TP-Link Archer T9E AC1900 PCIe Wi-Fi Adapter', 'بطاقة واي فاي TP-Link Archer T9E AC1900', 'Network Card · Dual-band AC1900 PCI Express Wi-Fi adapter for desktop PCs.', 'cat-pc', 'brand-tp-link', 23085, NULL, 14, 4, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-capture-elgato-video', 'elgato-video-capture-usb', '1VC104001001', 'Elgato Video Capture USB Adapter', 'جهاز التقاط فيديو Elgato عبر USB', 'Capture Card · USB H.264 capture adapter for transferring analog video to a PC.', 'cat-pc', 'brand-elgato', 49731, NULL, 8, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-thermal-noctua-nth2', 'noctua-nt-h2-thermal-paste-3-5g', 'NT-H2-3.5G', 'Noctua NT-H2 3.5g Thermal Paste', 'معجون حراري Noctua NT-H2 سعة 3.5g', 'Thermal Compound · Premium non-conductive paste supplied with three cleaning wipes.', 'cat-pc', 'brand-noctua', 7852, NULL, 20, 5, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch()),
('gcc-riser-tt-pcie4', 'thermaltake-pcie4-riser-cable-130mm', 'AC-071-CO1OTN-C1', 'Thermaltake PCIe 4.0 Dual 90° 130mm Riser Cable', 'كابل تمديد ثيرمالتيك PCIe 4.0 بطول 130mm', 'Riser Cable · Shielded PCIe 4.0 x16 extension with dual 90-degree connectors.', 'cat-pc', 'brand-thermaltake', 21986, NULL, 11, 3, 'PUBLISHED', 0, '/blackshark-logo.png', unixepoch(), unixepoch());

INSERT OR IGNORE INTO announcements (id, text_en, text_ar, link, enabled) VALUES ('announcement-launch', 'Free delivery in Oman on orders over OMR 50', 'توصيل مجاني داخل عُمان للطلبات فوق 50 ريال', '#featured', 1);

INSERT OR IGNORE INTO roles (id, name, is_system) VALUES
('role-owner', 'OWNER', 1), ('role-admin', 'ADMIN', 1), ('role-product', 'PRODUCT_MANAGER', 1), ('role-order', 'ORDER_MANAGER', 1), ('role-content', 'CONTENT_MANAGER', 1), ('role-support', 'SUPPORT_STAFF', 1), ('role-customer', 'CUSTOMER', 1);

INSERT OR IGNORE INTO permissions (id, key, description) VALUES
('perm-products-view', 'products.view', 'View product administration'), ('perm-products-create', 'products.create', 'Create products'), ('perm-products-edit', 'products.edit', 'Edit products'), ('perm-products-delete', 'products.delete', 'Delete products'), ('perm-products-publish', 'products.publish', 'Publish products'), ('perm-inventory-edit', 'inventory.edit', 'Change inventory'), ('perm-orders-view', 'orders.view', 'View orders'), ('perm-orders-edit', 'orders.edit', 'Update orders'), ('perm-orders-refund', 'orders.refund', 'Issue refunds'), ('perm-staff-change-role', 'staff.change_role', 'Change staff roles'), ('perm-settings-edit', 'settings.edit', 'Edit store settings'), ('perm-payments-configure', 'payments.configure', 'Configure payment providers');

-- Product administration is available to owners, admins, and product managers.
-- User-to-role assignments remain an explicit operator action; no account is created here.
INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p
WHERE r.name IN ('OWNER', 'ADMIN', 'PRODUCT_MANAGER')
AND p.key IN ('products.view', 'products.create', 'products.edit', 'products.delete', 'products.publish', 'inventory.edit');
