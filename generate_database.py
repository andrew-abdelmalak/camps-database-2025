"""
Camps Database Generator - Enhanced Mobile-First Version
Features:
- Mobile-first design (iPhone 16 Pro optimized)
- Photo carousel with navigation buttons
- Smart data visibility (hides empty sections)
- VCF contact names integrated
- All available images mapped
- Location filter
"""
import os
import shutil
import re
from pathlib import Path

# Configuration
BASE_DIR = Path(r"c:\Users\G14\Downloads\لجنة معسكرات ٢٠٢٥")
OUTPUT_DIR = BASE_DIR / "camps_database"
IMAGES_DIR = OUTPUT_DIR / "images"

# Create directories
OUTPUT_DIR.mkdir(exist_ok=True)
IMAGES_DIR.mkdir(exist_ok=True)

# VCF Extracted Contacts
VCF_CONTACTS = {
    "سان جورج": {"name": "Basem Maher", "name_ar": "باسم ماهر", "phone": "01273006637"},
    "بيت السيدة العذراء ويوسف النجار": {"name": "Karam", "name_ar": "كرم", "phone": "01274613660"},
    "تيجي لاند": {"name": "Ibrahim Eissa", "name_ar": "إبراهيم عيسى", "phone": "01227334146"},
}

# Scan for all image files
def find_all_images():
    """Build a map of image IDs to full filenames"""
    image_map = {}
    for ext in ['jpg', 'jpeg', 'png']:
        for file in BASE_DIR.glob(f"*.{ext}"):
            if '-PHOTO-' in file.name:  # Only photo files, not stickers
                try:
                    file_id = file.name.split('-')[0]
                    image_map[file_id] = file.name
                except:
                    continue
    return image_map

IMAGE_MAP = find_all_images()
print(f"Found {len(IMAGE_MAP)} photos")

# Distance from Madinaty Church (كنيسة العذراء ومارجرجس بمدينتي)
# Approximate distances in km for sorting
LOCATION_DISTANCES = {
    "الشروق": 10,          # Closest - same area
    "العبور": 15,          # Very close
    "عرابي": 20,           # Close
    "المقطم": 25,          # Cairo area
    "طريق السويس": 30,     # Suez Road
    "الإسماعيلية": 90,     # Suez Canal area
    "السويس": 120,         # Suez city
    "فايد": 130,           # Near Suez
    "السخنة": 100,         # Ain Sokhna
    "وادي النطرون": 120,   # North
    "مدينة السادات": 100,  # Sadat City
    "أبو تلات": 250,       # Alexandria area
    "سيدي كرير": 280,      # Near Alexandria
    "كينج مريوط": 260,     # Near Alexandria
    "العلمين": 300,        # Far west
    "الريف الأوروبي": 150, # Countryside
    "راس سدر": 250,        # Sinai
    "بورفؤاد": 180,        # Port Said area
    "الفيوم": 130,         # Southwest
    "غير محدد": 999,       # Unknown - at end
}

# Enhanced venue data with more images and VCF contacts
venues = [
    {
        "name": "بيت السيدة العذراء ويوسف النجار",
        "location": "طريق السويس",
        "loc_class": "suez",
        "phones": [{"num": "01274613660", "name": "كرم"}, {"num": "01223716388", "name": ""}],
        "links": {"maps": "https://g.co/kgs/Xn9w4VL"},
        "night_price": "٦٠ جنيه/فرد",
        "capacity": "~١٢٠ فرد",
        "amenities": ["🏕️ أرض معسكر", "🍳 مطبخ", "🚿 حمامات", "⛪ كنيسة", "🛏️ غرف"],
        "status": "booked",
        "visited": "31/01/2025",
        "notes": "✅ تم الحجز والدفع 15/2/2025. البيت مقفول علينا.",
        "details": "مواعيد المعسكرات: 9-11، 11-13، 17-19، 24-26 يوليو، 31/7-2/8.",
        "image_ids": ["00000584", "00000585", "00000588", "00000590", "00000591", "00000780", "00000816", "00000817", "00000818", "00000819", "00000820", "00000854", "00002042", "00002043", "00002044", "00002045", "00002046", "00002047", "00002048", "00002049", "00002050"]
    },
    {
        "name": "بيت ايل",
        "location": "العبور",
        "loc_class": "obour",
        "phones": [{"num": "022156403", "name": ""}, {"num": "01212333360", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/bqUwRP8v69MBB8sd/"},
        "night_price": "٣٢٠ جنيه", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "دار الينبوع",
        "location": "العبور",
        "loc_class": "obour",
        "phones": [{"num": "01274899155", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/QtrTZz7YF3LyGMWe/"},
        "night_price": "", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت جبل الزيتون",
        "location": "العبور",
        "loc_class": "obour",
        "phones": [{"num": "01226699502", "name": ""}],
        "links": {"maps": "https://g.co/kgs/xq3qKSQ"},
        "night_price": "", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "فيلا بارادايس (فري بيرد)",
        "location": "العبور",
        "loc_class": "obour",
        "phones": [{"num": "01222719622", "name": "سامح"}],
        "links": {"fb": "https://www.facebook.com/share/uXYnCy6CKRzhDxqk/", "maps": "https://g.co/kgs/1ey12Q9"},
        "night_price": "", "capacity": "",
        "amenities": ["🏕️ نجيلة"],
        "status": "visited", "visited": "25/01/2025",
        "notes": "تمت الزيارة. فيلا تبع مزرعة البطل - كلها نجيلة وصغيرة.",
        "details": "", "image_ids": []
    },
    {
        "name": "بيت مارمرقس شبرا",
        "location": "العبور",
        "loc_class": "obour",
        "phones": [{"num": "022050550", "name": ""}, {"num": "01001525291", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/vJ4KdswQhWbGShFy/"},
        "night_price": "", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "مزرعة البطل",
        "location": "العبور",
        "loc_class": "obour",
        "phones": [{"num": "01271880404", "name": ""}, {"num": "01228377877", "name": ""}],
        "links": {"fb": "https://www.facebook.com/batalfarm", "maps": "https://maps.google.com/?q=30.180628,31.546387"},
        "night_price": "١٥٠ جنيه شامل", "capacity": "",
        "amenities": ["🏕️ أرضين معسكر", "🍳 مطبخ", "⚽ ملاعب", "🏛️ قاعات"],
        "status": "visited", "visited": "25/01/2025",
        "notes": "فيه أرضين (كبيرة+صغيرة). سعر أحسن من مزرعة الأحلام. البيت يتقفل علينا.",
        "details": "",
        "image_ids": ["00000176", "00000177", "00000178", "00000179", "00000180", "00000181", "00000182", "00000183", "00000184", "00000185", "00000186", "00000187", "00000188", "00000189", "00000190", "00000191", "00000192", "00000193", "00000194", "00000195", "00000196"]
    },
    {
        "name": "بيت الملكة",
        "location": "العبور",
        "loc_class": "obour",
        "phones": [{"num": "01228806633", "name": ""}],
        "links": {"fb": "https://www.facebook.com/profile.php?id=100057503557049"},
        "night_price": "", "capacity": "",
        "amenities": [],
        "status": "rejected",
        "notes": "❌ مفيش أرض تخييم. كان كاتب معسكرات كشفية لكن اتضح لا.",
        "details": "تم التواصل 22/1/2025", "image_ids": []
    },
    {
        "name": "فيلا البشارة",
        "location": "العبور",
        "loc_class": "obour",
        "phones": [{"num": "01271170120", "name": ""}],
        "links": {},
        "night_price": "", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت الواحة",
        "location": "العبور",
        "loc_class": "obour",
        "phones": [{"num": "01206645317", "name": ""}],
        "links": {},
        "night_price": "", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت فاونتن جيت",
        "location": "العبور",
        "loc_class": "obour",
        "phones": [{"num": "01225970971", "name": "بولس"}, {"num": "01273606106", "name": "سارة"}],
        "links": {"page": "https://goo.gl/7EoVgZ"},
        "night_price": "", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "سمعان الخراز",
        "location": "وادي النطرون",
        "loc_class": "natroun",
        "phones": [{"num": "01222722893", "name": ""}, {"num": "01022399299", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/xZsfWHGJhCj9Pe6E/"},
        "night_price": "٤٥٠ جنيه", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت الوادي",
        "location": "وادي النطرون",
        "loc_class": "natroun",
        "phones": [{"num": "01289673151", "name": ""}, {"num": "01228193523", "name": ""}],
        "links": {"fb": "https://www.facebook.com/kdecwadi"},
        "night_price": "", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "الواحة فكر&واعمل",
        "location": "وادي النطرون",
        "loc_class": "natroun",
        "phones": [{"num": "01229463060", "name": "للمؤتمرات"}, {"num": "01273395268", "name": "للرحلات"}],
        "links": {"fb": "https://www.facebook.com/share/Kp7zqEK4P2uDpgtS/"},
        "night_price": "", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت آدم (عزبة آدم)",
        "location": "وادي النطرون",
        "loc_class": "natroun",
        "phones": [{"num": "022406857", "name": ""}],
        "links": {"maps": "https://g.co/kgs/jPy8D9w"},
        "night_price": "١٥٠ خيام / ٢٠٠ غرف", "capacity": "",
        "amenities": ["🏕️ مساحة كبيرة للمعسكرات", "🍳 مطبخ ٧٥٠ج/يوم"],
        "status": "available", "visited": "",
        "notes": "أسعار الشتاء - الصيف +٥٠ جنيه. مش هيقفل البيت علينا.",
        "details": "", "image_ids": []
    },
    {
        "name": "بيت مارمرقس أبو تلات",
        "location": "أبو تلات",
        "loc_class": "abutalat",
        "phones": [{"num": "024855093", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/KueUpoTwynKBZD2W/"},
        "night_price": "", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "القديسة فيرينا",
        "location": "أبو تلات",
        "loc_class": "abutalat",
        "phones": [{"num": "026334433", "name": ""}, {"num": "026342538", "name": ""}],
        "links": {"maps": "https://g.co/kgs/nBjD2Jq"},
        "night_price": "", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت القديسة مارينا",
        "location": "أبو تلات",
        "loc_class": "abutalat",
        "phones": [{"num": "01222178170", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/sqnAjkUKxSf9M1p7/"},
        "night_price": "", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت لورا",
        "location": "فايد",
        "loc_class": "fayed",
        "phones": [{"num": "01006545025", "name": ""}, {"num": "0643900305", "name": ""}],
        "links": {},
        "night_price": "", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت فيلو",
        "location": "فايد",
        "loc_class": "fayed",
        "phones": [{"num": "01202248999", "name": ""}, {"num": "01270154444", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/p/L2a27vWzobFfsRzw/"},
        "night_price": "", "capacity": "",
        "amenities": ["🌊 على البحر"],
        "status": "available", "visited": "",
        "notes": "على البحر - الخيم هتبقى على البحر.",
        "details": "", "image_ids": []
    },
    {
        "name": "فيلا الشهيد",
        "location": "فايد",
        "loc_class": "fayed",
        "phones": [{"num": "01228201107", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/UCEz1gnPBv676ZyQ/"},
        "night_price": "", "capacity": "١٨٠ جنيه day use",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت الفخاري",
        "location": "الشروق",
        "loc_class": "shorouk",
        "phones": [{"num": "01223184706", "name": "مهندس خليل"}, {"num": "01558600916", "name": ""}],
        "links": {"fb": "https://www.facebook.com/profile.php?id=100064404803880"},
        "night_price": "", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت ماري لاند",
        "location": "الشروق",
        "loc_class": "shorouk",
        "phones": [{"num": "01009000673", "name": ""}, {"num": "01280999395", "name": ""}],
        "links": {"maps": "https://g.co/kgs/XtrmRhB"},
        "night_price": "", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت أبونا يوسف أسعد",
        "location": "سيدي كرير",
        "loc_class": "other",
        "phones": [{"num": "01227231479", "name": ""}, {"num": "01224663289", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/KueUpoTwynKBZD2W/"},
        "night_price": "", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت أبو سيفين",
        "location": "سيدي كرير",
        "loc_class": "other",
        "phones": [{"num": "01223120986", "name": ""}],
        "links": {"maps": "https://maps.app.goo.gl/hAeYh1UYtdJnpep99"},
        "night_price": "", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت الملاك بجبل الزيتون",
        "location": "العلمين",
        "loc_class": "other",
        "phones": [{"num": "01273452322", "name": ""}],
        "links": {"fb": "https://www.facebook.com/groups/503217210335586/"},
        "night_price": "", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت مارجرجس سبورتنج",
        "location": "كينج مريوط",
        "loc_class": "other",
        "phones": [{"num": "01227392156", "name": "وديع"}],
        "links": {"page": "https://coptictourguide.com/ar/ads/5861a8453c53c/"},
        "night_price": "", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت الكرمة (دير كرمة الرسل)",
        "location": "مدينة السادات",
        "loc_class": "sadat",
        "phones": [{"num": "0129194667", "name": "إبراهيم"}],
        "links": {"fb": "https://www.facebook.com/share/p/1AiL17R3TJ/"},
        "night_price": "٧٥ جنيه غرف / ٤٠ جنيه أرض", "capacity": "",
        "amenities": ["🏕️ أرض معسكر", "🍳 مطبخ ٥٠٠ج", "🏊 حمام سباحة"],
        "status": "available", "visited": "",
        "notes": "البيت هيتقفل علينا ماعدا حمام السباحة. أقرب من وادي النطرون.",
        "details": "", "image_ids": []
    },
    {
        "name": "بيت مارجرجس بورفؤاد",
        "location": "بورفؤاد",
        "loc_class": "other",
        "phones": [{"num": "663457075", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/9NCjCAVFfzPL28ph/"},
        "night_price": "", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "قرية ماربنا",
        "location": "راس سدر",
        "loc_class": "other",
        "phones": [{"num": "01222769970", "name": "تاسوني مريم"}],
        "links": {},
        "night_price": "", "capacity": "",
        "amenities": ["🌊 بحر", "🏊 بيسين"],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت جمعية السامري الصالح",
        "location": "المقطم",
        "loc_class": "other",
        "phones": [{"num": "01288800295", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/Z9GxKQhHYp1qD1Mp/"},
        "night_price": "", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "مبيت باراديسوس آفا بافلي",
        "location": "الإسماعيلية",
        "loc_class": "suez",
        "phones": [{"num": "01203530370", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/v8qDctyDS1xnXWar/"},
        "night_price": "", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "فيلا الملاك (ستيلا دي ماري)",
        "location": "السخنة",
        "loc_class": "other",
        "phones": [{"num": "01211150393", "name": ""}, {"num": "01001525291", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/MC9ZB6ik252aboLE/"},
        "night_price": "", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "ريف كاراس",
        "location": "الريف الأوروبي",
        "loc_class": "other",
        "phones": [{"num": "01288150157", "name": ""}],
        "links": {"fb": "https://www.facebook.com/reefkaras"},
        "night_price": "١٧٥ جنيه", "capacity": "",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    # NEW from chat
    {
        "name": "سفينة النجاة",
        "location": "وادي النطرون",
        "loc_class": "natroun",
        "phones": [{"num": "01211150393", "name": "إبرام سليم"}],
        "links": {},
        "night_price": "", "capacity": "36 سرير",
        "amenities": ["⛪ كنيسة", "🏛️ قاعات", "⛱️ برجولات", "⚽ ملعب", "🏕️ أرض رملية", "🍳 مطبخ+شواية"],
        "status": "available", "visited": "",
        "notes": "بيت جديد - 500م من دير أنبا بيشوي. 6 غرف فندقية.",
        "details": "",
        "image_ids": ["00000496", "00000497", "00000498", "00000499", "00000500", "00000501", "00000502", "00000503", "00000504", "00000505", "00000506", "00000507"]
    },
    {
        "name": "واحة الصديق",
        "location": "غير محدد",
        "loc_class": "other",
        "phones": [],
        "links": {},
        "night_price": "١٠٠ج داخل / ٨٠ج خيمة", "capacity": "",
        "amenities": ["🍳 مطبخ مجهز", "🔥 شواية", "⚽ ملعب كرة", "⛱️ برجولا", "🏕️ أرض تخييم"],
        "status": "available", "visited": "",
        "notes": "شامل مطبخ مجهز وشواية وملعب كرة.",
        "details": "",
        "image_ids": ["00000011", "00000012", "00000013", "00000014", "00000015", "00000016", "00000017", "00000018", "00000019", "00000020", "00000021", "00000022", "00000023", "00000024", "00000025", "00000026", "00000027", "00000028", "00000029", "00000030", "00000031", "00000032", "00000033", "00000034", "00000035", "00000036", "00000037", "00000038"]
    },
    {
        "name": "أرض موسى",
        "location": "الفيوم",
        "loc_class": "other",
        "phones": [],
        "links": {"fb": "https://www.facebook.com/100088900820728/posts/130951656544861/", "maps": "https://maps.app.goo.gl/vD2QsLVF3vDQLmBu9"},
        "night_price": "١٠٠ جنيه/فرد", "capacity": "حتى 4000 فرد",
        "amenities": ["🏕️ أرض معسكرات فقط"],
        "status": "available", "visited": "",
        "notes": "4 فدان (~16,000م²). الخيم تبعنا. مفيش شيف.",
        "details": "",
        "image_ids": ["00000041"]
    },
    {
        "name": "تيجي لاند (Fun Valley)",
        "location": "العبور",
        "loc_class": "obour",
        "phones": [{"num": "01227334146", "name": "إبراهيم عيسى"}],
        "links": {},
        "night_price": "٢٠٠ جنيه شامل", "capacity": "",
        "amenities": ["🏕️ أرض كبيرة", "⛱️ برجولات", "🏛️ قاعات"],
        "status": "rejected", "visited": "",
        "notes": "❌ محجوز كل weekends يوليو 2025. متاح 3/4 + 17/18/19 فقط.",
        "details": "",
        "image_ids": []
    },
    {
        "name": "سان جورج (هليوبوليس)",
        "location": "طريق السويس",
        "loc_class": "suez",
        "phones": [{"num": "01273006637", "name": "باسم ماهر"}],
        "links": {"maps": "https://maps.app.goo.gl/txPgEPUB6XHpCoaj8"},
        "night_price": "٦٠ جنيه/فرد", "capacity": "",
        "amenities": ["🏕️ أرض معسكر حلوة", "🏛️ قاعات", "🍳 مطبخ"],
        "status": "visited", "visited": "31/01/2025",
        "notes": "تمت الزيارة. الأرض والأسعار حلوة. الراجل مش بيرد كتير.",
        "details": "",
        "image_ids": ["00000569", "00000572", "00000573", "00000574", "00000575", "00000578", "00000579", "00000580", "00000607", "00000617"]
    },
    {
        "name": "مزرعة الأحلام",
        "location": "العبور",
        "loc_class": "obour",
        "phones": [],
        "links": {},
        "night_price": "", "capacity": "",
        "amenities": ["🏕️ أرض معسكر"],
        "status": "visited", "visited": "08/11/2024",
        "notes": "حلو بس غالي. أرض معسكر بدون برجولا.",
        "details": "",
        "image_ids": ["00000146", "00000147", "00000148", "00000149", "00000150", "00000151", "00000152", "00000153", "00000154", "00000155", "00000156", "00000157", "00000158", "00000159", "00000160", "00000161", "00000162", "00000163", "00000164", "00000165", "00000166", "00000168", "00000169", "00000170"]
    },
    {
        "name": "بيت الملاك شيراتون",
        "location": "الشروق",
        "loc_class": "shorouk",
        "phones": [],
        "links": {},
        "night_price": "", "capacity": "",
        "amenities": [],
        "status": "rejected", "visited": "08/11/2024",
        "notes": "❌ غير مناسب.",
        "details": "",
        "image_ids": ["00000122", "00000123", "00000124", "00000125", "00000126", "00000127", "00000128", "00000129", "00000130", "00000131", "00000134", "00000135", "00000136", "00000137", "00000138", "00000139", "00000141", "00000142", "00000143", "00000144"]
    },
    {
        "name": "مزرعة الصخرة",
        "location": "الشروق",
        "loc_class": "shorouk",
        "phones": [],
        "links": {"maps": "https://maps.google.com/?q=30.317089,31.464100"},
        "night_price": "", "capacity": "",
        "amenities": ["🏕️ أرض كبيرة", "🏛️ 3 قاعات"],
        "status": "visited", "visited": "29/11/2024",
        "notes": "البيت لذيذ بس الدنيا مش واضحة في الحجوزات.",
        "details": "",
        "image_ids": ["00000242", "00000243", "00000244", "00000245", "00000246", "00000247", "00000248", "00000249", "00000250", "00000251", "00000252"]
    },
    {
        "name": "بيت الأمير تادرس",
        "location": "السويس",
        "loc_class": "suez",
        "phones": [],
        "links": {},
        "night_price": "١٥٠ جنيه بدون وجبات", "capacity": "90 سرير",
        "amenities": ["🏕️ أرض ~100 فرد", "🚿 كباين شاور", "🍳 مطبخ خاص", "🛏️ سراير"],
        "status": "rejected", "visited": "",
        "notes": "❌ متاح 1-6 يوليو فقط - باقي الشهر محجوز.",
        "details": "",
        "image_ids": []
    },
    {
        "name": "بيت المحبوب",
        "location": "عرابي",
        "loc_class": "shorouk",
        "phones": [],
        "links": {},
        "night_price": "٢٧٠ صيامي / ٢٩٠ فطاري", "capacity": "60 سرير",
        "amenities": ["🛏️ غرف"],
        "status": "available", "visited": "",
        "notes": "أقل عدد 40 فرد لحجز البيت كله.",
        "details": "",
        "image_ids": []
    },
]

print(f"Total venues: {len(venues)}")

# Copy required images
copied_images = 0
for v in venues:
    for img_id in v.get('image_ids', []):
        if img_id in IMAGE_MAP:
            src = BASE_DIR / IMAGE_MAP[img_id]
            dst = IMAGES_DIR / IMAGE_MAP[img_id]
            if not dst.exists():
                shutil.copy(src, dst)
                copied_images += 1

print(f"Copied {copied_images} new images")

# Count stats
stats = {
    "total": len(venues),
    "booked": len([v for v in venues if v['status'] == 'booked']),
    "visited": len([v for v in venues if v['status'] == 'visited']),
    "rejected": len([v for v in venues if v['status'] == 'rejected']),
    "available": len([v for v in venues if v['status'] == 'available']),
    "with_images": len([v for v in venues if v.get('image_ids')]),
}

# Sort venues by distance from Madinaty (booked first, then by distance)
def get_sort_key(v):
    if v['status'] == 'booked':
        return (0, 0)  # Booked always first
    distance = LOCATION_DISTANCES.get(v['location'], 500)
    return (1, distance)

venues = sorted(venues, key=get_sort_key)

# Get all unique locations with distances for filter
locations_with_dist = [(loc, LOCATION_DISTANCES.get(loc, 500)) for loc in set(v['location'] for v in venues)]
locations_with_dist = sorted(locations_with_dist, key=lambda x: x[1])
locations = [loc for loc, dist in locations_with_dist]


# Generate venue card HTML
def generate_card(v, image_map, card_id):
    status_class = v['status']
    loc_class = f"loc-{v['loc_class']}"
    has_images = bool(v.get('image_ids') and any(img in image_map for img in v['image_ids']))
    
    status_text = {
        'booked': '✓ محجوز ٢٠٢٥',
        'visited': f'✓ زيارة {v.get("visited", "")}',
        'rejected': '❌ مرفوض',
        'available': v['location']
    }.get(v['status'], v['location'])
    
    # Phone numbers as detailed row
    phones_html = ''
    if v['phones']:
        phones = []
        for p in v['phones']:
            if p['name']:
                phones.append(f'<a href="tel:{p["num"]}">{p["name"]}: {p["num"]}</a>')
            else:
                phones.append(f'<a href="tel:{p["num"]}">{p["num"]}</a>')
        phones_html = f'<div class="venue-row"><span class="venue-label">📞 التليفون</span><span class="venue-value">{" / ".join(phones)}</span></div>'
    
    # Links as detailed row
    links_html = ''
    links_list = []
    if v.get('links', {}).get('fb'):
        links_list.append(f'<a href="{v["links"]["fb"]}" target="_blank">📘 Facebook</a>')
    if v.get('links', {}).get('maps'):
        links_list.append(f'<a href="{v["links"]["maps"]}" target="_blank">🗺️ خريطة</a>')
    if v.get('links', {}).get('page'):
        links_list.append(f'<a href="{v["links"]["page"]}" target="_blank">🔗 الصفحة</a>')
    if links_list:
        links_html = f'<div class="venue-row"><span class="venue-label">🔗 اللينكات</span><span class="venue-value">{" | ".join(links_list)}</span></div>'
    
    # Prices as detailed row
    prices_html = ''
    if v['night_price']:
        prices_html = f'<div class="venue-row"><span class="venue-label">💰 سعر الليلة</span><span class="venue-value"><span class="price-tag">{v["night_price"]}</span></span></div>'
    
    # Capacity as detailed row
    capacity_html = ''
    if v.get('capacity'):
        capacity_html = f'<div class="venue-row"><span class="venue-label">👥 السعة</span><span class="venue-value">{v["capacity"]}</span></div>'
    
    # Amenities
    amenities_html = ''
    if v['amenities']:
        amenities_html = '<div class="amenities">' + ''.join([f'<span class="amenity">{a}</span>' for a in v['amenities']]) + '</div>'
    
    # Notes
    notes_html = ''
    if v['notes']:
        note_class = 'danger' if '❌' in v['notes'] else ('success' if '✅' in v['notes'] else '')
        notes_html = f'<div class="notes {note_class}">{v["notes"]}</div>'
    
    # Details if available
    details_html = ''
    if v.get('details'):
        details_html = f'<div class="details">{v["details"]}</div>'
    
    # Photo carousel (only if has images)
    gallery_html = ''
    if has_images:
        slides = ''
        valid_images = [img for img in v['image_ids'] if img in image_map]
        for i, img_id in enumerate(valid_images):
            img_name = image_map[img_id]
            active = 'active' if i == 0 else ''
            slides += f'<div class="slide {active}"><img src="images/{img_name}" alt="صورة {i+1}" loading="lazy" onclick="openModal(this.src)"></div>'
        
        gallery_html = f'''
        <div class="carousel" data-card="{card_id}">
            <div class="slides">{slides}</div>
            <button class="nav-btn prev" onclick="prevSlide({card_id})">❮</button>
            <button class="nav-btn next" onclick="nextSlide({card_id})">❯</button>
            <div class="counter"><span class="current">1</span>/{len(valid_images)}</div>
        </div>'''
    
    star = '⭐ ' if v['status'] == 'booked' else ''
    
    return f'''
    <div class="venue-card {status_class}" data-location="{v['location']}" data-status="{v['status']}" id="card-{card_id}">
        <div class="card-header {loc_class}">
            <h3 class="venue-name">{star}{v['name']}</h3>
            <span class="status-badge">{status_text}</span>
        </div>
        <div class="card-body">
            {gallery_html}
            {phones_html}
            {links_html}
            {prices_html}
            {capacity_html}
            {amenities_html}
            {notes_html}
            {details_html}
        </div>
    </div>'''

# Generate cards
venue_cards = ''.join([generate_card(v, IMAGE_MAP, i) for i, v in enumerate(venues)])

# Location checkboxes for filter (with distance info)
loc_checkboxes = ''.join([f'<label class="loc-checkbox"><input type="checkbox" value="{loc}" onchange="filterVenues()" checked><span>{loc}</span></label>' for loc in locations])


# HTML Template - Mobile-First Design
html_content = f'''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="theme-color" content="#667eea">
    <title>بيوت المعسكرات ٢٠٢٥</title>
    <style>
        :root {{
            --primary: #667eea;
            --secondary: #764ba2;
            --success: #11998e;
            --warning: #f5af19;
            --danger: #eb4d4b;
            --card-bg: #fff;
            --text: #2d3436;
            --text-muted: #636e72;
            --shadow: 0 4px 20px rgba(0,0,0,0.1);
            --radius: 16px;
            --safe-top: env(safe-area-inset-top, 0px);
            --safe-bottom: env(safe-area-inset-bottom, 0px);
        }}
        
        * {{ box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'SF Pro', sans-serif;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            min-height: 100vh;
            padding: var(--safe-top) 0 var(--safe-bottom) 0;
            color: var(--text);
        }}
        
        .container {{ max-width: 600px; margin: 0 auto; padding: 12px; }}
        
        /* Header - Compact */
        header {{
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            border-radius: var(--radius);
            padding: 16px;
            margin-bottom: 12px;
            text-align: center;
            box-shadow: var(--shadow);
        }}
        
        h1 {{ font-size: 1.4em; color: var(--primary); margin-bottom: 8px; }}
        .subtitle {{ font-size: 0.85em; color: var(--text-muted); }}
        
        /* Stats Row */
        .stats-row {{
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 12px;
            flex-wrap: wrap;
        }}
        
        .stat {{
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: 600;
        }}
        
        .stat.success {{ background: linear-gradient(135deg, #11998e, #38ef7d); }}
        
        /* Filter Bar */
        .filter-bar {{
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            border-radius: var(--radius);
            padding: 12px;
            margin-bottom: 12px;
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            box-shadow: var(--shadow);
        }}
        
        .filter-bar input, .filter-bar select {{
            flex: 1;
            min-width: 120px;
            padding: 12px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            font-size: 16px; /* Prevents zoom on iOS */
            outline: none;
            background: white;
        }}
        
        .filter-bar input:focus, .filter-bar select:focus {{
            border-color: var(--primary);
        }}
        
        /* Venue Cards - Glassmorphism */
        .venue-grid {{ display: flex; flex-direction: column; gap: 16px; }}
        
        .venue-card {{
            background: rgba(255,255,255,0.9);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: var(--radius);
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5);
            border: 1px solid rgba(255,255,255,0.3);
            transition: transform 0.3s, box-shadow 0.3s;
        }}
        
        .venue-card:hover {{ transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.15); }}
        .venue-card.booked {{ border: 3px solid var(--success); box-shadow: 0 8px 32px rgba(17,153,142,0.3); }}
        .venue-card.rejected {{ opacity: 0.75; }}
        
        /* Card Header */
        .card-header {{
            padding: 16px 20px;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
        }}
        
        .venue-name {{ font-size: 1.15em; font-weight: 700; flex: 1; margin: 0; text-shadow: 0 1px 2px rgba(0,0,0,0.2); }}
        
        .status-badge {{
            font-size: 0.75em;
            padding: 5px 12px;
            background: rgba(255,255,255,0.25);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            white-space: nowrap;
            font-weight: 600;
        }}
        
        /* Card Body */
        .card-body {{ padding: 16px 20px; }}
        
        /* Venue Data Rows */
        .venue-row {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid rgba(0,0,0,0.06);
            gap: 12px;
        }}
        
        .venue-row:last-child {{ border-bottom: none; }}
        
        .venue-label {{
            color: #666;
            font-weight: 500;
            font-size: 0.85em;
            min-width: 90px;
        }}
        
        .venue-value {{
            flex: 1;
            text-align: left;
            font-size: 0.9em;
            color: #333;
        }}
        
        .venue-value a {{
            color: var(--primary);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s;
        }}
        
        .venue-value a:hover {{ color: var(--secondary); text-decoration: underline; }}
        
        .price-tag {{
            background: linear-gradient(135deg, var(--warning), #f7b42c);
            color: #333;
            padding: 4px 12px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 0.9em;
            display: inline-block;
        }}
        
        /* Amenities */
        .amenities {{
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 12px 0;
        }}
        
        .amenity {{
            background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1));
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.8em;
            border: 1px solid rgba(102,126,234,0.2);
        }}
        
        /* Notes */
        .notes {{
            background: linear-gradient(135deg, #fff8e1, #ffecb3);
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 0.85em;
            color: #6d5c00;
            margin-top: 12px;
            border-right: 4px solid #ffc107;
        }}
        
        .notes.danger {{ background: linear-gradient(135deg, #ffebee, #ffcdd2); color: #b71c1c; border-right-color: #f44336; }}
        .notes.success {{ background: linear-gradient(135deg, #e8f5e9, #c8e6c9); color: #1b5e20; border-right-color: #4caf50; }}
        
        /* Details */
        .details {{
            background: rgba(0,0,0,0.03);
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 0.85em;
            margin-top: 8px;
            color: #555;
        }}

        
        /* Photo Carousel */
        .carousel {{
            position: relative;
            margin-bottom: 12px;
            border-radius: 12px;
            overflow: hidden;
            background: #f0f0f0;
        }}
        
        .slides {{ position: relative; height: 200px; }}
        
        .slide {{
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            opacity: 0;
            transition: opacity 0.3s;
        }}
        
        .slide.active {{ opacity: 1; }}
        
        .slide img {{
            width: 100%;
            height: 100%;
            object-fit: cover;
        }}
        
        .nav-btn {{
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 44px;
            height: 44px;
            background: rgba(0,0,0,0.5);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.2em;
            cursor: pointer;
            z-index: 10;
        }}
        
        .nav-btn.prev {{ left: 8px; }}
        .nav-btn.next {{ right: 8px; }}
        .nav-btn:active {{ background: rgba(0,0,0,0.7); }}
        
        .counter {{
            position: absolute;
            bottom: 8px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.6);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.8em;
        }}
        
        /* Location Colors */
        .loc-obour {{ background: linear-gradient(135deg, #667eea, #764ba2); }}
        .loc-natroun {{ background: linear-gradient(135deg, #f093fb, #f5576c); }}
        .loc-abutalat {{ background: linear-gradient(135deg, #4facfe, #00f2fe); }}
        .loc-fayed {{ background: linear-gradient(135deg, #43e97b, #38f9d7); }}
        .loc-shorouk {{ background: linear-gradient(135deg, #fa709a, #fee140); }}
        .loc-suez {{ background: linear-gradient(135deg, #ff9a9e, #fad0c4); }}
        .loc-sadat {{ background: linear-gradient(135deg, #a18cd1, #fbc2eb); }}
        .loc-other {{ background: linear-gradient(135deg, #a8edea, #fed6e3); }}
        
        .booked .card-header {{ background: linear-gradient(135deg, #11998e, #38ef7d) !important; }}
        .rejected .card-header {{ background: linear-gradient(135deg, #636e72, #b2bec3) !important; }}
        
        /* Footer */
        footer {{
            text-align: center;
            padding: 24px 16px;
            color: rgba(255,255,255,0.8);
            font-size: 0.85em;
        }}
        
        /* Modal for fullscreen image */
        .modal {{
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0; top: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.95);
        }}
        
        .modal.show {{ display: flex; justify-content: center; align-items: center; }}
        
        .modal img {{
            max-width: 85%;
            max-height: 80%;
            border-radius: 8px;
        }}
        
        .modal-close {{
            position: absolute;
            top: var(--safe-top, 20px);
            right: 20px;
            color: white;
            font-size: 2em;
            cursor: pointer;
            padding: 10px;
            z-index: 1010;
        }}
        
        .modal-nav {{
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            font-size: 2em;
            padding: 20px 15px;
            cursor: pointer;
            border-radius: 8px;
            z-index: 1010;
        }}
        
        .modal-prev {{ left: 10px; }}
        .modal-next {{ right: 10px; }}
        .modal-nav:hover {{ background: rgba(255,255,255,0.3); }}
        
        .modal-counter {{
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.9em;
        }}
        
        /* Location Filter Checkboxes */
        .location-filter {{
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            border-radius: var(--radius);
            margin-bottom: 12px;
            box-shadow: var(--shadow);
            overflow: hidden;
        }}
        
        .loc-filter-header {{
            padding: 12px 16px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        
        .loc-checkboxes {{
            padding: 8px 16px 16px;
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            max-height: 200px;
            overflow-y: auto;
        }}
        
        .loc-checkboxes.hidden {{ display: none; }}
        
        .loc-checkbox {{
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            background: rgba(102,126,234,0.1);
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.85em;
            transition: background 0.2s;
        }}
        
        .loc-checkbox:has(input:not(:checked)) {{
            background: #eee;
            opacity: 0.6;
        }}
        
        .loc-checkbox.select-all {{
            background: var(--primary);
            color: white;
        }}
        
        .loc-checkbox input {{ display: none; }}
        
        /* No results */
        .no-results {{
            text-align: center;
            padding: 40px;
            color: white;
            display: none;
        }}
        
        .no-results.show {{ display: block; }}
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🏕️ بيوت المعسكرات</h1>
            <p class="subtitle">كنيسة العذراء ومارجرجس بمدينتي · ٢٠٢٥</p>
            <div class="stats-row">
                <span class="stat">📍 {stats['total']} بيت</span>
                <span class="stat success">🎯 المختار: بيت العذراء</span>
                <span class="stat">👁️ {stats['visited']} زيارة</span>
            </div>
        </header>
        
        <div class="filter-bar">
            <input type="text" id="searchInput" placeholder="🔍 بحث..." oninput="filterVenues()">
            <select id="statusFilter" onchange="filterVenues()">
                <option value="">كل الحالات</option>
                <option value="booked">✅ محجوز</option>
                <option value="visited">👁️ تمت زيارته</option>
                <option value="available">📋 متاح</option>
                <option value="rejected">❌ مرفوض</option>
            </select>
        </div>
        
        <div class="location-filter">
            <div class="loc-filter-header" onclick="toggleLocFilter()">
                � فلتر المواقع <span id="locToggle">▼</span>
            </div>
            <div class="loc-checkboxes" id="locCheckboxes">
                <label class="loc-checkbox select-all"><input type="checkbox" id="selectAllLocs" onchange="toggleAllLocs()" checked><span>✓ الكل</span></label>
                {loc_checkboxes}
            </div>
        </div>
        
        <div class="venue-grid" id="venueGrid">
            {venue_cards}
        </div>
        
        <div class="no-results" id="noResults">
            😕 لا توجد نتائج
        </div>
        
        <footer>
            <p>لجنة معسكرات ٢٠٢٥ ⛺</p>
            <p>مرتب حسب القرب من مدينتي</p>
        </footer>
    </div>
    
    <div id="imageModal" class="modal" onclick="handleModalClick(event)">
        <span class="modal-close" onclick="closeModal()">&times;</span>
        <button class="modal-nav modal-prev" onclick="modalPrev(event)">❮</button>
        <img id="modalImage" src="">
        <button class="modal-nav modal-next" onclick="modalNext(event)">❯</button>
        <div class="modal-counter"><span id="modalCurrent">1</span> / <span id="modalTotal">1</span></div>
    </div>
    
    <script>
        // Carousel state
        const carouselStates = {{}};
        
        function prevSlide(cardId) {{
            const carousel = document.querySelector(`[data-card="${{cardId}}"]`);
            const slides = carousel.querySelectorAll('.slide');
            const counter = carousel.querySelector('.current');
            let current = carouselStates[cardId] || 0;
            
            slides[current].classList.remove('active');
            current = (current - 1 + slides.length) % slides.length;
            slides[current].classList.add('active');
            counter.textContent = current + 1;
            carouselStates[cardId] = current;
        }}
        
        function nextSlide(cardId) {{
            const carousel = document.querySelector(`[data-card="${{cardId}}"]`);
            const slides = carousel.querySelectorAll('.slide');
            const counter = carousel.querySelector('.current');
            let current = carouselStates[cardId] || 0;
            
            slides[current].classList.remove('active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('active');
            counter.textContent = current + 1;
            carouselStates[cardId] = current;
        }}
        
        // Swipe support
        let touchStartX = 0;
        document.querySelectorAll('.carousel').forEach(carousel => {{
            carousel.addEventListener('touchstart', e => {{
                touchStartX = e.touches[0].clientX;
            }});
            carousel.addEventListener('touchend', e => {{
                const diff = touchStartX - e.changedTouches[0].clientX;
                const cardId = carousel.dataset.card;
                if (Math.abs(diff) > 50) {{
                    if (diff > 0) nextSlide(cardId);
                    else prevSlide(cardId);
                }}
            }});
        }});
        
        // Modal state
        let modalImages = [];
        let modalIndex = 0;
        
        // Click to fullscreen - track all images in that card
        document.querySelectorAll('.slide img').forEach(img => {{
            img.addEventListener('click', e => {{
                e.stopPropagation();
                const carousel = img.closest('.carousel');
                const cardId = carousel.dataset.card;
                modalImages = Array.from(carousel.querySelectorAll('.slide img')).map(i => i.src);
                // Use the carousel state to get current slide index
                modalIndex = carouselStates[cardId] || 0;
                openModal(modalImages[modalIndex], modalImages.length);
            }});
        }});
        
        function openModal(src, total) {{
            document.getElementById('modalImage').src = src;
            document.getElementById('modalCurrent').textContent = modalIndex + 1;
            document.getElementById('modalTotal').textContent = total || 1;
            document.getElementById('imageModal').classList.add('show');
        }}
        
        function closeModal() {{
            document.getElementById('imageModal').classList.remove('show');
        }}
        
        function handleModalClick(event) {{
            if (event.target.classList.contains('modal')) {{
                closeModal();
            }}
        }}
        
        function modalPrev(e) {{
            e.stopPropagation();
            if (modalImages.length === 0) return;
            modalIndex = (modalIndex - 1 + modalImages.length) % modalImages.length;
            document.getElementById('modalImage').src = modalImages[modalIndex];
            document.getElementById('modalCurrent').textContent = modalIndex + 1;
        }}
        
        function modalNext(e) {{
            e.stopPropagation();
            if (modalImages.length === 0) return;
            modalIndex = (modalIndex + 1) % modalImages.length;
            document.getElementById('modalImage').src = modalImages[modalIndex];
            document.getElementById('modalCurrent').textContent = modalIndex + 1;
        }}
        
        // Location filter toggle
        function toggleLocFilter() {{
            const checkboxes = document.getElementById('locCheckboxes');
            const toggle = document.getElementById('locToggle');
            checkboxes.classList.toggle('hidden');
            toggle.textContent = checkboxes.classList.contains('hidden') ? '▶' : '▼';
        }}
        
        function toggleAllLocs() {{
            const selectAll = document.getElementById('selectAllLocs').checked;
            document.querySelectorAll('.loc-checkbox:not(.select-all) input').forEach(cb => {{
                cb.checked = selectAll;
            }});
            filterVenues();
        }}
        
        function filterVenues() {{
            const search = document.getElementById('searchInput').value.toLowerCase();
            const status = document.getElementById('statusFilter').value;
            
            // Get selected locations
            const selectedLocs = [];
            document.querySelectorAll('.loc-checkbox:not(.select-all) input:checked').forEach(cb => {{
                selectedLocs.push(cb.value);
            }});
            
            const cards = document.querySelectorAll('.venue-card');
            let shown = 0;
            
            cards.forEach(card => {{
                const text = card.textContent.toLowerCase();
                const cardLocation = card.getAttribute('data-location');
                const cardStatus = card.getAttribute('data-status');
                
                const matchSearch = !search || text.includes(search);
                const matchLocation = selectedLocs.length === 0 || selectedLocs.includes(cardLocation);
                const matchStatus = !status || cardStatus === status;
                
                if (matchSearch && matchLocation && matchStatus) {{
                    card.style.display = 'block';
                    shown++;
                }} else {{
                    card.style.display = 'none';
                }}
            }});
            
            document.getElementById('noResults').classList.toggle('show', shown === 0);
        }}
    </script>
</body>
</html>'''

# Write output
output_file = OUTPUT_DIR / "index.html"
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"\nGenerated: {output_file}")
print(f"Stats: {stats}")
