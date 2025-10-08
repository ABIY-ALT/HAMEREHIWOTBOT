"use client"

import { useState } from "react"
import { MapPin, LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function AttendanceButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAttendance = () => {
    setIsLoading(true)
    if (!navigator.geolocation) {
      toast({
        variant: "destructive",
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation.",
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
          title: "Attendance Recorded!",
          description: "Your attendance has been successfully recorded for today.",
        })
        setIsLoading(false)
      },
      (error) => {
        console.error("Geolocation error:", error)
        let description = "Could not get your location. Please try again."
        if (error.code === error.PERMISSION_DENIED) {
            description = "Location access denied. Please enable location services in your browser settings and try again."
        }
        
        toast({
          variant: "destructive",
          title: "Geolocation Error",
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
      {isLoading ? "Recording..." : "I'm Attending"}
    </Button>
  )
}
