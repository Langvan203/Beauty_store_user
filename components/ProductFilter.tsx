// ProductFilters.tsx
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { ArrowDown, ChevronRight, Filter, ShoppingBag, Star } from "lucide-react"
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import React, { useEffect, useMemo, useState } from "react"
import { useFilterData } from "@/app/context/FilterDataContext"

interface Filters {
  categories: number[]
  brands: number[]
  priceRange: [number, number]
}

interface ProductFiltersProps {
  onFilterChange: (filters: Filters) => void
}

export default function ProductFilters({ onFilterChange }: ProductFiltersProps) {
  const { categories, brands } = useFilterData();
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([0, 5000000])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [selectedBrands, setSelectedBrands] = useState<number[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000])
  const [debouncedPriceRange, setDebouncedPriceRange] = useState<[number, number]>(priceRange)
  const [expanded, setExpanded] = useState(false)
  const visibleBrands = expanded ? brands : brands.slice(0, 4)
  const pathname = usePathname();
  const isBrandPage = pathname.startsWith("/brand/");
  const isCategoryPage = pathname.startsWith("/category/");
  // Debounce cho slider giá
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPriceRange(priceRange)
      updateFilters({ priceRange })
    }, 2000)
    return () => clearTimeout(timer)
  }, [priceRange])

  // Hàm cập nhật filter
  const updateFilters = (changed: Partial<Filters>) => {
    onFilterChange({
      categories: selectedCategories,
      brands: selectedBrands,
      priceRange: changed.priceRange || debouncedPriceRange,
      ...changed,
    })
  }
  // Xử lý thay đổi danh mục
  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    const updated = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter(id => id !== categoryId);
    setSelectedCategories(updated);
    updateFilters({ categories: updated });
  }

  // Xử lý thay đổi thương hiệu
  const handleBrandChange = (brandId: number, checked: boolean) => {
    const updated = checked  
      ? [...selectedBrands, brandId]
      : selectedBrands.filter(id => id !== brandId);
    setSelectedBrands(updated);
    updateFilters({ brands: updated });
  }

  // Xử lý thay đổi giá từ slider và input
  const handlePriceChange = (val: [number, number]) => {
    setTempPriceRange(val)
  }

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value.replace(/[^0-9]/g, ""))
    setTempPriceRange([value, tempPriceRange[1]])
  }

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value.replace(/[^0-9]/g, ""))
    setTempPriceRange([tempPriceRange[0], value])
  }

  const handleMinInputBlur = () => {
    setPriceRange([debouncedPriceRange[0], priceRange[1]])
  }

  const handleMaxInputBlur = () => {
    setPriceRange([priceRange[0], debouncedPriceRange[1]])
  }

  const applyPriceFilter = () => {
    onFilterChange({
      categories: selectedCategories,
      brands: selectedBrands,
      priceRange: tempPriceRange,
    })
  }

  function formatCurrency(num: number): string {
    return num.toLocaleString("vi-VN") + "₫"
  }

  return (
    <div className="space-y-6">
      {/* Danh mục */}
      {!isCategoryPage && (
        <>
          <div>
            <h3 className="font-medium mb-4">Danh mục</h3>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category.categoryID} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.categoryID}`}
                    onCheckedChange={(checked: any) => handleCategoryChange(category.categoryID, checked as boolean)}
                  />
                  <Label htmlFor={`category-${category.categoryID}`} className="text-sm cursor-pointer">
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}


      <Separator />

      {/* Thương hiệu */}
      {!isBrandPage && (
        <>
          <div>
            <h3 className="font-medium mb-3">Thương hiệu</h3>
            <div className="space-y-3">
              {visibleBrands.map((brand) => (
                <div key={brand.brandID} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand.brandID}`}
                    onCheckedChange={(checked: any) => handleBrandChange(brand.brandID, checked as boolean)}
                  />
                  <Label htmlFor={`brand-${brand.brandID}`} className="text-sm cursor-pointer">
                    {brand.name}
                  </Label>
                </div>
              ))}
            </div>
            {brands.length > 4 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 flex items-center text-blue-500 focus:outline-none"
              >
                <span className="text-sm text-pink-400">{expanded ? "Ẩn bớt" : "Xem thêm"}</span>
                <ArrowDown
                  className={`ml-2 mt-1 h-4 w-4 transition-transform duration-200 text-pink-400 ${expanded ? "rotate-180" : ""}`}
                />
              </button>
            )}
          </div>

          <Separator />
        </>
      )}

      {/* Giá */}
      <div>
        <h3 className="font-medium mb-4">Giá</h3>
        <div className="space-y-4">
          <Slider
            value={tempPriceRange}
            onValueChange={(val: any) => handlePriceChange(val as [number, number])}
            min={0}
            max={5000000}
            step={100000}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm">0₫</span>
            <span className="text-sm">5.000.000₫</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <Label htmlFor="min-price" className="text-xs">Từ</Label>
              <Input
                id="min-price"
                value={formatCurrency(tempPriceRange[0])}
                onChange={handleMinInputChange}
                onBlur={handleMinInputBlur}
                placeholder="0₫"
                className="h-8"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="max-price" className="text-xs">Đến</Label>
              <Input
                id="max-price"
                value={formatCurrency(tempPriceRange[1])}
                onChange={handleMaxInputChange}
                onBlur={handleMaxInputBlur}
                placeholder="5.000.000₫"
                className="h-8"
              />
            </div>
          </div>
          <Button onClick={applyPriceFilter} size="sm" className="w-full bg-pink-500 hover:bg-pink-600">
            Áp dụng
          </Button>
        </div>
      </div>

      <Separator />

      <Button variant="outline" size="sm" className="w-full">
        Xóa bộ lọc
      </Button>
    </div>
  )
}
