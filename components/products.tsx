import React from "react";
import ProductCard from "./ProductCard";

const products = [
  {
    id: 3,
    title: "Portfolio for Elshaday Mulugeta, CPA",
    description:
      "A professional and clean portfolio website for a certified public accountant, showcasing their skills and experience.",
    images: [
      "/ProjectsImage/elsh-1.png",
      "/ProjectsImage/elsh-2.png",
      "/ProjectsImage/elsh-3.png",
      "/ProjectsImage/elsh-4.png",
      "/ProjectsImage/elsh-5.png",
      "/ProjectsImage/elsh-6.png",
      "/ProjectsImage/elsh-7.png",
    ],
    tags: ["Next.js", "Tailwind CSS", "Accounting", "Portfolio"],
    siteLink: "https://elshaday-portfolio.netlify.app/",
    // github: "#",
  },
  {
    id: 4,
    title: "Kalkidan Gebrewahid's Financial Hub",
    description:
      "A modern and interactive portfolio for a financial analyst, including a blog and resource section.",
    images: [
      "/ProjectsImage/kal-1.png",
      "/ProjectsImage/kal-2.png",
      "/ProjectsImage/kal-3.png",
      "/ProjectsImage/kal-4.png",
      "/ProjectsImage/kal-5.png",
      "/ProjectsImage/kal-6.png",
      "/ProjectsImage/kal-8.png",
    ],
    tags: ["React", "Vite", "Finance", "Portfolio", "CMS"],
    siteLink: "https://kalkidan-portfolio.netlify.app/",
    // github: "#",
  },
  {
    id: 1,
    title: "መዝገበ ቅዳሴ (Mezgebe Kdase)",
    description:
      "A modern Liturgy hymn learning platform for Ethiopian Orthodox Tewahedo Church",
    video: "/ProjectsImage/mezgeb_kdase_web_final.mp4",
    tags: ["React", "Chakra-UI", "Netlify"],
    siteLink: "https://mezgeb-kdase.netlify.app/",
    // github: "https://github.com/yabulala432/zema-web-react/",
  },
  {
    id: 2,
    title: "መዝገበ ስብሐት (Mezgebe Sbhat)",
    description:
      "An Ethiopian Orthodox Tewahdo Hymn learning android mobile app.",
    video: "/ProjectsImage/mezgebe_sbhat.mp4",
    tags: ["Flutter", "Dart", "Mobile App"],
    siteLink:
      "https://docs.google.com/uc?export=download&id=1SoQtazi1zZqzWROr_YeSugRAEx0PxSqZ",
    // github: "https://github.com/yabulala432/mezgebe_sbhat",
  },
];

const Products: React.FC = () => {
  return (
    <div className="px-5 md:px-24 lg:px-48 pt-8 pb-5 md:pb-12">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-gray-800 tracking-tight">
          My Digital Creations
        </h2>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          Here are a couple of products I've built. These are passion projects
          that allowed me to explore new technologies and solve real-world
          problems.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            title={product.title}
            description={product.description}
            video={product.video}
            images={product.images}
            tags={product.tags}
            siteLink={product.siteLink}
          />
        ))}
      </div>
    </div>
  );
};

export default Products;
