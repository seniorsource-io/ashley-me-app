import {
  communities,
  customers,
  communityInquiries,
  inspections,
  violations,
  regulatoryActions,
  user,
} from "./schema";

export type Community = typeof communities.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type CommunityInquiry = typeof communityInquiries.$inferSelect;
export type Inspection = typeof inspections.$inferSelect;
export type Violation = typeof violations.$inferSelect;
export type RegulatoryAction = typeof regulatoryActions.$inferSelect;
export type User = typeof user.$inferSelect;

export type MailingAddress = {
  address: string;
  city: string;
  state: string;
  zip: string;
};
