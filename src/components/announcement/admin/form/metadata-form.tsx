import {
  createAnnouncementInputSchema,
  type Announcement,
} from "@/core/announcement/schema";

type AnnouncementMetadata = Pick<Announcement, "title" | "body" | "tags">;

const metadataFormSchema = createAnnouncementInputSchema.pick({
  title: true,
  body: true,
  tags: true,
});

export const MetadataForm: React.FC<{
  initialData: AnnouncementMetadata;
  onSubmit: (data: AnnouncementMetadata) => void;
  isPending?: boolean;
}> = ({ initialData, onSubmit, isPending }) => {
  return <div></div>;
};

