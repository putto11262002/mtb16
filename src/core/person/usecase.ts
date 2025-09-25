import { db } from "@/db";
import { persons, type Person } from "@/db/schema";
import { getFileStore } from "@/lib/storage";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "../shared/constants";
import type { PaginatedResult } from "../shared/types";
import { createPaginatedResult } from "../shared/utils";
import type {
  CreatePersonInput,
  DeletePersonInput,
  GetManyPersonsInput,
  UpdatePersonInput,
  UpdatePortraitInput,
} from "./schema";

const thaiArmyRanks = {
  จอมพล: 1, // Chom phon
  พลเอก: 2, // Phon ek
  พลโท: 3, // Phon tho
  พลตรี: 4, // Phon tri
  พันเอก: 5, // Phan ek
  พันโท: 6, // Phan tho
  พันตรี: 7, // Phan tri
  ร้อยเอก: 8, // Roi ek
  ร้อยโท: 9, // Roi tho
  ร้อยตรี: 10, // Roi tri
};

const create = async (input: CreatePersonInput) => {
  const id = await db
    .insert(persons)
    .values({
      name: input.name,
      rank: input.rank,
      role: input.role,
      unitId: input.unitId,
      bio: input.bio,
      order: input.order,
      rankOrder: input.rank
        ? (thaiArmyRanks[input.rank as keyof typeof thaiArmyRanks] ?? 100)
        : undefined,
    })
    .returning({ id: persons.id })
    .then((result) => result?.[0].id);
  return { id };
};

const update = async (input: UpdatePersonInput) => {
  if (!(await exist(input.id))) {
    throw new Error("Person not found");
  }
  await db
    .update(persons)
    .set({
      name: input.name,
      rank: input.rank,
      role: input.role,
      unitId: input.unitId,
      bio: input.bio,
      order: input.order,
      rankOrder: input.rank
        ? (thaiArmyRanks[input.rank as keyof typeof thaiArmyRanks] ?? 100)
        : undefined,
    })
    .where(eq(persons.id, input.id));
};

const updatePortrait = async (input: UpdatePortraitInput) => {
  if (!(await exist(input.id))) {
    throw new Error("Person not found");
  }

  await db.transaction(async (tx) => {
    const existingPortrait = await tx.query.persons
      .findFirst({
        where: eq(persons.id, input.id),
        columns: { portrait: true },
      })
      .then((res) => res?.portrait);

    const metadata = await getFileStore().store(
      Buffer.from(await input.file.arrayBuffer()),
      {
        mimeType: input.file.type,
        name: input.file.name,
      },
    );
    await db
      .update(persons)
      .set({ portrait: metadata.id })
      .where(eq(persons.id, input.id));

    if (existingPortrait) {
      await getFileStore().delete(existingPortrait);
    }
  });
};

const exist = async (id: string): Promise<boolean> => {
  const countResult = await db
    .select({ count: count() })
    .from(persons)
    .where(eq(persons.id, id));
  return countResult[0].count > 0;
};

const getMany = async ({
  page = DEFAULT_PAGE_NUMBER,
  pageSize = DEFAULT_PAGE_SIZE,
  q,
  unitId,
  rank,
  orderBy = "createdAt",
  direction = "desc",
}: GetManyPersonsInput): Promise<PaginatedResult<Person>> => {
  const [items, itemCount] = await Promise.all([
    db.query.persons.findMany({
      where: and(
        q ? ilike(persons.name, `${q}%`) : undefined,
        unitId ? eq(persons.unitId, unitId) : undefined,
        rank ? eq(persons.rank, rank) : undefined,
      ),

      limit: pageSize,
      offset: (page - 1) * pageSize,
      orderBy: (direction === "asc" ? asc : desc)(
        persons[orderBy as "name" | "rank" | "createdAt"],
      ),
    }),
    db
      .select({ count: count() })
      .from(persons)
      .where(
        and(
          q ? ilike(persons.name, `${q}%`) : undefined,
          unitId ? eq(persons.unitId, unitId) : undefined,
          rank ? eq(persons.rank, rank) : undefined,
        ),
      )
      .then((res) => res[0].count),
  ]);

  return createPaginatedResult(items, itemCount, page, pageSize);
};

const getById = async (id: string): Promise<Person | undefined> => {
  const person = await db.query.persons.findFirst({
    where: eq(persons.id, id),
  });
  return person;
};

const getAll = async (): Promise<Person[]> => {
  const allPersons = await db.query.persons.findMany({
    orderBy: asc(persons.name),
  });
  return allPersons;
};

const getPersonsByUnit = async (unitId: string): Promise<Person[]> => {
  const personsInUnit = await db.query.persons.findMany({
    where: eq(persons.unitId, unitId),
    orderBy: asc(persons.name),
  });
  return personsInUnit;
};

const getPersonRankTree = async (): Promise<Person[][]> => {
  const allPersons = await db.query.persons.findMany();

  // Sort all persons by rank hierarchy
  const sortedPersons = allPersons.sort((a, b) => {
    const rankA = thaiArmyRanks[a.rank as keyof typeof thaiArmyRanks] ?? 100;
    const rankB = thaiArmyRanks[b.rank as keyof typeof thaiArmyRanks] ?? 100;
    return rankA - rankB;
  });

  // Group into levels based on rank order
  const levels: Person[][] = Array.from({ length: 10 }, () => []); // Create 10 empty arrays for levels

  sortedPersons.forEach((person) => {
    const rankOrder =
      thaiArmyRanks[person.rank as keyof typeof thaiArmyRanks] ?? 100;
    levels[rankOrder - 1].push(person); // Place person in the corresponding level
  });

  // Intra-level sorting by order
  levels.forEach((level) => {
    level.sort((a, b) => {
      if (a.order != null && b.order !== null) {
        return a.order - b.order;
      }
      if (a.order !== null) return -1; // a has order, b doesn't
      if (b.order !== null) return 1; // b has order, a doesn't
      return 0; // neither has order
    });
  });

  return levels;
};

const deletePerson = async (args: DeletePersonInput) => {
  if (!(await exist(args.id))) {
    throw new Error("Person not found");
  }
  await db.delete(persons).where(eq(persons.id, args.id));
};

export const personUsecase = {
  create,
  update,
  updatePortrait,
  getMany,
  getById,
  getAll,
  getPersonsByUnit,
  getPersonRankTree,
  deletePerson,
};
