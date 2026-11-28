export const BASE_URL = 'https://beaconbridgeacademics.co.uk';

export const ORGANIZATION_SCHEMA = {
  '@type': 'EducationalOrganization',
  '@id': `${BASE_URL}/#organization`,
  'name': 'Beacon Bridge Academics',
  'url': BASE_URL,
  'logo': `${BASE_URL}/logo.png`,
  'email': 'info@beaconbridgeacademics.co.uk',
  'telephone': '+44 7414 663735',
  'description': 'Leading online academic institution providing curriculum-aligned tutoring and live interactive virtual classrooms for students in the UK, Canada, the US, and worldwide.',
  'sameAs': [
    'https://www.facebook.com/BeaconAcademics',
    'https://www.youtube.com/@BeaconBridgeAcademics',
    'https://www.tiktok.com/@beacon.academics.uk',
    'https://x.com/BBacademicsuk'
  ],
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': '41 Great Oaks Avenue, Warren Wood',
    'addressLocality': 'Gainsborough',
    'postalCode': 'DN21 1AE',
    'addressCountry': 'GB'
  },
  'priceRange': '££',
  'currenciesAccepted': 'GBP',
  'areaServed': ['United Kingdom', 'Canada', 'United States', 'International'],
  'contactPoint': [
    {
      '@type': 'ContactPoint',
      'telephone': '+44 7414 663735',
      'contactType': 'admissions and customer service',
      'email': 'info@beaconbridgeacademics.co.uk',
      'availableLanguage': ['English'],
      'areaServed': ['GB', 'CA', 'US', 'International']
    }
  ]
};

export const PAGE_SEO = {
  '/': {
    title: 'Online Tutoring UK | GCSE & A-Level Tutors | Beacon Bridge Academics',
    description: 'Premier online tutoring for UK GCSEs, A-Levels, and international curricula. Learn with specialist educators through interactive live virtual classrooms at Beacon Bridge Academics.',
    canonicalPath: '/',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        ORGANIZATION_SCHEMA,
        {
          '@type': 'WebSite',
          '@id': `${BASE_URL}/#website`,
          'url': BASE_URL,
          'name': 'Beacon Bridge Academics',
          'description': 'Online Tutoring for GCSE, A-Level, and International Curricula',
          'publisher': {
            '@id': `${BASE_URL}/#organization`
          }
        }
      ]
    }
  },
  '/about': {
    title: 'About Us | UK Curriculum Specialists & Mission | Beacon Bridge Academics',
    description: 'Learn about Beacon Bridge Academics: our UK curriculum specialists, DBS-checked educators, transparent parent oversight, and mission to help every child thrive.',
    canonicalPath: '/about',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'AboutPage',
          '@id': `${BASE_URL}/about#aboutpage`,
          'url': `${BASE_URL}/about`,
          'name': 'About Beacon Bridge Academics',
          'description': 'Online academic institution providing curriculum-specialist tuition and virtual classrooms across the UK and internationally.',
          'mainEntity': {
            '@id': `${BASE_URL}/#organization`
          }
        },
        {
          ...ORGANIZATION_SCHEMA,
          'employee': [
            {
              '@type': 'Person',
              'name': 'Mr. Gideon Babs',
              'jobTitle': 'Academic Advisor & Admissions Director',
              'image': `${BASE_URL}/advisor.jpg`,
              'description': 'Senior Academic Advisor directing GCSE & A-Level diagnostic assessments and individualized study blueprints.'
            }
          ]
        }
      ]
    }
  },
  '/contact': {
    title: 'Contact Us | Academic Consultations & Enquiries | Beacon Bridge Academics',
    description: 'Contact Beacon Bridge Academics. Speak directly with our UK Academic Advisor, request information on tuition plans, or book a free diagnostic assessment.',
    canonicalPath: '/contact',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ContactPage',
          '@id': `${BASE_URL}/contact#contactpage`,
          'url': `${BASE_URL}/contact`,
          'name': 'Contact Beacon Bridge Academics',
          'description': 'Contact Beacon Bridge Academics for elite online tutoring inquiries, GCSE & A-Level admissions, and consultations.',
          'mainEntity': {
            '@id': `${BASE_URL}/#organization`
          }
        },
        ORGANIZATION_SCHEMA
      ]
    }
  },
  '/curriculum': {
    title: 'Curriculum & Courses | UK GCSE, A-Level & Global Tutoring | Beacon Bridge Academics',
    description: 'Explore our curriculum offerings across Key Stage 3, GCSE, A-Level, IB, AP, and Canadian High School. Rigorous syllabus mastery aligned with AQA, Edexcel, and OCR.',
    canonicalPath: '/curriculum',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${BASE_URL}/curriculum#service`,
          'url': `${BASE_URL}/curriculum`,
          'name': 'Beacon Bridge Online Tutoring & Exam Preparation Services',
          'serviceType': 'Online Academic Tutoring',
          'provider': {
            '@id': `${BASE_URL}/#organization`
          },
          'areaServed': ['United Kingdom', 'Canada', 'United States', 'International']
        },
        {
          ...ORGANIZATION_SCHEMA,
          'hasOfferCatalog': {
            '@type': 'OfferCatalog',
            'name': 'Curriculum Programs & Courses',
            'itemListElement': [
              {
                '@type': 'Offer',
                'itemOffered': {
                  '@type': 'Course',
                  'name': 'GCSE 5-Subject Core Bundle',
                  'description': 'Comprehensive GCSE preparation covering Mathematics, English Language & Literature, Chemistry, Biology, and Physics across AQA, Edexcel, and OCR boards.',
                  'provider': { '@id': `${BASE_URL}/#organization` }
                }
              },
              {
                '@type': 'Offer',
                'itemOffered': {
                  '@type': 'Course',
                  'name': 'UK A-Level 3-Subject Specialist Program',
                  'description': 'Tailored 3-subject A-Level preparation covering Pure & Further Maths, Sciences, Economics, English, and Computing.',
                  'provider': { '@id': `${BASE_URL}/#organization` }
                }
              },
              {
                '@type': 'Offer',
                'itemOffered': {
                  '@type': 'Course',
                  'name': 'Canada Senior Secondary (Grade 11/12) & AP',
                  'description': 'University preparatory program focusing on Advanced Functions, Calculus & Vectors, Sciences, and English.',
                  'provider': { '@id': `${BASE_URL}/#organization` }
                }
              },
              {
                '@type': 'Offer',
                'itemOffered': {
                  '@type': 'Course',
                  'name': 'US High School & AP Mastery',
                  'description': 'Advanced Placement test preparation and mastery across AP Calculus, AP Chemistry, AP Physics, and AP Biology.',
                  'provider': { '@id': `${BASE_URL}/#organization` }
                }
              }
            ]
          }
        }
      ]
    }
  },
  '/how-it-works': {
    title: 'How It Works | 4-Stage Online Tutoring Methodology | Beacon Bridge Academics',
    description: 'Discover the Beacon Bridge 4-stage tutoring framework: diagnostic assessment, bespoke study plan, live interactive virtual classrooms, and real-time parent progress tracking.',
    canonicalPath: '/how-it-works',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          '@id': `${BASE_URL}/how-it-works#service`,
          'url': `${BASE_URL}/how-it-works`,
          'name': 'Beacon Bridge 4-Stage Online Tutoring Learning Methodology',
          'serviceType': 'Online Academic Tutoring Service',
          'description': 'A structured 4-step framework: 20-minute diagnostic, tailored syllabus blueprint, interactive live virtual classroom, and continuous parent oversight.',
          'provider': {
            '@id': `${BASE_URL}/#organization`
          }
        },
        ORGANIZATION_SCHEMA
      ]
    }
  },
  '/book-consultation': {
    title: 'Book a Consultation | Free Academic Diagnostic | Beacon Bridge Academics',
    description: 'Schedule a 1-on-1 consultation with Academic Advisor Mr. Gideon Babs. Review mock results, identify syllabus gaps, and design a bespoke learning roadmap.',
    canonicalPath: '/book-consultation',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ContactPage',
          '@id': `${BASE_URL}/book-consultation#contactpage`,
          'url': `${BASE_URL}/book-consultation`,
          'name': 'Book a Free 20-Minute Academic Diagnostic Consultation',
          'description': 'One-on-one consultation with senior educational advisor Mr. Gideon Babs to evaluate student performance and curriculum needs.',
          'mainEntity': {
            '@id': `${BASE_URL}/#organization`
          }
        },
        {
          '@type': 'Service',
          'name': 'Complimentary 20-Minute Academic Consultation',
          'provider': {
            '@id': `${BASE_URL}/#organization`
          }
        }
      ]
    }
  },
  '/blog': {
    title: 'Academic Insights & News | Study Guides & Events | Beacon Bridge Academics',
    description: 'Read educational insights, GCSE & A-Level revision strategies, exam techniques, and official event announcements from the Beacon Bridge Academics faculty.',
    canonicalPath: '/blog',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Blog',
          '@id': `${BASE_URL}/blog#blog`,
          'url': `${BASE_URL}/blog`,
          'name': 'Beacon Bridge Academics Insights, Revision Guides & Events',
          'description': 'Academic revision blueprints, exam techniques, and event announcements from verified UK educators.',
          'publisher': {
            '@id': `${BASE_URL}/#organization`
          }
        },
        ORGANIZATION_SCHEMA
      ]
    }
  },
  '/apply-to-teach': {
    title: 'Apply to Teach | Join Our Expert Educator Faculty | Beacon Bridge Academics',
    description: 'Apply to join the Beacon Bridge teaching faculty. We invite qualified UK and international educators with subject mastery and a dedication to student excellence.',
    canonicalPath: '/apply-to-teach',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${BASE_URL}/apply-to-teach#webpage`,
          'url': `${BASE_URL}/apply-to-teach`,
          'name': 'Tutor Faculty Recruitment | Beacon Bridge Academics',
          'description': 'Join the teaching faculty at Beacon Bridge Academics. Opportunities for qualified teachers and curriculum specialists.',
          'publisher': {
            '@id': `${BASE_URL}/#organization`
          }
        },
        ORGANIZATION_SCHEMA
      ]
    }
  },
  '/privacy': {
    title: 'Privacy Policy | UK GDPR & Data Protection | Beacon Bridge Academics',
    description: 'Read the Beacon Bridge Academics Privacy Policy. Learn how we safeguard your personal data, ensure student confidentiality, and comply with UK GDPR and DPA 2018.',
    canonicalPath: '/privacy',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${BASE_URL}/privacy#webpage`,
      'url': `${BASE_URL}/privacy`,
      'name': 'Privacy Policy | Beacon Bridge Academics',
      'description': 'Statutory UK GDPR, DPA 2018, and KCSIE child protection privacy policy for Beacon Bridge Academics.',
      'publisher': {
        '@id': `${BASE_URL}/#organization`
      }
    }
  },
  '/terms': {
    title: 'Terms of Service | Tutoring Agreement & Policies | Beacon Bridge Academics',
    description: 'Terms of Service for Beacon Bridge Academics. Details our tuition agreements, payment terms, lesson attendance, cancellation policies, and user conduct.',
    canonicalPath: '/terms',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${BASE_URL}/terms#webpage`,
      'url': `${BASE_URL}/terms`,
      'name': 'Terms of Service | Beacon Bridge Academics',
      'description': 'Official terms and conditions of service for Beacon Bridge Academics.',
      'publisher': {
        '@id': `${BASE_URL}/#organization`
      }
    }
  },
  '/security': {
    title: 'Security & Safeguarding Policy | KCSIE Compliance | Beacon Bridge Academics',
    description: 'Beacon Bridge Academics safeguarding and platform security framework. Enhanced DBS verification, recorded lessons, end-to-end encryption, and KCSIE compliance.',
    canonicalPath: '/security',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${BASE_URL}/security#webpage`,
      'url': `${BASE_URL}/security`,
      'name': 'Security & Safeguarding Policy | Beacon Bridge Academics',
      'description': 'Comprehensive platform security standards, safeguarding guidelines, and KCSIE compliance at Beacon Bridge Academics.',
      'publisher': {
        '@id': `${BASE_URL}/#organization`
      }
    }
  },
  '/ielts-registration': {
    title: 'IELTS Registration | Academic & UKVI Exam Preparation | Beacon Bridge Academics',
    description: 'Register for IELTS Academic & UKVI exam preparation at Beacon Bridge Academics. Expert coaching, £100/month, structured study plan, payment proof upload.',
    canonicalPath: '/ielts-registration',
    robots: 'index, follow',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Course',
      '@id': `${BASE_URL}/ielts-registration#course`,
      'url': `${BASE_URL}/ielts-registration`,
      'name': 'IELTS Academic & UKVI Exam Preparation',
      'description': 'Intensive IELTS preparation programme covering all four skills: Listening, Reading, Writing and Speaking. Available as Academic or UKVI track.',
      'provider': {
        '@id': `${BASE_URL}/#organization`
      },
      'offers': {
        '@type': 'Offer',
        'price': '100',
        'priceCurrency': 'GBP',
        'availability': 'https://schema.org/InStock'
      }
    }
  },
  '/register': {
    title: 'Register with Us | Student & Parent Portal | Beacon Bridge Academics',
    description: 'Joint parent-student registration for KS2, KS3, GCSE, UK A-Level, Canada Grade 11–12, Coding (Software Development), and Graphics Design.',
    canonicalPath: '/register',
    robots: 'index, follow',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${BASE_URL}/register#webpage`,
      'url': `${BASE_URL}/register`,
      'name': 'Register with Us | Beacon Bridge Academics',
      'publisher': {
        '@id': `${BASE_URL}/#organization`
      }
    }
  },
  '/faq': {
    title: 'Frequently Asked Questions (FAQ) | Beacon Bridge Academics',
    description: 'Answers to common parent and student questions about UK GCSE, A-Level, KS2, KS3, IELTS online tutoring, safeguarding, virtual classrooms, and tuition plans.',
    canonicalPath: '/faq',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${BASE_URL}/faq#faqpage`,
      'url': `${BASE_URL}/faq`,
      'name': 'Frequently Asked Questions | Beacon Bridge Academics',
      'publisher': {
        '@id': `${BASE_URL}/#organization`
      }
    }
  },
  '/payment-proof': {
    title: 'Payment Proof Submission | Beacon Bridge Academics',
    description: 'Submit or update your monthly tuition bank transfer reference and receipt slip for Beacon Bridge Academics verification.',
    canonicalPath: '/payment-proof',
    robots: 'noindex, follow',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${BASE_URL}/payment-proof#webpage`,
      'url': `${BASE_URL}/payment-proof`,
      'name': 'Payment Proof Submission | Beacon Bridge Academics',
      'publisher': {
        '@id': `${BASE_URL}/#organization`
      }
    }
  },
  '/tutor-waitlist': {
    title: 'Tutor Waiting List | Teach A-Level Online | Beacon Bridge Academics',
    description: 'Beacon Bridge Academics is launching soon. Join the tutor waiting list to teach motivated A-Level students across the UK, US, Canada and Australia.',
    canonicalPath: '/tutor-waitlist',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': 'https://tutors.beaconbridgeacademics.co.uk/#waitlist',
      'url': 'https://tutors.beaconbridgeacademics.co.uk',
      'name': 'Beacon Bridge Academics Tutor Waiting List',
      'description': 'Pre-launch A-Level tutor waiting list for Beacon Bridge Academics across the UK, US, Canada and Australia.',
      'publisher': {
        '@id': `${BASE_URL}/#organization`
      }
    }
  }
};
