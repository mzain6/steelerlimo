/**
 * All site content lives here so it can be edited without touching components.
 * Facts (phone, address, service list, 7-seat SUV classes, 4-hour event bookings,
 * pricing models) come from the existing steelerlimousine.com. Wording is new.
 */

export const business = {
  name: 'Steeler Limousine LLC',
  brand: 'Steeler Limousine',
  // The old site displayed 412-608-9759 but its tel: link dialled 412-424-1776. Confirm which is current.
  phone: '412-608-9759',
  phoneHref: 'tel:+14126089759',
  email: 'steelerlimousine@gmail.com',
  street: '305 Jonathan Ct',
  cityLine: 'Oakdale, PA 15071',
  mapQuery: '305 Jonathan Ct, Oakdale, PA 15071',
}

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/fleet', label: 'Fleet' },
  { to: '/about', label: 'About' },
]

export type ServiceId = 'luxury' | 'corporate' | 'airport' | 'event' | 'occasion'

export type Service = {
  id: ServiceId
  n: string
  title: string
  short: string
  body: string
  points: string[]
  image: string
  alt: string
  position?: string
}

export const services: Service[] = [
  {
    id: 'luxury',
    n: '01',
    title: 'Luxury Transportation',
    short: 'High-end SUVs, professional drivers, and a ride that is comfortable, stylish and safe.',
    body: 'Sometimes the ride is the point. Leather seats, a quiet cabin, plenty of room for luggage, and a driver whose only job is getting you there well. Book it for a night in the city, a weekend away, or simply because you would rather not drive.',
    points: [
      'Leather seating and room to stretch out',
      'Generous luggage space',
      'Experienced, professional drivers',
      'Door-to-door pickup and drop-off',
    ],
    image: '/images/escalade.webp',
    alt: 'Black luxury SUV driving along a coastal road',
    position: '50% 55%',
  },
  {
    id: 'corporate',
    n: '02',
    title: 'Corporate Transportation',
    short: 'Reliable, professional rides around Pittsburgh. Your driver’s job is to get you there on time.',
    body: 'Meetings do not wait, and neither should you. We handle client pickups, executive transfers and full-day schedules, so you can take the call, review the deck, or just breathe between stops.',
    points: [
      'Client and executive transfers',
      'Multi-stop and full-day schedules',
      'A quiet cabin for calls and laptop work',
      'Hourly or point-to-point pricing',
    ],
    image: '/images/corporate.webp',
    alt: 'Executive working on a laptop in the back seat of a car',
    position: '40% 40%',
  },
  {
    id: 'airport',
    n: '03',
    title: 'Airport Transfers',
    short: 'To and from Pittsburgh International. We meet you at the terminal and help with your bags.',
    body: 'Skip the parking garage and the shuttle line. Your driver meets you at the terminal, takes the bags, and has you on your way. Heading out instead? We will get you to departures with time to spare.',
    points: [
      'Terminal meet-and-greet at Pittsburgh International (PIT)',
      'Help with luggage',
      'Share your flight number when you book',
      'No parking, no shuttle',
    ],
    image: '/images/airport.webp',
    alt: 'Airplane flying between two tall buildings',
    position: '60% 50%',
  },
  {
    id: 'event',
    n: '04',
    title: 'Event Transportation',
    short: 'From weddings to corporate functions, everyone arrives together and arrives well.',
    body: 'Weddings, galas, conferences, team dinners. We plan the pickups so your guests arrive relaxed and on schedule. Special events are booked in 4-hour blocks, so nobody is watching the clock.',
    points: [
      'Weddings and receptions',
      'Corporate functions and conferences',
      'Group arrivals and shuttle runs',
      'Booked in 4-hour blocks',
    ],
    image: '/images/hero-skyline.webp',
    alt: 'Pittsburgh skyline and rivers at dusk',
    position: '55% 50%',
  },
  {
    id: 'occasion',
    n: '05',
    title: 'Special Occasions',
    short: 'Anniversaries, birthdays, big nights out. Tell us the plan and we build the ride around it.',
    body: 'Some nights deserve a proper entrance. Whether it is an anniversary dinner, a birthday, a concert or game day, tell us what you have in mind and we will put together the right ride. Not sure yet? Call us and we will talk it through.',
    points: [
      'Anniversaries and birthdays',
      'Nights out, concerts and game days',
      'Custom itineraries',
      'Call us for details',
    ],
    image: '/images/wedding.webp',
    alt: 'Bride smiling beside an open limousine door',
    position: '50% 40%',
  },
]

export type VehicleId = 'mid-suv' | 'xl-suv'

export type Vehicle = {
  id: VehicleId
  name: string
  tagline: string
  blurb: string
  image: string
  alt: string
  position?: string
  facts: { label: string; value: string }[]
  best: string[]
}

export const vehicles: Vehicle[] = [
  {
    id: 'mid-suv',
    name: 'Mid-Size SUV',
    tagline: 'Seats up to 7',
    blurb:
      'Roomy, polished and easy to get in and out of. The right call for most airport runs, business trips and nights out.',
    image: '/images/yukon.webp',
    alt: 'Black mid-size luxury SUV',
    position: '50% 60%',
    facts: [
      { label: 'Seats', value: '7 guests' },
      { label: 'Luggage', value: 'Room for several bags' },
      { label: 'Interior', value: 'Leather seating' },
    ],
    best: ['Airport transfers', 'Corporate travel', 'Dinner and nights out'],
  },
  {
    id: 'xl-suv',
    name: 'XL SUV',
    tagline: 'Seats up to 7, with extra cargo room',
    blurb:
      'The same finish with added length, so there is more space for luggage when the whole group is travelling together.',
    image: '/images/escalade.webp',
    alt: 'Black extended-length luxury SUV',
    position: '50% 55%',
    facts: [
      { label: 'Seats', value: '7 guests' },
      { label: 'Luggage', value: 'Extra cargo space' },
      { label: 'Interior', value: 'Leather seating' },
    ],
    best: ['Larger groups', 'Heavy luggage', 'Weddings and events'],
  },
]

export const pricing = [
  {
    id: 'hourly',
    label: 'Hourly',
    title: 'Hourly rates',
    body: 'Flexible and transparent. Keep the car and driver for as long as your day needs, with stops wherever the schedule takes you.',
    fits: ['Full-day schedules', 'Multi-stop evenings', 'Weddings and events'],
  },
  {
    id: 'point',
    label: 'Point-to-point',
    title: 'Point-to-point',
    body: 'One pickup, one destination, one clear price. Across town or across the state.',
    fits: ['Airport transfers', 'Long-distance trips', 'Dinner and back'],
  },
  {
    id: 'package',
    label: 'Packages',
    title: 'Custom packages',
    body: 'Flat-rate packages are available on request, built around your schedule so you know the number before the ride.',
    fits: ['Recurring rides', 'Group itineraries', 'Special occasions'],
  },
]

export const reasons = [
  {
    title: 'Professional drivers',
    body: 'Experienced drivers who handle the route, the traffic and the luggage so you can handle everything else.',
  },
  {
    title: 'Met at the terminal',
    body: 'At Pittsburgh International your driver meets you inside and helps with your bags. No garage, no shuttle.',
  },
  {
    title: 'Pricing that makes sense',
    body: 'Hourly, point-to-point or a flat-rate package. Ask for a quote and get a straight number.',
  },
  {
    title: 'A fleet we look after',
    body: 'Spacious SUVs with leather seating and room for luggage, kept spotless and meticulously maintained.',
  },
]

export const faqs = [
  {
    q: 'How do I book?',
    a: `Use the Book Now page or call ${business.phone}. Tell us where, when and how many of you are travelling, and we will confirm the details with you.`,
  },
  {
    q: 'Do you serve Pittsburgh International Airport?',
    a: 'Yes. Your driver meets you at the terminal and helps with luggage. Add your flight number to your booking so we know where to find you.',
  },
  {
    q: 'How does pricing work?',
    a: 'Three ways: hourly, point-to-point, or a flat-rate package. Special events are booked in 4-hour blocks. Ask for a quote and we will give you a clear number.',
  },
  {
    q: 'Can you take me outside Pittsburgh?',
    a: 'Yes. Point-to-point trips can run across town or across the state.',
  },
  {
    q: 'How many people fit in one vehicle?',
    a: 'Both of our SUV classes seat up to 7 guests. For a larger group, call us and we will work out the right plan.',
  },
  {
    q: 'Can I request a custom package?',
    a: 'Yes. Flat-rate packages are available on request and built around your schedule.',
  },
]

export const areas = [
  'Pittsburgh International (PIT)',
  'Downtown',
  'Strip District',
  'Oakland',
  'North Shore',
  'South Side',
  'Moon Township',
  'Cranberry',
  'Oakdale',
]

export const principles = [
  {
    title: 'Comfort comes first',
    body: 'Our fleet is chosen for space, leather seating and a quiet ride, because the vehicle is half of the experience.',
  },
  {
    title: 'Show up properly',
    body: 'Clean car, professional driver, at the door when we said. It sounds simple. It is most of the job.',
  },
  {
    title: 'Straight pricing',
    body: 'Hourly, point-to-point or flat-rate. You will know what a ride costs before you take it.',
  },
]
