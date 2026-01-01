interface ProfileCreationFormProps {
  className?: string
  onProfileCreation: (profileId: number) => void
}

interface ProfileCreationValue {
  id: number
  name: string
}

interface StudentProfileCreationValues {
  institute: ProfileCreationValue | null
  group: ProfileCreationValue | null
}

export type { ProfileCreationFormProps, StudentProfileCreationValues }
