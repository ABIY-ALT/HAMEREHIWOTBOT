"use client"

import { useState } from "react"
import { MapPin, LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/hooks/use-i18n"

export function AttendanceButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { t } = useI18n()

  const handleAttendance = () => {
    setIsLoading(true)
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: t('toast.geolocationNotSupported.title'),
        description: t('toast.geolocationNotSupported.description'),
      })
      setIsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        // Mock API call to save attendance
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        console.log("Attendance recorded at:", { latitude, longitude })

        toast({
          title: t('toast.attendanceRecorded.title'),
          description: t('toast.attendanceRecorded.description'),
        })
        setIsLoading(false)
      },
      (error) => {
        console.error("Geolocation error:", error)
        let description = t('toast.geolocationError.description.default')
        if (error.code === error.PERMISSION_DENIED) {
            description = t('toast.geolocationError.description.permissionDenied')
        }
        
        toast({
          variant: "destructive",
          title: t('toast.geolocationError.title'),
          description: description,
        })
        setIsLoading(false)
      }
    )
  }

  return (
    <Button
      size="lg"
      className="w-full text-lg py-8 transform transition-transform duration-150 active:scale-[0.98]"
      onClick={handleAttendance}
      disabled={isLoading}
    >
      {isLoading ? (
        <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <MapPin className="mr-2 h-5 w-5" />
      )}
      {isLoading ? t('attendanceButton.recording') : t('attendanceButton.attend')}
    </Button>
  )
}
