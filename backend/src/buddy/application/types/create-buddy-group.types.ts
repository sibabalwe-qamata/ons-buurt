export interface CreateBuddyGroupInput {
  route: string;
  time: string;
  max_members: number;
  start_point: string;
  end_point: string;
  verified?: boolean;
}

export interface JoinBuddyGroupInput {
  member_name?: string;
  session_id?: string;
}
