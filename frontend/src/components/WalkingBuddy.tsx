import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Loader2, MapPin, Shield, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api, type BuddyGroupApi } from "@/lib/api";

function toDisplayGroup(g: BuddyGroupApi) {
  const members = g.members?.length ?? 0;
  return {
    id: g.id,
    route: g.route,
    time: g.time,
    members,
    maxMembers: g.max_members,
    startPoint: g.start_point,
    endPoint: g.end_point,
    verified: g.verified,
  };
}

const WalkingBuddy = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    route: "",
    time: "",
    maxMembers: 8,
    startPoint: "",
    endPoint: "",
  });

  const { data: groups = [] } = useQuery({
    queryKey: ["buddy-groups"],
    queryFn: () => api.buddyGroups.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof createForm) =>
      api.buddyGroups.create({
        route: data.route,
        time: data.time,
        maxMembers: data.maxMembers,
        startPoint: data.startPoint,
        endPoint: data.endPoint,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buddy-groups"] });
      toast({ title: "Group created!", description: "Your walking group is now live." });
      setCreateOpen(false);
      setCreateForm({ route: "", time: "", maxMembers: 8, startPoint: "", endPoint: "" });
    },
    onError: (err) => {
      toast({
        title: "Failed to create group",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const joinMutation = useMutation({
    mutationFn: (id: string) => api.buddyGroups.join(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buddy-groups"] });
      toast({ title: "Joined!", description: "You're now part of the group." });
    },
    onError: (err) => {
      toast({
        title: "Could not join",
        description: err instanceof Error ? err.message : "Group may be full.",
        variant: "destructive",
      });
    },
  });

  const displayGroups = groups.map(toDisplayGroup);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.route || !createForm.time || !createForm.startPoint || !createForm.endPoint)
      return;
    createMutation.mutate(createForm);
  };

  return (
    <section id="buddy" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 mb-4">
            <Users className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">Walking Buddy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-3">
            Never Walk Alone
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Join a group heading your way. Safety in numbers — coordinated walks for commuters, students, and families.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayGroups.map((group, i) => {
            const isJoining = joinMutation.isPending && joinMutation.variables === group.id;
            const isFull = group.members >= group.maxMembers;
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-heading font-semibold text-foreground">{group.time}</span>
                  </div>
                  {group.verified && (
                    <Badge variant="secondary" className="text-xs gap-1">
                      <Shield className="w-3 h-3" /> Verified
                    </Badge>
                  )}
                </div>

                <h3 className="font-medium text-card-foreground text-sm mb-3">{group.route}</h3>

                <div className="space-y-2 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-safe" />
                    <span>{group.startPoint}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-3 h-3" />
                    <span>{group.endPoint}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{group.members} / {group.maxMembers} members</span>
                    <span>{Math.round((group.members / group.maxMembers) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full transition-all"
                      style={{ width: `${(group.members / group.maxMembers) * 100}%` }}
                    />
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
                  disabled={isFull || isJoining}
                  onClick={() => joinMutation.mutate(group.id)}
                >
                  {isJoining ? <Loader2 className="w-4 h-4 animate-spin" /> : isFull ? "Full" : "Join Group"}
                </Button>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg">
                <Users className="w-5 h-5 mr-2" />
                Create a New Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Walking Group</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <Label htmlFor="route">Route name</Label>
                  <Input
                    id="route"
                    placeholder="e.g., Manenberg → Station"
                    value={createForm.route}
                    onChange={(e) => setCreateForm((f) => ({ ...f, route: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    placeholder="e.g., 06:30 AM"
                    value={createForm.time}
                    onChange={(e) => setCreateForm((f) => ({ ...f, time: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="startPoint">Start point</Label>
                  <Input
                    id="startPoint"
                    placeholder="e.g., Shoprite Manenberg"
                    value={createForm.startPoint}
                    onChange={(e) => setCreateForm((f) => ({ ...f, startPoint: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endPoint">End point</Label>
                  <Input
                    id="endPoint"
                    placeholder="e.g., Manenberg Station"
                    value={createForm.endPoint}
                    onChange={(e) => setCreateForm((f) => ({ ...f, endPoint: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="maxMembers">Max members</Label>
                  <Input
                    id="maxMembers"
                    type="number"
                    min={2}
                    max={50}
                    value={createForm.maxMembers}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, maxMembers: parseInt(e.target.value) || 8 }))
                    }
                  />
                </div>
                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Group"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </section>
  );
};

export default WalkingBuddy;
