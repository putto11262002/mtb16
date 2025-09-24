import { postUsecase } from "@/core/post/usecase";
import { tagUsecase } from "@/core/tag/usecase";
import type { Post } from "@/db/schema";
import type { PaginatedResult } from "../shared/types";
import type {
  AddAttachmentInput,
  createAnnouncementInput,
  DeleteAnnouncementInput,
  GetManyAnnouncementsInput,
  RemoveAttachmentInput,
  updateAnnouncementInput,
  UpdatePreviewImage,
} from "./schema";

const create = async (input: createAnnouncementInput) => {
  return await postUsecase.create({
    title: input.title,
    body: input.body,
    tags: input.tags,
    type: "announcement",
  });
};

const update = async (input: updateAnnouncementInput) => {
  await postUsecase.update({
    id: input.id,
    title: input.title,
    body: input.body,
    tags: input.tags,
    type: "announcement",
  });
};

const publish = async (id: string) => {
  await postUsecase.publish(id);
};

const unpublish = async (id: string) => {
  await postUsecase.unpublish(id);
};

const updatePreviewImage = async (input: UpdatePreviewImage) => {
  await postUsecase.updatePreviewImage(input);
};

const addAttachment = async (input: AddAttachmentInput) => {
  await postUsecase.addAttachment(input);
};

const removeAttatch = async (input: RemoveAttachmentInput) => {
  await postUsecase.removeAttachment(input);
};

const getMany = async (
  input: GetManyAnnouncementsInput,
): Promise<PaginatedResult<Post>> => {
  return await postUsecase.getMany({
    ...input,
    type: "announcement",
  });
};

const getById = async (id: string): Promise<Post | undefined> => {
  return await postUsecase.getById(id);
};

const deleteAnnouncement = async (input: DeleteAnnouncementInput) => {
  await postUsecase.deletePost(input);
};

const getAllTags = async (): Promise<string[]> => {
  return await tagUsecase.getTagsByType("announcement");
};

export const annouyncementsUsecase = {
  publish,
  unpublish,
  create,
  update,
  getMany,
  getById,
  updatePreviewImage,
  addAttachment,
  removeAttatch,
  deleteAnnouncement,
  getAllTags,
};
