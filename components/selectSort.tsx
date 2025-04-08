import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
interface SortSelectProps {
    defaultValue?: string
    onSortChange: (value: string) => void
  }
  
  export default function SortSelect({ defaultValue = "featured", onSortChange }: SortSelectProps) {
    return (
      <Select defaultValue={defaultValue} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sắp xếp theo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="featured">Nổi bật</SelectItem>
          <SelectItem value="newest">Mới nhất</SelectItem>
          <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
          <SelectItem value="price-desc">Giá: Cao đến thấp</SelectItem>
          <SelectItem value="name-asc">Tên: A-Z</SelectItem>
          <SelectItem value="name-desc">Tên: Z-A</SelectItem>
        </SelectContent>
      </Select>
    )
  }