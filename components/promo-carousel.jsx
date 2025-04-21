"use client"

import { useCallback } from "react"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const promoItems = [
  {
    id: 1,
    title: "Healthy salad",
    subtitle: "For busy people",
    image: "/assets/healthy_salad.svg",
    bgColor: "bg-purple-50",
  },
  {
    id: 2,
    title: "Fresh smoothie",
    subtitle: "Boost your energy",
    image: "/assets/healthy_smoothie.jpg",
    bgColor: "bg-green-50",
  },
  {
    id: 3,
    title: "Protein bowl",
    subtitle: "For fitness lovers",
    image: "/assets/protein_bowl.jpg",
    bgColor: "bg-orange-50",
  },
  {
    id: 4,
    title: "Detox juice",
    subtitle: "Cleanse your body",
    image: "/assets/detox_juice.jpg",
    bgColor: "bg-blue-50",
  },
]

export function PromoCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className="relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <button onClick={scrollPrev} className="p-1 rounded-full bg-white shadow-md ml-1" aria-label="Previous slide">
          <ChevronLeft className="w-5 h-5 text-purple-700" />
        </button>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {promoItems.map((item) => (
            <div key={item.id} className="flex-[0_0_85%] min-w-0 pl-4 pr-4 first:pl-4 last:pr-4">
              <div className={`${item.bgColor} rounded-3xl p-4 flex items-center`}>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">{item.title}</h3>
                  <p className="text-lg">{item.subtitle}</p>
                  <button className="mt-2 px-4 py-2 bg-purple-500 text-white rounded-full text-sm">
                    View Our Menu
                  </button>
                </div>
                <div className="w-1/3">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    width={120}
                    height={120}
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        <button onClick={scrollNext} className="p-1 rounded-full bg-white shadow-md mr-1" aria-label="Next slide">
          <ChevronRight className="w-5 h-5 text-purple-700" />
        </button>
      </div>
    </div>
  )
}
