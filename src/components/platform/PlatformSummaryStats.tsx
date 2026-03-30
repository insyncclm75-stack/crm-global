import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, UserCheck, Activity, PhoneCall, Mail } from "lucide-react";

interface PlatformStats {
  totalOrgs: number;
  activeOrgs: number;
  totalUsers: number;
  totalContacts: number;
  usersLast1Day: number;
  usersLast7Days: number;
  usersLast30Days: number;
  callVolume: number;
  emailVolume: number;
}

interface Props {
  stats: PlatformStats;
}

export function PlatformSummaryStats({ stats }: Props) {
  const cards = [
    {
      title: "Organizations",
      value: stats.totalOrgs,
      icon: Building2,
      color: "text-primary",
      sub: `${stats.activeOrgs} active`,
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-500",
      sub: `across all organizations`,
    },
    {
      title: "Active Today",
      value: stats.usersLast1Day,
      icon: UserCheck,
      color: stats.usersLast1Day > 0 ? "text-green-500" : "text-muted-foreground",
      sub: `${stats.usersLast7Days} this week`,
    },
    {
      title: "Active 30 Days",
      value: stats.usersLast30Days,
      icon: Activity,
      color: stats.usersLast30Days > 0 ? "text-emerald-500" : "text-muted-foreground",
      sub: `${stats.totalContacts.toLocaleString()} contacts`,
    },
    {
      title: "Call Volume",
      value: stats.callVolume.toLocaleString(),
      icon: PhoneCall,
      color: "text-orange-500",
      sub: "total calls logged",
    },
    {
      title: "Email Volume",
      value: stats.emailVolume.toLocaleString(),
      icon: Mail,
      color: "text-violet-500",
      sub: "total emails sent",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.title} className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <card.icon className={`h-5 w-5 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{card.value}</div>
            <p className="mt-1 text-xs text-muted-foreground">{card.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
