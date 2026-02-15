"use client";

import { updateUserRole } from "@/actions/admin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function RoleSelector({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: "student" | "teacher" | "admin";
}) {
  async function handleChange(value: string) {
    const result = await updateUserRole(
      userId,
      value as "student" | "teacher" | "admin"
    );
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Role updated!");
    }
  }

  return (
    <Select defaultValue={currentRole} onValueChange={handleChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="student">Student</SelectItem>
        <SelectItem value="teacher">Teacher</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
}
