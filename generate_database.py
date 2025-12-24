"""
Camps Database Generator - Organized Version
Creates a proper project structure with correct image paths.
"""
import os
import shutil
import glob
from pathlib import Path

# Configuration
BASE_DIR = Path(r"c:\Users\G14\Downloads\لجنة معسكرات ٢٠٢٥")
OUTPUT_DIR = BASE_DIR / "camps_database"
IMAGES_DIR = OUTPUT_DIR / "images"

# Create directories
OUTPUT_DIR.mkdir(exist_ok=True)
IMAGES_DIR.mkdir(exist_ok=True)

# Scan for all image files in BASE_DIR
def find_images():
    """Build a map of image IDs to full filenames"""
    image_map = {}
    for ext in ['jpg', 'jpeg', 'png']:
        for file in BASE_DIR.glob(f"*.{ext}"):
            # Extract the numeric ID from filename like "00000011-PHOTO-2024-11-04-15-21-38.jpg"
            try:
                file_id = file.name.split('-')[0]
                image_map[file_id] = file.name
            except:
                continue
    return image_map

IMAGE_MAP = find_images()
print(f"Found {len(IMAGE_MAP)} images")

# Venue data with image IDs
venues = [
    {
        "name": "بيت السيدة العذراء ويوسف النجار",
        "location": "طريق السويس - خلف دير بطمس",
        "loc_class": "suez",
        "phones": [{"num": "01223716388", "name": ""}],
        "links": {"maps": "https://g.co/kgs/Xn9w4VL"},
        "night_price": "٦٠ جنيه/فرد",
        "day_price": "",
        "amenities": ["🏕️ أرض معسكر", "🍳 مطبخ", "🚿 حمامات", "⛪ كنيسة جديدة", "🛏️ غرف"],
        "status": "booked",
        "visited": "31/01/2025",
        "notes": "✅ تم الحجز 15/2/2025. البيت مقفول علينا. زيارات: 31/1، 5/4، 3/5/2025",
        "details": "دفع وديعة شهر في 15/2/2025. مواعيد المعسكرات: 9-11، 11-13، 17-19، 24-26 يوليو، 31/7-2/8",
        "image_ids": ["00000584", "00000585", "00000588", "00000590", "00000591", "00000780", "00000816", "00000817", "00000818", "00000819", "00000820", "00000854"]
    },
    {
        "name": "بيت ايل",
        "location": "العبور",
        "loc_class": "obour",
        "phones": [{"num": "022156403", "name": ""}, {"num": "01212333360", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/bqUwRP8v69MBB8sd/"},
        "night_price": "٣٢٠ جنيه", "day_price": "١٠٠ جنيه",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "دار الينبوع",
        "location": "العبور",
        "loc_class": "obour",
        "phones": [{"num": "01274899155", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/QtrTZz7YF3LyGMWe/"},
        "night_price": "", "day_price": "", "amenities": [],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت جبل الزيتون",
        "location": "العبور",
        "loc_class": "obour",
        "phones": [{"num": "01226699502", "name": ""}],
        "links": {"maps": "https://g.co/kgs/xq3qKSQ"},
        "night_price": "", "day_price": "", "amenities": [],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "فيلا بارادايس (فري بيرد)",
        "location": "العبور",
        "loc_class": "obour",
        "phones": [{"num": "01222719622", "name": "سامح"}],
        "links": {"fb": "https://www.facebook.com/share/uXYnCy6CKRzhDxqk/"},
        "night_price": "", "day_price": "", "amenities": ["🏕️ نجيلة"],
        "status": "visited", "visited": "25/01/2025",
        "notes": "تمت الزيارة. فيلا تبع مزرعة البطل - كلها نجيلة وصغيرة.",
        "details": "", "image_ids": []
    },
    {
        "name": "بيت مارمرقس شبرا",
        "location": "العبور",
        "loc_class": "obour",
        "phones": [{"num": "022050550", "name": ""}, {"num": "02202577", "name": ""}, {"num": "01001525291", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/vJ4KdswQhWbGShFy/"},
        "night_price": "", "day_price": "", "amenities": [],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "مزرعة البطل",
        "location": "العبور",
        "loc_class": "obour",
        "phones": [{"num": "01271880404", "name": ""}, {"num": "01228377877", "name": ""}, {"num": "022406857", "name": ""}],
        "links": {"fb": "https://www.facebook.com/batalfarm", "maps": "https://maps.google.com/?q=30.180628,31.546387"},
        "night_price": "١٥٠ جنيه شامل", "day_price": "",
        "amenities": ["🏕️ أرضين معسكر", "🍳 مطبخ", "⚽ ملاعب", "🏛️ قاعات"],
        "status": "visited", "visited": "25/01/2025",
        "notes": "تمت الزيارة. فيه أرضين (كبيرة+صغيرة). سعر أحسن من مزرعة الأحلام.",
        "details": "VCF: مزرعة البطل بالعبور",
        "image_ids": ["00000176", "00000177", "00000178", "00000179", "00000180", "00000181", "00000182", "00000183", "00000184", "00000185", "00000186", "00000187"]
    },
    {
        "name": "بيت الملكة",
        "location": "العبور",
        "loc_class": "obour",
        "phones": [{"num": "01228806633", "name": ""}],
        "links": {"fb": "https://www.facebook.com/profile.php?id=100057503557049"},
        "night_price": "", "day_price": "", "amenities": [],
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
        "night_price": "", "day_price": "", "amenities": [],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت الواحة",
        "location": "العبور",
        "loc_class": "obour",
        "phones": [{"num": "01206645317", "name": ""}],
        "links": {},
        "night_price": "", "day_price": "", "amenities": [],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت فاونتن جيت",
        "location": "العبور",
        "loc_class": "obour",
        "phones": [{"num": "01225970971", "name": "بولس"}, {"num": "01229555678", "name": "بولس"}, {"num": "01273606106", "name": "سارة"}],
        "links": {"page": "https://goo.gl/7EoVgZ"},
        "night_price": "", "day_price": "", "amenities": [],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "سمعان الخراز",
        "location": "وادي النطرون",
        "loc_class": "natroun",
        "phones": [{"num": "01222722893", "name": ""}, {"num": "01022399299", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/xZsfWHGJhCj9Pe6E/"},
        "night_price": "٤٥٠ جنيه", "day_price": "٢٠٠ جنيه",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت الوادي",
        "location": "وادي النطرون",
        "loc_class": "natroun",
        "phones": [{"num": "01289673151", "name": ""}, {"num": "01228193523", "name": ""}],
        "links": {"fb": "https://www.facebook.com/kdecwadi"},
        "night_price": "", "day_price": "", "amenities": [],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "الواحة فكر&واعمل",
        "location": "وادي النطرون",
        "loc_class": "natroun",
        "phones": [{"num": "01229463060", "name": "للمؤتمرات"}, {"num": "01273395268", "name": "للرحلات"}],
        "links": {"fb": "https://www.facebook.com/share/Kp7zqEK4P2uDpgtS/"},
        "night_price": "", "day_price": "", "amenities": [],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت آدم (عزبة آدم)",
        "location": "وادي النطرون",
        "loc_class": "natroun",
        "phones": [{"num": "022406857", "name": ""}],
        "links": {"maps": "https://g.co/kgs/jPy8D9w"},
        "night_price": "١٥٠ خيام / ٢٠٠ غرف", "day_price": "",
        "amenities": ["🏕️ مساحة كبيرة للمعسكرات", "🍳 مطبخ ٧٥٠ج/يوم"],
        "status": "available", "visited": "",
        "notes": "أسعار الشتاء - الصيف +٥٠ جنيه. مش هيقفل البيت علينا.",
        "details": "", "image_ids": []
    },
    {
        "name": "بيت مارمرقس",
        "location": "أبو تلات",
        "loc_class": "abutalat",
        "phones": [{"num": "024855093", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/KueUpoTwynKBZD2W/"},
        "night_price": "", "day_price": "", "amenities": [],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "القديسة فيرينا",
        "location": "أبو تلات",
        "loc_class": "abutalat",
        "phones": [{"num": "026334433", "name": ""}, {"num": "026342538", "name": ""}],
        "links": {"maps": "https://g.co/kgs/nBjD2Jq"},
        "night_price": "", "day_price": "", "amenities": [],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت القديسة مارينا",
        "location": "أبو تلات",
        "loc_class": "abutalat",
        "phones": [{"num": "01222178170", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/sqnAjkUKxSf9M1p7/"},
        "night_price": "", "day_price": "", "amenities": [],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت لورا",
        "location": "فايد",
        "loc_class": "fayed",
        "phones": [{"num": "01006545025", "name": ""}, {"num": "0643900305", "name": ""}],
        "links": {},
        "night_price": "", "day_price": "", "amenities": [],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت فيلو",
        "location": "فايد",
        "loc_class": "fayed",
        "phones": [{"num": "01202248999", "name": ""}, {"num": "01270154444", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/p/L2a27vWzobFfsRzw/"},
        "night_price": "", "day_price": "",
        "amenities": ["🌊 على البحر"],
        "status": "available", "visited": "",
        "notes": "على البحر - الخيم هتبقى على البحر. من الصور شكله خطير.",
        "details": "", "image_ids": []
    },
    {
        "name": "فيلا الشهيد",
        "location": "فايد",
        "loc_class": "fayed",
        "phones": [{"num": "01228201107", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/UCEz1gnPBv676ZyQ/"},
        "night_price": "", "day_price": "١٨٠ جنيه",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت الفخاري",
        "location": "الشروق",
        "loc_class": "shorouk",
        "phones": [{"num": "01223184706", "name": "مهندس خليل"}, {"num": "01558600916", "name": ""}],
        "links": {"fb": "https://www.facebook.com/profile.php?id=100064404803880"},
        "night_price": "", "day_price": "", "amenities": [],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت ماري لاند",
        "location": "الشروق",
        "loc_class": "shorouk",
        "phones": [{"num": "01009000673", "name": ""}, {"num": "01280999395", "name": ""}],
        "links": {"maps": "https://g.co/kgs/XtrmRhB"},
        "night_price": "", "day_price": "", "amenities": [],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت أبونا يوسف أسعد",
        "location": "سيدي كرير",
        "loc_class": "other",
        "phones": [{"num": "01227231479", "name": ""}, {"num": "01224663289", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/KueUpoTwynKBZD2W/"},
        "night_price": "", "day_price": "", "amenities": [],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت أبو سيفين",
        "location": "سيدي كرير",
        "loc_class": "other",
        "phones": [{"num": "01223120986", "name": ""}],
        "links": {"maps": "https://maps.app.goo.gl/hAeYh1UYtdJnpep99"},
        "night_price": "", "day_price": "", "amenities": [],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت الملاك بجبل الزيتون",
        "location": "العلمين",
        "loc_class": "other",
        "phones": [{"num": "01273452322", "name": ""}],
        "links": {"fb": "https://www.facebook.com/groups/503217210335586/"},
        "night_price": "", "day_price": "", "amenities": [],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت مارجرجس سبورتنج",
        "location": "كينج مريوط",
        "loc_class": "other",
        "phones": [{"num": "01227392156", "name": "وديع"}],
        "links": {"page": "https://coptictourguide.com/ar/ads/5861a8453c53c/"},
        "night_price": "", "day_price": "", "amenities": [],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت الكرمة (دير كرمة الرسل)",
        "location": "مدينة السادات",
        "loc_class": "sadat",
        "phones": [{"num": "0129194667", "name": "إبراهيم"}],
        "links": {"fb": "https://www.facebook.com/share/p/1AiL17R3TJ/"},
        "night_price": "٧٥ جنيه للغرف", "day_price": "٤٠ جنيه للأرض",
        "amenities": ["🏕️ أرض معسكر", "🍳 مطبخ ٥٠٠ج شامل الغاز", "🏊 حمام سباحة"],
        "status": "available", "visited": "",
        "notes": "البيت هيتقفل علينا ماعدا حمام السباحة. Location أقرب من وادي النطرون.",
        "details": "", "image_ids": []
    },
    {
        "name": "بيت مارجرجس",
        "location": "بورفؤاد",
        "loc_class": "other",
        "phones": [{"num": "663457075", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/9NCjCAVFfzPL28ph/"},
        "night_price": "", "day_price": "", "amenities": [],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "قرية ماربنا",
        "location": "راس سدر",
        "loc_class": "other",
        "phones": [{"num": "01222769970", "name": "تاسوني مريم"}],
        "links": {},
        "night_price": "", "day_price": "",
        "amenities": ["🌊 بحر", "🏊 بيسين"],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت جمعية السامري الصالح",
        "location": "المقطم",
        "loc_class": "other",
        "phones": [{"num": "01288800295", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/Z9GxKQhHYp1qD1Mp/"},
        "night_price": "", "day_price": "", "amenities": [],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "مبيت باراديسوس آفا بافلي",
        "location": "الإسماعيلية",
        "loc_class": "suez",
        "phones": [{"num": "01203530370", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/v8qDctyDS1xnXWar/"},
        "night_price": "", "day_price": "", "amenities": [],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "فيلا الملاك (ستيلا دي ماري)",
        "location": "السخنة",
        "loc_class": "other",
        "phones": [{"num": "01211150393", "name": ""}, {"num": "01001525291", "name": ""}],
        "links": {"fb": "https://www.facebook.com/share/MC9ZB6ik252aboLE/"},
        "night_price": "", "day_price": "", "amenities": [],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "ريف كاراس",
        "location": "الريف الأوروبي",
        "loc_class": "other",
        "phones": [{"num": "01288150157", "name": ""}],
        "links": {"fb": "https://www.facebook.com/reefkaras"},
        "night_price": "١٧٥ جنيه", "day_price": "٢٨٠-٣٠٠ جنيه",
        "amenities": [], "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    {
        "name": "بيت الشهيد",
        "location": "الريف الأوروبي",
        "loc_class": "other",
        "phones": [],
        "links": {},
        "night_price": "", "day_price": "", "amenities": [],
        "status": "available", "visited": "", "notes": "", "details": "", "image_ids": []
    },
    # NEW venues from chat
    {
        "name": "سفينة النجاة",
        "location": "وادي النطرون",
        "loc_class": "natroun",
        "phones": [{"num": "01211150393", "name": "إبرام سليم"}],
        "links": {},
        "night_price": "", "day_price": "",
        "amenities": ["⛪ كنيسة جميلة", "🏛️ قاعات", "⛱️ برجولات", "⚽ ملعب كرة", "🏕️ أرض رملية للكشافة", "🍳 مطبخ + شواية"],
        "status": "available", "visited": "",
        "notes": "بيت جديد - 500م من دير أنبا بيشوي. 36 سرير (6 غرف).",
        "details": "تم الإعلان 28/1/2025",
        "image_ids": ["00000496", "00000497", "00000498", "00000499", "00000500", "00000501", "00000502", "00000503", "00000504", "00000505", "00000506", "00000507"]
    },
    {
        "name": "واحة الصديق",
        "location": "غير محدد",
        "loc_class": "other",
        "phones": [],
        "links": {},
        "night_price": "١٠٠ج داخل / ٨٠ج خيمة", "day_price": "",
        "amenities": ["🍳 مطبخ مجهز", "🔥 شواية", "⚽ ملعب كرة", "⛱️ برجولا كبيرة", "🏕️ أرض تخييم"],
        "status": "available", "visited": "",
        "notes": "شامل مطبخ مجهز وشواية وملعب كرة وبرجولا.",
        "details": "بيانات 4/11/2024",
        "image_ids": ["00000011", "00000012", "00000013", "00000014", "00000015", "00000016", "00000017", "00000018", "00000019", "00000020"]
    },
    {
        "name": "أرض موسى",
        "location": "الفيوم",
        "loc_class": "other",
        "phones": [],
        "links": {"fb": "https://www.facebook.com/100088900820728/posts/130951656544861/", "maps": "https://maps.app.goo.gl/vD2QsLVF3vDQLmBu9"},
        "night_price": "١٠٠ جنيه/فرد", "day_price": "",
        "amenities": ["🏕️ أرض معسكرات فقط"],
        "status": "available", "visited": "",
        "notes": "4 فدان (~16,000م²) - سعة حتى 4000 فرد. الخيم تبعنا. مفيش شيف.",
        "details": "أرض معسكرات فقط - الأكل تبعنا",
        "image_ids": ["00000041"]
    },
    {
        "name": "تيجي لاند (Fun Valley)",
        "location": "العبور",
        "loc_class": "obour",
        "phones": [{"num": "01220204620", "name": ""}],
        "links": {},
        "night_price": "٢٠٠ جنيه شامل", "day_price": "",
        "amenities": ["🏕️ أرض حلوة وكبيرة", "⛱️ برجولات كتير", "🏛️ قاعات"],
        "status": "rejected", "visited": "",
        "notes": "❌ كل حاجة تحفة لكن محجوز كل الـ Weekends في يوليو 2025.",
        "details": "",
        "image_ids": []
    },
    {
        "name": "سان جورج (هليوبوليس الجديدة)",
        "location": "طريق السويس",
        "loc_class": "suez",
        "phones": [{"num": "01227231479", "name": "باسم ماهر"}],
        "links": {"maps": "https://maps.app.goo.gl/txPgEPUB6XHpCoaj8"},
        "night_price": "٦٠ جنيه/فرد", "day_price": "",
        "amenities": ["🏕️ أرض معسكر حلوة", "🏛️ قاعات", "🍳 مطبخ"],
        "status": "visited", "visited": "31/01/2025",
        "notes": "تمت الزيارة. الأرض حلوة. أسعار حلوة. الراجل مش بيرد كتير.",
        "details": "VCF: Basem Maher San George",
        "image_ids": ["00000569", "00000572", "00000573", "00000574", "00000575", "00000578", "00000579", "00000580", "00000607", "00000617"]
    },
    {
        "name": "مزرعة الأحلام",
        "location": "العبور",
        "loc_class": "obour",
        "phones": [],
        "links": {},
        "night_price": "", "day_price": "",
        "amenities": ["🏕️ أرض معسكر"],
        "status": "visited", "visited": "08/11/2024",
        "notes": "حلو بس غالي. فيها أرض معسكر لكن مفيهاش برجولا.",
        "details": "",
        "image_ids": ["00000146", "00000147", "00000148", "00000149", "00000150", "00000151", "00000152", "00000153", "00000154", "00000155"]
    },
    {
        "name": "بيت الملاك شيراتون",
        "location": "الشروق",
        "loc_class": "shorouk",
        "phones": [],
        "links": {},
        "night_price": "", "day_price": "", "amenities": [],
        "status": "rejected", "visited": "08/11/2024",
        "notes": "❌ غير مناسب.",
        "details": "",
        "image_ids": ["00000122", "00000123", "00000124", "00000125", "00000126", "00000127", "00000128"]
    },
    {
        "name": "مزرعة الصخرة",
        "location": "الشروق",
        "loc_class": "shorouk",
        "phones": [],
        "links": {"maps": "https://maps.google.com/?q=30.317089,31.464100"},
        "night_price": "", "day_price": "",
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
        "night_price": "١٥٠ جنيه/فرد بدون وجبات", "day_price": "٧٥ جنيه/فرد",
        "amenities": ["🏕️ أرض معسكر ~100 فرد", "🚿 كباين شاور", "🍳 مطبخ خاص", "🛏️ ٩٠ سرير"],
        "status": "rejected", "visited": "",
        "notes": "❌ متاح 1-6 يوليو 2025 فقط - باقي الشهر محجوز.",
        "details": "مطبخ: عيون بوتاجاز + تلاجة + ديب فريزر",
        "image_ids": []
    },
    {
        "name": "بيت المحبوب (جمعية أحمد عرابي)",
        "location": "عرابي",
        "loc_class": "shorouk",
        "phones": [],
        "links": {},
        "night_price": "٢٧٠ صيامي / ٢٩٠ فطاري", "day_price": "١٠٠ بدون غدا / ١٨٠ بالغدا",
        "amenities": ["🛏️ 60 سرير"],
        "status": "available", "visited": "",
        "notes": "أقل عدد 40 فرد لحجز البيت كله.",
        "details": "بيانات 10/5/2025",
        "image_ids": []
    },
]

print(f"Total venues: {len(venues)}")

# Copy required images to images folder
copied_images = 0
for v in venues:
    for img_id in v.get('image_ids', []):
        if img_id in IMAGE_MAP:
            src = BASE_DIR / IMAGE_MAP[img_id]
            dst = IMAGES_DIR / IMAGE_MAP[img_id]
            if not dst.exists():
                shutil.copy(src, dst)
                copied_images += 1

print(f"Copied {copied_images} images to images folder")

# Generate HTML with correct relative paths
def generate_card(v, image_map):
    status_class = v['status']
    loc_class = f"loc-{v['loc_class']}"
    
    status_text = {
        'booked': '✓ محجوز ٢٠٢٥',
        'visited': f'✓ زيارة {v.get("visited", "")}',
        'rejected': '❌ مرفوض',
        'available': v['location']
    }.get(v['status'], v['location'])
    
    # Phone numbers
    phones_html = ''
    if v['phones']:
        phones = []
        for p in v['phones']:
            if p['name']:
                phones.append(f'<a href="tel:{p["num"]}">{p["name"]}: {p["num"]}</a>')
            else:
                phones.append(f'<a href="tel:{p["num"]}">{p["num"]}</a>')
        phones_html = f'<div class="venue-row"><span class="venue-label">التليفون</span><span class="venue-value">{" / ".join(phones)}</span></div>'
    
    # Links
    links_html = ''
    if v.get('links'):
        links = []
        if v['links'].get('fb'):
            links.append(f'<a href="{v["links"]["fb"]}" target="_blank">Facebook</a>')
        if v['links'].get('maps'):
            links.append(f'<a href="{v["links"]["maps"]}" target="_blank">خريطة</a>')
        if v['links'].get('page'):
            links.append(f'<a href="{v["links"]["page"]}" target="_blank">الصفحة</a>')
        if links:
            links_html = f'<div class="venue-row"><span class="venue-label">اللينكات</span><span class="venue-value">{" | ".join(links)}</span></div>'
    
    # Prices
    prices_html = ''
    if v['night_price']:
        prices_html += f'<div class="venue-row"><span class="venue-label">سعر الليلة</span><span class="venue-value"><span class="price-tag">{v["night_price"]}</span></span></div>'
    if v['day_price']:
        prices_html += f'<div class="venue-row"><span class="venue-label">Day Use</span><span class="venue-value"><span class="price-tag">{v["day_price"]}</span></span></div>'
    
    # Amenities
    amenities_html = ''
    if v['amenities']:
        amenities_html = '<div class="amenities">' + ''.join([f'<span class="amenity">{a}</span>' for a in v['amenities']]) + '</div>'
    
    # Notes
    notes_html = ''
    if v['notes']:
        note_class = 'danger' if '❌' in v['notes'] else ('success' if '✅' in v['notes'] else '')
        notes_html = f'<div class="notes {note_class}">{v["notes"]}</div>'
    
    # Details
    details_html = ''
    if v['details']:
        details_html = f'<div class="details">{v["details"]}</div>'
    
    # Gallery with CORRECT relative paths
    gallery_html = ''
    if v.get('image_ids'):
        thumbs = ''
        for img_id in v['image_ids'][:8]:  # Max 8 images
            if img_id in image_map:
                img_name = image_map[img_id]
                thumbs += f'<img class="gallery-thumb" src="images/{img_name}" onclick="openModal(this.src)" alt="صورة">'
        if thumbs:
            gallery_html = f'<div class="gallery"><div class="gallery-grid">{thumbs}</div></div>'
    
    # Toggle button
    toggle_btn = ''
    if v['details'] or gallery_html:
        toggle_btn = '<button class="details-toggle" onclick="toggleDetails(this)">📋 تفاصيل وصور</button>'
    
    star = '⭐ ' if v['status'] == 'booked' else ''
    
    return f'''
        <div class="venue-card {status_class}" data-location="{v['location']}" data-status="{v['status']}">
            <div class="venue-header {loc_class}">
                <span class="venue-name">{star}{v['name']}</span>
                <span class="venue-status">{status_text}</span>
            </div>
            <div class="venue-body">
                {phones_html}
                {links_html}
                {prices_html}
                {amenities_html}
                {notes_html}
                {toggle_btn}
                {details_html}
                {gallery_html}
            </div>
        </div>'''

# Generate all cards
venue_cards = ''.join([generate_card(v, IMAGE_MAP) for v in venues])
visited_count = len([v for v in venues if v['status'] == 'visited'])

# HTML template
html_template = '''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>قاعدة بيانات بيوت المعسكرات - لجنة معسكرات ٢٠٢٥</title>
    <style>
        :root { --primary:#1a5f7a; --secondary:#159895; --accent:#57c5b6; --success:#198754; --warning:#ffc107; --danger:#dc3545; }
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'Segoe UI',Tahoma,Arial,sans-serif; background:linear-gradient(135deg,#667eea 0%,#764ba2 100%); min-height:100vh; padding:20px; }
        .container { max-width:1400px; margin:0 auto; }
        header { background:rgba(255,255,255,0.95); border-radius:16px; padding:24px; margin-bottom:24px; text-align:center; box-shadow:0 8px 32px rgba(0,0,0,0.1); }
        h1 { color:var(--primary); margin-bottom:8px; font-size:1.8em; }
        .subtitle { color:#666; font-size:1em; }
        .last-updated { color:var(--secondary); font-size:0.85em; margin-top:8px; }
        .stats { display:flex; justify-content:center; gap:24px; margin-top:16px; flex-wrap:wrap; }
        .stat { background:var(--accent); color:white; padding:8px 16px; border-radius:20px; font-size:0.9em; }
        .filters { background:rgba(255,255,255,0.95); border-radius:12px; padding:16px; margin-bottom:20px; display:flex; gap:12px; flex-wrap:wrap; align-items:center; }
        .filters input, .filters select { padding:10px 14px; border:2px solid #ddd; border-radius:8px; font-size:14px; outline:none; }
        .filters input:focus, .filters select:focus { border-color:var(--secondary); }
        .filters input { flex:1; min-width:200px; }
        .venue-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(380px,1fr)); gap:20px; }
        .venue-card { background:white; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.1); transition:transform 0.2s; }
        .venue-card:hover { transform:translateY(-4px); }
        .venue-header { padding:16px; color:white; }
        .venue-name { font-size:1.1em; font-weight:bold; }
        .venue-status { font-size:0.75em; padding:4px 10px; border-radius:12px; background:rgba(255,255,255,0.25); float:left; }
        .venue-body { padding:16px; }
        .venue-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #eee; font-size:0.9em; }
        .venue-row:last-child { border-bottom:none; }
        .venue-label { color:#666; min-width:100px; }
        .venue-value { font-weight:500; color:#212529; text-align:left; flex:1; }
        .venue-value a { color:var(--secondary); text-decoration:none; }
        .price-tag { background:var(--warning); color:#212529; padding:2px 8px; border-radius:4px; font-weight:bold; font-size:0.85em; }
        .amenities { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
        .amenity { background:#e9ecef; padding:4px 10px; border-radius:12px; font-size:0.8em; }
        .notes { background:#fff3cd; padding:12px; border-radius:8px; margin-top:12px; font-size:0.85em; color:#856404; }
        .notes.danger { background:#f8d7da; color:#721c24; }
        .notes.success { background:#d4edda; color:#155724; }
        .details { display:none; background:#f8f9fa; padding:12px; border-radius:8px; margin-top:12px; font-size:0.85em; }
        .details.show { display:block; }
        .details-toggle { background:var(--secondary); color:white; border:none; padding:8px 16px; border-radius:8px; cursor:pointer; font-size:0.85em; margin-top:8px; }
        .gallery { display:none; margin-top:12px; }
        .gallery.show { display:block; }
        .gallery-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(100px,1fr)); gap:8px; }
        .gallery-thumb { width:100%; height:80px; object-fit:cover; border-radius:4px; cursor:pointer; transition:transform 0.2s; }
        .gallery-thumb:hover { transform:scale(1.05); }
        .loc-obour { background:linear-gradient(135deg,#667eea,#764ba2); }
        .loc-natroun { background:linear-gradient(135deg,#f093fb,#f5576c); }
        .loc-abutalat { background:linear-gradient(135deg,#4facfe,#00f2fe); }
        .loc-fayed { background:linear-gradient(135deg,#43e97b,#38f9d7); }
        .loc-shorouk { background:linear-gradient(135deg,#fa709a,#fee140); }
        .loc-suez { background:linear-gradient(135deg,#ff9a9e,#fad0c4); }
        .loc-sadat { background:linear-gradient(135deg,#a18cd1,#fbc2eb); }
        .loc-other { background:linear-gradient(135deg,#a8edea,#fed6e3); }
        .booked .venue-header { background:linear-gradient(135deg,#11998e,#38ef7d) !important; }
        .booked { border:3px solid #11998e; }
        .rejected .venue-header { background:linear-gradient(135deg,#636e72,#b2bec3) !important; opacity:0.8; }
        footer { text-align:center; padding:24px; color:white; font-size:0.9em; }
        .modal { display:none; position:fixed; z-index:1000; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.9); }
        .modal.show { display:flex; justify-content:center; align-items:center; }
        .modal img { max-width:90%; max-height:90%; border-radius:8px; }
        .modal-close { position:absolute; top:20px; right:30px; color:white; font-size:40px; cursor:pointer; }
        @media (max-width:600px) { .venue-grid { grid-template-columns:1fr; } .filters { flex-direction:column; } .filters input, .filters select { width:100%; } }
    </style>
</head>
<body>
<div class="container">
    <header>
        <h1>🏕️ قاعدة بيانات بيوت المعسكرات</h1>
        <p class="subtitle">كنيسة العذراء ومارجرجس بمدينتي - لجنة معسكرات ٢٠٢٥</p>
        <p class="last-updated">آخر تحديث: ٢٤ ديسمبر ٢٠٢٤</p>
        <div class="stats">
            <span class="stat">📍 إجمالي البيوت: <span id="totalCount">{total}</span></span>
            <span class="stat">✅ تمت الزيارة: <span id="visitedCount">{visited}</span></span>
            <span class="stat">🎯 المختار ٢٠٢٥: بيت العذراء ويوسف النجار</span>
        </div>
    </header>
    
    <div class="filters">
        <input type="text" id="searchInput" placeholder="🔍 بحث بالاسم أو الموقع أو أي نص..." onkeyup="filterVenues()">
        <select id="statusFilter" onchange="filterVenues()">
            <option value="">كل الحالات</option>
            <option value="booked">✅ محجوز 2025</option>
            <option value="visited">👁️ تمت الزيارة</option>
            <option value="available">📋 متاح</option>
            <option value="rejected">❌ مرفوض/غير متاح</option>
        </select>
    </div>

    <div class="venue-grid" id="venueGrid">
{venue_cards}
    </div>

    <footer>
        <p>لجنة معسكرات ٢٠٢٥ ⛺</p>
        <p>كنيسة العذراء ومارجرجس بمدينتي</p>
    </footer>
</div>

<div id="imageModal" class="modal" onclick="closeModal()">
    <span class="modal-close">&times;</span>
    <img id="modalImage" src="">
</div>

<script>
function filterVenues() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const status = document.getElementById('statusFilter').value;
    const cards = document.querySelectorAll('.venue-card');
    let shown = 0;
    
    cards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const cardStatus = card.getAttribute('data-status');
        
        let matchSearch = search === '' || text.includes(search);
        let matchStatus = status === '' || cardStatus === status;
        
        if (matchSearch && matchStatus) {
            card.style.display = 'block';
            shown++;
        } else {
            card.style.display = 'none';
        }
    });
    
    document.getElementById('totalCount').textContent = shown;
}

function toggleDetails(btn) {
    const body = btn.parentElement;
    const details = body.querySelector('.details');
    const gallery = body.querySelector('.gallery');
    if (details) details.classList.toggle('show');
    if (gallery) gallery.classList.toggle('show');
}

function openModal(src) {
    document.getElementById('modalImage').src = src;
    document.getElementById('imageModal').classList.add('show');
}

function closeModal() {
    document.getElementById('imageModal').classList.remove('show');
}
</script>
</body>
</html>'''

# Use replace for placeholders
html = html_template.replace('{total}', str(len(venues))).replace('{visited}', str(visited_count)).replace('{venue_cards}', venue_cards)

# Write HTML to camps_database folder
output_file = OUTPUT_DIR / "index.html"
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"\n✅ Generated:")
print(f"   {output_file}")
print(f"   {IMAGES_DIR}")
print(f"\nOpen: file:///{str(output_file).replace(chr(92), '/')}")
