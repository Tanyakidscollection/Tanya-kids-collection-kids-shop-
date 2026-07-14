const storyGalleries = {"happy": ["assets/images/img-063.jpg", "assets/images/img-064.jpg", "assets/images/img-065.jpg", "assets/images/img-066.jpg", "assets/images/img-067.jpg", "assets/images/img-068.jpg", "assets/images/img-069.jpg", "assets/images/img-070.jpg", "assets/images/img-071.jpg", "assets/images/img-072.jpg", "assets/images/img-073.jpg", "assets/images/img-074.jpg", "assets/images/img-075.jpg", "assets/images/img-076.jpg", "assets/images/img-077.jpg", "assets/images/img-078.jpg", "assets/images/img-079.jpg", "assets/images/img-080.jpg", "assets/images/img-081.jpg", "assets/images/img-082.jpg"], "reviews": ["assets/images/img-083.jpg", "assets/images/img-084.jpg", "assets/images/img-085.jpg", "assets/images/img-086.jpg", "assets/images/img-087.jpg", "assets/images/img-088.jpg", "assets/images/img-089.jpg", "assets/images/img-090.jpg", "assets/images/img-091.jpg", "assets/images/img-092.jpg", "assets/images/img-093.jpg", "assets/images/img-094.jpg", "assets/images/img-095.jpg", "assets/images/img-096.jpg", "assets/images/img-097.jpg", "assets/images/img-098.jpg", "assets/images/img-099.jpg", "assets/images/img-100.jpg", "assets/images/img-101.jpg", "assets/images/img-102.jpg"], "momdaughter": ["assets/images/img-103.jpg", "assets/images/img-104.jpg", "assets/images/img-105.jpg", "assets/images/img-106.jpg", "assets/images/img-107.jpg", "assets/images/img-108.jpg", "assets/images/img-109.jpg", "assets/images/img-110.jpg"]};
/* ---------- Category filter tabs ---------- */
(function(){
  const tabs = document.querySelectorAll('.cat-tab');
  const cards = document.querySelectorAll('#productGrid .card');
  const emptyMsg = document.getElementById('catEmpty');

  function filterCategory(cat){
    let visibleCount = 0;
    cards.forEach(card => {
      if(card.getAttribute('data-category') === cat){
        card.classList.remove('cat-hidden');
        visibleCount++;
      } else {
        card.classList.add('cat-hidden');
      }
    });
    emptyMsg.classList.toggle('show', visibleCount === 0);
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterCategory(tab.getAttribute('data-cat'));
    });
  });

  // Default view: Girls Wear tab is active on load per markup above.
  filterCategory('girls');
})();

let currentStoryKey = null;
let currentStoryIndex = 0;

function openStory(key){
  const imgs = storyGalleries[key];
  if(!imgs || !imgs.length) return;
  currentStoryKey = key;
  currentStoryIndex = 0;
  renderStoryBar(imgs.length);
  showStoryImage();
  document.getElementById('storyModal').classList.add('open');
}

function closeStory(){
  document.getElementById('storyModal').classList.remove('open');
}

function storyNav(dir){
  const imgs = storyGalleries[currentStoryKey];
  if(!imgs) return;
  currentStoryIndex += dir;
  if(currentStoryIndex < 0) currentStoryIndex = 0;
  if(currentStoryIndex >= imgs.length){ closeStory(); return; }
  showStoryImage();
}

function showStoryImage(){
  const imgs = storyGalleries[currentStoryKey];
  document.getElementById('storyModalImg').src = imgs[currentStoryIndex];
  document.getElementById('storyModalCaption').textContent = (currentStoryIndex+1) + ' / ' + imgs.length;
  const segs = document.querySelectorAll('#storyModalBar .seg');
  segs.forEach((seg, i) => seg.classList.toggle('done', i <= currentStoryIndex));
}

function renderStoryBar(count){
  const bar = document.getElementById('storyModalBar');
  bar.innerHTML = '';
  for(let i=0;i<count;i++){
    const seg = document.createElement('div');
    seg.className = 'seg';
    seg.innerHTML = '<i></i>';
    bar.appendChild(seg);
  }
}

document.getElementById('storyModal').addEventListener('click', function(e){
  if(e.target === this) closeStory();
});

/* ---------- Product image swipe (Instagram-style) dots sync ---------- */
document.querySelectorAll('.imgwrap.swipe').forEach(wrap => {
  const track = wrap.querySelector('.swipe-track');
  const dots = wrap.querySelectorAll('.swipe-dots .dot');
  if(!track || !dots.length) return;
  let ticking = false;
  track.addEventListener('scroll', () => {
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const idx = Math.round(track.scrollLeft / track.clientWidth);
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      ticking = false;
    });
  }, { passive:true });
});

/* ---------- Lightbox (tap photo to zoom, Flipkart-style) ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxTrack = document.getElementById('lightboxTrack');
const lightboxDots = document.getElementById('lightboxDots');
let lbTicking = false;

function openLightbox(imgs, startIndex){
  lightboxTrack.innerHTML = '';
  lightboxDots.innerHTML = '';
  imgs.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    lightboxTrack.appendChild(img);
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === startIndex ? ' active' : '');
    lightboxDots.appendChild(dot);
  });
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    lightboxTrack.scrollLeft = startIndex * lightboxTrack.clientWidth;
  });
}

function closeLightbox(){
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

lightboxTrack.addEventListener('scroll', () => {
  if(lbTicking) return;
  lbTicking = true;
  requestAnimationFrame(() => {
    const idx = Math.round(lightboxTrack.scrollLeft / lightboxTrack.clientWidth);
    lightboxDots.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    lbTicking = false;
  });
}, { passive:true });

lightbox.addEventListener('click', function(e){
  if(e.target === this) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') closeLightbox();
});

document.querySelectorAll('.imgwrap.swipe').forEach(wrap => {
  const track = wrap.querySelector('.swipe-track');
  if(!track) return;
  const imgEls = Array.from(track.querySelectorAll('img'));
  const srcs = imgEls.map(im => im.src);
  imgEls.forEach((img, i) => {
    img.addEventListener('click', () => openLightbox(srcs, i));
  });
});

const translations = {
  en: {
    tagline: "Ethnic Wear for Boys, Girls & Parents",
    chip1: "Boys Wear", chip2: "Girls Wear", chip3: "Parents Collection",
    marquee: "All India Delivery Available | Boys • Girls • Parents Ethnic Wear | All India Delivery Available | Boys • Girls • Parents Ethnic Wear |",
    sectionTitle: "Our Collection",
    sectionSub: "Tap Order Now on any dress to order via WhatsApp",
    orderBtn: "Order Now",
    deliveryBanner: "All India Delivery Available",
    offersTitle: "Premium Dress Offers",
    offersSub: "Best Quality | Trendy Collection | Affordable Prices",
    offer1: "₹550", offer2: "₹950", offer3: "₹1,200", offer4: "₹1,600",
    specialOffer: "🎁 Special Offer: Buy 4 Dresses & Get 1 Dress FREE!",
    footer: "Boys • Girls • Parents Ethnic Wear — Tap WhatsApp button to order"
  },
  hi: {
    tagline: "लड़कों, लड़कियों और माता-पिता के लिए एथनिक वियर",
    chip1: "लड़कों के कपड़े", chip2: "लड़कियों के कपड़े", chip3: "माता-पिता कलेक्शन",
    marquee: "ऑल इंडिया डिलीवरी उपलब्ध है | लड़कों • लड़कियों • माता-पिता एथनिक वियर | ऑल इंडिया डिलीवरी उपलब्ध है | लड़कों • लड़कियों • माता-पिता एथनिक वियर |",
    sectionTitle: "हमारा कलेक्शन",
    sectionSub: "किसी भी ड्रेस पर Order Now दबाकर WhatsApp पर ऑर्डर करें",
    orderBtn: "ऑर्डर करें",
    deliveryBanner: "ऑल इंडिया डिलीवरी उपलब्ध है",
    offersTitle: "प्रीमियम ड्रेस ऑफर्स",
    offersSub: "बेस्ट क्वालिटी | ट्रेंडी कलेक्शन | किफायती दाम",
    offer1: "₹550", offer2: "₹950", offer3: "₹1,200", offer4: "₹1,600",
    specialOffer: "🎁 स्पेशल ऑफर: 4 ड्रेस खरीदें और 1 ड्रेस FREE पाएं!",
    footer: "लड़कों • लड़कियों • माता-पिता एथनिक वियर — ऑर्डर के लिए WhatsApp बटन दबाएं"
  },
  gu: {
    tagline: "છોકરાઓ, છોકરીઓ અને માતા-પિતા માટે એથનિક વેર",
    chip1: "છોકરાઓના કપડાં", chip2: "છોકરીઓના કપડાં", chip3: "પેરેન્ટ્સ કલેક્શન",
    marquee: "ઓલ ઇન્ડિયા ડિલિવરી ઉપલબ્ધ છે | છોકરાઓ • છોકરીઓ • પેરેન્ટ્સ એથનિક વેર | ઓલ ઇન્ડિયા ડિલિવરી ઉપલબ્ધ છે | છોકરાઓ • છોકરીઓ • પેરેન્ટ્સ એથનિક વેર |",
    sectionTitle: "અમારું કલેક્શન",
    sectionSub: "કોઈપણ ડ્રેસ પર Order Now દબાવીને WhatsApp પર ઓર્ડર કરો",
    orderBtn: "ઓર્ડર કરો",
    deliveryBanner: "ઓલ ઇન્ડિયા ડિલિવરી ઉપલબ્ધ છે",
    offersTitle: "પ્રીમિયમ ડ્રેસ ઓફર્સ",
    offersSub: "બેસ્ટ ક્વોલિટી | ટ્રેન્ડી કલેક્શન | પોસાય તેવા ભાવ",
    offer1: "₹550", offer2: "₹950", offer3: "₹1,200", offer4: "₹1,600",
    specialOffer: "🎁 સ્પેશિયલ ઓફર: 4 ડ્રેસ ખરીદો અને 1 ડ્રેસ FREE મેળવો!",
    footer: "છોકરાઓ • છોકરીઓ • પેરેન્ટ્સ એથનિક વેર — ઓર્ડર માટે WhatsApp બટન દબાવો"
  },
  ta: {
    tagline: "சிறுவர்கள், சிறுமிகள் மற்றும் பெற்றோருக்கான பாரம்பரிய உடைகள்",
    chip1: "சிறுவர் உடைகள்", chip2: "சிறுமிகள் உடைகள்", chip3: "பெற்றோர் கலெக்ஷன்",
    marquee: "இந்தியா முழுவதும் டெலிவரி உள்ளது | சிறுவர் • சிறுமிகள் • பெற்றோர் பாரம்பரிய உடைகள் | இந்தியா முழுவதும் டெலிவரி உள்ளது | சிறுவர் • சிறுமிகள் • பெற்றோர் பாரம்பரிய உடைகள் |",
    sectionTitle: "எங்கள் சேகரிப்பு",
    sectionSub: "எந்த டிரெஸ்ஸிலும் Order Now அழுத்தி WhatsApp மூலம் ஆர்டர் செய்யவும்",
    orderBtn: "ஆர்டர் செய்யவும்",
    deliveryBanner: "இந்தியா முழுவதும் டெலிவரி உள்ளது",
    offersTitle: "பிரீமியம் டிரெஸ் ஆஃபர்கள்",
    offersSub: "சிறந்த தரம் | டிரெண்டி சேகரிப்பு | மலிவு விலை",
    offer1: "₹550", offer2: "₹950", offer3: "₹1,200", offer4: "₹1,600",
    specialOffer: "🎁 ஸ்பெஷல் ஆஃபர்: 4 டிரெஸ் வாங்கி 1 டிரெஸ் FREE பெறுங்கள்!",
    footer: "சிறுவர் • சிறுமிகள் • பெற்றோர் பாரம்பரிய உடைகள் — ஆர்டர் செய்ய WhatsApp பட்டனை அழுத்தவும்"
  },
  te: {
    tagline: "అబ్బాయిలు, అమ్మాయిలు మరియు తల్లిదండ్రుల కోసం ఎథ్నిక్ వేర్",
    chip1: "అబ్బాయిల దుస్తులు", chip2: "అమ్మాయిల దుస్తులు", chip3: "పేరెంట్స్ కలెక్షన్",
    marquee: "ఆల్ ఇండియా డెలివరీ అందుబాటులో ఉంది | అబ్బాయిలు • అమ్మాయిలు • పేరెంట్స్ ఎథ్నిక్ వేర్ | ఆల్ ఇండియా డెలివరీ అందుబాటులో ఉంది | అబ్బాయిలు • అమ్మాయిలు • పేరెంట్స్ ఎథ్నిక్ వేర్ |",
    sectionTitle: "మా కలెక్షన్",
    sectionSub: "ఏదైనా డ్రెస్ మీద Order Now నొక్కి WhatsApp ద్వారా ఆర్డర్ చేయండి",
    orderBtn: "ఆర్డర్ చేయండి",
    deliveryBanner: "ఆల్ ఇండియా డెలివరీ అందుబాటులో ఉంది",
    offersTitle: "ప్రీమియం డ్రెస్ ఆఫర్స్",
    offersSub: "బెస్ట్ క్వాలిటీ | ట్రెండీ కలెక్షన్ | తక్కువ ధరలు",
    offer1: "₹550", offer2: "₹950", offer3: "₹1,200", offer4: "₹1,600",
    specialOffer: "🎁 స్పెషల్ ఆఫర్: 4 డ్రెస్‌లు కొనండి & 1 డ్రెస్ FREE పొందండి!",
    footer: "అబ్బాయిలు • అమ్మాయిలు • పేరెంట్స్ ఎథ్నిక్ వేర్ — ఆర్డర్ కోసం WhatsApp బటన్ నొక్కండి"
  },
  kn: {
    tagline: "ಹುಡುಗರು, ಹುಡುಗಿಯರು ಮತ್ತು ಪೋಷಕರಿಗಾಗಿ ಎಥ್ನಿಕ್ ವೇರ್",
    chip1: "ಹುಡುಗರ ಬಟ್ಟೆಗಳು", chip2: "ಹುಡುಗಿಯರ ಬಟ್ಟೆಗಳು", chip3: "ಪೋಷಕರ ಕಲೆಕ್ಷನ್",
    marquee: "ಆಲ್ ಇಂಡಿಯಾ ಡೆಲಿವರಿ ಲಭ್ಯವಿದೆ | ಹುಡುಗರು • ಹುಡುಗಿಯರು • ಪೋಷಕರ ಎಥ್ನಿಕ್ ವೇರ್ | ಆಲ್ ಇಂಡಿಯಾ ಡೆಲಿವರಿ ಲಭ್ಯವಿದೆ | ಹುಡುಗರು • ಹುಡುಗಿಯರು • ಪೋಷಕರ ಎಥ್ನಿಕ್ ವೇರ್ |",
    sectionTitle: "ನಮ್ಮ ಕಲೆಕ್ಷನ್",
    sectionSub: "ಯಾವುದೇ ಡ್ರೆಸ್ ಮೇಲೆ Order Now ಒತ್ತಿ WhatsApp ಮೂಲಕ ಆರ್ಡರ್ ಮಾಡಿ",
    orderBtn: "ಆರ್ಡರ್ ಮಾಡಿ",
    deliveryBanner: "ಆಲ್ ಇಂಡಿಯಾ ಡೆಲಿವರಿ ಲಭ್ಯವಿದೆ",
    offersTitle: "ಪ್ರೀಮಿಯಂ ಡ್ರೆಸ್ ಆಫರ್‌ಗಳು",
    offersSub: "ಬೆಸ್ಟ್ ಕ್ವಾಲಿಟಿ | ಟ್ರೆಂಡಿ ಕಲೆಕ್ಷನ್ | ಕೈಗೆಟುಕುವ ಬೆಲೆಗಳು",
    offer1: "₹550", offer2: "₹950", offer3: "₹1,200", offer4: "₹1,600",
    specialOffer: "🎁 ಸ್ಪೆಷಲ್ ಆಫರ್: 4 ಡ್ರೆಸ್‌ಗಳನ್ನು ಖರೀದಿಸಿ & 1 ಡ್ರೆಸ್ FREE ಪಡೆಯಿರಿ!",
    footer: "ಹುಡುಗರು • ಹುಡುಗಿಯರು • ಪೋಷಕರ ಎಥ್ನಿಕ್ ವೇರ್ — ಆರ್ಡರ್ ಮಾಡಲು WhatsApp ಬಟನ್ ಒತ್ತಿ"
  }
};

function setLang(lang){
  const dict = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if(dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-lang') === lang);
  });
  document.documentElement.lang = lang;
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.getAttribute('data-lang')));
});