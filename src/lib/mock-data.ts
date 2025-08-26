export const announcements = [
  {
    id: '1',
    title: 'New Unit Formation Announcement',
    content: 'We are pleased to announce the formation of a new specialized unit focusing on cyber defense. This unit will be operational starting next month.',
    published_at: new Date('2025-08-15T10:00:00Z'),
    author: 'Commander\'s Office',
    tags: ['official', 'unit formation', 'cyber defense'],
    attachments: [],
  },
  {
    id: '2',
    title: 'Annual Physical Fitness Test Schedule',
    content: 'The annual physical fitness test for all personnel will be held from September 1st to September 5th. Please check with your unit leaders for specific schedules.',
    published_at: new Date('2025-08-10T14:30:00Z'),
    author: 'Training Department',
    tags: ['fitness', 'schedule', 'personnel'],
    attachments: [
      { url: '/documents/fitness-test-guidelines.pdf', title: 'Fitness Test Guidelines' },
    ],
  },
  {
    id: '3',
    title: 'Safety Regulations Update',
    content: 'Updated safety regulations regarding equipment handling have been issued. All personnel are required to review the new guidelines.',
    published_at: new Date('2025-08-05T09:00:00Z'),
    author: 'Safety Office',
    tags: ['safety', 'regulations'],
    attachments: [],
  },
];
