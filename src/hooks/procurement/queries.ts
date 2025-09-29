import type { GetManyProcurementsInput } from "@/core/procurement/schema";
import { useQuery } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const useGetProcurements = (props: GetManyProcurementsInput) =>
  useQuery({
    queryKey: ["procurements", props],
    queryFn: async () => {
      const result = await actions.procurement.getMany.orThrow(props);
      return result;
    },
  });

export const useGetProcurement = ({ id }: { id: string | undefined }) =>
  useQuery({
    queryKey: ["procurements", id],
    queryFn: async () => {
      const result = await actions.procurement.getById.orThrow(id!);
      return result;
    },
    enabled: !!id,
  });
