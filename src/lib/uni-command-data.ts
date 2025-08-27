export interface Commander {
  id: string;
  name: string;
  title: string;
  image: string;
  subordinates: Commander[];
}

export const commandHierarchy: Commander = {
  id: '1',
  name: 'พลเอก สมชาย ยิ่งเจริญ',
  title: 'ผู้บัญชาการ',
  image: '/unit_commander.jpg',
  subordinates: [
    {
      id: '2',
      name: 'พลโทหญิง สุพัตรา กิจงาม',
      title: 'รองผู้บัญชาการ',
      image: '/unit_commander.jpg',
      subordinates: [
        {
          id: '4',
          name: 'พันเอก นพดล ประเสริฐ',
          title: 'ฝ่ายส่งกำลังบำรุง',
          image: '/unit_commander.jpg',
          subordinates: [],
        },
      ],
    },
    {
      id: '3',
      name: 'พลตรี วิทยา สุขสมัย',
      title: 'เสนาธิการ',
      image: '/unit_commander.jpg',
      subordinates: [],
    },
  ],
};
