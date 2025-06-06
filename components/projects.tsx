import React, { useState } from "react";
import { Box, SimpleGrid } from "@chakra-ui/react";
import { motion } from "framer-motion";
import ProjectSecCard from "../components/projectsSec/ProjectSecCard";
import { projects } from "./projectsSec/projectData";

const Projects: React.FC = () => {
  return (
    <Box
      // color={"black"}
      // bgColor={"#FFFFFF"}
      pl={{ base: "20px", md: "200px" }}
      pr={{ base: "20px", md: "100px" }}
      pb={{ base: "20px", md: "50px" }}
      pt={8}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* <ProjectSecCategory onCategoryChange={handleCategoryChange} /> */}
        <SimpleGrid gap={10} columns={{ base: 1, sm: 1, md: 2, lg: 3 }} mt={8}>
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <ProjectSecCard
                title={project.title}
                description={project.description}
                images={project.images}
                video={project.video}
                tags={project.tags}
                siteLink={project.siteLink}
                github={project.github}
              />
            </motion.div>
          ))}
        </SimpleGrid>
      </motion.div>
    </Box>
  );
};

export default Projects;
