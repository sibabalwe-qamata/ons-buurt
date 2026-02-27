import { motion } from "framer-motion";
import { Users, Clock, MapPin, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BuddyGroup {
  id: number;
  route: string;
  time: string;
  members: number;
  maxMembers: number;
  startPoint: string;
  endPoint: string;
  verified: boolean;
}

const mockGroups: BuddyGroup[] = [
  { id: 1, route: "Manenberg → Station", time: "06:30 AM", members: 4, maxMembers: 8, startPoint: "Shoprite Manenberg", endPoint: "Manenberg Station", verified: true },
  { id: 2, route: "Mitchells Plain → Rank", time: "07:00 AM", members: 6, maxMembers: 10, startPoint: "Town Centre", endPoint: "Taxi Rank", verified: true },
  { id: 3, route: "School Route – Safe Walk", time: "07:15 AM", members: 3, maxMembers: 6, startPoint: "Community Hall", endPoint: "Manenberg Primary", verified: false },
  { id: 4, route: "Evening Return – Station", time: "05:30 PM", members: 5, maxMembers: 8, startPoint: "Manenberg Station", endPoint: "Duinefontein Rd", verified: true },
];

const WalkingBuddy = () => {
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
          {mockGroups.map((group, i) => (
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

              {/* Members bar */}
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

              <Button size="sm" variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                Join Group
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Button variant="outline" size="lg">
            <Users className="w-5 h-5 mr-2" />
            Create a New Group
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default WalkingBuddy;
