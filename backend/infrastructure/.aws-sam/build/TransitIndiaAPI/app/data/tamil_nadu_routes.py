# Coimbatore city and suburban bus stops with REAL GPS coordinates
# This project is scoped to Coimbatore public buses only.

COIMBATORE_STOPS = {
    # City stops
    "Gandhipuram": (11.0168, 76.9558),
    "Ukkadam": (10.9925, 76.9614),
    "Singanallur": (11.0045, 77.0072),
    "Town Hall": (10.9990, 76.9640),
    "RS Puram": (11.0060, 76.9480),
    "Saibaba Colony": (11.0195, 76.9430),
    "Peelamedu": (11.0260, 77.0100),
    "Saravanampatti": (11.0680, 77.0060),
    "Hopes College": (11.0010, 76.9650),
    "Sidhapudur": (11.0100, 76.9540),
    "Podanur": (10.9640, 76.9900),
    "Kurichi": (10.9650, 77.0250),
    "Vadavalli": (11.0240, 76.9020),
    "Thudiyalur": (11.0650, 76.9350),
    "Karamadai": (11.0960, 76.8700),
    "Periyanaickenpalayam": (11.0930, 76.9480),
    "Kovaipudur": (10.9570, 76.9100),
    "Ramanathapuram (CBE)": (10.9820, 76.9540),
    "Uppilipalayam": (10.9960, 76.9610),
    "Pappanaickenpalayam": (11.0420, 76.9310),
    "Ondipudur": (11.0500, 76.9280),
    "Kavundampalayam": (11.0350, 76.9450),
    "GN Mills": (11.0310, 76.9380),
    "Bharathi Nagar": (11.0080, 76.9500),
    "Sundarapuram": (10.9700, 76.9300),
    "Vellalore": (10.9530, 76.9720),
    "Bilichi": (10.9410, 76.9610),
    "Kuniyamuthur": (10.9660, 76.9230),
    "Madukkarai": (10.9070, 76.9550),
    "Eachanari": (10.9260, 76.9330),
    # Suburban stops
    "Pollachi": (10.6580, 77.0080),
    "Mettupalayam": (11.2960, 76.9370),
    "Annur": (11.2290, 77.1050),
    "Sulur": (11.0360, 77.1240),
    "Kinathukadavu": (10.8230, 76.9880),
    "Valparai": (10.3270, 76.9560),
    "Sirumugai": (11.3190, 76.9000),
    "Avinashi": (11.1950, 77.2690),
    "Tiruppur": (11.1085, 77.3411),
    "Palladam": (10.9930, 77.2830),
    "Perur": (10.9710, 76.9120),
    "Madampatti": (11.0080, 76.8740),
    "Narasimhanaickenpalayam": (11.0770, 76.8960),
    "Chettipalayam": (10.9380, 76.9940),
    "Irugur": (11.0090, 77.0630),
}

# All districts reduced to only Coimbatore
DISTRICTS = {
    "Coimbatore": list(COIMBATORE_STOPS.keys()),
}

BUS_TYPES = ["Ordinary", "Express", "Deluxe", "Town Bus", "AC"]

# Real Coimbatore bus routes (based on actual TNSTC Coimbatore routes)
COIMBATORE_ROUTES = [
    {
        "name": "1 - Ukkadam to Saravanampatti",
        "stops": ["Ukkadam", "Town Hall", "Gandhipuram", "Sidhapudur", "RS Puram", "Saibaba Colony", "Peelamedu", "Singanallur", "Saravanampatti"],
        "type": "Town Bus",
    },
    {
        "name": "2 - Gandhipuram to Vadavalli",
        "stops": ["Gandhipuram", "RS Puram", "Saibaba Colony", "GN Mills", "Pappanaickenpalayam", "Vadavalli"],
        "type": "Town Bus",
    },
    {
        "name": "3 - Gandhipuram to Perur",
        "stops": ["Gandhipuram", "Sidhapudur", "RS Puram", "Bharathi Nagar", "Ramanathapuram (CBE)", "Kuniyamuthur", "Perur"],
        "type": "Town Bus",
    },
    {
        "name": "4 - Ukkadam to Kovaipudur",
        "stops": ["Ukkadam", "Town Hall", "Hopes College", "Uppilipalayam", "Ramanathapuram (CBE)", "Sundarapuram", "Kovaipudur"],
        "type": "Town Bus",
    },
    {
        "name": "5 - Gandhipuram to Kurichi",
        "stops": ["Gandhipuram", "Town Hall", "Ukkadam", "Vellalore", "Bilichi", "Chettipalayam", "Kurichi"],
        "type": "Town Bus",
    },
    {
        "name": "6 - Gandhipuram to Thudiyalur",
        "stops": ["Gandhipuram", "Kavundampalayam", "Ondipudur", "Pappanaickenpalayam", "Thudiyalur"],
        "type": "Town Bus",
    },
    {
        "name": "7 - Gandhipuram to Eachanari",
        "stops": ["Gandhipuram", "Town Hall", "Ukkadam", "Vellalore", "Eachanari"],
        "type": "Town Bus",
    },
    {
        "name": "8 - Gandhipuram to Madukkarai",
        "stops": ["Gandhipuram", "Town Hall", "Ukkadam", "Vellalore", "Eachanari", "Madukkarai"],
        "type": "Town Bus",
    },
    {
        "name": "9 - Ukkadam to Sulur",
        "stops": ["Ukkadam", "Town Hall", "Singanallur", "Peelamedu", "Irugur", "Sulur"],
        "type": "Town Bus",
    },
    {
        "name": "10 - Gandhipuram to Karamadai",
        "stops": ["Gandhipuram", "Kavundampalayam", "Ondipudur", "Periyanaickenpalayam", "Narasimhanaickenpalayam", "Karamadai"],
        "type": "Express",
    },
    {
        "name": "11 - Gandhipuram to Podanur",
        "stops": ["Gandhipuram", "Town Hall", "Ukkadam", "Podanur"],
        "type": "Town Bus",
    },
    {
        "name": "12 - Gandhipuram to Annur",
        "stops": ["Gandhipuram", "Peelamedu", "Saravanampatti", "Irugur", "Sulur", "Annur"],
        "type": "Express",
    },
    {
        "name": "13 - Ukkadam to Madampatti",
        "stops": ["Ukkadam", "Ramanathapuram (CBE)", "Kuniyamuthur", "Perur", "Madampatti"],
        "type": "Town Bus",
    },
    {
        "name": "14 - Gandhipuram to Sirumugai",
        "stops": ["Gandhipuram", "Ondipudur", "Periyanaickenpalayam", "Karamadai", "Sirumugai"],
        "type": "Express",
    },
    {
        "name": "15 - Gandhipuram to Mettupalayam",
        "stops": ["Gandhipuram", "Kavundampalayam", "Thudiyalur", "Periyanaickenpalayam", "Karamadai", "Sirumugai", "Mettupalayam"],
        "type": "Express",
    },
    {
        "name": "16 - Ukkadam to Pollachi",
        "stops": ["Ukkadam", "Podanur", "Kinathukadavu", "Pollachi"],
        "type": "Express",
    },
    {
        "name": "17 - Gandhipuram to Tiruppur",
        "stops": ["Gandhipuram", "Peelamedu", "Saravanampatti", "Avinashi", "Tiruppur"],
        "type": "Express",
    },
    {
        "name": "18 - Gandhipuram to Palladam",
        "stops": ["Gandhipuram", "Singanallur", "Irugur", "Palladam"],
        "type": "Express",
    },
    {
        "name": "19 - Gandhipuram to Valparai",
        "stops": ["Gandhipuram", "Town Hall", "Ukkadam", "Podanur", "Pollachi", "Valparai"],
        "type": "Deluxe",
    },
    {
        "name": "20 - RS Puram to Singanallur",
        "stops": ["RS Puram", "Saibaba Colony", "Gandhipuram", "Peelamedu", "Singanallur"],
        "type": "Town Bus",
    },
    {
        "name": "21 - Ukkadam to Periyanaickenpalayam",
        "stops": ["Ukkadam", "Gandhipuram", "Kavundampalayam", "Ondipudur", "Periyanaickenpalayam"],
        "type": "Town Bus",
    },
    {
        "name": "22 - Podanur to Gandhipuram",
        "stops": ["Podanur", "Ukkadam", "Town Hall", "Hopes College", "Gandhipuram"],
        "type": "Town Bus",
    },
    {
        "name": "23 - Singanallur to Vadavalli",
        "stops": ["Singanallur", "Peelamedu", "Gandhipuram", "RS Puram", "GN Mills", "Vadavalli"],
        "type": "Town Bus",
    },
    {
        "name": "24 - Gandhipuram to Kinathukadavu",
        "stops": ["Gandhipuram", "Ukkadam", "Podanur", "Chettipalayam", "Kinathukadavu"],
        "type": "Express",
    },
    {
        "name": "25 - Ukkadam to Avinashi",
        "stops": ["Ukkadam", "Town Hall", "Gandhipuram", "Peelamedu", "Saravanampatti", "Avinashi"],
        "type": "Express",
    },
]
