"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { mockAttendanceHistory } from "@/lib/mock-data"
import Link from "next/link"
import { MapPin } from "lucide-react"
import { useI18n } from "@/hooks/use-i18n";

export default function HistoryPage() {
  const { t } = useI18n();
  const history = mockAttendanceHistory;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('history.title')}</CardTitle>
        <CardDescription>
          {t('history.description', { count: history.length })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('history.table.date')}</TableHead>
                <TableHead>{t('history.table.time')}</TableHead>
                <TableHead className="text-right">{t('history.table.location')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.timestamp.toLocaleDateString()}</TableCell>
                  <TableCell>{record.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link 
                        href={`https://www.google.com/maps?q=${record.location.latitude},${record.location.longitude}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View location for attendance on ${record.timestamp.toLocaleDateString()}`}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        {t('history.table.viewOnMap')}
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
