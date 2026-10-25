import {
  BookOpen,
  GraduationCap,
  Landmark,
  Languages,
  Scale,
  ShieldCheck,
  Sprout,
  Users,
} from 'lucide-react'

export const org = {
  nameHi: 'आदिवासी छात्र संघ',
  stateHi: 'झारखण्ड',
  nameEn: 'Adivasi Chhatra Sangh',
  stateEn: 'Jharkhand',
  sloganHi: 'पढ़ेंगे, लिखेंगे और हक के लिए लड़ेंगे',
  sloganEn: 'We will read, we will write — and we will fight for our rights',
  regNo: '24/2015-16',
  logo: '/acs_logo.jpeg',
  address: 'Karamtoli, Ranchi, Jharkhand – 834001',
  // Shown as "number (name)". Leave name empty to show the number alone.
  phones: [
    { number: '+91 94315 20796', name: 'Sushil Oraon' },
    { number: '+91 77658 60679', name: 'Sumit Oraon' },
    { number: '+91 62029 89235', name: 'Manoj Oraon' },
    { number: '+91 89692 66911', name: 'Vivek Tirkey' },
  ],
  email: 'adivasichhatrasanghjh@gmail.com',
}

// Web app URL of the Google Apps Script that saves Contact and Join forms to the Google Sheet
export const formsEndpoint =
  'https://script.google.com/macros/s/AKfycbycMDQYe-qxyDcTDJO_K4RwPZDCJV7vcAlh9ZFWRa8x47K6f9h-4EGTOBfAlDreo5tt/exec'

// Social profiles. Entries with an empty url are hidden.
export const socials = [
  { name: 'Instagram', url: 'https://www.instagram.com/ranchi__life/' },
  { name: 'Facebook', url: 'https://www.facebook.com/share/1DncCsHLVh/' },
  { name: 'YouTube', url: 'https://www.youtube.com/@ranchilife0' },
  { name: 'X', url: 'https://x.com/ranchi_life' },
]

// Home hero slider. Each src has -640.webp and -1200.webp copies resized from public/photos/*.jpeg
export const heroPhotos = [
  {
    src: '/photos/slides/2',
    alt: 'Central committee members with the Sangh banner at a garlanded statue',
    position: 'center 40%',
  },
  { src: '/photos/slides/4', alt: 'Students performing a traditional dance in red-and-white attire' },
  { src: '/photos/slides/19', alt: 'Students gathered in front of the Sangh banner at DSPMU, Ranchi' },
  { src: '/photos/slides/5', alt: 'Students in traditional dress marching in a procession' },
  { src: '/photos/slides/38', alt: 'Students holding a sit-in protest at DSPMU, Ranchi' },
  { src: '/photos/slides/6', alt: 'A Sangh leader addressing a gathering' },
  { src: '/photos/slides/3', alt: 'Students seated in a college hall' },
  { src: '/photos/slides/7', alt: 'Paying tribute at a statue', position: 'center 35%' },
  { src: '/photos/slides/1', alt: 'Sangh members welcoming a guest with a bouquet', position: 'center 25%' },
]

// Home gallery. Each src has -sm.webp (640 wide) and -lg.webp (w × h) copies made from public/photos/pics/*.jpeg.
// span: 'feature' = 2×2 tile, 'tall' = 1×2 tile. The first `galleryPreview` tiles fill exactly 4 rows on desktop.
export const galleryPreview = 11
export const galleryPhotos = [
  { src: '/photos/gallery/10', w: 1280, h: 960, span: 'feature', alt: 'Thousands gather at a rally ground in traditional red-and-white attire' },
  { src: '/photos/gallery/34', w: 960, h: 1280, span: 'tall', alt: 'Dancers in feathered headgear perform a traditional dance' },
  { src: '/photos/gallery/22', w: 1280, h: 960, alt: 'Students march with green flags demanding the e-Kalyan scholarship' },
  { src: '/photos/gallery/18', w: 1280, h: 960, alt: 'Lohardaga district committee members with the Sangh banner' },
  { src: '/photos/gallery/33', w: 1280, h: 960, alt: 'A packed stadium waving red-and-white flags' },
  { src: '/photos/gallery/29', w: 960, h: 1280, span: 'tall', alt: 'A long procession of women in traditional sarees through a town street' },
  { src: '/photos/gallery/36', w: 1280, h: 960, alt: 'Students sign the e-Kalyan scholarship petition banner at Ranchi College (DSPMU)' },
  { src: '/photos/gallery/14', w: 1280, h: 960, alt: 'Rally participants carrying traditional bows and flags' },
  { src: '/photos/gallery/38', w: 1280, h: 720, alt: 'Students stage a sit-in protest outside DSPMU' },
  { src: '/photos/gallery/39', w: 1280, h: 960, alt: 'Dharna march with the Sangh banner demanding scholarship payments' },
  { src: '/photos/gallery/30', w: 1280, h: 575, alt: 'East Singhbhum district committee members raise slogans' },
  { src: '/photos/gallery/31', w: 1280, h: 721, span: 'feature', alt: 'A vast seated gathering at a mass rally' },
  { src: '/photos/gallery/19', w: 1280, h: 960, alt: 'Students crowd around the signature campaign banner at Ranchi College' },
  { src: '/photos/gallery/13', w: 720, h: 1280, span: 'tall', alt: 'A young Sangh leader speaks from the stage' },
  { src: '/photos/gallery/17', w: 1280, h: 960, span: 'feature', alt: 'A large assembly of students with the Sangh banner on a college lawn' },
  { src: '/photos/gallery/32', w: 1179, h: 667, alt: 'Central committee members gathered on a rocky hillside with green flags' },
  { src: '/photos/gallery/37', w: 1280, h: 960, alt: 'Protest at a town square against encroachment' },
  { src: '/photos/gallery/20', w: 960, h: 1280, span: 'tall', alt: 'A student signs the scholarship petition banner' },
  { src: '/photos/gallery/35', w: 1280, h: 960, alt: 'Women hold placards at a rally ground' },
  { src: '/photos/gallery/11', w: 1280, h: 723, alt: 'A Sangh leader addresses protesters with a microphone' },
  { src: '/photos/gallery/12', w: 1280, h: 720, alt: 'A speaker addresses the crowd at a rally' },
  { src: '/photos/gallery/28', w: 1024, h: 1280, span: 'tall', alt: 'Students hoist the flag outside a college building' },
  { src: '/photos/gallery/26', w: 1280, h: 960, alt: 'A student delegation presents a bouquet to the Divisional Commissioner, Ranchi' },
  { src: '/photos/gallery/23', w: 1280, h: 1137, alt: 'Sangh representatives meet an official in his office' },
  { src: '/photos/gallery/24', w: 1280, h: 960, alt: 'Students at a felicitation programme in an auditorium' },
  { src: '/photos/gallery/21', w: 960, h: 1280, span: 'tall', alt: 'Paying floral tribute at a memorial' },
  { src: '/photos/gallery/15', w: 1280, h: 960, alt: 'Guests plant a sapling at a Sangh programme' },
  { src: '/photos/gallery/8', w: 720, h: 1280, span: 'tall', alt: 'Students walk with a tribute banner for Dishom Guru Shibu Soren' },
  { src: '/photos/gallery/27', w: 1280, h: 720, alt: 'Tribute march for Dishom Guru Shibu Soren' },
  { src: '/photos/gallery/25', w: 1280, h: 960, alt: 'Students gathered outside a college campus' },
  { src: '/photos/gallery/9', w: 1280, h: 720, alt: 'Sangh members pose together under palm trees' },
  { src: '/photos/gallery/16', w: 1280, h: 960, alt: 'Sangh leaders together on a highway at night' },
]

export const navLinks = [
  { to: '/', label: 'Home', labelHi: 'मुख्य पृष्ठ' },
  { to: '/about', label: 'About', labelHi: 'परिचय' },
  { to: '/campaigns', label: 'Campaigns', labelHi: 'अभियान' },
  { to: '/news', label: 'News', labelHi: 'समाचार' },
  { to: '/join', label: 'Join Us', labelHi: 'सदस्य बनें' },
  { to: '/contact', label: 'Contact', labelHi: 'संपर्क' },
]

export const stats = [
  { value: '2015-16', label: 'Registered organisation' },
  { value: '24', label: 'Districts of Jharkhand' },
  { value: '5', label: 'States in awareness drive' },
  { value: '10+', label: 'Years of struggle' },
]

export const pillars = [
  {
    icon: GraduationCap,
    title: 'Education First',
    titleHi: 'शिक्षा',
    text: 'Affordable fees, scholarships, hostels and quality teaching for every tribal student — from village schools to universities.',
  },
  {
    icon: Scale,
    title: 'Constitutional Rights',
    titleHi: 'अधिकार',
    text: 'Defending the Fifth Schedule, PESA, CNT/SPT Acts and reservation so that Adivasi communities keep their land and voice.',
  },
  {
    icon: Sprout,
    title: 'Identity & Culture',
    titleHi: 'पहचान',
    text: 'Preserving Sarna faith, tribal languages, festivals and traditions — Sarhul, Karma, Sohrai — for the next generation.',
  },
  {
    icon: Users,
    title: 'Student Unity',
    titleHi: 'एकता',
    text: 'Building disciplined, democratic student units in colleges, hostels and districts across Jharkhand and beyond.',
  },
]

export const symbolism = [
  {
    title: 'Bow & Arrows',
    titleHi: 'धनुष-बाण',
    text: 'The traditional weapon of Adivasi ancestors — a symbol of courage, self-reliance and the struggle for rights.',
  },
  {
    title: 'Rising Sun',
    titleHi: 'उगता सूरज',
    text: 'A new dawn for tribal society, brought about by awareness and education.',
  },
  {
    title: 'Open Book & Pen',
    titleHi: 'पुस्तक और कलम',
    text: 'Knowledge is our strongest tool — we study to understand, and we write to be heard.',
  },
  {
    title: 'Green Circle',
    titleHi: 'हरा वृत्त',
    text: 'The forests, hills and rivers of Jharkhand — the land that Adivasi communities have protected for centuries.',
  },
]

export const campaigns = [
  {
    icon: Landmark,
    title: 'Sarna Dharma Code',
    titleHi: 'सरना धर्म कोड',
    text: 'Demanding a separate Sarna religion column in the national census so that the faith and population of tribal communities are recorded correctly.',
    tag: 'Identity',
  },
  {
    icon: ShieldCheck,
    title: 'Fair Delimitation & Fifth Schedule',
    titleHi: 'परिसीमन और पाँचवीं अनुसूची',
    text: 'Opposing any delimitation that reduces reserved tribal seats, and demanding full implementation of Fifth Schedule protections.',
    tag: 'Political Rights',
  },
  {
    icon: BookOpen,
    title: '1932 Khatiyan Domicile Policy',
    titleHi: '1932 खतियान आधारित स्थानीय नीति',
    text: 'Pressing for the 1932 land-record based domicile policy so that local youth get their rightful share in jobs and opportunities.',
    tag: 'Employment',
  },
  {
    icon: Languages,
    title: 'Tribal & Regional Languages',
    titleHi: 'जनजातीय एवं क्षेत्रीय भाषाएँ',
    text: 'Giving due place to Kurukh, Mundari, Santhali, Ho, Kharia and other Jharkhandi languages in exams such as JTET, JPSC and JSSC.',
    tag: 'Language',
  },
  {
    icon: GraduationCap,
    title: 'Transparent Recruitment Exams',
    titleHi: 'पारदर्शी भर्ती परीक्षाएँ',
    text: 'Raising student concerns on JPSC and JSSC exams and demanding timely, fair and transparent recruitment.',
    tag: 'Education',
  },
  {
    icon: Scale,
    title: 'Affordable Higher Education',
    titleHi: 'सस्ती उच्च शिक्षा',
    text: 'Protesting arbitrary fee hikes in universities and fighting for better hostels, scholarships and campus facilities.',
    tag: 'Education',
  },
]

// Press coverage gathered from public news reports
export const news = [
  {
    date: 'Oct 2026',
    title: 'Organisational meeting plans JSSC gherao and statewide movement',
    source: 'Prabhat Khabar',
    url: 'https://www.prabhatkhabar.com/state/jharkhand/ranchi/tribal-student-union-meeting-expansion',
  },
  {
    date: 'Aug 2026',
    title: 'ACS warns of agitation over Sarna Dharma Code and delimitation',
    source: 'Jharkhand Headlines',
    url: 'https://jharkhandheadlines.com/sarna-dharma-code-delimitation-adivasi-chhatra-sangh/',
  },
  {
    date: 'Aug 2026',
    title: 'ACS issues statement on student protests over the JPSC exam',
    source: 'ETV Bharat',
    url: 'https://www.etvbharat.com/hi/state/tribal-students-union-issued-statement-on-students-protest-regarding-jpsc-issue-jhs26080104887',
  },
  {
    date: 'Jun 2026',
    title: 'Memorandum submitted to the Governor on delimitation and Sarna Dharma Code',
    source: 'The Photon News',
    url: 'https://thephotonnews.com/tribal-student-union-submits-memorandum-governor-delimitation-sarna-religion-code-jharkhand-2/',
  },
  {
    date: 'May 2026',
    title: 'ACS warns of agitation over language list in JTET',
    source: 'ETV Bharat',
    url: 'https://www.etvbharat.com/hi/state/tribal-student-union-issued-warning-for-agitation-over-language-dispute-in-jharkhand-jhs26052103497',
  },
  {
    date: 'Nov 2025',
    title: 'Protest against fee hike in the Commerce department at DSPMU',
    source: 'ETV Bharat',
    url: 'https://www.etvbharat.com/hi/state/tribal-students-union-protests-against-fee-hike-in-commerce-department-at-dspmu-jharkhand-news-jhs25112404112',
  },
]

export const leaders = [
  {
    name: 'Sushil Oraon',
    role: 'Central President',
    roleHi: 'केंद्रीय अध्यक्ष',
    photo: '/photos/leadership/sushil_oraon.webp',
  },
  { name: 'Manoj Oraon', role: 'Central Working President', roleHi: 'केंद्रीय कार्यकारी अध्यक्ष' },
  { name: 'Jaleshwar Bhagat', role: 'Treasurer', roleHi: 'कोषाध्यक्ष' },
  { name: 'Pradeep Munda', role: 'Secretary', roleHi: 'सचिव' },
]

export const districts = [
  'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Garhwa', 'Giridih',
  'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 'Lohardaga',
  'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahibganj', 'Saraikela-Kharsawan', 'Simdega',
  'West Singhbhum',
]
