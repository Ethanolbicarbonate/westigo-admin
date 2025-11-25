import { z } from 'zod';

// Login Form Schema
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Facility Form Schema (Placeholder for Phase 4)
export const facilitySchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  latitude: z.number().min(-90).max(90, "Invalid latitude"),
  longitude: z.number().min(-180).max(180, "Invalid longitude"),
});

// Space Form Schema (Placeholder for Phase 5)
export const spaceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  parent_facility_id: z.number({ required_error: "Parent facility is required" }),
  floor_level: z.string().optional(),
  description: z.string().optional(),
});