"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AttendanceButton } from "@/components/attendance-button"
import { CurrentDate } from "@/components/current-date"
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useI18n } from "@/hooks/use-i18n";


export default function HomePage() {
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');
  const { t } = useI18n();

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader>
            <div className="flex justify-center mb-4">
               <Avatar className="size-24 border-4 border-primary">
                {userAvatar && <AvatarImage src={userAvatar.imageUrl} data-ai-hint={userAvatar.imageHint} />}
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-3xl font-headline">{t('home.welcome', { name: 'John Doe' })}</CardTitle>
            <CardDescription>
              <CurrentDate />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              {t('home.prompt')}
            </p>
            <AttendanceButton />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
