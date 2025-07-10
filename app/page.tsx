"use client";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Github, Linkedin, Mail, Download, Send } from "lucide-react";
import ADHDDuck from "@/components/adhd-duck";
import Projects from "@/components/projects";
import Products from "@/components/products";

export default function Portfolio() {
  // const [soundEnabled, setSoundEnabled] = useState(false);
  const [duckMode, setDuckMode] = useState("normal");
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [keySequence, setKeySequence] = useState("");
  const heroRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  // Easter egg detection
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const newSequence = (keySequence + e.key?.toLowerCase()).slice(-5);

      setKeySequence(newSequence);

      if (newSequence === "quack") {
        console.log("quack");
        setShowEasterEgg(true);
        setDuckMode("army");
        setTimeout(() => {
          setShowEasterEgg(false);
          setDuckMode("normal");
        }, 5000);
      } else if (newSequence.includes("egg")) {
        console.log("yeah");
        setShowEasterEgg(true);
        setDuckMode("egg");
        setTimeout(() => {
          setShowEasterEgg(false);
          setDuckMode("normal");
        }, 5000);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [keySequence]);

  // const projects = [
  //   // {
  //   //   // Mezgebe Kdase in amharic = መዝገበ ቅዳሴ
  //   //   title: "መዝገበ ቅዳሴ (Mezgebe Kdase)",
  //   //   description:
  //   //     "A modern Liturgy hymn learning platform for Ethiopian Orthodox Tewahedo Church",
  //   //   tech: ["React", "Chakra-UI", "Netlify"],
  //   //   github: "https://github.com/yabulala432/zema-web-react/",
  //   //   demo: "https://mezgeb-kdase.netlify.app/",
  //   // },
  //   {
  //     title: "Pharmacy Management System",
  //     description: "Comprehensive solution for managing pharmacy operations",
  //     tech: ["Java", "MySQL"],
  //     github: "https://github.com/yabulala432/PharmacyManagementSystemNewUI",
  //     demo: "https://github.com/yabulala432/PharmacyManagementSystemNewUI",
  //   },
  //   {
  //     title: "Multi-Tenant Bus-Aggregator Platform",
  //     description:
  //       "A complex platform for managing multiple bus companies and their operations",
  //     tech: [
  //       "React",
  //       "Node.js",
  //       "Express",
  //       "MongoDB",
  //       "Docker",
  //       "Flutter",
  //       "JWT",
  //       "Tailwind CSS",
  //       "TypeScript",
  //       "Microservices",
  //     ],
  //     github: "https://github.com/yabulala432/bus-aggregator-platform",
  //     demo: "https://github.com/yabulala432/bus-aggregator-platform",
  //   },
  // ];

  // Add these states for form data and submission status
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("idle");
    try {
      const res = await fetch("https://formspree.io/f/xqabezqn", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(e.currentTarget),
      });
      if (res.ok) {
        setFormStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" }); // Clear form
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  return (
    // wrap with chakra provider
    <ChakraProvider value={defaultSystem}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 relative overflow-hidden">
        <ADHDDuck />

        {/* Easter Egg Army */}
        {showEasterEgg && duckMode === "army" && (
          <div className="fixed inset-0 pointer-events-none z-40">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: "1s",
                }}
              >
                🦆
              </div>
            ))}
          </div>
        )}

        {/* egg emoji showing */}
        {showEasterEgg && duckMode === "egg" && (
          <div className="fixed inset-0 pointer-events-none z-40">
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: "1s",
                  }}
                >
                  🥚
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section
          ref={heroRef}
          className="min-h-screen flex items-center justify-center px-4 relative"
        >
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8 relative">
              <h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-4 animate-fade-in">
                Yeabsira Yonas
              </h1>
              <div className="text-2xl md:text-3xl text-gray-600 mb-6">
                Full-Stack Developer & Duck Whisperer
              </div>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                Crafting digital experiences with the energy of a caffeinated
                duck. Specializing in React, Node.js, Flutter and creating
                chaos... I mean, innovative solutions.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <a
                href="/resume.pdf"
                download={true}
                // target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
              >
                <Button
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Resume
                </Button>
              </a>
              <Button
                onClick={() => {
                  contactRef.current?.scrollIntoView({ behavior: "smooth" });
                }}
                variant="outline"
                size="lg"
              >
                <Mail className="mr-2 h-5 w-5" />
                Get In Touch
              </Button>
            </div>

            <div className="flex justify-center gap-6">
              <Button
                variant="ghost"
                size="icon"
                className="hover:scale-110 transition-transform"
                onClick={() => {
                  window.open("https://github.com/yabulala432", "_blank");
                }}
              >
                <Github className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:scale-110 transition-transform"
                onClick={() => {
                  window.open(
                    "https://www.linkedin.com/in/yeabsira-yonas",
                    "_blank"
                  );
                }}
              >
                <Linkedin className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:scale-110 transition-transform"
                onClick={() => {
                  // mail to yabulala432@gmail.com
                  window.location.href = "mailto:yabulala432@gmail.com";
                }}
              >
                <Mail className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:scale-110 transition-transform"
                onClick={() => {
                  // mail to yabulala432@gmail.com
                  window.open("https://t.me/fkureyohanns", "_blank");
                }}
              >
                <Send className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-24 bg-gradient-to-b from-yellow-50 to-blue-100">
          <Products />
        </section>

        {/* Projects Section */}
        <section
          ref={projectsRef}
          className="py-20 px-4 bg-white/50 backdrop-blur-sm"
        >
          <div
            className="max-w-8xl mx-auto
          flex flex-col items-center justify-center text-center
          "
          >
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Featured Projects
            </h2>
            <Projects />
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12 text-gray-800">
              Skills & Technologies
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                "JavaScript",
                "TypeScript",
                "React",
                "Next.js",
                "Node.js",
                "Python",
                "PostgreSQL",
                "MongoDB",
                "AWS",
                "Docker",
                "Git",
                "Figma",
              ].map((skill, index) => (
                <div
                  key={index}
                  className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="text-lg font-semibold text-gray-700">
                    {skill}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          ref={contactRef}
          className="py-20 px-4 bg-gradient-to-r from-yellow-100 to-blue-100"
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
              Let's Work Together!
            </h2>

            {/* Easter Egg Hint */}
            <div className="text-center mb-8">
              <span className="inline-block bg-yellow-200 text-yellow-900 px-4 py-2 rounded-full font-medium shadow">
                Pssst... Try typing{" "}
                <span className="font-mono font-bold">quack</span> or{" "}
                <span className="font-mono font-bold">egg</span> anywhere on
                this page for a surprise!
              </span>
            </div>

            <Card className="shadow-xl">
              <CardContent className="p-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Name
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        name="name"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <Input
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        type="email"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Subject
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      type="text"
                      placeholder="Project inquiry"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Message
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Tell me about your project..."
                      rows={5}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                  >
                    Send Message 🦆
                  </Button>
                  {formStatus === "success" && (
                    <div className="text-green-600 text-center mt-4">
                      Message sent successfully!
                    </div>
                  )}
                  {formStatus === "error" && (
                    <div className="text-red-600 text-center mt-4">
                      Something went wrong. Please try again.
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 bg-gray-800 text-white text-center">
          <p>
            &copy; 2025 Yeabsira Yonas. Made with ❤️ and excessive amounts of
            coffee.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Powered by an ADHD duck. No ducks were harmed in the making of this
            portfolio.
          </p>
        </footer>
      </div>
    </ChakraProvider>
  );
}
