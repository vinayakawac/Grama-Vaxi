package com.example.grama_vaxi.data.local.constants

data class Place(
    val en: String,
    val kn: String
)

data class District(
    val districtEn: String,
    val districtKn: String,
    val taluks: List<Place>
)

object KarnatakaPlaces {
    val districts = listOf(
        District(
            districtEn = "Bagalkote",
            districtKn = "ಬಾಗಲಕೋಟೆ",
            taluks = listOf(
                Place("Bagalkote", "ಬಾಗಲಕೋಟೆ"),
                Place("Jamkhandi", "ಜಮಖಂಡಿ"),
                Place("Mudhol", "ಮುಧೋಳ"),
                Place("Badami", "ಬಾದಾಮಿ"),
                Place("Bilagi", "ಬೀಳಗಿ"),
                Place("Hungund", "ಹುನಗುಂದ"),
                Place("Ilkal", "ಇಳಕಲ್ಲ"),
                Place("Rabkavi Banhatti", "ರಬಕವಿ ಬನಹಟ್ಟಿ"),
                Place("Guledgudda", "ಗುಳೇದಗುಡ್ಡ")
            )
        ),
        District(
            districtEn = "Ballari",
            districtKn = "ಬಳ್ಳಾರಿ",
            taluks = listOf(
                Place("Ballari", "ಬಳ್ಳಾರಿ"),
                Place("Sanduru", "ಸಂಡೂರು"),
                Place("Siruguppa", "ಸಿರುಗುಪ್ಪ"),
                Place("Kurugodu", "ಕುರುಗೋಡು")
            )
        ),
        District(
            districtEn = "Belagavi",
            districtKn = "ಬೆಳಗಾವಿ",
            taluks = listOf(
                Place("Belagavi", "ಬೆಳಗಾವಿ"),
                Place("Athani", "ಅಥಣಿ"),
                Place("Bailhongal", "ಬೈಲಹೊಂಗಲ"),
                Place("Chikkodi", "ಚಿಕ್ಕೋಡಿ"),
                Place("Gokak", "ಗೋಕಾಕ"),
                Place("Khanapur", "ಖಾನಾಪುರ"),
                Place("Mudalgi", "ಮೂಡಲಗಿ"),
                Place("Nippani", "ನಿಪ್ಪಾಣಿ"),
                Place("Raybag", "ರಾಯಬಾಗ"),
                Place("Savadatti", "ಸವದತ್ತಿ"),
                Place("Ramdurg", "ರಾಮದುರ್ಗ"),
                Place("Kagawada", "ಕಾಗವಾಡ"),
                Place("Hukkeri", "ಹುಕ್ಕೇರಿ"),
                Place("Kittur", "ಕಿತ್ತೂರು")
            )
        ),
        District(
            districtEn = "Bengaluru Rural",
            districtKn = "ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ",
            taluks = listOf(
                Place("Devanahalli", "ದೇವನಹಳ್ಳಿ"),
                Place("Doddaballapura", "ದೊಡ್ಡಬಳ್ಳಾಪುರ"),
                Place("Hosakote", "ಹೊಸಕೋಟೆ"),
                Place("Nelamangala", "ನೆಲಮಂಗಲ")
            )
        ),
        District(
            districtEn = "Bengaluru Urban",
            districtKn = "ಬೆಂಗಳೂರು ನಗರ",
            taluks = listOf(
                Place("Bengaluru North", "ಬೆಂಗಳೂರು ಉತ್ತರ"),
                Place("Bengaluru East", "ಬೆಂಗಳೂರು ಪೂರ್ವ"),
                Place("Bengaluru South", "ಬೆಂಗಳೂರು ದಕ್ಷಿಣ"),
                Place("Anekal", "ಆನೇಕಲ್"),
                Place("Yelahanka", "ಯಲಹಂಕ")
            )
        ),
        District(
            districtEn = "Bidar",
            districtKn = "ಬೀದರ್",
            taluks = listOf(
                Place("Bidar", "ಬೀದರ್"),
                Place("Bhalki", "ಭಾಲ್ಕಿ"),
                Place("Aurad", "ಔರಾದ್"),
                Place("Basavakalyan", "ಬಸವಕಲ್ಯಾಣ"),
                Place("Hulsoor", "ಹುಲಸೂರು"),
                Place("Humanabad", "ಹುಮ್ನಾಬಾದ್"),
                Place("Kamalnagar", "ಕಮಲಾನಗರ")
            )
        ),
        District(
            districtEn = "Chamarajanagar",
            districtKn = "ಚಾಮರಾಜನಗರ",
            taluks = listOf(
                Place("Chamarajanagar", "ಚಾಮರಾಜನಗರ"),
                Place("Gundlupet", "ಗುಂಡ್ಲುಪೇಟೆ"),
                Place("Kollegal", "ಕೊಳ್ಳೇಗಾಲ"),
                Place("Yelandur", "ಯಳಂದೂರು"),
                Place("Hanur", "ಹನೂರು")
            )
        ),
        District(
            districtEn = "Chikkaballapura",
            districtKn = "ಚಿಕ್ಕಬಳ್ಳಾಪುರ",
            taluks = listOf(
                Place("Chikkaballapura", "ಚಿಕ್ಕಬಳ್ಳಾಪುರ"),
                Place("Bagepalli", "ಬಾಗೇಪಲ್ಲಿ"),
                Place("Chintamani", "ಚಿಂತಾಮಣಿ"),
                Place("Gauribidanur", "ಗೌರಿಬಿದನೂರು"),
                Place("Gudibanda", "ಗುಡಿಬಂಡೆ"),
                Place("Sidlaghatta", "ಶಿಡ್ಲಘಟ್ಟ"),
                Place("Chelur", "ಚೇಲೂರು")
            )
        ),
        District(
            districtEn = "Chikkamagaluru",
            districtKn = "ಚಿಕ್ಕಮಗಳೂರು",
            taluks = listOf(
                Place("Chikkamagaluru", "ಚಿಕ್ಕಮಗಳೂರು"),
                Place("Kadur", "ಕಡೂರು"),
                Place("Koppa", "ಕೊಪ್ಪ"),
                Place("Mudigere", "ಮೂಡಿಗೆರೆ"),
                Place("Narasimharajapura", "ನರಸಿಂಹರಾಜಪುರ"),
                Place("Sringeri", "ಶೃಂಗೇರಿ"),
                Place("Tarikere", "ತರೀಕೆರೆ"),
                Place("Ajjampura", "ಅಜ್ಜಂಪುರ"),
                Place("Kalasa", "ಕಳಸ")
            )
        ),
        District(
            districtEn = "Chitradurga",
            districtKn = "ಚಿತ್ರದುರ್ಗ",
            taluks = listOf(
                Place("Chitradurga", "ಚಿತ್ರದುರ್ಗ"),
                Place("Challakere", "ಚಳ್ಳಕೆರೆ"),
                Place("Hiriyur", "ಹಿರಿಯೂರು"),
                Place("Holalkere", "ಹೊಳಲ್ಕೆರೆ"),
                Place("Hosadurga", "ಹೊಸದುರ್ಗ"),
                Place("Molakalmuru", "ಮೊಳಕಾಲ್ಮೂರು")
            )
        ),
        District(
            districtEn = "Dakshina Kannada",
            districtKn = "ದಕ್ಷಿಣ ಕನ್ನಡ",
            taluks = listOf(
                Place("Mangaluru", "ಮಂಗಳೂರು"),
                Place("Ullal", "ಉಳ್ಳಾಲ"),
                Place("Mulki", "ಮುಲ್ಕಿ"),
                Place("Moodabidri", "ಮೂಡುಬಿದಿರೆ"),
                Place("Bantwal", "ಬಂಟ್ವಾಳ"),
                Place("Belthangady", "ಬೆಳ್ತಂಗಡಿ"),
                Place("Puttur", "ಪುತ್ತೂರು"),
                Place("Sullia", "ಸುಳ್ಯ"),
                Place("Kadaba", "ಕಡಬ")
            )
        ),
        District(
            districtEn = "Davanagere",
            districtKn = "ದಾವಣಗೆರೆ",
            taluks = listOf(
                Place("Davanagere", "ದಾವಣಗೆರೆ"),
                Place("Channagiri", "ಚನ್ನಗಿರಿ"),
                Place("Harihara", "ಹರಿಹರ"),
                Place("Honnali", "ಹೊನ್ನಾಳಿ"),
                Place("Jagalur", "ಜಗಳೂರು"),
                Place("Nyamathi", "ನ್ಯಾಮತಿ")
            )
        ),
        District(
            districtEn = "Dharwad",
            districtKn = "ಧಾರವಾಡ",
            taluks = listOf(
                Place("Dharwad", "ಧಾರವಾಡ"),
                Place("Hubballi City", "ಹುಬ್ಬಳ್ಳಿ ನಗರ"),
                Place("Hubballi Rural", "ಹುಬ್ಬಳ್ಳಿ ಗ್ರಾಮೀಣ"),
                Place("Kalghatgi", "ಕಲಘಟಗಿ"),
                Place("Kundgol", "ಕುಂದಗೋಳ"),
                Place("Navalgund", "ನವಲಗುಂದ"),
                Place("Annigeri", "ಅಣ್ಣಿಗೇರಿ"),
                Place("Alnavar", "ಅಳ್ನಾವರ")
            )
        ),
        District(
            districtEn = "Gadag",
            districtKn = "ಗದಗ",
            taluks = listOf(
                Place("Gadag", "ಗದಗ"),
                Place("Ron", "ರೋಣ"),
                Place("Shirahatti", "ಶಿರಹಟ್ಟಿ"),
                Place("Nargund", "ನರಗುಂದ"),
                Place("Mundargi", "ಮುಂಡರಗಿ"),
                Place("Lakshmeshwar", "ಲಕ್ಷ್ಮೇಶ್ವರ"),
                Place("Gajendragad", "ಗಜೇಂದ್ರಗಡ")
            )
        ),
        District(
            districtEn = "Hassan",
            districtKn = "ಹಾಸನ",
            taluks = listOf(
                Place("Hassan", "ಹಾಸನ"),
                Place("Arasikere", "ಅರಸೀಕೆರೆ"),
                Place("Channarayapatna", "ಚನ್ನರಾಯಪಟ್ಟಣ"),
                Place("Holenarsipura", "ಹೊಳೆನರಸೀಪುರ"),
                Place("Sakleshpura", "ಸಕಲೇಶಪುರ"),
                Place("Alur", "ಆಲೂರು"),
                Place("Arakalagud", "ಅರಕಲಗೂಡು"),
                Place("Belur", "ಬೇಲೂರು")
            )
        ),
        District(
            districtEn = "Haveri",
            districtKn = "ಹಾವೇರಿ",
            taluks = listOf(
                Place("Haveri", "ಹಾವೇರಿ"),
                Place("Byadgi", "ಬ್ಯಾಡಗಿ"),
                Place("Hirekerur", "ಹಿರೇಕೆರೂರು"),
                Place("Ranibennur", "ರಾಣೇಬೆನ್ನೂರು"),
                Place("Savanur", "ಸವಣೂರು"),
                Place("Shiggaon", "ಶಿಗ್ಗಾಂವಿ"),
                Place("Hangal", "ಹಾನಗಲ್"),
                Place("Ratnagiri", "ರತ್ನಗಿರಿ")
            )
        ),
        District(
            districtEn = "Kalaburagi",
            districtKn = "ಕಲಬುರಗಿ",
            taluks = listOf(
                Place("Kalaburagi", "ಕಲಬುರಗಿ"),
                Place("Afzalpur", "ಅಫಜಲಪುರ"),
                Place("Aland", "ಆಳಂದ"),
                Place("Chincholi", "ಚಿಂಚೋಳಿ"),
                Place("Chittapur", "ಚಿತ್ತಾಪುರ"),
                Place("Jevargi", "ಜೇವರ್ಗಿ"),
                Place("Sedam", "ಸೇಡಂ"),
                Place("Kamalapur", "ಕಮಲಾಪುರ"),
                Place("Shahabad", "ಶಹಾಬಾದ್"),
                Place("Kalgi", "ಕಳಗಿ"),
                Place("Yedrami", "ಯಡ್ರಾಮಿ")
            )
        ),
        District(
            districtEn = "Kodagu",
            districtKn = "ಕೊಡಗು",
            taluks = listOf(
                Place("Madikeri", "ಮಡಿಕೇರಿ"),
                Place("Somvarpet", "ಸೋಮವಾರಪೇಟೆ"),
                Place("Virajpet", "ವಿರಾಜಪೇಟೆ"),
                Place("Kushalnagar", "ಕುಶಾಲನಗರ"),
                Place("Ponnampet", "ಪೊನ್ನಂಪೇಟೆ")
            )
        ),
        District(
            districtEn = "Kolar",
            districtKn = "ಕೋಲಾರ",
            taluks = listOf(
                Place("Kolar", "ಕೋಲಾರ"),
                Place("Bangarapet", "ಬಂಗಾರಪೇಟೆ"),
                Place("Malur", "ಮಾಲೂರು"),
                Place("Mulbagal", "ಮುಳಬಾಗಿಲು"),
                Place("Srinivaspur", "ಶ್ರೀನಿವಾಸಪುರ"),
                Place("KGF", "ಕೆಜಿಎಫ್")
            )
        ),
        District(
            districtEn = "Koppal",
            districtKn = "ಕೊಪ್ಪಳ",
            taluks = listOf(
                Place("Koppal", "ಕೊಪ್ಪಳ"),
                Place("Gangavathi", "ಗಂಗಾವತಿ"),
                Place("Kushtagi", "ಕುಷ್ಟಗಿ"),
                Place("Yelburga", "ಯಲಬುರ್ಗಾ"),
                Place("Kanakagiri", "ಕನಕಗಿರಿ"),
                Place("Karatagi", "ಕಾರಟಗಿ"),
                Place("Kukanoor", "ಕುಕನೂರು")
            )
        ),
        District(
            districtEn = "Mandya",
            districtKn = "ಮಂಡ್ಯ",
            taluks = listOf(
                Place("Mandya", "ಮಂಡ್ಯ"),
                Place("Maddur", "ಮದ್ದೂರು"),
                Place("Malavalli", "ಮಳವಳ್ಳಿ"),
                Place("Nagamangala", "ನಾಗಮಂಗಲ"),
                Place("Pandavapura", "ಪಾಂಡವಪುರ"),
                Place("Krishnarajpet", "ಕೃಷ್ಣರಾಜಪೇಟೆ"),
                Place("Shrirangapattana", "ಶ್ರೀರಂಗಪಟ್ಟಣ")
            )
        ),
        District(
            districtEn = "Mysuru",
            districtKn = "ಮೈಸೂರು",
            taluks = listOf(
                Place("Mysuru", "ಮೈಸೂರು"),
                Place("Hunsur", "ಹುಣಸೂರು"),
                Place("K.R. Nagar", "ಕೆ.ಆರ್. ನಗರ"),
                Place("Nanjangud", "ನಂಜನಗೂಡು"),
                Place("Piriyapatna", "ಪಿರಿಯಾಪಟ್ಟಣ"),
                Place("T. Narasipur", "ಟಿ. ನರಸೀಪುರ"),
                Place("Heggadadevana Kote", "ಹೆಚ್.ಡಿ. ಕೋಟೆ"),
                Place("Saligrama", "ಸಾಲಿಗ್ರಾಮ")
            )
        ),
        District(
            districtEn = "Raichur",
            districtKn = "ರಾಯಚೂರು",
            taluks = listOf(
                Place("Raichur", "ರಾಯಚೂರು"),
                Place("Devadurga", "ದೇವದುರ್ಗ"),
                Place("Lingasugur", "ಲಿಂಗಸಗೂರು"),
                Place("Manvi", "ಮಾನ್ವಿ"),
                Place("Sindhanur", "ಸಿಂಧನೂರು"),
                Place("Maski", "ಮಸ್ಕಿ"),
                Place("Sirwar", "ಸಿರವಾರ")
            )
        ),
        District(
            districtEn = "Ramanagara",
            districtKn = "ರಾಮನಗರ",
            taluks = listOf(
                Place("Ramanagara", "ರಾಮನಗರ"),
                Place("Channapatna", "ಚನ್ನಪಟ್ಟಣ"),
                Place("Kanakapura", "ಕನಕಪುರ"),
                Place("Magadi", "ಮಾಗಡಿ"),
                Place("Harohalli", "ಹಾರೋಹಳ್ಳಿ")
            )
        ),
        District(
            districtEn = "Shivamogga",
            districtKn = "ಶಿವಮೊಗ್ಗ",
            taluks = listOf(
                Place("Shivamogga", "ಶಿವಮೊಗ್ಗ"),
                Place("Bhadravathi", "ಭದ್ರಾವತಿ"),
                Place("Hosanagara", "ಹೊಸನಗರ"),
                Place("Sagar", "ಸಾಗರ"),
                Place("Shikaripur", "ಶಿಕಾರಿಪುರ"),
                Place("Soraba", "ಸೊರಬ"),
                Place("Thirthahalli", "ತೀರ್ಥಹಳ್ಳಿ")
            )
        ),
        District(
            districtEn = "Tumakuru",
            districtKn = "ತುಮಕೂರು",
            taluks = listOf(
                Place("Tumakuru", "ತುಮಕೂರು"),
                Place("Chiknayakanahalli", "ಚಿಕ್ಕನಾಯಕನಹಳ್ಳಿ"),
                Place("Gubbi", "ಗುಬ್ಬಿ"),
                Place("Koratagere", "ಕೊರಟಗೆರೆ"),
                Place("Kunigal", "ಕುಣಿಗಲ್"),
                Place("Madhugiri", "ಮಧುಗಿರಿ"),
                Place("Pavagada", "ಪಾವಗಡ"),
                Place("Sira", "ಸಿರಾದ"),
                Place("Tiptur", "ತಿಪಟೂರು"),
                Place("Turuvekere", "ತುರುವೇಕೆರೆ")
            )
        ),
        District(
            districtEn = "Udupi",
            districtKn = "ಉಡುಪಿ",
            taluks = listOf(
                Place("Udupi", "ಉಡುಪಿ"),
                Place("Karkala", "ಕಾರ್ಕಳ"),
                Place("Kundapura", "ಕುಂದಾಪುರ"),
                Place("Brahmavara", "ಬ್ರಹ್ಮಾವರ"),
                Place("Byndoor", "ಬೈಂದೂರು"),
                Place("Hebri", "ಹೆಬ್ರಿ"),
                Place("Kapu", "ಕಾಪು")
            )
        ),
        District(
            districtEn = "Uttara Kannada",
            districtKn = "ಉತ್ತರ ಕನ್ನಡ",
            taluks = listOf(
                Place("Karwar", "ಕಾರವಾರ"),
                Place("Ankola", "ಅಂಕೋಲಾ"),
                Place("Bhatkal", "ಭಟ್ಕಳ"),
                Place("Haliyal", "ಹಳಿಯಾಳ"),
                Place("Honnavar", "ಹೊನ್ನಾವರ"),
                Place("Joida", "ಜೋಯಿಡಾ"),
                Place("Kumta", "ಕುಮಟಾ"),
                Place("Mundgod", "ಮುಂಡಗೋಡ"),
                Place("Siddapur", "ಸಿದ್ದಾಪುರ"),
                Place("Sirsi", "ಶಿರಸಿ"),
                Place("Yellapur", "ಯಲ್ಲಾಪುರ"),
                Place("Dandeli", "ದಾಂಡೇಲಿ")
            )
        ),
        District(
            districtEn = "Vijayanagara",
            districtKn = "ವಿಜಯನಗರ",
            taluks = listOf(
                Place("Hosapete", "ಹೊಸಪೇಟೆ"),
                Place("Kampli", "ಕಂಪ್ಲಿ"),
                Place("Hagaribommanahalli", "ಹಗರಿಬೊಮ್ಮನಹಳ್ಳಿ"),
                Place("Kottur", "ಕೊಟ್ಟೂರು"),
                Place("Hadagali", "ಹಡಗಲಿ"),
                Place("Harapanahalli", "ಹರಪನಹಳ್ಳಿ")
            )
        ),
        District(
            districtEn = "Vijayapura",
            districtKn = "ವಿಜಯಪುರ",
            taluks = listOf(
                Place("Vijayapura", "ವಿಜಯಪುರ"),
                Place("Basavana Bagevadi", "ಬಸವನ ಬಾಗೇವಾಡಿ"),
                Place("Indi", "ಇಂಡಿ"),
                Place("Muddebihal", "ಮುದ್ದೇಬಿಹಾಳ"),
                Place("Sindagi", "ಸಿಂದಗಿ"),
                Place("Babaleshwar", "ಬಬಲೇಶ್ವರ"),
                Place("Talikote", "ತಾಳಿಕೋಟೆ"),
                Place("Tikota", "ತಿಕೋಟಾ"),
                Place("Chadchan", "ಚಡಚಣ"),
                Place("Kolhar", "ಕೊಲ್ಹಾರ"),
                Place("Devara Hippargi", " ದೇವರ ಹಿಪ್ಪರಗಿ")
            )
        ),
        District(
            districtEn = "Yadgir",
            districtKn = "ಯಾದಗಿರಿ",
            taluks = listOf(
                Place("Yadgir", "ಯಾದಗಿರಿ"),
                Place("Shahapur", "ಶಹಾಪುರ"),
                Place("Shorapur", "ಸುರಪುರ"),
                Place("Gurmatkal", "ಗುರುಮಠಕಲ್"),
                Place("Vadagera", "ವಡಗೇರಾ"),
                Place("Hunasagi", "ಹುಣಸಗಿ")
            )
        )
    ).map { it.copy(taluks = it.taluks.distinctBy { t -> t.en }.sortedBy { t -> t.en }) }
     .sortedBy { it.districtEn }
}
