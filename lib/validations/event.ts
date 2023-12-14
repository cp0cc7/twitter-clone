import * as z from "zod";

export const EventValidation = z.object({
  eventName: z.string(),
  organiserId: z.string(),
  imagePath: z.string(),
  house: z.string(),
  form: z.string(),
  date: z.date(),
  interestedPeople: z.array(z.any()),
  description: z.string().nonempty().min(3, { message: "Minimum 3 characters." })
});
