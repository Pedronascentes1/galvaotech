import { useProducts } from "../context/ProductContext"
import ProductCard from "../components/ProductCard"
import ProductSkeleton from "../components/ProductSkeleton"

export default function ProductsGrid() {

  const { products, loading } = useProducts()

  const filteredProducts = products

  return (

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

      {loading
        ? Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))

        : filteredProducts.map(product => (

            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              category={product.category}
              price={product.price}
              discountPrice={product.discountPrice}
              image={product.image}
              availability={product.availability}
            />

        ))
      }

    </div>

  )
}