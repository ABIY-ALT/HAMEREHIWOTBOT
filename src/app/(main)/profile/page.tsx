"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/hooks/use-i18n";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { AtSign, Building, Pencil, Phone, User } from "lucide-react";

export default function ProfilePage() {
  const { t } = useI18n();
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');
  const user = {
    name: "John Doe",
    phone: "(123) 456-7890",
    department: "Engineering",
    location: "New York Office"
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">{t('profile.title')}</h1>
      <Card className="max-w-2xl">
        <CardHeader className="sm:flex-row sm:items-start sm:gap-4">
            <Avatar className="size-24 border-4 border-primary">
                {userAvatar && <AvatarImage src={userAvatar.imageUrl} data-ai-hint={userAvatar.imageHint} />}
                <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription>{user.department}</CardDescription>
            </div>
            <Button variant="outline" size="icon">
                <Pencil className="h-4 w-4" />
                <span className="sr-only">{t('profile.edit')}</span>
            </Button>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
                <Phone className="size-5 text-muted-foreground" />
                <span className="text-muted-foreground">{t('profile.phone')}:</span>
                <span className="font-medium">{user.phone}</span>
            </div>
            <div className="flex items-center gap-4">
                <Building className="size-5 text-muted-foreground" />
                <span className="text-muted-foreground">{t('profile.location')}:</span>
                <span className="font-medium">{user.location}</span>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
