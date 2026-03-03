export interface BuddyGroupMember {
  id: string;
  group_id: string;
  member_name: string | null;
  session_id: string | null;
  created_at: Date;
}

export interface BuddyGroup {
  id: string;
  route: string;
  time: string;
  max_members: number;
  start_point: string;
  end_point: string;
  verified: boolean;
  created_at: Date;
  members?: BuddyGroupMember[];
}
