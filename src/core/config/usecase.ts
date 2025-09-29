import { db } from "@/db";
import { configs, type Config } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import type {
  DeleteConfigInput,
  GetConfigInput,
  GetManyConfigsInput,
  PutConfigInput,
} from "./schema";

const put = async (input: PutConfigInput) => {
  await db
    .insert(configs)
    .values({
      group: input.group,
      key: input.key,
      value: input.value,
    })
    .onConflictDoUpdate({
      target: [configs.key, configs.group],
      set: {
        value: input.value,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      },
    });
};

const getMany = async (input: GetManyConfigsInput): Promise<Config[]> => {
  return await db
    .select()
    .from(configs)
    .where(input.group ? eq(configs.group, input.group) : undefined);
};

const getConfig = async (
  input: GetConfigInput,
): Promise<Config | undefined> => {
  const result = await db
    .select()
    .from(configs)
    .where(and(eq(configs.group, input.group), eq(configs.key, input.key)));
  return result[0];
};

const deleteConfig = async (input: DeleteConfigInput) => {
  await db
    .delete(configs)
    .where(and(eq(configs.group, input.group), eq(configs.key, input.key)));
};

export const configUsecase = {
  put,
  getMany,
  getConfig,
  deleteConfig,
};
