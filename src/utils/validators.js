import { z } from 'zod';

// Login Schema
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Facility Schema
export const facilitySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  // Use z.coerce to automatically convert string inputs to numbers
  latitude: z.coerce.number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  longitude: z.coerce.number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
});

export const spaceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  // We use z.coerce.number() to handle potential string inputs from HTML selects safely
  parent_facility_id: z.coerce.number({ invalid_type_error: "Parent facility is required" }).min(1, "Parent facility is required"),
  floor_level: z.string().optional(),
  description: z.string().optional(),
});

export const eventSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  
  // Location maps to a Space ID
  location_id: z.coerce.number({ invalid_type_error: "Location is required" }).min(1, "Location is required"),
  
  // Dates (We expect Date objects from the DatePicker)
  start_date: z.date({ required_error: "Start date is required", invalid_type_error: "Invalid date" }),
  end_date: z.date({ required_error: "End date is required", invalid_type_error: "Invalid date" }),
  
  // Scopes (Array of strings)
  scopes: z.array(z.string()).min(1, "Select at least one audience scope"),
}).refine((data) => data.end_date > data.start_date, {
  message: "End date must be after start date",
  path: ["end_date"], // Error shows on the End Date field
});