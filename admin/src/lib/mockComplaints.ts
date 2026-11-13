import { Complaint, ComplaintStats, StaffMember } from '@/types/complaint';

export const AVAILABLE_STAFF: StaffMember[] = [
  {
    id: 'staff-01',
    name: 'Rajesh Kumar',
    role: 'Chief Electrician',
    phone: '+91 98765 11221',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    status: 'Available',
  },
  {
    id: 'staff-02',
    name: 'Sunil Verma',
    role: 'Plumbing & Water Works',
    phone: '+91 98765 11222',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'On Duty',
  },
  {
    id: 'staff-03',
    name: 'Ramesh Soren',
    role: 'Housekeeping Supervisor',
    phone: '+91 98765 11223',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'Available',
  },
  {
    id: 'staff-04',
    name: 'Ankit Sharma',
    role: 'Network & Wi-Fi Engineer',
    phone: '+91 98765 11224',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    status: 'On Duty',
  },
  {
    id: 'staff-05',
    name: 'Mahendra Singh',
    role: 'General Maintenance & Carpentry',
    phone: '+91 98765 11225',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    status: 'Busy',
  },
  {
    id: 'staff-06',
    name: 'Kavita Patel',
    role: 'Mess & Food Quality Supervisor',
    phone: '+91 98765 11226',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'Available',
  },
  {
    id: 'staff-07',
    name: 'Suraj Thapa',
    role: 'Security & Access Control',
    phone: '+91 98765 11227',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    status: 'On Duty',
  },
];

export const CURRENT_STUDENT = {
  id: 'std-001',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@gmail.com',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  roomNumber: '204',
  bedNumber: 'Bed A',
  pgId: 'pg-01',
  pgName: 'Green Valley PG',
};

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-2026-1048',
    title: 'AC leaking water on study table and not cooling properly',
    description:
      'The split air conditioner in Room 204 has started leaking water droplets continuously onto the study desk. Additionally, the airflow is warm even when set to 20°C, and there is a mild humming noise coming from the indoor blower unit.',
    category: 'Room Maintenance',
    priority: 'Urgent',
    status: 'In Progress',
    submittedDate: '2026-11-10T10:15:00Z',
    updatedDate: '2026-11-11T14:30:00Z',
    student: {
      id: 'std-001',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@gmail.com',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      roomNumber: '204',
      bedNumber: 'Bed A',
      pgId: 'pg-01',
      pgName: 'Green Valley PG',
    },
    assignedTo: AVAILABLE_STAFF[0], // Rajesh Kumar
    images: [
      {
        id: 'img-101',
        url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
        name: 'ac-dripping-unit.jpg',
        size: '1.8 MB',
      },
      {
        id: 'img-102',
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
        name: 'water-stains-desk.jpg',
        size: '2.1 MB',
      },
    ],
    timeline: [
      {
        id: 'tl-1',
        step: 1,
        title: 'Complaint Submitted',
        description: 'Ticket registered by resident Aarav Sharma.',
        timestamp: '10 Nov 2026, 10:15 AM',
        actor: 'Aarav Sharma',
        actorRole: 'Student',
        completed: true,
      },
      {
        id: 'tl-2',
        step: 2,
        title: 'Complaint Reviewed',
        description: 'Triage team reviewed priority as Urgent due to equipment leakage risk.',
        timestamp: '10 Nov 2026, 11:00 AM',
        actor: 'Vikramaditya (Owner)',
        actorRole: 'Owner',
        completed: true,
      },
      {
        id: 'tl-3',
        step: 3,
        title: 'Work In Progress',
        description: 'Rajesh Kumar (Chief Electrician) assigned and parts dispatched.',
        timestamp: '11 Nov 2026, 09:30 AM',
        actor: 'Rajesh Kumar',
        actorRole: 'Staff',
        completed: true,
      },
      {
        id: 'tl-4',
        step: 4,
        title: 'Complaint Resolved',
        description: 'Pending post-repair inspection and resident verification.',
        timestamp: 'Expected 12 Nov, 04:00 PM',
        actor: 'System',
        actorRole: 'System',
        completed: false,
      },
    ],
    adminResponse: {
      message:
        'Hello Aarav, we have dispatched our HVAC technician Rajesh Kumar. He will visit Room 204 today between 3:30 PM - 5:00 PM to clear the clogged condensate drain pipe and top up gas.',
      responderName: 'Vikramaditya Singhania',
      responderRole: 'Property Owner',
      timestamp: '11 Nov 2026, 10:45 AM',
    },
    internalNotes: [
      {
        id: 'note-01',
        author: 'Vikramaditya Singhania',
        authorRole: 'Owner',
        content:
          'AC condensate tray was cleaned 6 months ago. Might need chemical wash or pipe replacement. Rajesh has spare 1/2 inch drain tubing.',
        createdAt: '10 Nov 2026, 11:05 AM',
      },
    ],
    comments: [
      {
        id: 'comm-01',
        authorId: 'std-001',
        authorName: 'Aarav Sharma',
        authorRole: 'Student',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        message: 'I have placed a plastic bucket under the corner to prevent water getting on my laptop. Please send the technician soon.',
        createdAt: '10 Nov 2026, 10:20 AM',
      },
      {
        id: 'comm-02',
        authorId: 'owner-01',
        authorName: 'Vikramaditya (Owner)',
        authorRole: 'Owner',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        message: 'Thanks for notifying Aarav. Rajesh is wrapping up on 1st floor and will head up to 204 right away.',
        createdAt: '11 Nov 2026, 11:15 AM',
      },
    ],
  },
  {
    id: 'CMP-2026-1047',
    title: 'High-speed Wi-Fi 5GHz signal disconnecting repeatedly on 2nd floor',
    description:
      'The 5GHz Wi-Fi network (PGMitra_WingA_5G) keeps disconnecting every 10-15 minutes, specifically during evening hours between 7 PM and 11 PM. Facing major interruptions during college project video submissions.',
    category: 'Wi-Fi / Internet',
    priority: 'Medium',
    status: 'Reviewed',
    submittedDate: '2026-11-11T08:30:00Z',
    updatedDate: '2026-11-11T12:00:00Z',
    student: {
      id: 'std-001',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@gmail.com',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      roomNumber: '204',
      bedNumber: 'Bed A',
      pgId: 'pg-01',
      pgName: 'Green Valley PG',
    },
    assignedTo: AVAILABLE_STAFF[3], // Ankit Sharma
    images: [
      {
        id: 'img-103',
        url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80',
        name: 'wifi-speedtest-error.png',
        size: '780 KB',
      },
    ],
    timeline: [
      {
        id: 'tl-10',
        step: 1,
        title: 'Complaint Submitted',
        description: 'Resident Aarav reported frequent access point drops.',
        timestamp: '11 Nov 2026, 08:30 AM',
        actor: 'Aarav Sharma',
        actorRole: 'Student',
        completed: true,
      },
      {
        id: 'tl-20',
        step: 2,
        title: 'Complaint Reviewed',
        description: 'Assigned to Network Engineer Ankit Sharma for channel frequency scan.',
        timestamp: '11 Nov 2026, 12:00 PM',
        actor: 'Admin Team',
        actorRole: 'Owner',
        completed: true,
      },
      {
        id: 'tl-30',
        step: 3,
        title: 'Work In Progress',
        description: 'AP firmware update scheduled.',
        timestamp: 'Pending execution',
        actor: 'Ankit Sharma',
        actorRole: 'Staff',
        completed: false,
      },
      {
        id: 'tl-40',
        step: 4,
        title: 'Complaint Resolved',
        description: 'Awaiting signal strength stability verification.',
        timestamp: 'Pending',
        actor: 'System',
        actorRole: 'System',
        completed: false,
      },
    ],
    adminResponse: {
      message:
        'Hi Aarav, Ankit is checking the mesh access point on corridor ceiling #2. We have restarted the fiber gateway and are configuring 80MHz channel width to reduce interference.',
      responderName: 'Vikramaditya Singhania',
      responderRole: 'Property Owner',
      timestamp: '11 Nov 2026, 12:10 PM',
    },
    internalNotes: [
      {
        id: 'note-02',
        author: 'Ankit Sharma',
        authorRole: 'Network Engineer',
        content: 'Corridor AP 202 has 42 client leases. Load balancing with AP 206 will resolve packet congestion.',
        createdAt: '11 Nov 2026, 12:05 PM',
      },
    ],
    comments: [],
  },
  {
    id: 'CMP-2026-1046',
    title: 'Bathroom tap constantly dripping & low water pressure in geyser',
    description:
      'The hot water mixer tap in the attached bathroom will not close completely and drips continuously, causing both water wastage and noise during the night. Also, the geyser takes over 45 minutes to produce warm water.',
    category: 'Water Supply',
    priority: 'High',
    status: 'In Progress',
    submittedDate: '2026-11-09T14:20:00Z',
    updatedDate: '2026-11-10T16:00:00Z',
    student: {
      id: 'std-002',
      name: 'Priya Nair',
      email: 'priya.nair@gmail.com',
      phone: '+91 98765 43212',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      roomNumber: '108',
      bedNumber: 'Bed B',
      pgId: 'pg-02',
      pgName: 'Zenith Girls PG',
    },
    assignedTo: AVAILABLE_STAFF[1], // Sunil Verma
    images: [
      {
        id: 'img-104',
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=80',
        name: 'tap-leakage.jpg',
        size: '1.4 MB',
      },
    ],
    timeline: [
      {
        id: 'tl-11',
        step: 1,
        title: 'Complaint Submitted',
        description: 'Resident Priya reported faucet washer wear.',
        timestamp: '09 Nov 2026, 02:20 PM',
        actor: 'Priya Nair',
        actorRole: 'Student',
        completed: true,
      },
      {
        id: 'tl-21',
        step: 2,
        title: 'Complaint Reviewed',
        description: 'Plumbing request approved.',
        timestamp: '09 Nov 2026, 03:45 PM',
        actor: 'Admin Team',
        actorRole: 'Owner',
        completed: true,
      },
      {
        id: 'tl-31',
        step: 3,
        title: 'Work In Progress',
        description: 'Sunil Verma replacing ceramic cartridge spindle.',
        timestamp: '10 Nov 2026, 11:30 AM',
        actor: 'Sunil Verma',
        actorRole: 'Staff',
        completed: true,
      },
      {
        id: 'tl-41',
        step: 4,
        title: 'Complaint Resolved',
        description: 'Awaiting water flow testing.',
        timestamp: 'Pending',
        actor: 'System',
        actorRole: 'System',
        completed: false,
      },
    ],
    adminResponse: {
      message: 'Sunil is carrying a replacement ceramic disc cartridge. He will finish this afternoon.',
      responderName: 'Vikramaditya Singhania',
      responderRole: 'Property Owner',
      timestamp: '10 Nov 2026, 10:00 AM',
    },
    internalNotes: [],
    comments: [],
  },
  {
    id: 'CMP-2026-1045',
    title: 'Deep room cleaning & mattress sanitization requested after dust storm',
    description:
      'Due to yesterday heavy dust storm and open balcony vents, a thick coat of dust has settled across the wardrobe top, window tracks, and mattresses. Requesting thorough vacuuming and floor disinfection.',
    category: 'Cleaning',
    priority: 'Low',
    status: 'Pending',
    submittedDate: '2026-11-12T06:40:00Z',
    updatedDate: '2026-11-12T06:40:00Z',
    student: {
      id: 'std-001',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@gmail.com',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      roomNumber: '204',
      bedNumber: 'Bed A',
      pgId: 'pg-01',
      pgName: 'Green Valley PG',
    },
    assignedTo: null,
    images: [],
    timeline: [
      {
        id: 'tl-12',
        step: 1,
        title: 'Complaint Submitted',
        description: 'Request entered in queue.',
        timestamp: '12 Nov 2026, 06:40 AM',
        actor: 'Aarav Sharma',
        actorRole: 'Student',
        completed: true,
      },
      {
        id: 'tl-22',
        step: 2,
        title: 'Complaint Reviewed',
        description: 'Waiting for housekeeping roster slot assignment.',
        timestamp: 'Pending',
        actor: 'System',
        actorRole: 'System',
        completed: false,
      },
      {
        id: 'tl-32',
        step: 3,
        title: 'Work In Progress',
        description: 'Pending cleaner allocation.',
        timestamp: 'Pending',
        actor: 'System',
        actorRole: 'System',
        completed: false,
      },
      {
        id: 'tl-42',
        step: 4,
        title: 'Complaint Resolved',
        description: 'Pending completion.',
        timestamp: 'Pending',
        actor: 'System',
        actorRole: 'System',
        completed: false,
      },
    ],
    adminResponse: null,
    internalNotes: [],
    comments: [],
  },
  {
    id: 'CMP-2026-1044',
    title: 'Ceiling fan regulator sparking when switched to speed 5',
    description:
      'The modular fan regulator on switchboard #1 makes a visible blue spark and crackling noise when changing from speed 4 to speed 5. Fire hazard concern.',
    category: 'Electricity',
    priority: 'Urgent',
    status: 'In Progress',
    submittedDate: '2026-11-11T16:10:00Z',
    updatedDate: '2026-11-12T08:00:00Z',
    student: {
      id: 'std-003',
      name: 'Rohan Das',
      email: 'rohan.das@gmail.com',
      phone: '+91 98765 43213',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      roomNumber: '302',
      bedNumber: 'Bed A',
      pgId: 'pg-03',
      pgName: 'Sunrise Luxury PG',
    },
    assignedTo: AVAILABLE_STAFF[0], // Rajesh Kumar
    images: [
      {
        id: 'img-105',
        url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        name: 'switchboard-spark.jpg',
        size: '1.2 MB',
      },
    ],
    timeline: [
      {
        id: 'tl-13',
        step: 1,
        title: 'Complaint Submitted',
        description: 'Urgent electrical hazard logged.',
        timestamp: '11 Nov 2026, 04:10 PM',
        actor: 'Rohan Das',
        actorRole: 'Student',
        completed: true,
      },
      {
        id: 'tl-23',
        step: 2,
        title: 'Complaint Reviewed',
        description: 'Flagged immediately as high priority fire safety.',
        timestamp: '11 Nov 2026, 04:25 PM',
        actor: 'Vikramaditya',
        actorRole: 'Owner',
        completed: true,
      },
      {
        id: 'tl-33',
        step: 3,
        title: 'Work In Progress',
        description: 'Rajesh Kumar isolated MCB and is installing new Roma modular regulator.',
        timestamp: '12 Nov 2026, 08:00 AM',
        actor: 'Rajesh Kumar',
        actorRole: 'Staff',
        completed: true,
      },
      {
        id: 'tl-43',
        step: 4,
        title: 'Complaint Resolved',
        description: 'Pending insulation testing.',
        timestamp: 'Pending',
        actor: 'System',
        actorRole: 'System',
        completed: false,
      },
    ],
    adminResponse: {
      message: 'Please keep that switchboard switched off at the sub-MCB until Rajesh replaces the faulty step-capacitor.',
      responderName: 'Vikramaditya Singhania',
      responderRole: 'Property Owner',
      timestamp: '11 Nov 2026, 04:30 PM',
    },
    internalNotes: [
      {
        id: 'note-03',
        author: 'Vikramaditya Singhania',
        authorRole: 'Owner',
        content: 'Checked with electrician Rajesh; batch of regulators installed in 2024 has some capacitor degradation. Replacing whole unit.',
        createdAt: '11 Nov 2026, 04:40 PM',
      },
    ],
    comments: [],
  },
  {
    id: 'CMP-2026-1043',
    title: 'Mess dinner rotis undercooked and drinking water cooler filter buzzer active',
    description:
      'Over the past two days, dinner rotis were stiff and undercooked in the center. In addition, the Kent RO water dispenser on ground floor mess has a red filter warning light beeping continuously.',
    category: 'Food Quality',
    priority: 'Medium',
    status: 'Resolved',
    submittedDate: '2026-11-08T20:15:00Z',
    updatedDate: '2026-11-09T18:00:00Z',
    student: {
      id: 'std-004',
      name: 'Sneha Kulkarni',
      email: 'sneha.k@gmail.com',
      phone: '+91 98765 43214',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      roomNumber: '214',
      bedNumber: 'Bed C',
      pgId: 'pg-02',
      pgName: 'Zenith Girls PG',
    },
    assignedTo: AVAILABLE_STAFF[5], // Kavita Patel
    images: [],
    timeline: [
      {
        id: 'tl-14',
        step: 1,
        title: 'Complaint Submitted',
        description: 'Food & water cooler issue logged.',
        timestamp: '08 Nov 2026, 08:15 PM',
        actor: 'Sneha Kulkarni',
        actorRole: 'Student',
        completed: true,
      },
      {
        id: 'tl-24',
        step: 2,
        title: 'Complaint Reviewed',
        description: 'Kavita Patel inspected kitchen gas pressure and RO cartridge.',
        timestamp: '09 Nov 2026, 07:30 AM',
        actor: 'Kavita Patel',
        actorRole: 'Staff',
        completed: true,
      },
      {
        id: 'tl-34',
        step: 3,
        title: 'Work In Progress',
        description: 'RO sediment filter replaced and tandoor chef re-calibrated gas burner heat.',
        timestamp: '09 Nov 2026, 11:00 AM',
        actor: 'Kavita Patel',
        actorRole: 'Staff',
        completed: true,
      },
      {
        id: 'tl-44',
        step: 4,
        title: 'Complaint Resolved',
        description: 'TDS verified at 85 PPM. Quality verified by student committee.',
        timestamp: '09 Nov 2026, 06:00 PM',
        actor: 'Vikramaditya (Owner)',
        actorRole: 'Owner',
        completed: true,
      },
    ],
    adminResponse: {
      message: 'New sediment cartridge and carbon filter installed in Kent RO. Gas burner nozzle cleaned. Thank you for notifying us!',
      responderName: 'Kavita Patel',
      responderRole: 'Mess Supervisor',
      timestamp: '09 Nov 2026, 06:00 PM',
    },
    internalNotes: [
      {
        id: 'note-04',
        author: 'Kavita Patel',
        authorRole: 'Mess Supervisor',
        content: 'Chef informed about kneading time. RO annual service kit deployed.',
        createdAt: '09 Nov 2026, 12:00 PM',
      },
    ],
    comments: [
      {
        id: 'comm-10',
        authorId: 'std-004',
        authorName: 'Sneha Kulkarni',
        authorRole: 'Student',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        message: 'The water tastes great now and tonight rotis were soft. Thank you for the quick action!',
        createdAt: '09 Nov 2026, 08:30 PM',
      },
    ],
  },
  {
    id: 'CMP-2026-1042',
    title: 'Main entrance biometric gate rejection for late study group returnees',
    description:
      'The optical glass on the biometric fingerprint sensor at Wing A gate has scratches and failed to recognize fingerprints for 4 residents returning after 9:30 PM library hours.',
    category: 'Security',
    priority: 'High',
    status: 'Resolved',
    submittedDate: '2026-11-07T22:30:00Z',
    updatedDate: '2026-11-08T15:00:00Z',
    student: {
      id: 'std-005',
      name: 'Mohammed Faizan',
      email: 'm.faizan@gmail.com',
      phone: '+91 98765 43215',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      roomNumber: '105',
      bedNumber: 'Bed A',
      pgId: 'pg-01',
      pgName: 'Green Valley PG',
    },
    assignedTo: AVAILABLE_STAFF[6], // Suraj Thapa
    images: [],
    timeline: [
      {
        id: 'tl-15',
        step: 1,
        title: 'Complaint Submitted',
        description: 'Biometric optical scanner issue reported.',
        timestamp: '07 Nov 2026, 10:30 PM',
        actor: 'Mohammed Faizan',
        actorRole: 'Student',
        completed: true,
      },
      {
        id: 'tl-25',
        step: 2,
        title: 'Complaint Reviewed',
        description: 'Assigned to Suraj Thapa for sensor prism cleaning and re-registration.',
        timestamp: '08 Nov 2026, 08:00 AM',
        actor: 'Vikramaditya',
        actorRole: 'Owner',
        completed: true,
      },
      {
        id: 'tl-35',
        step: 3,
        title: 'Work In Progress',
        description: 'Sensor cleaned with isopropyl alcohol; firmware synced with central database.',
        timestamp: '08 Nov 2026, 11:30 AM',
        actor: 'Suraj Thapa',
        actorRole: 'Staff',
        completed: true,
      },
      {
        id: 'tl-45',
        step: 4,
        title: 'Complaint Resolved',
        description: 'Test scans confirmed 100% recognition rate.',
        timestamp: '08 Nov 2026, 03:00 PM',
        actor: 'Suraj Thapa',
        actorRole: 'Staff',
        completed: true,
      },
    ],
    adminResponse: {
      message: 'Scanner prism was sanitized and re-calibrated. An RFID card reader backup has also been activated.',
      responderName: 'Suraj Thapa',
      responderRole: 'Security In-Charge',
      timestamp: '08 Nov 2026, 03:00 PM',
    },
    internalNotes: [],
    comments: [],
  },
  {
    id: 'CMP-2026-1041',
    title: 'Study desk wooden drawer track jammed with books inside',
    description:
      'The center drawer of the study table in Room 204 has its steel ball-bearing track stuck halfway. Unable to pull it open to access exam hall tickets.',
    category: 'Room Maintenance',
    priority: 'Low',
    status: 'Resolved',
    submittedDate: '2026-11-05T09:00:00Z',
    updatedDate: '2026-11-05T14:00:00Z',
    student: {
      id: 'std-001',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@gmail.com',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      roomNumber: '204',
      bedNumber: 'Bed A',
      pgId: 'pg-01',
      pgName: 'Green Valley PG',
    },
    assignedTo: AVAILABLE_STAFF[4], // Mahendra Singh
    images: [],
    timeline: [
      {
        id: 'tl-16',
        step: 1,
        title: 'Complaint Submitted',
        description: 'Drawer runner misalignment logged.',
        timestamp: '05 Nov 2026, 09:00 AM',
        actor: 'Aarav Sharma',
        actorRole: 'Student',
        completed: true,
      },
      {
        id: 'tl-26',
        step: 2,
        title: 'Complaint Reviewed',
        description: 'Assigned to carpenter Mahendra.',
        timestamp: '05 Nov 2026, 09:30 AM',
        actor: 'Admin',
        actorRole: 'Owner',
        completed: true,
      },
      {
        id: 'tl-36',
        step: 3,
        title: 'Work In Progress',
        description: 'Telescopic drawer channels re-aligned and lubricated with silicone grease.',
        timestamp: '05 Nov 2026, 11:30 AM',
        actor: 'Mahendra Singh',
        actorRole: 'Staff',
        completed: true,
      },
      {
        id: 'tl-46',
        step: 4,
        title: 'Complaint Resolved',
        description: 'Smooth sliding tested and verified by Aarav.',
        timestamp: '05 Nov 2026, 02:00 PM',
        actor: 'Aarav Sharma',
        actorRole: 'Student',
        completed: true,
      },
    ],
    adminResponse: {
      message: 'Drawer channels aligned and lubricated. Please test and confirm!',
      responderName: 'Mahendra Singh',
      responderRole: 'General Maintenance',
      timestamp: '05 Nov 2026, 02:00 PM',
    },
    internalNotes: [],
    comments: [
      {
        id: 'comm-20',
        authorId: 'std-001',
        authorName: 'Aarav Sharma',
        authorRole: 'Student',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        message: 'Works smoothly now, retrieved my documents. Thanks Mahendra bhaiya!',
        createdAt: '05 Nov 2026, 02:15 PM',
      },
    ],
  },
  {
    id: 'CMP-2026-1040',
    title: 'Drinking water dispenser 2nd floor showing high TDS and slight chemical taste',
    description:
      'The cold water tap on 2nd floor dispenser tastes strange today, almost like high chlorine or mineral salts. Requesting testing with digital TDS meter.',
    category: 'Water Supply',
    priority: 'High',
    status: 'Pending',
    submittedDate: '2026-11-12T07:15:00Z',
    updatedDate: '2026-11-12T07:15:00Z',
    student: {
      id: 'std-006',
      name: 'Tanya Mathur',
      email: 'tanya.m@gmail.com',
      phone: '+91 98765 43216',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      roomNumber: '401',
      bedNumber: 'Bed B',
      pgId: 'pg-03',
      pgName: 'Sunrise Luxury PG',
    },
    assignedTo: null,
    images: [],
    timeline: [
      {
        id: 'tl-17',
        step: 1,
        title: 'Complaint Submitted',
        description: 'Water taste variation logged.',
        timestamp: '12 Nov 2026, 07:15 AM',
        actor: 'Tanya Mathur',
        actorRole: 'Student',
        completed: true,
      },
      {
        id: 'tl-27',
        step: 2,
        title: 'Complaint Reviewed',
        description: 'Waiting for water technician visit.',
        timestamp: 'Pending',
        actor: 'System',
        actorRole: 'System',
        completed: false,
      },
      {
        id: 'tl-37',
        step: 3,
        title: 'Work In Progress',
        description: 'Pending membrane check.',
        timestamp: 'Pending',
        actor: 'System',
        actorRole: 'System',
        completed: false,
      },
      {
        id: 'tl-47',
        step: 4,
        title: 'Complaint Resolved',
        description: 'Pending.',
        timestamp: 'Pending',
        actor: 'System',
        actorRole: 'System',
        completed: false,
      },
    ],
    adminResponse: null,
    internalNotes: [],
    comments: [],
  },
];

const STORAGE_KEY = 'pgmitra_complaints_v1';

export function getStoredComplaints(): Complaint[] {
  if (typeof window === 'undefined') {
    return INITIAL_COMPLAINTS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COMPLAINTS));
      return INITIAL_COMPLAINTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COMPLAINTS));
    return INITIAL_COMPLAINTS;
  } catch (err) {
    console.error('Failed reading complaints from localStorage:', err);
    return INITIAL_COMPLAINTS;
  }
}

export function saveStoredComplaints(complaints: Complaint[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
    window.dispatchEvent(new Event('pgmitra_complaints_updated'));
  } catch (err) {
    console.error('Failed saving complaints to localStorage:', err);
  }
}

export function calculateOwnerStats(complaints: Complaint[]): ComplaintStats {
  const total = complaints.length;
  const newComplaints = complaints.filter(
    (c) => c.status === 'Pending' || c.status === 'Reviewed'
  ).length;
  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;
  const urgentCount = complaints.filter(
    (c) => c.priority === 'Urgent' && c.status !== 'Resolved' && c.status !== 'Rejected'
  ).length;

  return { total, newComplaints, pending, inProgress, resolved, urgentCount };
}

export function calculateStudentStats(complaints: Complaint[], studentId: string): {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
} {
  const studentComplaints = complaints.filter((c) => c.student.id === studentId);
  return {
    total: studentComplaints.length,
    pending: studentComplaints.filter((c) => c.status === 'Pending' || c.status === 'Reviewed').length,
    inProgress: studentComplaints.filter((c) => c.status === 'In Progress').length,
    resolved: studentComplaints.filter((c) => c.status === 'Resolved').length,
  };
}

export function exportComplaintsCSV(complaints: Complaint[]): void {
  if (typeof window === 'undefined') return;

  const headers = [
    'Complaint ID',
    'Title',
    'Category',
    'Priority',
    'Status',
    'Student Name',
    'Room Number',
    'PG Name',
    'Phone',
    'Assigned To',
    'Submitted Date',
    'Last Updated',
  ];

  const rows = complaints.map((c) => [
    c.id,
    `"${c.title.replace(/"/g, '""')}"`,
    c.category,
    c.priority,
    c.status,
    `"${c.student.name.replace(/"/g, '""')}"`,
    c.student.roomNumber,
    `"${c.student.pgName.replace(/"/g, '""')}"`,
    c.student.phone,
    c.assignedTo ? `"${c.assignedTo.name.replace(/"/g, '""')}"` : 'Unassigned',
    new Date(c.submittedDate).toLocaleDateString(),
    new Date(c.updatedDate).toLocaleDateString(),
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `PGMitra_Complaints_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
