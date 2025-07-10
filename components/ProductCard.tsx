import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface ProductCardProps {
  title: string;
  description: string;
  video?: string;
  images?: string[];
  tags?: string[];
  siteLink?: string;
  github?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  video,
  images,
  tags,
  siteLink,
  github,
}) => {
  return (
    <motion.div
      className="bg-white/50 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
      whileHover={{ y: -5 }}
    >
      <div className="relative h-64">
        {video ? (
          <video
            className="w-full h-full object-cover"
            src={video}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : images && images.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            className="w-full h-full"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`${title} screenshot ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="w-full h-full bg-gray-200" />
        )}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
        <div className="absolute bottom-0 left-0 p-6">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {tags?.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-yellow-200 text-yellow-800 text-sm font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-4">
          {github && (
            <Button
              onClick={() => window.open(github, "_blank")}
              variant="outline"
              className="flex-1"
            >
              <Github className="mr-2 h-4 w-4" />
              Source Code
            </Button>
          )}
          {siteLink && (
            <Button
              onClick={() => window.open(siteLink, "_blank")}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Product
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
