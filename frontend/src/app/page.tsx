import ItemCard from "./components/ItemCard/ItemCard";
import CompactSlider from "./components/CompactSlider/CompactSlider";
import Slider from "./components/PromoSlider/PromoSlider";
import CategoriesSection from "./components/CategoriesSection/CategoriesSection";
import Newsletter from "./components/Newsletter/Newsletter";
import TopRatedProducts from "./components/TopRatedProducts/TopRatedProducts";
import HighestDiscountProducts from "./components/HighestDiscountProducts/HighestDiscountProducts";
export default function Home() {
  const endDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return (
    <>
      <main className="container mx-auto px-4">
        <Slider />
        <CategoriesSection />
        <CompactSlider endDate={endDate} />
        <TopRatedProducts />
        <Newsletter />
        <HighestDiscountProducts/>
      </main>

    </>
    

  );
}
