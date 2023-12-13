import * as z from "zod";

export const UserValidation = z.object({
  profile_photo: z.string().url().nonempty(), //profile photo must be a string
  name: z
    .string()
    .min(3, { message: "Minimum 3 characters." }) //same deal with the other boxes
    .max(30, { message: "Maximum 30 caracters." }),
  username: z
    .string()
    .min(3, { message: "Minimum 3 characters." })
    .max(30, { message: "Maximum 30 caracters." }),
  bio: z
    .string()
    .min(3, { message: "Minimum 3 characters." })
    .max(1000, { message: "Maximum 1000 caracters." }),
    house: z
    .string()
    .min(3)
    .max(1000)
    .refine((value) => {
      // Ensure at least one house option is selected
      return value !== undefined && value !== null && value.trim() !== "";
    }, { message: "Please select a house." }),
    form: z
    .string()
    .min(3, { message: "Minimum 3 characters." })
    .max(1000, { message: "Maximum 1000 caracters." }),
});