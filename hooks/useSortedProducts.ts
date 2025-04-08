// useSortedProducts.ts
import { useMemo } from "react"
import { ProductDetails, ProductPage, ProductPagnation } from "@/app/types/product"
export default function useSortedProducts(products: ProductPage[], sortValue: string) {
  return useMemo(() => {
    const productsCopy = [...products]
    switch (sortValue) {
      case "newest":
        return productsCopy.sort((a, b) =>
          // @ts-ignore: nếu không có createdDate thì cần bổ sung vào model
          new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        )
      case "price-asc":
        return productsCopy.sort(
          (a, b) =>
            (a.productPrice - a.productPrice * a.productDiscount/100) -
            (b.productPrice - b.productPrice * b.productDiscount/100)
        )
      case "price-desc":
        return productsCopy.sort(
          (a, b) =>
            (b.productPrice - b.productPrice * b.productDiscount/100) -
            (a.productPrice - a.productPrice * a.productDiscount/100)
        )
      case "name-asc":
        return productsCopy.sort((a, b) => a.productName.localeCompare(b.productName))
      case "name-desc":
        return productsCopy.sort((a, b) => b.productName.localeCompare(a.productName))
      default:
        return productsCopy
    }
  }, [products, sortValue])
}
