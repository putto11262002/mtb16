import type { GetManyPersonsInput } from "@/core/person/schema";
import { useQuery } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const useGetPersons = (props: GetManyPersonsInput) =>
  useQuery({
    queryKey: ["persons", props],
    queryFn: async () => {
      const result = await actions.person.getMany.orThrow(props);
      return result;
    },
  });

export const useGetPerson = ({ id }: { id: string | undefined }) =>
  useQuery({
    queryKey: ["persons", id],
    queryFn: async () => {
      const result = await actions.person.getById.orThrow(id!);
      return result;
    },
    enabled: !!id,
  });

export const useGetPersonRankTree = () =>
  useQuery({
    queryKey: ["persons", "rank-tree"],
    queryFn: async () => {
      const result = await actions.person.getPersonRankTree.orThrow({});
      return result;
    },
  });
