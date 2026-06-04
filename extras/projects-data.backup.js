// Project data loaded as a global variable for file:// protocol compatibility
const PROJECTS_DATA = {
  "featuredProject": {
    "id": "weight-checker",
    "title": "Digital Weight Scale & Weight Checker App",
    "company": "DhakaThai AlcoMaxx PLC",
    "tech": "C#.NET, Serial Port Integration, ERP Automation",
    "description": "Designed and developed a custom desktop application to integrate physical weight meters/scales with LightHouse ERP at the Packing Section.",
    "images": [
      "assets/images/dtl-weight-apps/weight_checker_v4.png",
      "assets/images/dtl-weight-apps/weight_checker_v4.4.png",
      "assets/images/dtl-weight-apps/weight_scale.png"
    ],
    "details": [
      "Integrated physical weight meters with LightHouse ERP via Serial Port communication",
      "Automated bundle packing workflow, reducing packing time by 60%",
      "Scaled daily label output from 2,500 to 8,000+ labels",
      "Delivered robust solution improving operational efficiency and minimizing manual errors"
    ]
  },
  "projectCategories": [
    {
      "name": "Software Development",
      "key": "software",
      "icon": "laptop_mac",
      "items": [
        {
          "id": "weight-checker",
          "title": "Aluminum Bundle Weight Checker V3/V4",
          "tech": "C#.NET, Serial Port, ERP Automation",
          "description": "Desktop application for automated bundle weight checking with serial port scale integration and ERP label printing."
        },
        {
          "id": "weight-scale",
          "title": "YAOHUA Digital Weight Scale Integration",
          "tech": "RS232, Serial Port, Hardware Integration",
          "description": "Industrial hardware-software bridge connecting YAOHUA XK3190-D# weight indicators to LightHouse ERP."
        },
        {
          "id": "tuition-management",
          "title": "Tuition Management System",
          "tech": "C# & SQL Server Local DB",
          "description": "Students information, fee management, batch management desktop application."
        },
        {
          "id": "tic-warehouse",
          "title": "TIC Warehouse App",
          "tech": "PHP & MySQL",
          "description": "Basic Warehouse Inventory management software."
        },
        {
          "id": "auto-bell",
          "title": "Auto Bell 2.0",
          "tech": "VB.net & MS-AccessDB",
          "description": "Automated bell system with Text-to-Speech for schools."
        },
        {
          "id": "easy-c-ide",
          "title": "Easy C IDE",
          "tech": "VB.net & Compiler",
          "description": "Lightweight C IDE with auto-save feature."
        },
        {
          "id": "resq-remote",
          "title": "Res-Q & Remote Control",
          "tech": "C/C++, Arduino & C#",
          "description": "Robotic car firmware and control desktop app. Champion at BPI College Projects Fair 2017."
        },
        {
          "id": "tasbih",
          "title": "Tasbih — Digital Prayer Counter",
          "tech": "MIT App Inventor",
          "description": "Android app for digital tasbih (prayer bead) counting with multiple counter profiles and history tracking."
        },
        {
          "id": "zenbreaths",
          "title": "ZenBreaths — Guided Breathing App",
          "tech": "HTML, Tailwind CSS, Vue 3, Nuxt, Capacitor",
          "description": "Meditation and guided breathing exercise app with customizable session durations and visual cues."
        }
      ]
    },
    {
      "name": "Web & E-Commerce",
      "key": "web",
      "icon": "language",
      "items": [
        {
          "id": "faith-it",
          "title": "Faith IT — Agency Portfolio",
          "description": "Agency Portfolio website for Faith Media Ltd.",
          "url": "https://faithmedia.com"
        },
        {
          "id": "gontobbo-express",
          "title": "Gontobbo Express",
          "description": "Logistics platform implementation.",
          "url": ""
        },
        {
          "id": "chembynavid",
          "title": "ChemByNavid",
          "description": "Payment, LMS, Content Update integration.",
          "url": ""
        },
        {
          "id": "rapid-supplies",
          "title": "Rapid Supplies Inc.",
          "description": "Tech e-commerce for TIC Accessories.",
          "url": ""
        },
        {
          "id": "tic-website",
          "title": "TIC Accessories — Main Company Website",
          "description": "Full WordPress company website with product catalog, service pages, and contact system for TIC Accessories Inc.",
          "url": ""
        },
        {
          "id": "different-cafe",
          "title": "DifferentCafeBD",
          "description": "Cafe brand website with menu, online ordering & local SEO.",
          "url": "https://differentcafebd.com"
        },
        {
          "id": "realcafe-bd",
          "title": "RealCafeBd",
          "description": "Cafe brand website with menu, online ordering & local SEO.",
          "url": "https://realcafebd.com"
        },
        {
          "id": "cosmicshopbd",
          "title": "CosmicShopBd",
          "description": "Retail/wholesale online store with Android app.",
          "url": ""
        },
        {
          "id": "hakimadapp-website",
          "title": "Hakimadapp.github.io — Religious Website",
          "description": "Faith-based religious website hosted on GitHub Pages.",
          "url": "https://hakimadapp.github.io"
        }
      ]
    },
    {
      "name": "IT Support & Maintenance",
      "key": "it",
      "icon": "build",
      "items": [
        {
          "id": "dhakathai-it",
          "title": "DhakaThai Alcomaxx PLC",
          "description": "IT Support, OS, Barcode ERP, Maintenance, Tools Development — full IT operations for aluminum manufacturing plant.",
          "url": ""
        },
        {
          "id": "keya-group-it",
          "title": "Keya Group [IT-GPRO]",
          "description": "GPRO ERP administration across all modules (cutting, store, production, payroll, billing, inventory), IT support for 30+ production floor workstations, RFID terminal management across 30+ production lines with NXP MCU devices over RS-485, IP camera installation, and user training for 30+ staff.",
          "url": ""
        },
        {
          "id": "tic-accessories",
          "title": "TIC Accessories Inc. — Full-Spectrum Support",
          "description": "Remote IT support, WordPress website, WooCommerce e-commerce, Amazon/eBay listings, product photography, infographics, and digital operations for New-York based tech accessories company.",
          "url": ""
        },
        {
          "id": "bpi-lab",
          "title": "B. P. I. Innovation Lab",
          "description": "Software, hardware, and network setup for college innovation lab.",
          "url": ""
        },
        {
          "id": "naogaon-lab",
          "title": "Naogaon Tech. School Lab",
          "description": "PC software/hardware setup and ICT lab installation for technical school.",
          "url": ""
        }
      ]
    },
    {
      "name": "Graphics & Design",
      "key": "design",
      "icon": "palette",
      "items": [
        {
          "id": "amazon-ebay-listings",
          "title": "Amazon/eBay Product Listings (200+ Listings)",
          "tech": "Photoshop, Illustrator, SEO, Amazon Seller Central",
          "description": "Designed and optimized 200+ SEO-friendly product listings for Amazon and eBay marketplaces."
        },
        {
          "id": "infographic-banner",
          "title": "Infographic & Banner Design",
          "tech": "Photoshop, Illustrator, Canva, Filmora",
          "description": "Created sales banners, promotional infographics, and social media visuals for e-commerce brands."
        },
        {
          "id": "label-packaging",
          "title": "Product Label & Packaging Design",
          "tech": "Photoshop, Illustrator, Barcode Systems",
          "description": "Designed product labels, barcode labels, and packaging materials for industrial and retail products."
        },
        {
          "id": "barcode-label-system",
          "title": "Barcode & QR Label Systems",
          "tech": "Label Design, ERP Integration, Barcode Printers",
          "description": "Designed and implemented barcode and QR label systems for ERP-integrated production and warehouse workflows."
        }
      ]
    }
  ],
  "projectDetails": {
    "weight-checker": {
      "title": "Aluminum Bundle Weight Checker V3.0",
      "subtitle": "Industrial Integration Suite & ERP Sync Solution",
      "company": "DhakaThai AlcoMaxx PLC",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["C#.NET", "Serial Port Integration", "ERP Automation", "RS232 Protocol", "CSV Data Engine"],
      "images": [
        "assets/images/dtl-weight-apps/weight_checker_v4.png",
        "assets/images/dtl-weight-apps/weight_checker_v4.4.png",
        "assets/images/dtl-weight-apps/weight_scale.png"
      ],
      "metrics": [
        { "value": "70%", "label": "Reduced Time Bottlenecks" },
        { "value": "8,000+", "label": "Daily Bundle Labels" },
        { "value": "Real-time", "label": "RS232 ⨠ ERP" },
        { "value": "100%", "label": "Correct Weight in ERP" }
      ],
      "abstract": "Designed and developed a console-based high-precision automation suite for industrial aluminum production. This system acts as a real-time data bridge between physical Yaohua XK3190-D# Indicators and LightHouse ERP. The solution replaces manual weight entry with a sub-second automated polling mechanism that identifies stable weights and validates them against a database of 1,500+ master die charts, triggering label printing in milliseconds.",
      "flow": [
        {
          "icon": "storage",
          "title": "System Initialization",
          "text": "The engine dynamically parses WEIGHT_CHART_MASTER.csv into a high-speed memory dictionary for O(1) instant lookup of 1,500+ Die profiles including Thickness, TargetAvg, and weight ranges."
        },
        {
          "icon": "memory",
          "title": "Industrial Scale Bridge",
          "text": "Implements a 200ms polling cycle on Scale I/O file X:\\wbdata1.wbg. Filters raw RS232 noise ensuring only stable weight signals are captured."
        },
        {
          "icon": "calculate",
          "title": "Algorithm & Adjustment",
          "text": "Automatically calculates per-piece net weight. Applies dynamic ±ADJ (Tolerance Adjustment) logic allowing supervisors to override minor environmental variances like coating thickness."
        },
        {
          "icon": "lan",
          "title": "ERP Bridge Automation",
          "text": "Weight Scale automation app pushes 100% correct bundle weight directly into LightHouse ERP weight files, reducing nearly 500-700 minutes of daily manual data entry bottlenecks."
        }
      ],
      "details": [
        "Integrated physical weight meters with LightHouse ERP via Serial Port communication",
        "Automated bundle packing workflow, reducing packing time by 60%",
        "Scaled daily label output from 2,500 to 8,000+ labels",
        "Delivered robust solution improving operational efficiency and minimizing manual errors"
      ]
    },
    "weight-scale": {
      "title": "YAOHUA Digital Weight Scale Integration",
      "subtitle": "RS232 Hardware-to-ERP Bridge",
      "company": "DhakaThai AlcoMaxx PLC",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["RS232 Protocol", "Serial Port Communication", "Hardware Integration", "ERP Bridge", "Signal Processing"],
      "images": [
        "assets/images/dtl-weight-apps/scale-hardware.jpg",
        "assets/images/dtl-weight-apps/weight-scale-0.png",
        "assets/images/dtl-weight-apps/weight-scale-ui-2.png",
        "assets/images/dtl-weight-apps/weight-scale-api-1.png",
        "assets/images/dtl-weight-apps/weight-scale-api-2.png",
        "assets/images/dtl-weight-apps/weight-scale-api-3.png"
      ],
      "metrics": [
        { "value": "RS232", "label": "Real-time Data Bridge" },
        { "value": "200ms", "label": "Polling Cycle" },
        { "value": "1,500+", "label": "Die Profiles" },
        { "value": "100%", "label": "Accurate ERP Push" }
      ],
      "abstract": "Industrial hardware integration project connecting YAOHUA XK3190-D# digital weight indicators to LightHouse ERP via RS232 serial communication. The system polls physical weight meters at 200ms intervals, filters signal noise, validates stable weights against 1,500+ die profiles, and pushes accurate weight data directly into ERP — eliminating manual data entry and reducing bottlenecks.",
      "flow": [
        {
          "icon": "hardware",
          "title": "Hardware Setup",
          "text": "Configured YAOHUA XK3190-D# weight indicators with RS232 serial communication to production workstations."
        },
        {
          "icon": "graphic_eq",
          "title": "Signal Processing",
          "text": "Implemented 200ms polling cycle on scale I/O, filtering raw RS232 noise to capture only stable weight signals."
        },
        {
          "icon": "memory",
          "title": "Data Validation",
          "text": "Validated captured weights against 1,500+ master die profiles including thickness, target average, and weight ranges."
        },
        {
          "icon": "lan",
          "title": "ERP Push",
          "text": "Pushed 100% accurate bundle weights directly into LightHouse ERP, eliminating 500-700 minutes of daily manual data entry."
        }
      ],
      "details": [
        "RS232 serial communication with YAOHUA XK3190-D# digital weight indicators",
        "200ms polling cycle with noise filtering for stable weight capture",
        "Validation against 1,500+ master die profiles",
        "Automatic ERP data push eliminating manual entry",
        "Reduced daily data entry bottlenecks by 500-700 minutes"
      ]
    },
    "tuition-management": {
      "title": "Tuition Management System",
      "subtitle": "Student & Fee Management Desktop App",
      "company": "Personal Project",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["C#", "SQL Server Local DB", "Windows Forms"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "3+", "label": "Modules" },
        { "value": "Easy", "label": "Batch Management" }
      ],
      "abstract": "A desktop application for managing tuition center operations including student information, fee collection, and batch management. Built with C# Windows Forms and SQL Server Local DB for offline data storage.",
      "flow": [
        {
          "icon": "person",
          "title": "Student Management",
          "text": "Add, edit, and manage student profiles with contact information, batch assignment, and fee status tracking."
        },
        {
          "icon": "payments",
          "title": "Fee Management",
          "text": "Track monthly fee collections, generate receipts, and view payment history per student."
        },
        {
          "icon": "groups",
          "title": "Batch Management",
          "text": "Organize students into batches by subject, schedule, and instructor. View batch-wise reports."
        }
      ],
      "details": [
        "Complete CRUD operations for student records",
        "Automated fee tracking with due date alerts",
        "Search and filter by name, batch, or fee status",
        "Export reports to Excel"
      ]
    },
    "auto-bell": {
      "title": "Auto Bell 2.0",
      "subtitle": "Automated School Bell System with TTS",
      "company": "Personal Project",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["VB.net", "MS Access DB", "Text-to-Speech"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "Auto", "label": "Schedule-based" },
        { "value": "TTS", "label": "Voice Announcements" }
      ],
      "abstract": "An automated bell system for schools that rings bells and makes voice announcements based on predefined schedules. Uses VB.net with Text-to-Speech engine for voice capabilities.",
      "flow": [
        {
          "icon": "schedule",
          "title": "Schedule Management",
          "text": "Configure bell schedules for different days, periods, and special events with an easy-to-use interface."
        },
        {
          "icon": "record_voice_over",
          "title": "Text-to-Speech",
          "text": "Announce class changes, break times, and important notices using Windows TTS engine."
        }
      ],
      "details": [
        "Customizable bell schedules for weekdays and holidays",
        "Voice announcements for class periods",
        "Manual override for special events",
        "System tray background operation"
      ]
    },
    "tic-warehouse": {
      "title": "TIC Warehouse App",
      "subtitle": "Inventory Management System",
      "company": "TIC Accessories Inc.",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["PHP", "MySQL", "Bootstrap", "jQuery"],
      "images": ["assets/images/screenshot-dashboard.png", "assets/images/screenshot-label.png"],
      "metrics": [
        { "value": "Inventory", "label": "Real-time Tracking" },
        { "value": "Web-based", "label": "Cloud Access" }
      ],
      "abstract": "A web-based warehouse inventory management system built for TIC Accessories Inc. to track stock levels, manage purchase orders, and generate inventory reports. Built with PHP and MySQL with a Bootstrap frontend for responsive access from any device.",
      "flow": [
        {
          "icon": "inventory_2",
          "title": "Stock Management",
          "text": "Add, edit, and track inventory items with categories, quantities, and reorder levels."
        },
        {
          "icon": "receipt_long",
          "title": "Purchase Orders",
          "text": "Generate and manage purchase orders, track deliveries, and update stock levels automatically."
        },
        {
          "icon": "assessment",
          "title": "Reports",
          "text": "View inventory reports, stock movement history, and low-stock alerts."
        }
      ],
      "details": [
        "Complete CRUD for inventory items",
        "Real-time stock tracking with low-stock alerts",
        "Purchase order generation and tracking",
        "Responsive web interface for mobile access"
      ]
    },
    "easy-c-ide": {
      "title": "Easy C IDE",
      "subtitle": "Lightweight C Compiler IDE with Auto-Save",
      "company": "Personal Project",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["VB.net", "C Compiler Integration", "Windows Forms"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "Lightweight", "label": "< 5 MB" },
        { "value": "Auto-save", "label": "Built-in" }
      ],
      "abstract": "A lightweight C programming IDE built with VB.net that integrates a C compiler for compiling and running C code directly from the editor. Features include syntax highlighting, auto-save, and a simple interface designed for beginner programmers.",
      "flow": [
        {
          "icon": "edit_note",
          "title": "Code Editor",
          "text": "Write and edit C code with a clean, distraction-free editor interface."
        },
        {
          "icon": "terminal",
          "title": "Compiler Integration",
          "text": "Compile and run C programs directly within the IDE with one-click execution."
        },
        {
          "icon": "save",
          "title": "Auto-Save",
          "text": "Automatically saves work periodically to prevent data loss."
        }
      ],
      "details": [
        "Integrated C compiler for compile-and-run workflow",
        "Auto-save feature to prevent data loss",
        "Lightweight design (under 5 MB)",
        "Beginner-friendly user interface"
      ]
    },
    "resq-remote": {
      "title": "Res-Q & Remote Control",
      "subtitle": "Robotic Car with Desktop Control Application",
      "company": "BPI College Projects Fair 2017 — Champion",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["C/C++", "Arduino", "C#", "Serial Communication", "Firmware Development"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "Champion", "label": "BPI Projects Fair 2017" },
        { "value": "Dual", "label": "Firmware + Desktop App" }
      ],
      "abstract": "An award-winning robotic car project that won Champion at BPI College Projects Fair 2017. The system consists of Arduino-based firmware for motor control and sensor integration, paired with a C# desktop application for remote control and monitoring via serial communication.",
      "flow": [
        {
          "icon": "memory",
          "title": "Arduino Firmware",
          "text": "C/C++ firmware on Arduino microcontroller handles motor control, sensor reading, and serial command parsing."
        },
        {
          "icon": "desktop_windows",
          "title": "Desktop Controller",
          "text": "C# Windows Forms application sends commands and receives telemetry data via serial port."
        },
        {
          "icon": "bluetooth",
          "title": "Communication",
          "text": "Wireless serial communication between the desktop app and the robotic car."
        }
      ],
      "details": [
        "Arduino-based robotic car with motor control and sensors",
        "C# desktop application for remote control and monitoring",
        "Wireless serial communication between car and computer",
        "Champion award at BPI College Projects Fair 2017"
      ]
    },
    "faith-it": {
      "title": "Faith IT — Agency Portfolio",
      "subtitle": "Corporate Agency Website",
      "company": "Faith Media Ltd.",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["WordPress", "Elementor", "WooCommerce", "SEO"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "Live", "label": "faithmedia.com" },
        { "value": "Agency", "label": "Portfolio Site" }
      ],
      "abstract": "A professional agency portfolio website built for Faith Media Ltd. using WordPress with Elementor page builder. The site showcases the agency's services, portfolio, and client testimonials with a modern, responsive design and SEO-optimized content.",
      "flow": [
        {
          "icon": "web",
          "title": "Portfolio Showcase",
          "text": "Visually rich portfolio section displaying past projects and client work."
        },
        {
          "icon": "search",
          "title": "SEO Optimization",
          "text": "On-page SEO, meta tags, and schema markup for better search engine visibility."
        },
        {
          "icon": "devices",
          "title": "Responsive Design",
          "text": "Fully responsive layout optimized for desktop, tablet, and mobile devices."
        }
      ],
      "details": [
        "WordPress + Elementor responsive design",
        "Portfolio showcase with project filtering",
        "SEO-optimized content and meta tags",
        "Contact form with email integration"
      ]
    },
    "gontobbo-express": {
      "title": "Gontobbo Express",
      "subtitle": "Logistics Platform Implementation",
      "company": "Freelance Project",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["WordPress", "WooCommerce", "Custom Plugins", "Logistics API"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "Logistics", "label": "Delivery Platform" },
        { "value": "Integrated", "label": "Payment + Tracking" }
      ],
      "abstract": "Implementation of a logistics platform for managing deliveries, tracking shipments, and handling customer orders. Built on WordPress with custom WooCommerce integration for seamless order-to-delivery workflow.",
      "flow": [
        {
          "icon": "local_shipping",
          "title": "Delivery Management",
          "text": "End-to-end delivery management from order placement to final delivery confirmation."
        },
        {
          "icon": "track_changes",
          "title": "Shipment Tracking",
          "text": "Real-time shipment tracking with status updates for customers and admins."
        },
        {
          "icon": "payments",
          "title": "Payment Integration",
          "text": "Integrated payment gateway for cashless transactions."
        }
      ],
      "details": [
        "WooCommerce-based logistics order management",
        "Real-time shipment tracking",
        "Payment gateway integration",
        "Admin dashboard for order management"
      ]
    },
    "chembynavid": {
      "title": "ChemByNavid",
      "subtitle": "E-Commerce & LMS Integration",
      "company": "Freelance Project",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["WordPress", "WooCommerce", "LMS Plugin", "Content Management"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "E-Commerce", "label": "Online Store" },
        { "value": "LMS", "label": "Course Platform" }
      ],
      "abstract": "A combined e-commerce and learning management system (LMS) website. The platform handles product sales through WooCommerce while also delivering educational content through integrated LMS features, with payment processing and content update workflows.",
      "flow": [
        {
          "icon": "shopping_cart",
          "title": "E-Commerce",
          "text": "Product catalog, cart, checkout, and order management with WooCommerce."
        },
        {
          "icon": "school",
          "title": "LMS Integration",
          "text": "Course creation, student enrollment, and progress tracking through LMS plugins."
        },
        {
          "icon": "sync",
          "title": "Content Updates",
          "text": "Regular content updates and synchronization between product and course data."
        }
      ],
      "details": [
        "WooCommerce e-commerce setup",
        "LMS integration for online courses",
        "Payment gateway for both products and courses",
        "Content update and maintenance"
      ]
    },
    "rapid-supplies": {
      "title": "Rapid Supplies Inc.",
      "subtitle": "Tech E-Commerce Store",
      "company": "TIC Accessories Inc.",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["WordPress", "WooCommerce", "Product Management", "SEO"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "B2B", "label": "Wholesale Platform" },
        { "value": "Tech", "label": "Accessories Store" }
      ],
      "abstract": "A B2B/B2C e-commerce platform for TIC Accessories Inc. to sell tech accessories and computer components online. Built with WordPress and WooCommerce, featuring product catalogs, bulk ordering, and inventory management.",
      "flow": [
        {
          "icon": "category",
          "title": "Product Catalog",
          "text": "Organized product listings with categories, filters, and detailed specifications."
        },
        {
          "icon": "inventory",
          "title": "Inventory Sync",
          "text": "Real-time inventory tracking synced with physical stock."
        },
        {
          "icon": "local_shipping",
          "title": "Order Fulfillment",
          "text": "Automated order processing and shipping management."
        }
      ],
      "details": [
        "WooCommerce-based tech accessories store",
        "B2B bulk ordering support",
        "Real-time inventory management",
        "SEO-optimized product listings"
      ]
    },
    "different-cafe": {
      "title": "DifferentCafeBD",
      "subtitle": "Cafe Brand Website",
      "company": "Freelance Project",
      "developer": "Md. Asaduzzaman (Aminur)",
      "url": "https://differentcafebd.com",
      "tech": ["WordPress", "Elementor", "Branding", "Local Business SEO"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "Cafe", "label": "Brand Website" },
        { "value": "Local SEO", "label": "Google Maps Ready" }
      ],
      "abstract": "A cafe brand website built for DifferentCafeBD. Features menu displays, location information, online ordering capabilities, and local SEO optimization for Google Maps and local search visibility.",
      "flow": [
        {
          "icon": "restaurant_menu",
          "title": "Menu Display",
          "text": "Digital menu with categories, prices, and descriptions for food and beverages."
        },
        {
          "icon": "location_on",
          "title": "Location & Hours",
          "text": "Store locations, operating hours, and embedded Google Maps integration."
        },
        {
          "icon": "shopping_bag",
          "title": "Online Ordering",
          "text": "Integrated online ordering system for pickup and delivery."
        }
      ],
      "details": [
        "Elementor-based responsive design",
        "Digital menu with online ordering",
        "Local SEO optimized for Google Maps",
        "Contact and location information with maps"
      ]
    },
    "realcafe-bd": {
      "title": "RealCafeBd",
      "subtitle": "Cafe Brand Website",
      "company": "Freelance Project",
      "developer": "Md. Asaduzzaman (Aminur)",
      "url": "https://realcafebd.com",
      "tech": ["WordPress", "Elementor", "Branding", "Local Business SEO"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "Cafe", "label": "Brand Website" },
        { "value": "Local SEO", "label": "Google Maps Ready" }
      ],
      "abstract": "A cafe brand website built for RealCafeBd. Features menu displays, location information, online ordering capabilities, and local SEO optimization for Google Maps and local search visibility.",
      "flow": [
        {
          "icon": "restaurant_menu",
          "title": "Menu Display",
          "text": "Digital menu with categories, prices, and descriptions for food and beverages."
        },
        {
          "icon": "location_on",
          "title": "Location & Hours",
          "text": "Store locations, operating hours, and embedded Google Maps integration."
        },
        {
          "icon": "shopping_bag",
          "title": "Online Ordering",
          "text": "Integrated online ordering system for pickup and delivery."
        }
      ],
      "details": [
        "Elementor-based responsive design",
        "Digital menu with online ordering",
        "Local SEO optimized for Google Maps",
        "Contact and location information with maps"
      ]
    },
    "cosmicshopbd": {
      "title": "CosmicShopBd",
      "subtitle": "Website + Android E-Commerce App",
      "company": "Freelance Project",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["WordPress", "WooCommerce", "Android", "Java", "REST API", "Multi-price", "Inventory"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "Website", "label": "WooCommerce Store" },
        { "value": "Android", "label": "Native Shopping App" }
      ],
      "abstract": "A full-stack e-commerce solution for CosmicShopBD combining a WordPress/WooCommerce website with a native Android shopping app. The website supports dual-mode retail/wholesale operations with multi-tier pricing, while the Android app connects to the WooCommerce backend via REST API for mobile product browsing, cart management, and order placement.",
      "flow": [
        {
          "icon": "store",
          "title": "Website — Retail Storefront",
          "text": "Standard retail shopping experience with product browsing, single-item purchase, and WooCommerce checkout."
        },
        {
          "icon": "warehouse",
          "title": "Website — Wholesale Portal",
          "text": "Bulk ordering interface with tiered pricing based on customer group and quantity."
        },
        {
          "icon": "price_change",
          "title": "Website — Multi-Price System",
          "text": "Automatic price switching between retail and wholesale prices based on user role."
        },
        {
          "icon": "storefront",
          "title": "Android App — Product Browsing",
          "text": "Browse products by categories, search, and view detailed product information with images."
        },
        {
          "icon": "shopping_cart",
          "title": "Android App — Cart & Checkout",
          "text": "Add items to cart, manage quantities, and proceed through checkout with address selection."
        },
        {
          "icon": "sync",
          "title": "Android App — API Integration",
          "text": "Real-time data sync with WooCommerce backend via REST API for products, orders, and user data."
        }
      ],
      "details": [
        "WordPress + WooCommerce dual-mode store with retail/wholesale pricing",
        "Native Android app with Material Design connecting via REST API",
        "Multi-tier retail/wholesale pricing system with role-based visibility",
        "Separate inventory for retail and bulk stock",
        "Product browsing, search, cart management, and order placement on mobile",
        "Seamless sync between website and Android app"
      ]
    },
    "amazon-ebay-listings": {
      "title": "Amazon/eBay Product Listing Suite",
      "subtitle": "200+ SEO-Optimized E-Commerce Listings",
      "company": "TIC Accessories Inc.",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["Photoshop", "Illustrator", "Amazon Seller Central", "eBay Seller Hub", "SEO", "Keyword Research"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "200+", "label": "Products Listed" },
        { "value": "SEO", "label": "Optimized Content" },
        { "value": "B2B/B2C", "label": "Dual Marketplace" }
      ],
      "abstract": "Managed and optimized 200+ product listings across Amazon and eBay for TIC Accessories Inc. Each listing included high-resolution product images, SEO-optimized titles and descriptions, competitive pricing strategies, and keyword-rich bullet points to maximize visibility and conversion rates.",
      "flow": [
        {
          "icon": "photo_camera",
          "title": "Product Photography & Editing",
          "text": "Captured professional product photos and edited backgrounds, lighting, and angles for marketplace compliance."
        },
        {
          "icon": "edit",
          "title": "Listing Content Creation",
          "text": "Wrote SEO-optimized titles, bullet points, descriptions, and backend search terms for maximum discoverability."
        },
        {
          "icon": "trending_up",
          "title": "Performance Optimization",
          "text": "Monitored listing analytics, adjusted pricing, and refined keywords to improve ranking and conversion rates."
        }
      ],
      "details": [
        "200+ product listings created and managed on Amazon and eBay",
        "SEO-optimized titles, descriptions, and backend keywords",
        "Professional product photography and image editing",
        "Competitive pricing analysis and adjustment",
        "Sales performance monitoring and listing optimization"
      ]
    },
    "infographic-banner": {
      "title": "E-Commerce Infographic & Banner Portfolio",
      "subtitle": "Promotional & Social Media Visuals",
      "company": "TIC Accessories Inc. / Freelance",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["Photoshop", "Illustrator", "Canva", "Filmora", "Social Media Design"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "50+", "label": "Banners Created" },
        { "value": "Multi-brand", "label": "Design Systems" }
      ],
      "abstract": "Designed a wide range of infographics, promotional banners, social media visuals, and email campaign graphics for e-commerce brands. Work included seasonal sale banners, product comparison infographics, social media posts, and email marketing visuals that improved click-through rates and customer engagement.",
      "flow": [
        {
          "icon": "lightbulb",
          "title": "Concept & Briefing",
          "text": "Collaborated with clients to understand brand guidelines, campaign goals, and target audience."
        },
        {
          "icon": "brush",
          "title": "Design & Production",
          "text": "Created visually compelling designs using Photoshop, Illustrator, and Canva with consistent branding."
        },
        {
          "icon": "campaign",
          "title": "Delivery & Optimization",
          "text": "Delivered final assets in multiple formats and optimized for web, social media, and print."
        }
      ],
      "details": [
        "Promotional banners for seasonal sales and product launches",
        "Product comparison infographics and specification sheets",
        "Social media visuals for Facebook, Instagram, and LinkedIn",
        "Email marketing graphics for customer newsletters",
        "Video thumbnails and basic motion graphics with Filmora"
      ]
    },
    "label-packaging": {
      "title": "Product Label & Packaging Design",
      "subtitle": "Industrial & Retail Label Solutions",
      "company": "DhakaThai AlcoMaxx PLC / TIC Accessories Inc.",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["Photoshop", "Illustrator", "Label Design", "Barcode Systems", "Print Production"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "50+", "label": "Label Designs" },
        { "value": "8,000/day", "label": "Label Output" }
      ],
      "abstract": "Designed product labels and packaging materials for industrial and retail products. Work included barcode labels, QR code labels, shipping labels, and product packaging designs that meet marketplace and shipping compliance requirements.",
      "flow": [
        {
          "icon": "straighten",
          "title": "Label Layout Design",
          "text": "Designed label layouts with product information, barcodes, QR codes, and branding elements."
        },
        {
          "icon": "print",
          "title": "Print Production",
          "text": "Prepared print-ready files for thermal barcode printers and commercial printing presses."
        },
        {
          "icon": "inventory",
          "title": "System Integration",
          "text": "Label formats designed to integrate with ERP systems for automated batch printing."
        }
      ],
      "details": [
        "Product labels with barcodes, QR codes, and regulatory information",
        "Shipping and warehouse labels for logistics operations",
        "Packaging design for retail and wholesale products",
        "Print-ready file preparation for various printer types",
        "ERP-integrated label templates for automated printing"
      ]
    },
    "barcode-label-system": {
      "title": "Barcode & QR Label Systems",
      "subtitle": "ERP-Integrated Label Workflows",
      "company": "DhakaThai AlcoMaxx PLC / Keya Group",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["Barcode Design", "QR Code Systems", "ERP Integration", "Label Printers", "RFID Tags"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "8,000+/day", "label": "QR Labels Scaled" },
        { "value": "60%", "label": "Speed Increase" }
      ],
      "abstract": "Designed and implemented barcode and QR label systems integrated with ERP workflows. At DhakaThai AlcoMaxx PLC, scaled label output from 2,500 to 8,000+ daily by automating bundle labeling through the Weight Checker system. At Keya Group, managed RFID tag generation and barcode systems for RMG factory operations.",
      "flow": [
        {
          "icon": "qr_code_scanner",
          "title": "Label Generation",
          "text": "Automated QR and barcode label generation from ERP data, eliminating manual label creation."
        },
        {
          "icon": "sync",
          "title": "ERP Bridge",
          "text": "Labels auto-populated with real-time production data from LightHouse ERP and GPRO systems."
        },
        {
          "icon": "print",
          "title": "High-Volume Printing",
          "text": "Configured thermal barcode printers for continuous high-speed label output during production shifts."
        }
      ],
      "details": [
        "Scaled daily label output from 2,500 to 8,000+ through automation",
        "Integrated barcode labels with LightHouse ERP at DhakaThai AlcoMaxx",
        "RFID tag generation and barcode systems for RMG factory at Keya Group",
        "Bundle QR labels enabling real-time shipment tracking",
        "Reduced manual labeling errors to near zero through ERP integration"
      ]
    },
    "tic-accessories": {
      "title": "TIC Accessories Inc. — Full-Spectrum Digital Operations",
      "subtitle": "IT Support, Web Dev, E-Commerce, Design & Listings",
      "company": "TIC Accessories Inc. (New York, USA)",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["WordPress", "WooCommerce", "Amazon Seller Central", "eBay", "Photoshop", "Illustrator", "Remote IT Support", "SEO", "Inventory Management"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "200+", "label": "Product Listings" },
        { "value": "Full Stack", "label": "Design + Dev + IT" }
      ],
      "abstract": "Provided comprehensive digital operations support to TIC Accessories Inc., a New York-based tech accessories company, entirely remotely. Scope included IT support and troubleshooting, building and maintaining the company's WordPress/WooCommerce website, creating and optimizing 200+ Amazon and eBay product listings, designing infographics and banners, product photography editing, and managing day-to-day e-commerce operations.",
      "flow": [
        {
          "icon": "support_agent",
          "title": "Remote IT Support",
          "text": "Provided ongoing remote IT support via Anydesk and TeamViewer to the New York office — troubleshooting, software setup, system maintenance."
        },
        {
          "icon": "web",
          "title": "Website Management",
          "text": "Built and maintained the company's WordPress website with WooCommerce integration, product catalogs, and contact systems."
        },
        {
          "icon": "shopping_cart",
          "title": "E-Commerce Operations",
          "text": "Managed Amazon Seller Central and eBay Seller Hub — listings, pricing, inventory sync, and order processing."
        },
        {
          "icon": "palette",
          "title": "Design & Photography",
          "text": "Created product infographics, promotional banners, and social media visuals. Edited product photography for marketplace listings."
        },
        {
          "icon": "assignment",
          "title": "Operations & Reporting",
          "text": "Automated Excel reports, managed email marketing campaigns, and maintained inventory tracking across platforms."
        }
      ],
      "details": [
        "Remote IT support for New York office — troubleshooting, software, and system maintenance",
        "Built and maintained WordPress/WooCommerce company website",
        "Created and optimized 200+ product listings on Amazon and eBay",
        "Designed infographics, banners, and promotional visuals",
        "Product photography editing and optimization for e-commerce",
        "Automated Excel reports and email marketing campaigns",
        "Inventory management across multiple sales channels",
        "SEO-optimized content and product descriptions"
      ]
    },
    "tic-website": {
      "title": "TIC Accessories — Corporate Website",
      "subtitle": "WordPress Company Site with WooCommerce",
      "company": "TIC Accessories Inc.",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["WordPress", "Elementor", "WooCommerce", "Product Management", "Contact System"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "Corporate", "label": "Brand Presence" },
        { "value": "E-Commerce", "label": "Integrated Store" }
      ],
      "abstract": "Built and managed the main company website for TIC Accessories Inc. on WordPress with Elementor page builder. The site includes company information, product catalog, WooCommerce store, and contact system — serving as the central online presence for the tech accessories brand.",
      "flow": [
        {
          "icon": "web",
          "title": "Site Architecture",
          "text": "Built a responsive WordPress site with Elementor, including homepage, about, services, and contact pages."
        },
        {
          "icon": "category",
          "title": "Product Catalog",
          "text": "Organized product catalog with categories, search, and detailed product pages."
        },
        {
          "icon": "shopping_cart",
          "title": "WooCommerce Store",
          "text": "Integrated WooCommerce for online sales with shopping cart, checkout, and payment processing."
        }
      ],
      "details": [
        "Full WordPress website with Elementor page builder",
        "WooCommerce e-commerce integration",
        "Product catalog with categories and search",
        "Contact forms and inquiry system",
        "Responsive design for all devices"
      ]
    },
    "tasbih": {
      "title": "Tasbih — Digital Prayer Counter",
      "subtitle": "Android Tasbih Counting App",
      "company": "Personal Project",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["MIT App Inventor", "Android", "TinyDB"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "Android", "label": "Mobile App" },
        { "value": "Offline", "label": "No Internet Needed" }
      ],
      "abstract": "A digital tasbih (prayer bead) counter Android app that allows users to keep count of their prayers and dhikr. Features multiple counter profiles, session history tracking, and a clean Material Design interface optimized for one-handed use.",
      "flow": [
        {
          "icon": "touch_app",
          "title": "Tap Counting",
          "text": "Simple tap interface to increment count with haptic feedback and visual cues."
        },
        {
          "icon": "bookmark",
          "title": "Multiple Profiles",
          "text": "Create and switch between different counter profiles for various prayers and dhikr."
        },
        {
          "icon": "history",
          "title": "History Tracking",
          "text": "View daily, weekly, and monthly counting history with visual charts."
        }
      ],
      "details": [
        "Clean Material Design interface for one-handed use",
        "Multiple counter profiles for different prayers",
        "Session history with daily/weekly/monthly views",
        "Haptic feedback on each count",
        "Offline operation — no internet required"
      ]
    },
    "zenbreaths": {
      "title": "ZenBreaths — Guided Breathing App",
      "subtitle": "Cross-Platform Mindfulness App",
      "company": "Personal Project",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["HTML", "Tailwind CSS", "Vue 3", "Nuxt", "Capacitor", "Android Studio"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "Guided", "label": "Breathing Sessions" },
        { "value": "Custom", "label": "Duration Settings" }
      ],
      "abstract": "A cross-platform guided breathing and meditation app built with Vue 3 + Nuxt, wrapped as a native Android app via Capacitor. Features customizable session durations, visual breathing guides (inhale/hold/exhale animations), haptic feedback, and ambient sound options.",
      "flow": [
        {
          "icon": "air",
          "title": "Breathing Exercises",
          "text": "Guided breathing patterns with visual animation — inhale, hold, and exhale phases."
        },
        {
          "icon": "timer",
          "title": "Session Control",
          "text": "Customizable session duration from 1 to 30 minutes with progress tracking."
        },
        {
          "icon": "music_note",
          "title": "Ambient Sounds",
          "text": "Optional background ambient sounds to enhance the meditation experience."
        }
      ],
      "details": [
        "Guided breathing with visual inhale/hold/exhale animation",
        "Customizable session duration (1-30 minutes)",
        "Ambient sound options for relaxation",
        "Session history and streak tracking",
        "Minimalist UI styled with Tailwind CSS"
      ]
    },
    "hakimadapp-website": {
      "title": "Hakimadapp.github.io — Religious Website",
      "subtitle": "Faith-Based Islamic Website",
      "company": "Personal Project",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["HTML", "CSS", "JavaScript", "GitHub Pages"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "Religious", "label": "Faith Platform" },
        { "value": "Responsive", "label": "All Devices" }
      ],
      "abstract": "A religious/faith-based website hosted on GitHub Pages, designed to provide Islamic content, resources, and information. Built with clean static web technologies for reliable performance and easy updates.",
      "flow": [
        {
          "icon": "menu_book",
          "title": "Content Sections",
          "text": "Organized religious content with easy navigation and clean typography for comfortable reading."
        },
        {
          "icon": "public",
          "title": "Global Access",
          "text": "Hosted on GitHub Pages for fast, reliable access from anywhere in the world."
        },
        {
          "icon": "devices",
          "title": "Responsive Design",
          "text": "Fully responsive layout ensuring the site works perfectly on mobile, tablet, and desktop."
        }
      ],
      "details": [
        "Faith-based religious content website",
        "Built with HTML, CSS, and JavaScript",
        "Hosted on GitHub Pages",
        "Responsive design for all devices",
        "Clean, readable typography for long-form content"
      ]
    },
    "dhakathai-it": {
      "title": "DhakaThai Alcomaxx PLC — IT Operations",
      "subtitle": "Full IT Support for Aluminum Manufacturing Plant",
      "company": "DhakaThai AlcoMaxx PLC",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["IT Support", "OS Administration", "Barcode ERP", "System Maintenance", "Tools Development", "Network Setup"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "Plant-wide", "label": "IT Operations" },
        { "value": "ERP", "label": "Barcode Integration" }
      ],
      "abstract": "Managed full-spectrum IT operations at DhakaThai AlcoMaxx PLC, a leading aluminum manufacturing plant. Responsibilities included operating system administration, barcode ERP system management, hardware/software diagnostics and maintenance, utility tool development for production workflows, and network configuration across the facility.",
      "flow": [
        {
          "icon": "dns",
          "title": "System Administration",
          "text": "Installed, configured, and maintained Windows/Linux systems across production and office workstations."
        },
        {
          "icon": "inventory",
          "title": "Barcode ERP Management",
          "text": "Administered barcode and labeling ERP systems for production tracking and inventory management."
        },
        {
          "icon": "build",
          "title": "Tools Development",
          "text": "Developed utility tools and scripts to automate routine tasks and improve production workflow efficiency."
        },
        {
          "icon": "router",
          "title": "Network & Hardware",
          "text": "Configured LAN, printers, and peripherals. Diagnosed and resolved hardware and software issues."
        }
      ],
      "details": [
        "Full IT support for aluminum manufacturing plant operations",
        "OS administration across production and office workstations",
        "Barcode ERP system management and maintenance",
        "Utility tool development for production automation",
        "Hardware/software diagnostics and troubleshooting",
        "Network configuration and printer management"
      ]
    },
    "keya-group-it": {
      "title": "Keya Group [IT-GPRO] — ERP Administration",
      "subtitle": "IT Support Across 50+ Workstations",
      "company": "Keya Knit Composite Ltd.",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["GPRO ERP", "IT Support", "OS Administration", "RFID Systems", "Barcode Systems", "Network Maintenance", "User Training"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "50+", "label": "Workstations Managed" },
        { "value": "30+", "label": "Users Trained" }
      ],
      "abstract": "Administered IT operations at Keya Group, a large RMG (Ready-Made Garments) factory. Managed GPRO ERP modules including cutting, store, production, payroll, billing, and inventory. Configured and troubleshot PCs, printers, and network across 50+ workstations. Implemented RFID and barcode systems for factory operations and trained 30+ users on ERP workflows.",
      "flow": [
        {
          "icon": "storage",
          "title": "GPRO ERP Administration",
          "text": "Managed all major ERP modules: cutting, store, production, payroll, billing, and inventory across departments."
        },
        {
          "icon": "desktop_windows",
          "title": "Workstation Management",
          "text": "Configured, maintained, and troubleshot 50+ PCs and printers across the factory and office."
        },
        {
          "icon": "scan",
          "title": "RFID & Barcode Systems",
          "text": "Implemented RFID tag generation and barcode systems for RMG production tracking and inventory."
        },
        {
          "icon": "school",
          "title": "User Training",
          "text": "Trained 30+ employees on ERP modules, system workflows, and best practices for daily operations."
        }
      ],
      "details": [
        "Full GPRO ERP administration across cutting, store, production, payroll, billing, inventory modules",
        "IT support and maintenance for 50+ workstations",
        "RFID and barcode system implementation for RMG factory",
        "Network configuration, printer setup, and troubleshooting",
        "Trained 30+ users on ERP systems and workflows",
        "Hardware diagnostics and system maintenance"
      ]
    },
    "bpi-lab": {
      "title": "B. P. I. Innovation Lab",
      "subtitle": "College Innovation Lab Setup & Support",
      "company": "Bogura Polytechnic Institute",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["Hardware Setup", "Software Installation", "Network Configuration", "Lab Maintenance"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "Lab Setup", "label": "Full Installation" },
        { "value": "Multi-Use", "label": "Software + Hardware" }
      ],
      "abstract": "Set up and maintained the Innovation Lab at Bogura Polytechnic Institute. Work included installing and configuring computer hardware, setting up software development environments, establishing local network infrastructure, and providing ongoing maintenance for the lab used by students for software and hardware projects.",
      "flow": [
        {
          "icon": "computer",
          "title": "Hardware Setup",
          "text": "Assembled and configured computer systems with appropriate hardware for development and testing."
        },
        {
          "icon": "code",
          "title": "Software Installation",
          "text": "Installed development tools, IDEs, and learning software required for the polytechnic curriculum."
        },
        {
          "icon": "lan",
          "title": "Network Configuration",
          "text": "Set up local network with internet access, printer sharing, and file server for student use."
        }
      ],
      "details": [
        "Full computer hardware setup and configuration",
        "Software installation for development and learning",
        "Local network setup with internet and printer sharing",
        "Ongoing maintenance and technical support for students"
      ]
    },
    "naogaon-lab": {
      "title": "Naogaon Tech. School ICT Lab",
      "subtitle": "Computer Lab Installation for Technical School",
      "company": "Naogaon Technical School & College",
      "developer": "Md. Asaduzzaman (Aminur)",
      "tech": ["PC Assembly", "OS Installation", "Software Setup", "Hardware Diagnostics"],
      "images": ["assets/images/placeholder.png"],
      "metrics": [
        { "value": "Lab Setup", "label": "Complete Installation" },
        { "value": "ICT", "label": "Curriculum Ready" }
      ],
      "abstract": "Set up the ICT computer lab at Naogaon Technical School & College. Responsible for PC assembly, operating system installation, educational software setup, and hardware diagnostics. The lab was used for SSC (Vocational) ICT classes, providing hands-on computer training to students.",
      "flow": [
        {
          "icon": "build",
          "title": "PC Assembly",
          "text": "Assembled computer systems from components — motherboard, CPU, RAM, storage, and peripherals."
        },
        {
          "icon": "desktop_windows",
          "title": "OS & Software",
          "text": "Installed Windows and Linux operating systems along with educational software for ICT curriculum."
        },
        {
          "icon": "bug_report",
          "title": "Diagnostics & Support",
          "text": "Performed hardware diagnostics, resolved technical issues, and provided ongoing lab support."
        }
      ],
      "details": [
        "PC assembly from individual components",
        "Windows and Linux OS installation",
        "Educational software setup for ICT curriculum",
        "Hardware diagnostics and troubleshooting",
        "Ongoing lab maintenance and support"
      ]
    }
  }
}
;
