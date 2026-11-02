import { org } from './content'

const lastUpdated = '2 November 2026'
const name = org.nameEn
const phoneList = org.phones.map((p) => p.number).join(', ')

export const terms = {
  slug: 'terms',
  title: 'Terms & Conditions',
  titleHi: 'नियम और शर्तें',
  lastUpdated,
  intro: `These terms apply to your use of this website and to applying for membership of ${name}, ${org.stateEn} (Registration No. ${org.regNo}). By using the website or applying for membership you agree to them.`,
  sections: [
    {
      heading: 'About this website',
      paragraphs: [
        `This website is run by ${name}, ${org.stateEn} (the "Sangh"), a registered student organisation. The content on the website is provided for general information about the Sangh, its campaigns and its activities.`,
      ],
    },
    {
      heading: 'Membership',
      paragraphs: [
        'Membership is open to tribal students studying in schools, colleges and universities. To apply, fill in the Join form at /join on this website.',
        'Paying the membership fee does not by itself guarantee membership. The Sangh reviews every application, and its district unit contacts the applicant.',
      ],
    },
    {
      heading: 'Membership fee and payment',
      paragraphs: [
        'There is a one-time membership fee of ₹21 (Indian Rupees) per person, paid online after the Join form is submitted.',
        'Payments are processed by Cashfree Payments India Pvt. Ltd., an RBI-authorised payment aggregator. You can pay by UPI, debit/credit card or net banking.',
        'The fee is non-refundable once paid, except in the cases described in our Refund & Cancellation Policy.',
      ],
    },
    {
      heading: 'Your responsibilities',
      bullets: [
        'You must give true and correct information in the Join and Contact forms.',
        'The Sangh may reject an application that contains false information or that goes against the aims of the Sangh.',
      ],
    },
    {
      heading: 'Governing law',
      paragraphs: [
        'These terms are governed by the laws of India. Any dispute is subject to the jurisdiction of the courts at Ranchi, Jharkhand.',
      ],
    },
    {
      heading: 'Changes to these terms',
      paragraphs: [
        'We may update these terms from time to time. The date at the top of this page shows when they were last updated.',
      ],
    },
  ],
}

export const privacy = {
  slug: 'privacy',
  title: 'Privacy Policy',
  titleHi: 'गोपनीयता नीति',
  lastUpdated,
  intro: `This policy explains what personal information ${name}, ${org.stateEn} collects through this website, how it is used and how it is protected.`,
  sections: [
    {
      heading: 'Information we collect',
      paragraphs: ['When you fill in the Join (membership) form we collect:'],
      bullets: [
        'Name, mobile number and email address',
        'District and address',
        'College or institution and course',
        'Your "why do you want to join" message',
      ],
    },
    {
      heading: 'Contact form',
      paragraphs: [
        'The Contact form collects your name and contact details, a subject, your message, and optional photos if you choose to attach them.',
      ],
    },
    {
      heading: 'How your information is stored',
      paragraphs: [
        `Form submissions are stored in the Sangh's Google account (Google Sheets and Google Drive). They are accessed only by office bearers of the Sangh.`,
      ],
    },
    {
      heading: 'How we use your information',
      paragraphs: [
        'We use your information only to process your membership, to contact you, and to organise the activities of the Sangh.',
      ],
    },
    {
      heading: 'Payments',
      paragraphs: [
        'The membership fee is paid through Cashfree Payments India Pvt. Ltd., an RBI-authorised payment aggregator, using UPI, debit/credit cards or net banking.',
        'The Sangh never sees or stores your card numbers, UPI PIN or bank login details.',
      ],
    },
    {
      heading: 'Sharing of information',
      paragraphs: [
        'We do not sell your information and we do not share it with anyone, except:',
      ],
      bullets: [
        'with Cashfree, to process your payment (your name, mobile number and email address), and',
        'where we are required to do so by law.',
      ],
    },
    {
      heading: 'Your choices',
      paragraphs: [
        'You may ask to view, correct or delete the information we hold about you by contacting the Sangh using the details below.',
      ],
    },
    {
      heading: 'Cookies',
      paragraphs: [
        'This website does not use advertising or tracking cookies. The admin page keeps a login token in your browser\'s session storage only, which is cleared when the browser tab is closed.',
      ],
    },
    {
      heading: 'Changes to this policy',
      paragraphs: [
        'We may update this policy from time to time. The date at the top of this page shows when it was last updated.',
      ],
    },
  ],
}

export const refund = {
  slug: 'refund-policy',
  title: 'Refund & Cancellation Policy',
  titleHi: 'रिफंड और रद्दीकरण नीति',
  lastUpdated,
  intro: `This policy applies to the one-time ₹21 membership fee paid to ${name}, ${org.stateEn} through this website.`,
  sections: [
    {
      heading: 'Membership fee',
      paragraphs: [
        'The membership fee is ₹21 (Indian Rupees) per person, paid once, online, after submitting the Join form. Payments are processed by Cashfree Payments India Pvt. Ltd. by UPI, debit/credit card or net banking.',
      ],
    },
    {
      heading: 'No refund once paid',
      paragraphs: [
        'The ₹21 fee is non-refundable once it has been paid successfully. This includes cases where the application is not approved, or where the member later leaves the Sangh.',
      ],
    },
    {
      heading: 'Cancellation',
      paragraphs: ['A payment cannot be cancelled once it has been made.'],
    },
    {
      heading: 'Exceptions',
      paragraphs: ['We will refund money in these cases, after verification:'],
      bullets: [
        'Money was debited from your account but the payment failed, or no membership application was recorded.',
        'You were charged more than once for the same application (the extra amount is refunded).',
      ],
    },
    {
      heading: 'How and when refunds are made',
      paragraphs: [
        'Approved refunds are sent to the original payment method within 7–10 working days after verification.',
      ],
    },
    {
      heading: 'How to raise an issue',
      paragraphs: [
        `Email ${org.email} or call any of the numbers listed below (${phoneList}). Please give your name, mobile number, the date of payment and the payment or UTR reference number.`,
      ],
    },
  ],
}

export const policies = { terms, privacy, refund }
export const policyLinks = [
  { to: '/terms', label: terms.title },
  { to: '/privacy', label: privacy.title },
  { to: '/refund-policy', label: refund.title },
]
