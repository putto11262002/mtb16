import "dotenv/config";
import { personUsecase } from "../src/core/person/usecase";

async function seedPersons() {
  console.log("Seeding mock person data...");

  // Mock data for hierarchy:
  // Level 0: 1 person (root)
  // Level 1: 2 persons
  // Level 2: 6 persons (2 under first level 1, 4 under second level 1)

  const mockPersons = [
    {
      name: "พลเอก สมชาย ใจดี",
      rank: "พลเอก",
      role: "ผู้บัญชาการ",
      level: 0,
      order: 1,
    },
    {
      name: "พันเอก อำนาจ จริงใจ",
      rank: "พันเอก",
      role: "รองผู้บัญชาการ",
      level: 1,
      order: 1,
    },
    {
      name: "พันเอก วีระชัย มั่นคง",
      rank: "พันเอก",
      role: "รองผู้บัญชาการ",
      level: 1,
      order: 2,
    },
    {
      name: "ร้อยเอก ประสิทธิ์ ฉลาด",
      rank: "ร้อยเอก",
      role: "หัวหน้าหน่วย",
      level: 2,
      order: 1,
    },
    {
      name: "ร้อยเอก สุชาติ รอบรู้",
      rank: "ร้อยเอก",
      role: "หัวหน้าหน่วย",
      level: 2,
      order: 2,
    },
    {
      name: "ร้อยเอก ธนากร เสียสละ",
      rank: "ร้อยเอก",
      role: "หัวหน้าหน่วย",
      level: 2,
      order: 3,
    },
    {
      name: "ร้อยเอก พิชัย กล้าหาญ",
      rank: "ร้อยเอก",
      role: "หัวหน้าหน่วย",
      level: 2,
      order: 4,
    },
    {
      name: "ร้อยโท ณรงค์ ว่องไว",
      rank: "ร้อยโท",
      role: "ผู้ช่วยหัวหน้าหน่วย",
      level: 2,
      order: 5,
    },
    {
      name: "ร้อยโท วิชัย ซื่อสัตย์",
      rank: "ร้อยโท",
      role: "ผู้ช่วยหัวหน้าหน่วย",
      level: 2,
      order: 6,
    },
  ];

  for (const person of mockPersons) {
    try {
      const result = await personUsecase.create(person);
      console.log(`Created person: ${person.name} with ID: ${result.id}`);
    } catch (error) {
      console.error(`Failed to create person: ${person.name}`, error);
    }
  }

  console.log("Seeding completed.");
}

// Run the seeding
seedPersons().catch(console.error);
