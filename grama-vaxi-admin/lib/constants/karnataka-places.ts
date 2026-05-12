export interface Place {
  en: string;
  kn: string;
}

export interface District {
  districtEn: string;
  districtKn: string;
  taluks: Place[];
}

export const KARNATAKA_PLACES: District[] = [
  {
    districtEn: "Bagalkote",
    districtKn: "ಬಾಗಲಕೋಟೆ",
    taluks: [
      { en: "Bagalkote", kn: "ಬಾಗಲಕೋಟೆ" },
      { en: "Jamkhandi", kn: "ಜಮಖಂಡಿ" },
      { en: "Mudhol", kn: "ಮುಧೋಳ" },
      { en: "Badami", kn: "ಬಾದಾಮಿ" },
      { en: "Bilagi", kn: "ಬೀಳಗಿ" },
      { en: "Hungund", kn: "ಹುನಗುಂದ" },
      { en: "Ilkal", kn: "ಇಳಕಲ್ಲ" },
      { en: "Rabkavi Banhatti", kn: "ರಬಕವಿ ಬನಹಟ್ಟಿ" },
      { en: "Guledgudda", kn: "ಗುಳೇದಗುಡ್ಡ" }
    ]
  },
  {
    districtEn: "Ballari",
    districtKn: "ಬಳ್ಳಾರಿ",
    taluks: [
      { en: "Ballari", kn: "ಬಳ್ಳಾರಿ" },
      { en: "Sanduru", kn: "ಸಂಡೂರು" },
      { en: "Siruguppa", kn: "ಸಿರುಗುಪ್ಪ" },
      { en: "Kurugodu", kn: "ಕುರುಗೋಡು" }
    ]
  },
  {
    districtEn: "Belagavi",
    districtKn: "ಬೆಳಗಾವಿ",
    taluks: [
      { en: "Belagavi", kn: "ಬೆಳಗಾವಿ" },
      { en: "Athani", kn: "ಅಥಣಿ" },
      { en: "Bailhongal", kn: "ಬೈಲಹೊಂಗಲ" },
      { en: "Chikkodi", kn: "ಚಿಕ್ಕೋಡಿ" },
      { en: "Gokak", kn: "ಗೋಕಾಕ" },
      { en: "Khanapur", kn: "ಖಾನಾಪುರ" },
      { en: "Mudalgi", kn: "ಮೂಡಲಗಿ" },
      { en: "Nippani", kn: "ನಿಪ್ಪಾಣಿ" },
      { en: "Raybag", kn: "ರಾಯಬಾಗ" },
      { en: "Savadatti", kn: "ಸವದತ್ತಿ" },
      { en: "Ramdurg", kn: "ರಾಮದುರ್ಗ" },
      { en: "Kagawada", kn: "ಕಾಗವಾಡ" },
      { en: "Hukkeri", kn: "ಹುಕ್ಕೇರಿ" },
      { en: "Kittur", kn: "ಕಿತ್ತೂರು" }
    ]
  },
  {
    districtEn: "Bengaluru Rural",
    districtKn: "ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ",
    taluks: [
      { en: "Devanahalli", kn: "ದೇವನಹಳ್ಳಿ" },
      { en: "Doddaballapura", kn: "ದೊಡ್ಡಬಳ್ಳಾಪುರ" },
      { en: "Hosakote", kn: "ಹೊಸಕೋಟೆ" },
      { en: "Nelamangala", kn: "ನೆಲಮಂಗಲ" }
    ]
  },
  {
    districtEn: "Bengaluru Urban",
    districtKn: "ಬೆಂಗಳೂರು ನಗರ",
    taluks: [
      { en: "Bengaluru North", kn: "ಬೆಂಗಳೂರು ಉತ್ತರ" },
      { en: "Bengaluru East", kn: "ಬೆಂಗಳೂರು ಪೂರ್ವ" },
      { en: "Bengaluru South", kn: "ಬೆಂಗಳೂರು ದಕ್ಷಿಣ" },
      { en: "Anekal", kn: "ಆನೇಕಲ್" },
      { en: "Yelahanka", kn: "ಯಲಹಂಕ" }
    ]
  },
  {
    districtEn: "Bidar",
    districtKn: "ಬೀದರ್",
    taluks: [
      { en: "Bidar", kn: "ಬೀದರ್" },
      { en: "Bhalki", kn: "ಭಾಲ್ಕಿ" },
      { en: "Aurad", kn: "ಔರಾದ್" },
      { en: "Basavakalyan", kn: "ಬಸವಕಲ್ಯಾಣ" },
      { en: "Hulsoor", kn: "ಹುಲಸೂರು" },
      { en: "Humanabad", kn: "ಹುಮ್ನಾಬಾದ್" },
      { en: "Kamalnagar", kn: "ಕಮಲಾನಗರ" }
    ]
  },
  {
    districtEn: "Chamarajanagar",
    districtKn: "ಚಾಮರಾಜನಗರ",
    taluks: [
      { en: "Chamarajanagar", kn: "ಚಾಮರಾಜನಗರ" },
      { en: "Gundlupet", kn: "ಗುಂಡ್ಲುಪೇಟೆ" },
      { en: "Kollegal", kn: "ಕೊಳ್ಳೇಗಾಲ" },
      { en: "Yelandur", kn: "ಯಳಂದೂರು" },
      { en: "Hanur", kn: "ಹನೂರು" }
    ]
  },
  {
    districtEn: "Chikkaballapura",
    districtKn: "ಚಿಕ್ಕಬಳ್ಳಾಪುರ",
    taluks: [
      { en: "Chikkaballapura", kn: "ಚಿಕ್ಕಬಳ್ಳಾಪುರ" },
      { en: "Bagepalli", kn: "ಬಾಗೇಪಲ್ಲಿ" },
      { en: "Chintamani", kn: "ಚಿಂತಾಮಣಿ" },
      { en: "Gauribidanur", kn: "ಗೌರಿಬಿದನೂರು" },
      { en: "Gudibanda", kn: "ಗುಡಿಬಂಡೆ" },
      { en: "Sidlaghatta", kn: "ಶಿಡ್ಲಘಟ್ಟ" },
      { en: "Chelur", kn: "ಚೇಲೂರು" }
    ]
  },
  {
    districtEn: "Chikkamagaluru",
    districtKn: "ಚಿಕ್ಕಮಗಳೂರು",
    taluks: [
      { en: "Chikkamagaluru", kn: "ಚಿಕ್ಕಮಗಳೂರು" },
      { en: "Kadur", kn: "ಕಡೂರು" },
      { en: "Koppa", kn: "ಕೊಪ್ಪ" },
      { en: "Mudigere", kn: "ಮೂಡಿಗೆರೆ" },
      { en: "Narasimharajapura", kn: "ನರಸಿಂಹರಾಜಪುರ" },
      { en: "Sringeri", kn: "ಶೃಂಗೇರಿ" },
      { en: "Tarikere", kn: "ತರೀಕೆರೆ" },
      { en: "Ajjampura", kn: "ಅಜ್ಜಂಪುರ" },
      { en: "Kalasa", kn: "ಕಳಸ" }
    ]
  },
  {
    districtEn: "Chitradurga",
    districtKn: "ಚಿತ್ರದುರ್ಗ",
    taluks: [
      { en: "Chitradurga", kn: "ಚಿತ್ರದುರ್ಗ" },
      { en: "Challakere", kn: "ಚಳ್ಳಕೆರೆ" },
      { en: "Hiriyur", kn: "ಹಿರಿಯೂರು" },
      { en: "Holalkere", kn: "ಹೊಳಲ್ಕೆರೆ" },
      { en: "Hosadurga", kn: "ಹೊಸದುರ್ಗ" },
      { en: "Molakalmuru", kn: "ಮೊಳಕಾಲ್ಮೂರು" }
    ]
  },
  {
    districtEn: "Dakshina Kannada",
    districtKn: "ದಕ್ಷಿಣ ಕನ್ನಡ",
    taluks: [
      { en: "Mangaluru", kn: "ಮಂಗಳೂರು" },
      { en: "Ullal", kn: "ಉಳ್ಳಾಲ" },
      { en: "Mulki", kn: "ಮುಲ್ಕಿ" },
      { en: "Moodabidri", kn: "ಮೂಡುಬಿದಿರೆ" },
      { en: "Bantwal", kn: "ಬಂಟ್ವಾಳ" },
      { en: "Belthangady", kn: "ಬೆಳ್ತಂಗಡಿ" },
      { en: "Puttur", kn: "ಪುತ್ತೂರು" },
      { en: "Sullia", kn: "ಸುಳ್ಯ" },
      { en: "Kadaba", kn: "ಕಡಬ" }
    ]
  },
  {
    districtEn: "Davanagere",
    districtKn: "ದಾವಣಗೆರೆ",
    taluks: [
      { en: "Davanagere", kn: "ದಾವಣಗೆರೆ" },
      { en: "Channagiri", kn: "ಚನ್ನಗಿರಿ" },
      { en: "Harihara", kn: "ಹರಿಹರ" },
      { en: "Honnali", kn: "ಹೊನ್ನಾಳಿ" },
      { en: "Jagalur", kn: "ಜಗಳೂರು" },
      { en: "Nyamathi", kn: "ನ್ಯಾಮತಿ" }
    ]
  },
  {
    districtEn: "Dharwad",
    districtKn: "ಧಾರವಾಡ",
    taluks: [
      { en: "Dharwad", kn: "ಧಾರವಾಡ" },
      { en: "Hubballi City", kn: "ಹುಬ್ಬಳ್ಳಿ ನಗರ" },
      { en: "Hubballi Rural", kn: "ಹುಬ್ಬಳ್ಳಿ ಗ್ರಾಮೀಣ" },
      { en: "Kalghatgi", kn: "ಕಲಘಟಗಿ" },
      { en: "Kundgol", kn: "ಕುಂದಗೋಳ" },
      { en: "Navalgund", kn: "ನವಲಗುಂದ" },
      { en: "Annigeri", kn: "ಅಣ್ಣಿಗೇರಿ" },
      { en: "Alnavar", kn: "ಅಳ್ನಾವರ" }
    ]
  },
  {
    districtEn: "Gadag",
    districtKn: "ಗದಗ",
    taluks: [
      { en: "Gadag", kn: "ಗದಗ" },
      { en: "Ron", kn: "ರೋಣ" },
      { en: "Shirahatti", kn: "ಶಿರಹಟ್ಟಿ" },
      { en: "Nargund", kn: "ನರಗುಂದ" },
      { en: "Mundargi", kn: "ಮುಂಡರಗಿ" },
      { en: "Lakshmeshwar", kn: "ಲಕ್ಷ್ಮೇಶ್ವರ" },
      { en: "Gajendragad", kn: "ಗಜೇಂದ್ರಗಡ" }
    ]
  },
  {
    districtEn: "Hassan",
    districtKn: "ಹಾಸನ",
    taluks: [
      { en: "Hassan", kn: "ಹಾಸನ" },
      { en: "Arasikere", kn: "ಅರಸೀಕೆರೆ" },
      { en: "Channarayapatna", kn: "ಚನ್ನರಾಯಪಟ್ಟಣ" },
      { en: "Holenarsipura", kn: "ಹೊಳೆನರಸೀಪುರ" },
      { en: "Sakleshpura", kn: "ಸಕಲೇಶಪುರ" },
      { en: "Alur", kn: "ಆಲೂರು" },
      { en: "Arakalagud", kn: "ಅರಕಲಗೂಡು" },
      { en: "Belur", kn: "ಬೇಲೂರು" }
    ]
  },
  {
    districtEn: "Haveri",
    districtKn: "ಹಾವೇರಿ",
    taluks: [
      { en: "Haveri", kn: "ಹಾವೇರಿ" },
      { en: "Byadgi", kn: "ಬ್ಯಾಡಗಿ" },
      { en: "Hirekerur", kn: "ಹಿರೇಕೆರೂರು" },
      { en: "Ranibennur", kn: "ರಾಣೇಬೆನ್ನೂರು" },
      { en: "Savanur", kn: "ಸವಣೂರು" },
      { en: "Shiggaon", kn: "ಶಿಗ್ಗಾಂವಿ" },
      { en: "Hangal", kn: "ಹಾನಗಲ್" },
      { en: "Ratnagiri", kn: "ರತ್ನಗಿರಿ" }
    ]
  },
  {
    districtEn: "Kalaburagi",
    districtKn: "ಕಲಬುರಗಿ",
    taluks: [
      { en: "Kalaburagi", kn: "ಕಲಬುರಗಿ" },
      { en: "Afzalpur", kn: "ಅಫಜಲಪುರ" },
      { en: "Aland", kn: "ಆಳಂದ" },
      { en: "Chincholi", kn: "ಚಿಂಚೋಳಿ" },
      { en: "Chittapur", kn: "ಚಿತ್ತಾಪುರ" },
      { en: "Jevargi", kn: "ಜೇವರ್ಗಿ" },
      { en: "Sedam", kn: "ಸೇಡಂ" },
      { en: "Kamalapur", kn: "ಕಮಲಾಪುರ" },
      { en: "Shahabad", kn: "ಶಹಾಬಾದ್" },
      { en: "Kalgi", kn: "ಕಳಗಿ" },
      { en: "Yedrami", kn: "ಯಡ್ರಾಮಿ" }
    ]
  },
  {
    districtEn: "Kodagu",
    districtKn: "ಕೊಡಗು",
    taluks: [
      { en: "Madikeri", kn: "ಮಡಿಕೇರಿ" },
      { en: "Somvarpet", kn: "ಸೋಮವಾರಪೇಟೆ" },
      { en: "Virajpet", kn: "ವಿರಾಜಪೇಟೆ" },
      { en: "Kushalnagar", kn: "ಕುಶಾಲನಗರ" },
      { en: "Ponnampet", kn: "ಪೊನ್ನಂಪೇಟೆ" }
    ]
  },
  {
    districtEn: "Kolar",
    districtKn: "ಕೋಲಾರ",
    taluks: [
      { en: "Kolar", kn: "ಕೋಲಾರ" },
      { en: "Bangarapet", kn: "ಬಂಗಾರಪೇಟೆ" },
      { en: "Malur", kn: "ಮಾಲೂರು" },
      { en: "Mulbagal", kn: "ಮುಳಬಾಗಿಲು" },
      { en: "Srinivaspur", kn: "ಶ್ರೀನಿವಾಸಪುರ" },
      { en: "KGF", kn: "ಕೆಜಿಎಫ್" }
    ]
  },
  {
    districtEn: "Koppal",
    districtKn: "ಕೊಪ್ಪಳ",
    taluks: [
      { en: "Koppal", kn: "ಕೊಪ್ಪಳ" },
      { en: "Gangavathi", kn: "ಗಂಗಾವತಿ" },
      { en: "Kushtagi", kn: "ಕುಷ್ಟಗಿ" },
      { en: "Yelburga", kn: "ಯಲಬುರ್ಗಾ" },
      { en: "Kanakagiri", kn: "ಕನಕಗಿರಿ" },
      { en: "Karatagi", kn: "ಕಾರಟಗಿ" },
      { en: "Kukanoor", kn: "ಕುಕನೂರು" }
    ]
  },
  {
    districtEn: "Mandya",
    districtKn: "ಮಂಡ್ಯ",
    taluks: [
      { en: "Mandya", kn: "ಮಂಡ್ಯ" },
      { en: "Maddur", kn: "ಮದ್ದೂರು" },
      { en: "Malavalli", kn: "ಮಳವಳ್ಳಿ" },
      { en: "Nagamangala", kn: "ನಾಗಮಂಗಲ" },
      { en: "Pandavapura", kn: "ಪಾಂಡವಪುರ" },
      { en: "Krishnarajpet", kn: "ಕೃಷ್ಣರಾಜಪೇಟೆ" },
      { en: "Shrirangapattana", kn: "ಶ್ರೀರಂಗಪಟ್ಟಣ" }
    ]
  },
  {
    districtEn: "Mysuru",
    districtKn: "ಮೈಸೂರು",
    taluks: [
      { en: "Mysuru", kn: "ಮೈಸೂರು" },
      { en: "Hunsur", kn: "ಹುಣಸೂರು" },
      { en: "K.R. Nagar", kn: "ಕೆ.ಆರ್. ನಗರ" },
      { en: "Nanjangud", kn: "ನಂಜನಗೂಡು" },
      { en: "Piriyapatna", kn: "ಪಿರಿಯಾಪಟ್ಟಣ" },
      { en: "T. Narasipur", kn: "ಟಿ. ನರಸೀಪುರ" },
      { en: "Heggadadevana Kote", kn: "ಹೆಚ್.ಡಿ. ಕೋಟೆ" },
      { en: "Saligrama", kn: "ಸಾಲಿಗ್ರಾಮ" }
    ]
  },
  {
    districtEn: "Raichur",
    districtKn: "ರಾಯಚೂರು",
    taluks: [
      { en: "Raichur", kn: "ರಾಯಚೂರು" },
      { en: "Devadurga", kn: "ದೇವದುರ್ಗ" },
      { en: "Lingasugur", kn: "ಲಿಂಗಸಗೂರು" },
      { en: "Manvi", kn: "ಮಾನ್ವಿ" },
      { en: "Sindhanur", kn: "ಸಿಂಧನೂರು" },
      { en: "Maski", kn: "ಮಸ್ಕಿ" },
      { en: "Sirwar", kn: "ಸಿರವಾರ" }
    ]
  },
  {
    districtEn: "Ramanagara",
    districtKn: "ರಾಮನಗರ",
    taluks: [
      { en: "Ramanagara", kn: "ರಾಮನಗರ" },
      { en: "Channapatna", kn: "ಚನ್ನಪಟ್ಟಣ" },
      { en: "Kanakapura", kn: "ಕನಕಪುರ" },
      { en: "Magadi", kn: "ಮಾಗಡಿ" },
      { en: "Harohalli", kn: "ಹಾರೋಹಳ್ಳಿ" }
    ]
  },
  {
    districtEn: "Shivamogga",
    districtKn: "ಶಿವಮೊಗ್ಗ",
    taluks: [
      { en: "Shivamogga", kn: "ಶಿವಮೊಗ್ಗ" },
      { en: "Bhadravathi", kn: "ಭದ್ರಾವತಿ" },
      { en: "Hosanagara", kn: "ಹೊಸನಗರ" },
      { en: "Sagar", kn: "ಸಾಗರ" },
      { en: "Shikaripur", kn: "ಶಿಕಾರಿಪುರ" },
      { en: "Soraba", kn: "ಸೊರಬ" },
      { en: "Thirthahalli", kn: "ತೀರ್ಥಹಳ್ಳಿ" }
    ]
  },
  {
    districtEn: "Tumakuru",
    districtKn: "ತುಮಕೂರು",
    taluks: [
      { en: "Tumakuru", kn: "ತುಮಕೂರು" },
      { en: "Chiknayakanahalli", kn: "ಚಿಕ್ಕನಾಯಕನಹಳ್ಳಿ" },
      { en: "Gubbi", kn: "ಗುಬ್ಬಿ" },
      { en: "Koratagere", kn: "ಕೊರಟಗೆರೆ" },
      { en: "Kunigal", kn: "ಕುಣಿಗಲ್" },
      { en: "Madhugiri", kn: "ಮಧುಗಿರಿ" },
      { en: "Pavagada", kn: "ಪಾವಗಡ" },
      { en: "Sira", kn: "ಸಿರಾದ" },
      { en: "Tiptur", kn: "ತಿಪಟೂರು" },
      { en: "Turuvekere", kn: "ತುರುವೇಕೆರೆ" }
    ]
  },
  {
    districtEn: "Udupi",
    districtKn: "ಉಡುಪಿ",
    taluks: [
      { en: "Udupi", kn: "ಉಡುಪಿ" },
      { en: "Karkala", kn: "ಕಾರ್ಕಳ" },
      { en: "Kundapura", kn: "ಕುಂದಾಪುರ" },
      { en: "Brahmavara", kn: "ಬ್ರಹ್ಮಾವರ" },
      { en: "Byndoor", kn: "ಬೈಂದೂರು" },
      { en: "Hebri", kn: "ಹೆಬ್ರಿ" },
      { en: "Kapu", kn: "ಕಾಪು" }
    ]
  },
  {
    districtEn: "Uttara Kannada",
    districtKn: "ಉತ್ತರ ಕನ್ನಡ",
    taluks: [
      { en: "Karwar", kn: "ಕಾರವಾರ" },
      { en: "Ankola", kn: "ಅಂಕೋಲಾ" },
      { en: "Bhatkal", kn: "ಭಟ್ಕಳ" },
      { en: "Haliyal", kn: "ಹಳಿಯಾಳ" },
      { en: "Honnavar", kn: "ಹೊನ್ನಾವರ" },
      { en: "Joida", kn: "ಜೋಯಿಡಾ" },
      { en: "Kumta", kn: "ಕುಮಟಾ" },
      { en: "Mundgod", kn: "ಮುಂಡಗೋಡ" },
      { en: "Siddapur", kn: "ಸಿದ್ದಾಪುರ" },
      { en: "Sirsi", kn: "ಶಿರಸಿ" },
      { en: "Yellapur", kn: "ಯಲ್ಲಾಪುರ" },
      { en: "Dandeli", kn: "ದಾಂಡೇಲಿ" }
    ]
  },
  {
    districtEn: "Vijayanagara",
    districtKn: "ವಿಜಯನಗರ",
    taluks: [
      { en: "Hosapete", kn: "ಹೊಸಪೇಟೆ" },
      { en: "Kampli", kn: "ಕಂಪ್ಲಿ" },
      { en: "Hagaribommanahalli", kn: "ಹಗರಿಬೊಮ್ಮನಹಳ್ಳಿ" },
      { en: "Kottur", kn: "ಕೊಟ್ಟೂರು" },
      { en: "Hadagali", kn: "ಹಡಗಲಿ" },
      { en: "Harapanahalli", kn: "ಹರಪನಹಳ್ಳಿ" }
    ]
  },
  {
    districtEn: "Vijayapura",
    districtKn: "ವಿಜಯಪುರ",
    taluks: [
      { en: "Vijayapura", kn: "ವಿಜಯಪುರ" },
      { en: "Basavana Bagevadi", kn: "ಬಸವನ ಬಾಗೇವಾಡಿ" },
      { en: "Indi", kn: "ಇಂಡಿ" },
      { en: "Muddebihal", kn: "ಮುದ್ದೇಬಿಹಾಳ" },
      { en: "Sindagi", kn: "ಸಿಂದಗಿ" },
      { en: "Babaleshwar", kn: "ಬಬಲೇಶ್ವರ" },
      { en: "Talikote", kn: "ತಾಳಿಕೋಟೆ" },
      { en: "Tikota", kn: "ತಿಕೋಟಾ" },
      { en: "Chadchan", kn: "ಚಡಚಣ" },
      { en: "Kolhar", kn: "ಕೊಲ್ಹಾರ" },
      { en: "Devara Hippargi", kn: " ದೇವರ ಹಿಪ್ಪರಗಿ" }
    ]
  },
  {
    districtEn: "Yadgir",
    districtKn: "ಯಾದಗಿರಿ",
    taluks: [
      { en: "Yadgir", kn: "ಯಾದಗಿರಿ" },
      { en: "Shahapur", kn: "ಶಹಾಪುರ" },
      { en: "Shorapur", kn: "ಸುರಪುರ" },
      { en: "Gurmatkal", kn: "ಗುರುಮಠಕಲ್" },
      { en: "Vadagera", kn: "ವಡಗೇರಾ" },
      { en: "Hunasagi", kn: "ಹುಣಸಗಿ" }
    ]
  }
];
