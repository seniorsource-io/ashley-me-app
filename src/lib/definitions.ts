import { communities, customers, communityInquiries, user } from "@/db/schema";

export type Community = typeof communities.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type CommunityInquiry = typeof communityInquiries.$inferSelect;
export type User = typeof user.$inferSelect;

export type MailingAddress = {
  address: string;
  city: string;
  state: string;
  zip: string;
};
