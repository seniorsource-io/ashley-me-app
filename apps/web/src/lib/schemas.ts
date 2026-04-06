import { z } from "zod";

export const communityInquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  careHomeName: z.string().min(1, "Care home name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Enter a valid phone number"),
  email: z.email("Enter a valid email address"),
});

export type CommunityInquiryFormData = z.infer<typeof communityInquirySchema>;

export const customerIntakeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Enter a valid email address"),
  mobilePhone: z.string().optional(),
});

export type CustomerIntakeFormData = z.infer<typeof customerIntakeSchema>;
