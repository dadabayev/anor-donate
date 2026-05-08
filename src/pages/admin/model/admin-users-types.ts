export interface AdminUsersItemDto {
  userId: number
  username: string
  name: string
  channel: string | null
  phone: string | null
  status: number
}

export interface AdminUsersListDto {
  items: AdminUsersItemDto[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  hasNext: boolean
}
