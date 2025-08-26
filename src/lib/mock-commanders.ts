// src/lib/mock-commanders.ts

export interface Commander {
  name: string;
  title: string;
  image: string;
  subordinates?: Commander[];
}

export const commandStructure: Commander = {
  name: 'พลเอก เกรียงไกร ศรีธรรมา',
  title: 'ผู้บัญชาการทหารบก',
  image: '/unit_commander.jpg',
  subordinates: [
    {
      name: 'พลโท สุรชัย ปัญญา',
      title: 'แม่ทัพภาคที่ 1',
      image: '/unit_commander.jpg',
      subordinates: [
        {
          name: 'พลตรี วีรยุทธ พร้อมรบ',
          title: 'ผู้บัญชาการกองพลที่ 1 รักษาพระองค์',
          image: '/unit_commander.jpg',
          subordinates: [
            {
              name: 'พันเอก วรเชษฐ์ ตานาสนร',
              title: 'ผู้บังคับการกรมทหารราบที่ 1',
              image: '/unit_commander.jpg',
            },
          ],
        },
      ],
    },
    {
      name: 'พลโท ธนากรณ์ นพรัตน์',
      title: 'แม่ทัพภาคที่ 2',
      image: '/unit_commander.jpg',
      subordinates: [
        {
          name: 'พลตรี ณรงค์ฤทธิ์ ชัยสิทธิ์',
          title: 'ผู้บัญชาการกองพลทหารราบที่ 3',
          image: '/unit_commander.jpg',
        },
      ],
    },
  ],
};
