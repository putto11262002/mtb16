import type {
  AddProcurementAttachmentInput,
  createProcurementInput,
  DeleteProcurementInput,
  RemoveProcurementAttachmentInput,
  UpdateAnnualPlanInput,
  UpdateInvitationDocsInput,
  UpdatePriceDisclosureDocsInput,
  updateProcurementInput,
  UpdateWinnerDeclarationDocsInput,
} from "@/core/procurement/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { actions } from "astro:actions";

export const useDeleteProcurement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: DeleteProcurementInput) => {
      await actions.procurement.delete.orThrow(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procurements"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useCreateProcurement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: createProcurementInput) => {
      await actions.procurement.create.orThrow(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procurements"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateProcurement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: updateProcurementInput) => {
      await actions.procurement.update.orThrow(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procurements"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateAnnualPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateAnnualPlanInput) => {
      await actions.procurement.updateAnnualPlan.orThrow(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procurements"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateInvitationDocs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateInvitationDocsInput) => {
      const formData = new FormData();
      formData.append("id", input.id);
      input.files.forEach((file) => {
        formData.append("files", file);
      });
      await actions.procurement.updateInvitationDocs.orThrow(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procurements"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdatePriceDisclosureDocs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdatePriceDisclosureDocsInput) => {
      const formData = new FormData();
      formData.append("id", input.id);
      input.files.forEach((file) => {
        formData.append("files", file);
      });
      await actions.procurement.updatePriceDisclosureDocs.orThrow(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procurements"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateWinnerDeclarationDocs = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateWinnerDeclarationDocsInput) => {
      const formData = new FormData();
      formData.append("id", input.id);
      input.files.forEach((file) => {
        formData.append("files", file);
      });
      await actions.procurement.updateWinnerDeclarationDocs.orThrow(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procurements"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useAddProcurementAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: AddProcurementAttachmentInput) => {
      const formData = new FormData();
      formData.append("id", input.id);
      formData.append("label", input.label);
      formData.append("file", input.file);
      await actions.procurement.addAttachment.orThrow(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procurements"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useRemoveProcurementAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: RemoveProcurementAttachmentInput) => {
      await actions.procurement.removeAttachment.orThrow(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["procurements"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
