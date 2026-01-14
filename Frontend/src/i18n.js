// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "Product Categories": "Product Categories",
      "Browse by category to quickly find food, crafts, fashion, and more from local vendors.":
        "Browse by category to quickly find food, crafts, fashion, and more from local vendors.",
      "Street Markets": "Street Markets",
      "Filter by distance, ratings, what’s open now, and tags to find the perfect market to visit.":
        "Filter by distance, ratings, what’s open now, and tags to find the perfect market to visit.",
      "Filters": "Filters",
      "Distance": "Distance",
      "Any": "Any",
      "Rating": "Rating",
      "Open Only": "Open Only",
      "Tags": "Tags",
      "Reset": "Reset",
      "Apply": "Apply",
      "Enabled": "Enabled",
      "Disabled": "Disabled",
    },
  },
  ms: {
    translation: {
      "Product Categories": "Kategori Produk",
      "Browse by category to quickly find food, crafts, fashion, and more from local vendors.":
        "Semak mengikut kategori untuk mencari makanan, kraftangan, fesyen, dan banyak lagi daripada peniaga tempatan.",
      "Street Markets": "Pasar Jalanan",
      "Filter by distance, ratings, what’s open now, and tags to find the perfect market to visit.":
        "Tapis mengikut jarak, penilaian, yang dibuka sekarang, dan tag untuk mencari pasar yang sesuai untuk dikunjungi.",
      "Filters": "Penapis",
      "Distance": "Jarak",
      "Any": "Bebas",
      "Markets": "Tamu",
      "Products": "Produk",
      "Rating": "Penilaian",
      "Open Only": "Hanya Dibuka",
      "Tags": "Tag",
      "Reset": "Set Semula",
      "Apply": "Terapkan",
      "Enabled": "Dihidupkan",
      "Disabled": "Dimatikan",
      "Your Tamu Adventure": "Pengembaraan Tamu Anda",
        "Starts Here": "Bermula Di Sini",
        "Learn More": "Ketahui Lebih Lanjut",
        "Explore Now": "Jelajah Sekarang",
        "Features": "Ciri-ciri",
        "Find nearby markets": "Cari pasar berdekatan",
        "Navigate easily": "Navigasi dengan mudah",
        "Engage with others": "Berinteraksi dengan komuniti",
        "By the Numbers": "Statistik",
        "Vendors": "Peniaga",
        "Organizers": "Penganjur",
        "Join as Vendor": "Sertai sebagai Peniaga",
        "Start as Organizer": "Mula sebagai Penganjur",
        "Ready to Explore?": "Bersedia untuk Meneroka?",
        "All rights reserved.": "Hak cipta terpelihara.",
        "Discover street markets near you in Kota Kinabalu—check what’s happening today, navigate easily, and plan your visit before you arrive.":"Temui pasar jalanan berhampiran anda di Kota Kinabalu—semak apa yang berlaku hari ini, navigasi dengan mudah dan rancang lawatan anda sebelum anda tiba.",
"Designed for visitors exploring Kota Kinabalu": "Direka bentuk untuk pelawat meneroka Kota Kinabalu",
"Find the best Tamu nearby, see what’s live right now, and plan your route before you head out.":"Cari Tamu terbaik berdekatan, lihat tamu yang sudah mula dan rancang laluan anda sebelum anda keluar.",
"See Tamu around you with distance and open/close times at a glance.":"Lihat Tamu di sekeliling anda dengan jarak dan masa buka/tutup dengan sepintas lalu.",
"One-tap directions to markets, optimized for walking or driving.": "Arah satu ketik ke pasar, dioptimumkan untuk berjalan kaki atau memandu.",
 "Share your posts, tips, and join forum discussions with other market-goers.":"Kongsi siaran, petua anda dan sertai perbincangan forum dengan pengunjung pasaran yang lain.",
 "A thriving community of markets, vendors, and products": "Komuniti pasaran, vendor dan produk yang berkembang maju",
 "Real-time snapshots of Tamukinabalu’s ecosystem—growing every day to help visitors discover, vendors thrive, and organizers succeed.":"Gambar masa nyata ekosistem Tamukinabalu—berkembang setiap hari untuk membantu pelawat menemui, vendor berkembang maju dan penganjur berjaya.",
 "Partner with Tamukinabalu": "Bekerjasama dengan Tamukinabalu",
 "Grow your presence as a Vendor or Organizer":"Tingkatkan tarikan anda sebagai Vendor atau Penganjur",
 "Showcase products, manage applications, and run smoother events with our tools built for local markets.": "Pamerkan produk, urus aplikasi dan jalankan acara yang lebih lancar dengan alatan kami yang dibina untuk pasaran tempatan.",
 "Apply to markets and secure spots": "Daftar ke Tamu dan tempah tempat",
 "Showcase products and offers": "Tunjukkan produk dan tawaran",
 "Engage with visitors directly": "Berhubung dengan pelawat secara langsung",
 "Create and manage market events": "Buat dan urus pasar",
 "Approve vendors and assign slots": "Luluskan vendor dan tetapkan slot",
 "Track performance and attendance":"Dapatkan prestasi dan kehadiran",
 "Jump into Kota Kinabalu’s street markets and start your adventure today.": "Pergi ke pasar jalanan Kota Kinabalu dan mulakan pengembaraan anda hari ini.",
 "Browse food, crafts, fashion, and more from local vendors by category.":"Cari makanan, kraf, fesyen dan banyak lagi daripada vendor tempatan mengikut kategori",
 "Explore nearby street markets and tamu. Filter by distance, rating, and availability.":"Terokai pasar jalanan dan tamu yang berdekatan. Tapis mengikut jarak, penilaian dan ketersediaan.",
 "Fresh Produce":"Barangan Segar",
 "Street Food":"Makanan Jalan",
 "Snacks & Drinks": "Jajan & Minuman",
 "Clothing": "Pakaian",
 "Handicrafts": "Kraftangan",
 "Fruits": "Buah",
 "Seafood": "Makanan Laut",
 "Performance": "Persembahan"
},
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
