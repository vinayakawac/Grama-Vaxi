'use client'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { updateAnimal } from '@/lib/firestore/animals'
import { toast } from 'sonner'
import type { Animal } from '@/types'

const animalSchema = z.object({
  species: z.enum(['COW', 'GOAT', 'SHEEP']),
  breed: z.string().min(1, 'Breed is required'),
  ownerName: z.string().min(1, 'Owner name is required'),
  village: z.string().min(1, 'Village is required'),
})

type AnimalFormValues = z.infer<typeof animalSchema>

interface AnimalEditSlideOverProps {
  animal: Animal | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AnimalEditSlideOver({
  animal,
  open,
  onOpenChange,
  onSuccess,
}: AnimalEditSlideOverProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AnimalFormValues>({
    resolver: zodResolver(animalSchema),
  })

  useEffect(() => {
    if (animal) {
      reset({
        species: animal.species,
        breed: animal.breed,
        ownerName: animal.ownerName,
        village: animal.village,
      })
    }
  }, [animal, reset])

  const onSubmit = async (data: AnimalFormValues) => {
    if (!animal) return
    setIsSubmitting(true)
    try {
      await updateAnimal(animal.id, data)
      toast.success('Animal record updated')
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to update record')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit Animal Record</SheetTitle>
          <SheetDescription>
            Update details for animal ID: {animal?.id}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="species">Species</Label>
              <Select
                defaultValue={animal?.species}
                onValueChange={(val: any) => setValue('species', val ?? '')}
              >
                <SelectTrigger id="species">
                  <SelectValue placeholder="Select species" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COW">Cow</SelectItem>
                  <SelectItem value="GOAT">Goat</SelectItem>
                  <SelectItem value="SHEEP">Sheep</SelectItem>
                </SelectContent>
              </Select>
              {errors.species && (
                <p className="text-xs text-destructive">{errors.species.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed">Breed</Label>
              <Input id="breed" {...register('breed')} />
              {errors.breed && (
                <p className="text-xs text-destructive">{errors.breed.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input id="ownerName" {...register('ownerName')} />
              {errors.ownerName && (
                <p className="text-xs text-destructive">{errors.ownerName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="village">Village</Label>
              <Input id="village" {...register('village')} />
              {errors.village && (
                <p className="text-xs text-destructive">{errors.village.message}</p>
              )}
            </div>
          </div>

          <SheetFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-grama hover:bg-grama-dark text-white">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
