import React from "react";
import {
  Box,
  Image,
  Text,
  HStack,
  Tag,
  Button,
  // useColorMode,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { CardTitle } from "../ui/card";
import { ExternalLink, Github } from "lucide-react";

interface Props {
  title: string;
  description: string;
  images?: string[];
  video?: string;
  tags?: string[];
  siteLink?: string;
  github?: string;
}

const ProjectSecCard: React.FC<Props> = ({
  title,
  description,
  images,
  video,
  tags,
  siteLink,
  github: sourceLink,
}) => {
  // const { colorMode } = useColorMode();

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.002 }}
    >
      <Box
        borderRadius={16}
        overflow="clip"
        // bg={"red"}
        minW={"250px"}
        maxW={"500px"}
        bgColor={"#FFfFFF"}
        boxShadow="lg"
        _hover={{ transform: "scale(1.002)", transition: "0.3s ease" }}
      >
        {video ? (
          <video controls style={{ width: "100%", height: "300px" }}>
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : images && images.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={image}
                  alt={`${title} Image ${index + 1}`}
                  w="100%"
                  h="300px"
                  objectFit="contain"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : null}

        <Box p={4}>
          <CardTitle className="group-hover:text-yellow-600 transition-colors">
            {title}
          </CardTitle>
          {/* <Heading size="md" mb={2}>
          </Heading> */}
          <Text mb={4}>{description}</Text>

          {/* Tags */}
          <HStack gap={2} mb={4} flexWrap="wrap">
            {tags?.map((tag, index) => (
              <Tag.Root key={index} size="sm" colorScheme="blue">
                <Tag.Label>{tag}</Tag.Label>
                <Tag.CloseTrigger />
              </Tag.Root>
            ))}
          </HStack>

          {/* Links */}
          <div className="flex gap-2">
            <Button
              onClick={() => window.open(sourceLink, "_blank")}
              className="flex items-center"
              variant="outline"
              borderColor="gray.300"
              borderWidth={1}
              padding={2}
              _hover={{ borderColor: "gray.500" }}
              _active={{ borderColor: "gray.700" }}
              _focus={{ boxShadow: "outline" }}
              size="sm"
            >
              <Github className="mr-2 h-4 w-4" />
              Code
            </Button>
            <Button
              onClick={() => window.open(siteLink, "_blank")}
              className="flex items-center"
              variant="outline"
              borderColor="gray.300"
              borderWidth={1}
              padding={2}
              _hover={{ borderColor: "gray.500" }}
              _active={{ borderColor: "gray.700" }}
              _focus={{ boxShadow: "outline" }}
              size="sm"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Demo
            </Button>
          </div>
          {/* <HStack gap={4}>
            {sourceLink && (
              <Link
                href={sourceLink}
                // isExternal
                color="blue.400"
              >
                <BsGithub fontSize={"20px"} />
              </Link>
            )}
            {siteLink && (
              <Link
                href={siteLink}
                // isExternal
                color="blue.400"
              >
                <GrLink fontSize={"24px"} />
              </Link>
            )}
          </HStack> */}
        </Box>
      </Box>
    </motion.div>
  );
};

export default ProjectSecCard;
