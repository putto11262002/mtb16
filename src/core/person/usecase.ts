import { db } from "@/db";
import { persons, type Person } from "@/db/schema";
import { getFileStore } from "@/lib/storage";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  THAI_ARMY_RANKS,
} from "../shared/constants";
import type { PaginatedResult } from "../shared/types";
import { createPaginatedResult } from "../shared/utils";
import type {
  CreatePersonInput,
  DeletePersonInput,
  GetManyPersonsInput,
  UpdatePersonInput,
  UpdatePortraitInput,
} from "./schema";

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
      level: input.level,
      rankOrder: input.rank
        ? (THAI_ARMY_RANKS[input.rank as keyof typeof THAI_ARMY_RANKS] ?? 100)
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
      level: input.level,
      rankOrder: input.rank
        ? (THAI_ARMY_RANKS[input.rank as keyof typeof THAI_ARMY_RANKS] ?? 100)
        : undefined,
    })
    .where(eq(persons.id, input.id));
};

const updatePortrait = async (input: UpdatePortraitInput) => {
  if (!(await exist(input.id))) {
    throw new Error("Person not found");
  }

  const res = await (db as any)
    .select({ portrait: persons.portrait })
    .from(persons)
    .where(eq(persons.id, input.id));
  const existingPortrait = res[0]?.portrait;

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
    db
      .select()
      .from(persons)
      .where(
        and(
          q ? ilike(persons.name, `${q}%`) : undefined,
          unitId ? eq(persons.unitId, unitId) : undefined,
          rank ? eq(persons.rank, rank) : undefined,
        ),
      )
      .orderBy(
        (direction === "asc" ? asc : desc)(
          persons[orderBy as "name" | "rank" | "level" | "createdAt"],
        ),
      )
      .limit(pageSize)
      .offset((page - 1) * pageSize),
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
  const person = await db
    .select()
    .from(persons)
    .where(eq(persons.id, id))
    .limit(1)
    .then((res) => res[0]);
  return person;
};

const getAll = async (): Promise<Person[]> => {
  const allPersons = await db.select().from(persons).orderBy(asc(persons.name));
  return allPersons;
};

const getPersonsByUnit = async (unitId: string): Promise<Person[]> => {
  const personsInUnit = await db
    .select()
    .from(persons)
    .where(eq(persons.unitId, unitId))
    .orderBy(asc(persons.name));
  return personsInUnit;
};

const getPersonRankTree = async (): Promise<Person[][]> => {
  const allPersons = await db.select().from(persons);

  // Sort all persons by rank hierarchy
  const sortedPersons = allPersons.sort((a, b) => {
    const rankA =
      THAI_ARMY_RANKS[a.rank as keyof typeof THAI_ARMY_RANKS] ?? 100;
    const rankB =
      THAI_ARMY_RANKS[b.rank as keyof typeof THAI_ARMY_RANKS] ?? 100;
    return rankA - rankB;
  });

  // Group into levels based on rank order
  const levels: Person[][] = Array.from({ length: 10 }, () => []); // Create 10 empty arrays for levels

  sortedPersons.forEach((person) => {
    const rankOrder =
      THAI_ARMY_RANKS[person.rank as keyof typeof THAI_ARMY_RANKS] ?? 100;
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

const getByOrder = async (order: number): Promise<Person | undefined> => {
  const person = await db
    .select()
    .from(persons)
    .where(eq(persons.order, order))
    .limit(1)
    .then((res) => res[0]);
  return person;
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
  getByOrder,
  deletePerson,
};
