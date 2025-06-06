import React from "react";
import { Box, HStack, Tag } from "@chakra-ui/react";
import { motion } from "framer-motion";

interface Props {
  onCategoryChange: (category: string) => void;
}

const ProjectSecCategory: React.FC<Props> = ({ onCategoryChange }) => {
  // const { colorMode } = useColorMode();

  const categories = [
    "All Projects",
    "FrontEnd",
    "Backend",
    "Machine Learning",
    "Mobile",
    "Others",
  ];

  return (
    <Box bg="transparent" borderRadius="none" mb={8}>
      <HStack flexWrap="wrap">
        {categories.map((category) => (
          <motion.div
            key={category}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Tag.Root
              size="lg"
              cursor="pointer"
              onClick={() => onCategoryChange(category)}
              bg={"gray.200"}
              color={"black"}
              _hover={{
                bg: "gray.300",
              }}
            >
              <Tag.Label>{category}</Tag.Label>
              <Tag.CloseTrigger />
            </Tag.Root>
          </motion.div>
        ))}
      </HStack>
    </Box>
  );
};

export default ProjectSecCategory;
