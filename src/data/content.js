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
  sloganHi: 'पढ़ेंगे और हक के लिए लड़ेंगे',
  sloganEn: 'We will study — and we will fight for our rights',
  regNo: '24/2015-16',
  logo: '/acs_logo.jpeg',
  address: 'Karamtoli, Ranchi, Jharkhand – 834001',
  phones: ['+91 94315 20796', '+91 89692 66911'],
  email: 'adivasichhatrasanghjh@gmail.com',
}

// Home hero slider. Each src has -640.webp and -1200.webp copies resized from public/photos/*.jpeg
export const heroPhotos = [
  { src: '/photos/slides/4', alt: 'Students performing a traditional dance in red-and-white attire' },
  { src: '/photos/slides/5', alt: 'Students in traditional dress marching in a procession' },
  { src: '/photos/slides/6', alt: 'A Sangh leader addressing a gathering' },
  { src: '/photos/slides/2', alt: 'Students gathered with the Sangh banner', position: 'center 40%' },
  { src: '/photos/slides/3', alt: 'Students seated in a college hall' },
  { src: '/photos/slides/7', alt: 'Paying tribute at a statue', position: 'center 35%' },
  { src: '/photos/slides/1', alt: 'Sangh members welcoming a guest with a bouquet', position: 'center 25%' },
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

// TODO: replace with the current office bearers
export const leaders = [
  { role: 'Central President', roleHi: 'केंद्रीय अध्यक्ष' },
  { role: 'Central Working President', roleHi: 'केंद्रीय कार्यकारी अध्यक्ष' },
  { role: 'Central Convener', roleHi: 'केंद्रीय संयोजक' },
  { role: 'General Secretary', roleHi: 'महासचिव' },
]

export const districts = [
  'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Garhwa', 'Giridih',
  'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 'Lohardaga',
  'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahibganj', 'Saraikela-Kharsawan', 'Simdega',
  'West Singhbhum',
]
